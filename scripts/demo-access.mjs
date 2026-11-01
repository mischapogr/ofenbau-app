#!/usr/bin/env node
/**
 * Per-customer access codes for the demo deployments (functions/_middleware.js).
 * Codes live in the DEMO_ACCESS KV namespace (wrangler.toml) as SHA-256 hashes;
 * the plaintext is printed once, when it is created.
 *
 *   npm run demo:access -- add <customer> [--label "Firma GmbH"] [--days 30]
 *   npm run demo:access -- rotate <customer> [--days 30]   # new code, old one stops working
 *   npm run demo:access -- list
 *   npm run demo:access -- remove <customer>                # locks the customer out immediately
 *   npm run demo:access -- setup                            # signing secret → all Pages projects
 *
 * Add --local to work against the local `wrangler pages dev` store instead.
 * <customer> is a short id such as "mueller-ofenbau" (a–z, 0–9, dashes).
 * Needs `wrangler login`; `setup` reads DEMO_SESSION_SECRET from the environment
 * (the owner's .envrc loads it from secrets/ofenbau.enc.env).
 */
import { createHash, randomInt } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no 0/O, 1/I/L
const DEFAULT_DAYS = 30
const GRACE_DAYS = 7 // KV keeps expired entries this long, then deletes them

const args = process.argv.slice(2)
const local = args.includes('--local')
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const positional = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'))
const [command, customer] = positional

const toml = readFileSync(resolve(root, 'wrangler.toml'), 'utf8')
const hosts = (toml.match(/DEMO_HANDOFF_HOSTS\s*=\s*"([^"]*)"/)?.[1] || '')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean)
const projects = hosts.map((h) => h.replace(/\.pages\.dev$/, ''))

function wrangler(params, input) {
  return execFileSync('npx', ['wrangler', ...params], {
    cwd: root,
    input,
    encoding: 'utf8',
    stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
  })
}
const where = local ? ['--local'] : ['--remote']
const kvGet = (key) => {
  try {
    const out = wrangler(['kv', 'key', 'get', key, '--binding', 'DEMO_ACCESS', ...where, '--text'])
    const value = out.trim()
    // wrangler 4 prints "Value not found" (exit 0) for a missing key.
    return value && value !== 'Value not found' ? value : null
  } catch {
    return null
  }
}
const kvPut = (key, value, ttlSeconds) =>
  wrangler([
    'kv',
    'key',
    'put',
    key,
    value,
    '--binding',
    'DEMO_ACCESS',
    ...where,
    ...(ttlSeconds ? ['--ttl', String(ttlSeconds)] : []),
  ])
const kvDelete = (key) => {
  try {
    wrangler(['kv', 'key', 'delete', key, '--binding', 'DEMO_ACCESS', ...where])
  } catch {
    /* already gone */
  }
}

const normalize = (code) => code.toUpperCase().replace(/[^A-Z0-9]/g, '')
const sha256 = (value) => createHash('sha256').update(value).digest('hex')
function newCode() {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  return chars.match(/.{4}/g).join('-')
}

function requireCustomer() {
  if (!customer || !/^[a-z0-9][a-z0-9-]{1,39}$/.test(customer)) {
    console.error(
      'Give a customer id: 2–40 characters, a–z, 0–9 and dashes, e.g. "mueller-ofenbau".'
    )
    process.exit(1)
  }
}

function issue(record) {
  const days = Number(flag('days') || DEFAULT_DAYS)
  if (!(days > 0 && days <= 365)) throw new Error('--days must be between 1 and 365')
  const code = newCode()
  const codeHash = sha256(normalize(code))
  const expires = new Date(Date.now() + days * 86400_000).toISOString()
  const ttl = (days + GRACE_DAYS) * 86400
  const next = {
    label: flag('label') || record?.label || customer,
    created: record?.created || new Date().toISOString(),
    lastLogin: record?.lastLogin || null,
    codeHash,
    expires,
  }
  kvPut(`code:${codeHash}`, customer, ttl)
  kvPut(`customer:${customer}`, JSON.stringify(next), ttl)
  if (record?.codeHash && record.codeHash !== codeHash) kvDelete(`code:${record.codeHash}`)

  console.log(
    `\n${record ? 'New code for' : 'Access for'} ${next.label} (${customer}), valid until ${expires.slice(0, 10)}:\n`
  )
  console.log(`    ${code}\n`)
  console.log('Send the code with one of these links (it works on all of them):')
  for (const host of hosts) console.log(`    https://${host}/`)
  console.log('\nThe code is shown only now — it is stored as a hash.')
}

switch (command) {
  case 'add': {
    requireCustomer()
    if (kvGet(`customer:${customer}`)) {
      console.error(`"${customer}" already exists. Use "rotate ${customer}" for a new code.`)
      process.exit(1)
    }
    issue(null)
    break
  }
  case 'rotate': {
    requireCustomer()
    const raw = kvGet(`customer:${customer}`)
    if (!raw) {
      console.error(`No customer "${customer}". Use "add ${customer}".`)
      process.exit(1)
    }
    issue(JSON.parse(raw))
    break
  }
  case 'remove': {
    requireCustomer()
    const raw = kvGet(`customer:${customer}`)
    if (raw) kvDelete(`code:${JSON.parse(raw).codeHash}`)
    kvDelete(`customer:${customer}`)
    console.log(
      `Removed "${customer}". Their code no longer works; open sessions end on the next page load.`
    )
    break
  }
  case 'list': {
    const keys = JSON.parse(
      wrangler(['kv', 'key', 'list', '--binding', 'DEMO_ACCESS', ...where, '--prefix', 'customer:'])
    )
    if (!keys.length) {
      console.log('No customers.')
      break
    }
    const rows = keys.map(({ name }) => {
      const id = name.slice('customer:'.length)
      const rec = JSON.parse(kvGet(name) || '{}')
      const expired = rec.expires && Date.parse(rec.expires) < Date.now()
      return {
        customer: id,
        label: rec.label || '',
        expires: (rec.expires || '').slice(0, 10) + (expired ? ' (expired)' : ''),
        lastLogin: rec.lastLogin ? rec.lastLogin.slice(0, 16).replace('T', ' ') : 'never',
      }
    })
    console.table(rows)
    console.log(`${rows.length} customer(s).`)
    break
  }
  case 'setup': {
    const secret = process.env.DEMO_SESSION_SECRET
    if (!secret || secret.length < 32) {
      console.error(
        'DEMO_SESSION_SECRET (32+ chars) must be in the environment, e.g. via direnv + sops.'
      )
      process.exit(1)
    }
    for (const project of projects) {
      wrangler(['pages', 'secret', 'put', 'DEMO_SESSION_SECRET', '--project-name', project], secret)
      console.log(`DEMO_SESSION_SECRET set on ${project}`)
    }
    console.log('Redeploy (npm run demo:pages:all) for the secret to take effect.')
    break
  }
  default:
    console.log(
      readFileSync(fileURLToPath(import.meta.url), 'utf8')
        .split('\n')
        .slice(2, 18)
        .map((l) => l.replace(/^ \* ?/, ''))
        .join('\n')
    )
    process.exit(command ? 1 : 0)
}

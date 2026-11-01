#!/usr/bin/env node
/**
 * Guard for demo deploys. A demo build's Impressum and privacy policy name the
 * real operator (src/config/demoOperator.js), so deploying without those
 * details is refused — unless the owner explicitly opts into an invite-only
 * preview:
 *
 *   VITE_DEMO_GATED_WITHOUT_OPERATOR=true   (e.g. in the git-ignored .env.demo.local)
 *
 * The override is accepted only when the target Pages project really is gated:
 * the DEMO_ACCESS KV binding exists in wrangler.toml and the project has the
 * DEMO_SESSION_SECRET secret. It can therefore never publish an open demo
 * without provider identification. Deciding that an invite-only preview may go
 * without a full Impressum is the owner's legal call (see docs/DEMO_PAGES.md).
 *
 *   node scripts/check-demo-operator.mjs <pages-project>   # run by demo:pages:*
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { loadEnv } from 'vite'

const project = process.argv[2]
const env = { ...loadEnv('demo', process.cwd(), 'VITE_'), ...process.env }
const required = [
  'VITE_DEMO_OPERATOR_NAME',
  'VITE_DEMO_OPERATOR_STREET',
  'VITE_DEMO_OPERATOR_CITY',
  'VITE_DEMO_OPERATOR_EMAIL',
]
const missing = required.filter((key) => !String(env[key] || '').trim())

if (!missing.length) {
  console.log(`Demo operator: ${env.VITE_DEMO_OPERATOR_NAME} <${env.VITE_DEMO_OPERATOR_EMAIL}>`)
  process.exit(0)
}

function fail(reason) {
  console.error(
    `Demo deploy blocked: ${reason}\n` +
      `Missing operator details for the Impressum/Datenschutz:\n  ${missing.join('\n  ')}\n` +
      'Set them in .env.demo.local or the encrypted secrets file, or — for an invite-only\n' +
      'preview behind the per-customer gate — set VITE_DEMO_GATED_WITHOUT_OPERATOR=true\n' +
      '(see docs/DEMO_PAGES.md).'
  )
  process.exit(1)
}

if (String(env.VITE_DEMO_GATED_WITHOUT_OPERATOR).toLowerCase() !== 'true') {
  fail('no operator details and no invite-only override.')
}
if (!project) fail('the override needs the Pages project name as argument.')

const toml = readFileSync('wrangler.toml', 'utf8')
if (!/binding\s*=\s*"DEMO_ACCESS"/.test(toml)) {
  fail('the override needs the DEMO_ACCESS KV binding in wrangler.toml (per-customer gate).')
}

let secrets = ''
try {
  secrets = execFileSync(
    'npx',
    ['wrangler', 'pages', 'secret', 'list', '--project-name', project],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  )
} catch (error) {
  fail(`could not read the secrets of "${project}" (${error.message.split('\n')[0]}).`)
}
if (!secrets.includes('DEMO_SESSION_SECRET')) {
  fail(
    `"${project}" has no DEMO_SESSION_SECRET, so it would be open. Run: npm run demo:access -- setup`
  )
}

console.warn(
  `Invite-only deploy of "${project}" without operator details (VITE_DEMO_GATED_WITHOUT_OPERATOR=true).\n` +
    'The per-customer gate is active; the legal pages tell visitors the provider details come with their invitation.'
)

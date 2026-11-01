// Shared helpers for the per-customer demo gate (see docs/DEMO_PAGES.md).
//
// KV layout (binding DEMO_ACCESS), written by scripts/demo-access.mjs:
//   code:<sha256(code)>  → "<customer>"
//   customer:<customer>  → { "codeHash", "label", "created", "expires", "lastLogin" }
// Session cookie:  <subject>.<expiresAtMs>.<hmac("session:" + subject + "." + exp)>
// Handoff token:   <subject>.<expiresAtMs>.<hmac("handoff:" + subject + "." + exp)>
// subject = <customer>~<first 16 hex chars of the customer's code hash>, so a
// rotated code invalidates every session and handoff made with the old one.
export const COOKIE_NAME = 'ofenbau_demo_session'
export const SESSION_TTL_SECONDS = 12 * 60 * 60
export const HANDOFF_TTL_SECONDS = 60

const encoder = new TextEncoder()

const hex = (buffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')

export async function sha256Hex(value) {
  return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
}

async function hmacHex(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(message)))
}

/** Constant-time comparison of two strings (compares fixed-length digests). */
export async function timingSafeEqual(a, b) {
  const [da, db] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(String(a))),
    crypto.subtle.digest('SHA-256', encoder.encode(String(b))),
  ])
  const x = new Uint8Array(da)
  const y = new Uint8Array(db)
  let diff = 0
  for (let i = 0; i < x.length; i += 1) diff |= x[i] ^ y[i]
  return diff === 0
}

/** Codes are typed by people: ignore case, spaces and dashes. */
export function normalizeCode(code) {
  return String(code || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

export async function signToken(purpose, customer, ttlSeconds, secret) {
  const exp = String(Date.now() + ttlSeconds * 1000)
  return `${customer}.${exp}.${await hmacHex(`${purpose}:${customer}.${exp}`, secret)}`
}

/** Returns the customer id if the token is authentic and not expired, else null. */
export async function verifyToken(purpose, token, secret) {
  if (!token || !secret) return null
  const [customer, exp, signature] = String(token).split('.')
  if (!customer || !exp || !signature || Number(exp) < Date.now()) return null
  const expected = await hmacHex(`${purpose}:${customer}.${exp}`, secret)
  return (await timingSafeEqual(signature, expected)) ? customer : null
}

const TAG_LENGTH = 16

/** Session subject for a customer record: binds the session to the current code. */
export function sessionSubject(customer, record) {
  return `${customer}~${String(record.codeHash || '').slice(0, TAG_LENGTH)}`
}

/**
 * The customer's record if it exists, has not expired and — for a session
 * subject — still has the code the session was created with. Accepts a bare
 * customer id (lookups during login) or a `customer~tag` subject (sessions).
 */
export async function activeCustomer(kv, subjectOrCustomer) {
  if (!kv || !subjectOrCustomer) return null
  const [customer, tag] = String(subjectOrCustomer).split('~')
  const record = await kv.get(`customer:${customer}`, 'json')
  if (!record) return null
  if (record.expires && Date.parse(record.expires) < Date.now()) return null
  if (String(subjectOrCustomer).includes('~')) {
    if (!tag || !String(record.codeHash || '').startsWith(tag)) return null
  }
  return record
}

/** Session subjects carry a code tag; a bare id (old cookie format) is never a valid session. */
export function isSessionSubject(subject) {
  return /^[a-z0-9-]+~[0-9a-f]{16}$/.test(String(subject || ''))
}

export function getCookie(request, name) {
  const header = request.headers.get('cookie') || ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return ''
}

export function sessionCookie(token, ttlSeconds = SESSION_TTL_SECONDS) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${ttlSeconds}; HttpOnly; Secure; SameSite=Lax`
}

/** The gate is active only when the KV store and the signing secret are both configured. */
export function gateEnabled(env) {
  return Boolean(env.DEMO_ACCESS && env.DEMO_SESSION_SECRET)
}

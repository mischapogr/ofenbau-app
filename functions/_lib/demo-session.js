// Shared helpers for the per-customer demo gate (see docs/DEMO_PAGES.md).
//
// KV layout (binding DEMO_ACCESS), written by scripts/demo-access.mjs:
//   code:<sha256(code)>  → "<customer>"
//   customer:<customer>  → { "codeHash", "label", "created", "expires", "lastLogin" }
// Session cookie:  <customer>.<expiresAtMs>.<hmac("session:" + customer + "." + exp)>
// Handoff token:   <customer>.<expiresAtMs>.<hmac("handoff:" + customer + "." + exp)>
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

/** The customer's record if it exists and has not expired. */
export async function activeCustomer(kv, customer) {
  if (!kv || !customer) return null
  const record = await kv.get(`customer:${customer}`, 'json')
  if (!record) return null
  if (record.expires && Date.parse(record.expires) < Date.now()) return null
  return record
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

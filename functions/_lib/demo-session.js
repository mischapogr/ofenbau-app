// Shared helpers for the optional server-side demo gate (see docs/SECRETS.md).
// Session token format: `<expiresAtMs>.<hmacSha256Hex(expiresAtMs, secret)>`.
export const COOKIE_NAME = 'ofenbau_demo_session'
export const SESSION_TTL_SECONDS = 12 * 60 * 60

const encoder = new TextEncoder()

async function hmacHex(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))
}

/** Constant-time string comparison (compares fixed-length digests). */
export async function timingSafeEqual(a, b) {
  const [da, db] = await Promise.all([sha256(String(a)), sha256(String(b))])
  let diff = 0
  for (let i = 0; i < da.length; i += 1) diff |= da[i] ^ db[i]
  return diff === 0
}

export async function signSession(secret, ttlSeconds = SESSION_TTL_SECONDS) {
  const expiresAt = String(Date.now() + ttlSeconds * 1000)
  return `${expiresAt}.${await hmacHex(expiresAt, secret)}`
}

export async function verifySession(token, secret) {
  if (!token || !secret) return false
  const [expiresAt, signature] = String(token).split('.')
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false
  return timingSafeEqual(signature, await hmacHex(expiresAt, secret))
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

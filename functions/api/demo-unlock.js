// Cloudflare Pages Function — exchanges a customer's access code for a session cookie.
// Accepts JSON `{ "code": "…" }` (returns JSON) or a form POST (redirects back).
// Codes are looked up by SHA-256 hash in the DEMO_ACCESS KV store; the customer's
// last login is recorded. Pair with a WAF rate-limiting rule on this path.
import {
  activeCustomer,
  gateEnabled,
  normalizeCode,
  sessionCookie,
  sessionSubject,
  sha256Hex,
  signToken,
  SESSION_TTL_SECONDS,
} from '../_lib/demo-session.js'

function safeRedirect(value) {
  const target = String(value || '/')
  return target.startsWith('/') && !target.startsWith('//') ? target : '/'
}

export async function onRequestPost({ request, env, waitUntil }) {
  if (!gateEnabled(env)) return Response.json({ ok: true, gate: 'disabled' })

  const isJson = (request.headers.get('content-type') || '').includes('application/json')
  let code = ''
  let redirect = '/'
  if (isJson) {
    const body = await request.json().catch(() => ({}))
    code = body.code
  } else {
    const form = await request.formData().catch(() => null)
    code = form?.get('code')
    redirect = safeRedirect(form?.get('redirect'))
  }

  const normalized = normalizeCode(code)
  const customer = normalized
    ? await env.DEMO_ACCESS.get(`code:${await sha256Hex(normalized)}`)
    : null
  const record = customer ? await activeCustomer(env.DEMO_ACCESS, customer) : null

  if (!record) {
    if (isJson) {
      return Response.json(
        { ok: false, message: 'Der Zugangscode ist nicht korrekt oder abgelaufen.' },
        { status: 401, headers: { 'cache-control': 'no-store' } }
      )
    }
    const back = new URL(`/demo-gate?error=1&redirect=${encodeURIComponent(redirect)}`, request.url)
    return Response.redirect(back.toString(), 303)
  }

  // Record the login without delaying the response.
  waitUntil(
    env.DEMO_ACCESS.put(
      `customer:${customer}`,
      JSON.stringify({ ...record, lastLogin: new Date().toISOString() })
    )
  )

  const token = await signToken(
    'session',
    sessionSubject(customer, record),
    SESSION_TTL_SECONDS,
    env.DEMO_SESSION_SECRET
  )
  const headers = { 'set-cookie': sessionCookie(token), 'cache-control': 'no-store' }
  if (isJson) return Response.json({ ok: true }, { headers })
  return new Response(null, {
    status: 303,
    headers: { ...headers, location: new URL(redirect, request.url).toString() },
  })
}

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 })
  return Response.json({ message: 'Methode nicht erlaubt.' }, { status: 405 })
}

// Cloudflare Pages Function — exchanges the demo access code for a session cookie.
// Accepts JSON `{ "code": "…" }` (returns JSON) or a form POST (redirects back).
// Pair with a WAF rate-limiting rule on this path in the Cloudflare dashboard.
import { sessionCookie, signSession, timingSafeEqual } from '../_lib/demo-session.js'

function safeRedirect(value) {
  const target = String(value || '/')
  return target.startsWith('/') && !target.startsWith('//') ? target : '/'
}

export async function onRequestPost({ request, env }) {
  if (!env.DEMO_ACCESS_CODE) {
    return Response.json({ ok: true, gate: 'disabled' })
  }

  const contentType = request.headers.get('content-type') || ''
  let code = ''
  let redirect = '/'
  let isJson = contentType.includes('application/json')

  if (isJson) {
    const body = await request.json().catch(() => ({}))
    code = String(body.code || '')
  } else {
    const form = await request.formData().catch(() => null)
    code = String(form?.get('code') || '')
    redirect = safeRedirect(form?.get('redirect'))
  }

  if (!code.trim() || !(await timingSafeEqual(code.trim(), env.DEMO_ACCESS_CODE))) {
    if (isJson) {
      return Response.json(
        { ok: false, message: 'Der Zugangscode ist nicht korrekt.' },
        { status: 401 }
      )
    }
    return Response.redirect(
      new URL(`/demo-gate.html?error=1&redirect=${encodeURIComponent(redirect)}`, request.url),
      303
    )
  }

  const token = await signSession(env.DEMO_SESSION_SECRET || env.DEMO_ACCESS_CODE)
  const headers = { 'set-cookie': sessionCookie(token), 'cache-control': 'no-store' }
  if (isJson) {
    return Response.json({ ok: true }, { headers })
  }
  return new Response(null, {
    status: 303,
    headers: { ...headers, location: new URL(redirect, request.url).toString() },
  })
}

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 })
  return Response.json({ message: 'Methode nicht erlaubt.' }, { status: 405 })
}

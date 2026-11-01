// Cloudflare Pages middleware — optional server-side demo gate.
//
// Active only when the `DEMO_ACCESS_CODE` secret is set on the Pages project
// (`wrangler pages secret put DEMO_ACCESS_CODE --project-name <project>`).
// Without it every request passes through unchanged, so a deployment keeps the
// client-side gate behaviour (VITE_DEMO_ACCESS_CODE_HASH) until you opt in.
//
// With it, unauthenticated HTML requests receive the static gate page
// (public/demo-gate.html) with status 401 and the app bundle is never served;
// other requests get a plain 401. `POST /api/demo-unlock` issues the session cookie.
import { COOKIE_NAME, getCookie, verifySession } from './_lib/demo-session.js'

const PUBLIC_PATHS = new Set(['/api/healthz', '/api/demo-unlock', '/demo-gate.html'])

export async function onRequest({ request, env, next }) {
  const accessCode = env.DEMO_ACCESS_CODE
  if (!accessCode) return next()

  const url = new URL(request.url)
  if (PUBLIC_PATHS.has(url.pathname)) return next()

  const token = getCookie(request, COOKIE_NAME)
  if (await verifySession(token, env.DEMO_SESSION_SECRET || accessCode)) {
    const response = await next()
    const headers = new Headers(response.headers)
    headers.set('cache-control', 'private, no-store')
    headers.set('x-robots-tag', 'noindex, nofollow, noarchive')
    return new Response(response.body, { status: response.status, headers })
  }

  const wantsHtml =
    request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html')
  if (!wantsHtml) {
    return new Response('Unauthorized', { status: 401, headers: { 'cache-control': 'no-store' } })
  }

  const gate = await env.ASSETS.fetch(new URL('/demo-gate.html', request.url))
  return new Response(gate.body, {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow, noarchive',
    },
  })
}

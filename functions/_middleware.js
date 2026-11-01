// Cloudflare Pages middleware — per-customer demo gate.
//
// Active when the project has the DEMO_ACCESS KV binding (wrangler.toml) and the
// DEMO_SESSION_SECRET secret. Otherwise every request passes through unchanged.
//
// Page navigations need a session cookie for a customer that still exists and
// has not expired in KV, so removing a customer (`npm run demo:access -- remove`)
// locks them out on their next page load. Without a valid session the static
// public/demo-gate.html is returned with status 401. Static files (/assets,
// /images, /models, /videos) are excluded via public/_routes.json: the source is
// open anyway, and this keeps them off the daily Functions quota.
import {
  COOKIE_NAME,
  activeCustomer,
  gateEnabled,
  isSessionSubject,
  getCookie,
  sessionCookie,
  signToken,
  verifyToken,
  SESSION_TTL_SECONDS,
} from './_lib/demo-session.js'

const PUBLIC_PATHS = new Set([
  '/api/healthz',
  '/api/demo-unlock',
  '/api/demo-handoff',
  '/demo-gate.html',
  '/demo-gate', // Pages serves /demo-gate.html under this pretty URL
])

const noIndex = { 'x-robots-tag': 'noindex, nofollow, noarchive' }

async function gateResponse(request, env) {
  const wantsHtml =
    request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html')
  if (!wantsHtml) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'cache-control': 'no-store', ...noIndex },
    })
  }
  const gate = await env.ASSETS.fetch(new URL('/demo-gate.html', request.url))
  return new Response(gate.body, {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      ...noIndex,
    },
  })
}

export async function onRequest({ request, env, next }) {
  if (!gateEnabled(env)) return next()

  const url = new URL(request.url)
  if (PUBLIC_PATHS.has(url.pathname)) return next()

  // Arriving from another package's demo with a short-lived handoff token.
  const handoff = url.searchParams.get('demo_handoff')
  if (handoff) {
    const customer = await verifyToken('handoff', handoff, env.DEMO_SESSION_SECRET)
    if (isSessionSubject(customer) && (await activeCustomer(env.DEMO_ACCESS, customer))) {
      url.searchParams.delete('demo_handoff')
      const token = await signToken(
        'session',
        customer,
        SESSION_TTL_SECONDS,
        env.DEMO_SESSION_SECRET
      )
      return new Response(null, {
        status: 303,
        headers: {
          location: url.toString(),
          'set-cookie': sessionCookie(token),
          'cache-control': 'no-store',
        },
      })
    }
  }

  const customer = await verifyToken(
    'session',
    getCookie(request, COOKIE_NAME),
    env.DEMO_SESSION_SECRET
  )
  // API calls only need an authentic session; page loads also re-check KV so a
  // removed or expired customer is locked out without waiting for the cookie.
  const isPage = !url.pathname.startsWith('/api/')
  if (
    isSessionSubject(customer) &&
    (!isPage || (await activeCustomer(env.DEMO_ACCESS, customer)))
  ) {
    const response = await next()
    const headers = new Headers(response.headers)
    headers.set('cache-control', 'private, no-store')
    headers.set('x-robots-tag', noIndex['x-robots-tag'])
    return new Response(response.body, { status: response.status, headers })
  }

  return gateResponse(request, env)
}

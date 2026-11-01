// Cloudflare Pages Function — carries a logged-in visitor to another package's
// demo (Basis ⇄ Premium) without asking for the code again.
//
//   GET /api/demo-handoff?to=https://ofenbau-premium-demo.pages.dev/
//
// `to` must be on a host listed in DEMO_HANDOFF_HOSTS (wrangler.toml). With a
// valid session the visitor is redirected with a 60-second signed token, which
// the target project's middleware exchanges for its own session cookie. Without
// a gate (or without a session) it is a plain redirect.
import {
  COOKIE_NAME,
  activeCustomer,
  gateEnabled,
  isSessionSubject,
  getCookie,
  signToken,
  verifyToken,
  HANDOFF_TTL_SECONDS,
} from '../_lib/demo-session.js'

export async function onRequestGet({ request, env }) {
  const allowed = String(env.DEMO_HANDOFF_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)

  let target
  try {
    target = new URL(new URL(request.url).searchParams.get('to') || '')
  } catch {
    return Response.json({ message: 'Ungültiges Ziel.' }, { status: 400 })
  }
  if (target.protocol !== 'https:' || !allowed.includes(target.hostname.toLowerCase())) {
    return Response.json({ message: 'Ziel nicht erlaubt.' }, { status: 400 })
  }

  if (gateEnabled(env)) {
    const customer = await verifyToken(
      'session',
      getCookie(request, COOKIE_NAME),
      env.DEMO_SESSION_SECRET
    )
    if (isSessionSubject(customer) && (await activeCustomer(env.DEMO_ACCESS, customer))) {
      const token = await signToken(
        'handoff',
        customer,
        HANDOFF_TTL_SECONDS,
        env.DEMO_SESSION_SECRET
      )
      target.searchParams.set('demo_handoff', token)
    }
  }

  return new Response(null, {
    status: 302,
    headers: { location: target.toString(), 'cache-control': 'no-store' },
  })
}

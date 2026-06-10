// Cloudflare Pages Function — health probe (parity with the dev healthz).
export async function onRequest() {
  return Response.json({ ok: true })
}

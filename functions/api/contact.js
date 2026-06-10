// Cloudflare Pages Function — demo contact-form sink.
//
// The demo frontend POSTs to /api/contact and treats any 2xx as success.
// Nothing is delivered here (same outcome as the local Mailpit sink); this
// just satisfies the form's success path on static Pages, where there is no
// `vite preview` proxy. Mirrors the contract of `contactDevApiPlugin` in
// vite.config.js.
export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  if (request.method !== 'POST') {
    return Response.json({ message: 'Methode nicht erlaubt.' }, { status: 405 })
  }

  let payload = {}
  try {
    payload = await request.json()
  } catch (_error) {
    payload = {}
  }

  if (payload.website) {
    return Response.json({ message: 'Diese Anfrage wurde als Spam erkannt.' }, { status: 422 })
  }

  if (!payload.name || !payload.email || !payload.message) {
    return Response.json({ message: 'Bitte füllen Sie alle Pflichtfelder aus.' }, { status: 422 })
  }

  return Response.json({ ok: true })
}

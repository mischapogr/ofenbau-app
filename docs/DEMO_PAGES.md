# Persistent demo on Cloudflare Pages

The **permanent**, always-on way to share the customer demo. Cloudflare Pages
hosts the static `build:demo` output on its edge, so it needs **no domain, no
running container, and no laptop kept on**. You get a free, stable HTTPS URL.

For ad-hoc, throwaway shares from your own machine, see the quick tunnel in
[`DEMO_TUNNEL.md`](./DEMO_TUNNEL.md).

- **Permanent URL:** `https://ofenbau-demo.pages.dev`
- **Access code:** `***REMOVED-DEMO-CODE***`

## One-time setup

```bash
! wrangler login     # opens a browser; a free Cloudflare account is enough
```

(`wrangler` is a dev dependency — `npm install` brings it in. Use `! wrangler login`
so the interactive browser step runs in your shell.)

## Deploy / redeploy — one command

```bash
npm run demo:pages
```

This runs `build:demo` (obfuscated, watermark per `.env.demo`) and uploads `dist/`
to Pages. The **first** run creates the project; every later run ships a new build
to the **same** URL. Wrangler prints the `https://…pages.dev` link when done.

## Why no extra config is needed

- **Access gate:** `DemoProtection.vue` hashes the code with `crypto.subtle`, which
  needs HTTPS. Pages serves HTTPS by default, so the gate works.
- **Host allowlist:** `VITE_DEMO_ALLOWED_HOSTS` only guards Vite's dev/preview server
  DNS-rebinding check. Pages serves pre-built static files — the allowlist is
  irrelevant, so there's nothing to add for `*.pages.dev`.
- **Obfuscation:** `build:demo` runs the obfuscation plugin, so the shipped JS stays
  obfuscated.

## Contact form

The form POSTs to `/api/contact`. On static Pages there is no `vite preview` proxy, so
two **Pages Functions** stand in (auto-bundled by Wrangler, zero config):

- `functions/api/contact.js` — accepts `POST`, returns `{ ok: true }` (success state
  fires); rejects non-POST with 405. **Nothing is delivered** — same as the local
  Mailpit sink.
- `functions/api/healthz.js` — returns `{ ok: true }`.

## Watermark before sharing

`.env.demo` controls `VITE_DEMO_WATERMARK_ENABLED`. It is **on** (`"true"`) for the
customer-facing deploy. If you turn it off for internal review, flip it back and
re-run `npm run demo:pages` before sharing. See memory note `demo-watermark-off-pending`.

## Local check before deploying (optional)

```bash
npm run build:demo
npx wrangler pages dev dist     # serves dist/ + Functions on a local URL
# → unlock with ***REMOVED-DEMO-CODE***, submit the contact form (success), GET /api/healthz → {ok:true}
```

## Security notes

Same as the tunnel: `.env.demo` (incl. the access-code hash) is committed — this is
casual gating, not real security. Treat the demo as semi-public.
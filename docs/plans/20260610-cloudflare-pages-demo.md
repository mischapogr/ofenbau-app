# Persistent free demo on Cloudflare Pages (no own domain)

## Context

Today the customer demo is served from a local Docker stack (`docker-compose.demo.yml`)
behind a Cloudflare **quick tunnel**. Two problems for a "persistent" demo:

- The `*.trycloudflare.com` hostname is **ephemeral** — it changes on every tunnel
  restart (reboot/crash/refresh), as documented in `docs/DEMO_TUNNEL.md`.
- The demo only exists while your machine + Docker are running. Turn off the laptop,
  the demo is down.

A permanent URL via a *named tunnel* requires a domain on Cloudflare — which we don't
have. **Cloudflare Pages** solves this differently: it **hosts the static build on
Cloudflare's edge**, so it needs no domain, no running container, and gives a free,
permanent `https://<project>.pages.dev` URL with HTTPS. This site is a pure static
Vue 3 + Vite build (`npm run build:demo`), so Pages is a natural fit.

Decisions (confirmed with user):
- **Deploy method:** Wrangler direct upload (`wrangler pages deploy dist`) — no GitHub
  dependency, one command to ship.
- **Contact form:** stub a Pages Function returning `{ok:true}` so the form shows its
  success state (nothing delivered — same outcome as the local Mailpit sink).

## Why Pages works here with no extra config

- **Access gate:** `DemoProtection.vue` verifies the code with `crypto.subtle`, which
  requires HTTPS. Pages serves HTTPS by default → gate works. (Plain LAN-IP/http can't,
  same as the tunnel.)
- **Host allowlist:** `VITE_DEMO_ALLOWED_HOSTS` in `.env.demo` only guards Vite's
  dev/preview server DNS-rebinding check. Pages serves pre-built static files, so the
  allowlist is irrelevant there — no need to add `*.pages.dev`.
- **Obfuscation:** `build:demo` already runs the obfuscation plugin (`vite.config.js`),
  so the shipped JS stays obfuscated.

## Changes

### 1. Contact-form stub as a Pages Function
The frontend posts to `/api/contact` (`src/services/contactService.js` →
`httpClient` baseURL `/api`) and treats any 2xx as success. On static Pages there is no
`vite preview` proxy, so add Pages Functions (zero dependencies, auto-deployed with the
upload):

- New `functions/api/contact.js` — handle `POST`, return
  `Response.json({ ok: true })`; reject non-POST with 405. Mirrors the dev plugin's
  contract in `vite.config.js` (`contactDevApiPlugin`) so the form's success path fires.
- New `functions/api/healthz.js` — return `{ ok: true }` (parity with the dev healthz).

These live under `functions/` at repo root; Wrangler bundles them automatically — no
config needed. Submissions go nowhere by design (demo only).

### 2. Wrangler config + deploy script
- Add `wrangler` to `devDependencies` (dev-only; not shipped to the browser).
- Add `wrangler.toml` (or `--project-name` flag) defining the Pages project name, e.g.
  `name = "ofenbau-demo"` → URL `https://ofenbau-demo.pages.dev`.
- Add npm scripts to `package.json`:
  - `"demo:pages": "npm run build:demo && wrangler pages deploy dist --project-name=ofenbau-demo --branch=main"`
  - (first run also creates the project; `wrangler login` is a one-time interactive step
    the user runs via `! wrangler login`.)

### 3. Re-enable the watermark before sharing
Memory note `demo-watermark-off-pending` + `.env.demo` currently has
`VITE_DEMO_WATERMARK_ENABLED="false"` (turned off for review). Flip back to `"true"`
before the production demo deploy, then rebuild. (Confirm timing with user — keep off
if still reviewing.)

### 4. Docs
Update `docs/DEMO_TUNNEL.md` (or add `docs/DEMO_PAGES.md`) to document the Pages flow as
the **persistent** option, keeping the tunnel section for quick ad-hoc shares. Note the
permanent URL, the access code, and `npm run demo:pages` as the one-command redeploy.

## Files

- `functions/api/contact.js` (new)
- `functions/api/healthz.js` (new)
- `wrangler.toml` (new)
- `package.json` (add `wrangler` devDep + `demo:pages` script)
- `.env.demo` (re-enable watermark before the customer-facing deploy)
- `docs/DEMO_TUNNEL.md` / `docs/DEMO_PAGES.md` (document Pages flow)

## Verification

1. **One-time auth:** user runs `! wrangler login` (opens browser, free account).
2. **Build:** `npm run build:demo` → confirm `dist/` is produced and JS is obfuscated.
3. **Local Functions check (optional):** `npx wrangler pages dev dist` → open the local
   URL, unlock with the access code, submit the contact form → success state shows;
   `GET /api/healthz` returns `{ok:true}`.
4. **Deploy:** `npm run demo:pages` → Wrangler prints
   `https://ofenbau-demo.pages.dev`.
5. **End-to-end (Playwright MCP):** navigate to the `.pages.dev` URL → gate appears →
   enter `***REMOVED-DEMO-CODE***` → app unlocks → contact form submit shows success → watermark/
   copyright visible (once re-enabled). Reload to confirm the URL is stable.
6. **Persistence:** the URL stays live with your machine off (hosted on Cloudflare).
   Re-running `npm run demo:pages` ships a new build to the **same** URL.
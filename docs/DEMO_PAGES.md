# Persistent demo on Cloudflare Pages

The permanent, always-on way to share the demo. Cloudflare Pages hosts the
static `build:demo` output on its edge, so it needs no domain, no running
container and no laptop kept on. You get a free, stable HTTPS URL.

For ad-hoc, throwaway shares from your own machine, see the quick tunnel in
[`DEMO_TUNNEL.md`](./DEMO_TUNNEL.md).

- **Projects:** `ofenbau-basis-demo`, `ofenbau-premium-demo` and the generic
  `ofenbau-demo` (see the `demo:pages:*` scripts in `package.json`).
- **Access code:** none. The public demos are open; the code is the same as the
  open-source repo anyway. The notice bar carries a Basis/Premium package switch
  (`VITE_DEMO_URL_BASIS` / `VITE_DEMO_URL_PREMIUM`).
- **Customer previews** with private content get their own Pages project and the
  server-side gate below. The owner's code lives in the encrypted secrets file:
  `sops decrypt secrets/ofenbau.enc.env | grep DEMO_ACCESS_CODE`.

## Operator details (required)

The business on the demo is fictional, so a public demo's Impressum (§ 5 DDG)
and privacy policy name **you** as the operator. Set these once — they are
public on the site but owner-specific, so they don't belong in the open-source
repo:

```bash
VITE_DEMO_OPERATOR_NAME="…"
VITE_DEMO_OPERATOR_STREET="…"
VITE_DEMO_OPERATOR_CITY="PLZ Ort"
VITE_DEMO_OPERATOR_EMAIL="…"
VITE_DEMO_OPERATOR_PHONE=""   # optional
```

Put them in the git-ignored `.env.demo.local`, or (owner) in the encrypted
secrets file via `npm run secrets:edit`. Every `demo:pages:*` script runs
`scripts/check-demo-operator.mjs` first and refuses to deploy without them.

## One-time setup

```bash
! wrangler login     # opens a browser; a free Cloudflare account is enough
```

Alternatively export `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (token
scope: Account → Cloudflare Pages → Edit).

## Deploy / redeploy

```bash
npm run demo:pages:basis      # VITE_TIER=basis   → ofenbau-basis-demo
npm run demo:pages:premium    # VITE_TIER=premium → ofenbau-premium-demo
npm run demo:pages:all        # both + the generic project
```

These builds have no access code. To put the optional client-side code screen
back for a single build, export `VITE_DEMO_ACCESS_CODE_HASH` before building or
put it in the git-ignored `.env.demo.local`.

## Server-side gate (recommended)

Set the secrets once per project and the bundle is no longer served to
unauthenticated visitors — see [`SECRETS.md`](./SECRETS.md#server-side-gate-cloudflare-pages-functions):

```bash
wrangler pages secret put DEMO_ACCESS_CODE    --project-name ofenbau-premium-demo
wrangler pages secret put DEMO_SESSION_SECRET --project-name ofenbau-premium-demo
```

## Contact form

The form POSTs to `/api/contact`. On static Pages there is no `vite preview`
proxy, so Pages Functions stand in (auto-bundled by Wrangler, zero config):

- `functions/api/contact.js` — accepts `POST`, returns `{ ok: true }`; rejects
  non-POST with 405. Nothing is delivered — same as the local Mailpit sink.
- `functions/api/healthz.js` — returns `{ ok: true }`.
- `functions/api/demo-unlock.js` + `functions/_middleware.js` — the optional gate.

## Watermark before sharing

`.env.demo` controls `VITE_DEMO_WATERMARK_ENABLED` (on for customer-facing
deploys). If you turn it off for internal review, flip it back and redeploy
before sharing.

## Local check before deploying (optional)

```bash
npm run build:demo
cp .dev.vars.example .dev.vars   # fill in DEMO_ACCESS_CODE to try the server gate
npx wrangler pages dev dist      # serves dist/ + Functions on a local URL
```

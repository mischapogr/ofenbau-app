# Persistent demo on Cloudflare Pages

The permanent, always-on way to share the demo. Cloudflare Pages hosts the
static `build:demo` output on its edge, so it needs no domain, no running
container and no laptop kept on. You get a free, stable HTTPS URL.

For ad-hoc, throwaway shares from your own machine, see the quick tunnel in
[`DEMO_TUNNEL.md`](./DEMO_TUNNEL.md).

- **Projects:** `ofenbau-basis-demo`, `ofenbau-premium-demo` and the generic
  `ofenbau-demo` (see the `demo:pages:*` scripts in `package.json`).
- **Access:** one personal code per prospect, managed with
  `npm run demo:access` (see [Customer access codes](#customer-access-codes)).
  The notice bar carries a Basis/Premium package switch
  (`VITE_DEMO_URL_BASIS` / `VITE_DEMO_URL_PREMIUM`) that keeps the visitor logged in.

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

### Invite-only previews without operator details

If the demos are reachable only with a personal code (see
[Customer access codes](#customer-access-codes)) you can opt out of publishing
operator details:

```bash
echo 'VITE_DEMO_GATED_WITHOUT_OPERATOR=true' >> .env.demo.local
```

The deploy guard then accepts a project only if its gate is really active (KV
binding in `wrangler.toml` and the `DEMO_SESSION_SECRET` secret), so it can't
publish an open demo without an Impressum. The legal pages tell visitors that
the provider details come with their invitation. This lowers visibility but does
not clearly remove the § 5 DDG duty for a commercial demo — your call.

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

## Customer access codes

Every prospect gets their own code; one code works on all three demos (the
"Paket" switch hands the visitor over without asking again). Codes are stored
only as SHA-256 hashes in the `DEMO_ACCESS` KV namespace (`wrangler.toml`), so
they take effect and can be revoked immediately, without a redeploy.

```bash
npm run demo:access -- add mueller-ofenbau --label "Müller Ofenbau GmbH" --days 30
#   → prints the code once, e.g. K7QM-3XRP-9WHT, plus the demo links
npm run demo:access -- list                   # customers, expiry, last login
npm run demo:access -- rotate mueller-ofenbau # new code, the old one stops working
npm run demo:access -- remove mueller-ofenbau # locked out on their next page load
```

Codes expire after `--days` (default 30); expired entries are deleted from KV a
week later. Codes are case-insensitive and dashes are optional.

**One-time activation** (signs the session cookies; needs `DEMO_SESSION_SECRET`
in the environment, which the owner's `.envrc` loads from the encrypted secrets):

```bash
npm run demo:access -- setup    # sets the secret on all three Pages projects
npm run demo:pages:all          # the secret takes effect with the next deployment
```

The gate is active whenever a project has both the KV binding and the secret;
remove either and the demos are open again. Static files (`/assets`, `/images`,
`/models`, `/videos`) bypass the gate via `public/_routes.json` — the source is
open anyway, and this keeps them off the free plan's ~100 000 Functions requests
per day. Add a WAF rate-limiting rule for `/api/demo-unlock` in the dashboard
(e.g. 10 requests / 10 s per IP).

## Contact form

The form POSTs to `/api/contact`. On static Pages there is no `vite preview`
proxy, so Pages Functions stand in (auto-bundled by Wrangler, zero config):

- `functions/api/contact.js` — accepts `POST`, returns `{ ok: true }`; rejects
  non-POST with 405. Nothing is delivered — same as the local Mailpit sink.
- `functions/api/healthz.js` — returns `{ ok: true }`.
- `functions/_middleware.js`, `functions/api/demo-unlock.js`,
  `functions/api/demo-handoff.js` — the per-customer gate and the package handoff.

## Watermark before sharing

`.env.demo` controls `VITE_DEMO_WATERMARK_ENABLED` (on for customer-facing
deploys). If you turn it off for internal review, flip it back and redeploy
before sharing.

## Local check before deploying (optional)

```bash
npm run build:demo
cp .dev.vars.example .dev.vars   # fill in DEMO_SESSION_SECRET to try the gate
npm run demo:access -- add test --local
npx wrangler pages dev dist      # serves dist/ + Functions + local KV
```

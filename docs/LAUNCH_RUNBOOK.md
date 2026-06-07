# Launch Runbook

Use this before moving the site from staging/demo to a public production domain.

## Required Production Inputs

Use `docs/PRODUCTION_INPUTS.md` as the item-by-item handover checklist.

- Real company name, legal name, address, phone, WhatsApp, email and opening hours in `src/data/company.js`.
- Final legal representative and legally reviewed Impressum/Datenschutz in `src/pages/LegalView.vue` and `src/components/PrivacyContent.vue`.
- Production contact delivery: either use the bundled `api` service behind same-origin `/api/contact` or provide an external `VITE_API_BASE_URL`; in both cases configure real SMTP values and prove delivery to the real mailbox.
- Public HTTPS domain in `VITE_APP_URL`.
- Optional after legal approval: `VITE_GA_MEASUREMENT_ID` and `VITE_GOOGLE_SITE_VERIFICATION`.

## Local Checks

```bash
npm run preflight
```

`npm run launch:report` prints remaining blockers without failing the shell. Use it while replacing placeholder data.
`npm run preflight` runs the full local sequence: build, lint, content inventory,
asset references, deployment config, static accessibility, performance budget,
contact API smoke, launch report and desktop/mobile Playwright walkthrough.

For deployment variables, use `.env.production.example` as the checklist. Do not
commit real production values.

## Production Gate

When production env vars and real content are in place:

```bash
VITE_APP_URL=https://example.de \
VITE_API_BASE_URL=/api \
MAIL_HOST=smtp.example.de \
MAIL_PORT=587 \
MAIL_FROM=website@example.de \
MAIL_TO=kontakt@example.de \
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX \
VITE_GOOGLE_SITE_VERIFICATION=verification-token \
npm run launch:check
```

`npm run launch:check` is intentionally strict. It fails if placeholder legal/company data, localhost URLs, missing sitemap/robots, or missing analytics/Search Console values are still present.

## Deployment Smoke Test

After deploy:

- Open the production URL and verify HTTPS.
- Check `/robots.txt` and `/sitemap.xml`; both must contain the production domain.
- Confirm `npm run deploy:config` passes for the production Docker/nginx wiring before building the deploy image.
- Check `/api/healthz`; it should return `{ "ok": true }` when the bundled contact API is used.
- Before real delivery testing, `npm run contact:smoke` should pass locally with the fake SMTP server.
- Submit a contact form test and confirm the message reaches the real mailbox.
- In Search Console, verify ownership and submit the sitemap.
- In GA4 Realtime, confirm no page view is sent before analytics consent and page views appear after consent.
- Run the analytics consent smoke test with the production GA4 measurement ID.
- Run the Google Maps consent smoke test and then manually confirm the route target after real address data is entered.
- Run the browser SEO smoke test to verify runtime titles, descriptions, canonicals and JSON-LD URLs.
- Run the browser performance smoke test to catch slow loads, broken images, failed resources and console errors before Lighthouse.
- Run Lighthouse/PageSpeed against the production URL and record Core Web Vitals issues.

You can automate the first route checks with:

```bash
npm run deploy:config
npm run deploy:smoke -- https://example.de
npm run deploy:seo -- https://example.de
ANALYTICS_SMOKE_GA_ID=G-XXXXXXXXXX npm run deploy:analytics -- https://example.de
npm run deploy:maps -- https://example.de
npm run deploy:perf -- https://example.de
```

The smoke script checks the bundled same-origin contact API at `/api/healthz`.
For deployments that intentionally use an external contact backend, run:

```bash
SMOKE_SKIP_API_HEALTH=1 npm run deploy:smoke -- https://example.de
```

For the real mailbox delivery proof, send a marked test message after SMTP env
values are configured:

```bash
CONTACT_DELIVERY_CONFIRM=send \
CONTACT_DELIVERY_REPLY_TO=launch-test@example.de \
npm run contact:delivery -- https://example.de
```

Without `CONTACT_DELIVERY_CONFIRM=send`, the command prints the endpoint and
payload summary without sending.

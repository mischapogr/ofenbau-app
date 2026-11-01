# Launch Runbook

Use this before moving the site from staging/demo to a public production domain.

## Required Production Inputs

Use `docs/PRODUCTION_INPUTS.md` as the item-by-item handover checklist,
`docs/generated/CONTACT_DELIVERY_CHECKLIST.md` for SMTP/mailbox proof,
`docs/generated/DEPLOYMENT_CUTOVER_CHECKLIST.md` for DNS/HTTPS/hosting cutover,
`docs/generated/PERFORMANCE_EVIDENCE_CHECKLIST.md` for local and production performance
proof,
`docs/generated/OPERATOR_INPUT_FORM.md` to collect the real operator/legal/content values
before implementation, `docs/generated/PLACEHOLDER_CONTENT_REPORT.md` to locate remaining
demo values and unresolved approval flags, `docs/generated/ACCOUNT_VERIFICATION_CHECKLIST.md` for Google
Search Console/GA4/Google Business Profile checks,
`docs/generated/LAUNCH_EVIDENCE_REPORT.md` for the current local evidence snapshot, and
`docs/LAUNCH_EVIDENCE_TEMPLATE.md` to record the final production evidence.

- Real company name, legal name, address, phone, WhatsApp, email and opening hours in `src/data/company.js`.
- Final legal representative and legally reviewed Impressum/Datenschutz in `src/pages/LegalView.vue` and `src/components/PrivacyContent.vue`.
- Production contact delivery: either use the bundled `api` service behind same-origin `/api/contact` or provide an external `VITE_API_BASE_URL`; in both cases configure real SMTP values and prove delivery to the real mailbox.
- Public HTTPS domain in `VITE_APP_URL`.
- Optional after legal approval: `VITE_GA_MEASUREMENT_ID` and `VITE_GOOGLE_SITE_VERIFICATION`.

## Local Checks

```bash
npm run preflight
```

`npm run launch:actions` regenerates `docs/generated/LAUNCH_ACTION_ITEMS.md` from the current
placeholder data, review flags and deployment env values. Use it as the current
item-by-item handoff list.
`npm run launch:inputs` regenerates `docs/generated/OPERATOR_INPUT_FORM.md`, a fillable
worksheet for gathering real company, legal, contact-topic, homepage,
public-page, service, reference, 3D-planning and deployment inputs before
editing the source files.
`npm run content:placeholders` regenerates
`docs/generated/PLACEHOLDER_CONTENT_REPORT.md` so remaining demo values and unresolved
approval flags are visible by source field.
`npm run launch:contact` regenerates `docs/generated/CONTACT_DELIVERY_CHECKLIST.md` for
production SMTP env readiness, `/api/healthz` verification and real mailbox
delivery proof.
`npm run launch:deployment` regenerates
`docs/generated/DEPLOYMENT_CUTOVER_CHECKLIST.md` for DNS, HTTPS, hosting, rollback and
post-deploy proof.
`npm run launch:performance` regenerates
`docs/generated/PERFORMANCE_EVIDENCE_CHECKLIST.md` for local browser budget evidence,
production smoke evidence, Lighthouse/PageSpeed and field Core Web Vitals
handoff.
`npm run launch:accounts` regenerates
`docs/generated/ACCOUNT_VERIFICATION_CHECKLIST.md` for account-level Search Console, GA4
and Google Business Profile verification.
`npm run launch:evidence` regenerates `docs/generated/LAUNCH_EVIDENCE_REPORT.md`, which
summarizes generated handoff artifacts, current approval flags, env readiness and
the production evidence still missing.
`npm run legal:review` regenerates `docs/generated/LEGAL_REVIEW_CHECKLIST.md` for
Impressum and Datenschutz handoff.
`npm run launch:report` prints remaining blockers without failing the shell. Use it while replacing placeholder data.
`npm run preflight` runs the full local sequence: build, lint, content review
for contact topics, homepage, public pages, services, references and 3D planning,
placeholder content report, content inventory, asset references, legal review,
deployment config, static accessibility, performance budget, contact API smoke, contact delivery checklist
generation, deployment cutover checklist generation, operator input form
generation, performance evidence checklist generation, account verification
checklist generation, launch action-item generation, launch evidence snapshot
generation, launch report, local route/header deploy smoke, browser SEO,
analytics/Maps consent, performance, accessibility, contact-link and visual
smoke and desktop/mobile/tablet Playwright walkthrough.

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
- Confirm `npm run deploy:config` passes for the production Docker/nginx wiring, including cache and security headers, before building the deploy image.
- Run `npm run deploy:smoke -- https://example.de` to verify routes, robots, sitemap, `/api/healthz`, served security headers and immutable hashed-asset cache headers on the production domain.
- Check `/api/healthz`; it should return `{ "ok": true }` when the bundled contact API is used.
- Before real delivery testing, `npm run contact:smoke` should pass locally with the fake SMTP server.
- Submit a contact form test and confirm the message reaches the real mailbox.
- In Search Console, verify ownership and submit the sitemap.
- In GA4 Realtime, confirm no page view is sent before analytics consent and page views appear after consent.
- Run the analytics consent smoke test with the production GA4 measurement ID.
- Run the Google Maps consent smoke test and then manually confirm the route target after real address data is entered.
- Run the browser contact-link smoke test to verify rendered phone, WhatsApp, email, Google Maps route and social links.
- Run the browser SEO smoke test to verify runtime titles, descriptions, canonicals, OpenGraph/Twitter fields and JSON-LD URLs.
- Run the browser performance smoke test to catch slow loads, weak FCP/LCP/TBT/CLS signals, broken images, failed resources and console errors before Lighthouse.
- Run the browser accessibility smoke test to verify keyboard skip-link, mobile menu and dialog behavior.
- Run the browser visual smoke test to verify core routes across desktop, tablet and mobile have no horizontal overflow and visible first-viewport content.
- Run Lighthouse/PageSpeed against the production URL and record Core Web Vitals issues.

You can automate the browser/deployment smoke checks with:

```bash
npm run deploy:config
ANALYTICS_SMOKE_GA_ID=G-XXXXXXXXXX npm run deploy:all -- https://example.de
```

Without `ANALYTICS_SMOKE_GA_ID`, `deploy:all` still runs the analytics smoke and
expects no GA4 script to load; set the variable when GA4 is enabled in the
production build. The suite also runs
route/API/header, SEO, Maps consent, contact-link, accessibility, visual and performance checks. The same
checks can still be run individually with `deploy:smoke`, `deploy:seo`,
`deploy:analytics`, `deploy:maps`, `deploy:links`, `deploy:a11y`, `deploy:visual` and `deploy:perf`.

The smoke script checks the bundled same-origin contact API at `/api/healthz`.
For deployments that intentionally use an external contact backend, run:

```bash
SMOKE_SKIP_API_HEALTH=1 npm run deploy:all -- https://example.de
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

# Go-to-Market Progress

Stand: 2026-06-07

Status overall: demo-/staging-ready, not fully live-ready. Build, lint and desktop/mobile Playwright walkthrough pass. Remaining blockers are mostly real business/legal inputs, production contact delivery, final analytics/Search Console account values and final deployment verification.

## Verification

| Check | Status | Evidence |
| --- | --- | --- |
| Aggregate preflight | Done | `npm run preflight` passed end to end after adding `deploy:config`, `contact:smoke` and the tablet walkthrough; it ran build, lint, content inventory, asset, deployment config, accessibility, performance budget, contact API smoke, launch report and desktop/mobile/tablet Playwright walkthrough. |
| Production build | Done | `npm run build` passed. |
| Lint | Done | `npm run lint:check` passed. |
| Desktop/mobile/tablet walkthrough | Done | `npx playwright test` passed after the cookie-banner-aware locator update in `tests/e2e/demo.spec.js` and the tablet breakpoint walkthrough in `tests/e2e/tablet.spec.js`. |
| Content inventory | Done | `npm run content:inventory` regenerated `docs/CONTENT_INVENTORY.json`. |
| Launch readiness report | Partial | `npm run launch:report` passes in report mode and lists 16 blockers plus 8 warnings that require real launch inputs; a targeted placeholder-env run also flags example domain, SMTP, GA4 and Search Console values. |
| Company profile check | Done | `npm run company:check` passed with expected warnings for generic social URLs and pending NAP/Google Business Profile/Maps approvals. |
| Content asset/reference check | Partial | `npm run content:assets` passes with all image files present and warns that service content and project/reference approvals are still missing. |
| Privacy disclosure check | Done | `npm run privacy:check` passed; it verifies contact form, analytics consent, Google Maps comfort consent, user-rights and legal-review disclosure coverage. |
| Deployment config check | Done | `npm run deploy:config` passed; it verifies Dockerfile.prod, Dockerfile.contact, docker-compose.prod.yml, nginx.conf and .env.production.example production wiring. |
| Contact API smoke | Done | `npm run contact:smoke` passed with an in-process fake SMTP server; it verifies health, method rejection, required-field validation, honeypot rejection, SMTP handoff and rate limiting. |
| Contact delivery command | Done | `npm run contact:delivery -- https://example.de` dry-run passed; confirmed local sends are refused unless `CONTACT_DELIVERY_ALLOW_LOCAL=1` is set. |
| Browser SEO smoke | Done | `npm run deploy:seo -- http://localhost:5173` passed against the local dev target, including every service detail route generated from `src/data/services.js`. |
| Analytics consent smoke | Done | `npm run deploy:analytics -- http://localhost:5173` passed against the local dev target with no GA4 ID configured; it verified GA4 globals/scripts stay absent before consent and remain absent when no measurement ID is configured. |
| Google Maps consent smoke | Done | `npm run deploy:maps -- http://localhost:5173` passed; it verified the map iframe stays absent before Komfort consent, the route link remains available, and the iframe appears after explicit map/all consent. |
| Browser performance smoke | Done | `npm run deploy:perf -- http://localhost:5173` passed across `/`, `/leistungen`, `/projekte`, `/ueber-uns` and `/kontakt`; it checked load timing, transfer size, resource count, broken images, failed requests and browser errors. |

## Item-by-item Progress

| Item | Status | Implemented | Remaining |
| --- | --- | --- | --- |
| Modernes Responsive Design | Done | Vue/Tailwind layout with hero, sections, cards, gallery, sticky header and footer. | Final visual QA on the production domain. |
| Optimierung fuer Smartphones | Done | Mobile navigation plus mobile and tablet Playwright walkthroughs; the tablet pass covers the in-between breakpoint, menu behavior, service/detail navigation, gallery lightbox, contact success state and horizontal overflow checks. | Optional real-device QA beyond Pixel 7 and iPad Mini profiles. |
| Neue Startseite | Done | Home page composes hero, services, about, process, gallery, 3D planning and CTA. | Replace demo copy/photos with final client material if available. |
| Leistungsseiten Basis erweitert | Partial | Four service areas: Kachelofen/Kaminbau, Schornsteinbau, Fliesenarbeiten, 3D-Planung. Detail pages are routed; service proof points are structured in `src/data/services.js`, rendered on detail pages, exported in `npm run content:inventory`, checked by `npm run content:assets`, included in generated sitemap routes and covered by `npm run deploy:seo`; `serviceContentReview.approvedForLaunch` and `npm run launch:report` still gate final approval. | Validate final service wording/proof points against the real operator offer, add certifications where available, then set approval flag. |
| Galerie / Referenzen einfach hochwertiger | Partial | Filterable project gallery with WebP assets and lightbox; each project now carries review metadata for real-reference, photo-rights and customer approval; `npm run content:assets` verifies referenced gallery/planning/service media and summarizes incomplete project approvals; `npm run content:inventory` exports approval state; `projectReferenceReview.approvedForLaunch` and `npm run launch:report` still gate launch. | Replace generated/example references with real project photos, set per-project approval flags, then set global approval flag. |
| Kontaktformular | Partial | Frontend validation, topic routing, GDPR checkbox, honeypot spam field, minimum message length, dev SMTP/Mailpit endpoint and bundled production contact API behind nginx `/api/contact`; API health is available through `/api/healthz` for deployment smoke tests; `npm run contact:smoke` verifies validation, honeypot, rate limiting and fake-SMTP handoff; launch gate validates production SMTP host, port, sender and recipient placeholders; `npm run contact:delivery` sends a guarded launch test message for real mailbox proof. | Configure real SMTP/mailbox env and run delivery test to real mailbox. Optional CAPTCHA can be added if spam appears after launch. |
| Uebernahme bestehender Inhalte | Partial | Content is centralized in `src/data/*`; `docs/CONTENT_GUIDE.md` explains the editing workflow; `docs/PRODUCTION_INPUTS.md` maps required real inputs to exact files/env vars; `npm run content:inventory` exports placeholder-aware content inventory including service and project approval state; `npm run launch:report` flags placeholder NAP/legal/social values and unapproved service/reference content. | Replace all placeholder NAP/legal/social/project facts with real existing content. |
| SEO-Basisoptimierung | Partial | Per-route SEO composable, OpenGraph/Twitter defaults, generated sitemap and robots; sitemap and browser SEO route coverage are now derived from `src/data/services.js`; `npm run deploy:seo` verifies runtime titles, meta descriptions, canonicals and JSON-LD URL leakage after deploy. | Real production `VITE_APP_URL`, final titles/descriptions, Search Console validation. |
| Lokale SEO-Optimierung | Partial | LocalBusiness JSON-LD now uses `src/data/company.js` and `VITE_APP_URL`; `npm run company:check` verifies company/NAP/contact/social/review structure; browser SEO smoke checks LocalBusiness `url` and `@id` against the deployed URL; `companyProfileReview` gates final NAP/opening-hours and Google Business Profile alignment. | Replace placeholder address/phone/email/service area and align with Google Business Profile, then set approval flags. |
| Google Maps Integration | Partial | Contact page links to Google Maps route planning and embeds Google Maps only after Komfort consent; `npm run deploy:maps` browser-checks that the iframe is consent gated; `companyProfileReview.mapRouteVerified` and `npm run launch:report` gate final route/embed verification. | Real address required; validate map query after production data is entered, then set route verification flag. |
| Google Analytics / Search Console | Partial | Cookie banner stores analytics consent, GA4 loads only after analytics consent when `VITE_GA_MEASUREMENT_ID` is set, Search Console meta is emitted when `VITE_GOOGLE_SITE_VERIFICATION` is set; launch gate warns on missing or placeholder account values; `npm run deploy:analytics` browser-checks GA4 consent behavior. | Add real GA4/Search Console values, confirm legal disclosure, validate in Google tools after deployment. |
| Performanceoptimierung Basis erweitert | Mostly done | Code-splitting, WebP images, nginx gzip/cache/security headers, passing build, `npm run perf:budget` hard asset budget check, `npm run content:assets` image reference check and `npm run deploy:perf` browser smoke for load timing/resource errors. | Lighthouse/Core Web Vitals on deployed HTTPS URL. |
| Strukturierte Leistungsdarstellung Basis | Done | Services are data-driven and reused across overview/detail/home. | Add FAQ schema only if final FAQ content exists. |
| Kleine CMS-/Bearbeitungsfunktionen - optional | Mostly done/optional | Editing is simplified through `src/data/*`, documented in `docs/CONTENT_GUIDE.md`, and exportable via `docs/CONTENT_INVENTORY.json`. | No browser CMS/admin UI. Static data editing is likely enough unless the operator needs self-service edits. |
| Deployment / Livegang | Partial | Production Docker image, nginx SPA fallback, generated robots/sitemap, launch runbook, production input checklist, strict readiness gate, `npm run deploy:config` structural production-config check, deployment smoke script with `/api/healthz` check, browser SEO/performance smoke scripts, production contact API service, `.env.production.example` and aggregate `npm run preflight`. | Hosting target, DNS, HTTPS, real env values, real SMTP mailbox, smoke test after deploy. |
| DSGVO-Basis | Partial | Privacy page/modal, consent banner, form consent checkbox, structured legal launch flags in `src/data/legal.js`, analytics and Google Maps consent disclosures, `npm run privacy:check` for disclosure coverage and `npm run a11y:static` for common accessibility regressions. | Final legal review, real imprint/privacy data, analytics/map/font disclosures, processor details, retention periods and AVV details. |

## Implemented During This Pass

- Added `tests/e2e/tablet.spec.js` for tablet breakpoint QA across navigation, services, project lightbox, contact form and horizontal overflow.
- Added the `tablet-demo` Playwright project so `npm run test:e2e` and `npm run preflight` include desktop, mobile and tablet coverage.
- Updated the responsive progress and verification rows to record tablet evidence separately from final production-domain visual QA.

- Made `scripts/generate-seo-assets.mjs` derive service detail sitemap URLs from `src/data/services.js`.
- Extended `npm run deploy:seo` to browser-check every service detail route for response, title, meta description and canonical URL.
- Extended `npm run deploy:smoke` to verify every service detail route returns SPA HTML and appears in the sitemap.

## Implemented During This Pass

- Added `scripts/check-company-profile.mjs` and `npm run company:check` to verify company/NAP/contact/social/review data structure.
- The check validates address, phone/WhatsApp link consistency, email link consistency, social link shape, trust badges and company profile approval flags.
- Added `company:check` to `npm run preflight` and documented it as local SEO/NAP verification evidence.

## Implemented During This Pass

- Expanded `src/components/PrivacyContent.vue` with explicit Google Maps, analytics consent, contact-form and processor/retention/legal-basis review disclosures.
- Added `scripts/check-privacy-disclosures.mjs` and `npm run privacy:check` to verify consent-dependent services remain disclosed.
- Added `privacy:check` to `npm run preflight` and documented it in the go-to-market progress.

## Implemented During This Pass

- Added per-project reference review metadata in `src/data/projects.js` for real-reference, photo-rights and customer approval state.
- Extended `npm run content:assets` to summarize incomplete project approvals by project id.
- Extended `npm run content:inventory` and `docs/PRODUCTION_INPUTS.md` so reference approvals are explicit handoff items.

## Implemented During This Pass

- Added structured `proofPoints` for every service in `src/data/services.js` and rendered them on service detail pages as reviewable proof/safety points.
- Extended `npm run content:assets` to warn if service proof-point coverage is missing.
- Extended `npm run content:inventory` so service proof points are exported for content handoff/review.

## Implemented During This Pass

- Added `scripts/smoke-map-consent.mjs` and `npm run deploy:maps` for browser-based Google Maps consent verification.
- The smoke verifies that the map iframe is absent before Komfort consent, that the route link remains available, and that the iframe appears after either "Karte laden" or "Alle akzeptieren".
- Documented the command in the launch runbook and production input checklist while keeping final route verification blocked on real address data.

## Implemented During This Pass

- Added `scripts/check-deployment-config.mjs` and `npm run deploy:config` for static verification of production Docker, compose, nginx and env-example wiring.
- The deployment config check verifies SPA fallback, `/api/` proxying, healthchecks, cache/security headers, build output copy steps and required production env placeholders.
- Added `deploy:config` to `npm run preflight` and documented it as part of launch handoff.

## Implemented During This Pass

- Added `scripts/smoke-contact-api.mjs` and `npm run contact:smoke` for deterministic local contact API verification with a fake SMTP server.
- The smoke verifies `/api/healthz`, method rejection, required-field validation, honeypot rejection, one valid SMTP handoff and per-client rate limiting.
- Added `contact:smoke` to `npm run preflight` and documented it in the launch runbook and production input checklist.

## Implemented During This Pass

- Added `scripts/smoke-performance-browser.mjs` and `npm run deploy:perf` for browser-level performance/deployment smoke verification.
- The performance smoke visits the main public routes and checks response status, DOM/load timing budgets, transfer size, resource count, broken rendered images, failed requests, console errors and uncaught page errors.
- Re-encoded two 3D planning WebP assets so browser decoding remains stable while keeping existing image paths unchanged.
- Updated `docs/LAUNCH_RUNBOOK.md` and `docs/PRODUCTION_INPUTS.md` so browser performance smoke evidence is part of launch handoff before final Lighthouse/PageSpeed evidence.

## Implemented During This Pass

- Added `scripts/generate-seo-assets.mjs` to generate `public/robots.txt` and `public/sitemap.xml` from `VITE_APP_URL`.
- Updated `npm run build` so SEO assets are generated before Vite builds.
- Removed stale static localhost LocalBusiness JSON-LD from `index.html`.
- Added runtime LocalBusiness JSON-LD in `src/App.vue` using `src/data/company.js` and `VITE_APP_URL`.
- Updated the Playwright desktop demo to dismiss the cookie banner and target the project lightbox dialog by name.

## Implemented During This Pass

- Added consent-gated GA4 support in `src/composables/useAnalytics.js`; it only loads after analytics consent and when `VITE_GA_MEASUREMENT_ID` is set.
- Added optional Google Search Console verification through `VITE_GOOGLE_SITE_VERIFICATION`.
- Added analytics/Search Console env placeholders to `.env.example`.
- Hardened the contact form with a hidden honeypot field and a minimum useful message length.
- Extended the dev `/api/contact` endpoint to reject honeypot submissions.
- Expanded the privacy content with an analytics/cookie disclosure placeholder.

## Implemented During This Pass

- Added `scripts/check-launch-readiness.mjs` with report and strict modes.
- Added `npm run launch:report` for non-failing readiness reports during implementation.
- Added `npm run launch:check` as a strict pre-live gate for placeholder data, localhost URLs, sitemap/robots, analytics/Search Console env values and production contact API configuration.
- Added `docs/LAUNCH_RUNBOOK.md` with required production inputs, local checks, strict gate command and post-deploy smoke test.

## Implemented During This Pass

- Added a consent-aware `GoogleMapEmbed` component; the iframe is only loaded after Komfort consent.
- Added a cookie settings reopen event so map consent can be adjusted after the initial banner decision.
- Replaced the contact page static map block with the consent-aware Google Maps component while keeping the route-planning link available.
- Added `scripts/smoke-deployment.mjs` and `npm run deploy:smoke` for post-deploy route, robots and sitemap checks.

## Implemented During This Pass

- Added `server/contact-api.mjs`, a dependency-free production contact API with validation, honeypot rejection, basic in-memory rate limiting and SMTP delivery.
- Added `Dockerfile.contact` for the contact API container.
- Updated `docker-compose.prod.yml` to run the nginx web container with a healthy contact API service.
- Updated `nginx.conf` to proxy `/api/` to the contact API service.
- Changed production `VITE_API_BASE_URL` default to same-origin `/api`.
- Added `MAIL_TO` and `SMTP_TIMEOUT_MS` to `.env.example`.
- Updated `npm run launch:report` / `launch:check` to accept same-origin `/api` when the bundled production API is wired and to require a real `MAIL_TO`.

## Implemented During This Pass

- Added `docs/CONTENT_GUIDE.md` for the static content editing and handover workflow.
- Added `scripts/content-inventory.mjs` and `npm run content:inventory`; generated `docs/CONTENT_INVENTORY.json`.
- Added `scripts/check-performance-budget.mjs` and `npm run perf:budget` for hard JS/CSS asset budgets and image review thresholds.
- Ran the content inventory and performance budget checks successfully.

## Implemented During This Pass

- Added `scripts/check-accessibility-static.mjs` and `npm run a11y:static` for hard static checks around image alt text, iframe titles and safe external links.
- Added `scripts/check-content-assets.mjs` and `npm run content:assets` to verify service, project and 3D-planning image references exist in `public/images/`.
- Tuned the accessibility scanner for Vue template bindings such as `:alt`.

## Implemented During This Pass

- Added `scripts/smoke-analytics-consent.mjs` and `npm run deploy:analytics` for browser-based GA4 consent verification.
- The analytics smoke test checks that GA4 is absent before consent and, when `ANALYTICS_SMOKE_GA_ID` is set, loads/configures only after accepting analytics consent.
- Updated `docs/LAUNCH_RUNBOOK.md` and `docs/PRODUCTION_INPUTS.md` so analytics consent smoke evidence is part of launch handoff.

## Implemented During This Pass

- Added `companyProfileReview.mapRouteVerified` to `src/data/company.js` for final Google Maps route/embed verification.
- Extended `npm run launch:report` / `launch:check` to block launch until the contact-page route target is verified against the final business address.
- Added the Maps route verification state to `docs/CONTENT_INVENTORY.json` generation.
- Updated `docs/CONTENT_GUIDE.md` and `docs/PRODUCTION_INPUTS.md` with the map route verification workflow.

## Implemented During This Pass

- Added `companyProfileReview` to `src/data/company.js` with explicit NAP approval and Google Business Profile alignment flags.
- Extended `npm run launch:report` / `launch:check` to block launch until company NAP/opening-hours data and Google Business Profile alignment are approved.
- Added company approval state to `docs/CONTENT_INVENTORY.json` generation.
- Updated `docs/CONTENT_GUIDE.md` and `docs/PRODUCTION_INPUTS.md` with the company/local SEO approval workflow.

## Implemented During This Pass

- Added `serviceContentReview.approvedForLaunch` to `src/data/services.js` so final service wording/proof-point approval is explicit.
- Extended `npm run launch:report` / `launch:check` to block launch while service content approval is missing.
- Added the service approval state to `docs/CONTENT_INVENTORY.json` generation and a warning in `npm run content:assets`.
- Updated `docs/CONTENT_GUIDE.md` and `docs/PRODUCTION_INPUTS.md` with the service approval workflow.

## Implemented During This Pass

- Added `projectReferenceReview.approvedForLaunch` to `src/data/projects.js` so demo/generated reference approval is explicit.
- Extended `npm run launch:report` / `launch:check` to block launch while project/reference approvals are missing.
- Added the approval state to `docs/CONTENT_INVENTORY.json` generation and a warning in `npm run content:assets`.
- Updated `docs/CONTENT_GUIDE.md` and `docs/PRODUCTION_INPUTS.md` with the approval flag workflow.

## Implemented During This Pass

- Added `scripts/smoke-seo-browser.mjs` and `npm run deploy:seo` for browser-based post-deploy SEO verification.
- The browser SEO smoke test checks page titles, meta descriptions, canonicals, localhost leakage and LocalBusiness JSON-LD URL/`@id`.
- Updated `docs/LAUNCH_RUNBOOK.md` and `docs/PRODUCTION_INPUTS.md` so runtime SEO smoke evidence is part of launch handoff.

## Implemented During This Pass

- Added `scripts/test-contact-delivery.mjs` and `npm run contact:delivery` for guarded production contact-form delivery proof.
- The delivery command defaults to dry-run output and only sends when `CONTACT_DELIVERY_CONFIRM=send` is set.
- Updated `docs/LAUNCH_RUNBOOK.md` and `docs/PRODUCTION_INPUTS.md` with the exact mailbox proof command.

## Implemented During This Pass

- Extended `npm run launch:report` / `launch:check` to validate production SMTP `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM` and placeholder-style `MAIL_TO` values.
- Added placeholder warnings for configured GA4 and Search Console values such as `G-XXXXXXXXXX` and verification tokens.
- Updated `.env.production.example` and `docs/LAUNCH_RUNBOOK.md` so the strict gate documents the full SMTP envelope.

## Implemented During This Pass

- Added `src/data/legal.js` with explicit `noticeIsTemplate`, `privacyNeedsReview` and content-responsible fields.
- Updated the Impressum and Datenschutz views to render legal placeholder/review state from `src/data/legal.js`.
- Extended `npm run launch:report` / `launch:check` so legal template and responsible-person placeholders are checked from structured legal state.
- Updated `docs/PRODUCTION_INPUTS.md` and `docs/CONTENT_GUIDE.md` with the legal review flags.

## Implemented During This Pass

- Added `docs/PRODUCTION_INPUTS.md` as an operator-facing checklist for real company, content, legal, deployment, SMTP, analytics and final launch evidence.
- Linked the production input checklist from `docs/CONTENT_GUIDE.md` and `docs/LAUNCH_RUNBOOK.md`.
- Updated the item-by-item progress table so content takeover and deployment handoff now reference the new checklist.

## Implemented During This Pass

- Added `/api/healthz` support to the production and dev contact APIs so nginx-proxied deployments can verify the same-origin API path.
- Extended `npm run deploy:smoke` to check `/api/healthz` by default and allow `SMOKE_SKIP_API_HEALTH=1` only for external contact backends.
- Updated `docs/LAUNCH_RUNBOOK.md` with the contact API health check and skip command.

## Implemented During This Pass

- Added `scripts/run-preflight.mjs` and `npm run preflight` to run the full local launch verification sequence.
- Added `.env.production.example` as a deployment environment checklist for real domain, API, SMTP, GA4 and Search Console values.
- Updated `docs/LAUNCH_RUNBOOK.md` to use the aggregate preflight command.

## Launch Blockers

1. Real company data: address, phone, WhatsApp, email, legal representative, social profiles and opening hours.
2. Production contact delivery: configure real SMTP values and prove delivery to the real mailbox.
3. Legal completion: Impressum and Datenschutz are still templates and need review.
4. Analytics/Search Console: add real account values, verify consent behavior, and validate in Google tools.
5. Production URL/deployment: set `VITE_APP_URL`, build, deploy, verify HTTPS, sitemap, robots, canonical and contact form.

## Useful Commands

```bash
npm run launch:report  # shows current blockers without failing
npm run launch:check   # strict gate; expected to fail until real production inputs are set
npm run preflight
npm run company:check
npm run deploy:config
npm run deploy:smoke -- https://example.de
npm run deploy:seo -- https://example.de
ANALYTICS_SMOKE_GA_ID=G-XXXXXXXXXX npm run deploy:analytics -- https://example.de
npm run deploy:maps -- https://example.de
npm run deploy:perf -- https://example.de
npm run contact:smoke
SMOKE_SKIP_API_HEALTH=1 npm run deploy:smoke -- https://example.de  # only for external contact backends
CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://example.de
npm run content:inventory
npm run content:assets
npm run privacy:check
npm run a11y:static
npm run perf:budget
```

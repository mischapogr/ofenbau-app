# Go-to-Market Progress

Stand: 2026-06-07

Status overall: demo-/staging-ready, not fully live-ready. Build, lint and desktop/mobile/tablet Playwright walkthrough pass. Remaining blockers are mostly real business/legal inputs, production contact delivery, final analytics/Search Console account values and final deployment verification.

## Verification

| Check | Status | Evidence |
| --- | --- | --- |
| Aggregate preflight | Done | `npm run preflight` passed end to end after adding `deploy:config`, `contact:smoke`, local route/header, SEO, analytics/Maps consent, performance, accessibility, contact-link and visual smoke plus the tablet walkthrough; it ran build, lint, content review checklist, placeholder content report, content inventory, asset, legal review checklist, deployment config, static accessibility, performance budget, contact API smoke, contact delivery checklist generation, deployment cutover checklist generation, performance evidence checklist generation, operator input form generation, account verification checklist generation, launch action-item generation, launch evidence snapshot generation, launch report, local deploy route smoke, browser SEO, analytics/Maps consent, performance, accessibility, contact-link and visual smoke and desktop/mobile/tablet Playwright walkthrough. |
| Production build | Done | `npm run build` passed. |
| Lint | Done | `npm run lint:check` passed. |
| Desktop/mobile/tablet walkthrough | Done | `npx playwright test` passed after the cookie-banner-aware locator update in `tests/e2e/demo.spec.js` and the tablet breakpoint walkthrough in `tests/e2e/tablet.spec.js`. |
| Content review checklist | Done | `npm run content:review` regenerated `docs/CONTENT_REVIEW_CHECKLIST.md` with 7 contact topic rows, 4 homepage review rows, 4 public about/contact page review rows, 4 service review rows, 9 project/reference approval rows and 4 3D planning example approval rows. |
| Placeholder content report | Done | `npm run content:placeholders` regenerated `docs/PLACEHOLDER_CONTENT_REPORT.md` with 51 open structured placeholder/review findings across company/local SEO, legal/privacy, contact topics, homepage, public about/contact pages, services, references and 3D planning examples. |
| Content inventory | Done | `npm run content:inventory` regenerated `docs/CONTENT_INVENTORY.json`; unresolved company/contact-topic/homepage/public-page/service/reference/planning review notes, contact labels/email subjects, homepage proof/media claims, about value-card copy, per-project demo-replacement notes and per-planning-example approval state are now exported with placeholder flags. |
| Operator input form | Done | `npm run launch:inputs` regenerated `docs/OPERATOR_INPUT_FORM.md` with 8 company/local SEO inputs, 12 approval flags, 7 contact topic rows, 4 homepage review rows, 4 public about/contact page review rows, 4 service review rows, 9 reference approval rows, 4 3D planning approval rows and deployment/account env rows including optional `VITE_APP_TITLE` override handling. |
| Account verification checklist | Done | `npm run launch:accounts` regenerated `docs/ACCOUNT_VERIFICATION_CHECKLIST.md` with current production URL, Search Console token, GA4 ID, privacy approval, Google Business Profile readiness and production account verification steps; the Google Business Profile NAP proof now references configured company data instead of embedding demo-brand wording. |
| Launch action items | Done | `npm run launch:actions` regenerated `docs/LAUNCH_ACTION_ITEMS.md` with 39 open production handoff items derived from current placeholder data, review flags and deployment env values, including `VITE_APP_TITLE`, contact topic approval, homepage approval, public page approval, 3D planning approval and runtime route/header smoke evidence. |
| Launch evidence report | Done | `npm run launch:evidence` regenerated `docs/LAUNCH_EVIDENCE_REPORT.md` with 12 tracked handoff artifacts, current approval flags, content counts, env readiness, 22 blocker signals, 8 warning signals and required production evidence including expanded content approvals, contact topic mailbox-subject proof and runtime route/header smoke. |
| Launch readiness report | Partial | `npm run launch:report` passes in report mode and lists blockers/warnings that require real launch inputs; the gate now also flags placeholder `VITE_APP_TITLE` values and warns when a non-placeholder title override diverges from `company.name`. A targeted placeholder-env run also flags example domain, SMTP, GA4 and Search Console values. |
| Company profile check | Done | `npm run company:check` passed with expected warnings for generic social URLs, placeholder trust/certification claims and pending NAP/Google Business Profile/Maps approvals. |
| Content asset/reference check | Partial | `npm run content:assets` passes with all image files present and warns that contact topics/routing, homepage content, public about/contact page copy, service content, project/reference approvals and 3D planning example approvals are still missing. |
| Privacy disclosure check | Done | `npm run privacy:check` passed; it verifies contact form, analytics consent, Google Maps comfort consent, user-rights and legal-review disclosure coverage. |
| Legal review checklist | Done | `npm run legal:review` regenerated `docs/LEGAL_REVIEW_CHECKLIST.md` with 7 open Impressum/Datenschutz handoff items plus covered disclosure rows for contact form, analytics, Google Maps and user rights. |
| Browser accessibility smoke | Done | `npm run deploy:a11y -- http://localhost:5173` passed; it verifies visible main/H1 landmarks, skip-link keyboard focus, mobile-menu Escape behavior, gallery dialog Escape behavior and the contact privacy dialog. |
| Browser contact-link smoke | Done | `npm run deploy:links -- http://localhost:5173` passed; it verifies rendered header/footer company name, telephone, WhatsApp, email, Google Maps route and non-placeholder social links against `src/data/company.js`, confirms generic social placeholders stay hidden, and checks target/rel safety for external links. |
| Browser visual smoke | Done | `npm run deploy:visual -- http://localhost:5173` passed across desktop/tablet/mobile for `/`, `/leistungen`, the first service detail, `/projekte`, `/ueber-uns` and `/kontakt`; it wrote `docs/audits/VISUAL_SMOKE.md` and verified 0px horizontal overflow plus visible first-viewport main/H1 content. |
| Deployment config check | Done | `npm run deploy:config` passed; it verifies Dockerfile.prod, Dockerfile.contact, docker-compose.prod.yml, nginx.conf, cache/security headers including asset-location inheritance coverage, and .env.production.example production wiring. |
| Deployment cutover checklist | Done | `npm run launch:deployment` regenerated `docs/DEPLOYMENT_CUTOVER_CHECKLIST.md` with repository deployment wiring, current env readiness, DNS, HTTPS, hosting, rollback and post-deploy smoke proof steps. |
| Performance evidence checklist | Done | `npm run launch:performance` regenerated `docs/PERFORMANCE_EVIDENCE_CHECKLIST.md` with local browser budget evidence, production browser smoke, Lighthouse/PageSpeed and field Core Web Vitals proof steps. |
| Contact API smoke | Done | `npm run contact:smoke` passed with an in-process fake SMTP server; it verifies health, method rejection, required-field validation, honeypot rejection, SMTP handoff and rate limiting. |
| Contact delivery checklist | Done | `npm run launch:contact` regenerated `docs/CONTACT_DELIVERY_CHECKLIST.md` with SMTP/env readiness, production `/api/healthz`, dry-run delivery, real mailbox, Reply-To and spam-folder verification steps. |
| Contact delivery command | Done | `npm run contact:delivery -- https://example.de` dry-run passed; confirmed local sends are refused unless `CONTACT_DELIVERY_ALLOW_LOCAL=1` is set. |
| Browser SEO smoke | Done | `npm run deploy:seo -- http://localhost:5175` passed against the local dev target, including every service detail route generated from `src/data/services.js`, configured site-name titles, `og:site_name`, canonical URLs, `og:title`, `og:description`, `og:type`, `og:url`, absolute loadable `og:image`, Twitter title/description/card/image, LocalBusiness JSON-LD and service FAQPage JSON-LD where FAQ entries exist. |
| Analytics consent smoke | Done | `npm run deploy:analytics -- http://localhost:5173` passed against the local dev target with no GA4 ID configured; it verified GA4 globals/scripts stay absent before consent and remain absent when no measurement ID is configured. |
| Google Maps consent smoke | Done | `npm run deploy:maps -- http://localhost:5173` passed; it verified the map iframe stays absent before Komfort consent, the route link remains available with the configured company address, and the iframe appears after explicit map/all consent with the configured address and embed output. |
| Browser performance smoke | Done | `npm run deploy:perf -- http://localhost:5173` passed across `/`, `/leistungen`, `/projekte`, `/ueber-uns` and `/kontakt`; it checked DOM/load timing, FCP, LCP, TBT, CLS, transfer size, resource count, broken images, failed requests and browser errors. |
| Aggregate deployment smoke | Done | `SMOKE_SKIP_API_HEALTH=1 npm run deploy:all -- http://localhost:5175` passed locally with matching `VITE_APP_URL`; it runs route/API, production response-header, SEO, analytics consent, Maps consent, contact-link, accessibility, visual and performance smoke checks. Runtime header checks are skipped only for local non-nginx targets, and analytics smoke expects no GA4 script unless `ANALYTICS_SMOKE_GA_ID` is supplied. |

## Item-by-item Progress

| Item | Status | Implemented | Remaining |
| --- | --- | --- | --- |
| Modernes Responsive Design | Done | Vue/Tailwind layout with hero, sections, cards, gallery, sticky header and footer; the layout shell reserves a full viewport for lazy route content so the footer does not shift during first render; `npm run deploy:visual` now checks key routes across desktop/tablet/mobile and records route/viewport measurements. | Final visual QA on the production domain. |
| Optimierung fuer Smartphones | Done | Mobile navigation plus mobile and tablet Playwright walkthroughs; the tablet pass covers the in-between breakpoint, menu behavior, service/detail navigation, gallery lightbox, contact success state and horizontal overflow checks; browser visual smoke covers mobile/tablet route fit for all core pages. | Optional real-device QA beyond Pixel 7 and iPad Mini profiles. |
| Neue Startseite | Partial | Home page composes hero, services, about, process, gallery, 3D planning and CTA; hero stats and hero/about media are now data-backed from `src/data/home.js`; homepage hero/about/process/CTA review sections are listed in `npm run content:review`, `npm run content:placeholders`, `npm run content:inventory`, `npm run launch:inputs`, `npm run launch:actions`, `npm run launch:evidence` and gated by `npm run launch:report`. | Replace/approve homepage copy, proof claims and photos with final client material, then set homepage approval flags. |
| Leistungsseiten Basis erweitert | Partial | Four service areas: Kachelofen/Kaminbau, Schornsteinbau, Fliesenarbeiten, 3D-Planung. Detail pages are routed; service proof points and FAQs are structured in `src/data/services.js`, rendered on detail pages, exported in `npm run content:inventory`, listed in `npm run content:review`, checked by `npm run content:assets`, included in generated sitemap routes and covered by `npm run deploy:seo`; 3D planning examples now carry operator/media approval metadata in `src/data/planning.js` and are listed in content review, placeholder, inventory, operator-input and launch-action reports; `serviceContentReview.approvedForLaunch`, `planningContentReview.approvedForLaunch` and `npm run launch:report` still gate final approval. | Validate final service wording/proof points/FAQs and 3D planning examples against the real operator offer/workflow, add certifications where available, then set approval flags. |
| Galerie / Referenzen einfach hochwertiger | Partial | Filterable project gallery with WebP assets and lightbox; each project now carries review metadata for real-reference, photo-rights and customer approval; `npm run content:assets` verifies referenced gallery/planning/service media and summarizes incomplete project approvals; `npm run content:review` writes each project approval row; `npm run content:inventory` exports approval state and marks demo-replacement review notes as placeholder-like evidence; `projectReferenceReview.approvedForLaunch` and `npm run launch:report` still gate launch. | Replace generated/example references with real project photos, set per-project approval flags, then set global approval flag. |
| Kontaktformular | Partial | Frontend validation, topic routing, GDPR checkbox, honeypot spam field, minimum message length, dev SMTP/Mailpit endpoint and bundled production contact API behind nginx `/api/contact`; contact topic labels/email subjects and service-detail topic preselection now carry review metadata in `src/data/contactTopics.js` and are listed in content review, placeholder, inventory, operator-input, action and evidence reports; API health is available through `/api/healthz` for deployment smoke tests; `npm run contact:smoke` verifies validation, honeypot, rate limiting and fake-SMTP handoff; `npm run deploy:links` verifies rendered phone, WhatsApp, email and route links; launch gate validates production SMTP host, port, sender and recipient placeholders plus contact topic/routing approval; `npm run contact:delivery` sends a guarded launch test message for real mailbox proof; `npm run launch:contact` writes the SMTP/mailbox delivery proof worksheet. | Configure real SMTP/mailbox env, approve final contact topics/routing, and run delivery test to real mailbox. Optional CAPTCHA can be added if spam appears after launch. |
| Uebernahme bestehender Inhalte | Partial | Content is centralized in `src/data/*`; header/footer brand text, SEO fallback site name, router fallback titles, home SEO title, legal SEO descriptions and generated contact-map caption now render from `src/data/company.js`; package metadata uses a generic ofenbau description instead of the demo brand; contact topic labels/email subjects and routing approval live in `src/data/contactTopics.js`; homepage proof stats/media and approval state live in `src/data/home.js`; about/contact page review state and about value cards live in `src/data/pages.js`; `docs/CONTENT_GUIDE.md` explains the editing workflow; `docs/PRODUCTION_INPUTS.md` maps required real inputs to exact files/env vars including optional app-title override behavior plus contact-topic, homepage, public page and 3D planning approval; `npm run launch:inputs` writes a fillable operator worksheet for company/legal/contact-topic/homepage/public-page/service/reference/planning/deployment values; `npm run content:placeholders` writes a field-level placeholder/review report; `npm run content:inventory` exports placeholder-aware content inventory including contact-topic/homepage/public-page/service/project/planning approval state and unresolved review-note placeholder flags; `npm run launch:actions` writes a current item-by-item handoff checklist; `npm run launch:report` flags placeholder NAP/legal/social/app-title values and unapproved contact-topic/homepage/public-page/service/reference/planning content. | Replace all placeholder NAP/legal/social/contact-topic/homepage/public-page/project/planning facts with real existing content. |
| SEO-Basisoptimierung | Partial | Per-route SEO composable, OpenGraph/Twitter defaults including `og:site_name`, `og:url`, `og:type`, loadable `og:image`, `twitter:card` and `twitter:image`, generated sitemap and robots; sitemap and browser SEO route coverage are now derived from `src/data/services.js`; service detail pages emit FAQPage JSON-LD from service FAQ data; `npm run deploy:seo` verifies runtime titles use the configured site name, while `npm run launch:report` now guards stale `VITE_APP_TITLE` overrides; `npm run preflight` includes browser SEO smoke. | Real production `VITE_APP_URL`, final titles/descriptions/FAQ wording, Search Console validation. |
| Lokale SEO-Optimierung | Partial | LocalBusiness JSON-LD now uses `src/data/company.js` and `VITE_APP_URL`; header/footer brand text, SEO site-name metadata and generated contact-map caption use configured company data; `npm run company:check` verifies company/NAP/contact/social/trust/review structure and warns on placeholder trust claims; generic social homepage placeholders are hidden from the public footer until replaced; `npm run deploy:links` verifies rendered company name, NAP contact/social route links, hidden generic social placeholders and external-link safety; browser SEO smoke checks `og:site_name`, LocalBusiness `url` and `@id` against the deployed URL; `companyProfileReview` gates final NAP/opening-hours and Google Business Profile alignment. | Replace placeholder address/phone/email/service area and align with Google Business Profile, then set approval flags. |
| Google Maps Integration | Partial | Contact page links to Google Maps route planning and embeds Google Maps only after Komfort consent; `npm run deploy:maps` browser-checks that the route link and iframe query contain the configured company address, that the iframe is consent gated, and that embed output is used; `companyProfileReview.mapRouteVerified` and `npm run launch:report` still gate final real-address verification. | Real address required; validate map query after production data is entered, then set route verification flag. |
| Google Analytics / Search Console | Partial | Cookie banner stores analytics consent, GA4 loads only after analytics consent when `VITE_GA_MEASUREMENT_ID` is set, Search Console meta is emitted when `VITE_GOOGLE_SITE_VERIFICATION` is set; launch gate warns on missing or placeholder account values; `npm run deploy:analytics` browser-checks GA4 consent behavior; `npm run launch:accounts` writes the account verification worksheet for Search Console, GA4 Realtime and Google Business Profile checks. | Add real GA4/Search Console values, confirm legal disclosure, validate in Google tools after deployment. |
| Performanceoptimierung Basis erweitert | Mostly done | Code-splitting, WebP images, nginx gzip/cache/security headers, passing build, `npm run perf:budget` hard asset budget check, `npm run content:assets` image reference check, `npm run deploy:perf` browser smoke for load timing, FCP, LCP, TBT, CLS and resource errors, and `npm run launch:performance` for the performance evidence handoff worksheet; `npm run preflight` now runs local browser performance smoke before Playwright walkthroughs. | Lighthouse/PageSpeed field evidence on deployed HTTPS URL. |
| Strukturierte Leistungsdarstellung Basis | Done | Services are data-driven and reused across overview/detail/home; service FAQs are now data-driven, rendered on detail pages, exported in the content inventory and emitted as FAQPage JSON-LD for review. | Operator must approve FAQ wording as part of `serviceContentReview.approvedForLaunch`. |
| Kleine CMS-/Bearbeitungsfunktionen - optional | Mostly done/optional | Editing is simplified through `src/data/*`, documented in `docs/CONTENT_GUIDE.md`, and exportable via `docs/CONTENT_INVENTORY.json`. | No browser CMS/admin UI. Static data editing is likely enough unless the operator needs self-service edits. |
| Deployment / Livegang | Partial | Production Docker image, nginx SPA fallback, generated robots/sitemap, launch runbook, production input checklist, strict readiness gate, generated local launch evidence report, launch evidence template with expanded contact-topic/homepage/public-page/service/reference/3D-planning approval rows, generated deployment cutover checklist, `npm run deploy:config` structural production-config and cache/security-header check, `npm run deploy:smoke` runtime route/API/sitemap/robots/header check, `npm run deploy:links` contact/local-SEO link smoke, `npm run deploy:all` aggregate deployment smoke, production contact API service, `.env.production.example` and aggregate `npm run preflight`. | Hosting target, DNS, HTTPS, real env values, real SMTP mailbox, smoke test after deploy. |
| DSGVO-Basis | Partial | Privacy page/modal, consent banner, form consent checkbox, structured legal launch flags in `src/data/legal.js`, analytics and Google Maps consent disclosures, `npm run privacy:check` for disclosure coverage, `npm run legal:review` for an Impressum/Datenschutz handoff worksheet, `npm run a11y:static` for common static accessibility regressions and `npm run deploy:a11y` for browser keyboard/dialog checks. | Final legal review, real imprint/privacy data, analytics/map/font disclosures, processor details, retention periods and AVV details. |

## Implemented During This Pass

- Updated `README.md` so the script table, demo walkthrough section, artifact map, launch docs and env-var list reflect the expanded launch/smoke workflow.
- Updated `AI.md` so future agents see `npm run preflight`, launch report/check, launch evidence/action generation, aggregate deployment smoke and demo conversion in the common command list.
- Updated `scripts/convert-videos.mjs` so tablet Playwright recordings are converted to `demo-artifacts/walkthrough-tablet.mp4` alongside desktop and mobile videos.

## Implemented During This Pass

- Updated `docs/LAUNCH_EVIDENCE_TEMPLATE.md` so final handoff evidence explicitly covers contact topic/mailbox routing, homepage, public-page, service, reference and 3D-planning approvals.
- Updated `docs/LAUNCH_RUNBOOK.md` so operator input and preflight descriptions match the current expanded content-review scope.
- Updated `scripts/write-launch-evidence-report.mjs` and regenerated `docs/LAUNCH_EVIDENCE_REPORT.md` so generated evidence names expanded approval proof and contact topic mailbox-subject proof.

## Implemented During This Pass

- Added contact topic and service-topic routing approval metadata in `src/data/contactTopics.js`.
- Extended `npm run content:review`, `npm run content:assets`, `npm run content:placeholders`, `npm run content:inventory`, `npm run launch:inputs`, `npm run launch:actions`, `npm run launch:evidence` and `npm run launch:report` to surface missing contact topic/mailbox subject/routing approvals.
- Updated the content guide, production input checklist and progress tracker so contact topic and routing approval is documented as a launch handoff item.

## Implemented During This Pass

- Added `src/data/pages.js` with public about/contact page approval metadata and data-backed about value cards.
- Updated `AboutView` so its value cards render from the shared public-page data module.
- Extended `npm run content:review`, `npm run content:assets`, `npm run content:placeholders`, `npm run content:inventory`, `npm run launch:inputs`, `npm run launch:actions`, `npm run launch:evidence` and `npm run launch:report` to surface missing about/contact page copy approvals.
- Updated the content guide, production input checklist and progress tracker so public about/contact page approval is documented as a launch handoff item.

## Implemented During This Pass

- Added `src/data/home.js` with homepage launch approval metadata, hero proof stats and hero/about media paths.
- Updated `HeroSection` and `AboutSection` to render homepage stats/media from the shared homepage data module.
- Extended `npm run content:review`, `npm run content:assets`, `npm run content:placeholders`, `npm run content:inventory`, `npm run launch:inputs`, `npm run launch:actions`, `npm run launch:evidence` and `npm run launch:report` to surface missing homepage copy/proof/media approvals.
- Updated the content guide, production input checklist and progress tracker so homepage approval is documented as a launch handoff item.

## Implemented During This Pass

- Added `planningContentReview` and per-example review metadata in `src/data/planning.js` so 3D planning examples are gated like service and reference content.
- Extended `npm run content:review`, `npm run content:assets`, `npm run content:placeholders`, `npm run content:inventory`, `npm run launch:inputs`, `npm run launch:actions`, `npm run launch:evidence` and `npm run launch:report` to surface missing 3D planning operator/media approvals.
- Updated the content guide, production input checklist and progress tracker so 3D planning approval is documented as a launch handoff item.

## Implemented During This Pass

- Extended `scripts/smoke-map-consent.mjs` so `npm run deploy:maps` verifies the Google Maps route link and iframe query contain the configured company address from `src/data/company.js`.
- Updated the Google Maps progress rows to distinguish automated configured-address checks from the remaining manual final-address approval flag.

## Implemented During This Pass

- Extended `scripts/check-launch-readiness.mjs` to block placeholder `VITE_APP_TITLE` values and warn when a non-placeholder title override diverges from `company.name`.
- Added `VITE_APP_TITLE` to the generated operator input form and launch action-item detection so title overrides are visible in handoff docs.
- Documented optional app-title override handling in `docs/PRODUCTION_INPUTS.md` and updated the progress tracker.

## Implemented During This Pass

- Updated `package.json` so project metadata uses a generic ofenbau-business description instead of embedding the current demo brand.
- Updated the content takeover progress row to include metadata cleanup alongside the company-data-backed runtime content.

## Implemented During This Pass

- Updated `scripts/write-account-verification-checklist.mjs` so the Google Business Profile NAP comparison step refers to configured company data rather than the current placeholder brand string.
- Regenerated `docs/ACCOUNT_VERIFICATION_CHECKLIST.md` and updated the progress tracker for account/local SEO handoff evidence.

## Implemented During This Pass

- Updated `scripts/generate-images.mjs` so the generated contact-map caption is derived from `company.address.region` in `src/data/company.js` instead of a hardcoded `Musterstadt & Umgebung` string.
- Updated the content takeover and local SEO progress rows to record the image-generator caption as company-data-backed.

## Implemented During This Pass

- Extended `scripts/content-inventory.mjs` so launch-oriented review notes containing demo/replacement/before-launch language are flagged as placeholder-like content in `docs/CONTENT_INVENTORY.json`.
- Regenerated `docs/CONTENT_INVENTORY.json`; company, service and reference review notes now include `notePlaceholder`, and every project `review.note` with demo-replacement wording is marked as `placeholder: true`.
- Regenerated `docs/PLACEHOLDER_CONTENT_REPORT.md` and updated the progress tracker so content inventory and reference evidence reflect the stricter review-note detection.

## Implemented During This Pass

- Updated `src/composables/useSeo.js`, `src/router/index.js`, `src/pages/HomeView.vue` and `src/pages/LegalView.vue` so SEO fallback titles and legal meta descriptions use the configured company name instead of hardcoded demo-brand text.
- Extended `npm run deploy:seo` to verify document titles and `og:site_name` against the configured site name.
- Updated the progress tracker so content reuse, SEO basis and local SEO rows reflect the company-data-backed SEO behavior.

## Implemented During This Pass

- Updated `src/layouts/AppHeader.vue` and `src/components/SiteFooter.vue` so public brand text renders `company.name` from `src/data/company.js` instead of hardcoded `Ofenbau Mustermann` text.
- Extended `npm run deploy:links` to verify the rendered header and footer company name against structured company data.
- Updated the progress tracker so company-data replacement now covers header/footer brand text.

## Implemented During This Pass

- Added `isGenericTrustBadge` and `publicTrustBadges` in `src/data/company.js` so placeholder trust/certification claims have a reusable launch filter for future rendering.
- Updated `npm run company:check` to warn when trust/certification claims still look like placeholders.
- Updated `npm run content:placeholders` to use the same trust-claim helper and point verification back to `company:check` plus manual proof.
- Documented trust/certification verification in the production input checklist and progress tracker.

## Implemented During This Pass

- Added `isGenericSocialLink` and `publicSocialLinks` in `src/data/company.js` so generic platform homepage placeholders stay visible to launch reports but are not rendered as public footer links.
- Updated `src/components/SiteFooter.vue` to render only non-placeholder social links.
- Updated `npm run deploy:links` so browser smoke verifies real social links when present and confirms generic placeholder social links stay hidden.
- Documented the behavior in the content guide, production input checklist and progress tracker.

## Implemented During This Pass

- Updated `scripts/run-deploy-smoke.mjs` so `npm run deploy:all` always runs analytics consent smoke instead of skipping it when `ANALYTICS_SMOKE_GA_ID` is absent.
- The aggregate deployment suite now proves either the configured GA4 ID loads only after consent or, when no expected ID is supplied, that no GA4 script loads.
- Updated the deployment cutover, performance evidence, launch evidence, runbook and evidence-template wording to match the always-on analytics smoke behavior.

## Implemented During This Pass

- Added `deploy:analytics` and `deploy:maps` to the browser phase of `npm run preflight` so the aggregate local launch proof now covers consent-gated GA4 behavior and Google Maps embedding alongside route/header, SEO, performance, accessibility, contact-link, visual and Playwright walkthrough checks.
- Updated the launch runbook and evidence template so local preflight evidence names the consent smoke coverage explicitly.

## Implemented During This Pass

- Updated `scripts/write-deployment-cutover-checklist.mjs` so the generated production health row describes the full `deploy:all` suite: route/API/header, SEO, analytics/Maps consent, contact-link, accessibility, visual and performance, with `ANALYTICS_SMOKE_GA_ID` required as the expected ID when GA4 is configured.
- Updated `scripts/write-performance-evidence-checklist.mjs` so aggregate deploy smoke evidence names route/API/header, SEO, consent, contact-link, accessibility and visual coverage around the performance smoke.
- Updated `docs/LAUNCH_EVIDENCE_TEMPLATE.md` and regenerated `docs/DEPLOYMENT_CUTOVER_CHECKLIST.md`, `docs/PERFORMANCE_EVIDENCE_CHECKLIST.md` and `docs/LAUNCH_EVIDENCE_REPORT.md`.

## Implemented During This Pass

- Updated `scripts/write-launch-evidence-report.mjs` so `npm run launch:evidence` lists `npm run deploy:smoke -- https://domain.example` as required production proof for route, API, robots/sitemap and runtime security/cache headers.
- Updated `scripts/write-launch-action-items.mjs` so `npm run launch:actions` creates a distinct production evidence item for recording runtime route/header smoke output.
- Regenerated `docs/LAUNCH_ACTION_ITEMS.md` and `docs/LAUNCH_EVIDENCE_REPORT.md`; the action list now shows 29 open items because runtime route/header smoke is tracked separately.

## Implemented During This Pass

- Extended `scripts/smoke-deployment.mjs` so `npm run deploy:smoke -- https://domain.example` verifies production response headers on the served home page and a hashed build asset.
- The runtime smoke now checks `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and immutable hashed-asset cache headers on non-local targets.
- Kept local Vite smoke usable by skipping runtime header assertions only for `localhost` and `127.0.0.1` targets where nginx is not serving responses, and added that local `deploy:smoke` path to `npm run preflight`.

## Implemented During This Pass

- Added `Permissions-Policy` to `nginx.conf` and repeated the existing security headers inside `/assets/` so hashed asset cache headers do not suppress the security header baseline.
- Extended `scripts/check-deployment-config.mjs` so `npm run deploy:config` verifies the server-level security headers plus the repeated `/assets/` headers.
- Updated the deployment cutover/evidence/progress docs so production config proof includes the cache and security header baseline.

## Implemented During This Pass

- Updated `scripts/write-launch-action-items.mjs` so generated phone, WhatsApp, email, social profile and route handoff items name `npm run deploy:links -- https://domain.example` as production proof.
- Updated `scripts/write-deployment-cutover-checklist.mjs` so production health evidence explicitly includes contact-link smoke inside the aggregate deployment suite.
- Regenerated `docs/LAUNCH_ACTION_ITEMS.md` and `docs/DEPLOYMENT_CUTOVER_CHECKLIST.md`, and added `deploy:links` to the go-to-market useful-command list.

## Implemented During This Pass

- Added `/images/hero.webp` as the default social preview image in `src/composables/useSeo.js` so every route emits `og:image` and `twitter:image` even when a page does not provide a custom image.
- Extended `npm run deploy:seo` to verify each route has an absolute same-origin social preview image, matching Twitter image metadata and a successfully responding preview image URL.
- Updated the SEO progress row so social preview image metadata is part of the local and production launch evidence path.

## Implemented During This Pass

- Extended `src/composables/useSeo.js` to emit canonical-aligned `og:url`, default `og:type` and `twitter:card`, with absolute social image URLs when page images are provided.
- Extended `scripts/smoke-seo-browser.mjs` so `npm run deploy:seo` verifies OpenGraph and Twitter metadata on every public route in addition to titles, descriptions, canonicals and JSON-LD.
- Added browser SEO smoke to `npm run preflight` so local launch verification covers route SEO metadata before Playwright walkthroughs.

## Implemented During This Pass

- Added `scripts/smoke-contact-links-browser.mjs` and `npm run deploy:links` for browser-level contact and local-SEO link smoke coverage.
- The smoke verifies rendered telephone, WhatsApp, email, Google Maps route and social links against `src/data/company.js`, including target/rel safety for external links.
- Added `deploy:links` to `npm run preflight`, `npm run deploy:all` and the production/runbook/evidence handoff docs.

## Implemented During This Pass

- Added `scripts/write-placeholder-content-report.mjs` and `npm run content:placeholders` to generate `docs/PLACEHOLDER_CONTENT_REPORT.md`.
- The placeholder report lists structured demo values, generic social links and unresolved approval flags by source field for company/local SEO, legal/privacy, services and references.
- Added `content:placeholders` to `npm run preflight`, `npm run launch:evidence` artifact tracking and the content/production/runbook/evidence handoff docs.

## Implemented During This Pass

- Added `scripts/write-performance-evidence-checklist.mjs` and `npm run launch:performance` to generate `docs/PERFORMANCE_EVIDENCE_CHECKLIST.md`.
- The performance checklist maps local browser budget evidence, production browser smoke, Lighthouse/PageSpeed and field Core Web Vitals proof steps.
- Added `launch:performance` to `npm run preflight`, `npm run launch:evidence` artifact tracking and the production/runbook/evidence handoff docs.

## Implemented During This Pass

- Added `scripts/write-deployment-cutover-checklist.mjs` and `npm run launch:deployment` to generate `docs/DEPLOYMENT_CUTOVER_CHECKLIST.md`.
- The cutover checklist maps Docker/nginx/compose wiring, current env readiness and DNS/HTTPS/hosting/rollback/post-deploy proof steps.
- Added `launch:deployment` to `npm run preflight`, `npm run launch:evidence` artifact tracking and the production/runbook/evidence handoff docs.

## Implemented During This Pass

- Added `scripts/write-contact-delivery-checklist.mjs` and `npm run launch:contact` to generate `docs/CONTACT_DELIVERY_CHECKLIST.md`.
- The contact checklist maps current production URL, API base URL, SMTP host/port/from/to and timeout readiness to required mailbox delivery verification steps.
- Added `launch:contact` to `npm run preflight`, `npm run launch:evidence` artifact tracking and the production/runbook/evidence handoff docs.

## Implemented During This Pass

- Added `scripts/write-account-verification-checklist.mjs` and `npm run launch:accounts` to generate `docs/ACCOUNT_VERIFICATION_CHECKLIST.md`.
- The account checklist maps current production URL, Search Console token, GA4 ID, privacy approval and Google Business Profile readiness to required production verification steps.
- Added `launch:accounts` to `npm run preflight`, `npm run launch:evidence` artifact tracking and the production/runbook/evidence handoff docs.

## Implemented During This Pass

- Added `scripts/write-launch-evidence-report.mjs` and `npm run launch:evidence` to generate `docs/LAUNCH_EVIDENCE_REPORT.md`.
- The evidence report summarizes current local artifacts, approval flags, content counts, env readiness, launch blocker/warning signals and production proof still required.
- Added `launch:evidence` to `npm run preflight` and linked it from the production checklist, launch runbook, evidence template and launch action commands.

## Implemented During This Pass

- Added `scripts/write-operator-input-form.mjs` and `npm run launch:inputs` to generate `docs/OPERATOR_INPUT_FORM.md`.
- The operator form turns current company/local SEO, legal/privacy, service review, reference approval and deployment/account values into a fillable handoff worksheet.
- Added `launch:inputs` to `npm run preflight` and linked it from the production, content, runbook and evidence docs.

## Implemented During This Pass

- Added `scripts/write-legal-review-checklist.mjs` and `npm run legal:review` to generate `docs/LEGAL_REVIEW_CHECKLIST.md`.
- The legal checklist maps the current Impressum placeholders, responsible-person data and privacy review flag to exact source files and verification commands.
- Added `legal:review` to `npm run preflight` and linked it from production handoff docs.

## Implemented During This Pass

- Added `scripts/smoke-visual-browser.mjs` and `npm run deploy:visual` for browser-level visual/layout smoke coverage.
- The visual smoke visits 6 core routes across desktop, tablet and mobile, checks HTTP status, first-viewport main/H1 visibility and horizontal overflow, then writes `docs/audits/VISUAL_SMOKE.md`.
- Added visual smoke to `npm run preflight` and `npm run deploy:all` so layout evidence is included in local and post-deploy verification.

## Implemented During This Pass

- Added `scripts/write-content-review-checklist.mjs` and `npm run content:review` to generate `docs/CONTENT_REVIEW_CHECKLIST.md`.
- The content review checklist lists all 4 service pages with route/content counts and all 9 project references with real-reference, photo-rights and customer-approval flags.
- Added `content:review` to `npm run preflight` and linked it from the content/production handoff docs.

## Implemented During This Pass

- Added `scripts/write-launch-action-items.mjs` and `npm run launch:actions` to generate `docs/LAUNCH_ACTION_ITEMS.md` from current company/legal/content/review/env state.
- The generated checklist groups the remaining production work by company/local SEO, maps, legal/privacy, services, references, deployment, contact delivery, analytics/Search Console and production evidence.
- Added `launch:actions` to `npm run preflight` so the handoff checklist is refreshed with the rest of the local launch checks.

## Implemented During This Pass

- Added `scripts/run-deploy-smoke.mjs` and `npm run deploy:all` to run the post-deploy route/API, SEO, analytics, Maps, accessibility and performance smoke suite with one command.
- `deploy:all` preserves existing deployment flags such as `SMOKE_SKIP_API_HEALTH=1`; analytics smoke uses `ANALYTICS_SMOKE_GA_ID` as the expected configured GA4 ID when supplied, otherwise it verifies GA4 stays absent.
- Updated launch docs and useful commands so production deployment verification has one default entry point plus the existing individual smoke commands.
- Added `docs/LAUNCH_EVIDENCE_TEMPLATE.md` so the final production handover can record each launch check with owner, command, URL, result and follow-up status.

## Implemented During This Pass

- Added `scripts/smoke-accessibility-browser.mjs` and `npm run deploy:a11y` for browser-level accessibility smoke coverage.
- The smoke verifies public route landmarks/headings, skip-link keyboard focus, mobile-menu Escape closing, gallery dialog Escape closing and contact privacy-dialog focus/closing.
- Added Escape handling for the mobile menu in `src/layouts/AppHeader.vue` and added browser accessibility smoke to `npm run preflight`.

## Implemented During This Pass

- Extended `scripts/smoke-performance-browser.mjs` with Core-Web-Vitals-style browser signals: FCP, LCP, TBT and CLS budgets in addition to load/resource/error checks.
- Added local `npm run deploy:perf -- http://localhost:5174` execution to `npm run preflight` while the Vite preflight server is running.
- Reserved stable route-shell height in `src/layouts/DefaultLayout.vue` after the new CLS check exposed footer movement while lazy route chunks loaded.
- Updated the performance progress and handoff docs so browser performance smoke now bridges local checks and final production Lighthouse/PageSpeed evidence.

## Implemented During This Pass

- Added service FAQ entries to `src/data/services.js` so each service detail page has reviewable question/answer content.
- Rendered service FAQs on `src/pages/ServiceDetailView.vue` and emitted route-specific FAQPage JSON-LD through the shared `useJsonLd` helper.
- Extended `npm run content:inventory`, `npm run content:assets` and `npm run deploy:seo` so FAQ content and structured data are covered by the existing handoff checks.

## Implemented During This Pass

- Added `tests/e2e/tablet.spec.js` for tablet breakpoint QA across navigation, services, project lightbox, contact form and horizontal overflow.
- Added the `tablet-demo` Playwright project so `npm run test:e2e` and `npm run preflight` include desktop, mobile and tablet coverage.
- Updated the responsive progress and verification rows to record tablet evidence separately from final production-domain visual QA.

## Implemented During This Pass

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
npm run launch:actions
npm run content:review
npm run legal:review
npm run preflight
npm run company:check
npm run deploy:config
npm run deploy:all -- https://example.de
npm run deploy:smoke -- https://example.de
npm run deploy:seo -- https://example.de
ANALYTICS_SMOKE_GA_ID=G-XXXXXXXXXX npm run deploy:analytics -- https://example.de
npm run deploy:links -- https://example.de
npm run deploy:maps -- https://example.de
npm run deploy:a11y -- https://example.de
npm run deploy:visual -- https://example.de
npm run deploy:perf -- https://example.de
npm run contact:smoke
SMOKE_SKIP_API_HEALTH=1 npm run deploy:all -- https://example.de  # only for external contact backends
CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://example.de
npm run content:inventory
npm run content:assets
npm run privacy:check
npm run a11y:static
npm run perf:budget
```

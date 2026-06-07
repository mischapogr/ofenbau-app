# Launch Evidence Template

Copy this structure into the launch ticket or handover notes for the real
production launch. Do not store secrets, mailbox credentials or private customer
approval documents in this repository.

## Launch Context

| Field | Value |
| --- | --- |
| Production URL |  |
| Deployment date/time |  |
| Release/version/commit |  |
| Person running checks |  |
| Contact mailbox checked by |  |
| GA4 property / stream checked by |  |
| Search Console property checked by |  |

## Item-by-item Evidence

| Item | Command or action | Expected result | Actual result / evidence link | Status | Follow-up |
| --- | --- | --- | --- | --- | --- |
| Local preflight | `npm run preflight` | Build, lint, content, config, route/header, SEO, analytics/Maps consent, accessibility, contact-link, visual, performance, contact API smoke and desktop/mobile/tablet walkthrough pass. |  |  |  |
| Contact delivery checklist | `npm run launch:contact` | `docs/CONTACT_DELIVERY_CHECKLIST.md` lists production SMTP/env readiness and mailbox delivery proof steps. |  |  |  |
| Deployment cutover checklist | `npm run launch:deployment` | `docs/DEPLOYMENT_CUTOVER_CHECKLIST.md` lists DNS, HTTPS, hosting, rollback and post-deploy proof steps. |  |  |  |
| Performance evidence checklist | `npm run launch:performance` | `docs/PERFORMANCE_EVIDENCE_CHECKLIST.md` lists local browser budgets, production smoke checks, Lighthouse/PageSpeed and field Core Web Vitals proof steps. |  |  |  |
| Operator input form | `npm run launch:inputs` | `docs/OPERATOR_INPUT_FORM.md` lists current company, legal, contact-topic, homepage, public-page, service, reference, 3D-planning and deployment inputs to collect. |  |  |  |
| Account verification checklist | `npm run launch:accounts` | `docs/ACCOUNT_VERIFICATION_CHECKLIST.md` lists Search Console, GA4 and Google Business Profile setup and verification steps. |  |  |  |
| Placeholder content report | `npm run content:placeholders` | `docs/PLACEHOLDER_CONTENT_REPORT.md` lists remaining structured demo values and unresolved approval flags by source field. |  |  |  |
| Local evidence snapshot | `npm run launch:evidence` | `docs/LAUNCH_EVIDENCE_REPORT.md` summarizes current local artifacts, approval flags, env readiness and production proof gaps. |  |  |  |
| Launch gate | `npm run launch:check` with production env values | No placeholder company/legal/domain/SMTP/GA4/Search Console blockers remain. |  |  |  |
| Company / NAP data | `npm run company:check` | Company data is structurally valid; only accepted launch warnings remain. |  |  |  |
| Content approvals | `npm run content:review`, `npm run content:assets` and `npm run content:inventory` | Required assets exist; contact-topic, homepage, public-page, service, reference and 3D-planning approvals are complete or explicitly accepted. |  |  |  |
| Privacy disclosure | `npm run privacy:check` | Contact form, analytics, Google Maps, rights and processor/retention disclosures are present. |  |  |  |
| Production config | `npm run deploy:config` | Docker, compose, nginx, healthcheck, env example, security header and SPA/API routing checks pass. |  |  |  |
| Runtime headers and routes | `npm run deploy:smoke -- https://domain.example` | Routes, robots, sitemap, `/api/healthz`, served security headers and immutable hashed-asset cache headers pass on the production domain. |  |  |  |
| SEO metadata smoke | `npm run deploy:seo -- https://domain.example` | Runtime titles, descriptions, canonicals, OpenGraph/Twitter fields including social preview images, LocalBusiness JSON-LD and service FAQPage JSON-LD pass on the production domain. |  |  |  |
| Deployment smoke suite | `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example` | Route/API/header, SEO, GA4 consent when configured, no-GA4 assertion when unconfigured, Google Maps consent, contact-link, accessibility, visual and performance smoke checks pass. |  |  |  |
| External contact backend exception | `SMOKE_SKIP_API_HEALTH=1 npm run deploy:all -- https://domain.example` | Only use when `/api/healthz` is intentionally not served by this deployment; all other smoke checks pass. |  |  |  |
| Contact and local SEO links | `npm run deploy:links -- https://domain.example` | Rendered phone, WhatsApp, email, Google Maps route and social links match structured company data and use safe external-link attributes. |  |  |  |
| Visual smoke | `npm run deploy:visual -- https://domain.example` | Core routes pass desktop, tablet and mobile horizontal-overflow and first-viewport content checks. |  |  |  |
| Contact delivery | `CONTACT_DELIVERY_CONFIRM=send CONTACT_DELIVERY_REPLY_TO=launch-test@example.de npm run contact:delivery -- https://domain.example` | Marked message is received in the real production mailbox. |  |  |  |
| Contact topic mailbox routing | Browser review plus real mailbox test message subjects | Contact form topic labels, service preselection and received email subjects match the operator intake workflow. |  |  |  |
| Search Console | Manual verification in Google Search Console | Ownership verified and `/sitemap.xml` submitted for the production domain. |  |  |  |
| GA4 realtime | Manual GA4 Realtime check after analytics consent | No page view before analytics consent; page view appears after consent. |  |  |  |
| Google Maps route | Manual check on `/kontakt` | Route target points to the final business address after map consent or route-link click. |  |  |  |
| Lighthouse / PageSpeed | Manual Lighthouse or PageSpeed run against production URL | Remaining Core Web Vitals, SEO and accessibility issues are recorded. |  |  |  |

## Outstanding Launch Decisions

| Decision | Owner | Due date | Outcome |
| --- | --- | --- | --- |
| Final legal review accepted |  |  |  |
| Real company/NAP data approved |  |  |  |
| Contact topic labels, email subjects and routing approved |  |  |  |
| Homepage copy, proof claims and media approved |  |  |  |
| About/contact page copy approved |  |  |  |
| Service wording and FAQ approved |  |  |  |
| Reference/photo/customer approvals complete |  |  |  |
| 3D planning examples and media approved |  |  |  |
| SMTP mailbox delivery accepted |  |  |  |
| Analytics/Search Console approved by legal/operator |  |  |  |

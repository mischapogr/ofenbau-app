# Production Input Checklist

Use this as the handover checklist before running `npm run launch:check`.
Run `npm run launch:contact` to regenerate
`docs/generated/CONTACT_DELIVERY_CHECKLIST.md`, the production SMTP and mailbox delivery
proof worksheet.
Run `npm run launch:deployment` to regenerate
`docs/generated/DEPLOYMENT_CUTOVER_CHECKLIST.md`, the DNS/HTTPS/hosting cutover worksheet.
Run `npm run launch:performance` to regenerate
`docs/generated/PERFORMANCE_EVIDENCE_CHECKLIST.md`, the local and production performance
evidence worksheet.
Run `npm run launch:inputs` to regenerate `docs/generated/OPERATOR_INPUT_FORM.md`, a
fillable worksheet for collecting real operator/legal/content/deployment values
before editing source files or setting production env vars.
Run `npm run launch:accounts` to regenerate
`docs/generated/ACCOUNT_VERIFICATION_CHECKLIST.md`, the account-level checklist for
Search Console, GA4 and Google Business Profile verification.
Run `npm run launch:actions` whenever the structured content or deployment env
changes; it regenerates `docs/generated/LAUNCH_ACTION_ITEMS.md` with the current open
handoff items.
Run `npm run launch:evidence` to regenerate
`docs/generated/LAUNCH_EVIDENCE_REPORT.md`, a current local evidence snapshot and
production proof gap summary.
Run `npm run content:review` after editing contact topics, homepage,
about/contact page, service, project/reference or 3D planning data; it regenerates
`docs/generated/CONTENT_REVIEW_CHECKLIST.md` for operator approval.
Run `npm run content:placeholders` after replacing demo values; it regenerates
`docs/generated/PLACEHOLDER_CONTENT_REPORT.md` with any remaining structured placeholder
or unresolved approval findings.
Run `npm run legal:review` after editing legal or privacy data; it regenerates
`docs/generated/LEGAL_REVIEW_CHECKLIST.md` for legal handoff.
Do not commit secrets or private mailbox credentials. Put deployment secrets in
the hosting environment.

## Company and Local SEO Data

| Needed input | Where to enter it | Verification |
| --- | --- | --- |
| Public company name | `src/data/company.js` -> `company.name` | `npm run company:check`, `npm run content:placeholders`, `npm run content:inventory` and `npm run launch:report` |
| Legal company/operator name | `src/data/company.js` -> `company.legalName` | `npm run company:check` and `npm run launch:report` |
| Street, ZIP, city and region | `src/data/company.js` -> `company.address` | `npm run company:check` and `npm run launch:report` |
| Phone number | `src/data/company.js` -> `company.phone.label` and `company.phone.href` | `npm run company:check`, `npm run deploy:links -- https://domain.example`, then click the phone link in the browser |
| WhatsApp number | `src/data/company.js` -> `company.whatsapp.label` and `company.whatsapp.href` | `npm run company:check`, `npm run deploy:links -- https://domain.example`, then click the WhatsApp link in the browser |
| Public contact email | `src/data/company.js` -> `company.email.label` and `company.email.href` | `npm run company:check`, `npm run deploy:links -- https://domain.example`, then click the mail link in the browser |
| Opening hours | `src/data/company.js` -> `company.hours` and `company.whatsapp.availability` | `npm run company:check` plus visual review on header/footer/contact page |
| Real social profile URLs | `src/data/company.js` -> `socialLinks` | `npm run launch:report` and `npm run deploy:links -- https://domain.example`; generic platform-homepage placeholders are hidden from the public footer until replaced |
| Real trust/certification claims | `src/data/company.js` -> `trustBadges` | `npm run company:check`, `npm run content:placeholders` and manual proof against certificates/approvals |
| NAP launch approval | `src/data/company.js` -> `companyProfileReview.napApprovedForLaunch=true` | `npm run launch:report` |
| Google Business Profile alignment | `src/data/company.js` -> `companyProfileReview.googleBusinessProfileAligned=true` | Compare live NAP/opening hours/service area with Google Business Profile, then run `npm run launch:report` |
| Google Maps route verification | `src/data/company.js` -> `companyProfileReview.mapRouteVerified=true` | `npm run deploy:links -- https://domain.example`, open `/kontakt`, use "Route planen", confirm the target is the final business address, then run `npm run launch:report` |

## Service and Reference Content

| Needed input | Where to enter it | Verification |
| --- | --- | --- |
| Final contact topics, email subjects and service-topic routing | `src/data/contactTopics.js`; set each topic review flag plus `contactTopicReview.approvedForLaunch=true` and `contactTopicRoutingReview.approvedForLaunch=true` after operator/mailbox approval | `npm run content:review`, `npm run content:inventory`, `npm run launch:report`, browser review of `/kontakt` and service-detail contact CTAs |
| Final homepage copy, proof claims and media | `src/data/home.js` plus homepage components; set `homepageContentReview.approvedForLaunch=true` after hero/about/process/CTA copy, public proof claims and media are approved | `npm run content:review`, `npm run content:assets`, `npm run content:inventory`, `npm run launch:report` and browser review of `/` |
| Final about/contact page copy | `src/data/pages.js`, `src/pages/AboutView.vue`, `src/pages/ContactView.vue`; set `publicPageContentReview.approvedForLaunch=true` after standalone page copy is approved | `npm run content:review`, `npm run content:inventory`, `npm run launch:report` and browser review of `/ueber-uns` and `/kontakt` |
| Final service wording | `src/data/services.js`; set `serviceContentReview.approvedForLaunch=true` after review | `npm run content:review`, `npm run content:inventory`, `npm run launch:report` and browser review of `/leistungen` |
| Certifications or proof points | `src/data/services.js` -> each service `proofPoints`; add separate certification claims only after legal/content approval | `npm run content:review`, `npm run content:assets`, `npm run content:inventory` and manual content review before switching `serviceContentReview.approvedForLaunch` |
| Approved project/reference photos | `public/images/` plus `src/data/projects.js` | `npm run content:assets` |
| Real project titles/descriptions/materials | `src/data/projects.js` | `npm run content:inventory` and browser review of `/projekte` |
| Photo rights and customer approvals | Keep approval records outside this repo; set each project `review.realReference`, `review.photoRightsApproved` and `review.customerApproved` in `src/data/projects.js`, then set `projectReferenceReview.approvedForLaunch=true` after all approvals | `npm run content:review`, `npm run content:assets`, `npm run content:inventory` and `npm run launch:report` |
| Approved 3D planning examples and visuals | `src/data/planning.js`; set each example `review.operatorApproved` and `review.mediaRightsApproved`, then set `planningContentReview.approvedForLaunch=true` after all examples are approved | `npm run content:review`, `npm run content:assets`, `npm run content:inventory`, `npm run launch:report` and browser review of `/leistungen/3d-planung` |

## Legal and Privacy Inputs

| Needed input | Where to enter it | Verification |
| --- | --- | --- |
| Final Impressum text | `src/pages/LegalView.vue`; set `legalProfile.noticeIsTemplate` to `false` in `src/data/legal.js` after review | `npm run legal:review` and `npm run launch:report` |
| Person responsible for content | `src/data/legal.js` -> `legalProfile.contentResponsible` | `npm run legal:review` and `npm run launch:report` |
| Final Datenschutz text | `src/components/PrivacyContent.vue`; set `legalProfile.privacyNeedsReview` to `false` in `src/data/legal.js` after review | `npm run legal:review`, `npm run privacy:check` and `npm run launch:report` |
| Analytics disclosure | `src/components/PrivacyContent.vue` | `npm run legal:review`, `npm run privacy:check`, legal review and `npm run deploy:analytics -- https://domain.example` |
| Google Maps disclosure | `src/components/PrivacyContent.vue` | `npm run legal:review`, `npm run privacy:check`, legal review and `npm run deploy:maps -- https://domain.example` |
| Processor contracts / AVV details | Legal records outside this repo; summarize required public text in `PrivacyContent.vue` | `npm run legal:review`, `npm run privacy:check` plus legal sign-off |

## Deployment and Account Values

`npm run launch:check` rejects example domains, Mailpit/dev SMTP hosts, `.test`
mailboxes, `G-XXXXXXXXXX` and verification-token placeholders.

| Needed input | Where to configure it | Verification |
| --- | --- | --- |
| Public HTTPS domain | `VITE_APP_URL` in deployment env | `npm run build`, then `npm run deploy:all -- https://domain.example` |
| Public app title override | Optional `VITE_APP_TITLE` in deployment env; leave empty to use `company.name` | `npm run launch:report` rejects placeholder titles and `npm run deploy:seo -- https://domain.example` verifies runtime titles |
| Contact API base URL | Usually `VITE_API_BASE_URL=/api` | `npm run launch:report` and `/api/healthz` after deploy |
| SMTP host/port/from/to | `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM`, `MAIL_TO` in deployment env | `npm run contact:smoke` locally, then `CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example` and confirm receipt in the real mailbox |
| Search Console token | `VITE_GOOGLE_SITE_VERIFICATION` in deployment env | Search Console ownership verification |
| GA4 measurement ID | `VITE_GA_MEASUREMENT_ID` in deployment env | `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example` and GA4 Realtime after analytics consent |
| DNS, HTTPS and security headers | Hosting provider / DNS provider plus `nginx.conf` | Browser, `npm run deploy:config` and `npm run deploy:smoke -- https://domain.example` to verify runtime response headers |

## Final Launch Evidence

Record these results in the project handover notes or ticket. Use
`docs/LAUNCH_EVIDENCE_TEMPLATE.md` as the copyable item-by-item evidence
template:

- `npm run preflight`
- `npm run launch:contact`
- `npm run launch:deployment`
- `npm run launch:performance`
- `npm run launch:inputs`
- `npm run launch:accounts`
- `npm run launch:actions`
- `npm run launch:evidence`
- `npm run content:review`
- `npm run content:placeholders`
- `npm run legal:review`
- `npm run launch:check` with production env values
- `npm run company:check`
- `npm run deploy:config`
- `npm run privacy:check`
- `npm run deploy:smoke -- https://domain.example`
- `npm run deploy:seo -- https://domain.example`
- `npm run deploy:all -- https://domain.example`
- `npm run deploy:links -- https://domain.example`
- `npm run deploy:visual -- https://domain.example`
- `npm run contact:smoke`
- Real contact form delivery received in the production mailbox via `npm run contact:delivery`
- Search Console property verified and sitemap submitted
- `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example`
- GA4 sends no hit before consent and sends hits after analytics consent
- Lighthouse/PageSpeed result for the production URL, plus any remaining Core Web Vitals issues after `npm run deploy:perf -- https://domain.example`

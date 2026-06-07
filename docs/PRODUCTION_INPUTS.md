# Production Input Checklist

Use this as the handover checklist before running `npm run launch:check`.
Do not commit secrets or private mailbox credentials. Put deployment secrets in
the hosting environment.

## Company and Local SEO Data

| Needed input | Where to enter it | Verification |
| --- | --- | --- |
| Public company name | `src/data/company.js` -> `company.name` | `npm run company:check`, `npm run content:inventory` and `npm run launch:report` |
| Legal company/operator name | `src/data/company.js` -> `company.legalName` | `npm run company:check` and `npm run launch:report` |
| Street, ZIP, city and region | `src/data/company.js` -> `company.address` | `npm run company:check` and `npm run launch:report` |
| Phone number | `src/data/company.js` -> `company.phone.label` and `company.phone.href` | `npm run company:check`, then click the phone link in the browser |
| WhatsApp number | `src/data/company.js` -> `company.whatsapp.label` and `company.whatsapp.href` | `npm run company:check`, then click the WhatsApp link in the browser |
| Public contact email | `src/data/company.js` -> `company.email.label` and `company.email.href` | `npm run company:check`, then click the mail link in the browser |
| Opening hours | `src/data/company.js` -> `company.hours` and `company.whatsapp.availability` | `npm run company:check` plus visual review on header/footer/contact page |
| Real social profile URLs | `src/data/company.js` -> `socialLinks` | `npm run launch:report` |
| Real trust/certification claims | `src/data/company.js` -> `trustBadges` | Manual proof against certificates/approvals |
| NAP launch approval | `src/data/company.js` -> `companyProfileReview.napApprovedForLaunch=true` | `npm run launch:report` |
| Google Business Profile alignment | `src/data/company.js` -> `companyProfileReview.googleBusinessProfileAligned=true` | Compare live NAP/opening hours/service area with Google Business Profile, then run `npm run launch:report` |
| Google Maps route verification | `src/data/company.js` -> `companyProfileReview.mapRouteVerified=true` | Open `/kontakt`, use "Route planen", confirm the target is the final business address, then run `npm run launch:report` |

## Service and Reference Content

| Needed input | Where to enter it | Verification |
| --- | --- | --- |
| Final service wording | `src/data/services.js`; set `serviceContentReview.approvedForLaunch=true` after review | `npm run content:inventory`, `npm run launch:report` and browser review of `/leistungen` |
| Certifications or proof points | `src/data/services.js` -> each service `proofPoints`; add separate certification claims only after legal/content approval | `npm run content:assets`, `npm run content:inventory` and manual content review before switching `serviceContentReview.approvedForLaunch` |
| Approved project/reference photos | `public/images/` plus `src/data/projects.js` | `npm run content:assets` |
| Real project titles/descriptions/materials | `src/data/projects.js` | `npm run content:inventory` and browser review of `/projekte` |
| Photo rights and customer approvals | Keep approval records outside this repo; set each project `review.realReference`, `review.photoRightsApproved` and `review.customerApproved` in `src/data/projects.js`, then set `projectReferenceReview.approvedForLaunch=true` after all approvals | `npm run content:assets`, `npm run content:inventory` and `npm run launch:report` |

## Legal and Privacy Inputs

| Needed input | Where to enter it | Verification |
| --- | --- | --- |
| Final Impressum text | `src/pages/LegalView.vue`; set `legalProfile.noticeIsTemplate` to `false` in `src/data/legal.js` after review | `npm run launch:report` |
| Person responsible for content | `src/data/legal.js` -> `legalProfile.contentResponsible` | `npm run launch:report` |
| Final Datenschutz text | `src/components/PrivacyContent.vue`; set `legalProfile.privacyNeedsReview` to `false` in `src/data/legal.js` after review | `npm run privacy:check` and `npm run launch:report` |
| Analytics disclosure | `src/components/PrivacyContent.vue` | `npm run privacy:check`, legal review and `npm run deploy:analytics -- https://domain.example` |
| Google Maps disclosure | `src/components/PrivacyContent.vue` | `npm run privacy:check`, legal review and `npm run deploy:maps -- https://domain.example` |
| Processor contracts / AVV details | Legal records outside this repo; summarize required public text in `PrivacyContent.vue` | `npm run privacy:check` plus legal sign-off |

## Deployment and Account Values

`npm run launch:check` rejects example domains, Mailpit/dev SMTP hosts, `.test`
mailboxes, `G-XXXXXXXXXX` and verification-token placeholders.

| Needed input | Where to configure it | Verification |
| --- | --- | --- |
| Public HTTPS domain | `VITE_APP_URL` in deployment env | `npm run build`, then `npm run deploy:smoke -- https://domain.example`, `npm run deploy:seo -- https://domain.example`, `npm run deploy:maps -- https://domain.example` and `npm run deploy:perf -- https://domain.example` |
| Contact API base URL | Usually `VITE_API_BASE_URL=/api` | `npm run launch:report` and `/api/healthz` after deploy |
| SMTP host/port/from/to | `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM`, `MAIL_TO` in deployment env | `npm run contact:smoke` locally, then `CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example` and confirm receipt in the real mailbox |
| Search Console token | `VITE_GOOGLE_SITE_VERIFICATION` in deployment env | Search Console ownership verification |
| GA4 measurement ID | `VITE_GA_MEASUREMENT_ID` in deployment env | `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example` and GA4 Realtime after analytics consent |
| DNS and HTTPS | Hosting provider / DNS provider | Browser and `npm run deploy:smoke -- https://domain.example` |

## Final Launch Evidence

Record these results in the project handover notes or ticket:

- `npm run preflight`
- `npm run launch:check` with production env values
- `npm run company:check`
- `npm run deploy:config`
- `npm run privacy:check`
- `npm run deploy:smoke -- https://domain.example`
- `npm run deploy:seo -- https://domain.example`
- `npm run deploy:maps -- https://domain.example`
- `npm run deploy:perf -- https://domain.example`
- `npm run contact:smoke`
- Real contact form delivery received in the production mailbox via `npm run contact:delivery`
- Search Console property verified and sitemap submitted
- `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example`
- GA4 sends no hit before consent and sends hits after analytics consent
- Lighthouse/PageSpeed result for the production URL

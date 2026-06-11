# Launch Evidence Report

Generated: 2026-06-11T06:09:44.211Z

This generated report summarizes current local launch evidence and production
handoff gaps. It is not a production approval and does not contain secrets,
mailbox credentials, legal contracts or private customer approvals.

## Context

| Field | Value |
| --- | --- |
| Git branch | main |
| Git commit | a016d35 |
| Site URL in current env | http://localhost:5173 |
| Contact API base URL in current env | /api |

## Summary

| Area | Status | Current evidence | Remaining production proof |
| --- | --- | --- | --- |
| Local preflight | Done | `npm run preflight` passed in the latest local run with route/header, SEO, analytics/Maps consent, performance, accessibility, contact-link, visual and desktop/mobile/tablet walkthrough checks. | Run again before production handoff if source or env changes. |
| Launch readiness | Partial | 22 blocker signals and 8 warning signals are still present for the current env/content state. | `npm run launch:check` must pass with real production values before launch. |
| Operator inputs | Done | `docs/OPERATOR_INPUT_FORM.md` is generated from the current company, legal, contact-topic, homepage, public-page, service, reference, 3D-planning and env state. | Fill real values outside this repo before editing source/deployment env. |
| Production evidence | Open | No production-domain route/header smoke, mailbox, Search Console, GA4 or Lighthouse evidence is stored in this repo. | Record final proof in the launch ticket using `docs/LAUNCH_EVIDENCE_TEMPLATE.md`. |

## Generated Artifacts

| Artifact | Path | Status | Detail |
| --- | --- | --- | --- |
| Contact delivery checklist | `docs/CONTACT_DELIVERY_CHECKLIST.md` | Present | 2026-06-11T06:09:43.012Z |
| Deployment cutover checklist | `docs/DEPLOYMENT_CUTOVER_CHECKLIST.md` | Present | 2026-06-11T06:09:43.197Z |
| Performance evidence checklist | `docs/PERFORMANCE_EVIDENCE_CHECKLIST.md` | Present | 2026-06-11T06:09:43.395Z |
| Operator input form | `docs/OPERATOR_INPUT_FORM.md` | Present | 2026-06-11T06:09:43.575Z |
| Account verification checklist | `docs/ACCOUNT_VERIFICATION_CHECKLIST.md` | Present | 2026-06-11T06:09:43.789Z |
| Launch action items | `docs/LAUNCH_ACTION_ITEMS.md` | Present | 39 open items |
| Placeholder content report | `docs/PLACEHOLDER_CONTENT_REPORT.md` | Present | 2026-06-11T06:09:40.993Z |
| Content review checklist | `docs/CONTENT_REVIEW_CHECKLIST.md` | Present | 2026-06-11T06:09:40.779Z |
| Legal review checklist | `docs/LEGAL_REVIEW_CHECKLIST.md` | Present | 2026-06-11T06:09:41.563Z |
| Content inventory | `docs/CONTENT_INVENTORY.json` | Present | generated JSON inventory |
| Visual smoke audit | `docs/audits/VISUAL_SMOKE.md` | Present | 2026-06-11T06:07:45.357Z |
| Launch evidence template | `docs/LAUNCH_EVIDENCE_TEMPLATE.md` | Present | manual production evidence template |

## Approval State

| Approval | Current state | Evidence needed before launch |
| --- | --- | --- |
| Company NAP/opening-hours | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. |
| Google Business Profile alignment | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. |
| Google Maps route verification | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. |
| Homepage content | false | Homepage hero, about, process, CTA copy, public proof claims and media must be reviewed against the final operator material before launch. |
| Public page content | false | Standalone public page copy for about and contact pages must be reviewed against the final operator positioning before launch. |
| Contact topics | false | Contact form topics, displayed labels, email subjects and service-topic routing must be reviewed against the final operator intake workflow before launch. |
| Contact topic routing | false | Service detail contact links and preselected contact topics must be checked against the final operator intake workflow before launch. |
| Service content | false | Service wording and proof points must be reviewed against the final operator offer before launch. |
| Reference gallery | false | Demo/generated project references must be replaced with approved real customer references before launch. |
| 3D planning examples | false | 3D planning examples and generated planning visuals must be reviewed against the final operator workflow before launch. |
| Impressum template replaced | false | Dies ist eine Vorlage. Ersetzen Sie die folgenden Angaben durch rechtsgültige Informationen. |
| Privacy legal review complete | false | Die konkrete Einbindung, Auftragsverarbeitung und Speicherdauer müssen vor dem Livegang mit den finalen Betreiberangaben geprüft und ergänzt werden. |

## Content Counts

| Area | Current count | Launch note |
| --- | --- | --- |
| Homepage review sections | 4 | 4 sections still need copy/media approval. |
| Public page review sections | 4 | 4 sections still need copy approval. |
| Contact topics | 7 | 7 topics still need operator/mailbox approval. |
| Services | 4 | Service wording/proof points/FAQs still need operator approval. |
| Project references | 9 | 9 references still need real-reference/photo/customer approval. |
| 3D planning examples | 4 | 4 examples still need operator/media approval. |

## Deployment Values

| Value | Current state | Ready for launch? |
| --- | --- | --- |
| VITE_APP_TITLE | Ofenbau Mustermann | Open |
| VITE_APP_URL | http://localhost:5173 | Open |
| VITE_API_BASE_URL | /api | Done |
| MAIL_HOST | mailpit | Open |
| MAIL_FROM | no-reply@ofenbau-mustermann.test | Open |
| MAIL_TO | (empty) | Open |
| VITE_GA_MEASUREMENT_ID | (empty) | Open |
| VITE_GOOGLE_SITE_VERIFICATION | (empty) | Open |

## Required Production Evidence

- `npm run launch:check` passes with real production env values.
- Contact-topic, homepage, public-page, service, reference and 3D-planning approval flags are set only after operator/legal/media approval evidence exists outside this repo.
- `npm run deploy:smoke -- https://domain.example` passes on the HTTPS domain, including runtime security/cache headers.
- `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example` passes on the HTTPS domain when GA4 is enabled; without GA4, `npm run deploy:all -- https://domain.example` proves no GA4 script loads.
- `CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example` reaches the real mailbox.
- Received mailbox subjects confirm the final contact topic labels and service-topic routing.
- Search Console ownership is verified and `/sitemap.xml` is submitted.
- GA4 Realtime is checked before and after analytics consent.
- Google Maps route target is checked against the final address.
- Lighthouse/PageSpeed production result is recorded.

## Useful Commands

```bash
npm run launch:evidence
npm run launch:inputs
npm run launch:actions
npm run launch:report
npm run launch:check
npm run preflight
npm run deploy:smoke -- https://domain.example
ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example
```

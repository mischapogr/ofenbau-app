# Launch Action Items

Generated: 2026-06-07T18:14:04.832Z

This file is generated from the current structured content, review flags and
deployment environment. It is a handoff checklist, not a launch approval.
Do not store secrets, mailbox credentials or private approval records here.

Open action count: 39

## Company / Local SEO

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Replace public company name | Ofenbau Mustermann | Set the real public company name used in header, footer and JSON-LD. | `npm run company:check` and browser review | `src/data/company.js` -> `company.name` |
| Replace VITE_APP_TITLE placeholder | VITE_APP_TITLE=Ofenbau Mustermann | Remove the override to use company.name or set it to the final public company/site name. | `npm run launch:report` and `npm run deploy:seo -- https://domain.example` | Deployment env -> `VITE_APP_TITLE` |
| Replace legal company/operator name | Ofenbau Mustermann — Ofen- & Fliesenmeister | Set the exact legal operator name used in Impressum, privacy text and JSON-LD. | `npm run company:check` and `npm run launch:report` | `src/data/company.js` -> `company.legalName` |
| Replace address and service area | Musterstraße 1, 12345 Musterstadt; Musterstadt und Umgebung | Set real street, ZIP, city, region and service area. | `npm run company:check`, browser review and Google Business Profile comparison | `src/data/company.js` -> `company.address` |
| Replace phone and WhatsApp numbers | +49 (0) 000 000000; +49 (0) 000 000000 | Set real labels and href values, then click-test tel and WhatsApp links. | `npm run company:check` and `npm run deploy:links -- https://domain.example` | `src/data/company.js` -> `company.phone`, `company.whatsapp` |
| Replace public email address | info@ofenbau-mustermann.test | Set the real public contact email label and mailto href. | `npm run company:check` and `npm run deploy:links -- https://domain.example` | `src/data/company.js` -> `company.email` |
| Replace generic Instagram profile URL | https://instagram.com | Set the real public profile URL or remove the link if no approved profile exists. | `npm run launch:report` and `npm run deploy:links -- https://domain.example` | `src/data/company.js` -> `socialLinks` |
| Replace generic Facebook profile URL | https://facebook.com | Set the real public profile URL or remove the link if no approved profile exists. | `npm run launch:report` and `npm run deploy:links -- https://domain.example` | `src/data/company.js` -> `socialLinks` |
| Replace generic Pinterest profile URL | https://pinterest.com | Set the real public profile URL or remove the link if no approved profile exists. | `npm run launch:report` and `npm run deploy:links -- https://domain.example` | `src/data/company.js` -> `socialLinks` |
| Approve final NAP/opening-hours data | false; Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | Compare site data with the real operator records, then set the launch approval flag. | `npm run launch:report` | `src/data/company.js` -> `companyProfileReview.napApprovedForLaunch` |
| Confirm Google Business Profile alignment | false; Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | Compare name, address, phone, hours and service area against the live Google Business Profile. | `npm run launch:report` | `src/data/company.js` -> `companyProfileReview.googleBusinessProfileAligned` |

## Google Maps

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Verify route target for final address | false; Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | Open `/kontakt`, use route planning, confirm the target is the final business address, then set the flag. | `npm run deploy:links -- https://domain.example`, `npm run deploy:maps -- https://domain.example` and manual route check | `src/data/company.js` -> `companyProfileReview.mapRouteVerified` |

## Legal / Privacy

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Replace template Impressum/legal text | noticeIsTemplate=true; Dies ist eine Vorlage. Ersetzen Sie die folgenden Angaben durch rechtsgültige Informationen. | Enter legally reviewed operator details and set `noticeIsTemplate` to `false`. | `npm run launch:report` | `src/data/legal.js`, `src/pages/LegalView.vue` |
| Replace content-responsible person | Max Mustermann | Set the legally correct content-responsible person and address. | `npm run launch:report` | `src/data/legal.js` -> `legalProfile.contentResponsible` |
| Complete privacy legal review | privacyNeedsReview=true; Die konkrete Einbindung, Auftragsverarbeitung und Speicherdauer müssen vor dem Livegang mit den finalen Betreiberangaben geprüft und ergänzt werden. | Finalize analytics, maps, contact form, processor, retention and rights disclosures, then set `privacyNeedsReview` to `false`. | `npm run privacy:check` and `npm run launch:report` | `src/data/legal.js`, `src/components/PrivacyContent.vue` |

## Homepage Content

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Approve homepage copy, proof claims and media | 4 homepage sections still need copy or media approval. | Review and approve: hero, about, process, cta. | `npm run content:review`, `npm run content:assets`, browser review of `/` | `src/data/home.js` -> each homepage section `review` object |
| Approve overall homepage content | false; Homepage hero, about, process, CTA copy, public proof claims and media must be reviewed against the final operator material before launch. | After homepage copy, public proof claims and media are approved, set the global homepage approval flag. | `npm run launch:report` | `src/data/home.js` -> `homepageContentReview.approvedForLaunch` |

## Public Page Content

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Approve about/contact page copy | 4 public page sections still need copy approval. | Review and approve: about-header, about-values, contact-header, contact-form-intro. | `npm run content:review`, browser review of `/ueber-uns` and `/kontakt` | `src/data/pages.js` -> each public page section `review` object |
| Approve overall public page content | false; Standalone public page copy for about and contact pages must be reviewed against the final operator positioning before launch. | After about/contact page copy is approved, set the global public page approval flag. | `npm run launch:report` | `src/data/pages.js` -> `publicPageContentReview.approvedForLaunch` |

## Contact Topics

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Approve contact topic labels and email subjects | 7 contact topics still need operator or mailbox-routing approval. | Review and approve: beratung, kachelofen-kaminbau, fliesenarbeiten, schornsteinbau, 3d-planung, sanierung, rueckruf. | `npm run content:review`, browser review of `/kontakt`, and contact mailbox subject review | `src/data/contactTopics.js` -> each topic `review` object |
| Approve overall contact topics | false; Contact form topics, displayed labels, email subjects and service-topic routing must be reviewed against the final operator intake workflow before launch. | After all visible topic labels and email subjects are approved, set the global contact topic approval flag. | `npm run launch:report` | `src/data/contactTopics.js` -> `contactTopicReview.approvedForLaunch` |
| Approve service-to-topic routing | false; Service detail contact links and preselected contact topics must be checked against the final operator intake workflow before launch. | Confirm service detail CTAs preselect the intended contact topics, then set the routing approval flag. | `npm run launch:report`, browser review of service detail CTAs and `/kontakt?topic=...` | `src/data/contactTopics.js` -> `contactTopicRoutingReview.approvedForLaunch` |

## Services

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Approve service wording, proof points and FAQs | false; Service wording and proof points must be reviewed against the final operator offer before launch. | Review 4 service pages against the real offer, update wording where needed, then set approval. | `npm run content:assets`, `npm run content:inventory`, browser review of `/leistungen` | `src/data/services.js` -> `serviceContentReview.approvedForLaunch` |

## References

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Replace/approve project references | 9 project references still need real-reference, photo-rights or customer approval. | Replace demo/generated references or document approvals for: p1, p2, p3, p4, p5, p6, p7, p8, p9. | `npm run content:assets`, `npm run content:inventory`, browser review of `/projekte` | `src/data/projects.js` -> each project `review` object |
| Approve overall reference gallery | false; Demo/generated project references must be replaced with approved real customer references before launch. | After all reference media and approvals are complete, set the global reference approval flag. | `npm run launch:report` | `src/data/projects.js` -> `projectReferenceReview.approvedForLaunch` |

## 3D Planning

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Approve planning examples and generated visuals | 4 planning examples still need operator or media-rights approval. | Confirm real workflow fit and media approval for: kachelofen-eckscheibe, schornstein-kaminofen, bad-fliesen, materialien. | `npm run content:review`, `npm run content:assets`, browser review of `/leistungen/3d-planung` | `src/data/planning.js` -> each planning example `review` object |
| Approve overall 3D planning content | false; 3D planning examples and generated planning visuals must be reviewed against the final operator workflow before launch. | After all planning examples and generated visuals are approved, set the global planning approval flag. | `npm run launch:report` | `src/data/planning.js` -> `planningContentReview.approvedForLaunch` |

## Deployment

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Configure production site URL | VITE_APP_URL=http://localhost:5173 | Set the public HTTPS production domain before building deploy assets. | `npm run build`, then `npm run deploy:all -- https://domain.example` | Deployment env -> `VITE_APP_URL` |
| Verify same-origin contact API after deploy | VITE_API_BASE_URL=/api | Use the bundled production contact API and confirm `/api/healthz` on the production domain. | `npm run deploy:all -- https://domain.example` | Deployment env -> `VITE_API_BASE_URL` |

## Contact Delivery

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Configure production SMTP host | MAIL_HOST=mailpit | Set the real SMTP host in the deployment environment. | `npm run launch:check` with production env values | Deployment env -> `MAIL_HOST` |
| Configure production sender address | MAIL_FROM=no-reply@ofenbau-mustermann.test | Set the real sender address allowed by the SMTP provider. | `npm run launch:check` with production env values | Deployment env -> `MAIL_FROM` |
| Configure production recipient mailbox | MAIL_TO is not set | Set the real mailbox that should receive website contact requests. | `npm run launch:check` with production env values | Deployment env -> `MAIL_TO` |
| Prove real mailbox delivery | No production mailbox proof is recorded in this repository. | Send a marked contact-form test after production SMTP values are configured and confirm receipt. | `CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example` | Launch evidence ticket |

## Analytics / Search Console

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Configure GA4 measurement ID after legal approval | VITE_GA_MEASUREMENT_ID is not set | Set the real GA4 measurement ID only after legal approval for analytics. | `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example` and GA4 Realtime | Deployment env -> `VITE_GA_MEASUREMENT_ID` |
| Configure Search Console verification token | VITE_GOOGLE_SITE_VERIFICATION is not set | Set the real verification token and verify the production property. | Search Console ownership verification and sitemap submission | Deployment env -> `VITE_GOOGLE_SITE_VERIFICATION` |

## Production Evidence

| Item | Current state | Next step | Verification | Source |
| --- | --- | --- | --- | --- |
| Record runtime route/header smoke results | No production route/header smoke evidence is recorded in this repository. | Run the route, robots, sitemap, API health and runtime security/cache header smoke against the public HTTPS domain and record output in the launch ticket. | `npm run deploy:smoke -- https://domain.example` | `docs/LAUNCH_EVIDENCE_TEMPLATE.md` |
| Record final deployment smoke results | No production deploy evidence is recorded in this repository. | Run the aggregate smoke suite against the public HTTPS domain and record output in the launch ticket. | `npm run deploy:all -- https://domain.example` | `docs/LAUNCH_EVIDENCE_TEMPLATE.md` |
| Record visual smoke evidence | No production visual smoke evidence is recorded in this repository. | Run the browser visual smoke against the public HTTPS domain and review the generated route/viewport report. | `npm run deploy:visual -- https://domain.example` | `docs/audits/VISUAL_SMOKE.md` |
| Record Lighthouse/PageSpeed evidence | No production Lighthouse/PageSpeed evidence is recorded in this repository. | Run Lighthouse or PageSpeed against the public HTTPS domain after deploy and track remaining issues. | Manual Lighthouse/PageSpeed report plus `npm run deploy:perf -- https://domain.example` | `docs/LAUNCH_EVIDENCE_TEMPLATE.md` |

## Useful Commands

```bash
npm run launch:contact
npm run launch:deployment
npm run launch:performance
npm run launch:inputs
npm run launch:accounts
npm run launch:actions
npm run launch:evidence
npm run content:review
npm run content:placeholders
npm run legal:review
npm run launch:report
npm run launch:check
npm run preflight
npm run deploy:links -- https://domain.example
npm run deploy:smoke -- https://domain.example
npm run deploy:all -- https://domain.example
CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example
```

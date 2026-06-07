# Operator Input Form

Generated: 2026-06-07T18:14:04.540Z

Use this worksheet to collect real operator, legal, content and deployment
inputs before editing source files or setting production environment values.
Do not store secrets, mailbox passwords, customer approval documents or legal
contracts in this repository.

## Company and Local SEO Inputs

| Input | Current repo value | Operator-provided value | Usage | Source to update |
| --- | --- | --- | --- | --- |
| Public company name | Ofenbau Mustermann |  | Header, footer, contact page and LocalBusiness JSON-LD | `src/data/company.js` -> `company.name` |
| Legal operator name | Ofenbau Mustermann — Ofen- & Fliesenmeister |  | Impressum, privacy text and LocalBusiness JSON-LD | `src/data/company.js` -> `company.legalName` |
| Street, ZIP, city, region | Musterstraße 1, 12345 Musterstadt; Musterstadt und Umgebung |  | Contact page, footer and local SEO | `src/data/company.js` -> `company.address` |
| Phone number | +49 (0) 000 000000; tel:+49000000000 |  | Header, contact page, footer and tel links | `src/data/company.js` -> `company.phone` |
| WhatsApp number and availability | +49 (0) 000 000000; https://wa.me/49000000000; Mo-Fr 08:00-17:00 Uhr erreichbar |  | Contact CTA and WhatsApp link | `src/data/company.js` -> `company.whatsapp` |
| Public contact email | info@ofenbau-mustermann.test; mailto:info@ofenbau-mustermann.test |  | Contact page, footer and mailto links | `src/data/company.js` -> `company.email` |
| Opening hours | Mo–Fr 08:00–17:00 Uhr |  | Header/footer/contact display and Google Business Profile comparison | `src/data/company.js` -> `company.hours` |
| Social profile URLs | Instagram: https://instagram.com; Facebook: https://facebook.com; Pinterest: https://pinterest.com |  | Footer/profile links; remove unavailable profiles instead of leaving generic URLs | `src/data/company.js` -> `socialLinks` |

## Approval Flags

| Approval | Current state | Operator/legal evidence needed | Source to update |
| --- | --- | --- | --- |
| NAP/opening-hours approval | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | `src/data/company.js` -> `companyProfileReview.napApprovedForLaunch` |
| Google Business Profile alignment | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | `src/data/company.js` -> `companyProfileReview.googleBusinessProfileAligned` |
| Google Maps route verified | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | `src/data/company.js` -> `companyProfileReview.mapRouteVerified` |
| Homepage content approved | false | Homepage hero, about, process, CTA copy, public proof claims and media must be reviewed against the final operator material before launch. | `src/data/home.js` -> `homepageContentReview.approvedForLaunch` |
| Public page content approved | false | Standalone public page copy for about and contact pages must be reviewed against the final operator positioning before launch. | `src/data/pages.js` -> `publicPageContentReview.approvedForLaunch` |
| Contact topics approved | false | Contact form topics, displayed labels, email subjects and service-topic routing must be reviewed against the final operator intake workflow before launch. | `src/data/contactTopics.js` -> `contactTopicReview.approvedForLaunch` |
| Contact topic routing approved | false | Service detail contact links and preselected contact topics must be checked against the final operator intake workflow before launch. | `src/data/contactTopics.js` -> `contactTopicRoutingReview.approvedForLaunch` |
| Service content approved | false | Service wording and proof points must be reviewed against the final operator offer before launch. | `src/data/services.js` -> `serviceContentReview.approvedForLaunch` |
| Reference gallery approved | false | Demo/generated project references must be replaced with approved real customer references before launch. | `src/data/projects.js` -> `projectReferenceReview.approvedForLaunch` |
| 3D planning examples approved | false | 3D planning examples and generated planning visuals must be reviewed against the final operator workflow before launch. | `src/data/planning.js` -> `planningContentReview.approvedForLaunch` |
| Impressum template replaced | false | Dies ist eine Vorlage. Ersetzen Sie die folgenden Angaben durch rechtsgültige Informationen. | `src/data/legal.js` -> `legalProfile.noticeIsTemplate` |
| Privacy text legally reviewed | false | Die konkrete Einbindung, Auftragsverarbeitung und Speicherdauer müssen vor dem Livegang mit den finalen Betreiberangaben geprüft und ergänzt werden. | `src/data/legal.js` -> `legalProfile.privacyNeedsReview` |

## Legal and Privacy Inputs

| Input | Current repo value | Operator/legal value | Usage | Source to update |
| --- | --- | --- | --- | --- |
| Content-responsible person | Max Mustermann |  | Legally correct person for content responsibility | `src/data/legal.js` -> `legalProfile.contentResponsible.name` |
| Content-responsible address | Anschrift wie oben |  | Legally correct address for content responsibility | `src/data/legal.js` -> `legalProfile.contentResponsible.address` |
| Processor / AVV details | Not stored in this repository |  | Hosting, SMTP, analytics and other processor records must be confirmed outside the repo | `src/components/PrivacyContent.vue` for public disclosure text |
| Retention periods / legal bases | Needs legal confirmation |  | Contact-form storage, analytics retention and request handling periods | `src/components/PrivacyContent.vue` |

## Homepage Review Inputs

| ID | Section | Source | Image | Copy approved? | Media approved? | Operator notes / required changes |
| --- | --- | --- | --- | --- | --- | --- |
| hero | Hero claim, introduction, proof stats and hero image | `src/components/HeroSection.vue` | `/images/hero.webp` | false | false |  |
| about | About teaser, craft claims, regional claim and about image | `src/components/AboutSection.vue` | `/images/about-craft.webp` | false | false |  |
| process | Homepage process timeline wording | `src/data/process.js and src/components/ProcessTimeline.vue` |  | false | true |  |
| cta | Homepage consultation CTA wording | `src/components/CTASection.vue` |  | false | true |  |

## Public Page Review Inputs

| ID | Page | Section | Source | Copy approved? | Operator notes / required changes |
| --- | --- | --- | --- | --- | --- |
| about-header | `/ueber-uns` | About page header claim and subtitle | `src/pages/AboutView.vue` | false |  |
| about-values | `/ueber-uns` | About page value cards | `src/data/pages.js -> aboutValues` | false |  |
| contact-header | `/kontakt` | Contact page header and consultation intro copy | `src/pages/ContactView.vue` | false |  |
| contact-form-intro | `/kontakt` | Contact form heading, helper text and submit wording | `src/pages/ContactView.vue and src/components/ContactForm.vue` | false |  |

## Contact Topic Review Inputs

| Value | Label | Email subject | Operator approved? | Mailbox routing approved? | Operator notes / required changes |
| --- | --- | --- | --- | --- | --- |
| beratung | Beratung allgemein | Beratung allgemein | false | false |  |
| kachelofen-kaminbau | Kachelöfen & Kaminbau | Kachelöfen & Kaminbau | false | false |  |
| fliesenarbeiten | Fliesenarbeiten | Fliesenarbeiten | false | false |  |
| schornsteinbau | Schornsteinbau & Sanierung | Schornsteinbau & Sanierung | false | false |  |
| 3d-planung | 3D-Planung & Entwürfe | 3D-Planung & Entwürfe | false | false |  |
| sanierung | Sanierung & Bestand | Sanierung & Bestand | false | false |  |
| rueckruf | Rückruf wünschen | Rückruf wünschen | false | false |  |

## Service Review Inputs

| Service | Route | Current proof points | Current FAQs | Operator notes / required changes |
| --- | --- | --- | --- | --- |
| Kachelöfen & Kaminbau | `/leistungen/kachelofen-kaminbau` | 3 | 2 |  |
| Schornsteinbau & Sanierung | `/leistungen/schornsteinbau` | 3 | 2 |  |
| Fliesenarbeiten | `/leistungen/fliesenarbeiten` | 3 | 2 |  |
| 3D-Planung & Entwürfe | `/leistungen/3d-planung` | 3 | 2 |  |

## Reference Approval Inputs

| ID | Current title | Image | Real reference? | Photo rights? | Customer approval? | Operator notes / replacement asset |
| --- | --- | --- | --- | --- | --- | --- |
| p1 | Kachelofen Landhaus | `/images/project-1-kachelofen-landhaus.webp` | false | false | false |  |
| p2 | Heizkamin Panorama | `/images/project-2-heizkamin-panorama.webp` | false | false | false |  |
| p3 | Kachelofen mit Sitzbank | `/images/project-3-kachelofen-sitzbank.webp` | false | false | false |  |
| p4 | Wohnraum-Fliesen XXL | `/images/project-4-wohnraum-fliesen-xxl.webp` | false | false | false |  |
| p5 | Kaminofen Stahl | `/images/project-5-kaminofen-stahl.webp` | false | false | false |  |
| p6 | Bad in Naturstein | `/images/project-6-bad-naturstein.webp` | false | false | false |  |
| p7 | Grundofen Eck | `/images/project-7-grundofen-eck.webp` | false | false | false |  |
| p8 | Kaminofen Speckstein | `/images/project-8-kaminofen-speckstein.webp` | false | false | false |  |
| p9 | Edelstahl-Außenschornstein | `/images/planning-example-schornstein-kaminofen.webp` | false | false | false |  |

## 3D Planning Approval Inputs

| ID | Current example | Image | Operator approved? | Media rights? | Operator notes / replacement asset |
| --- | --- | --- | --- | --- | --- |
| kachelofen-eckscheibe | Kachelofen mit Eckscheibe | `/images/planning-example-kachelofen-eckscheibe.webp` | false | false |  |
| schornstein-kaminofen | Kaminofen mit Außenschornstein | `/images/planning-example-schornstein-kaminofen.webp` | false | false |  |
| bad-fliesen | Badplanung mit Großformaten | `/images/planning-example-bad-fliesen.webp` | false | false |  |
| materialien | Material- und Detailauswahl | `/images/planning-example-materialien.webp` | false | false |  |

## Deployment and Account Inputs

| Input | Current state | Production value / owner | Usage | Where to configure |
| --- | --- | --- | --- | --- |
| Public app title override | VITE_APP_TITLE=Ofenbau Mustermann |  | Optional; leave empty to use `company.name`, or set exactly to the final public company/site name | Deployment env -> `VITE_APP_TITLE` |
| Production HTTPS URL | VITE_APP_URL=http://localhost:5173 |  | Public domain used for sitemap, robots, canonicals and JSON-LD | Deployment env -> `VITE_APP_URL` |
| Contact API base URL | VITE_API_BASE_URL=/api |  | Usually same-origin `/api` when the bundled contact API is deployed | Deployment env -> `VITE_API_BASE_URL` |
| SMTP host | MAIL_HOST=mailpit |  | Real production SMTP host; do not commit credentials | Deployment env -> `MAIL_HOST` |
| SMTP port | MAIL_PORT=1025 |  | Real numeric SMTP port | Deployment env -> `MAIL_PORT` |
| SMTP sender | MAIL_FROM=no-reply@ofenbau-mustermann.test |  | Sender address accepted by the SMTP provider | Deployment env -> `MAIL_FROM` |
| Contact recipient mailbox | MAIL_TO is not set |  | Mailbox that receives production contact requests | Deployment env -> `MAIL_TO` |
| GA4 measurement ID | VITE_GA_MEASUREMENT_ID is not set |  | Only after legal/operator approval for analytics | Deployment env -> `VITE_GA_MEASUREMENT_ID` |
| Search Console verification token | VITE_GOOGLE_SITE_VERIFICATION is not set |  | Google Search Console ownership verification | Deployment env -> `VITE_GOOGLE_SITE_VERIFICATION` |

## Verification Commands

```bash
npm run launch:inputs
npm run launch:actions
npm run content:review
npm run legal:review
npm run launch:report
npm run preflight
```

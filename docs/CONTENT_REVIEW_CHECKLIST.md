# Content Review Checklist

Generated: 2026-06-07T18:14:02.393Z

Use this as the operator/content-review worksheet for service pages and
project references plus 3D planning examples. Approval records, photo releases,
customer consent and media-rights documents should stay outside this
repository; only the review flags live here.

## Summary

| Area | Status | Current state | Approval source |
| --- | --- | --- | --- |
| Homepage | Open | Homepage hero, about, process, CTA copy, public proof claims and media must be reviewed against the final operator material before launch. | `src/data/home.js` -> `homepageContentReview.approvedForLaunch` and each homepage section `review` |
| Public pages | Open | Standalone public page copy for about and contact pages must be reviewed against the final operator positioning before launch. | `src/data/pages.js` -> `publicPageContentReview.approvedForLaunch` and each public page section `review` |
| Contact topics | Open | Contact form topics, displayed labels, email subjects and service-topic routing must be reviewed against the final operator intake workflow before launch. Service detail contact links and preselected contact topics must be checked against the final operator intake workflow before launch. | `src/data/contactTopics.js` -> topic review flags and routing approval |
| Services | Open | Service wording and proof points must be reviewed against the final operator offer before launch. | `src/data/services.js` -> `serviceContentReview.approvedForLaunch` |
| References | Open | Demo/generated project references must be replaced with approved real customer references before launch. | `src/data/projects.js` -> `projectReferenceReview.approvedForLaunch` and each project `review` |
| 3D planning examples | Open | 3D planning examples and generated planning visuals must be reviewed against the final operator workflow before launch. | `src/data/planning.js` -> `planningContentReview.approvedForLaunch` and each example `review` |

## Homepage Review

Set each homepage review flag only after hero/about/process/CTA copy, public
proof claims and media are approved for the final operator. Set
`homepageContentReview.approvedForLaunch=true` only when all homepage rows are
complete.

| ID | Section | Source | Image | Copy approval | Media approval | Note |
| --- | --- | --- | --- | --- | --- | --- |
| hero | Hero claim, introduction, proof stats and hero image | `src/components/HeroSection.vue` | `/images/hero.webp` | false | false | Confirm this homepage section uses final approved copy, claims and media before launch. |
| about | About teaser, craft claims, regional claim and about image | `src/components/AboutSection.vue` | `/images/about-craft.webp` | false | false | Confirm this homepage section uses final approved copy, claims and media before launch. |
| process | Homepage process timeline wording | `src/data/process.js and src/components/ProcessTimeline.vue` |  | false | true | Confirm this homepage section uses final approved copy, claims and media before launch. |
| cta | Homepage consultation CTA wording | `src/components/CTASection.vue` |  | false | true | Confirm this homepage section uses final approved copy, claims and media before launch. |

## Public Page Review

Set each public page review flag only after the about/contact page copy is
approved for the final operator. Set
`publicPageContentReview.approvedForLaunch=true` only when all public page rows
are complete.

| ID | Page | Section | Source | Copy approval | Note |
| --- | --- | --- | --- | --- | --- |
| about-header | `/ueber-uns` | About page header claim and subtitle | `src/pages/AboutView.vue` | false | Confirm this public page section uses final approved copy before launch. |
| about-values | `/ueber-uns` | About page value cards | `src/data/pages.js -> aboutValues` | false | Confirm this public page section uses final approved copy before launch. |
| contact-header | `/kontakt` | Contact page header and consultation intro copy | `src/pages/ContactView.vue` | false | Confirm this public page section uses final approved copy before launch. |
| contact-form-intro | `/kontakt` | Contact form heading, helper text and submit wording | `src/pages/ContactView.vue and src/components/ContactForm.vue` | false | Confirm this public page section uses final approved copy before launch. |

## Contact Topic Review

Set each contact topic review flag only after the displayed label, email
subject and service-detail preselection match the final operator intake
workflow. Set `contactTopicReview.approvedForLaunch=true` and
`contactTopicRoutingReview.approvedForLaunch=true` only when all rows are
complete.

| Value | Label | Email subject | Operator approval | Mailbox routing | Note |
| --- | --- | --- | --- | --- | --- |
| beratung | Beratung allgemein | Beratung allgemein | false | false | Confirm this contact topic label and email subject match the final request handling workflow before launch. |
| kachelofen-kaminbau | Kachelöfen & Kaminbau | Kachelöfen & Kaminbau | false | false | Confirm this contact topic label and email subject match the final request handling workflow before launch. |
| fliesenarbeiten | Fliesenarbeiten | Fliesenarbeiten | false | false | Confirm this contact topic label and email subject match the final request handling workflow before launch. |
| schornsteinbau | Schornsteinbau & Sanierung | Schornsteinbau & Sanierung | false | false | Confirm this contact topic label and email subject match the final request handling workflow before launch. |
| 3d-planung | 3D-Planung & Entwürfe | 3D-Planung & Entwürfe | false | false | Confirm this contact topic label and email subject match the final request handling workflow before launch. |
| sanierung | Sanierung & Bestand | Sanierung & Bestand | false | false | Confirm this contact topic label and email subject match the final request handling workflow before launch. |
| rueckruf | Rückruf wünschen | Rückruf wünschen | false | false | Confirm this contact topic label and email subject match the final request handling workflow before launch. |

## Service Review

Set `serviceContentReview.approvedForLaunch=true` only after every service
title, intro, description, bullet, proof point and FAQ answer matches the real
operator offer and legal/content approval has been completed.

| Service | Route | Bullets | Proof points | FAQs | Image | Review status |
| --- | --- | --- | --- | --- | --- | --- |
| Kachelöfen & Kaminbau | `/leistungen/kachelofen-kaminbau` | 4 | 3 | 2 | `/images/service-kachelofen.webp` | Open |
| Schornsteinbau & Sanierung | `/leistungen/schornsteinbau` | 4 | 3 | 2 | `/images/planning-example-schornstein-kaminofen.webp` | Open |
| Fliesenarbeiten | `/leistungen/fliesenarbeiten` | 4 | 3 | 2 | `/images/service-fliesen.webp` | Open |
| 3D-Planung & Entwürfe | `/leistungen/3d-planung` | 4 | 3 | 2 | `/images/service-3d-planung.webp` | Open |

## Reference Review

Set each project review flag only after the project is a real reference, the
media rights are approved, and customer approval is documented outside this
repository. Set `projectReferenceReview.approvedForLaunch=true` only when all
project rows are complete.

| ID | Project | Image | Real reference | Photo rights | Customer approval | Note |
| --- | --- | --- | --- | --- | --- | --- |
| p1 | Kachelofen Landhaus | `/images/project-1-kachelofen-landhaus.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p2 | Heizkamin Panorama | `/images/project-2-heizkamin-panorama.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p3 | Kachelofen mit Sitzbank | `/images/project-3-kachelofen-sitzbank.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p4 | Wohnraum-Fliesen XXL | `/images/project-4-wohnraum-fliesen-xxl.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p5 | Kaminofen Stahl | `/images/project-5-kaminofen-stahl.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p6 | Bad in Naturstein | `/images/project-6-bad-naturstein.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p7 | Grundofen Eck | `/images/project-7-grundofen-eck.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p8 | Kaminofen Speckstein | `/images/project-8-kaminofen-speckstein.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |
| p9 | Edelstahl-Außenschornstein | `/images/planning-example-schornstein-kaminofen.webp` | false | false | false | Replace demo/generated media with a real customer reference and document photo/customer approval before launch. |

## 3D Planning Example Review

Set each planning example review flag only after the operator confirms the
example reflects the real planning workflow and all generated/visual media is
approved for public use. Set `planningContentReview.approvedForLaunch=true`
only when all planning example rows are complete.

| ID | Example | Category | Image | Views | Operator approval | Media rights | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| kachelofen-eckscheibe | Kachelofen mit Eckscheibe | Ofen | `/images/planning-example-kachelofen-eckscheibe.webp` | 3 | false | false | Confirm the planning example reflects a real operator workflow and that generated/visual media is approved before launch. |
| schornstein-kaminofen | Kaminofen mit Außenschornstein | Schornstein | `/images/planning-example-schornstein-kaminofen.webp` | 3 | false | false | Confirm the planning example reflects a real operator workflow and that generated/visual media is approved before launch. |
| bad-fliesen | Badplanung mit Großformaten | Fliesen | `/images/planning-example-bad-fliesen.webp` | 3 | false | false | Confirm the planning example reflects a real operator workflow and that generated/visual media is approved before launch. |
| materialien | Material- und Detailauswahl | Material | `/images/planning-example-materialien.webp` | 3 | false | false | Confirm the planning example reflects a real operator workflow and that generated/visual media is approved before launch. |

## Verification Commands

```bash
npm run content:review
npm run content:assets
npm run content:inventory
npm run launch:actions
npm run launch:report
```

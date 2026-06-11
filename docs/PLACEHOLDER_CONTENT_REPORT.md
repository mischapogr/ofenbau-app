# Placeholder Content Report

Generated: 2026-06-11T06:09:40.993Z

This generated report lists structured content fields that still look like
demo data, placeholders, or unresolved launch approvals. It is intentionally
strict: real legal records, mailbox credentials and private customer approval
documents must stay outside this repository.

Open placeholder/review findings: 51

## Company / Local SEO

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| company.name | Ofenbau Mustermann | Public company name still matches placeholder patterns. | src/data/company.js | npm run company:check |
| company.legalName | Ofenbau Mustermann — Ofen- & Fliesenmeister | Legal operator name still matches placeholder patterns. | src/data/company.js | npm run launch:report |
| company.address | Musterstraße 1, 12345 Musterstadt; Musterstadt und Umgebung | Address or service area still matches placeholder patterns. | src/data/company.js | npm run company:check |
| company.phone | +49 (0) 000 000000; tel:+49000000000 | Phone label or tel link still matches placeholder patterns. | src/data/company.js | npm run company:check |
| company.whatsapp | +49 (0) 000 000000; https://wa.me/49000000000 | WhatsApp label or link still matches placeholder patterns. | src/data/company.js | npm run company:check |
| company.email | info@ofenbau-mustermann.test; mailto:info@ofenbau-mustermann.test | Public email still matches placeholder patterns. | src/data/company.js | npm run company:check |
| socialLinks.Instagram | https://instagram.com | Social profile URL is still the generic platform homepage. | src/data/company.js | npm run launch:report |
| socialLinks.Facebook | https://facebook.com | Social profile URL is still the generic platform homepage. | src/data/company.js | npm run launch:report |
| socialLinks.Pinterest | https://pinterest.com | Social profile URL is still the generic platform homepage. | src/data/company.js | npm run launch:report |
| trustBadges.2 | Regional in Musterstadt | Trust/certification claim still matches placeholder patterns. | src/data/company.js | npm run company:check plus manual proof against certificates/approvals |
| companyProfileReview.napApprovedForLaunch | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | src/data/company.js | npm run launch:report |
| companyProfileReview.googleBusinessProfileAligned | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | src/data/company.js | npm run launch:report |

## Google Maps

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| companyProfileReview.mapRouteVerified | false | Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch. | src/data/company.js | npm run deploy:maps -- https://domain.example |

## Legal / Privacy

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| legalProfile.noticeIsTemplate | true | Dies ist eine Vorlage. Ersetzen Sie die folgenden Angaben durch rechtsgültige Informationen. | src/data/legal.js and src/pages/LegalView.vue | npm run legal:review |
| legalProfile.contentResponsible.name | Max Mustermann | Content-responsible person still matches placeholder patterns. | src/data/legal.js | npm run legal:review |
| legalProfile.privacyNeedsReview | true | Die konkrete Einbindung, Auftragsverarbeitung und Speicherdauer müssen vor dem Livegang mit den finalen Betreiberangaben geprüft und ergänzt werden. | src/data/legal.js and src/components/PrivacyContent.vue | npm run privacy:check |

## Services

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| serviceContentReview.approvedForLaunch | false | Service wording and proof points must be reviewed against the final operator offer before launch. | src/data/services.js | npm run content:review |

## Homepage

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| homepageContentReview.approvedForLaunch | false | Homepage hero, about, process, CTA copy, public proof claims and media must be reviewed against the final operator material before launch. | src/data/home.js and homepage components | npm run content:review |
| homepageReviewSections.hero.review | copy approval, media approval | Homepage section still needs final copy/claim and media approval. | src/components/HeroSection.vue | npm run content:review |
| homepageReviewSections.about.review | copy approval, media approval | Homepage section still needs final copy/claim and media approval. | src/components/AboutSection.vue | npm run content:review |
| homepageReviewSections.process.review | copy approval | Homepage section still needs final copy/claim and media approval. | src/data/process.js and src/components/ProcessTimeline.vue | npm run content:review |
| homepageReviewSections.cta.review | copy approval | Homepage section still needs final copy/claim and media approval. | src/components/CTASection.vue | npm run content:review |

## Public Pages

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| publicPageContentReview.approvedForLaunch | false | Standalone public page copy for about and contact pages must be reviewed against the final operator positioning before launch. | src/data/pages.js, src/pages/AboutView.vue and src/pages/ContactView.vue | npm run content:review |
| publicPageReviewSections.about-header.review | copy approval | Standalone public page section still needs final copy approval. | src/pages/AboutView.vue | npm run content:review |
| publicPageReviewSections.about-values.review | copy approval | Standalone public page section still needs final copy approval. | src/data/pages.js -> aboutValues | npm run content:review |
| publicPageReviewSections.contact-header.review | copy approval | Standalone public page section still needs final copy approval. | src/pages/ContactView.vue | npm run content:review |
| publicPageReviewSections.contact-form-intro.review | copy approval | Standalone public page section still needs final copy approval. | src/pages/ContactView.vue and src/components/ContactForm.vue | npm run content:review |

## Contact Topics

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| contactTopicReview.approvedForLaunch | false | Contact form topics, displayed labels, email subjects and service-topic routing must be reviewed against the final operator intake workflow before launch. | src/data/contactTopics.js | npm run content:review |
| contactTopicRoutingReview.approvedForLaunch | false | Service detail contact links and preselected contact topics must be checked against the final operator intake workflow before launch. | src/data/contactTopics.js | npm run content:review |
| contactTopics.beratung.review | operator approval, mailbox routing | Contact topic label and email subject still need final intake/mailbox approval. | src/data/contactTopics.js | npm run content:review |
| contactTopics.kachelofen-kaminbau.review | operator approval, mailbox routing | Contact topic label and email subject still need final intake/mailbox approval. | src/data/contactTopics.js | npm run content:review |
| contactTopics.fliesenarbeiten.review | operator approval, mailbox routing | Contact topic label and email subject still need final intake/mailbox approval. | src/data/contactTopics.js | npm run content:review |
| contactTopics.schornsteinbau.review | operator approval, mailbox routing | Contact topic label and email subject still need final intake/mailbox approval. | src/data/contactTopics.js | npm run content:review |
| contactTopics.3d-planung.review | operator approval, mailbox routing | Contact topic label and email subject still need final intake/mailbox approval. | src/data/contactTopics.js | npm run content:review |
| contactTopics.sanierung.review | operator approval, mailbox routing | Contact topic label and email subject still need final intake/mailbox approval. | src/data/contactTopics.js | npm run content:review |
| contactTopics.rueckruf.review | operator approval, mailbox routing | Contact topic label and email subject still need final intake/mailbox approval. | src/data/contactTopics.js | npm run content:review |

## References

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| projectReferenceReview.approvedForLaunch | false | Demo/generated project references must be replaced with approved real customer references before launch. | src/data/projects.js | npm run launch:report |
| projects.p1.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p2.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p3.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p4.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p5.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p6.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p7.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p8.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |
| projects.p9.review | real reference, photo rights, customer approval | Project still needs real-reference, photo-rights or customer approval. | src/data/projects.js | npm run content:review |

## 3D Planning

| Field | Current state | Reason | Source | Verification |
| --- | --- | --- | --- | --- |
| planningContentReview.approvedForLaunch | false | 3D planning examples and generated planning visuals must be reviewed against the final operator workflow before launch. | src/data/planning.js | npm run content:review |
| planningExamples.kachelofen-eckscheibe.review | operator approval, media rights | 3D planning example still needs operator workflow and media approval. | src/data/planning.js | npm run content:review |
| planningExamples.schornstein-kaminofen.review | operator approval, media rights | 3D planning example still needs operator workflow and media approval. | src/data/planning.js | npm run content:review |
| planningExamples.bad-fliesen.review | operator approval, media rights | 3D planning example still needs operator workflow and media approval. | src/data/planning.js | npm run content:review |
| planningExamples.materialien.review | operator approval, media rights | 3D planning example still needs operator workflow and media approval. | src/data/planning.js | npm run content:review |

## Useful Commands

```bash
npm run content:placeholders
npm run content:review
npm run content:inventory
npm run launch:actions
npm run launch:report
```

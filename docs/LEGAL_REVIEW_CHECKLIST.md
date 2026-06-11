# Legal Review Checklist

Generated: 2026-06-11T06:09:41.563Z

Use this as a legal handoff worksheet for Impressum and Datenschutz review.
It does not replace legal advice. Do not store private legal records, processor
contracts or mailbox credentials in this repository.

Open legal review items: 7

| Area | Item | Status | Current state | Next step | Source |
| --- | --- | --- | --- | --- | --- |
| Impressum | Replace template notice | Open | noticeIsTemplate=true | Enter legally reviewed operator details and remove template state. | `src/data/legal.js` -> `legalProfile.noticeIsTemplate`, `src/pages/LegalView.vue` |
| Impressum | Confirm legal operator name | Open | Ofenbau Mustermann — Ofen- & Fliesenmeister | Set the exact legal operator name and verify it against business records. | `src/data/company.js` -> `company.legalName` |
| Impressum | Confirm legal address | Open | Musterstraße 1, 12345 Musterstadt | Set the real operator address used for legal notice and privacy controller data. | `src/data/company.js` -> `company.address` |
| Impressum | Confirm contact channels | Open | +49 (0) 000 000000; info@ofenbau-mustermann.test | Set legally correct public phone and email contact data. | `src/data/company.js` -> `company.phone`, `company.email` |
| Impressum | Replace content-responsible person | Open | Max Mustermann; Anschrift wie oben | Set the legally correct content-responsible person and address. | `src/data/legal.js` -> `legalProfile.contentResponsible` |
| Datenschutz | Complete privacy legal review flag | Open | privacyNeedsReview=true | Finalize privacy wording for the real operator, processors, retention periods and legal bases. | `src/data/legal.js` -> `legalProfile.privacyNeedsReview` |
| Datenschutz | Contact form disclosure | Done | Contact form section present | Confirm the disclosure matches real contact-form storage and handling. | `src/components/PrivacyContent.vue` |
| Datenschutz | Analytics consent disclosure | Done | Google Analytics consent section present | Confirm GA4 disclosure with legal review before setting production GA4 env values. | `src/components/PrivacyContent.vue`, `src/composables/useAnalytics.js` |
| Datenschutz | Google Maps consent disclosure | Done | Google Maps comfort-consent section present | Confirm Maps disclosure and route-link behavior after the final address is configured. | `src/components/PrivacyContent.vue`, `src/components/GoogleMapEmbed.vue` |
| Datenschutz | Rights disclosure | Done | Core data-subject rights listed | Legal review should confirm completeness for the actual operator. | `src/components/PrivacyContent.vue` |
| Datenschutz | Processor, retention and legal-basis details | Open | Die konkrete Einbindung, Auftragsverarbeitung und Speicherdauer müssen vor dem Livegang mit den finalen Betreiberangaben geprüft und ergänzt werden. | Replace the pre-live review placeholder with final processor, retention and legal-basis details. | `src/components/PrivacyContent.vue`, legal records outside repo |

## Verification Commands

```bash
npm run legal:review
npm run privacy:check
npm run launch:actions
npm run launch:report
```

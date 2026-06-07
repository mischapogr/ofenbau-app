import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { company } from '../src/data/company.js'
import { legalProfile } from '../src/data/legal.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'LEGAL_REVIEW_CHECKLIST.md')

const legalView = readFileSync(join(root, 'src/pages/LegalView.vue'), 'utf8')
const privacyContent = readFileSync(join(root, 'src/components/PrivacyContent.vue'), 'utf8')

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

function status(done) {
  return done ? 'Done' : 'Open'
}

function includesAll(content, patterns) {
  return patterns.every((pattern) => pattern.test(content))
}

const rows = [
  {
    area: 'Impressum',
    item: 'Replace template notice',
    current: `noticeIsTemplate=${legalProfile.noticeIsTemplate}`,
    done: legalProfile.noticeIsTemplate !== true && !/Dies ist eine Vorlage/i.test(legalView),
    nextStep: 'Enter legally reviewed operator details and remove template state.',
    source: '`src/data/legal.js` -> `legalProfile.noticeIsTemplate`, `src/pages/LegalView.vue`',
  },
  {
    area: 'Impressum',
    item: 'Confirm legal operator name',
    current: company.legalName,
    done: !/muster|mustermann|\.test|000000/i.test(company.legalName),
    nextStep: 'Set the exact legal operator name and verify it against business records.',
    source: '`src/data/company.js` -> `company.legalName`',
  },
  {
    area: 'Impressum',
    item: 'Confirm legal address',
    current: `${company.address.street}, ${company.address.zip} ${company.address.city}`,
    done: !/muster|mustermann|12345/i.test(
      `${company.address.street} ${company.address.zip} ${company.address.city}`
    ),
    nextStep: 'Set the real operator address used for legal notice and privacy controller data.',
    source: '`src/data/company.js` -> `company.address`',
  },
  {
    area: 'Impressum',
    item: 'Confirm contact channels',
    current: `${company.phone.label}; ${company.email.label}`,
    done: !/000000|\.test|muster|mustermann/i.test(`${company.phone.label} ${company.email.label}`),
    nextStep: 'Set legally correct public phone and email contact data.',
    source: '`src/data/company.js` -> `company.phone`, `company.email`',
  },
  {
    area: 'Impressum',
    item: 'Replace content-responsible person',
    current: `${legalProfile.contentResponsible.name}; ${legalProfile.contentResponsible.address}`,
    done: !/muster|mustermann|Anschrift wie oben/i.test(
      `${legalProfile.contentResponsible.name} ${legalProfile.contentResponsible.address}`
    ),
    nextStep: 'Set the legally correct content-responsible person and address.',
    source: '`src/data/legal.js` -> `legalProfile.contentResponsible`',
  },
  {
    area: 'Datenschutz',
    item: 'Complete privacy legal review flag',
    current: `privacyNeedsReview=${legalProfile.privacyNeedsReview}`,
    done: legalProfile.privacyNeedsReview !== true,
    nextStep:
      'Finalize privacy wording for the real operator, processors, retention periods and legal bases.',
    source: '`src/data/legal.js` -> `legalProfile.privacyNeedsReview`',
  },
  {
    area: 'Datenschutz',
    item: 'Contact form disclosure',
    current: 'Contact form section present',
    done: includesAll(privacyContent, [/Kontaktformular/i, /Kontaktdaten/i]),
    nextStep: 'Confirm the disclosure matches real contact-form storage and handling.',
    source: '`src/components/PrivacyContent.vue`',
  },
  {
    area: 'Datenschutz',
    item: 'Analytics consent disclosure',
    current: 'Google Analytics consent section present',
    done: includesAll(privacyContent, [/Google Analytics/i, /Analyse/i, /nicht geladen/i]),
    nextStep: 'Confirm GA4 disclosure with legal review before setting production GA4 env values.',
    source: '`src/components/PrivacyContent.vue`, `src/composables/useAnalytics.js`',
  },
  {
    area: 'Datenschutz',
    item: 'Google Maps consent disclosure',
    current: 'Google Maps comfort-consent section present',
    done: includesAll(privacyContent, [/Google Maps/i, /Komfort/i, /Karte laden/i]),
    nextStep: 'Confirm Maps disclosure and route-link behavior after the final address is configured.',
    source: '`src/components/PrivacyContent.vue`, `src/components/GoogleMapEmbed.vue`',
  },
  {
    area: 'Datenschutz',
    item: 'Rights disclosure',
    current: 'Core data-subject rights listed',
    done: includesAll(privacyContent, [/Auskunft/i, /Berichtigung/i, /Löschung/i, /Einschränkung/i]),
    nextStep: 'Legal review should confirm completeness for the actual operator.',
    source: '`src/components/PrivacyContent.vue`',
  },
  {
    area: 'Datenschutz',
    item: 'Processor, retention and legal-basis details',
    current: legalProfile.privacyReviewNote,
    done:
      legalProfile.privacyNeedsReview !== true &&
      includesAll(privacyContent, [/Auftragsverarbeitung/i, /Speicherdauer/i, /Rechtsgrundlagen/i]),
    nextStep:
      'Replace the pre-live review placeholder with final processor, retention and legal-basis details.',
    source: '`src/components/PrivacyContent.vue`, legal records outside repo',
  },
]

const openCount = rows.filter((row) => !row.done).length

const lines = [
  '# Legal Review Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Use this as a legal handoff worksheet for Impressum and Datenschutz review.',
  'It does not replace legal advice. Do not store private legal records, processor',
  'contracts or mailbox credentials in this repository.',
  '',
  `Open legal review items: ${openCount}`,
  '',
  '| Area | Item | Status | Current state | Next step | Source |',
  '| --- | --- | --- | --- | --- | --- |',
]

for (const row of rows) {
  lines.push(
    `| ${escapeTable(row.area)} | ${escapeTable(row.item)} | ${status(row.done)} | ${escapeTable(row.current)} | ${escapeTable(row.nextStep)} | ${escapeTable(row.source)} |`
  )
}

lines.push(
  '',
  '## Verification Commands',
  '',
  '```bash',
  'npm run legal:review',
  'npm run privacy:check',
  'npm run launch:actions',
  'npm run launch:report',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Open legal review items: ${openCount}`)

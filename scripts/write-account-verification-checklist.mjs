import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { companyProfileReview } from '../src/data/company.js'
import { legalProfile } from '../src/data/legal.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'generated', 'ACCOUNT_VERIFICATION_CHECKLIST.md')

const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const gaId = process.env.VITE_GA_MEASUREMENT_ID || ''
const searchConsoleToken = process.env.VITE_GOOGLE_SITE_VERIFICATION || ''

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

function hasEnvPlaceholder(value) {
  return /muster|mustermann|mailpit|000000|\.test|example\.com|example\.de|localhost|x{4,}|token/i.test(
    String(value || '')
  )
}

function state(value, ready) {
  return ready ? `${value} (ready)` : `${value || '(empty)'} (open)`
}

function status(ready) {
  return ready ? 'Done' : 'Open'
}

const siteUrlReady = /^https:\/\/[^/]+/i.test(siteUrl) && !hasEnvPlaceholder(siteUrl)
const gaReady = /^G-[A-Z0-9]+$/i.test(gaId) && !hasEnvPlaceholder(gaId)
const searchReady = Boolean(searchConsoleToken) && !hasEnvPlaceholder(searchConsoleToken)
const legalReady = legalProfile.privacyNeedsReview === false
const napReady =
  companyProfileReview.napApprovedForLaunch === true &&
  companyProfileReview.googleBusinessProfileAligned === true

const accountRows = [
  [
    'Production HTTPS URL',
    state(siteUrl, siteUrlReady),
    'Use the final canonical domain for sitemap, robots, canonicals, JSON-LD, Search Console and GA4 stream setup.',
    'Deployment env -> `VITE_APP_URL`',
  ],
  [
    'Search Console verification token',
    state(searchConsoleToken ? '(set)' : '', searchReady),
    'Set the real ownership token, deploy, verify ownership, then submit `/sitemap.xml`.',
    'Deployment env -> `VITE_GOOGLE_SITE_VERIFICATION`',
  ],
  [
    'GA4 measurement ID',
    state(gaId, gaReady),
    'Set only after legal/operator approval. Use the same ID for deployment env and analytics smoke expectation.',
    'Deployment env -> `VITE_GA_MEASUREMENT_ID`',
  ],
  [
    'Privacy/legal approval for analytics',
    status(legalReady),
    'Confirm Google Analytics disclosure, processor/retention/legal basis and consent wording before enabling GA4.',
    '`src/data/legal.js` -> `legalProfile.privacyNeedsReview=false`',
  ],
  [
    'Company data aligned for Google profile',
    status(napReady),
    'Confirm final NAP/opening hours/service area match the operator records and Google Business Profile.',
    '`src/data/company.js` -> `companyProfileReview`',
  ],
]

const verificationRows = [
  [
    'Search Console ownership',
    'Manual Google Search Console action',
    'Production property is verified for the final HTTPS domain.',
    'Record property URL and timestamp in launch ticket.',
  ],
  [
    'Sitemap submission',
    'Submit `/sitemap.xml` in Search Console',
    'Sitemap is accepted for the production URL and contains the service/detail/contact routes.',
    'Record submission status in launch ticket.',
  ],
  [
    'GA4 consent smoke',
    '`ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example`',
    'No GA4 script before consent; GA4 script and config event appear only after analytics consent.',
    'Attach command output to launch evidence.',
  ],
  [
    'GA4 Realtime before consent',
    'Open production site in a clean browser and reject analytics cookies',
    'No Realtime page view is attributed to the test browser before analytics consent.',
    'Record checker and timestamp in launch ticket.',
  ],
  [
    'GA4 Realtime after consent',
    'Accept analytics cookies and navigate to at least two pages',
    'Realtime page view appears after consent and page navigation is visible.',
    'Record GA4 property/stream and timestamp in launch ticket.',
  ],
  [
    'Google Business Profile NAP comparison',
    'Manual comparison against live Google Business Profile',
    'Displayed name/address/phone/hours match the configured company data entered for launch.',
    'Set company profile review flags after approval.',
  ],
]

const lines = [
  '# Account Verification Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Use this worksheet for Google Search Console, GA4 and Google Business Profile',
  'handoff. It records what can be checked from the repository and what still',
  'requires production account access. Do not store Google account credentials or',
  'private account screenshots in this repository.',
  '',
  '## Current Account Inputs',
  '',
  '| Input | Current state | Launch requirement | Source |',
  '| --- | --- | --- | --- |',
]

for (const row of accountRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Production Verification Steps',
  '',
  '| Step | Command or action | Expected result | Evidence to record |',
  '| --- | --- | --- | --- |'
)

for (const row of verificationRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Useful Commands',
  '',
  '```bash',
  'npm run launch:accounts',
  'npm run privacy:check',
  'npm run legal:review',
  'npm run launch:report',
  'ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example',
  'npm run deploy:seo -- https://domain.example',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Production URL ready: ${siteUrlReady}`)
console.log(`Search Console token ready: ${searchReady}`)
console.log(`GA4 measurement ID ready: ${gaReady}`)

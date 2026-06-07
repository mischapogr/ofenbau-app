import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { company } from '../src/data/company.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'CONTACT_DELIVERY_CHECKLIST.md')

const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const apiBaseUrl = process.env.VITE_API_BASE_URL || '/api'
const mailHost = process.env.MAIL_HOST || ''
const mailPort = process.env.MAIL_PORT || ''
const mailFrom = process.env.MAIL_FROM || ''
const mailTo = process.env.MAIL_TO || ''
const timeout = process.env.SMTP_TIMEOUT_MS || '8000'

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

function readyState(value, ready) {
  return ready ? `${value} (ready)` : `${value || '(empty)'} (open)`
}

function status(ready) {
  return ready ? 'Done' : 'Open'
}

const siteUrlReady = /^https:\/\/[^/]+/i.test(siteUrl) && !hasEnvPlaceholder(siteUrl)
const apiBaseReady = apiBaseUrl === '/api' || (/^https:\/\//i.test(apiBaseUrl) && !hasEnvPlaceholder(apiBaseUrl))
const hostReady = Boolean(mailHost) && !hasEnvPlaceholder(mailHost)
const portReady = /^\d+$/.test(mailPort) && Number(mailPort) > 0
const fromReady = Boolean(mailFrom) && !hasEnvPlaceholder(mailFrom)
const toReady = Boolean(mailTo) && !hasEnvPlaceholder(mailTo)
const timeoutReady = /^\d+$/.test(timeout) && Number(timeout) >= 1000

const envRows = [
  [
    'Production URL',
    readyState(siteUrl, siteUrlReady),
    'Used as the target for `/api/healthz` and `/api/contact` delivery proof.',
    'Deployment env -> `VITE_APP_URL`',
  ],
  [
    'Contact API base URL',
    readyState(apiBaseUrl, apiBaseReady),
    'Same-origin `/api` is expected when using the bundled contact API service.',
    'Deployment env -> `VITE_API_BASE_URL`',
  ],
  [
    'SMTP host',
    readyState(mailHost, hostReady),
    'Real SMTP server reachable from the production contact API container.',
    'Deployment env -> `MAIL_HOST`',
  ],
  ['SMTP port', readyState(mailPort, portReady), 'Numeric SMTP port.', 'Deployment env -> `MAIL_PORT`'],
  [
    'SMTP sender',
    readyState(mailFrom, fromReady),
    'Sender address allowed by the SMTP provider.',
    'Deployment env -> `MAIL_FROM`',
  ],
  [
    'Recipient mailbox',
    readyState(mailTo, toReady),
    'Mailbox that receives website contact requests and is monitored by the operator.',
    'Deployment env -> `MAIL_TO`',
  ],
  [
    'SMTP timeout',
    readyState(timeout, timeoutReady),
    'Timeout in milliseconds for the contact API SMTP handoff.',
    'Deployment env -> `SMTP_TIMEOUT_MS`',
  ],
]

const verificationRows = [
  [
    'Local API smoke',
    '`npm run contact:smoke`',
    'Health endpoint, method rejection, validation, honeypot, fake SMTP handoff and rate limiting pass.',
    'Attach command output or preflight evidence.',
  ],
  [
    'Production API health',
    '`npm run deploy:all -- https://domain.example` or open `/api/healthz`',
    '`/api/healthz` returns ok=true when bundled API is used.',
    'Record URL, status and timestamp.',
  ],
  [
    'Dry-run delivery command',
    '`npm run contact:delivery -- https://domain.example`',
    'Command prints target endpoint and payload summary without sending.',
    'Attach command output before the real send.',
  ],
  [
    'Real mailbox delivery',
    '`CONTACT_DELIVERY_CONFIRM=send CONTACT_DELIVERY_REPLY_TO=launch-test@example.de npm run contact:delivery -- https://domain.example`',
    'Production API returns ok=true and the marked message is received in the real mailbox.',
    'Record recipient mailbox checker, timestamp and subject line in launch ticket.',
  ],
  [
    'Reply-To check',
    'Open received test message in the production mailbox',
    'Reply-To matches `CONTACT_DELIVERY_REPLY_TO` so the operator can answer the prospect.',
    'Record mailbox checker and timestamp.',
  ],
  [
    'Spam-folder check',
    'Check inbox and spam/junk folder after delivery test',
    'The marked launch message is visible to the operator or deliverability issue is tracked.',
    'Record inbox/spam result in launch ticket.',
  ],
]

const lines = [
  '# Contact Delivery Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Use this worksheet for production contact-form delivery handoff. It records',
  'deployment env readiness and the proof required before launch. Do not store',
  'SMTP passwords, mailbox credentials or private mailbox screenshots in this',
  'repository.',
  '',
  '## Current Contact Inputs',
  '',
  '| Input | Current state | Launch requirement | Source |',
  '| --- | --- | --- | --- |',
]

for (const row of envRows) {
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
  '## Delivery Test Payload',
  '',
  '| Field | Default value | Override env var |',
  '| --- | --- | --- |',
  '| Name | Launch Delivery Test | `CONTACT_DELIVERY_NAME` |',
  '| Reply-To | launch-test@example.invalid | `CONTACT_DELIVERY_REPLY_TO` |',
  '| Subject | Launch Kontaktformular Test | `CONTACT_DELIVERY_SUBJECT` |',
  `| Recipient | ${escapeTable(mailTo || company.email.label)} | Deployment env -> \`MAIL_TO\` |`,
  '',
  '## Useful Commands',
  '',
  '```bash',
  'npm run launch:contact',
  'npm run contact:smoke',
  'npm run contact:delivery -- https://domain.example',
  'CONTACT_DELIVERY_CONFIRM=send CONTACT_DELIVERY_REPLY_TO=launch-test@example.de npm run contact:delivery -- https://domain.example',
  'npm run launch:report',
  'npm run preflight',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Production URL ready: ${status(siteUrlReady)}`)
console.log(`SMTP host ready: ${status(hostReady)}`)
console.log(`Recipient mailbox ready: ${status(toReady)}`)

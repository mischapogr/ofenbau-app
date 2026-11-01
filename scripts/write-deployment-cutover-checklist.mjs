import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'generated', 'DEPLOYMENT_CUTOVER_CHECKLIST.md')

const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const apiBaseUrl = process.env.VITE_API_BASE_URL || '/api'
const gaId = process.env.VITE_GA_MEASUREMENT_ID || ''
const searchConsoleToken = process.env.VITE_GOOGLE_SITE_VERIFICATION || ''
const mailHost = process.env.MAIL_HOST || ''
const mailFrom = process.env.MAIL_FROM || ''
const mailTo = process.env.MAIL_TO || ''

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function pathExists(path) {
  return existsSync(join(root, path))
}

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

function contains(path, pattern) {
  return pathExists(path) && pattern.test(read(path))
}

const siteUrlReady = /^https:\/\/[^/]+/i.test(siteUrl) && !hasEnvPlaceholder(siteUrl)
const apiBaseReady = apiBaseUrl === '/api' || (/^https:\/\//i.test(apiBaseUrl) && !hasEnvPlaceholder(apiBaseUrl))
const smtpReady =
  Boolean(mailHost) &&
  !hasEnvPlaceholder(mailHost) &&
  Boolean(mailFrom) &&
  !hasEnvPlaceholder(mailFrom) &&
  Boolean(mailTo) &&
  !hasEnvPlaceholder(mailTo)
const gaReady = Boolean(gaId) && !hasEnvPlaceholder(gaId)
const searchReady = Boolean(searchConsoleToken) && !hasEnvPlaceholder(searchConsoleToken)

const configRows = [
  ['Dockerfile.prod', 'Dockerfile.prod', pathExists('Dockerfile.prod'), 'Production nginx image build exists.'],
  ['Dockerfile.contact', 'Dockerfile.contact', pathExists('Dockerfile.contact'), 'Contact API image build exists.'],
  ['Compose file', 'docker-compose.prod.yml', pathExists('docker-compose.prod.yml'), 'Production-style web/api services are defined.'],
  ['Nginx API proxy', 'nginx.conf', contains('nginx.conf', /location\s+\/api\/[\s\S]*proxy_pass\s+http:\/\/api:3000\/api\//), 'Same-origin `/api` is proxied to the contact API.'],
  ['SPA fallback', 'nginx.conf', contains('nginx.conf', /try_files\s+\$uri\s+\$uri\/\s+\/index\.html/), 'Client-side routes return `index.html`.'],
  [
    'Nginx security headers',
    'nginx.conf',
    contains('nginx.conf', /Permissions-Policy\s+"camera=\(\), microphone=\(\), geolocation=\(\)"\s+always/) &&
      contains('nginx.conf', /location\s+\/assets\/[\s\S]*Permissions-Policy\s+"camera=\(\), microphone=\(\), geolocation=\(\)"\s+always/),
    'Security headers are configured for HTML/API responses and repeated in the hashed-asset location.',
  ],
  ['Production env example', '.env.production.example', pathExists('.env.production.example'), 'Deployment env checklist exists.'],
]

const envRows = [
  ['Public HTTPS domain', state(siteUrl, siteUrlReady), 'Deployment env -> `VITE_APP_URL`'],
  ['Contact API base URL', state(apiBaseUrl, apiBaseReady), 'Deployment env -> `VITE_API_BASE_URL`'],
  ['Production SMTP values', status(smtpReady), 'Deployment env -> `MAIL_HOST`, `MAIL_FROM`, `MAIL_TO`'],
  ['GA4 measurement ID', state(gaId, gaReady), 'Deployment env -> `VITE_GA_MEASUREMENT_ID`'],
  ['Search Console token', state(searchConsoleToken ? '(set)' : '', searchReady), 'Deployment env -> `VITE_GOOGLE_SITE_VERIFICATION`'],
]

const cutoverRows = [
  [
    'Build production image',
    'Hosting CI or `docker compose -f docker-compose.prod.yml build`',
    'Web and contact API images build with production env values.',
    'Record build ID, commit and image tag.',
  ],
  [
    'DNS cutover',
    'Configure A/AAAA/CNAME records at DNS provider',
    'Final domain resolves to the hosting target.',
    'Record DNS provider, record type, target and TTL.',
  ],
  [
    'HTTPS certificate',
    'Hosting provider / reverse proxy certificate setup',
    'Production URL serves HTTPS without certificate warnings.',
    'Record certificate issuer and expiration date.',
  ],
  [
    'Production health',
    '`npm run deploy:all -- https://domain.example`',
    'Route/API/header, SEO, analytics consent, Maps consent, contact-link, accessibility, visual and performance smoke checks pass; set `ANALYTICS_SMOKE_GA_ID` when GA4 is enabled.',
    'Attach command output to launch evidence.',
  ],
  [
    'Sitemap and robots',
    'Open `/sitemap.xml` and `/robots.txt` on production domain',
    'Both files reference the final HTTPS production domain.',
    'Record URLs and timestamp.',
  ],
  [
    'Contact mailbox proof',
    '`CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example`',
    'Marked contact test is received in the real mailbox.',
    'Record mailbox checker and timestamp.',
  ],
  [
    'Search Console and GA4',
    '`npm run launch:accounts` plus manual Google checks',
    'Ownership, sitemap, GA4 consent and Realtime checks are completed.',
    'Record property/stream IDs and checker.',
  ],
  [
    'Rollback path',
    'Hosting provider rollback or previous image redeploy',
    'Known rollback action exists before DNS/live traffic is switched.',
    'Record rollback owner and command/provider action.',
  ],
]

const lines = [
  '# Deployment Cutover Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Use this worksheet for production DNS, HTTPS, hosting and post-deploy handoff.',
  'It summarizes repository deployment wiring and lists the external cutover',
  'proof that must be captured outside the repo. Do not store hosting passwords,',
  'DNS credentials or private provider screenshots here.',
  '',
  '## Repository Deployment Wiring',
  '',
  '| Check | Source | Status | Detail |',
  '| --- | --- | --- | --- |',
]

for (const row of configRows) {
  lines.push(`| ${escapeTable(row[0])} | \`${escapeTable(row[1])}\` | ${status(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Current Deployment Inputs',
  '',
  '| Input | Current state | Source |',
  '| --- | --- | --- |'
)

for (const row of envRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} |`)
}

lines.push(
  '',
  '## Cutover Verification Steps',
  '',
  '| Step | Command or action | Expected result | Evidence to record |',
  '| --- | --- | --- | --- |'
)

for (const row of cutoverRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Useful Commands',
  '',
  '```bash',
  'npm run launch:deployment',
  'npm run deploy:config',
  'npm run deploy:links -- https://domain.example',
  'npm run launch:check',
  'ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example',
  'CONTACT_DELIVERY_CONFIRM=send CONTACT_DELIVERY_REPLY_TO=launch-test@example.de npm run contact:delivery -- https://domain.example',
  'npm run launch:evidence',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Production URL ready: ${status(siteUrlReady)}`)
console.log(`Contact API base ready: ${status(apiBaseReady)}`)
console.log(`SMTP ready: ${status(smtpReady)}`)

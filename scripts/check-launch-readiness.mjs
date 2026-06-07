import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { company, companyProfileReview, socialLinks } from '../src/data/company.js'
import { legalProfile } from '../src/data/legal.js'
import { serviceContentReview, services } from '../src/data/services.js'
import { projectReferenceReview, projects } from '../src/data/projects.js'

const strict = process.argv.includes('--strict')
const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const apiBaseUrl = process.env.VITE_API_BASE_URL || '/api'
const mailHost = process.env.MAIL_HOST || ''
const mailPort = process.env.MAIL_PORT || ''
const mailFrom = process.env.MAIL_FROM || ''
const mailTo = process.env.MAIL_TO || ''
const root = process.cwd()

const blockers = []
const warnings = []
const passed = []

function checkBlocker(condition, failMessage, passMessage) {
  if (condition) blockers.push(failMessage)
  else if (passMessage) passed.push(passMessage)
}

function checkWarning(condition, failMessage, passMessage) {
  if (condition) warnings.push(failMessage)
  else if (passMessage) passed.push(passMessage)
}

function hasPlaceholder(value) {
  return /muster|mustermann|000000|\.test|example\.com|localhost/i.test(String(value || ''))
}

function hasEnvPlaceholder(value) {
  return /muster|mustermann|mailpit|000000|\.test|example\.com|example\.de|localhost|x{4,}|token/i.test(
    String(value || '')
  )
}

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function fileExists(path) {
  return existsSync(join(root, path))
}

checkBlocker(
  /^https?:\/\/localhost\b/i.test(siteUrl),
  `VITE_APP_URL is still local: ${siteUrl}`,
  'VITE_APP_URL is not localhost'
)
checkBlocker(
  !/^https?:\/\/localhost\b/i.test(siteUrl) && hasEnvPlaceholder(siteUrl),
  `VITE_APP_URL looks like a placeholder: ${siteUrl}`
)
checkBlocker(hasPlaceholder(company.name), `Company name looks like a placeholder: ${company.name}`, 'Company name does not match placeholder patterns')
checkBlocker(hasPlaceholder(company.legalName), `Legal name looks like a placeholder: ${company.legalName}`, 'Legal name does not match placeholder patterns')
checkBlocker(
  hasPlaceholder(`${company.address.street} ${company.address.zip} ${company.address.city}`),
  `Address looks like placeholder data: ${company.address.street}, ${company.address.zip} ${company.address.city}`,
  'Address does not match placeholder patterns'
)
checkBlocker(hasPlaceholder(company.phone.label), `Phone looks like a placeholder: ${company.phone.label}`, 'Phone does not match placeholder patterns')
checkBlocker(hasPlaceholder(company.email.label), `Email looks like a placeholder: ${company.email.label}`, 'Email does not match placeholder patterns')
checkBlocker(
  companyProfileReview.napApprovedForLaunch !== true,
  `Company NAP/opening-hours data is not approved for launch: ${companyProfileReview.note}`,
  'Company NAP/opening-hours data is approved for launch'
)
checkBlocker(
  companyProfileReview.googleBusinessProfileAligned !== true,
  `Company data is not confirmed against Google Business Profile: ${companyProfileReview.note}`,
  'Company data is confirmed against Google Business Profile'
)
checkBlocker(
  companyProfileReview.mapRouteVerified !== true,
  `Google Maps route/embed query is not verified for the final address: ${companyProfileReview.note}`,
  'Google Maps route/embed query is verified for the final address'
)

for (const link of socialLinks) {
  checkWarning(
    /^https:\/\/(instagram|facebook|pinterest)\.com\/?$/i.test(link.href),
    `${link.name} social link is generic: ${link.href}`
  )
}

const legalView = read('src/pages/LegalView.vue')
checkBlocker(
  legalProfile.noticeIsTemplate || /Dies ist eine Vorlage|Max Mustermann/i.test(legalView),
  'Impressum/Datenschutz still contains legal template placeholders',
  'Legal view does not contain known template placeholders'
)
checkBlocker(
  hasPlaceholder(legalProfile.contentResponsible.name),
  `Legal content-responsible person looks like a placeholder: ${legalProfile.contentResponsible.name}`,
  'Legal content-responsible person does not match placeholder patterns'
)

const privacyContent = read('src/components/PrivacyContent.vue')
checkWarning(
  legalProfile.privacyNeedsReview || /müssen vor dem\s+Livegang|geprüft und ergänzt/i.test(privacyContent),
  'Privacy content still contains a pre-live legal-review placeholder'
)

checkWarning(!process.env.VITE_GA_MEASUREMENT_ID, 'VITE_GA_MEASUREMENT_ID is not set', 'VITE_GA_MEASUREMENT_ID is set')
checkWarning(
  process.env.VITE_GA_MEASUREMENT_ID && hasEnvPlaceholder(process.env.VITE_GA_MEASUREMENT_ID),
  `VITE_GA_MEASUREMENT_ID looks like a placeholder: ${process.env.VITE_GA_MEASUREMENT_ID}`
)
checkWarning(
  !process.env.VITE_GOOGLE_SITE_VERIFICATION,
  'VITE_GOOGLE_SITE_VERIFICATION is not set',
  'VITE_GOOGLE_SITE_VERIFICATION is set'
)
checkWarning(
  process.env.VITE_GOOGLE_SITE_VERIFICATION &&
    hasEnvPlaceholder(process.env.VITE_GOOGLE_SITE_VERIFICATION),
  `VITE_GOOGLE_SITE_VERIFICATION looks like a placeholder: ${process.env.VITE_GOOGLE_SITE_VERIFICATION}`
)
const nginxConf = read('nginx.conf')
const composeProd = read('docker-compose.prod.yml')
const hasBundledContactApi =
  fileExists('server/contact-api.mjs') &&
  fileExists('Dockerfile.contact') &&
  /location\s+\/api\//.test(nginxConf) &&
  /ofenbau-contact-api|dockerfile:\s*Dockerfile\.contact/.test(composeProd)

checkBlocker(
  apiBaseUrl === '/api' ? !hasBundledContactApi : /localhost/i.test(apiBaseUrl),
  apiBaseUrl === '/api'
    ? 'Same-origin /api is configured but bundled production contact API/proxy wiring is incomplete'
    : `Production contact API is not configured for a live endpoint: ${apiBaseUrl}`,
  apiBaseUrl === '/api'
    ? 'Same-origin /api is backed by the bundled production contact API'
    : 'Production contact API is configured as an external endpoint'
)
checkBlocker(
  !mailHost || hasEnvPlaceholder(mailHost),
  `MAIL_HOST is not configured for a real production SMTP host: ${mailHost || '(empty)'}`,
  'MAIL_HOST is configured'
)
checkBlocker(
  !/^\d+$/.test(mailPort) || Number(mailPort) <= 0,
  `MAIL_PORT is not configured as a valid SMTP port: ${mailPort || '(empty)'}`,
  'MAIL_PORT is configured'
)
checkBlocker(
  !mailFrom || hasEnvPlaceholder(mailFrom),
  `MAIL_FROM is not configured for a real production sender: ${mailFrom || '(empty)'}`,
  'MAIL_FROM is configured'
)
checkBlocker(
  !mailTo || hasEnvPlaceholder(mailTo),
  `MAIL_TO is not configured for a real production mailbox: ${mailTo || '(empty)'}`,
  'MAIL_TO is configured'
)

checkBlocker(!fileExists('public/sitemap.xml'), 'public/sitemap.xml is missing', 'public/sitemap.xml exists')
checkBlocker(!fileExists('public/robots.txt'), 'public/robots.txt is missing', 'public/robots.txt exists')

if (fileExists('public/sitemap.xml')) {
  const sitemap = read('public/sitemap.xml')
  checkWarning(sitemap.includes('localhost'), 'Generated sitemap still contains localhost URLs')
  checkWarning(
    !sitemap.includes(`${siteUrl}/kontakt`),
    'Generated sitemap does not contain the contact page for the configured site URL',
    'Generated sitemap contains the contact page for the configured site URL'
  )
}

if (fileExists('public/robots.txt')) {
  const robots = read('public/robots.txt')
  checkWarning(robots.includes('localhost'), 'Generated robots.txt still contains localhost URLs')
  checkWarning(
    !robots.includes(`${siteUrl}/sitemap.xml`),
    'robots.txt does not point to the configured sitemap URL',
    'robots.txt points to the configured sitemap URL'
  )
}

checkBlocker(services.length < 4, `Expected at least 4 services, found ${services.length}`, `Service coverage is sufficient: ${services.length}`)
checkBlocker(
  serviceContentReview.approvedForLaunch !== true,
  `Service content is not approved for launch: ${serviceContentReview.note}`,
  'Service content is approved for launch'
)
checkBlocker(projects.length < 6, `Expected at least 6 project references, found ${projects.length}`, `Project reference coverage is sufficient: ${projects.length}`)
checkBlocker(
  projectReferenceReview.approvedForLaunch !== true,
  `Project/reference gallery is not approved for launch: ${projectReferenceReview.note}`,
  'Project/reference gallery is approved for launch'
)

console.log('Launch readiness report')
console.log(`Mode: ${strict ? 'strict' : 'report'}`)
console.log(`Site URL: ${siteUrl}`)
console.log('')

if (passed.length) {
  console.log(`Passed (${passed.length})`)
  for (const item of passed) console.log(`  - ${item}`)
  console.log('')
}

if (warnings.length) {
  console.log(`Warnings (${warnings.length})`)
  for (const item of warnings) console.log(`  - ${item}`)
  console.log('')
}

if (blockers.length) {
  console.log(`Blockers (${blockers.length})`)
  for (const item of blockers) console.log(`  - ${item}`)
  console.log('')
}

if (strict && (blockers.length || warnings.length)) {
  process.exitCode = 1
}

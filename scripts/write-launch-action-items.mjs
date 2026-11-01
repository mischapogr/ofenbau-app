import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { company, companyProfileReview, socialLinks } from '../src/data/company.js'
import {
  contactTopicReview,
  contactTopicRoutingReview,
  contactTopics,
} from '../src/data/contactTopics.js'
import { homepageContentReview, homepageReviewSections } from '../src/data/home.js'
import { legalProfile } from '../src/data/legal.js'
import { publicPageContentReview, publicPageReviewSections } from '../src/data/pages.js'
import { planningContentReview, planningExamples } from '../src/data/planning.js'
import { projectReferenceReview, projects } from '../src/data/projects.js'
import { serviceContentReview, services } from '../src/data/services.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'generated', 'LAUNCH_ACTION_ITEMS.md')

const appTitle = process.env.VITE_APP_TITLE || ''
const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const apiBaseUrl = process.env.VITE_API_BASE_URL || '/api'
const mailHost = process.env.MAIL_HOST || ''
const mailPort = process.env.MAIL_PORT || ''
const mailFrom = process.env.MAIL_FROM || ''
const mailTo = process.env.MAIL_TO || ''

const actions = []

function hasPlaceholder(value) {
  return /muster|mustermann|000000|\.test|example\.com|localhost/i.test(String(value || ''))
}

function hasEnvPlaceholder(value) {
  return /muster|mustermann|mailpit|000000|\.test|example\.com|example\.de|localhost|x{4,}|token/i.test(
    String(value || '')
  )
}

function add(area, item, current, nextStep, verification, source) {
  actions.push({ area, item, current, nextStep, verification, source })
}

function bool(value) {
  return value === true ? 'true' : 'false'
}

function envState(name, value) {
  return value ? `${name}=${value}` : `${name} is not set`
}

function escapeTable(value) {
  return String(value || '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

if (hasPlaceholder(company.name)) {
  add(
    'Company / Local SEO',
    'Replace public company name',
    company.name,
    'Set the real public company name used in header, footer and JSON-LD.',
    '`npm run company:check` and browser review',
    '`src/data/company.js` -> `company.name`'
  )
}

if (appTitle && hasEnvPlaceholder(appTitle)) {
  add(
    'Company / Local SEO',
    'Replace VITE_APP_TITLE placeholder',
    `VITE_APP_TITLE=${appTitle}`,
    'Remove the override to use company.name or set it to the final public company/site name.',
    '`npm run launch:report` and `npm run deploy:seo -- https://domain.example`',
    'Deployment env -> `VITE_APP_TITLE`'
  )
}

if (appTitle && !hasEnvPlaceholder(appTitle) && !hasPlaceholder(company.name) && appTitle !== company.name) {
  add(
    'Company / Local SEO',
    'Align VITE_APP_TITLE with company name',
    `VITE_APP_TITLE=${appTitle}; company.name=${company.name}`,
    'Use one final public site name consistently in deployment env and company data.',
    '`npm run launch:report` and `npm run deploy:seo -- https://domain.example`',
    'Deployment env -> `VITE_APP_TITLE`; `src/data/company.js` -> `company.name`'
  )
}

if (hasPlaceholder(company.legalName)) {
  add(
    'Company / Local SEO',
    'Replace legal company/operator name',
    company.legalName,
    'Set the exact legal operator name used in Impressum, privacy text and JSON-LD.',
    '`npm run company:check` and `npm run launch:report`',
    '`src/data/company.js` -> `company.legalName`'
  )
}

const address = `${company.address.street}, ${company.address.zip} ${company.address.city}`
if (hasPlaceholder(address)) {
  add(
    'Company / Local SEO',
    'Replace address and service area',
    `${address}; ${company.address.region}`,
    'Set real street, ZIP, city, region and service area.',
    '`npm run company:check`, browser review and Google Business Profile comparison',
    '`src/data/company.js` -> `company.address`'
  )
}

if (hasPlaceholder(company.phone.label) || hasPlaceholder(company.whatsapp.label)) {
  add(
    'Company / Local SEO',
    'Replace phone and WhatsApp numbers',
    `${company.phone.label}; ${company.whatsapp.label}`,
    'Set real labels and href values, then click-test tel and WhatsApp links.',
    '`npm run company:check` and `npm run deploy:links -- https://domain.example`',
    '`src/data/company.js` -> `company.phone`, `company.whatsapp`'
  )
}

if (hasPlaceholder(company.email.label)) {
  add(
    'Company / Local SEO',
    'Replace public email address',
    company.email.label,
    'Set the real public contact email label and mailto href.',
    '`npm run company:check` and `npm run deploy:links -- https://domain.example`',
    '`src/data/company.js` -> `company.email`'
  )
}

for (const link of socialLinks) {
  if (/^https:\/\/(instagram|facebook|pinterest)\.com\/?$/i.test(link.href)) {
    add(
      'Company / Local SEO',
      `Replace generic ${link.name} profile URL`,
      link.href,
      'Set the real public profile URL or remove the link if no approved profile exists.',
      '`npm run launch:report` and `npm run deploy:links -- https://domain.example`',
      '`src/data/company.js` -> `socialLinks`'
    )
  }
}

if (companyProfileReview.napApprovedForLaunch !== true) {
  add(
    'Company / Local SEO',
    'Approve final NAP/opening-hours data',
    `${bool(companyProfileReview.napApprovedForLaunch)}; ${companyProfileReview.note}`,
    'Compare site data with the real operator records, then set the launch approval flag.',
    '`npm run launch:report`',
    '`src/data/company.js` -> `companyProfileReview.napApprovedForLaunch`'
  )
}

if (companyProfileReview.googleBusinessProfileAligned !== true) {
  add(
    'Company / Local SEO',
    'Confirm Google Business Profile alignment',
    `${bool(companyProfileReview.googleBusinessProfileAligned)}; ${companyProfileReview.note}`,
    'Compare name, address, phone, hours and service area against the live Google Business Profile.',
    '`npm run launch:report`',
    '`src/data/company.js` -> `companyProfileReview.googleBusinessProfileAligned`'
  )
}

if (companyProfileReview.mapRouteVerified !== true) {
  add(
    'Google Maps',
    'Verify route target for final address',
    `${bool(companyProfileReview.mapRouteVerified)}; ${companyProfileReview.note}`,
    'Open `/kontakt`, use route planning, confirm the target is the final business address, then set the flag.',
    '`npm run deploy:links -- https://domain.example`, `npm run deploy:maps -- https://domain.example` and manual route check',
    '`src/data/company.js` -> `companyProfileReview.mapRouteVerified`'
  )
}

if (legalProfile.noticeIsTemplate) {
  add(
    'Legal / Privacy',
    'Replace template Impressum/legal text',
    `noticeIsTemplate=${bool(legalProfile.noticeIsTemplate)}; ${legalProfile.reviewNote}`,
    'Enter legally reviewed operator details and set `noticeIsTemplate` to `false`.',
    '`npm run launch:report`',
    '`src/data/legal.js`, `src/pages/LegalView.vue`'
  )
}

if (hasPlaceholder(legalProfile.contentResponsible.name)) {
  add(
    'Legal / Privacy',
    'Replace content-responsible person',
    legalProfile.contentResponsible.name,
    'Set the legally correct content-responsible person and address.',
    '`npm run launch:report`',
    '`src/data/legal.js` -> `legalProfile.contentResponsible`'
  )
}

if (legalProfile.privacyNeedsReview) {
  add(
    'Legal / Privacy',
    'Complete privacy legal review',
    `privacyNeedsReview=${bool(legalProfile.privacyNeedsReview)}; ${legalProfile.privacyReviewNote}`,
    'Finalize analytics, maps, contact form, processor, retention and rights disclosures, then set `privacyNeedsReview` to `false`.',
    '`npm run privacy:check` and `npm run launch:report`',
    '`src/data/legal.js`, `src/components/PrivacyContent.vue`'
  )
}

const incompleteHomepageSections = homepageReviewSections.filter(
  (section) => section.review?.copyApproved !== true || section.review?.mediaApproved !== true
)

if (incompleteHomepageSections.length) {
  add(
    'Homepage Content',
    'Approve homepage copy, proof claims and media',
    `${incompleteHomepageSections.length} homepage sections still need copy or media approval.`,
    `Review and approve: ${incompleteHomepageSections.map((section) => section.id).join(', ')}.`,
    '`npm run content:review`, `npm run content:assets`, browser review of `/`',
    '`src/data/home.js` -> each homepage section `review` object'
  )
}

if (homepageContentReview.approvedForLaunch !== true) {
  add(
    'Homepage Content',
    'Approve overall homepage content',
    `${bool(homepageContentReview.approvedForLaunch)}; ${homepageContentReview.note}`,
    'After homepage copy, public proof claims and media are approved, set the global homepage approval flag.',
    '`npm run launch:report`',
    '`src/data/home.js` -> `homepageContentReview.approvedForLaunch`'
  )
}

const incompletePublicPageSections = publicPageReviewSections.filter(
  (section) => section.review?.copyApproved !== true
)

if (incompletePublicPageSections.length) {
  add(
    'Public Page Content',
    'Approve about/contact page copy',
    `${incompletePublicPageSections.length} public page sections still need copy approval.`,
    `Review and approve: ${incompletePublicPageSections.map((section) => section.id).join(', ')}.`,
    '`npm run content:review`, browser review of `/ueber-uns` and `/kontakt`',
    '`src/data/pages.js` -> each public page section `review` object'
  )
}

if (publicPageContentReview.approvedForLaunch !== true) {
  add(
    'Public Page Content',
    'Approve overall public page content',
    `${bool(publicPageContentReview.approvedForLaunch)}; ${publicPageContentReview.note}`,
    'After about/contact page copy is approved, set the global public page approval flag.',
    '`npm run launch:report`',
    '`src/data/pages.js` -> `publicPageContentReview.approvedForLaunch`'
  )
}

const incompleteContactTopics = contactTopics.filter(
  (topic) =>
    topic.review?.operatorApproved !== true ||
    topic.review?.mailboxRoutingApproved !== true
)

if (incompleteContactTopics.length) {
  add(
    'Contact Topics',
    'Approve contact topic labels and email subjects',
    `${incompleteContactTopics.length} contact topics still need operator or mailbox-routing approval.`,
    `Review and approve: ${incompleteContactTopics.map((topic) => topic.value).join(', ')}.`,
    '`npm run content:review`, browser review of `/kontakt`, and contact mailbox subject review',
    '`src/data/contactTopics.js` -> each topic `review` object'
  )
}

if (contactTopicReview.approvedForLaunch !== true) {
  add(
    'Contact Topics',
    'Approve overall contact topics',
    `${bool(contactTopicReview.approvedForLaunch)}; ${contactTopicReview.note}`,
    'After all visible topic labels and email subjects are approved, set the global contact topic approval flag.',
    '`npm run launch:report`',
    '`src/data/contactTopics.js` -> `contactTopicReview.approvedForLaunch`'
  )
}

if (contactTopicRoutingReview.approvedForLaunch !== true) {
  add(
    'Contact Topics',
    'Approve service-to-topic routing',
    `${bool(contactTopicRoutingReview.approvedForLaunch)}; ${contactTopicRoutingReview.note}`,
    'Confirm service detail CTAs preselect the intended contact topics, then set the routing approval flag.',
    '`npm run launch:report`, browser review of service detail CTAs and `/kontakt?topic=...`',
    '`src/data/contactTopics.js` -> `contactTopicRoutingReview.approvedForLaunch`'
  )
}

if (serviceContentReview.approvedForLaunch !== true) {
  add(
    'Services',
    'Approve service wording, proof points and FAQs',
    `${bool(serviceContentReview.approvedForLaunch)}; ${serviceContentReview.note}`,
    `Review ${services.length} service pages against the real offer, update wording where needed, then set approval.`,
    '`npm run content:assets`, `npm run content:inventory`, browser review of `/leistungen`',
    '`src/data/services.js` -> `serviceContentReview.approvedForLaunch`'
  )
}

const incompleteProjects = projects.filter(
  (project) =>
    project.review?.realReference !== true ||
    project.review?.photoRightsApproved !== true ||
    project.review?.customerApproved !== true
)

if (incompleteProjects.length) {
  add(
    'References',
    'Replace/approve project references',
    `${incompleteProjects.length} project references still need real-reference, photo-rights or customer approval.`,
    `Replace demo/generated references or document approvals for: ${incompleteProjects.map((project) => project.id).join(', ')}.`,
    '`npm run content:assets`, `npm run content:inventory`, browser review of `/projekte`',
    '`src/data/projects.js` -> each project `review` object'
  )
}

if (projectReferenceReview.approvedForLaunch !== true) {
  add(
    'References',
    'Approve overall reference gallery',
    `${bool(projectReferenceReview.approvedForLaunch)}; ${projectReferenceReview.note}`,
    'After all reference media and approvals are complete, set the global reference approval flag.',
    '`npm run launch:report`',
    '`src/data/projects.js` -> `projectReferenceReview.approvedForLaunch`'
  )
}

const incompletePlanningExamples = planningExamples.filter(
  (example) =>
    example.review?.operatorApproved !== true || example.review?.mediaRightsApproved !== true
)

if (incompletePlanningExamples.length) {
  add(
    '3D Planning',
    'Approve planning examples and generated visuals',
    `${incompletePlanningExamples.length} planning examples still need operator or media-rights approval.`,
    `Confirm real workflow fit and media approval for: ${incompletePlanningExamples
      .map((example) => example.id)
      .join(', ')}.`,
    '`npm run content:review`, `npm run content:assets`, browser review of `/leistungen/3d-planung`',
    '`src/data/planning.js` -> each planning example `review` object'
  )
}

if (planningContentReview.approvedForLaunch !== true) {
  add(
    '3D Planning',
    'Approve overall 3D planning content',
    `${bool(planningContentReview.approvedForLaunch)}; ${planningContentReview.note}`,
    'After all planning examples and generated visuals are approved, set the global planning approval flag.',
    '`npm run launch:report`',
    '`src/data/planning.js` -> `planningContentReview.approvedForLaunch`'
  )
}

if (/^https?:\/\/localhost\b/i.test(siteUrl) || hasEnvPlaceholder(siteUrl)) {
  add(
    'Deployment',
    'Configure production site URL',
    `VITE_APP_URL=${siteUrl}`,
    'Set the public HTTPS production domain before building deploy assets.',
    '`npm run build`, then `npm run deploy:all -- https://domain.example`',
    'Deployment env -> `VITE_APP_URL`'
  )
}

if (apiBaseUrl === '/api') {
  add(
    'Deployment',
    'Verify same-origin contact API after deploy',
    'VITE_API_BASE_URL=/api',
    'Use the bundled production contact API and confirm `/api/healthz` on the production domain.',
    '`npm run deploy:all -- https://domain.example`',
    'Deployment env -> `VITE_API_BASE_URL`'
  )
} else if (/localhost/i.test(apiBaseUrl) || hasEnvPlaceholder(apiBaseUrl)) {
  add(
    'Deployment',
    'Replace contact API base URL',
    `VITE_API_BASE_URL=${apiBaseUrl}`,
    'Set a real HTTPS contact backend or switch to same-origin `/api`.',
    '`npm run launch:report` and deployed `/api/healthz` check',
    'Deployment env -> `VITE_API_BASE_URL`'
  )
}

if (!mailHost || hasEnvPlaceholder(mailHost)) {
  add(
    'Contact Delivery',
    'Configure production SMTP host',
    envState('MAIL_HOST', mailHost),
    'Set the real SMTP host in the deployment environment.',
    '`npm run launch:check` with production env values',
    'Deployment env -> `MAIL_HOST`'
  )
}

if (!/^\d+$/.test(mailPort) || Number(mailPort) <= 0) {
  add(
    'Contact Delivery',
    'Configure production SMTP port',
    envState('MAIL_PORT', mailPort),
    'Set the real numeric SMTP port.',
    '`npm run launch:check` with production env values',
    'Deployment env -> `MAIL_PORT`'
  )
}

if (!mailFrom || hasEnvPlaceholder(mailFrom)) {
  add(
    'Contact Delivery',
    'Configure production sender address',
    envState('MAIL_FROM', mailFrom),
    'Set the real sender address allowed by the SMTP provider.',
    '`npm run launch:check` with production env values',
    'Deployment env -> `MAIL_FROM`'
  )
}

if (!mailTo || hasEnvPlaceholder(mailTo)) {
  add(
    'Contact Delivery',
    'Configure production recipient mailbox',
    envState('MAIL_TO', mailTo),
    'Set the real mailbox that should receive website contact requests.',
    '`npm run launch:check` with production env values',
    'Deployment env -> `MAIL_TO`'
  )
}

add(
  'Contact Delivery',
  'Prove real mailbox delivery',
  'No production mailbox proof is recorded in this repository.',
  'Send a marked contact-form test after production SMTP values are configured and confirm receipt.',
  '`CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example`',
  'Launch evidence ticket'
)

if (!process.env.VITE_GA_MEASUREMENT_ID || hasEnvPlaceholder(process.env.VITE_GA_MEASUREMENT_ID)) {
  add(
    'Analytics / Search Console',
    'Configure GA4 measurement ID after legal approval',
    envState('VITE_GA_MEASUREMENT_ID', process.env.VITE_GA_MEASUREMENT_ID || ''),
    'Set the real GA4 measurement ID only after legal approval for analytics.',
    '`ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:analytics -- https://domain.example` and GA4 Realtime',
    'Deployment env -> `VITE_GA_MEASUREMENT_ID`'
  )
}

if (
  !process.env.VITE_GOOGLE_SITE_VERIFICATION ||
  hasEnvPlaceholder(process.env.VITE_GOOGLE_SITE_VERIFICATION)
) {
  add(
    'Analytics / Search Console',
    'Configure Search Console verification token',
    envState('VITE_GOOGLE_SITE_VERIFICATION', process.env.VITE_GOOGLE_SITE_VERIFICATION || ''),
    'Set the real verification token and verify the production property.',
    'Search Console ownership verification and sitemap submission',
    'Deployment env -> `VITE_GOOGLE_SITE_VERIFICATION`'
  )
}

add(
  'Production Evidence',
  'Record runtime route/header smoke results',
  'No production route/header smoke evidence is recorded in this repository.',
  'Run the route, robots, sitemap, API health and runtime security/cache header smoke against the public HTTPS domain and record output in the launch ticket.',
  '`npm run deploy:smoke -- https://domain.example`',
  '`docs/LAUNCH_EVIDENCE_TEMPLATE.md`'
)

add(
  'Production Evidence',
  'Record final deployment smoke results',
  'No production deploy evidence is recorded in this repository.',
  'Run the aggregate smoke suite against the public HTTPS domain and record output in the launch ticket.',
  '`npm run deploy:all -- https://domain.example`',
  '`docs/LAUNCH_EVIDENCE_TEMPLATE.md`'
)

add(
  'Production Evidence',
  'Record visual smoke evidence',
  'No production visual smoke evidence is recorded in this repository.',
  'Run the browser visual smoke against the public HTTPS domain and review the generated route/viewport report.',
  '`npm run deploy:visual -- https://domain.example`',
  '`docs/generated/VISUAL_SMOKE.md`'
)

add(
  'Production Evidence',
  'Record Lighthouse/PageSpeed evidence',
  'No production Lighthouse/PageSpeed evidence is recorded in this repository.',
  'Run Lighthouse or PageSpeed against the public HTTPS domain after deploy and track remaining issues.',
  'Manual Lighthouse/PageSpeed report plus `npm run deploy:perf -- https://domain.example`',
  '`docs/LAUNCH_EVIDENCE_TEMPLATE.md`'
)

const byArea = new Map()
for (const action of actions) {
  if (!byArea.has(action.area)) byArea.set(action.area, [])
  byArea.get(action.area).push(action)
}

const lines = [
  '# Launch Action Items',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'This file is generated from the current structured content, review flags and',
  'deployment environment. It is a handoff checklist, not a launch approval.',
  'Do not store secrets, mailbox credentials or private approval records here.',
  '',
  `Open action count: ${actions.length}`,
  '',
]

for (const [area, items] of byArea) {
  lines.push(`## ${area}`, '')
  lines.push('| Item | Current state | Next step | Verification | Source |')
  lines.push('| --- | --- | --- | --- | --- |')
  for (const item of items) {
    lines.push(
      `| ${escapeTable(item.item)} | ${escapeTable(item.current)} | ${escapeTable(item.nextStep)} | ${escapeTable(item.verification)} | ${escapeTable(item.source)} |`
    )
  }
  lines.push('')
}

lines.push('## Useful Commands', '')
lines.push('```bash')
lines.push('npm run launch:contact')
lines.push('npm run launch:deployment')
lines.push('npm run launch:performance')
lines.push('npm run launch:inputs')
lines.push('npm run launch:accounts')
lines.push('npm run launch:actions')
lines.push('npm run launch:evidence')
lines.push('npm run content:review')
lines.push('npm run content:placeholders')
lines.push('npm run legal:review')
lines.push('npm run launch:report')
lines.push('npm run launch:check')
lines.push('npm run preflight')
lines.push('npm run deploy:links -- https://domain.example')
lines.push('npm run deploy:smoke -- https://domain.example')
lines.push('npm run deploy:all -- https://domain.example')
lines.push('CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example')
lines.push('```')

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Open launch action items: ${actions.length}`)

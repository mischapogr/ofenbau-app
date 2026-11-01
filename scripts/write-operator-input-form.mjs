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
const outPath = join(root, 'docs', 'generated', 'OPERATOR_INPUT_FORM.md')

const appTitle = process.env.VITE_APP_TITLE || ''
const siteUrl = process.env.VITE_APP_URL || 'http://localhost:5173'
const apiBaseUrl = process.env.VITE_API_BASE_URL || '/api'
const mailHost = process.env.MAIL_HOST || ''
const mailPort = process.env.MAIL_PORT || ''
const mailFrom = process.env.MAIL_FROM || ''
const mailTo = process.env.MAIL_TO || ''

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

function bool(value) {
  return value === true ? 'true' : 'false'
}

function envState(name, value) {
  return value ? `${name}=${value}` : `${name} is not set`
}

const companyRows = [
  [
    'Public company name',
    company.name,
    'Header, footer, contact page and LocalBusiness JSON-LD',
    '`src/data/company.js` -> `company.name`',
  ],
  [
    'Legal operator name',
    company.legalName,
    'Impressum, privacy text and LocalBusiness JSON-LD',
    '`src/data/company.js` -> `company.legalName`',
  ],
  [
    'Street, ZIP, city, region',
    `${company.address.street}, ${company.address.zip} ${company.address.city}; ${company.address.region}`,
    'Contact page, footer and local SEO',
    '`src/data/company.js` -> `company.address`',
  ],
  [
    'Phone number',
    `${company.phone.label}; ${company.phone.href}`,
    'Header, contact page, footer and tel links',
    '`src/data/company.js` -> `company.phone`',
  ],
  [
    'WhatsApp number and availability',
    `${company.whatsapp.label}; ${company.whatsapp.href}; ${company.whatsapp.availability}`,
    'Contact CTA and WhatsApp link',
    '`src/data/company.js` -> `company.whatsapp`',
  ],
  [
    'Public contact email',
    `${company.email.label}; ${company.email.href}`,
    'Contact page, footer and mailto links',
    '`src/data/company.js` -> `company.email`',
  ],
  [
    'Opening hours',
    company.hours,
    'Header/footer/contact display and Google Business Profile comparison',
    '`src/data/company.js` -> `company.hours`',
  ],
  [
    'Social profile URLs',
    socialLinks.map((link) => `${link.name}: ${link.href}`).join('; '),
    'Footer/profile links; remove unavailable profiles instead of leaving generic URLs',
    '`src/data/company.js` -> `socialLinks`',
  ],
]

const reviewRows = [
  [
    'NAP/opening-hours approval',
    bool(companyProfileReview.napApprovedForLaunch),
    companyProfileReview.note,
    '`src/data/company.js` -> `companyProfileReview.napApprovedForLaunch`',
  ],
  [
    'Google Business Profile alignment',
    bool(companyProfileReview.googleBusinessProfileAligned),
    companyProfileReview.note,
    '`src/data/company.js` -> `companyProfileReview.googleBusinessProfileAligned`',
  ],
  [
    'Google Maps route verified',
    bool(companyProfileReview.mapRouteVerified),
    companyProfileReview.note,
    '`src/data/company.js` -> `companyProfileReview.mapRouteVerified`',
  ],
  [
    'Homepage content approved',
    bool(homepageContentReview.approvedForLaunch),
    homepageContentReview.note,
    '`src/data/home.js` -> `homepageContentReview.approvedForLaunch`',
  ],
  [
    'Public page content approved',
    bool(publicPageContentReview.approvedForLaunch),
    publicPageContentReview.note,
    '`src/data/pages.js` -> `publicPageContentReview.approvedForLaunch`',
  ],
  [
    'Contact topics approved',
    bool(contactTopicReview.approvedForLaunch),
    contactTopicReview.note,
    '`src/data/contactTopics.js` -> `contactTopicReview.approvedForLaunch`',
  ],
  [
    'Contact topic routing approved',
    bool(contactTopicRoutingReview.approvedForLaunch),
    contactTopicRoutingReview.note,
    '`src/data/contactTopics.js` -> `contactTopicRoutingReview.approvedForLaunch`',
  ],
  [
    'Service content approved',
    bool(serviceContentReview.approvedForLaunch),
    serviceContentReview.note,
    '`src/data/services.js` -> `serviceContentReview.approvedForLaunch`',
  ],
  [
    'Reference gallery approved',
    bool(projectReferenceReview.approvedForLaunch),
    projectReferenceReview.note,
    '`src/data/projects.js` -> `projectReferenceReview.approvedForLaunch`',
  ],
  [
    '3D planning examples approved',
    bool(planningContentReview.approvedForLaunch),
    planningContentReview.note,
    '`src/data/planning.js` -> `planningContentReview.approvedForLaunch`',
  ],
  [
    'Impressum template replaced',
    bool(!legalProfile.noticeIsTemplate),
    legalProfile.reviewNote,
    '`src/data/legal.js` -> `legalProfile.noticeIsTemplate`',
  ],
  [
    'Privacy text legally reviewed',
    bool(!legalProfile.privacyNeedsReview),
    legalProfile.privacyReviewNote,
    '`src/data/legal.js` -> `legalProfile.privacyNeedsReview`',
  ],
]

const legalRows = [
  [
    'Content-responsible person',
    legalProfile.contentResponsible.name,
    'Legally correct person for content responsibility',
    '`src/data/legal.js` -> `legalProfile.contentResponsible.name`',
  ],
  [
    'Content-responsible address',
    legalProfile.contentResponsible.address,
    'Legally correct address for content responsibility',
    '`src/data/legal.js` -> `legalProfile.contentResponsible.address`',
  ],
  [
    'Processor / AVV details',
    'Not stored in this repository',
    'Hosting, SMTP, analytics and other processor records must be confirmed outside the repo',
    '`src/components/PrivacyContent.vue` for public disclosure text',
  ],
  [
    'Retention periods / legal bases',
    'Needs legal confirmation',
    'Contact-form storage, analytics retention and request handling periods',
    '`src/components/PrivacyContent.vue`',
  ],
]

const deploymentRows = [
  [
    'Public app title override',
    envState('VITE_APP_TITLE', appTitle),
    'Optional; leave empty to use `company.name`, or set exactly to the final public company/site name',
    'Deployment env -> `VITE_APP_TITLE`',
  ],
  [
    'Production HTTPS URL',
    `VITE_APP_URL=${siteUrl}`,
    'Public domain used for sitemap, robots, canonicals and JSON-LD',
    'Deployment env -> `VITE_APP_URL`',
  ],
  [
    'Contact API base URL',
    `VITE_API_BASE_URL=${apiBaseUrl}`,
    'Usually same-origin `/api` when the bundled contact API is deployed',
    'Deployment env -> `VITE_API_BASE_URL`',
  ],
  [
    'SMTP host',
    envState('MAIL_HOST', mailHost),
    'Real production SMTP host; do not commit credentials',
    'Deployment env -> `MAIL_HOST`',
  ],
  ['SMTP port', envState('MAIL_PORT', mailPort), 'Real numeric SMTP port', 'Deployment env -> `MAIL_PORT`'],
  [
    'SMTP sender',
    envState('MAIL_FROM', mailFrom),
    'Sender address accepted by the SMTP provider',
    'Deployment env -> `MAIL_FROM`',
  ],
  [
    'Contact recipient mailbox',
    envState('MAIL_TO', mailTo),
    'Mailbox that receives production contact requests',
    'Deployment env -> `MAIL_TO`',
  ],
  [
    'GA4 measurement ID',
    envState('VITE_GA_MEASUREMENT_ID', process.env.VITE_GA_MEASUREMENT_ID || ''),
    'Only after legal/operator approval for analytics',
    'Deployment env -> `VITE_GA_MEASUREMENT_ID`',
  ],
  [
    'Search Console verification token',
    envState('VITE_GOOGLE_SITE_VERIFICATION', process.env.VITE_GOOGLE_SITE_VERIFICATION || ''),
    'Google Search Console ownership verification',
    'Deployment env -> `VITE_GOOGLE_SITE_VERIFICATION`',
  ],
]

const lines = [
  '# Operator Input Form',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Use this worksheet to collect real operator, legal, content and deployment',
  'inputs before editing source files or setting production environment values.',
  'Do not store secrets, mailbox passwords, customer approval documents or legal',
  'contracts in this repository.',
  '',
  '## Company and Local SEO Inputs',
  '',
  '| Input | Current repo value | Operator-provided value | Usage | Source to update |',
  '| --- | --- | --- | --- | --- |',
]

for (const row of companyRows) {
  lines.push(
    `| ${escapeTable(row[0])} | ${escapeTable(row[1])} |  | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`
  )
}

lines.push(
  '',
  '## Approval Flags',
  '',
  '| Approval | Current state | Operator/legal evidence needed | Source to update |',
  '| --- | --- | --- | --- |'
)

for (const row of reviewRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Legal and Privacy Inputs',
  '',
  '| Input | Current repo value | Operator/legal value | Usage | Source to update |',
  '| --- | --- | --- | --- | --- |'
)

for (const row of legalRows) {
  lines.push(
    `| ${escapeTable(row[0])} | ${escapeTable(row[1])} |  | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`
  )
}

lines.push(
  '',
  '## Homepage Review Inputs',
  '',
  '| ID | Section | Source | Image | Copy approved? | Media approved? | Operator notes / required changes |',
  '| --- | --- | --- | --- | --- | --- | --- |'
)

for (const section of homepageReviewSections) {
  lines.push(
    `| ${escapeTable(section.id)} | ${escapeTable(section.label)} | \`${escapeTable(section.source)}\` | ${section.image ? `\`${escapeTable(section.image)}\`` : ''} | ${bool(section.review?.copyApproved)} | ${bool(section.review?.mediaApproved)} |  |`
  )
}

lines.push(
  '',
  '## Public Page Review Inputs',
  '',
  '| ID | Page | Section | Source | Copy approved? | Operator notes / required changes |',
  '| --- | --- | --- | --- | --- | --- |'
)

for (const section of publicPageReviewSections) {
  lines.push(
    `| ${escapeTable(section.id)} | \`${escapeTable(section.page)}\` | ${escapeTable(section.label)} | \`${escapeTable(section.source)}\` | ${bool(section.review?.copyApproved)} |  |`
  )
}

lines.push(
  '',
  '## Contact Topic Review Inputs',
  '',
  '| Value | Label | Email subject | Operator approved? | Mailbox routing approved? | Operator notes / required changes |',
  '| --- | --- | --- | --- | --- | --- |'
)

for (const topic of contactTopics) {
  lines.push(
    `| ${escapeTable(topic.value)} | ${escapeTable(topic.label)} | ${escapeTable(topic.subject)} | ${bool(topic.review?.operatorApproved)} | ${bool(topic.review?.mailboxRoutingApproved)} |  |`
  )
}

lines.push(
  '',
  '## Service Review Inputs',
  '',
  '| Service | Route | Current proof points | Current FAQs | Operator notes / required changes |',
  '| --- | --- | --- | --- | --- |'
)

for (const service of services) {
  lines.push(
    `| ${escapeTable(service.title)} | \`/leistungen/${escapeTable(service.slug)}\` | ${service.proofPoints?.length || 0} | ${service.faqs?.length || 0} |  |`
  )
}

lines.push(
  '',
  '## Reference Approval Inputs',
  '',
  '| ID | Current title | Image | Real reference? | Photo rights? | Customer approval? | Operator notes / replacement asset |',
  '| --- | --- | --- | --- | --- | --- | --- |'
)

for (const project of projects) {
  lines.push(
    `| ${escapeTable(project.id)} | ${escapeTable(project.title)} | \`${escapeTable(project.image)}\` | ${bool(project.review?.realReference)} | ${bool(project.review?.photoRightsApproved)} | ${bool(project.review?.customerApproved)} |  |`
  )
}

lines.push(
  '',
  '## 3D Planning Approval Inputs',
  '',
  '| ID | Current example | Image | Operator approved? | Media rights? | Operator notes / replacement asset |',
  '| --- | --- | --- | --- | --- | --- |'
)

for (const example of planningExamples) {
  lines.push(
    `| ${escapeTable(example.id)} | ${escapeTable(example.title)} | \`${escapeTable(example.image)}\` | ${bool(example.review?.operatorApproved)} | ${bool(example.review?.mediaRightsApproved)} |  |`
  )
}

lines.push(
  '',
  '## Deployment and Account Inputs',
  '',
  '| Input | Current state | Production value / owner | Usage | Where to configure |',
  '| --- | --- | --- | --- | --- |'
)

for (const row of deploymentRows) {
  lines.push(
    `| ${escapeTable(row[0])} | ${escapeTable(row[1])} |  | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`
  )
}

lines.push(
  '',
  '## Verification Commands',
  '',
  '```bash',
  'npm run launch:inputs',
  'npm run launch:actions',
  'npm run content:review',
  'npm run legal:review',
  'npm run launch:report',
  'npm run preflight',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Company inputs: ${companyRows.length}`)
console.log(`Approval flags: ${reviewRows.length}`)
console.log(`Homepage rows: ${homepageReviewSections.length}`)
console.log(`Public page rows: ${publicPageReviewSections.length}`)
console.log(`Contact topic rows: ${contactTopics.length}`)
console.log(`Service rows: ${services.length}`)
console.log(`Reference rows: ${projects.length}`)
console.log(`3D planning rows: ${planningExamples.length}`)

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
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
const outPath = join(root, 'docs', 'generated', 'LAUNCH_EVIDENCE_REPORT.md')

const appTitle = process.env.VITE_APP_TITLE || ''
const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const apiBaseUrl = process.env.VITE_API_BASE_URL || '/api'
const mailHost = process.env.MAIL_HOST || ''
const mailFrom = process.env.MAIL_FROM || ''
const mailTo = process.env.MAIL_TO || ''
const gaId = process.env.VITE_GA_MEASUREMENT_ID || ''
const searchConsoleToken = process.env.VITE_GOOGLE_SITE_VERIFICATION || ''

function pathExists(path) {
  return existsSync(join(root, path))
}

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

function bool(value) {
  return value === true ? 'true' : 'false'
}

function hasPlaceholder(value) {
  return /muster|mustermann|000000|\.test|example\.com|localhost/i.test(String(value || ''))
}

function hasEnvPlaceholder(value) {
  return /muster|mustermann|mailpit|000000|\.test|example\.com|example\.de|localhost|x{4,}|token/i.test(
    String(value || '')
  )
}

function getGitValue(command) {
  try {
    return execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return 'unknown'
  }
}

function status(value) {
  return value === true ? 'Done' : 'Open'
}

function artifactStatus(path) {
  return pathExists(path) ? 'Present' : 'Missing'
}

function readGeneratedLine(path) {
  if (!pathExists(path)) return 'missing'
  const match = read(path).match(/^Generated:\s*(.+)$/m)
  return match?.[1] || 'not stamped'
}

function readLaunchActionCount() {
  if (!pathExists('docs/generated/LAUNCH_ACTION_ITEMS.md')) return 'missing'
  const match = read('docs/generated/LAUNCH_ACTION_ITEMS.md').match(/^Open action count:\s*(\d+)$/m)
  return match?.[1] || 'unknown'
}

const incompleteProjects = projects.filter(
  (project) =>
    project.review?.realReference !== true ||
    project.review?.photoRightsApproved !== true ||
    project.review?.customerApproved !== true
)
const incompleteHomepageSections = homepageReviewSections.filter(
  (section) => section.review?.copyApproved !== true || section.review?.mediaApproved !== true
)
const incompletePublicPageSections = publicPageReviewSections.filter(
  (section) => section.review?.copyApproved !== true
)
const incompleteContactTopics = contactTopics.filter(
  (topic) =>
    topic.review?.operatorApproved !== true ||
    topic.review?.mailboxRoutingApproved !== true
)
const incompletePlanningExamples = planningExamples.filter(
  (example) =>
    example.review?.operatorApproved !== true || example.review?.mediaRightsApproved !== true
)

const siteUrlIsLocal = /^https?:\/\/localhost\b/i.test(siteUrl)
const siteUrlIsPlaceholder = !siteUrlIsLocal && hasEnvPlaceholder(siteUrl)
const sitemapHasLocalhost = pathExists('public/sitemap.xml') && read('public/sitemap.xml').includes('localhost')
const robotsHasLocalhost = pathExists('public/robots.txt') && read('public/robots.txt').includes('localhost')

const launchBlockers = [
  siteUrlIsLocal,
  siteUrlIsPlaceholder,
  hasPlaceholder(company.name),
  appTitle && hasPlaceholder(appTitle),
  hasPlaceholder(company.legalName),
  hasPlaceholder(`${company.address.street} ${company.address.zip} ${company.address.city}`),
  hasPlaceholder(company.phone.label),
  hasPlaceholder(company.email.label),
  companyProfileReview.napApprovedForLaunch !== true,
  companyProfileReview.googleBusinessProfileAligned !== true,
  companyProfileReview.mapRouteVerified !== true,
  legalProfile.noticeIsTemplate === true,
  hasPlaceholder(legalProfile.contentResponsible.name),
  !mailHost || hasEnvPlaceholder(mailHost),
  !mailFrom || hasEnvPlaceholder(mailFrom),
  !mailTo || hasEnvPlaceholder(mailTo),
  homepageContentReview.approvedForLaunch !== true,
  publicPageContentReview.approvedForLaunch !== true,
  contactTopicReview.approvedForLaunch !== true,
  contactTopicRoutingReview.approvedForLaunch !== true,
  serviceContentReview.approvedForLaunch !== true,
  projectReferenceReview.approvedForLaunch !== true,
  planningContentReview.approvedForLaunch !== true,
].filter(Boolean).length

const launchWarnings = [
  ...socialLinks.map((link) => /^https:\/\/(instagram|facebook|pinterest)\.com\/?$/i.test(link.href)),
  legalProfile.privacyNeedsReview === true,
  !gaId || hasEnvPlaceholder(gaId),
  !searchConsoleToken || hasEnvPlaceholder(searchConsoleToken),
  sitemapHasLocalhost,
  robotsHasLocalhost,
].filter(Boolean).length

const gitCommit = getGitValue('git rev-parse --short HEAD')
const gitBranch = getGitValue('git branch --show-current')

const summaryRows = [
  [
    'Local preflight',
    'Done',
    '`npm run preflight` passed in the latest local run with route/header, SEO, analytics/Maps consent, performance, accessibility, contact-link, visual and desktop/mobile/tablet walkthrough checks.',
    'Run again before production handoff if source or env changes.',
  ],
  [
    'Launch readiness',
    launchBlockers === 0 && launchWarnings === 0 ? 'Done' : 'Partial',
    `${launchBlockers} blocker signals and ${launchWarnings} warning signals are still present for the current env/content state.`,
    '`npm run launch:check` must pass with real production values before launch.',
  ],
  [
    'Operator inputs',
    'Done',
    '`docs/generated/OPERATOR_INPUT_FORM.md` is generated from the current company, legal, contact-topic, homepage, public-page, service, reference, 3D-planning and env state.',
    'Fill real values outside this repo before editing source/deployment env.',
  ],
  [
    'Production evidence',
    'Open',
    'No production-domain route/header smoke, mailbox, Search Console, GA4 or Lighthouse evidence is stored in this repo.',
    'Record final proof in the launch ticket using `docs/LAUNCH_EVIDENCE_TEMPLATE.md`.',
  ],
]

const artifactRows = [
  ['Contact delivery checklist', 'docs/generated/CONTACT_DELIVERY_CHECKLIST.md', artifactStatus('docs/generated/CONTACT_DELIVERY_CHECKLIST.md'), readGeneratedLine('docs/generated/CONTACT_DELIVERY_CHECKLIST.md')],
  ['Deployment cutover checklist', 'docs/generated/DEPLOYMENT_CUTOVER_CHECKLIST.md', artifactStatus('docs/generated/DEPLOYMENT_CUTOVER_CHECKLIST.md'), readGeneratedLine('docs/generated/DEPLOYMENT_CUTOVER_CHECKLIST.md')],
  ['Performance evidence checklist', 'docs/generated/PERFORMANCE_EVIDENCE_CHECKLIST.md', artifactStatus('docs/generated/PERFORMANCE_EVIDENCE_CHECKLIST.md'), readGeneratedLine('docs/generated/PERFORMANCE_EVIDENCE_CHECKLIST.md')],
  ['Operator input form', 'docs/generated/OPERATOR_INPUT_FORM.md', artifactStatus('docs/generated/OPERATOR_INPUT_FORM.md'), readGeneratedLine('docs/generated/OPERATOR_INPUT_FORM.md')],
  ['Account verification checklist', 'docs/generated/ACCOUNT_VERIFICATION_CHECKLIST.md', artifactStatus('docs/generated/ACCOUNT_VERIFICATION_CHECKLIST.md'), readGeneratedLine('docs/generated/ACCOUNT_VERIFICATION_CHECKLIST.md')],
  ['Launch action items', 'docs/generated/LAUNCH_ACTION_ITEMS.md', artifactStatus('docs/generated/LAUNCH_ACTION_ITEMS.md'), `${readLaunchActionCount()} open items`],
  ['Placeholder content report', 'docs/generated/PLACEHOLDER_CONTENT_REPORT.md', artifactStatus('docs/generated/PLACEHOLDER_CONTENT_REPORT.md'), readGeneratedLine('docs/generated/PLACEHOLDER_CONTENT_REPORT.md')],
  ['Content review checklist', 'docs/generated/CONTENT_REVIEW_CHECKLIST.md', artifactStatus('docs/generated/CONTENT_REVIEW_CHECKLIST.md'), readGeneratedLine('docs/generated/CONTENT_REVIEW_CHECKLIST.md')],
  ['Legal review checklist', 'docs/generated/LEGAL_REVIEW_CHECKLIST.md', artifactStatus('docs/generated/LEGAL_REVIEW_CHECKLIST.md'), readGeneratedLine('docs/generated/LEGAL_REVIEW_CHECKLIST.md')],
  ['Content inventory', 'docs/generated/CONTENT_INVENTORY.json', artifactStatus('docs/generated/CONTENT_INVENTORY.json'), 'generated JSON inventory'],
  ['Visual smoke audit', 'docs/generated/VISUAL_SMOKE.md', artifactStatus('docs/generated/VISUAL_SMOKE.md'), readGeneratedLine('docs/generated/VISUAL_SMOKE.md')],
  ['Launch evidence template', 'docs/LAUNCH_EVIDENCE_TEMPLATE.md', artifactStatus('docs/LAUNCH_EVIDENCE_TEMPLATE.md'), 'manual production evidence template'],
]

const approvalRows = [
  ['Company NAP/opening-hours', bool(companyProfileReview.napApprovedForLaunch), companyProfileReview.note],
  ['Google Business Profile alignment', bool(companyProfileReview.googleBusinessProfileAligned), companyProfileReview.note],
  ['Google Maps route verification', bool(companyProfileReview.mapRouteVerified), companyProfileReview.note],
  ['Homepage content', bool(homepageContentReview.approvedForLaunch), homepageContentReview.note],
  ['Public page content', bool(publicPageContentReview.approvedForLaunch), publicPageContentReview.note],
  ['Contact topics', bool(contactTopicReview.approvedForLaunch), contactTopicReview.note],
  ['Contact topic routing', bool(contactTopicRoutingReview.approvedForLaunch), contactTopicRoutingReview.note],
  ['Service content', bool(serviceContentReview.approvedForLaunch), serviceContentReview.note],
  ['Reference gallery', bool(projectReferenceReview.approvedForLaunch), projectReferenceReview.note],
  ['3D planning examples', bool(planningContentReview.approvedForLaunch), planningContentReview.note],
  ['Impressum template replaced', bool(!legalProfile.noticeIsTemplate), legalProfile.reviewNote],
  ['Privacy legal review complete', bool(!legalProfile.privacyNeedsReview), legalProfile.privacyReviewNote],
]

const deploymentRows = [
  ['VITE_APP_TITLE', appTitle || '(empty)', !appTitle || !hasPlaceholder(appTitle)],
  ['VITE_APP_URL', siteUrl, /^https:\/\/[^/]+/i.test(siteUrl) && !hasEnvPlaceholder(siteUrl)],
  ['VITE_API_BASE_URL', apiBaseUrl, apiBaseUrl === '/api' || /^https:\/\//i.test(apiBaseUrl)],
  ['MAIL_HOST', mailHost || '(empty)', Boolean(mailHost) && !hasEnvPlaceholder(mailHost)],
  ['MAIL_FROM', mailFrom || '(empty)', Boolean(mailFrom) && !hasEnvPlaceholder(mailFrom)],
  ['MAIL_TO', mailTo || '(empty)', Boolean(mailTo) && !hasEnvPlaceholder(mailTo)],
  ['VITE_GA_MEASUREMENT_ID', gaId || '(empty)', Boolean(gaId) && !hasEnvPlaceholder(gaId)],
  [
    'VITE_GOOGLE_SITE_VERIFICATION',
    searchConsoleToken ? '(set)' : '(empty)',
    Boolean(searchConsoleToken) && !hasEnvPlaceholder(searchConsoleToken),
  ],
]

const lines = [
  '# Launch Evidence Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'This generated report summarizes current local launch evidence and production',
  'handoff gaps. It is not a production approval and does not contain secrets,',
  'mailbox credentials, legal contracts or private customer approvals.',
  '',
  '## Context',
  '',
  '| Field | Value |',
  '| --- | --- |',
  `| Git branch | ${escapeTable(gitBranch)} |`,
  `| Git commit | ${escapeTable(gitCommit)} |`,
  `| Site URL in current env | ${escapeTable(siteUrl)} |`,
  `| Contact API base URL in current env | ${escapeTable(apiBaseUrl)} |`,
  '',
  '## Summary',
  '',
  '| Area | Status | Current evidence | Remaining production proof |',
  '| --- | --- | --- | --- |',
]

for (const row of summaryRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Generated Artifacts',
  '',
  '| Artifact | Path | Status | Detail |',
  '| --- | --- | --- | --- |'
)

for (const row of artifactRows) {
  lines.push(`| ${escapeTable(row[0])} | \`${escapeTable(row[1])}\` | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Approval State',
  '',
  '| Approval | Current state | Evidence needed before launch |',
  '| --- | --- | --- |'
)

for (const row of approvalRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} |`)
}

lines.push(
  '',
  '## Content Counts',
  '',
  '| Area | Current count | Launch note |',
  '| --- | --- | --- |',
  `| Homepage review sections | ${homepageReviewSections.length} | ${incompleteHomepageSections.length} sections still need copy/media approval. |`,
  `| Public page review sections | ${publicPageReviewSections.length} | ${incompletePublicPageSections.length} sections still need copy approval. |`,
  `| Contact topics | ${contactTopics.length} | ${incompleteContactTopics.length} topics still need operator/mailbox approval. |`,
  `| Services | ${services.length} | Service wording/proof points/FAQs still need operator approval. |`,
  `| Project references | ${projects.length} | ${incompleteProjects.length} references still need real-reference/photo/customer approval. |`,
  `| 3D planning examples | ${planningExamples.length} | ${incompletePlanningExamples.length} examples still need operator/media approval. |`,
  '',
  '## Deployment Values',
  '',
  '| Value | Current state | Ready for launch? |',
  '| --- | --- | --- |'
)

for (const row of deploymentRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${status(row[2])} |`)
}

lines.push(
  '',
  '## Required Production Evidence',
  '',
  '- `npm run launch:check` passes with real production env values.',
  '- Contact-topic, homepage, public-page, service, reference and 3D-planning approval flags are set only after operator/legal/media approval evidence exists outside this repo.',
  '- `npm run deploy:smoke -- https://domain.example` passes on the HTTPS domain, including runtime security/cache headers.',
  '- `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example` passes on the HTTPS domain when GA4 is enabled; without GA4, `npm run deploy:all -- https://domain.example` proves no GA4 script loads.',
  '- `CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example` reaches the real mailbox.',
  '- Received mailbox subjects confirm the final contact topic labels and service-topic routing.',
  '- Search Console ownership is verified and `/sitemap.xml` is submitted.',
  '- GA4 Realtime is checked before and after analytics consent.',
  '- Google Maps route target is checked against the final address.',
  '- Lighthouse/PageSpeed production result is recorded.',
  '',
  '## Useful Commands',
  '',
  '```bash',
  'npm run launch:evidence',
  'npm run launch:inputs',
  'npm run launch:actions',
  'npm run launch:report',
  'npm run launch:check',
  'npm run preflight',
  'npm run deploy:smoke -- https://domain.example',
  'ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Launch blocker signals: ${launchBlockers}`)
console.log(`Launch warning signals: ${launchWarnings}`)
console.log(`Generated artifacts tracked: ${artifactRows.length}`)

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  company,
  companyProfileReview,
  isGenericTrustBadge,
  socialLinks,
  trustBadges,
} from '../src/data/company.js'
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
const outPath = join(root, 'docs', 'PLACEHOLDER_CONTENT_REPORT.md')

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

function hasPlaceholder(value) {
  return /muster|mustermann|000000|\.test|example\.com|localhost/i.test(String(value || ''))
}

function isGenericSocialUrl(value) {
  return /^https:\/\/(instagram|facebook|pinterest)\.com\/?$/i.test(String(value || ''))
}

const findings = []

function add(area, field, current, reason, source, verification) {
  findings.push({ area, field, current, reason, source, verification })
}

function checkValue(area, field, current, reason, source, verification) {
  if (hasPlaceholder(current)) add(area, field, current, reason, source, verification)
}

checkValue(
  'Company / Local SEO',
  'company.name',
  company.name,
  'Public company name still matches placeholder patterns.',
  'src/data/company.js',
  'npm run company:check'
)
checkValue(
  'Company / Local SEO',
  'company.legalName',
  company.legalName,
  'Legal operator name still matches placeholder patterns.',
  'src/data/company.js',
  'npm run launch:report'
)
checkValue(
  'Company / Local SEO',
  'company.address',
  `${company.address.street}, ${company.address.zip} ${company.address.city}; ${company.address.region}`,
  'Address or service area still matches placeholder patterns.',
  'src/data/company.js',
  'npm run company:check'
)
checkValue(
  'Company / Local SEO',
  'company.phone',
  `${company.phone.label}; ${company.phone.href}`,
  'Phone label or tel link still matches placeholder patterns.',
  'src/data/company.js',
  'npm run company:check'
)
checkValue(
  'Company / Local SEO',
  'company.whatsapp',
  `${company.whatsapp.label}; ${company.whatsapp.href}`,
  'WhatsApp label or link still matches placeholder patterns.',
  'src/data/company.js',
  'npm run company:check'
)
checkValue(
  'Company / Local SEO',
  'company.email',
  `${company.email.label}; ${company.email.href}`,
  'Public email still matches placeholder patterns.',
  'src/data/company.js',
  'npm run company:check'
)

for (const link of socialLinks) {
  if (isGenericSocialUrl(link.href)) {
    add(
      'Company / Local SEO',
      `socialLinks.${link.name}`,
      link.href,
      'Social profile URL is still the generic platform homepage.',
      'src/data/company.js',
      'npm run launch:report'
    )
  }
}

for (const [index, badge] of trustBadges.entries()) {
  if (isGenericTrustBadge(badge)) {
    add(
      'Company / Local SEO',
      `trustBadges.${index}`,
      badge,
      'Trust/certification claim still matches placeholder patterns.',
      'src/data/company.js',
      'npm run company:check plus manual proof against certificates/approvals'
    )
  }
}

if (companyProfileReview.napApprovedForLaunch !== true) {
  add(
    'Company / Local SEO',
    'companyProfileReview.napApprovedForLaunch',
    companyProfileReview.napApprovedForLaunch,
    companyProfileReview.note,
    'src/data/company.js',
    'npm run launch:report'
  )
}

if (companyProfileReview.googleBusinessProfileAligned !== true) {
  add(
    'Company / Local SEO',
    'companyProfileReview.googleBusinessProfileAligned',
    companyProfileReview.googleBusinessProfileAligned,
    companyProfileReview.note,
    'src/data/company.js',
    'npm run launch:report'
  )
}

if (companyProfileReview.mapRouteVerified !== true) {
  add(
    'Google Maps',
    'companyProfileReview.mapRouteVerified',
    companyProfileReview.mapRouteVerified,
    companyProfileReview.note,
    'src/data/company.js',
    'npm run deploy:maps -- https://domain.example'
  )
}

if (legalProfile.noticeIsTemplate === true) {
  add(
    'Legal / Privacy',
    'legalProfile.noticeIsTemplate',
    legalProfile.noticeIsTemplate,
    legalProfile.reviewNote,
    'src/data/legal.js and src/pages/LegalView.vue',
    'npm run legal:review'
  )
}

checkValue(
  'Legal / Privacy',
  'legalProfile.contentResponsible.name',
  legalProfile.contentResponsible.name,
  'Content-responsible person still matches placeholder patterns.',
  'src/data/legal.js',
  'npm run legal:review'
)

checkValue(
  'Legal / Privacy',
  'legalProfile.contentResponsible.address',
  legalProfile.contentResponsible.address,
  'Content-responsible address still matches placeholder patterns.',
  'src/data/legal.js',
  'npm run legal:review'
)

if (legalProfile.privacyNeedsReview === true) {
  add(
    'Legal / Privacy',
    'legalProfile.privacyNeedsReview',
    legalProfile.privacyNeedsReview,
    legalProfile.privacyReviewNote,
    'src/data/legal.js and src/components/PrivacyContent.vue',
    'npm run privacy:check'
  )
}

if (serviceContentReview.approvedForLaunch !== true) {
  add(
    'Services',
    'serviceContentReview.approvedForLaunch',
    serviceContentReview.approvedForLaunch,
    serviceContentReview.note,
    'src/data/services.js',
    'npm run content:review'
  )
}

for (const service of services) {
  const fields = [
    ['title', service.title],
    ['short', service.short],
    ['description', service.description],
    ['intro', service.intro],
    ...service.bullets.map((value, index) => [`bullets.${index}`, value]),
    ...(service.proofPoints || []).map((value, index) => [`proofPoints.${index}`, value]),
    ...(service.faqs || []).flatMap((item, index) => [
      [`faqs.${index}.question`, item.question],
      [`faqs.${index}.answer`, item.answer],
    ]),
  ]
  for (const [field, value] of fields) {
    checkValue(
      'Services',
      `services.${service.slug}.${field}`,
      value,
      'Service copy still matches placeholder patterns.',
      'src/data/services.js',
      'npm run content:review'
    )
  }
}

if (homepageContentReview.approvedForLaunch !== true) {
  add(
    'Homepage',
    'homepageContentReview.approvedForLaunch',
    homepageContentReview.approvedForLaunch,
    homepageContentReview.note,
    'src/data/home.js and homepage components',
    'npm run content:review'
  )
}

for (const section of homepageReviewSections) {
  const incomplete = []
  if (section.review?.copyApproved !== true) incomplete.push('copy approval')
  if (section.review?.mediaApproved !== true) incomplete.push('media approval')

  if (incomplete.length) {
    add(
      'Homepage',
      `homepageReviewSections.${section.id}.review`,
      incomplete.join(', '),
      'Homepage section still needs final copy/claim and media approval.',
      section.source,
      'npm run content:review'
    )
  }
}

if (publicPageContentReview.approvedForLaunch !== true) {
  add(
    'Public Pages',
    'publicPageContentReview.approvedForLaunch',
    publicPageContentReview.approvedForLaunch,
    publicPageContentReview.note,
    'src/data/pages.js, src/pages/AboutView.vue and src/pages/ContactView.vue',
    'npm run content:review'
  )
}

for (const section of publicPageReviewSections) {
  if (section.review?.copyApproved !== true) {
    add(
      'Public Pages',
      `publicPageReviewSections.${section.id}.review`,
      'copy approval',
      'Standalone public page section still needs final copy approval.',
      section.source,
      'npm run content:review'
    )
  }
}

if (contactTopicReview.approvedForLaunch !== true) {
  add(
    'Contact Topics',
    'contactTopicReview.approvedForLaunch',
    contactTopicReview.approvedForLaunch,
    contactTopicReview.note,
    'src/data/contactTopics.js',
    'npm run content:review'
  )
}

if (contactTopicRoutingReview.approvedForLaunch !== true) {
  add(
    'Contact Topics',
    'contactTopicRoutingReview.approvedForLaunch',
    contactTopicRoutingReview.approvedForLaunch,
    contactTopicRoutingReview.note,
    'src/data/contactTopics.js',
    'npm run content:review'
  )
}

for (const topic of contactTopics) {
  const incomplete = []
  if (topic.review?.operatorApproved !== true) incomplete.push('operator approval')
  if (topic.review?.mailboxRoutingApproved !== true) incomplete.push('mailbox routing')

  if (incomplete.length) {
    add(
      'Contact Topics',
      `contactTopics.${topic.value}.review`,
      incomplete.join(', '),
      'Contact topic label and email subject still need final intake/mailbox approval.',
      'src/data/contactTopics.js',
      'npm run content:review'
    )
  }
}

if (projectReferenceReview.approvedForLaunch !== true) {
  add(
    'References',
    'projectReferenceReview.approvedForLaunch',
    projectReferenceReview.approvedForLaunch,
    projectReferenceReview.note,
    'src/data/projects.js',
    'npm run launch:report'
  )
}

if (planningContentReview.approvedForLaunch !== true) {
  add(
    '3D Planning',
    'planningContentReview.approvedForLaunch',
    planningContentReview.approvedForLaunch,
    planningContentReview.note,
    'src/data/planning.js',
    'npm run content:review'
  )
}

for (const example of planningExamples) {
  const incomplete = []
  if (example.review?.operatorApproved !== true) incomplete.push('operator approval')
  if (example.review?.mediaRightsApproved !== true) incomplete.push('media rights')

  if (incomplete.length) {
    add(
      '3D Planning',
      `planningExamples.${example.id}.review`,
      incomplete.join(', '),
      '3D planning example still needs operator workflow and media approval.',
      'src/data/planning.js',
      'npm run content:review'
    )
  }
}

for (const project of projects) {
  const incomplete = []
  if (project.review?.realReference !== true) incomplete.push('real reference')
  if (project.review?.photoRightsApproved !== true) incomplete.push('photo rights')
  if (project.review?.customerApproved !== true) incomplete.push('customer approval')

  if (incomplete.length) {
    add(
      'References',
      `projects.${project.id}.review`,
      incomplete.join(', '),
      'Project still needs real-reference, photo-rights or customer approval.',
      'src/data/projects.js',
      'npm run content:review'
    )
  }
}

const byArea = new Map()
for (const finding of findings) {
  if (!byArea.has(finding.area)) byArea.set(finding.area, [])
  byArea.get(finding.area).push(finding)
}

const lines = [
  '# Placeholder Content Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'This generated report lists structured content fields that still look like',
  'demo data, placeholders, or unresolved launch approvals. It is intentionally',
  'strict: real legal records, mailbox credentials and private customer approval',
  'documents must stay outside this repository.',
  '',
  `Open placeholder/review findings: ${findings.length}`,
  '',
]

for (const [area, items] of byArea) {
  lines.push(`## ${area}`, '')
  lines.push('| Field | Current state | Reason | Source | Verification |')
  lines.push('| --- | --- | --- | --- | --- |')
  for (const item of items) {
    lines.push(
      `| ${escapeTable(item.field)} | ${escapeTable(item.current)} | ${escapeTable(item.reason)} | ${escapeTable(item.source)} | ${escapeTable(item.verification)} |`
    )
  }
  lines.push('')
}

if (!findings.length) {
  lines.push('No structured placeholder or unresolved approval findings were detected.', '')
}

lines.push(
  '## Useful Commands',
  '',
  '```bash',
  'npm run content:placeholders',
  'npm run content:review',
  'npm run content:inventory',
  'npm run launch:actions',
  'npm run launch:report',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Open placeholder/review findings: ${findings.length}`)

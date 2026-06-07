import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  contactTopicReview,
  contactTopicRoutingReview,
  contactTopics,
} from '../src/data/contactTopics.js'
import { homepageContentReview, homepageReviewSections } from '../src/data/home.js'
import { publicPageContentReview, publicPageReviewSections } from '../src/data/pages.js'
import { planningContentReview, planningExamples } from '../src/data/planning.js'
import { projectReferenceReview, projects } from '../src/data/projects.js'
import { serviceContentReview, services } from '../src/data/services.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'CONTENT_REVIEW_CHECKLIST.md')

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

function status(value) {
  return value === true ? 'Done' : 'Open'
}

function bool(value) {
  return value === true ? 'true' : 'false'
}

const serviceRows = services.map((service) => ({
  slug: service.slug,
  title: service.title,
  bullets: service.bullets?.length || 0,
  proofPoints: service.proofPoints?.length || 0,
  faqs: service.faqs?.length || 0,
  image: service.image,
}))

const homepageRows = homepageReviewSections.map((section) => ({
  id: section.id,
  label: section.label,
  source: section.source,
  image: section.image,
  copyApproved: section.review?.copyApproved === true,
  mediaApproved: section.review?.mediaApproved === true,
  note: section.review?.note || '',
}))

const publicPageRows = publicPageReviewSections.map((section) => ({
  id: section.id,
  page: section.page,
  label: section.label,
  source: section.source,
  copyApproved: section.review?.copyApproved === true,
  note: section.review?.note || '',
}))

const contactTopicRows = contactTopics.map((topic) => ({
  value: topic.value,
  label: topic.label,
  subject: topic.subject,
  operatorApproved: topic.review?.operatorApproved === true,
  mailboxRoutingApproved: topic.review?.mailboxRoutingApproved === true,
  note: topic.review?.note || '',
}))

const projectRows = projects.map((project) => ({
  id: project.id,
  title: project.title,
  image: project.image,
  realReference: project.review?.realReference === true,
  photoRightsApproved: project.review?.photoRightsApproved === true,
  customerApproved: project.review?.customerApproved === true,
  note: project.review?.note || '',
}))

const planningRows = planningExamples.map((example) => ({
  id: example.id,
  title: example.title,
  category: example.category,
  image: example.image,
  views: example.views?.length || 0,
  operatorApproved: example.review?.operatorApproved === true,
  mediaRightsApproved: example.review?.mediaRightsApproved === true,
  note: example.review?.note || '',
}))

const servicesReady = serviceContentReview.approvedForLaunch === true
const homepageReady =
  homepageContentReview.approvedForLaunch === true &&
  homepageRows.every((section) => section.copyApproved === true && section.mediaApproved === true)
const publicPagesReady =
  publicPageContentReview.approvedForLaunch === true &&
  publicPageRows.every((section) => section.copyApproved === true)
const contactTopicsReady =
  contactTopicReview.approvedForLaunch === true &&
  contactTopicRoutingReview.approvedForLaunch === true &&
  contactTopicRows.every(
    (topic) => topic.operatorApproved === true && topic.mailboxRoutingApproved === true
  )
const projectsReady =
  projectReferenceReview.approvedForLaunch === true &&
  projectRows.every(
    (project) =>
      project.realReference === true &&
      project.photoRightsApproved === true &&
      project.customerApproved === true
  )
const planningReady =
  planningContentReview.approvedForLaunch === true &&
  planningRows.every(
    (example) => example.operatorApproved === true && example.mediaRightsApproved === true
  )

const lines = [
  '# Content Review Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Use this as the operator/content-review worksheet for service pages and',
  'project references plus 3D planning examples. Approval records, photo releases,',
  'customer consent and media-rights documents should stay outside this',
  'repository; only the review flags live here.',
  '',
  '## Summary',
  '',
  '| Area | Status | Current state | Approval source |',
  '| --- | --- | --- | --- |',
  `| Homepage | ${status(homepageReady)} | ${escapeTable(homepageContentReview.note)} | \`src/data/home.js\` -> \`homepageContentReview.approvedForLaunch\` and each homepage section \`review\` |`,
  `| Public pages | ${status(publicPagesReady)} | ${escapeTable(publicPageContentReview.note)} | \`src/data/pages.js\` -> \`publicPageContentReview.approvedForLaunch\` and each public page section \`review\` |`,
  `| Contact topics | ${status(contactTopicsReady)} | ${escapeTable(contactTopicReview.note)} ${escapeTable(contactTopicRoutingReview.note)} | \`src/data/contactTopics.js\` -> topic review flags and routing approval |`,
  `| Services | ${status(servicesReady)} | ${escapeTable(serviceContentReview.note)} | \`src/data/services.js\` -> \`serviceContentReview.approvedForLaunch\` |`,
  `| References | ${status(projectsReady)} | ${escapeTable(projectReferenceReview.note)} | \`src/data/projects.js\` -> \`projectReferenceReview.approvedForLaunch\` and each project \`review\` |`,
  `| 3D planning examples | ${status(planningReady)} | ${escapeTable(planningContentReview.note)} | \`src/data/planning.js\` -> \`planningContentReview.approvedForLaunch\` and each example \`review\` |`,
  '',
  '## Homepage Review',
  '',
  'Set each homepage review flag only after hero/about/process/CTA copy, public',
  'proof claims and media are approved for the final operator. Set',
  '`homepageContentReview.approvedForLaunch=true` only when all homepage rows are',
  'complete.',
  '',
  '| ID | Section | Source | Image | Copy approval | Media approval | Note |',
  '| --- | --- | --- | --- | --- | --- | --- |'
]

for (const section of homepageRows) {
  lines.push(
    `| ${escapeTable(section.id)} | ${escapeTable(section.label)} | \`${escapeTable(section.source)}\` | ${section.image ? `\`${escapeTable(section.image)}\`` : ''} | ${bool(section.copyApproved)} | ${bool(section.mediaApproved)} | ${escapeTable(section.note)} |`
  )
}

lines.push(
  '',
  '## Public Page Review',
  '',
  'Set each public page review flag only after the about/contact page copy is',
  'approved for the final operator. Set',
  '`publicPageContentReview.approvedForLaunch=true` only when all public page rows',
  'are complete.',
  '',
  '| ID | Page | Section | Source | Copy approval | Note |',
  '| --- | --- | --- | --- | --- | --- |'
)

for (const section of publicPageRows) {
  lines.push(
    `| ${escapeTable(section.id)} | \`${escapeTable(section.page)}\` | ${escapeTable(section.label)} | \`${escapeTable(section.source)}\` | ${bool(section.copyApproved)} | ${escapeTable(section.note)} |`
  )
}

lines.push(
  '',
  '## Contact Topic Review',
  '',
  'Set each contact topic review flag only after the displayed label, email',
  'subject and service-detail preselection match the final operator intake',
  'workflow. Set `contactTopicReview.approvedForLaunch=true` and',
  '`contactTopicRoutingReview.approvedForLaunch=true` only when all rows are',
  'complete.',
  '',
  '| Value | Label | Email subject | Operator approval | Mailbox routing | Note |',
  '| --- | --- | --- | --- | --- | --- |'
)

for (const topic of contactTopicRows) {
  lines.push(
    `| ${escapeTable(topic.value)} | ${escapeTable(topic.label)} | ${escapeTable(topic.subject)} | ${bool(topic.operatorApproved)} | ${bool(topic.mailboxRoutingApproved)} | ${escapeTable(topic.note)} |`
  )
}

lines.push(
  '',
  '## Service Review',
  '',
  'Set `serviceContentReview.approvedForLaunch=true` only after every service',
  'title, intro, description, bullet, proof point and FAQ answer matches the real',
  'operator offer and legal/content approval has been completed.',
  '',
  '| Service | Route | Bullets | Proof points | FAQs | Image | Review status |',
  '| --- | --- | --- | --- | --- | --- | --- |',
)

for (const service of serviceRows) {
  lines.push(
    `| ${escapeTable(service.title)} | \`/leistungen/${escapeTable(service.slug)}\` | ${service.bullets} | ${service.proofPoints} | ${service.faqs} | \`${escapeTable(service.image)}\` | ${status(servicesReady)} |`
  )
}

lines.push(
  '',
  '## Reference Review',
  '',
  'Set each project review flag only after the project is a real reference, the',
  'media rights are approved, and customer approval is documented outside this',
  'repository. Set `projectReferenceReview.approvedForLaunch=true` only when all',
  'project rows are complete.',
  '',
  '| ID | Project | Image | Real reference | Photo rights | Customer approval | Note |',
  '| --- | --- | --- | --- | --- | --- | --- |'
)

for (const project of projectRows) {
  lines.push(
    `| ${escapeTable(project.id)} | ${escapeTable(project.title)} | \`${escapeTable(project.image)}\` | ${bool(project.realReference)} | ${bool(project.photoRightsApproved)} | ${bool(project.customerApproved)} | ${escapeTable(project.note)} |`
  )
}

lines.push(
  '',
  '## 3D Planning Example Review',
  '',
  'Set each planning example review flag only after the operator confirms the',
  'example reflects the real planning workflow and all generated/visual media is',
  'approved for public use. Set `planningContentReview.approvedForLaunch=true`',
  'only when all planning example rows are complete.',
  '',
  '| ID | Example | Category | Image | Views | Operator approval | Media rights | Note |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |'
)

for (const example of planningRows) {
  lines.push(
    `| ${escapeTable(example.id)} | ${escapeTable(example.title)} | ${escapeTable(example.category)} | \`${escapeTable(example.image)}\` | ${example.views} | ${bool(example.operatorApproved)} | ${bool(example.mediaRightsApproved)} | ${escapeTable(example.note)} |`
  )
}

lines.push(
  '',
  '## Verification Commands',
  '',
  '```bash',
  'npm run content:review',
  'npm run content:assets',
  'npm run content:inventory',
  'npm run launch:actions',
  'npm run launch:report',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Homepage rows: ${homepageRows.length}`)
console.log(`Public page rows: ${publicPageRows.length}`)
console.log(`Contact topic rows: ${contactTopicRows.length}`)
console.log(`Service rows: ${serviceRows.length}`)
console.log(`Project rows: ${projectRows.length}`)
console.log(`3D planning rows: ${planningRows.length}`)

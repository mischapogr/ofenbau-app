import { existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  contactTopicReview,
  contactTopicRoutingReview,
  contactTopics,
} from '../src/data/contactTopics.js'
import { homepageContentReview, homepageReviewSections } from '../src/data/home.js'
import { publicPageContentReview, publicPageReviewSections } from '../src/data/pages.js'
import { serviceContentReview, services } from '../src/data/services.js'
import { projectReferenceReview, projects } from '../src/data/projects.js'
import { planningContentReview, planningExamples } from '../src/data/planning.js'

const root = process.cwd()
const failures = []
const warnings = []

function publicPath(path) {
  return join(root, 'public', path.replace(/^\//, ''))
}

function checkImage(area, id, image) {
  if (!image) {
    failures.push(`${area}:${id} has no image`)
    return
  }

  if (!image.startsWith('/images/')) {
    warnings.push(`${area}:${id} image does not use /images/: ${image}`)
  }

  if (!existsSync(publicPath(image))) {
    failures.push(`${area}:${id} image file is missing: ${image}`)
  }
}

for (const service of services) {
  checkImage('services', service.slug, service.image)
  if (!service.title || !service.short || !service.description || !service.intro) {
    warnings.push(`services:${service.slug} should have title, short, description and intro`)
  }
  if (!Array.isArray(service.bullets) || service.bullets.length === 0) {
    warnings.push(`services:${service.slug} should have service bullets`)
  }
  if (!Array.isArray(service.proofPoints) || service.proofPoints.length < 2) {
    warnings.push(`services:${service.slug} should have at least two proof points`)
  }
  if (!Array.isArray(service.faqs) || service.faqs.length < 2) {
    warnings.push(`services:${service.slug} should have at least two FAQ entries`)
  } else {
    for (const [index, item] of service.faqs.entries()) {
      if (!item.question || !item.answer) {
        warnings.push(`services:${service.slug}.faqs.${index} should have question and answer`)
      }
    }
  }
}

for (const section of homepageReviewSections) {
  if (section.image) checkImage('homepage', section.id, section.image)
  if (!section.review) {
    warnings.push(`homepage:${section.id} should include review metadata`)
  }
}

if (homepageContentReview.approvedForLaunch !== true) {
  warnings.push(`homepage content is not approved for launch: ${homepageContentReview.note}`)
}

const unapprovedHomepageSections = homepageReviewSections.filter(
  (section) => section.review?.copyApproved !== true || section.review?.mediaApproved !== true
)
if (unapprovedHomepageSections.length) {
  warnings.push(
    `homepage approvals are incomplete for ${unapprovedHomepageSections.length} sections: ${unapprovedHomepageSections
      .map((section) => section.id)
      .join(', ')}`
  )
}

if (publicPageContentReview.approvedForLaunch !== true) {
  warnings.push(`public page content is not approved for launch: ${publicPageContentReview.note}`)
}

const unapprovedPublicPageSections = publicPageReviewSections.filter(
  (section) => section.review?.copyApproved !== true
)
if (unapprovedPublicPageSections.length) {
  warnings.push(
    `public page approvals are incomplete for ${unapprovedPublicPageSections.length} sections: ${unapprovedPublicPageSections
      .map((section) => section.id)
      .join(', ')}`
  )
}

if (contactTopicReview.approvedForLaunch !== true) {
  warnings.push(`contact topics are not approved for launch: ${contactTopicReview.note}`)
}

if (contactTopicRoutingReview.approvedForLaunch !== true) {
  warnings.push(`contact topic routing is not approved for launch: ${contactTopicRoutingReview.note}`)
}

const unapprovedContactTopics = contactTopics.filter(
  (topic) =>
    topic.review?.operatorApproved !== true ||
    topic.review?.mailboxRoutingApproved !== true
)
if (unapprovedContactTopics.length) {
  warnings.push(
    `contact topic approvals are incomplete for ${unapprovedContactTopics.length} topics: ${unapprovedContactTopics
      .map((topic) => topic.value)
      .join(', ')}`
  )
}

if (serviceContentReview.approvedForLaunch !== true) {
  warnings.push(`service content is not approved for launch: ${serviceContentReview.note}`)
}

for (const project of projects) {
  checkImage('projects', project.id, project.image)
  if (!project.title || !project.description || !project.material) {
    warnings.push(`projects:${project.id} should have title, description and material`)
  }
  if (!Array.isArray(project.category) || project.category.length === 0) {
    failures.push(`projects:${project.id} has no category`)
  }
  if (!project.review) {
    warnings.push(`projects:${project.id} should include review metadata`)
  }
}

if (projectReferenceReview.approvedForLaunch !== true) {
  warnings.push(`project references are not approved for launch: ${projectReferenceReview.note}`)
}

const unapprovedProjects = projects.filter(
  (project) =>
    project.review?.realReference !== true ||
    project.review?.photoRightsApproved !== true ||
    project.review?.customerApproved !== true
)
if (unapprovedProjects.length) {
  warnings.push(
    `project reference approvals are incomplete for ${unapprovedProjects.length} projects: ${unapprovedProjects
      .map((project) => project.id)
      .join(', ')}`
  )
}

for (const example of planningExamples) {
  checkImage('planningExamples', example.id, example.image)
  if (!example.review) {
    warnings.push(`planningExamples:${example.id} should include review metadata`)
  }
  for (const view of example.views || []) {
    checkImage('planningExamples', `${example.id}.${view.label}`, view.image)
  }
  for (const [index, frame] of (example.frames || []).entries()) {
    checkImage('planningExamples', `${example.id}.frame-${index + 1}`, frame.image)
    if (typeof frame.angle !== 'number') {
      warnings.push(`planningExamples:${example.id} frame ${index + 1} is missing a numeric angle`)
    }
  }
  for (const [key, choices] of Object.entries(example.variants || {})) {
    for (const [choice, variant] of Object.entries(choices)) {
      checkImage('planningExamples', `${example.id}.variant-${key}-${choice}`, variant.image)
    }
  }
}

if (planningContentReview.approvedForLaunch !== true) {
  warnings.push(`3D planning examples are not approved for launch: ${planningContentReview.note}`)
}

const unapprovedPlanningExamples = planningExamples.filter(
  (example) =>
    example.review?.operatorApproved !== true || example.review?.mediaRightsApproved !== true
)
if (unapprovedPlanningExamples.length) {
  warnings.push(
    `3D planning example approvals are incomplete for ${unapprovedPlanningExamples.length} examples: ${unapprovedPlanningExamples
      .map((example) => example.id)
      .join(', ')}`
  )
}

console.log('Content asset report')

if (warnings.length) {
  console.log(`Warnings (${warnings.length})`)
  for (const warning of warnings) console.log(`  - ${warning}`)
  console.log('')
}

if (failures.length) {
  console.log(`Failures (${failures.length})`)
  for (const failure of failures) console.log(`  - ${failure}`)
  process.exitCode = 1
} else {
  console.log('All referenced content assets exist.')
}

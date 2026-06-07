import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { serviceContentReview, services } from '../src/data/services.js'
import { projectReferenceReview, projects } from '../src/data/projects.js'
import { planningExamples } from '../src/data/planning.js'

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
  for (const view of example.views || []) {
    checkImage('planningExamples', `${example.id}.${view.label}`, view.image)
  }
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

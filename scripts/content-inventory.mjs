import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { company, companyProfileReview, socialLinks, trustBadges } from '../src/data/company.js'
import { serviceContentReview, services } from '../src/data/services.js'
import { projectReferenceReview, projects, projectCategories } from '../src/data/projects.js'
import { processSteps } from '../src/data/process.js'
import { planningBenefits, planningExamples, planningServices } from '../src/data/planning.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'CONTENT_INVENTORY.json')

function placeholder(value) {
  return /muster|mustermann|000000|\.test|example\.com|localhost/i.test(String(value || ''))
}

function entry(area, key, value, notes = '') {
  return {
    area,
    key,
    value,
    placeholder: placeholder(value),
    notes,
  }
}

const inventory = {
  generatedAt: new Date().toISOString(),
  summary: {
    companyNapApprovedForLaunch: companyProfileReview.napApprovedForLaunch,
    googleBusinessProfileAligned: companyProfileReview.googleBusinessProfileAligned,
    googleMapsRouteVerified: companyProfileReview.mapRouteVerified,
    services: services.length,
    serviceFaqs: services.reduce((total, service) => total + (service.faqs?.length || 0), 0),
    serviceContentApprovedForLaunch: serviceContentReview.approvedForLaunch,
    projects: projects.length,
    projectCategories: projectCategories.length,
    processSteps: processSteps.length,
    planningBenefits: planningBenefits.length,
    planningServices: planningServices.length,
    planningExamples: planningExamples.length,
    projectReferencesApprovedForLaunch: projectReferenceReview.approvedForLaunch,
    projectReferencesWithIncompleteApproval: projects.filter(
      (project) =>
        project.review?.realReference !== true ||
        project.review?.photoRightsApproved !== true ||
        project.review?.customerApproved !== true
    ).length,
  },
  company: [
    entry('company', 'name', company.name, 'Header, footer, JSON-LD and copyright.'),
    entry('company', 'legalName', company.legalName, 'Impressum, Datenschutz and JSON-LD.'),
    entry('company', 'tagline', company.tagline),
    entry('company', 'claim', company.claim),
    entry('company', 'address.street', company.address.street),
    entry('company', 'address.zip', company.address.zip),
    entry('company', 'address.city', company.address.city),
    entry('company', 'address.region', company.address.region, 'Local SEO service area.'),
    entry('company', 'phone.label', company.phone.label),
    entry('company', 'phone.href', company.phone.href),
    entry('company', 'whatsapp.label', company.whatsapp.label),
    entry('company', 'whatsapp.href', company.whatsapp.href),
    entry('company', 'email.label', company.email.label),
    entry('company', 'email.href', company.email.href),
    entry('company', 'hours', company.hours),
  ],
  companyProfileReview: {
    napApprovedForLaunch: companyProfileReview.napApprovedForLaunch,
    googleBusinessProfileAligned: companyProfileReview.googleBusinessProfileAligned,
    mapRouteVerified: companyProfileReview.mapRouteVerified,
    note: companyProfileReview.note,
  },
  socialLinks: socialLinks.map((link) =>
    entry('socialLinks', link.name, link.href, 'Replace generic platform URLs with real profiles.')
  ),
  trustBadges: trustBadges.map((badge, index) => entry('trustBadges', String(index), badge)),
  serviceContentReview: {
    approvedForLaunch: serviceContentReview.approvedForLaunch,
    note: serviceContentReview.note,
  },
  projectReferenceReview: {
    approvedForLaunch: projectReferenceReview.approvedForLaunch,
    note: projectReferenceReview.note,
  },
  services: services.map((service) => ({
    slug: service.slug,
    title: service.title,
    fields: [
      entry('services', `${service.slug}.title`, service.title),
      entry('services', `${service.slug}.short`, service.short),
      entry('services', `${service.slug}.description`, service.description),
      entry('services', `${service.slug}.intro`, service.intro),
      entry('services', `${service.slug}.image`, service.image, 'Must point to an existing public image.'),
      ...service.bullets.map((bullet, index) =>
        entry('services', `${service.slug}.bullets.${index}`, bullet)
      ),
      ...(service.proofPoints || []).map((point, index) =>
        entry('services', `${service.slug}.proofPoints.${index}`, point)
      ),
      ...(service.faqs || []).flatMap((item, index) => [
        entry('services', `${service.slug}.faqs.${index}.question`, item.question),
        entry('services', `${service.slug}.faqs.${index}.answer`, item.answer),
      ]),
    ],
  })),
  projects: projects.map((project) => ({
    id: project.id,
    title: project.title,
    fields: [
      entry('projects', `${project.id}.title`, project.title),
      entry('projects', `${project.id}.description`, project.description),
      entry('projects', `${project.id}.material`, project.material),
      entry('projects', `${project.id}.image`, project.image, 'Must point to approved project media.'),
      entry('projects', `${project.id}.category`, project.category.join(', ')),
      entry('projects', `${project.id}.review.realReference`, project.review?.realReference),
      entry('projects', `${project.id}.review.photoRightsApproved`, project.review?.photoRightsApproved),
      entry('projects', `${project.id}.review.customerApproved`, project.review?.customerApproved),
      entry('projects', `${project.id}.review.note`, project.review?.note || ''),
    ],
  })),
}

writeFileSync(outPath, `${JSON.stringify(inventory, null, 2)}\n`)
console.log(`Wrote ${outPath}`)

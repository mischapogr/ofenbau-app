import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { company, companyProfileReview, socialLinks, trustBadges } from '../src/data/company.js'
import {
  contactTopicReview,
  contactTopicRoutingReview,
  contactTopics,
} from '../src/data/contactTopics.js'
import {
  homepageAssets,
  homepageContentReview,
  homepageHeroStats,
  homepageReviewSections,
} from '../src/data/home.js'
import { aboutValues, publicPageContentReview, publicPageReviewSections } from '../src/data/pages.js'
import { serviceContentReview, services } from '../src/data/services.js'
import { projectReferenceReview, projects, projectCategories } from '../src/data/projects.js'
import { processSteps } from '../src/data/process.js'
import {
  planningBenefits,
  planningContentReview,
  planningExamples,
  planningServices,
} from '../src/data/planning.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'CONTENT_INVENTORY.json')

function placeholder(value) {
  return /muster|mustermann|000000|\.test|example\.com|localhost|demo\/generated|replace demo|before launch/i.test(
    String(value || '')
  )
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
    homepageSections: homepageReviewSections.length,
    homepageContentApprovedForLaunch: homepageContentReview.approvedForLaunch,
    homepageSectionsWithIncompleteApproval: homepageReviewSections.filter(
      (section) => section.review?.copyApproved !== true || section.review?.mediaApproved !== true
    ).length,
    publicPageSections: publicPageReviewSections.length,
    publicPageContentApprovedForLaunch: publicPageContentReview.approvedForLaunch,
    publicPageSectionsWithIncompleteApproval: publicPageReviewSections.filter(
      (section) => section.review?.copyApproved !== true
    ).length,
    contactTopics: contactTopics.length,
    contactTopicsApprovedForLaunch: contactTopicReview.approvedForLaunch,
    contactTopicRoutingApprovedForLaunch: contactTopicRoutingReview.approvedForLaunch,
    contactTopicsWithIncompleteApproval: contactTopics.filter(
      (topic) =>
        topic.review?.operatorApproved !== true ||
        topic.review?.mailboxRoutingApproved !== true
    ).length,
    serviceFaqs: services.reduce((total, service) => total + (service.faqs?.length || 0), 0),
    serviceContentApprovedForLaunch: serviceContentReview.approvedForLaunch,
    projects: projects.length,
    projectCategories: projectCategories.length,
    processSteps: processSteps.length,
    planningBenefits: planningBenefits.length,
    planningServices: planningServices.length,
    planningExamples: planningExamples.length,
    planningExamplesApprovedForLaunch: planningContentReview.approvedForLaunch,
    planningExamplesWithIncompleteApproval: planningExamples.filter(
      (example) =>
        example.review?.operatorApproved !== true || example.review?.mediaRightsApproved !== true
    ).length,
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
    notePlaceholder: placeholder(companyProfileReview.note),
  },
  socialLinks: socialLinks.map((link) =>
    entry('socialLinks', link.name, link.href, 'Replace generic platform URLs with real profiles.')
  ),
  trustBadges: trustBadges.map((badge, index) => entry('trustBadges', String(index), badge)),
  homepageContentReview: {
    approvedForLaunch: homepageContentReview.approvedForLaunch,
    note: homepageContentReview.note,
    notePlaceholder: placeholder(homepageContentReview.note),
  },
  homepage: [
    ...homepageHeroStats.flatMap((stat, index) => [
      entry('homepage', `heroStats.${index}.value`, stat.value, 'Public proof claim shown in the hero.'),
      entry('homepage', `heroStats.${index}.label`, stat.label, 'Public proof claim shown in the hero.'),
    ]),
    entry('homepage', 'assets.hero.image', homepageAssets.hero.image, 'Must point to approved homepage media.'),
    entry('homepage', 'assets.hero.alt', homepageAssets.hero.alt),
    entry('homepage', 'assets.about.image', homepageAssets.about.image, 'Must point to approved homepage media.'),
    entry('homepage', 'assets.about.alt', homepageAssets.about.alt),
  ],
  homepageReviewSections: homepageReviewSections.map((section) => ({
    id: section.id,
    label: section.label,
    source: section.source,
    fields: [
      entry('homepageReviewSections', `${section.id}.label`, section.label),
      entry('homepageReviewSections', `${section.id}.source`, section.source),
      entry('homepageReviewSections', `${section.id}.image`, section.image, 'Must point to approved homepage media when present.'),
      entry('homepageReviewSections', `${section.id}.review.copyApproved`, section.review?.copyApproved),
      entry('homepageReviewSections', `${section.id}.review.mediaApproved`, section.review?.mediaApproved),
      entry('homepageReviewSections', `${section.id}.review.note`, section.review?.note || ''),
    ],
  })),
  publicPageContentReview: {
    approvedForLaunch: publicPageContentReview.approvedForLaunch,
    note: publicPageContentReview.note,
    notePlaceholder: placeholder(publicPageContentReview.note),
  },
  aboutValues: aboutValues.flatMap((value, index) => [
    entry('aboutValues', `${index}.title`, value.title),
    entry('aboutValues', `${index}.text`, value.text),
  ]),
  publicPageReviewSections: publicPageReviewSections.map((section) => ({
    id: section.id,
    page: section.page,
    label: section.label,
    source: section.source,
    fields: [
      entry('publicPageReviewSections', `${section.id}.page`, section.page),
      entry('publicPageReviewSections', `${section.id}.label`, section.label),
      entry('publicPageReviewSections', `${section.id}.source`, section.source),
      entry('publicPageReviewSections', `${section.id}.review.copyApproved`, section.review?.copyApproved),
      entry('publicPageReviewSections', `${section.id}.review.note`, section.review?.note || ''),
    ],
  })),
  contactTopicReview: {
    approvedForLaunch: contactTopicReview.approvedForLaunch,
    note: contactTopicReview.note,
    notePlaceholder: placeholder(contactTopicReview.note),
  },
  contactTopicRoutingReview: {
    approvedForLaunch: contactTopicRoutingReview.approvedForLaunch,
    note: contactTopicRoutingReview.note,
    notePlaceholder: placeholder(contactTopicRoutingReview.note),
  },
  contactTopics: contactTopics.map((topic) => ({
    value: topic.value,
    label: topic.label,
    fields: [
      entry('contactTopics', `${topic.value}.label`, topic.label, 'Displayed in the contact form topic selector.'),
      entry('contactTopics', `${topic.value}.subject`, topic.subject, 'Used as the email subject suffix.'),
      entry('contactTopics', `${topic.value}.review.operatorApproved`, topic.review?.operatorApproved),
      entry('contactTopics', `${topic.value}.review.mailboxRoutingApproved`, topic.review?.mailboxRoutingApproved),
      entry('contactTopics', `${topic.value}.review.note`, topic.review?.note || ''),
    ],
  })),
  serviceContentReview: {
    approvedForLaunch: serviceContentReview.approvedForLaunch,
    note: serviceContentReview.note,
    notePlaceholder: placeholder(serviceContentReview.note),
  },
  projectReferenceReview: {
    approvedForLaunch: projectReferenceReview.approvedForLaunch,
    note: projectReferenceReview.note,
    notePlaceholder: placeholder(projectReferenceReview.note),
  },
  planningContentReview: {
    approvedForLaunch: planningContentReview.approvedForLaunch,
    note: planningContentReview.note,
    notePlaceholder: placeholder(planningContentReview.note),
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
  planningExamples: planningExamples.map((example) => ({
    id: example.id,
    title: example.title,
    fields: [
      entry('planningExamples', `${example.id}.title`, example.title),
      entry('planningExamples', `${example.id}.category`, example.category),
      entry('planningExamples', `${example.id}.description`, example.description),
      entry('planningExamples', `${example.id}.image`, example.image, 'Must point to approved planning media.'),
      entry('planningExamples', `${example.id}.review.operatorApproved`, example.review?.operatorApproved),
      entry('planningExamples', `${example.id}.review.mediaRightsApproved`, example.review?.mediaRightsApproved),
      entry('planningExamples', `${example.id}.review.note`, example.review?.note || ''),
    ],
  })),
}

writeFileSync(outPath, `${JSON.stringify(inventory, null, 2)}\n`)
console.log(`Wrote ${outPath}`)

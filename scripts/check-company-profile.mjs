import {
  company,
  companyProfileReview,
  isGenericTrustBadge,
  socialLinks,
  trustBadges,
} from '../src/data/company.js'

const checks = []
const warnings = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function warn(condition, message) {
  if (condition) warnings.push(message)
}

function hasText(value) {
  return String(value || '').trim().length > 0
}

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function phoneComparable(value) {
  return digits(String(value || '').replace(/\(0\)/g, ''))
}

check(hasText(company.name), 'company name is present')
check(hasText(company.legalName), 'legal company name is present')
check(hasText(company.tagline), 'company tagline is present')
check(hasText(company.claim), 'company claim is present')
check(hasText(company.address.street), 'street address is present')
check(/^\d{5}$/.test(company.address.zip), 'German ZIP is five digits')
check(hasText(company.address.city), 'city is present')
check(hasText(company.address.region), 'service region is present')
check(hasText(company.hours), 'opening hours are present')

check(hasText(company.phone.label), 'phone label is present')
check(/^tel:\+?\d+$/i.test(company.phone.href), 'phone href uses tel: with digits')
check(
  phoneComparable(company.phone.href).endsWith(phoneComparable(company.phone.label)),
  'phone href matches phone label digits'
)

check(hasText(company.whatsapp.label), 'WhatsApp label is present')
check(/^https:\/\/wa\.me\/\d+$/i.test(company.whatsapp.href), 'WhatsApp href uses wa.me with digits')
check(
  phoneComparable(company.whatsapp.href).endsWith(phoneComparable(company.whatsapp.label)),
  'WhatsApp href matches WhatsApp label digits'
)
check(hasText(company.whatsapp.availability), 'WhatsApp availability is present')

check(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email.label), 'email label is a valid address')
check(company.email.href === `mailto:${company.email.label}`, 'email href matches email label')

check(Array.isArray(socialLinks) && socialLinks.length >= 3, 'social links include at least three profiles')
for (const link of socialLinks) {
  check(hasText(link.name), `${link.name || 'social link'} has a name`)
  check(/^https:\/\//.test(link.href), `${link.name} uses https URL`)
  check(hasText(link.icon), `${link.name} has an icon`)
  warn(/^https:\/\/(instagram|facebook|pinterest)\.com\/?$/i.test(link.href), `${link.name} still uses a generic profile URL`)
}

check(Array.isArray(trustBadges) && trustBadges.length >= 3, 'trust badges include at least three items')
for (const badge of trustBadges) {
  check(hasText(badge), `trust badge "${badge}" is non-empty`)
  warn(isGenericTrustBadge(badge), `trust badge "${badge}" still looks like a placeholder claim`)
}

for (const [key, value] of Object.entries(companyProfileReview)) {
  if (key === 'note') continue
  check(typeof value === 'boolean', `companyProfileReview.${key} is boolean`)
}
check(hasText(companyProfileReview.note), 'company profile review note is present')
warn(companyProfileReview.napApprovedForLaunch !== true, 'NAP/opening-hours approval is still pending')
warn(companyProfileReview.googleBusinessProfileAligned !== true, 'Google Business Profile alignment is still pending')
warn(companyProfileReview.mapRouteVerified !== true, 'Google Maps route verification is still pending')

const failed = checks.filter((item) => !item.ok)

console.log('Company profile report')
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}
if (warnings.length) {
  console.log('')
  console.log(`Warnings (${warnings.length})`)
  for (const warning of warnings) console.log(`  - ${warning}`)
}

if (failed.length) {
  process.exitCode = 1
}

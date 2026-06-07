import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { legalProfile } from '../src/data/legal.js'

const root = process.cwd()
const privacyContent = readFileSync(join(root, 'src/components/PrivacyContent.vue'), 'utf8')
const cookieConsent = readFileSync(join(root, 'src/components/CookieConsent.vue'), 'utf8')
const googleMapEmbed = readFileSync(join(root, 'src/components/GoogleMapEmbed.vue'), 'utf8')
const analytics = readFileSync(join(root, 'src/composables/useAnalytics.js'), 'utf8')

const checks = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function mentions(content, ...patterns) {
  return patterns.every((pattern) => pattern.test(content))
}

check(mentions(privacyContent, /Kontaktformular/i, /Kontaktdaten/i), 'privacy text discloses contact form data handling')
check(mentions(privacyContent, /Google Analytics/i, /Analyse/i), 'privacy text discloses analytics category')
check(mentions(privacyContent, /nicht geladen/i), 'privacy text states analytics is not loaded without consent')
check(mentions(privacyContent, /Google Maps/i, /Komfort/i), 'privacy text discloses Google Maps comfort consent')
check(mentions(privacyContent, /Karte laden/i), 'privacy text mentions explicit map loading action')
check(mentions(privacyContent, /Auskunft/i, /Berichtigung/i, /Löschung/i, /Einschränkung/i), 'privacy text lists core data subject rights')
check(
  mentions(privacyContent, /Auftragsverarbeitung/i, /Speicherdauer/i, /Rechtsgrundlagen/i),
  'privacy text keeps processor, retention and legal-basis review visible'
)
check(
  legalProfile.privacyNeedsReview === true
    ? privacyContent.includes('privacyReviewNote')
    : !/müssen mit den finalen Betreiberangaben geprüft/i.test(privacyContent),
  'privacy legal-review state is reflected in PrivacyContent.vue'
)

check(mentions(cookieConsent, /Analyse/i, /Komfort/i), 'cookie banner exposes Analyse and Komfort categories')
check(/comfort:\s*true/.test(googleMapEmbed), 'GoogleMapEmbed persists comfort consent only when map is loaded')
check(/consent\.value\?\.comfort/.test(googleMapEmbed), 'GoogleMapEmbed gates iframe on comfort consent')
check(/consent\?\.analytics/.test(analytics), 'analytics loader gates GA4 on analytics consent')

const failed = checks.filter((item) => !item.ok)

console.log('Privacy disclosure report')
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

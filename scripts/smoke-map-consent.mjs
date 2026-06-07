import { chromium } from '@playwright/test'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:maps -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const checks = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

async function mapState(page) {
  return page.evaluate(() => ({
    consent: JSON.parse(localStorage.getItem('ofenbau-cookie-consent') || 'null'),
    iframeSources: Array.from(document.querySelectorAll('iframe'))
      .map((iframe) => iframe.src)
      .filter((src) => src.includes('google.com/maps')),
    routeLinks: Array.from(document.querySelectorAll('a[href*="google.com/maps"]')).map(
      (link) => link.href
    ),
  }))
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
await context.addInitScript(() => localStorage.removeItem('ofenbau-cookie-consent'))
const page = await context.newPage()

try {
  await page.goto(`${siteUrl}/kontakt`, { waitUntil: 'networkidle' })
  const beforeConsent = await mapState(page)

  check(!beforeConsent.consent, 'cookie consent is reset before map smoke')
  check(beforeConsent.iframeSources.length === 0, 'Google Maps iframe is absent before comfort consent')
  check(beforeConsent.routeLinks.length > 0, 'Google Maps route link remains available before comfort consent')

  await page.getByRole('button', { name: 'Karte laden' }).click()
  await page.waitForSelector('iframe[title="Google Maps Standortkarte"]', { state: 'attached' })

  const afterMapButton = await mapState(page)
  check(afterMapButton.consent?.comfort === true, 'Karte laden persists comfort consent')
  check(afterMapButton.consent?.analytics !== true, 'Karte laden does not imply analytics consent')
  check(afterMapButton.iframeSources.length === 1, 'Google Maps iframe appears after comfort consent')
  check(
    afterMapButton.iframeSources[0]?.includes('output=embed'),
    'Google Maps iframe uses embed output'
  )

  await page.evaluate(() => localStorage.removeItem('ofenbau-cookie-consent'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Alle akzeptieren' }).click()
  await page.waitForSelector('iframe[title="Google Maps Standortkarte"]', { state: 'attached' })

  const afterAcceptAll = await mapState(page)
  check(afterAcceptAll.consent?.comfort === true, 'Alle akzeptieren persists comfort consent')
  check(afterAcceptAll.consent?.analytics === true, 'Alle akzeptieren also persists analytics consent')
  check(afterAcceptAll.iframeSources.length === 1, 'Google Maps iframe appears after accepting all consent')
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Map consent smoke test failed' })
} finally {
  await browser.close()
}

const failed = checks.filter((item) => !item.ok)

console.log(`Google Maps consent smoke test: ${siteUrl}`)
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

import { chromium } from '@playwright/test'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL
const expectedMeasurementId = process.env.ANALYTICS_SMOKE_GA_ID || ''

if (!rawUrl) {
  console.error('Usage: npm run deploy:analytics -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const checks = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

async function analyticsState(page) {
  return page.evaluate(() => ({
    hasGtag: typeof window.gtag === 'function',
    gtagScripts: Array.from(document.scripts)
      .map((script) => script.src)
      .filter((src) => src.includes('googletagmanager.com/gtag/js')),
    dataLayer: Array.isArray(window.dataLayer)
      ? window.dataLayer.map((entry) => Array.from(entry).map(String))
      : [],
  }))
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
await context.addInitScript(() => localStorage.removeItem('ofenbau-cookie-consent'))
const page = await context.newPage()

try {
  await page.goto(`${siteUrl}/`, { waitUntil: 'networkidle' })
  const beforeConsent = await analyticsState(page)

  check(!beforeConsent.hasGtag, 'window.gtag is absent before analytics consent')
  check(beforeConsent.gtagScripts.length === 0, 'GA4 script is absent before analytics consent')

  await page.getByRole('button', { name: 'Alle akzeptieren' }).click()
  await page.waitForTimeout(750)

  const afterConsent = await analyticsState(page)
  if (expectedMeasurementId) {
    check(afterConsent.hasGtag, 'window.gtag exists after analytics consent')
    check(
      afterConsent.gtagScripts.some((src) => src.includes(expectedMeasurementId)),
      `GA4 script uses expected measurement ID ${expectedMeasurementId}`
    )
    check(
      afterConsent.dataLayer.some(
        (entry) => entry[0] === 'config' && entry[1] === expectedMeasurementId
      ),
      `GA4 config event was queued for ${expectedMeasurementId}`
    )
  } else {
    check(!afterConsent.hasGtag, 'window.gtag stays absent when no GA4 ID is configured')
    check(afterConsent.gtagScripts.length === 0, 'GA4 script stays absent when no GA4 ID is configured')
  }
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Analytics consent smoke test failed' })
} finally {
  await browser.close()
}

const failed = checks.filter((item) => !item.ok)

console.log(`Analytics consent smoke test: ${siteUrl}`)
if (expectedMeasurementId) {
  console.log(`Expected GA4 measurement ID: ${expectedMeasurementId}`)
} else {
  console.log('Expected GA4 measurement ID: (none configured)')
}
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

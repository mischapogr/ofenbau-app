import { chromium } from '@playwright/test'
import { services } from '../src/data/services.js'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:seo -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const isLocalTarget = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(siteUrl)
const checks = []
const routes = [
  '/',
  '/leistungen',
  ...services.map((service) => `/leistungen/${service.slug}`),
  '/projekte',
  '/ueber-uns',
  '/kontakt',
  '/impressum',
  '/datenschutz',
]

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function expectedCanonical(path) {
  return `${siteUrl}${path}`
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

try {
  for (const route of routes) {
    const response = await page.goto(`${siteUrl}${route}`, { waitUntil: 'networkidle' })
    check(response?.ok(), `${route} browser response is OK (${response?.status() || 'no response'})`)

    const title = await page.title()
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    const headHtml = await page.locator('head').innerHTML()

    check(title.includes('Ofenbau'), `${route} title contains Ofenbau`)
    check(Boolean(description?.trim()), `${route} has meta description`)
    check(canonical === expectedCanonical(route), `${route} canonical is ${expectedCanonical(route)}`)
    check(
      isLocalTarget || !headHtml.includes('localhost'),
      isLocalTarget ? `${route} localhost head URLs allowed for local target` : `${route} head does not contain localhost`
    )
  }

  await page.goto(`${siteUrl}/`, { waitUntil: 'networkidle' })
  const localBusiness = await page.locator('#local-business-jsonld').textContent()
  check(Boolean(localBusiness), 'LocalBusiness JSON-LD exists')
  if (localBusiness) {
    const parsed = JSON.parse(localBusiness)
    check(parsed.url === `${siteUrl}/`, `LocalBusiness JSON-LD url is ${siteUrl}/`)
    check(parsed['@id'] === `${siteUrl}/#business`, 'LocalBusiness JSON-LD @id matches site URL')
    check(
      isLocalTarget || !localBusiness.includes('localhost'),
      isLocalTarget
        ? 'LocalBusiness JSON-LD localhost URLs allowed for local target'
        : 'LocalBusiness JSON-LD does not contain localhost'
    )
  }
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Browser SEO smoke test failed' })
} finally {
  await browser.close()
}

const failed = checks.filter((item) => !item.ok)

console.log(`Browser SEO smoke test: ${siteUrl}`)
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

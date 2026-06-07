import { chromium } from '@playwright/test'
import { company } from '../src/data/company.js'
import { services } from '../src/data/services.js'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:seo -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const siteName = process.env.VITE_APP_TITLE || company.name
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

async function imageResponds(url) {
  try {
    const response = await fetch(url, { redirect: 'follow' })
    return response.ok
  } catch {
    return false
  }
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
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content')
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content')
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')
    const headHtml = await page.locator('head').innerHTML()

    check(title.includes(siteName), `${route} title contains configured site name`)
    check(Boolean(description?.trim()), `${route} has meta description`)
    check(canonical === expectedCanonical(route), `${route} canonical is ${expectedCanonical(route)}`)
    check(ogTitle === title, `${route} og:title matches document title`)
    check(ogDescription === description, `${route} og:description matches meta description`)
    check(ogSiteName === siteName, `${route} og:site_name matches configured site name`)
    check(ogType === 'website', `${route} og:type is website`)
    check(ogUrl === expectedCanonical(route), `${route} og:url is canonical`)
    check(ogImage?.startsWith(`${siteUrl}/`), `${route} og:image is absolute and same-origin`)
    check(twitterTitle === title, `${route} twitter:title matches document title`)
    check(twitterDescription === description, `${route} twitter:description matches meta description`)
    check(twitterCard === 'summary_large_image', `${route} twitter:card uses summary_large_image`)
    check(twitterImage === ogImage, `${route} twitter:image matches og:image`)
    if (ogImage) {
      check(await imageResponds(ogImage), `${route} social preview image responds`)
    }
    check(
      isLocalTarget || !headHtml.includes('localhost'),
      isLocalTarget ? `${route} localhost head URLs allowed for local target` : `${route} head does not contain localhost`
    )

    const service = services.find((item) => route === `/leistungen/${item.slug}`)
    if (service?.faqs?.length) {
      const faqJsonLd = await page.locator('#service-faq-jsonld').textContent()
      check(Boolean(faqJsonLd), `${route} FAQPage JSON-LD exists`)
      if (faqJsonLd) {
        const parsed = JSON.parse(faqJsonLd)
        check(parsed['@type'] === 'FAQPage', `${route} FAQPage JSON-LD has FAQPage type`)
        check(
          parsed.mainEntity?.length === service.faqs.length,
          `${route} FAQPage JSON-LD contains ${service.faqs.length} questions`
        )
        check(parsed.url === expectedCanonical(route), `${route} FAQPage JSON-LD url is canonical`)
      }
    }
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

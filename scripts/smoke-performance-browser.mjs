import { chromium } from '@playwright/test'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:perf -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const routes = ['/', '/leistungen', '/projekte', '/ueber-uns', '/kontakt']
const budgets = {
  loadMs: Number(process.env.PERF_SMOKE_MAX_LOAD_MS || 6000),
  domContentMs: Number(process.env.PERF_SMOKE_MAX_DOM_CONTENT_MS || 3500),
  transferKb: Number(process.env.PERF_SMOKE_MAX_TRANSFER_KB || 2500),
  resourceCount: Number(process.env.PERF_SMOKE_MAX_RESOURCE_COUNT || 120),
}
const checks = []
const consoleErrors = []
const pageErrors = []
const failedRequests = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function routeUrl(route) {
  return `${siteUrl}${route}`
}

async function getRouteMetrics(page) {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    const resources = performance.getEntriesByType('resource')
    const transferBytes =
      (nav?.transferSize || 0) +
      resources.reduce((total, resource) => total + (resource.transferSize || 0), 0)

    return {
      domContentMs: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
      loadMs: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0,
      resourceCount: resources.length,
      transferKb: Math.round(transferBytes / 1024),
      brokenImages: Array.from(document.images)
        .filter((image) => image.currentSrc && image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc),
    }
  })
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text())
})
page.on('pageerror', (error) => {
  pageErrors.push(error.message)
})
page.on('requestfailed', (request) => {
  failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`.trim())
})

try {
  for (const route of routes) {
    consoleErrors.length = 0
    pageErrors.length = 0
    failedRequests.length = 0

    const response = await page.goto(routeUrl(route), { waitUntil: 'networkidle' })
    check(response?.ok(), `${route} response is OK (${response?.status() || 'no response'})`)

    const metrics = await getRouteMetrics(page)

    check(
      metrics.domContentMs <= budgets.domContentMs,
      `${route} DOMContentLoaded ${metrics.domContentMs}ms <= ${budgets.domContentMs}ms`
    )
    check(metrics.loadMs <= budgets.loadMs, `${route} load ${metrics.loadMs}ms <= ${budgets.loadMs}ms`)
    check(
      metrics.transferKb <= budgets.transferKb,
      `${route} transfer ${metrics.transferKb}KB <= ${budgets.transferKb}KB`
    )
    check(
      metrics.resourceCount <= budgets.resourceCount,
      `${route} resources ${metrics.resourceCount} <= ${budgets.resourceCount}`
    )
    check(metrics.brokenImages.length === 0, `${route} has no broken rendered images`)
    check(failedRequests.length === 0, `${route} has no failed resource requests`)
    check(consoleErrors.length === 0, `${route} has no browser console errors`)
    check(pageErrors.length === 0, `${route} has no uncaught page errors`)

    for (const image of metrics.brokenImages) {
      console.log(`BROKEN_IMAGE ${route} ${image}`)
    }
    for (const request of failedRequests) {
      console.log(`FAILED_REQUEST ${route} ${request}`)
    }
    for (const error of consoleErrors) {
      console.log(`CONSOLE_ERROR ${route} ${error}`)
    }
    for (const error of pageErrors) {
      console.log(`PAGE_ERROR ${route} ${error}`)
    }
  }
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Browser performance smoke test failed' })
} finally {
  await browser.close()
}

const failed = checks.filter((item) => !item.ok)

console.log(`Browser performance smoke test: ${siteUrl}`)
console.log(
  `Budgets: DOMContentLoaded ${budgets.domContentMs}ms, load ${budgets.loadMs}ms, transfer ${budgets.transferKb}KB, resources ${budgets.resourceCount}`
)
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

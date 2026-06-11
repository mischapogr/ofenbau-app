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
  firstContentfulPaintMs: Number(process.env.PERF_SMOKE_MAX_FCP_MS || 2500),
  largestContentfulPaintMs: Number(process.env.PERF_SMOKE_MAX_LCP_MS || 4000),
  totalBlockingTimeMs: Number(process.env.PERF_SMOKE_MAX_TBT_MS || 300),
  cumulativeLayoutShift: Number(process.env.PERF_SMOKE_MAX_CLS || 0.1),
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
  await page.waitForTimeout(500)
  return page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0]
    const resources = performance.getEntriesByType('resource')
    const paint = performance.getEntriesByType('paint')
    const transferBytes =
      (nav?.transferSize || 0) +
      resources
        .filter((r) => !r.name.endsWith('.webm') && !r.name.endsWith('.mp4') && r.initiatorType !== 'video')
        .reduce((total, resource) => total + (resource.transferSize || 0), 0)
    const perfMetrics = window.__perfSmokeMetrics || {}

    return {
      domContentMs: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
      loadMs: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0,
      firstContentfulPaintMs: Math.round(
        paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0
      ),
      largestContentfulPaintMs: Math.round(perfMetrics.lcp || 0),
      cumulativeLayoutShift: Number((perfMetrics.cls || 0).toFixed(3)),
      layoutShiftSources: perfMetrics.clsSources || [],
      totalBlockingTimeMs: Math.round(perfMetrics.tbt || 0),
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
await page.addInitScript(() => {
  window.__perfSmokeMetrics = {
    lcp: 0,
    cls: 0,
    clsSources: [],
    tbt: 0,
  }

  function describeNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return 'unknown'
    const id = node.id ? `#${node.id}` : ''
    const className =
      typeof node.className === 'string'
        ? node.className
            .trim()
            .split(/\s+/)
            .slice(0, 4)
            .map((item) => `.${item}`)
            .join('')
        : ''
    const label =
      node.getAttribute('aria-label') ||
      node.getAttribute('alt') ||
      node.textContent?.trim()?.replace(/\s+/g, ' ')?.slice(0, 80) ||
      ''
    return `${node.tagName.toLowerCase()}${id}${className}${label ? ` "${label}"` : ''}`
  }

  try {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const last = entries[entries.length - 1]
      if (last) window.__perfSmokeMetrics.lcp = last.startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  } catch {
    // Browser does not support this observer type.
  }

  try {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__perfSmokeMetrics.cls += entry.value
          if (entry.value >= 0.001) {
            for (const source of entry.sources || []) {
              window.__perfSmokeMetrics.clsSources.push({
                value: Number(entry.value.toFixed(3)),
                node: describeNode(source.node),
              })
            }
          }
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {
    // Browser does not support this observer type.
  }

  try {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        window.__perfSmokeMetrics.tbt += Math.max(0, entry.duration - 50)
      }
    }).observe({ type: 'longtask', buffered: true })
  } catch {
    // Browser does not support this observer type.
  }
})

page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text())
})
page.on('pageerror', (error) => {
  pageErrors.push(error.message)
})
page.on('requestfailed', (request) => {
  const errorText = request.failure()?.errorText || ''
  if (errorText.includes('net::ERR_ABORTED')) return
  failedRequests.push(`${request.method()} ${request.url()} ${errorText}`.trim())
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
      metrics.firstContentfulPaintMs > 0 &&
        metrics.firstContentfulPaintMs <= budgets.firstContentfulPaintMs,
      `${route} FCP ${metrics.firstContentfulPaintMs}ms <= ${budgets.firstContentfulPaintMs}ms`
    )
    check(
      metrics.largestContentfulPaintMs > 0 &&
        metrics.largestContentfulPaintMs <= budgets.largestContentfulPaintMs,
      `${route} LCP ${metrics.largestContentfulPaintMs}ms <= ${budgets.largestContentfulPaintMs}ms`
    )
    check(
      metrics.totalBlockingTimeMs <= budgets.totalBlockingTimeMs,
      `${route} TBT ${metrics.totalBlockingTimeMs}ms <= ${budgets.totalBlockingTimeMs}ms`
    )
    check(
      metrics.cumulativeLayoutShift <= budgets.cumulativeLayoutShift,
      `${route} CLS ${metrics.cumulativeLayoutShift} <= ${budgets.cumulativeLayoutShift}`
    )
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
    for (const source of metrics.layoutShiftSources.slice(0, 8)) {
      console.log(`LAYOUT_SHIFT ${route} ${source.value} ${source.node}`)
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
  `Budgets: DOMContentLoaded ${budgets.domContentMs}ms, load ${budgets.loadMs}ms, FCP ${budgets.firstContentfulPaintMs}ms, LCP ${budgets.largestContentfulPaintMs}ms, TBT ${budgets.totalBlockingTimeMs}ms, CLS ${budgets.cumulativeLayoutShift}, transfer ${budgets.transferKb}KB, resources ${budgets.resourceCount}`
)
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

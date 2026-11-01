import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { services } from '../src/data/services.js'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:visual -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'generated', 'VISUAL_SMOKE.md')

const maxOverflowPx = Number(process.env.VISUAL_SMOKE_MAX_OVERFLOW_PX || 1)
const writeScreenshots = process.env.VISUAL_SMOKE_SCREENSHOTS === '1'
const screenshotDir = join(root, 'docs', 'generated', 'visual-smoke')

const viewports = [
  { key: 'desktop', width: 1440, height: 1000, isMobile: false },
  { key: 'tablet', width: 768, height: 1024, isMobile: true },
  { key: 'mobile', width: 390, height: 844, isMobile: true },
]

const routes = [
  { path: '/', label: 'Home' },
  { path: '/leistungen', label: 'Services' },
  { path: `/leistungen/${services[0]?.slug || 'kachelofen-kaminbau'}`, label: 'Service detail' },
  { path: '/projekte', label: 'Projects' },
  { path: '/ueber-uns', label: 'About' },
  { path: '/kontakt', label: 'Contact' },
]

const failures = []
const rows = []

function record(condition, message) {
  if (!condition) failures.push(message)
}

function screenshotName(viewport, route) {
  const safePath = route.path === '/' ? 'home' : route.path.replace(/^\/+/, '').replace(/[^a-z0-9-]+/gi, '-')
  return `${viewport.key}-${safePath}.png`
}

console.log(`Visual smoke test: ${siteUrl}`)
console.log(`Viewports: ${viewports.map((viewport) => `${viewport.key} ${viewport.width}x${viewport.height}`).join(', ')}`)
console.log(`Routes: ${routes.map((route) => route.path).join(', ')}`)

if (writeScreenshots) mkdirSync(screenshotDir, { recursive: true })
mkdirSync(dirname(outPath), { recursive: true })

const browser = await chromium.launch()

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
    })
    const page = await context.newPage()

    for (const route of routes) {
      const url = `${siteUrl}${route.path}`
      const response = await page.goto(url, { waitUntil: 'networkidle' })
      const status = response?.status() || 0
      record(status >= 200 && status < 400, `${viewport.key} ${route.path} returned HTTP ${status}`)

      const metrics = await page.evaluate(() => {
        const documentElement = document.documentElement
        const body = document.body
        const main = document.querySelector('main')
        const h1 = document.querySelector('h1')
        const viewportWidth = window.innerWidth
        const scrollWidth = Math.max(documentElement.scrollWidth, body?.scrollWidth || 0)
        const overflow = Math.max(0, scrollWidth - viewportWidth)
        const mainBox = main?.getBoundingClientRect()
        const h1Box = h1?.getBoundingClientRect()

        return {
          title: document.title,
          viewportWidth,
          scrollWidth,
          overflow,
          bodyHeight: Math.ceil(body?.scrollHeight || documentElement.scrollHeight),
          mainVisible: Boolean(
            mainBox && mainBox.width > 0 && mainBox.height > 0 && mainBox.bottom > 0 && mainBox.top < window.innerHeight
          ),
          h1Text: h1?.textContent?.trim() || '',
          h1Visible: Boolean(
            h1Box && h1Box.width > 0 && h1Box.height > 0 && h1Box.bottom > 0 && h1Box.top < window.innerHeight
          ),
        }
      })

      record(metrics.overflow <= maxOverflowPx, `${viewport.key} ${route.path} overflows horizontally by ${metrics.overflow}px`)
      record(metrics.mainVisible, `${viewport.key} ${route.path} has no visible main content in first viewport`)
      record(metrics.h1Visible, `${viewport.key} ${route.path} has no visible H1 in first viewport`)
      record(metrics.title.length > 0, `${viewport.key} ${route.path} has an empty document title`)

      let screenshotPath = ''
      if (writeScreenshots) {
        screenshotPath = join('docs', 'audits', 'visual-smoke', screenshotName(viewport, route))
        await page.screenshot({ path: join(root, screenshotPath), fullPage: true })
      }

      rows.push({
        viewport: viewport.key,
        size: `${viewport.width}x${viewport.height}`,
        route: route.path,
        label: route.label,
        status,
        title: metrics.title,
        h1: metrics.h1Text,
        overflow: metrics.overflow,
        height: metrics.bodyHeight,
        screenshotPath,
      })

      console.log(
        `${failures.length ? 'CHECK' : 'PASS'} ${viewport.key} ${route.path} status=${status} overflow=${metrics.overflow}px h1="${metrics.h1Text}"`
      )
    }

    await context.close()
  }
} finally {
  await browser.close()
}

const lines = [
  '# Visual Smoke Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  `Target: ${siteUrl}`,
  `Horizontal overflow budget: ${maxOverflowPx}px`,
  `Screenshots: ${writeScreenshots ? 'written' : 'not written; set VISUAL_SMOKE_SCREENSHOTS=1 to capture them'}`,
  '',
  failures.length ? `Status: Failed (${failures.length})` : 'Status: Passed',
  '',
  '| Viewport | Size | Route | Status | Overflow | Page height | H1 | Screenshot |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
]

for (const row of rows) {
  lines.push(
    `| ${row.viewport} | ${row.size} | \`${row.route}\` | ${row.status} | ${row.overflow}px | ${row.height}px | ${row.h1.replace(/\|/g, '\\|')} | ${row.screenshotPath ? `\`${row.screenshotPath}\`` : '-'} |`
  )
}

if (failures.length) {
  lines.push('', '## Failures', '')
  for (const failure of failures) lines.push(`- ${failure}`)
}

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)

if (failures.length) {
  console.error(`Visual smoke failed with ${failures.length} issue(s).`)
  process.exit(1)
}

console.log('Visual smoke passed.')

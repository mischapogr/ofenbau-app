/**
 * Post-build prerenderer: captures the fully rendered HTML of every route so
 * AI crawlers without JavaScript execution (GPTBot, ClaudeBot, PerplexityBot,
 * CCBot, ...) see real content instead of an empty SPA shell.
 *
 * Runs only for production builds — demo builds are password-gated and must
 * not be indexed. Output mapping follows Cloudflare Pages conventions:
 * flat `dist/<route>.html` serves at `/<route>` without a redirect, matching
 * the no-trailing-slash canonicals; `/` overwrites `dist/index.html`.
 * The captured pages still load the Vue bundle, which re-renders identical
 * content on mount (non-hydrating, acceptable for a content site).
 */
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'
import {
  buildRoutes,
  distDir,
  isDemoMode,
  loadModeEnv,
  parseModeArg,
  PLACEHOLDER_URL_PATTERN,
  resolveSiteUrl,
  resolveTier,
  tierFeatures,
} from './lib/site-data.mjs'

const mode = parseModeArg()
const env = loadModeEnv(mode)
const tier = resolveTier(env)

if (isDemoMode(mode, env) || env.VITE_DEMO_PROTECTION_ENABLED === 'true') {
  console.log(`Prerender: skipped (mode "${mode}" is demo/protected — nothing to index).`)
  process.exit(0)
}

if (!tierFeatures(tier).geoAiSuite) {
  console.log(`Prerender: skipped (tier "${tier}" ships a standard SPA — AI prerender is premium-only).`)
  process.exit(0)
}

if (!existsSync(join(distDir, 'index.html'))) {
  console.error('Prerender: dist/index.html not found — run "vite build" first.')
  process.exit(1)
}

const siteUrl = resolveSiteUrl(env)
if (PLACEHOLDER_URL_PATTERN.test(siteUrl)) {
  console.warn(
    `Prerender: WARNING — site URL "${siteUrl}" looks like a placeholder. ` +
      'Canonicals and JSON-LD in the prerendered HTML will bake this URL in. ' +
      'Set VITE_APP_URL to the real domain before a production deploy.'
  )
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
}

// Minimal static server with SPA fallback — `vite preview` is unsuitable here
// (it proxies /api to a compose-network host and applies demo allowedHosts).
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(distDir, safePath)

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403)
    res.end()
    return
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = extname(safePath) ? null : join(distDir, 'index.html')
  }
  if (!filePath || !existsSync(filePath)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
  res.end(readFileSync(filePath))
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
const baseUrl = `http://127.0.0.1:${port}`

let browser
try {
  browser = await chromium.launch({ headless: true })
} catch (error) {
  console.error(
    `Prerender: failed to launch Chromium (${error.message}). Run "npx playwright install chromium" and retry.`
  )
  server.close()
  process.exit(1)
}

// Capture '/' last: it overwrites dist/index.html, which is also the SPA
// fallback every other route is served from — keep that shell pristine until
// all other routes are captured.
const routes = [...buildRoutes(tier)].sort((a, b) => (a === '/') - (b === '/'))
const failures = []

function outputPathFor(route) {
  if (route === '/') return join(distDir, 'index.html')
  return join(distDir, `${route.replace(/^\//, '')}.html`)
}

try {
  const page = await browser.newPage()
  // Forces v-reveal to show below-fold content immediately instead of waiting
  // for IntersectionObserver-driven animations.
  await page.emulateMedia({ reducedMotion: 'reduce' })

  for (const route of routes) {
    const expectedCanonical = `${siteUrl}${route}`
    try {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 30000 })
      // The canonical link is the last thing useSeo's watchEffect writes, so it
      // doubles as the "SEO head is complete" signal.
      await page.waitForFunction(
        (canonical) => {
          const link = document.querySelector('link[rel="canonical"]')
          const main = document.querySelector('#app main')
          return link?.href === canonical && (main?.innerText?.trim().length || 0) > 100
        },
        expectedCanonical,
        { timeout: 15000 }
      )
      await page.waitForTimeout(250)

      const html = await page.content()
      const outPath = outputPathFor(route)
      mkdirSync(dirname(outPath), { recursive: true })
      writeFileSync(outPath, html)
      console.log(`Prerender: ${route} -> ${outPath.replace(distDir, 'dist')} (${(html.length / 1024).toFixed(0)} kB)`)
    } catch (error) {
      failures.push({ route, message: error.message })
      console.error(`Prerender: FAILED ${route}: ${error.message}`)
    }
  }
} finally {
  await browser.close()
  server.close()
}

if (failures.length) {
  console.error(`Prerender: ${failures.length}/${routes.length} routes failed.`)
  process.exit(1)
}
console.log(`Prerender: captured ${routes.length} routes into dist/.`)

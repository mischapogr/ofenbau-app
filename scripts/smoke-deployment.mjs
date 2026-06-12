import { services } from '../src/data/services.js'
import { getActiveRegions } from '../src/data/regions.js'
import { knowledgeArticles } from '../src/data/knowledgeBase.js'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:smoke -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const isLocalTarget = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(siteUrl)
const skipApiHealth = process.env.SMOKE_SKIP_API_HEALTH === '1'
const checks = []

async function fetchText(path) {
  const url = `${siteUrl}${path}`
  const response = await fetch(url, { redirect: 'follow' })
  const body = await response.text()
  return { url, status: response.status, body, headers: response.headers }
}

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function containsUrlOrLocalPath(body, path) {
  return isLocalTarget ? body.includes(path) : body.includes(`${siteUrl}${path}`)
}

function expectHeader(response, name, pattern, label) {
  const value = response.headers.get(name) || ''
  check(pattern.test(value), `${label} header ${name} is ${value || '(missing)'}`)
}

function expectSecurityHeaders(response, label) {
  expectHeader(response, 'x-frame-options', /^SAMEORIGIN$/i, label)
  expectHeader(response, 'x-content-type-options', /^nosniff$/i, label)
  expectHeader(response, 'referrer-policy', /^strict-origin-when-cross-origin$/i, label)
  expectHeader(
    response,
    'permissions-policy',
    /camera=\(\).*microphone=\(\).*geolocation=\(\)/i,
    label
  )
}

async function checkProductionHeaders(home) {
  if (isLocalTarget) {
    check(true, 'runtime security header checks skipped for local non-nginx target')
    return
  }

  expectSecurityHeaders(home, 'Home')

  const assetMatch = home.body.match(/(?:src|href)="([^"]*\/assets\/[^"]+)"/)
  check(assetMatch, 'Home references a hashed build asset')
  if (!assetMatch) return

  const assetUrl = assetMatch[1].startsWith('http') ? assetMatch[1] : `${siteUrl}${assetMatch[1]}`
  const assetResponse = await fetch(assetUrl, { redirect: 'follow' })
  check(assetResponse.status === 200, `hashed asset responds with 200 (${assetResponse.status})`)
  expectHeader(assetResponse, 'cache-control', /public/i, 'Hashed asset')
  expectHeader(assetResponse, 'cache-control', /immutable/i, 'Hashed asset')
  expectSecurityHeaders({ headers: assetResponse.headers }, 'Hashed asset')
}

try {
  const home = await fetchText('/')
  check(home.status === 200, `Home responds with 200 (${home.status})`)
  check(home.body.includes('<div id="app"></div>'), 'Home contains Vue mount point')
  check(home.body.includes('Ofenbau'), 'Home HTML contains site title content')
  await checkProductionHeaders(home)

  const publicRoutes = [
    ...getActiveRegions().map((region) => `/region/${region.slug}`),
    '/leistungen',
    ...services.map((service) => `/leistungen/${service.slug}`),
    '/projekte',
    '/ratgeber',
    ...knowledgeArticles.map((article) => `/ratgeber/${article.slug}`),
    '/kontakt',
    '/impressum',
    '/datenschutz',
  ]

  for (const route of publicRoutes) {
    const page = await fetchText(route)
    check(page.status === 200, `${route} responds with 200 (${page.status})`)
    check(page.body.includes('<div id="app"></div>'), `${route} returns SPA HTML`)
  }

  const robots = await fetchText('/robots.txt')
  check(robots.status === 200, `robots.txt responds with 200 (${robots.status})`)
  check(containsUrlOrLocalPath(robots.body, '/sitemap.xml'), 'robots.txt points to sitemap')

  const sitemap = await fetchText('/sitemap.xml')
  check(sitemap.status === 200, `sitemap.xml responds with 200 (${sitemap.status})`)
  check(containsUrlOrLocalPath(sitemap.body, '/kontakt'), 'sitemap.xml contains contact route')
  for (const region of getActiveRegions()) {
    const path = `/region/${region.slug}`
    check(containsUrlOrLocalPath(sitemap.body, path), `sitemap.xml contains ${path}`)
  }
  for (const service of services) {
    const path = `/leistungen/${service.slug}`
    check(containsUrlOrLocalPath(sitemap.body, path), `sitemap.xml contains ${path}`)
  }
  for (const article of knowledgeArticles) {
    const path = `/ratgeber/${article.slug}`
    check(containsUrlOrLocalPath(sitemap.body, path), `sitemap.xml contains ${path}`)
  }
  check(
    isLocalTarget || !sitemap.body.includes('localhost'),
    'sitemap.xml does not contain localhost for production target'
  )

  if (!skipApiHealth) {
    const apiHealth = await fetchText('/api/healthz')
    check(apiHealth.status === 200, `contact API health responds with 200 (${apiHealth.status})`)
    check(apiHealth.body.includes('"ok":true'), 'contact API health returns ok=true')
  }
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Smoke test failed' })
}

const failed = checks.filter((item) => !item.ok)

console.log(`Deployment smoke test: ${siteUrl}`)
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

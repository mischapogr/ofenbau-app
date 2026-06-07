import { services } from '../src/data/services.js'

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
  return { url, status: response.status, body }
}

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

try {
  const home = await fetchText('/')
  check(home.status === 200, `Home responds with 200 (${home.status})`)
  check(home.body.includes('<div id="app"></div>'), 'Home contains Vue mount point')
  check(home.body.includes('Ofenbau'), 'Home HTML contains site title content')

  const publicRoutes = [
    '/leistungen',
    ...services.map((service) => `/leistungen/${service.slug}`),
    '/projekte',
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
  check(robots.body.includes(`${siteUrl}/sitemap.xml`), 'robots.txt points to production sitemap')

  const sitemap = await fetchText('/sitemap.xml')
  check(sitemap.status === 200, `sitemap.xml responds with 200 (${sitemap.status})`)
  check(sitemap.body.includes(`${siteUrl}/kontakt`), 'sitemap.xml contains contact route')
  for (const service of services) {
    const path = `/leistungen/${service.slug}`
    check(sitemap.body.includes(`${siteUrl}${path}`), `sitemap.xml contains ${path}`)
  }
  check(isLocalTarget || !sitemap.body.includes('localhost'), 'sitemap.xml does not contain localhost for production target')

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

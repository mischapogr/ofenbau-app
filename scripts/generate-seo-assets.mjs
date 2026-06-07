import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { services } from '../src/data/services.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const publicDir = join(root, 'public')
const modeArgIndex = process.argv.indexOf('--mode')
const mode =
  modeArgIndex >= 0 && process.argv[modeArgIndex + 1] ? process.argv[modeArgIndex + 1] : 'production'
const env = { ...loadEnv(mode, root, ''), ...process.env }

const rawSiteUrl = env.VITE_APP_URL || 'http://localhost:5173'
const siteUrl = rawSiteUrl.replace(/\/+$/, '')
const isDemo = mode === 'demo' || env.VITE_APP_ENV === 'demo'
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
const now = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`

const robots = isDemo
  ? `User-agent: *
Disallow: /
`
  : `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
writeFileSync(join(publicDir, 'robots.txt'), robots)

console.log(`Generated ${isDemo ? 'demo noindex' : 'SEO'} assets for ${siteUrl}`)

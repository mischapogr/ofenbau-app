import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { services } from '../src/data/services.js'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const publicDir = join(root, 'public')

const rawSiteUrl = process.env.VITE_APP_URL || 'http://localhost:5173'
const siteUrl = rawSiteUrl.replace(/\/+$/, '')
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

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
writeFileSync(join(publicDir, 'robots.txt'), robots)

console.log(`Generated SEO assets for ${siteUrl}`)

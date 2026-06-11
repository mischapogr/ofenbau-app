/**
 * Shared site data for build/SEO/GEO scripts: route list, site URL and
 * mode resolution. Single source of truth so generate-seo-assets,
 * prerender, smoke tests and audits never drift apart.
 */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { services } from '../../src/data/services.js'
import { serviceRegions } from '../../src/data/regions.js'
import { knowledgeArticles } from '../../src/data/knowledgeBase.js'
import { company } from '../../src/data/company.js'
import { projects } from '../../src/data/projects.js'

export const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
export const publicDir = join(projectRoot, 'public')
export const distDir = join(projectRoot, 'dist')

export { services, serviceRegions, knowledgeArticles, company, projects }

export const PLACEHOLDER_URL_PATTERN = /example\.de|localhost|127\.0\.0\.1/i

export function buildRoutes() {
  return [
    '/',
    ...serviceRegions.map((region) => `/region/${region.slug}`),
    '/leistungen',
    ...services.map((service) => `/leistungen/${service.slug}`),
    '/projekte',
    '/ratgeber',
    ...knowledgeArticles.map((article) => `/ratgeber/${article.slug}`),
    '/ueber-uns',
    '/kontakt',
    '/impressum',
    '/datenschutz',
  ]
}

export function parseModeArg(argv = process.argv, fallback = 'production') {
  const modeArgIndex = argv.indexOf('--mode')
  return modeArgIndex >= 0 && argv[modeArgIndex + 1] ? argv[modeArgIndex + 1] : fallback
}

export function loadModeEnv(mode) {
  return { ...loadEnv(mode, projectRoot, ''), ...process.env }
}

export function resolveSiteUrl(env) {
  const rawSiteUrl = env.VITE_APP_URL || 'http://localhost:5173'
  return rawSiteUrl.replace(/\/+$/, '')
}

export function isDemoMode(mode, env) {
  return mode === 'demo' || env.VITE_APP_ENV === 'demo'
}

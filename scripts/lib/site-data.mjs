/**
 * Shared site data for build/SEO/GEO scripts: route list, site URL and
 * mode resolution. Single source of truth so generate-seo-assets,
 * prerender, smoke tests and audits never drift apart.
 */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { services, getActiveServices } from '../../src/data/services.js'
import { serviceRegions, getActiveRegions } from '../../src/data/regions.js'
import { knowledgeArticles } from '../../src/data/knowledgeBase.js'
import { company } from '../../src/data/company.js'
import { projects } from '../../src/data/projects.js'

export const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
export const publicDir = join(projectRoot, 'public')
export const distDir = join(projectRoot, 'dist')

export { services, serviceRegions, getActiveRegions, knowledgeArticles, company, projects }

export const PLACEHOLDER_URL_PATTERN = /example\.de|localhost|127\.0\.0\.1/i

export function buildRoutes(tier = 'premium') {
  return [
    '/',
    ...getActiveRegions(tier).map((region) => `/region/${region.slug}`),
    '/leistungen',
    ...getActiveServices(tier).map((service) => `/leistungen/${service.slug}`),
    '/projekte',
    '/ratgeber',
    ...knowledgeArticles.map((article) => `/ratgeber/${article.slug}`),
    '/ueber-uns',
    '/kontakt',
    '/impressum',
    '/datenschutz',
  ]
}

/**
 * Resolve the product tier on the Node/build side. Mirrors src/config/tier.js
 * (the Vue side) — keep the two in sync.
 */
export function resolveTier(env = {}) {
  return String(env.VITE_TIER || 'premium').toLowerCase() === 'basis' ? 'basis' : 'premium'
}

/** Feature map per tier. Mirrors `features` in src/config/tier.js. */
export function tierFeatures(tier = 'premium') {
  const premium = tier !== 'basis'
  return {
    calculators: premium,
    planning3d: premium,
    smartContact: premium,
    regions: premium,
    geoAiSuite: premium,
  }
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

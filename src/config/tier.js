/**
 * Product tier resolution for the browser/Vue side.
 *
 * The tier ("basis" | "premium") is a packaging axis that is *orthogonal* to the
 * deploy mode (production | demo | development). The full app == "premium", so
 * premium is the default and stays backward-compatible; "basis" is the reduced
 * build that hides the lead-generation + AI-visibility features.
 *
 * `VITE_TIER` is injected by vite.config.js via `define`, so it is statically
 * replaced at build time regardless of how the env var reaches Vite.
 *
 * NOTE: Build/Node scripts must NOT import this module — they read the tier via
 * `resolveTier(env)` in scripts/lib/site-data.mjs. Keep the feature map here in
 * sync with `tierFeatures()` there.
 */
const RAW = String(import.meta.env.VITE_TIER || 'premium').toLowerCase()

export const tier = RAW === 'basis' ? 'basis' : 'premium'
export const isPremium = tier === 'premium'
export const isBasis = tier === 'basis'

/** Single source of truth: which features each tier ships. */
export const features = {
  calculators: isPremium, // Heizlast, Budget-Estimator, BImSchV-Checker
  planning3d: isPremium, // Planning3DExplorer + /leistungen/3d-planung
  smartContact: isPremium, // geolocation + service-area validation
  regions: isPremium, // /region/:slug multi-region local SEO
  geoAiSuite: isPremium, // prerendering, llms.txt, AI-crawler allowlist, IndexNow
}

export function hasFeature(key) {
  return Boolean(features[key])
}

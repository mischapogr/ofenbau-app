/**
 * Notifies IndexNow (Bing & partners — the index behind Perplexity/Copilot)
 * about all site URLs. Run manually after a production deploy:
 *   INDEXNOW_KEY=... npm run deploy:indexnow
 * The key must also be served at <site>/indexnow-key.txt (generate-seo-assets
 * writes it to public/ when INDEXNOW_KEY is set at build time).
 */
import {
  buildRoutes,
  loadModeEnv,
  parseModeArg,
  PLACEHOLDER_URL_PATTERN,
  resolveSiteUrl,
} from './lib/site-data.mjs'

const mode = parseModeArg(process.argv, 'production')
const env = loadModeEnv(mode)
const siteUrl = resolveSiteUrl(env)
const key = env.INDEXNOW_KEY

if (!key) {
  console.log('IndexNow: INDEXNOW_KEY is not set — skipping ping (nothing to do).')
  process.exit(0)
}

if (PLACEHOLDER_URL_PATTERN.test(siteUrl)) {
  console.log(`IndexNow: site URL "${siteUrl}" is a placeholder/local URL — skipping ping.`)
  process.exit(0)
}

const host = new URL(siteUrl).host
const urlList = buildRoutes().map((route) => `${siteUrl}${route}`)

const payload = {
  host,
  key,
  keyLocation: `${siteUrl}/indexnow-key.txt`,
  urlList,
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
})

if (response.ok) {
  console.log(`IndexNow: submitted ${urlList.length} URLs for ${host} (HTTP ${response.status}).`)
} else {
  const body = await response.text().catch(() => '')
  console.error(`IndexNow: submission failed (HTTP ${response.status}). ${body}`.trim())
  process.exit(1)
}

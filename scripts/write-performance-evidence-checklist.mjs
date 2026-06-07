import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const outPath = join(root, 'docs', 'PERFORMANCE_EVIDENCE_CHECKLIST.md')

const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')

function pathExists(path) {
  return existsSync(join(root, path))
}

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function escapeTable(value) {
  return String(value ?? '')
    .replace(/\n+/g, ' ')
    .replace(/\|/g, '\\|')
}

function hasEnvPlaceholder(value) {
  return /muster|mustermann|mailpit|000000|\.test|example\.com|example\.de|localhost|x{4,}|token/i.test(
    String(value || '')
  )
}

function status(ready) {
  return ready ? 'Done' : 'Open'
}

function readGeneratedLine(path) {
  if (!pathExists(path)) return 'missing'
  const match = read(path).match(/^Generated:\s*(.+)$/m)
  return match?.[1] || 'not stamped'
}

const siteUrlReady = /^https:\/\/[^/]+/i.test(siteUrl) && !hasEnvPlaceholder(siteUrl)

const smokeBudgets = [
  ['DOMContentLoaded', process.env.PERF_SMOKE_MAX_DOM_CONTENT_MS || '3500ms'],
  ['Load', process.env.PERF_SMOKE_MAX_LOAD_MS || '6000ms'],
  ['FCP', process.env.PERF_SMOKE_MAX_FCP_MS || '2500ms'],
  ['LCP', process.env.PERF_SMOKE_MAX_LCP_MS || '4000ms'],
  ['TBT', process.env.PERF_SMOKE_MAX_TBT_MS || '300ms'],
  ['CLS', process.env.PERF_SMOKE_MAX_CLS || '0.1'],
  ['Transfer', `${process.env.PERF_SMOKE_MAX_TRANSFER_KB || '2500'}KB`],
  ['Resources', process.env.PERF_SMOKE_MAX_RESOURCE_COUNT || '120'],
]

const localRows = [
  ['Static asset budgets', '`npm run perf:budget`', 'JS/CSS hard budgets pass and large images are reviewed.'],
  ['Browser performance smoke', '`npm run deploy:perf -- http://localhost:5174` inside preflight', 'Core public routes pass timing, resource, image and console/error checks.'],
  ['Visual smoke artifact', 'docs/audits/VISUAL_SMOKE.md', `${pathExists('docs/audits/VISUAL_SMOKE.md') ? `Present (${readGeneratedLine('docs/audits/VISUAL_SMOKE.md')})` : 'Missing'}.`],
  ['Production URL readiness', `VITE_APP_URL=${siteUrl}`, status(siteUrlReady)],
]

const productionRows = [
  [
    'Production browser performance smoke',
    '`npm run deploy:perf -- https://domain.example`',
    'Routes pass DOM/load, FCP, LCP, TBT, CLS, transfer, resource, broken-image and browser-error checks.',
    'Attach command output to launch evidence.',
  ],
  [
    'Aggregate deploy smoke',
    '`ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example`',
    'Performance smoke passes as part of the full route/API/header, SEO, analytics/Maps consent, contact-link, accessibility and visual suite.',
    'Attach command output to launch evidence.',
  ],
  [
    'Lighthouse/PageSpeed mobile',
    'Manual Lighthouse or PageSpeed run on production URL',
    'Mobile performance, accessibility, best-practices and SEO scores are recorded with any issues triaged.',
    'Record report URL/file, date, device mode and follow-up owner.',
  ],
  [
    'Lighthouse/PageSpeed desktop',
    'Manual Lighthouse or PageSpeed run on production URL',
    'Desktop scores are recorded with any render-blocking, image, cache or JS issues triaged.',
    'Record report URL/file, date, device mode and follow-up owner.',
  ],
  [
    'Field evidence',
    'Search Console Core Web Vitals / CrUX when available',
    'Field data is checked after the domain has enough traffic, or noted as unavailable at launch.',
    'Record status in launch ticket.',
  ],
]

const lines = [
  '# Performance Evidence Checklist',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Use this worksheet for production performance handoff. Local browser smoke',
  'checks catch regressions before launch; Lighthouse/PageSpeed and field data',
  'must still be captured on the final HTTPS domain.',
  '',
  '## Local Performance Evidence',
  '',
  '| Check | Command or artifact | Current evidence |',
  '| --- | --- | --- |',
]

for (const row of localRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} |`)
}

lines.push(
  '',
  '## Browser Smoke Budgets',
  '',
  '| Metric | Budget |',
  '| --- | --- |'
)

for (const row of smokeBudgets) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} |`)
}

lines.push(
  '',
  '## Production Performance Evidence',
  '',
  '| Step | Command or action | Expected result | Evidence to record |',
  '| --- | --- | --- | --- |'
)

for (const row of productionRows) {
  lines.push(`| ${escapeTable(row[0])} | ${escapeTable(row[1])} | ${escapeTable(row[2])} | ${escapeTable(row[3])} |`)
}

lines.push(
  '',
  '## Useful Commands',
  '',
  '```bash',
  'npm run launch:performance',
  'npm run perf:budget',
  'npm run deploy:perf -- https://domain.example',
  'ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example',
  'npm run preflight',
  '```'
)

writeFileSync(outPath, `${lines.join('\n')}\n`)
console.log(`Wrote ${outPath}`)
console.log(`Production URL ready: ${status(siteUrlReady)}`)
console.log(`Visual smoke artifact: ${pathExists('docs/audits/VISUAL_SMOKE.md') ? 'Present' : 'Missing'}`)

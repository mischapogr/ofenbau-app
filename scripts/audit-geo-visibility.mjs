import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { company, knowledgeArticles, services } from './lib/site-data.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const mode = 'production'
const env = { ...loadEnv(mode, root, ''), ...process.env }

console.log('==================================================')
console.log('      GEO (Generative Engine Optimization) Audit  ')
console.log('      & AI Search Agent Indexing Readiness        ')
console.log('==================================================\n')

const checks = []
function audit(condition, title, details, score = 10) {
  checks.push({ ok: !!condition, title, details, score })
}

// 1. Robots.txt check for AI bots
const robotsPath = join(root, 'public/robots.txt')
if (existsSync(robotsPath)) {
  const content = readFileSync(robotsPath, 'utf-8')
  const blocksAi =
    /user-agent:\s*(\*|gptbot|perplexitybot|google-extended|claudebot|anthropic|cohere)\s*\n+disallow:\s*\//i.test(
      content
    )
  audit(
    !blocksAi,
    'Robots.txt AI Agent Crawling Allowed',
    blocksAi
      ? 'WARNING: robots.txt contains rules blocking AI crawlers (GPTBot, PerplexityBot, etc.).'
      : 'PASS: robots.txt does not block AI search engine agents.',
    20
  )
} else {
  audit(
    false,
    'Robots.txt Exists',
    'FAIL: robots.txt is missing. Running "npm run build" first is required.',
    10
  )
}

// 2. Production env settings (demo protection disabled)
const protectionEnabled = env.VITE_DEMO_PROTECTION_ENABLED === 'true'
audit(
  !protectionEnabled,
  'Public Content Accessible (No Demo Password Gate)',
  protectionEnabled
    ? 'FAIL: VITE_DEMO_PROTECTION_ENABLED is active. AI/LLM crawlers will hit the password gate and cannot index the page.'
    : 'PASS: Content is public and directly accessible to search engine crawlers.',
  20
)

// 3. Scan main build template (index.html) and Vue files for SEO/Schema tags
const templatePath = join(root, 'index.html')
const appVuePath = join(root, 'src/App.vue')
const useSeoPath = join(root, 'src/composables/useSeo.js')

if (existsSync(templatePath)) {
  const html = readFileSync(templatePath, 'utf-8')
  const hasLang = /<html[^>]*lang="[a-z]{2}"/i.test(html)
  audit(
    hasLang,
    'HTML Language Tag Defined',
    hasLang
      ? 'PASS: Lang attribute helps LLMs recognize language context.'
      : 'FAIL: <html lang="..."> is missing.',
    5
  )
}

const appVueExists = existsSync(appVuePath)
let hasLocalBusiness = false
if (appVueExists) {
  const appVueContent = readFileSync(appVuePath, 'utf-8')
  hasLocalBusiness =
    appVueContent.includes('local-business-jsonld') || appVueContent.includes('LocalBusiness')
}
audit(
  hasLocalBusiness,
  'LocalBusiness Schema (JSON-LD) Embedded',
  hasLocalBusiness
    ? 'PASS: Structured schema enables Google/LLMs to parse company profile directly.'
    : 'FAIL: No LocalBusiness JSON-LD implementation found in App.vue.',
  15
)

const useSeoExists = existsSync(useSeoPath)
let hasCanonical = false
if (useSeoExists) {
  const useSeoContent = readFileSync(useSeoPath, 'utf-8')
  hasCanonical = useSeoContent.includes('canonical') || useSeoContent.includes('upsertCanonical')
}
audit(
  hasCanonical,
  'Canonical URL Tag Present',
  hasCanonical
    ? 'PASS: Canonical tag injection is wired into the SEO composable.'
    : 'FAIL: Canonical tag injection missing.',
  10
)

// 4. Scan data layer for AI rich sources (FAQs and Proof Points)
const servicesPath = join(root, 'src/data/services.js')
if (existsSync(servicesPath)) {
  const content = readFileSync(servicesPath, 'utf-8')
  const hasFaqs = content.includes('faqs:')
  const hasProof = content.includes('proofPoints:')
  audit(
    hasFaqs,
    'Structured FAQs available',
    hasFaqs
      ? 'PASS: Detailed FAQs exist (helps LLMs answer Q&A queries directly).'
      : 'WARNING: No FAQs found. FAQs are high-value sources for AI engine quotes.',
    10
  )
  audit(
    hasProof,
    'Structured Proof Points',
    hasProof
      ? 'PASS: Concrete trust proofs and certifications are available.'
      : 'WARNING: Missing structured proof points.',
    10
  )
}

// 5. Scan project descriptions
const projectsPath = join(root, 'src/data/projects.js')
if (existsSync(projectsPath)) {
  const content = readFileSync(projectsPath, 'utf-8')
  // Count projects
  const matches = content.match(/id:\s*['"](?:project-\d+|[^'"]+)['"]/g) || []
  audit(
    matches.length >= 6,
    'Rich Portfolio (Project Cases)',
    `PASS: Found ${matches.length} projects. A rich portfolio increases topic authority for AI engines.`,
    10
  )
}

// 6. robots.txt explicitly welcomes AI crawlers
if (existsSync(robotsPath)) {
  const content = readFileSync(robotsPath, 'utf-8')
  const explicitAllows = ['GPTBot', 'ClaudeBot', 'PerplexityBot'].filter((bot) =>
    new RegExp(`user-agent:\\s*${bot}\\s*\\n+allow:\\s*/`, 'i').test(content)
  )
  audit(
    explicitAllows.length === 3,
    'Robots.txt Explicit AI-Bot Allow Groups',
    explicitAllows.length === 3
      ? 'PASS: GPTBot, ClaudeBot and PerplexityBot have explicit Allow rules.'
      : `WARNING: Missing explicit Allow groups for ${['GPTBot', 'ClaudeBot', 'PerplexityBot'].filter((b) => !explicitAllows.includes(b)).join(', ')}. Run "npm run build" (production) to regenerate.`,
    10
  )
}

// 7. llms.txt + llms-full.txt (machine-readable site summary for LLM agents)
for (const file of ['llms.txt', 'llms-full.txt']) {
  const filePath = join(root, 'public', file)
  let ok = false
  let details = `FAIL: public/${file} missing. Run "npm run build" (production) to generate it.`
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf-8')
    const mentionsCompany = content.includes(company.name)
    const mentionsService = services.some((s) => content.includes(s.slug))
    ok = mentionsCompany && mentionsService
    details = ok
      ? `PASS: public/${file} exists and references company + services.`
      : `WARNING: public/${file} exists but lacks company name or service links.`
  }
  audit(ok, `LLM Summary File (${file})`, details, 10)
}

// 8. Markdown mirrors for every knowledge-base article
const missingMd = knowledgeArticles.filter(
  (article) => !existsSync(join(root, 'public/ratgeber', `${article.slug}.md`))
)
audit(
  missingMd.length === 0,
  'Markdown Mirrors for Ratgeber Articles',
  missingMd.length === 0
    ? `PASS: All ${knowledgeArticles.length} articles have a .md mirror under public/ratgeber/.`
    : `FAIL: Missing .md mirrors for: ${missingMd.map((a) => a.slug).join(', ')}.`,
  10
)

// 9. Knowledge depth (LLMs cite domains with broad topical coverage)
audit(
  knowledgeArticles.length >= 10,
  'Knowledge Base Depth (10+ Articles)',
  knowledgeArticles.length >= 10
    ? `PASS: ${knowledgeArticles.length} Ratgeber articles establish topical authority.`
    : `WARNING: Only ${knowledgeArticles.length} articles. 10+ in-depth articles strongly improve AI citation odds.`,
  10
)

// 10. Prerendered HTML in dist/ (AI crawlers mostly do not execute JS)
const distDir = join(root, 'dist')
if (existsSync(join(distDir, 'index.html'))) {
  const sampleChecks = [
    {
      file: 'index.html',
      mustContain: [company.name],
      label: 'homepage',
    },
    {
      file: `leistungen/${services[0].slug}.html`,
      mustContain: [services[0].title, '"@type":"FAQPage"', '"@type":"Service"'],
      label: 'service detail',
    },
    {
      file: `ratgeber/${knowledgeArticles[0].slug}.html`,
      mustContain: [knowledgeArticles[0].title, '"@type":"Article"'],
      label: 'knowledge article',
    },
  ]
  const failures = []
  for (const sample of sampleChecks) {
    const samplePath = join(distDir, sample.file)
    if (!existsSync(samplePath)) {
      failures.push(`${sample.label}: dist/${sample.file} missing`)
      continue
    }
    const html = readFileSync(samplePath, 'utf-8')
    for (const needle of sample.mustContain) {
      if (!html.includes(needle)) failures.push(`${sample.label}: missing "${needle}"`)
    }
  }
  audit(
    failures.length === 0,
    'Prerendered HTML for Non-JS AI Crawlers',
    failures.length === 0
      ? 'PASS: dist/ contains prerendered HTML with full content and JSON-LD (readable without JavaScript).'
      : `FAIL: ${failures.join('; ')}. Run "npm run build" to prerender.`,
    20
  )
} else {
  audit(
    false,
    'Prerendered HTML for Non-JS AI Crawlers',
    'SKIPPED (scored as fail): dist/ not found — run "npm run build" first. Most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not execute JavaScript; without prerendered HTML they see an empty SPA shell.',
    20
  )
}

// 11. IndexNow key (informational — feeds Bing/Perplexity/Copilot index)
audit(
  Boolean(env.INDEXNOW_KEY),
  'IndexNow Key Configured (informational)',
  env.INDEXNOW_KEY
    ? 'PASS: INDEXNOW_KEY is set — run "npm run deploy:indexnow" after each production deploy.'
    : 'INFO: INDEXNOW_KEY not set. Optional, but IndexNow feeds the Bing index used by Perplexity and Copilot.',
  5
)

// Calculate score
let totalScore = 0
let earnedScore = 0
for (const check of checks) {
  totalScore += check.score
  if (check.ok) earnedScore += check.score
}
const percent = Math.round((earnedScore / totalScore) * 100)

console.log('--- Results ---')
for (const check of checks) {
  console.log(`${check.ok ? '✅ PASS' : '❌ FAIL'} [${check.score} pts] - ${check.title}`)
  console.log(`   Info: ${check.details}\n`)
}

console.log('==================================================')
console.log(` GEO / AI Search Readiness Index: ${percent}% (${earnedScore}/${totalScore} pts)`)
console.log('==================================================')

if (percent < 80) {
  console.log(
    '\nRecommendation: Resolve FAIL and WARNING marks above to maximize AI engine citations.'
  )
} else {
  console.log(
    '\nOutstanding! The website is highly optimized for AI-crawling, semantic reference, and search-agent citations.'
  )
}

if (checks.some((c) => !c.ok && c.score >= 20)) {
  process.exitCode = 1
}

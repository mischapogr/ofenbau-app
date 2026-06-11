import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  buildRoutes,
  company,
  isDemoMode,
  knowledgeArticles,
  loadModeEnv,
  parseModeArg,
  projects,
  publicDir,
  resolveSiteUrl,
  resolveTier,
  serviceRegions,
  services,
  tierFeatures,
} from './lib/site-data.mjs'

const mode = parseModeArg()
const env = loadModeEnv(mode)
const siteUrl = resolveSiteUrl(env)
const isDemo = isDemoMode(mode, env)
const tier = resolveTier(env)
const features = tierFeatures(tier)
// The GEO/AI discoverability suite (llms.txt, AI-crawler allowlist, markdown
// mirrors, IndexNow) is a premium feature. Basis ships plain SEO only.
const geoAi = !isDemo && features.geoAiSuite
const routes = buildRoutes(tier)
const now = new Date().toISOString().slice(0, 10)

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'CCBot',
  'Amazonbot',
  'Applebot-Extended',
  'meta-externalagent',
]

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
  : geoAi
    ? `User-agent: *
Allow: /

# AI / LLM crawlers are explicitly welcome (GEO)
${AI_CRAWLERS.map((bot) => `User-agent: ${bot}\nAllow: /`).join('\n\n')}

# Machine-readable site summary for LLM agents: ${siteUrl}/llms.txt
Sitemap: ${siteUrl}/sitemap.xml
`
    : `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

/** Strips the common leading indentation that article bodies carry from their template literals. */
function deindent(text) {
  const lines = String(text).replace(/\r\n/g, '\n').split('\n')
  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)[0].length)
  const minIndent = indents.length ? Math.min(...indents) : 0
  return lines.map((line) => line.slice(minIndent)).join('\n')
}

function buildLlmsTxt() {
  return `# ${company.name}

> ${company.claim} ${company.legalName} — Meisterbetrieb für Kachelöfen, Kamine, Schornsteinbau und Fliesenarbeiten in ${company.address.region}.

Kontakt: ${company.phone.label}, ${company.email.label}, ${company.hours}. Standort: ${company.address.street}, ${company.address.zip} ${company.address.city}.

## Leistungen

${services.map((s) => `- [${s.title}](${siteUrl}/leistungen/${s.slug}): ${s.description}`).join('\n')}

## Regionen

${serviceRegions.map((r) => `- [${r.title}](${siteUrl}/region/${r.slug}): ${r.description}`).join('\n')}

## Ratgeber

${knowledgeArticles
  .map(
    (a) =>
      `- [${a.title}](${siteUrl}/ratgeber/${a.slug}): ${a.summary} (Markdown: ${siteUrl}/ratgeber/${a.slug}.md)`
  )
  .join('\n')}

## Weitere Seiten

- [Projekte](${siteUrl}/projekte): Referenzen mit technischen Daten zu Kachelöfen, Heizkaminen, Schornsteinen und Fliesenflächen.
- [Über uns](${siteUrl}/ueber-uns)
- [Kontakt](${siteUrl}/kontakt)

## Vollständige Inhalte

- [llms-full.txt](${siteUrl}/llms-full.txt): Alle Leistungen, FAQs, Ratgeber-Artikel und Projektdaten in einer Datei.
`
}

function buildLlmsFullTxt() {
  const serviceSections = services
    .map((s) => {
      const faqs = (s.faqs || [])
        .map((faq) => `**${faq.question}**\n\n${faq.answer}`)
        .join('\n\n')
      return `### ${s.title}

${siteUrl}/leistungen/${s.slug}

${s.intro}

Leistungsumfang:
${s.bullets.map((b) => `- ${b}`).join('\n')}

Arbeitsweise:
${s.proofPoints.map((p) => `- ${p}`).join('\n')}

${faqs}`
    })
    .join('\n\n')

  const regionSections = serviceRegions
    .map((r) => `### ${r.title}\n\n${siteUrl}/region/${r.slug}\n\n${r.intro}`)
    .join('\n\n')

  const articleSections = knowledgeArticles
    .map(
      (a) =>
        `### ${a.title}\n\n${siteUrl}/ratgeber/${a.slug} (Stand: ${a.date}, Kategorie: ${a.category})\n\n${deindent(a.content)}`
    )
    .join('\n\n---\n\n')

  const projectSections = projects
    .map((p) => {
      const specs = Object.entries(p.specs || {})
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')
      return `### ${p.title}\n\n${p.description}\n\n${specs}\n\n${p.caseStudy || ''}`.trim()
    })
    .join('\n\n')

  return `# ${company.name} — vollständige Inhalte

> ${company.claim} ${company.legalName} in ${company.address.region}. Kontakt: ${company.phone.label}, ${company.email.label}, ${company.hours}.

## Leistungen

${serviceSections}

## Regionen

${regionSections}

## Ratgeber

${articleSections}

## Projekte & Referenzen

${projectSections}
`
}

function buildArticleMarkdown(article) {
  return `---
title: "${article.title}"
description: "${article.summary}"
date: ${article.date}
category: ${article.category}
tags: [${article.tags.join(', ')}]
canonical: ${siteUrl}/ratgeber/${article.slug}
author: ${company.name}
---

# ${article.title}

${deindent(article.content)}
`
}

mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
writeFileSync(join(publicDir, 'robots.txt'), robots)

const llmsTxtPath = join(publicDir, 'llms.txt')
const llmsFullPath = join(publicDir, 'llms-full.txt')
const ratgeberMdDir = join(publicDir, 'ratgeber')
const indexNowKeyPath = join(publicDir, 'indexnow-key.txt')

if (!geoAi) {
  // public/ is shared across build modes/tiers — never ship GEO artifacts from a
  // demo build or a basis build (basis = plain SEO only).
  for (const path of [llmsTxtPath, llmsFullPath, indexNowKeyPath]) {
    if (existsSync(path)) rmSync(path)
  }
  if (existsSync(ratgeberMdDir)) rmSync(ratgeberMdDir, { recursive: true })
} else {
  writeFileSync(llmsTxtPath, buildLlmsTxt())
  writeFileSync(llmsFullPath, buildLlmsFullTxt())
  mkdirSync(ratgeberMdDir, { recursive: true })
  for (const article of knowledgeArticles) {
    writeFileSync(join(ratgeberMdDir, `${article.slug}.md`), buildArticleMarkdown(article))
  }
  if (env.INDEXNOW_KEY) {
    writeFileSync(indexNowKeyPath, env.INDEXNOW_KEY)
  }
}

const assetKind = isDemo
  ? 'demo noindex'
  : geoAi
    ? 'SEO + GEO (llms.txt, markdown mirrors)'
    : 'basis SEO (sitemap + robots only)'
console.log(`Generated ${assetKind} assets for ${siteUrl} [tier: ${tier}]`)

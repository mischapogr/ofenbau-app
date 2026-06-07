import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const srcDir = join(root, 'src')
const failures = []
const warnings = []

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function lineFor(content, index) {
  return content.slice(0, index).split('\n').length
}

function hasAccessibleName(tag) {
  if (/aria-label\s*=|aria-labelledby\s*=|title\s*=/.test(tag)) return true
  return />(?:(?!<\/button>).)*(\S|{{|<slot)/s.test(tag)
}

function templateOnly(content) {
  const match = content.match(/<template>([\s\S]*)<\/template>/)
  return match?.[1] || content
}

for (const file of walk(srcDir).filter((path) => path.endsWith('.vue'))) {
  const raw = readFileSync(file, 'utf8')
  const content = templateOnly(raw)

  for (const match of content.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0]
    if (!/(\s|:)alt\s*=/.test(tag)) {
      failures.push(`${file}:${lineFor(content, match.index)} image is missing alt`)
    }
  }

  for (const match of content.matchAll(/<iframe\b[^>]*>/g)) {
    const tag = match[0]
    if (!/\stitle\s*=/.test(tag)) {
      failures.push(`${file}:${lineFor(content, match.index)} iframe is missing title`)
    }
  }

  for (const match of content.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/g)) {
    const tag = match[0]
    if (!/\srel=["'][^"']*\bnoopener\b/.test(tag)) {
      failures.push(`${file}:${lineFor(content, match.index)} target=_blank link is missing rel=noopener`)
    }
  }

  for (const match of content.matchAll(/<button\b[\s\S]*?<\/button>/g)) {
    const tag = match[0]
    if (!hasAccessibleName(tag)) {
      warnings.push(`${file}:${lineFor(content, match.index)} button accessible name should be verified`)
    }
  }
}

console.log('Static accessibility report')

if (warnings.length) {
  console.log(`Warnings (${warnings.length})`)
  for (const warning of warnings) console.log(`  - ${warning}`)
  console.log('')
}

if (failures.length) {
  console.log(`Failures (${failures.length})`)
  for (const failure of failures) console.log(`  - ${failure}`)
  process.exitCode = 1
} else {
  console.log('All hard accessibility checks passed.')
}

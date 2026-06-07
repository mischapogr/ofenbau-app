import { spawnSync } from 'node:child_process'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:all -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const steps = [
  ['npm', ['run', 'deploy:smoke', '--', siteUrl]],
  ['npm', ['run', 'deploy:seo', '--', siteUrl]],
  ['npm', ['run', 'deploy:maps', '--', siteUrl]],
  ['npm', ['run', 'deploy:analytics', '--', siteUrl]],
  ['npm', ['run', 'deploy:links', '--', siteUrl]],
  ['npm', ['run', 'deploy:a11y', '--', siteUrl]],
  ['npm', ['run', 'deploy:visual', '--', siteUrl]],
  ['npm', ['run', 'deploy:perf', '--', siteUrl]],
]

console.log(`Deployment smoke suite: ${siteUrl}`)
if (!process.env.ANALYTICS_SMOKE_GA_ID) {
  console.log('Analytics smoke expects no GA4 script because ANALYTICS_SMOKE_GA_ID is not set.')
}

for (const [command, args] of steps) {
  const label = `${command} ${args.join(' ')}`
  console.log(`\n==> ${label}`)
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env })
  if (result.status !== 0) {
    console.error(`\nDeployment smoke suite failed at: ${label}`)
    process.exit(result.status || 1)
  }
}

console.log('\nDeployment smoke suite passed.')

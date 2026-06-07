import { spawn, spawnSync } from 'node:child_process'

const e2ePort = '5174'

const steps = [
  ['npm', ['run', 'build']],
  ['npm', ['run', 'lint:check']],
  ['npm', ['run', 'company:check']],
  ['npm', ['run', 'content:review']],
  ['npm', ['run', 'content:placeholders']],
  ['npm', ['run', 'content:inventory']],
  ['npm', ['run', 'content:assets']],
  ['npm', ['run', 'legal:review']],
  ['npm', ['run', 'deploy:config']],
  ['npm', ['run', 'a11y:static']],
  ['npm', ['run', 'privacy:check']],
  ['npm', ['run', 'perf:budget']],
  ['npm', ['run', 'contact:smoke']],
  ['npm', ['run', 'launch:contact']],
  ['npm', ['run', 'launch:deployment']],
  ['npm', ['run', 'launch:performance']],
  ['npm', ['run', 'launch:inputs']],
  ['npm', ['run', 'launch:accounts']],
  ['npm', ['run', 'launch:actions']],
  ['npm', ['run', 'launch:evidence']],
  ['npm', ['run', 'launch:report']],
]

for (const [command, args, env = {}] of steps) {
  const label = `${command} ${args.join(' ')}`
  console.log(`\n==> ${label}`)
  const result = spawnSync(command, args, { stdio: 'inherit', env: { ...process.env, ...env } })
  if (result.status !== 0) {
    console.error(`\nPreflight failed at: ${label}`)
    process.exit(result.status || 1)
  }
}

console.log('\n==> npx vite --host 0.0.0.0 --port 5174 --strictPort')
const browserSmokeEnv = {
  ...process.env,
  VITE_APP_URL: `http://localhost:${e2ePort}`,
}
const server = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', e2ePort, '--strictPort'], {
  stdio: 'inherit',
  env: browserSmokeEnv,
})

let serverExited = false
let serverExitCode = null
server.on('exit', (code) => {
  serverExited = true
  serverExitCode = code
})

const shutdown = () => {
  if (!server.killed) server.kill('SIGTERM')
}

process.on('exit', shutdown)
process.on('SIGINT', () => {
  shutdown()
  process.exit(130)
})

await new Promise((resolve) => setTimeout(resolve, 2000))

if (serverExited) {
  console.error(`\nPreflight failed to start Vite on port ${e2ePort}. Exit code: ${serverExitCode}`)
  process.exit(serverExitCode || 1)
}

console.log(`\n==> SMOKE_SKIP_API_HEALTH=1 npm run deploy:smoke -- http://localhost:${e2ePort}`)
const routeSmoke = spawnSync('npm', ['run', 'deploy:smoke', '--', `http://localhost:${e2ePort}`], {
  stdio: 'inherit',
  env: { ...browserSmokeEnv, SMOKE_SKIP_API_HEALTH: '1' },
})
if (routeSmoke.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: SMOKE_SKIP_API_HEALTH=1 npm run deploy:smoke -- http://localhost:${e2ePort}`)
  process.exit(routeSmoke.status || 1)
}

console.log(`\n==> npm run deploy:seo -- http://localhost:${e2ePort}`)
const browserSeo = spawnSync('npm', ['run', 'deploy:seo', '--', `http://localhost:${e2ePort}`], {
  stdio: 'inherit',
  env: browserSmokeEnv,
})
if (browserSeo.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: npm run deploy:seo -- http://localhost:${e2ePort}`)
  process.exit(browserSeo.status || 1)
}

console.log(`\n==> npm run deploy:analytics -- http://localhost:${e2ePort}`)
const browserAnalytics = spawnSync(
  'npm',
  ['run', 'deploy:analytics', '--', `http://localhost:${e2ePort}`],
  {
    stdio: 'inherit',
    env: browserSmokeEnv,
  }
)
if (browserAnalytics.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: npm run deploy:analytics -- http://localhost:${e2ePort}`)
  process.exit(browserAnalytics.status || 1)
}

console.log(`\n==> npm run deploy:maps -- http://localhost:${e2ePort}`)
const browserMaps = spawnSync('npm', ['run', 'deploy:maps', '--', `http://localhost:${e2ePort}`], {
  stdio: 'inherit',
  env: browserSmokeEnv,
})
if (browserMaps.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: npm run deploy:maps -- http://localhost:${e2ePort}`)
  process.exit(browserMaps.status || 1)
}

console.log(`\n==> npm run deploy:perf -- http://localhost:${e2ePort}`)
const browserPerf = spawnSync('npm', ['run', 'deploy:perf', '--', `http://localhost:${e2ePort}`], {
  stdio: 'inherit',
  env: browserSmokeEnv,
})
if (browserPerf.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: npm run deploy:perf -- http://localhost:${e2ePort}`)
  process.exit(browserPerf.status || 1)
}

console.log(`\n==> npm run deploy:a11y -- http://localhost:${e2ePort}`)
const browserA11y = spawnSync('npm', ['run', 'deploy:a11y', '--', `http://localhost:${e2ePort}`], {
  stdio: 'inherit',
  env: browserSmokeEnv,
})
if (browserA11y.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: npm run deploy:a11y -- http://localhost:${e2ePort}`)
  process.exit(browserA11y.status || 1)
}

console.log(`\n==> npm run deploy:links -- http://localhost:${e2ePort}`)
const browserLinks = spawnSync('npm', ['run', 'deploy:links', '--', `http://localhost:${e2ePort}`], {
  stdio: 'inherit',
  env: browserSmokeEnv,
})
if (browserLinks.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: npm run deploy:links -- http://localhost:${e2ePort}`)
  process.exit(browserLinks.status || 1)
}

console.log(`\n==> npm run deploy:visual -- http://localhost:${e2ePort}`)
const browserVisual = spawnSync('npm', ['run', 'deploy:visual', '--', `http://localhost:${e2ePort}`], {
  stdio: 'inherit',
  env: browserSmokeEnv,
})
if (browserVisual.status !== 0) {
  shutdown()
  console.error(`\nPreflight failed at: npm run deploy:visual -- http://localhost:${e2ePort}`)
  process.exit(browserVisual.status || 1)
}

console.log('\n==> npm run test:e2e')
const e2e = spawnSync('npm', ['run', 'test:e2e'], {
  stdio: 'inherit',
  env: { ...browserSmokeEnv, E2E_PORT: e2ePort, E2E_NO_WEBSERVER: '1' },
})
shutdown()

if (e2e.status !== 0) {
  console.error('\nPreflight failed at: npm run test:e2e')
  process.exit(e2e.status || 1)
}

console.log('\nPreflight passed.')

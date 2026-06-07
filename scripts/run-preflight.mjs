import { spawn, spawnSync } from 'node:child_process'

const e2ePort = '5174'

const steps = [
  ['npm', ['run', 'build']],
  ['npm', ['run', 'lint:check']],
  ['npm', ['run', 'company:check']],
  ['npm', ['run', 'content:inventory']],
  ['npm', ['run', 'content:assets']],
  ['npm', ['run', 'deploy:config']],
  ['npm', ['run', 'a11y:static']],
  ['npm', ['run', 'privacy:check']],
  ['npm', ['run', 'perf:budget']],
  ['npm', ['run', 'contact:smoke']],
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
const server = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', e2ePort, '--strictPort'], {
  stdio: 'inherit',
  env: process.env,
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

console.log('\n==> npm run test:e2e')
const e2e = spawnSync('npm', ['run', 'test:e2e'], {
  stdio: 'inherit',
  env: { ...process.env, E2E_PORT: e2ePort, E2E_NO_WEBSERVER: '1' },
})
shutdown()

if (e2e.status !== 0) {
  console.error('\nPreflight failed at: npm run test:e2e')
  process.exit(e2e.status || 1)
}

console.log('\nPreflight passed.')

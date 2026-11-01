// Print the current public URL of the demo quick tunnel.
//
// Primary source: cloudflared's metrics endpoint /quicktunnel, published on
// 127.0.0.1:20241 by docker-compose.demo.yml. Fallback: scrape the container
// logs. The resolved URL is also written to _tmp/demo-url.txt for convenience.
//
//   npm run demo:url
import { mkdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const METRICS_URL = process.env.DEMO_METRICS_URL || 'http://127.0.0.1:20241/quicktunnel'
const CONTAINER = process.env.DEMO_TUNNEL_CONTAINER || 'ofenbau-demo-tunnel'
const OUT_FILE = '_tmp/demo-url.txt'

async function fromMetrics() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)
  try {
    const res = await fetch(METRICS_URL, { signal: controller.signal })
    if (!res.ok) return null
    const { hostname } = await res.json()
    return hostname ? `https://${hostname}` : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function fromLogs() {
  try {
    const logs = execFileSync('docker', ['logs', CONTAINER], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const matches = logs.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/g)
    return matches?.length ? matches[matches.length - 1] : null
  } catch {
    return null
  }
}

const url = (await fromMetrics()) || fromLogs()

if (!url) {
  console.error(
    'Could not determine the tunnel URL.\n' +
      `Is the stack running? Try: npm run demo:up\n` +
      `Checked metrics ${METRICS_URL} and "docker logs ${CONTAINER}".`
  )
  process.exit(1)
}

mkdirSync('_tmp', { recursive: true })
writeFileSync(OUT_FILE, `${url}\n`)

console.log(url)
console.log('\nAccess code: run `sops decrypt secrets/ofenbau.enc.env | grep DEMO_ACCESS_CODE` (see docs/SECRETS.md)')
console.log(`(saved to ${OUT_FILE})`)

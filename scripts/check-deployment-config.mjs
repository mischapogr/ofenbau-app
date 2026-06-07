import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const checks = []

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function file(path) {
  const exists = existsSync(join(root, path))
  check(exists, `${path} exists`)
  return exists ? read(path) : ''
}

const dockerfileProd = file('Dockerfile.prod')
const dockerfileContact = file('Dockerfile.contact')
const compose = file('docker-compose.prod.yml')
const nginx = file('nginx.conf')
const envExample = file('.env.production.example')

check(/FROM\s+node:22[\w.-]*\s+AS\s+build/i.test(dockerfileProd), 'Dockerfile.prod has a Node build stage')
check(/RUN\s+npm\s+run\s+build/.test(dockerfileProd), 'Dockerfile.prod runs the production build')
check(/FROM\s+nginx:1\.27-alpine\s+AS\s+production/i.test(dockerfileProd), 'Dockerfile.prod serves with nginx 1.27 alpine')
check(/COPY\s+nginx\.conf\s+\/etc\/nginx\/conf\.d\/default\.conf/.test(dockerfileProd), 'Dockerfile.prod copies nginx.conf')
check(/COPY\s+--from=build\s+\/app\/dist\s+\/usr\/share\/nginx\/html/.test(dockerfileProd), 'Dockerfile.prod copies built dist output')
check(/HEALTHCHECK[\s\S]*http:\/\/localhost\//.test(dockerfileProd), 'Dockerfile.prod has an HTTP healthcheck')

check(/COPY\s+server\/contact-api\.mjs\s+\.\/server\/contact-api\.mjs/.test(dockerfileContact), 'Dockerfile.contact copies the contact API')
check(/EXPOSE\s+3000/.test(dockerfileContact), 'Dockerfile.contact exposes port 3000')
check(/HEALTHCHECK[\s\S]*\/healthz/.test(dockerfileContact), 'Dockerfile.contact has a healthcheck')
check(/CMD\s+\["node",\s*"server\/contact-api\.mjs"\]/.test(dockerfileContact), 'Dockerfile.contact starts the API')

check(/services:\s*[\s\S]*\bweb:/.test(compose), 'docker-compose.prod.yml defines web service')
check(/services:\s*[\s\S]*\bapi:/.test(compose), 'docker-compose.prod.yml defines api service')
check(/dockerfile:\s*Dockerfile\.prod/.test(compose), 'web service builds Dockerfile.prod')
check(/dockerfile:\s*Dockerfile\.contact/.test(compose), 'api service builds Dockerfile.contact')
check(/depends_on:[\s\S]*api:[\s\S]*condition:\s*service_healthy/.test(compose), 'web waits for healthy api service')
check(/VITE_API_BASE_URL:\s*\$\{VITE_API_BASE_URL:-\/api\}/.test(compose), 'web defaults to same-origin /api')
check(/MAIL_HOST:\s*\$\{MAIL_HOST:-mailpit\}/.test(compose), 'api exposes MAIL_HOST deployment override')
check(/MAIL_PORT:\s*\$\{MAIL_PORT:-1025\}/.test(compose), 'api exposes MAIL_PORT deployment override')
check(/MAIL_FROM:\s*\$\{MAIL_FROM:-[^}]+\}/.test(compose), 'api exposes MAIL_FROM deployment override')
check(/MAIL_TO:\s*\$\{MAIL_TO:-[^}]+\}/.test(compose), 'api exposes MAIL_TO deployment override')
check(/healthcheck:[\s\S]*\/healthz/.test(compose), 'api compose service has a healthcheck')

check(/listen\s+80;/.test(nginx), 'nginx listens on port 80')
check(/root\s+\/usr\/share\/nginx\/html;/.test(nginx), 'nginx serves built static files')
check(/gzip\s+on;/.test(nginx), 'nginx enables gzip')
check(/location\s+\/assets\/[\s\S]*Cache-Control\s+"public, immutable"/.test(nginx), 'nginx gives hashed assets immutable cache headers')
check(/location\s+\/api\/[\s\S]*proxy_pass\s+http:\/\/api:3000\/api\//.test(nginx), 'nginx proxies /api/ to the api service')
check(/location\s+\/[\s\S]*try_files\s+\$uri\s+\$uri\/\s+\/index\.html;/.test(nginx), 'nginx has SPA history fallback')
check(/X-Frame-Options\s+"SAMEORIGIN"\s+always/.test(nginx), 'nginx sets X-Frame-Options')
check(/X-Content-Type-Options\s+"nosniff"\s+always/.test(nginx), 'nginx sets X-Content-Type-Options')
check(/Referrer-Policy\s+"strict-origin-when-cross-origin"\s+always/.test(nginx), 'nginx sets Referrer-Policy')

for (const key of [
  'VITE_APP_URL',
  'VITE_API_BASE_URL',
  'VITE_GOOGLE_SITE_VERIFICATION',
  'VITE_GA_MEASUREMENT_ID',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_FROM',
  'MAIL_TO',
  'SMTP_TIMEOUT_MS',
]) {
  check(new RegExp(`^${key}=`, 'm').test(envExample), `.env.production.example documents ${key}`)
}

const failed = checks.filter((item) => !item.ok)

console.log('Deployment config report')
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

import { spawn } from 'node:child_process'
import net from 'node:net'

const checks = []
const smtpMessages = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

function startFakeSmtp() {
  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      let dataMode = false
      let message = ''

      socket.setEncoding('utf8')
      socket.write('220 fake-smtp.local ESMTP\r\n')
      socket.on('data', (chunk) => {
        for (const line of chunk.split(/\r\n/).filter(Boolean)) {
          if (dataMode) {
            if (line === '.') {
              dataMode = false
              smtpMessages.push(message)
              message = ''
              socket.write('250 queued\r\n')
            } else {
              message += `${line}\n`
            }
            continue
          }

          if (/^DATA$/i.test(line)) {
            dataMode = true
            socket.write('354 end with dot\r\n')
          } else if (/^QUIT$/i.test(line)) {
            socket.write('221 bye\r\n')
            socket.end()
          } else {
            socket.write('250 ok\r\n')
          }
        }
      })
    })

    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

async function waitForHealth(port) {
  const endpoint = `http://127.0.0.1:${port}/api/healthz`
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(endpoint)
      if (response.ok) return true
    } catch (_error) {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  return false
}

async function postContact(port, payload, ip = '198.51.100.10') {
  const response = await fetch(`http://127.0.0.1:${port}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': ip,
    },
    body: JSON.stringify(payload),
  })
  return { response, body: await response.json().catch(() => ({})) }
}

const smtpServer = await startFakeSmtp()
const smtpPort = smtpServer.address().port
const apiPort = await getFreePort()
const api = spawn('node', ['server/contact-api.mjs'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env,
    PORT: String(apiPort),
    MAIL_HOST: '127.0.0.1',
    MAIL_PORT: String(smtpPort),
    MAIL_FROM: 'website@example.test',
    MAIL_TO: 'kontakt@example.test',
    SMTP_TIMEOUT_MS: '2000',
  },
})

let apiOutput = ''
api.stdout.on('data', (chunk) => {
  apiOutput += chunk.toString('utf8')
})
api.stderr.on('data', (chunk) => {
  apiOutput += chunk.toString('utf8')
})

try {
  check(await waitForHealth(apiPort), 'contact API health endpoint becomes available')

  const health = await fetch(`http://127.0.0.1:${apiPort}/api/healthz`)
  check(health.status === 200, `health endpoint responds with 200 (${health.status})`)
  check((await health.json()).ok === true, 'health endpoint returns ok=true')

  const method = await fetch(`http://127.0.0.1:${apiPort}/api/contact`)
  check(method.status === 405, `GET /api/contact responds with 405 (${method.status})`)

  const missing = await postContact(apiPort, { name: '', email: '', message: '' }, '198.51.100.11')
  check(missing.response.status === 422, `missing fields respond with 422 (${missing.response.status})`)
  check(/pflichtfelder/i.test(missing.body.message || ''), 'missing fields return a useful validation message')

  const honeypot = await postContact(
    apiPort,
    {
      name: 'Spam Bot',
      email: 'bot@example.test',
      website: 'https://spam.example',
      message: 'Diese Nachricht ist lang genug.',
    },
    '198.51.100.12'
  )
  check(honeypot.response.status === 422, `honeypot responds with 422 (${honeypot.response.status})`)
  check(/spam/i.test(honeypot.body.message || ''), 'honeypot returns a spam validation message')

  const valid = await postContact(
    apiPort,
    {
      name: 'Erika Beispiel',
      email: 'erika@example.test',
      phone: '+49 30 123456',
      subject: '3D-Entwurf',
      message: 'Bitte melden Sie sich wegen einer Ofenplanung.',
    },
    '198.51.100.13'
  )
  check(valid.response.status === 200, `valid contact request responds with 200 (${valid.response.status})`)
  check(valid.body.ok === true, 'valid contact request returns ok=true')
  check(smtpMessages.length === 1, 'valid contact request is handed to SMTP once')
  check(/Subject: Kontaktformular: 3D-Entwurf/.test(smtpMessages[0] || ''), 'SMTP message contains the contact subject')
  check(/Reply-To: erika@example\.test/.test(smtpMessages[0] || ''), 'SMTP message contains Reply-To')
  check(/Bitte melden Sie sich/.test(smtpMessages[0] || ''), 'SMTP message contains the submitted message')

  let lastRateStatus = 0
  for (let index = 0; index < 6; index += 1) {
    const result = await postContact(apiPort, { name: '', email: '', message: '' }, '198.51.100.14')
    lastRateStatus = result.response.status
  }
  check(lastRateStatus === 429, `sixth request from one client is rate-limited (${lastRateStatus})`)
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Contact API smoke failed' })
} finally {
  api.kill('SIGTERM')
  smtpServer.close()
}

const failed = checks.filter((item) => !item.ok)

console.log('Contact API smoke test')
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}
if (failed.length && apiOutput.trim()) {
  console.log('Contact API output:')
  console.log(apiOutput.trim())
}

if (failed.length) {
  process.exitCode = 1
}

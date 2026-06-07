import http from 'node:http'
import net from 'node:net'

const port = Number(process.env.PORT || 3000)
const maxBodySize = 32_000
const rateWindowMs = 10 * 60 * 1000
const maxRequestsPerWindow = 5
const rateBuckets = new Map()

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(data))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > maxBodySize) reject(new Error('Payload too large'))
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (_error) {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function smtpEscape(value) {
  return String(value || '').replace(/\r?\n/g, ' ').trim()
}

function dotStuff(value) {
  return String(value || '').replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..')
}

function smtpSend({ host, port: smtpPort, from, to, subject, replyTo, body }) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port: Number(smtpPort) })
    const commands = [
      'HELO ofenbau-contact-api',
      `MAIL FROM:<${from}>`,
      `RCPT TO:<${to}>`,
      'DATA',
      [
        `Subject: ${smtpEscape(subject)}`,
        `From: Ofenbau Website <${from}>`,
        `To: ${to}`,
        replyTo ? `Reply-To: ${replyTo}` : '',
        'Content-Type: text/plain; charset=UTF-8',
        '',
        dotStuff(body),
        '.',
      ]
        .filter(Boolean)
        .join('\r\n'),
      'QUIT',
    ]
    let index = 0
    let settled = false

    const fail = (error) => {
      if (settled) return
      settled = true
      socket.destroy()
      reject(error)
    }

    socket.setTimeout(Number(process.env.SMTP_TIMEOUT_MS || 8000), () =>
      fail(new Error('SMTP timeout'))
    )
    socket.on('error', fail)
    socket.on('data', (chunk) => {
      const response = chunk.toString('utf8')
      const code = Number(response.slice(0, 3))
      if (code >= 400) {
        fail(new Error(`SMTP rejected command: ${response.trim()}`))
        return
      }
      if (index < commands.length) {
        socket.write(`${commands[index]}\r\n`)
        index += 1
        return
      }
      if (!settled) {
        settled = true
        socket.end()
        resolve()
      }
    })
  })
}

function clientKey(req) {
  const forwardedFor = req.headers['x-forwarded-for']
  return String(forwardedFor || req.socket.remoteAddress || 'unknown').split(',')[0].trim()
}

function rateLimited(req) {
  const key = clientKey(req)
  const now = Date.now()
  const current = rateBuckets.get(key) || { count: 0, resetAt: now + rateWindowMs }
  if (current.resetAt < now) {
    current.count = 0
    current.resetAt = now + rateWindowMs
  }
  current.count += 1
  rateBuckets.set(key, current)
  return current.count > maxRequestsPerWindow
}

function validate(payload) {
  if (payload.website) return 'Diese Anfrage wurde als Spam erkannt.'
  if (!payload.name || !payload.email || !payload.message) {
    return 'Bitte füllen Sie alle Pflichtfelder aus.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    return 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
  }
  if (String(payload.message).trim().length < 10) {
    return 'Bitte beschreiben Sie Ihr Anliegen etwas genauer.'
  }
  return ''
}

async function sendContactMail(payload) {
  const from = process.env.MAIL_FROM || 'no-reply@ofenbau-mustermann.test'
  const to = process.env.MAIL_TO || 'info@ofenbau-mustermann.test'
  const host = process.env.MAIL_HOST || 'mailpit'
  const smtpPort = process.env.MAIL_PORT || 1025
  const subject = `Kontaktformular: ${payload.subject || 'Beratung allgemein'}`
  const body = [
    `Thema: ${payload.subject || 'Beratung allgemein'}`,
    `Name: ${payload.name}`,
    `E-Mail: ${payload.email}`,
    `Telefon: ${payload.phone || '-'}`,
    '',
    'Nachricht:',
    payload.message,
  ].join('\n')

  await smtpSend({ host, port: smtpPort, from, to, subject, replyTo: payload.email, body })
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/healthz' || req.url === '/api/healthz') {
    json(res, 200, { ok: true })
    return
  }

  if (req.method === 'OPTIONS' && (req.url === '/api/contact' || req.url === '/contact')) {
    json(res, 204, {})
    return
  }

  if (req.url !== '/api/contact' && req.url !== '/contact') {
    json(res, 404, { message: 'Ressource nicht gefunden.' })
    return
  }

  if (req.method !== 'POST') {
    json(res, 405, { message: 'Methode nicht erlaubt.' })
    return
  }

  if (rateLimited(req)) {
    json(res, 429, { message: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' })
    return
  }

  try {
    const payload = await readJsonBody(req)
    const validationError = validate(payload)
    if (validationError) {
      json(res, 422, { message: validationError })
      return
    }

    await sendContactMail(payload)
    json(res, 200, { ok: true })
  } catch (error) {
    json(res, 500, { message: error.message || 'Kontaktanfrage konnte nicht gesendet werden.' })
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Contact API listening on :${port}`)
})

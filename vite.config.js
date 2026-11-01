import { fileURLToPath, URL } from 'node:url'
import net from 'node:net'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 32_000) reject(new Error('Payload too large'))
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
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .trim()
}

function dotStuff(value) {
  return String(value || '')
    .replace(/\r?\n/g, '\r\n')
    .replace(/^\./gm, '..')
}

function smtpSend({ host, port, from, to, subject, replyTo, body }) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port: Number(port) })
    const commands = [
      `HELO localhost`,
      `MAIL FROM:<${from}>`,
      `RCPT TO:<${to}>`,
      'DATA',
      [
        `Subject: ${smtpEscape(subject)}`,
        `From: Ofenbau Mustermann <${from}>`,
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

    socket.setTimeout(5000, () => fail(new Error('SMTP timeout')))
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

async function sendContactMail(env, payload) {
  const from = env.MAIL_FROM || 'no-reply@ofenbau-mustermann.test'
  const to = env.MAIL_TO || 'info@ofenbau-mustermann.test'
  const host = env.MAIL_HOST || 'mailpit'
  const port = env.MAIL_PORT || 1025
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

  try {
    await smtpSend({ host, port, from, to, subject, replyTo: payload.email, body })
  } catch (error) {
    if (host !== 'mailpit') throw error
    await smtpSend({
      host: 'localhost',
      port: env.MAILPIT_SMTP_PORT || port,
      from,
      to,
      subject,
      replyTo: payload.email,
      body,
    })
  }
}

function contactDevApiPlugin(env) {
  return {
    name: 'contact-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/healthz', (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ ok: true }))
      })

      server.middlewares.use('/api/contact', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ message: 'Methode nicht erlaubt.' }))
          return
        }

        try {
          const payload = await readJsonBody(req)
          if (payload.website) {
            res.statusCode = 422
            res.end(JSON.stringify({ message: 'Diese Anfrage wurde als Spam erkannt.' }))
            return
          }
          if (!payload.name || !payload.email || !payload.message) {
            res.statusCode = 422
            res.end(JSON.stringify({ message: 'Bitte füllen Sie alle Pflichtfelder aus.' }))
            return
          }

          await sendContactMail(env, payload)
          res.end(JSON.stringify({ ok: true }))
        } catch (error) {
          res.statusCode = 500
          res.end(
            JSON.stringify({
              message: error.message || 'Kontaktanfrage konnte nicht gesendet werden.',
            })
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Tier ("basis" | "premium") is orthogonal to mode. Resolve it explicitly and
  // inject via `define` so import.meta.env.VITE_TIER is reliable regardless of
  // whether it arrives through a .env file or an inline `VITE_TIER=basis` prefix.
  const tier =
    String(process.env.VITE_TIER || env.VITE_TIER || 'premium').toLowerCase() === 'basis'
      ? 'basis'
      : 'premium'
  const demoAllowedHosts = String(env.VITE_DEMO_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  return {
    plugins: [contactDevApiPlugin(env), vue()],
    define: {
      'import.meta.env.VITE_TIER': JSON.stringify(tier),
    },
    build: {
      sourcemap: false,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      // Permit the demo's external hostnames (e.g. a DDNS name) through Vite's
      // DNS-rebinding host check; IPs and localhost are allowed by default.
      ...(demoAllowedHosts.length ? { allowedHosts: demoAllowedHosts } : {}),
      // Required for hot reload to work reliably inside Docker bind mounts.
      watch: {
        usePolling: true,
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      // Same host allowlist as the dev server, so the served demo build can be
      // reached via its external hostnames (DDNS name, tunnel upstream, etc.).
      ...(demoAllowedHosts.length ? { allowedHosts: demoAllowedHosts } : {}),
      // Forward /api to the contact API container so the demo contact form
      // works behind `vite preview` (which otherwise serves static files only).
      // Target is the compose-network service; override via PREVIEW_API_PROXY.
      proxy: {
        '/api': {
          target: process.env.PREVIEW_API_PROXY || 'http://api:3000',
          changeOrigin: true,
        },
      },
    },
  }
})

const rawUrl = process.argv[2] || process.env.VITE_APP_URL
const confirmed = process.env.CONTACT_DELIVERY_CONFIRM === 'send'
const allowLocal = process.env.CONTACT_DELIVERY_ALLOW_LOCAL === '1'

if (!rawUrl) {
  console.error('Usage: CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const endpointPath = process.env.CONTACT_DELIVERY_PATH || '/api/contact'
const endpoint = new URL(endpointPath, siteUrl).toString()
const isLocalTarget = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(siteUrl)
const timestamp = new Date().toISOString()

const payload = {
  name: process.env.CONTACT_DELIVERY_NAME || 'Launch Delivery Test',
  email: process.env.CONTACT_DELIVERY_REPLY_TO || 'launch-test@example.invalid',
  phone: process.env.CONTACT_DELIVERY_PHONE || '',
  website: '',
  subject: process.env.CONTACT_DELIVERY_SUBJECT || 'Launch Kontaktformular Test',
  message:
    process.env.CONTACT_DELIVERY_MESSAGE ||
    `Automatischer Launch-Test des Kontaktformulars. Bitte Empfang dokumentieren. Zeitstempel: ${timestamp}`,
}

console.log(`Contact delivery test endpoint: ${endpoint}`)
console.log(`Reply-To: ${payload.email}`)
console.log(`Subject: ${payload.subject}`)

if (!confirmed) {
  console.log('')
  console.log('Dry run only. Set CONTACT_DELIVERY_CONFIRM=send to submit the test message.')
  process.exit(0)
}

if (isLocalTarget && !allowLocal) {
  console.error('Refusing to send to a local URL. Set CONTACT_DELIVERY_ALLOW_LOCAL=1 for Mailpit/dev tests.')
  process.exit(1)
}

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await response.text()
  const ok = response.status >= 200 && response.status < 300 && body.includes('"ok":true')

  console.log(`Response: ${response.status}`)
  if (body) console.log(body)

  if (!ok) {
    process.exitCode = 1
  }
} catch (error) {
  console.error(error.message || 'Contact delivery test failed')
  process.exitCode = 1
}

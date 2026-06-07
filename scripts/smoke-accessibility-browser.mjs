import { chromium } from '@playwright/test'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:a11y -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const checks = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

function routeUrl(route) {
  return `${siteUrl}${route}`
}

async function visibleCount(page, selector) {
  return page.locator(selector).evaluateAll((items) => items.filter((item) => item.offsetParent).length)
}

async function hasFocusedText(page, text) {
  return page.evaluate((expected) => document.activeElement?.textContent?.includes(expected), text)
}

async function closesAfterEscape(page, locator) {
  await page.keyboard.press('Escape')
  try {
    await locator.waitFor({ state: 'hidden', timeout: 1000 })
    return true
  } catch {
    return false
  }
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

try {
  const routes = ['/', '/leistungen', '/projekte', '/ueber-uns', '/kontakt', '/impressum', '/datenschutz']

  for (const route of routes) {
    const response = await page.goto(routeUrl(route), { waitUntil: 'networkidle' })
    check(response?.ok(), `${route} response is OK (${response?.status() || 'no response'})`)
    check((await visibleCount(page, 'main')) === 1, `${route} has one visible main landmark`)
    check((await visibleCount(page, 'h1')) === 1, `${route} has one visible H1`)
  }

  await page.goto(routeUrl('/'), { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  check(await hasFocusedText(page, 'Zum Inhalt springen'), 'skip link receives first keyboard focus')
  await page.keyboard.press('Enter')
  check(new URL(page.url()).hash === '#main', 'skip link targets #main')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(routeUrl('/'), { waitUntil: 'networkidle' })
  const menuButton = page.getByRole('button', { name: 'Menü umschalten' })
  await menuButton.click()
  check((await menuButton.getAttribute('aria-expanded')) === 'true', 'mobile menu button exposes expanded state')
  check(await page.getByRole('navigation', { name: 'Mobile Navigation' }).isVisible(), 'mobile navigation opens')
  await page.keyboard.press('Escape')
  check((await menuButton.getAttribute('aria-expanded')) === 'false', 'mobile menu closes on Escape')

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(routeUrl('/projekte'), { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /Wohnraum-Fliesen XXL/ }).click()
  const projectDialog = page.getByRole('dialog', { name: 'Wohnraum-Fliesen XXL' })
  check(await projectDialog.isVisible(), 'project gallery dialog opens with accessible name')
  check(await closesAfterEscape(page, projectDialog), 'project gallery dialog closes on Escape')

  await page.goto(routeUrl('/kontakt'), { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Datenschutzerklärung' }).click()
  const privacyDialog = page.getByRole('dialog', { name: 'Datenschutzerklärung' })
  check(await privacyDialog.isVisible(), 'privacy dialog opens with accessible name')
  check(await hasFocusedText(page, 'Datenschutzerklärung'), 'privacy dialog receives focus after opening')
  check(await closesAfterEscape(page, privacyDialog), 'privacy dialog closes on Escape')
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Browser accessibility smoke test failed' })
} finally {
  await browser.close()
}

const failed = checks.filter((item) => !item.ok)

console.log(`Browser accessibility smoke test: ${siteUrl}`)
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

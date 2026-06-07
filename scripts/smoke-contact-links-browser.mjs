import { chromium } from '@playwright/test'
import { company, publicSocialLinks, socialLinks } from '../src/data/company.js'

const rawUrl = process.argv[2] || process.env.VITE_APP_URL

if (!rawUrl) {
  console.error('Usage: npm run deploy:links -- https://example.de')
  process.exit(1)
}

const siteUrl = rawUrl.replace(/\/+$/, '')
const checks = []

function check(condition, message) {
  checks.push({ ok: !!condition, message })
}

async function renderedLinks(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]')).map((link) => ({
      href: link.getAttribute('href'),
      absoluteHref: link.href,
      text: link.textContent?.replace(/\s+/g, ' ').trim() || '',
      target: link.getAttribute('target') || '',
      rel: link.getAttribute('rel') || '',
    }))
  )
}

async function renderedText(page, selector) {
  return page.locator(selector).evaluateAll((nodes) =>
    nodes.map((node) => node.textContent?.replace(/\s+/g, ' ').trim() || '')
  )
}

function findByHref(links, href) {
  return links.filter((link) => link.href === href || link.absoluteHref === href)
}

function hasNoopener(link) {
  return link.rel.split(/\s+/).includes('noopener')
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

try {
  await page.goto(`${siteUrl}/kontakt`, { waitUntil: 'networkidle' })
  const contactLinks = await renderedLinks(page)

  const phoneLinks = findByHref(contactLinks, company.phone.href)
  check(phoneLinks.length > 0, 'contact page renders the configured telephone link')
  check(phoneLinks.some((link) => link.text.includes(company.phone.label)), 'telephone link text matches company phone label')

  const whatsappLinks = findByHref(contactLinks, company.whatsapp.href)
  check(whatsappLinks.length > 0, 'contact page renders the configured WhatsApp link')
  check(
    whatsappLinks.some((link) => link.text.includes(company.whatsapp.label)),
    'WhatsApp link text matches company WhatsApp label'
  )

  const emailLinks = findByHref(contactLinks, company.email.href)
  check(emailLinks.length > 0, 'contact page renders the configured email link')
  check(emailLinks.some((link) => link.text.includes(company.email.label)), 'email link text matches company email label')

  const mapLinks = contactLinks.filter((link) => /google\.com\/maps\/(dir|search)\//.test(link.absoluteHref))
  check(mapLinks.length > 0, 'contact page renders a Google Maps route link')
  check(mapLinks.every((link) => link.target === '_blank'), 'Google Maps route links open in a new tab')
  check(mapLinks.every(hasNoopener), 'Google Maps route links use rel=noopener')

  await page.goto(`${siteUrl}/`, { waitUntil: 'networkidle' })
  const homeLinks = await renderedLinks(page)
  const headerText = await renderedText(page, 'header')
  const footerText = await renderedText(page, 'footer')

  check(headerText.some((text) => text.includes(company.name)), 'header renders configured company name')
  check(footerText.some((text) => text.includes(company.name)), 'footer renders configured company name')

  for (const social of publicSocialLinks) {
    const matches = findByHref(homeLinks, social.href)
    check(matches.length > 0, `footer renders ${social.name} social link`)
    check(matches.every((link) => link.target === '_blank'), `${social.name} social link opens in a new tab`)
    check(matches.every(hasNoopener), `${social.name} social link uses rel=noopener`)
  }

  const hiddenSocialLinks = socialLinks.filter((social) => !publicSocialLinks.includes(social))
  for (const social of hiddenSocialLinks) {
    const matches = findByHref(homeLinks, social.href)
    check(matches.length === 0, `footer hides generic ${social.name} placeholder link`)
  }

  const footerPhone = findByHref(homeLinks, company.phone.href)
  const footerWhatsapp = findByHref(homeLinks, company.whatsapp.href)
  const footerEmail = findByHref(homeLinks, company.email.href)
  check(footerPhone.length > 0, 'footer renders the configured telephone link')
  check(footerWhatsapp.length > 0, 'footer renders the configured WhatsApp link')
  check(footerEmail.length > 0, 'footer renders the configured email link')

  const unsafeBlankLinks = homeLinks
    .concat(contactLinks)
    .filter((link) => link.target === '_blank' && !hasNoopener(link))
  check(unsafeBlankLinks.length === 0, 'all rendered target=_blank links use rel=noopener')
} catch (error) {
  checks.push({ ok: false, message: error.message || 'Contact link smoke test failed' })
} finally {
  await browser.close()
}

const failed = checks.filter((item) => !item.ok)

console.log(`Contact link smoke test: ${siteUrl}`)
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.message}`)
}

if (failed.length) {
  process.exitCode = 1
}

import { test, expect } from '@playwright/test'
import fs from 'node:fs'

/**
 * Guided customer demo — walks through every page and feature of the
 * Ofenbau Mustermann website. The whole run is recorded (video + trace via the
 * config) and a numbered screenshot is saved for each step under
 * `demo-artifacts/shots/desktop/`.
 */

const SHOTS = 'demo-artifacts/shots/desktop'
let step = 0

test.beforeAll(() => fs.mkdirSync(SHOTS, { recursive: true }))

async function revealAll(page) {
  // The site fades sections in on scroll (v-reveal); force them visible so
  // screenshots and the recording show full content.
  await page.evaluate(() =>
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('reveal-in'))
  )
}

async function shot(page, name, fullPage = false) {
  step += 1
  const file = `${SHOTS}/${String(step).padStart(2, '0')}-${name}.png`
  await page.screenshot({ path: file, fullPage })
}

test('Geführte Demo — gesamte Website & Funktionen', async ({ page }) => {
  // Mock the contact endpoint so the success state can be demonstrated without
  // a backend (the form posts to VITE_API_BASE_URL/contact).
  await page.route('**/contact', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  )

  await test.step('Startseite & Hero', async () => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mit gesunder Wärme leben')
    await expect(page.getByRole('link', { name: 'Beratung vereinbaren' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Projekte ansehen', exact: true })).toBeVisible()
    await page.waitForTimeout(500)
    await shot(page, 'home-hero')
  })

  await test.step('Leistungen — Service-Karten', async () => {
    await page.getByRole('heading', { name: 'Handwerk für Wärme und Raum' }).scrollIntoViewIfNeeded()
    await revealAll(page)
    await page.waitForTimeout(600)
    await shot(page, 'home-services')
  })

  await test.step('Über uns (Startseite)', async () => {
    await page.getByRole('heading', { name: /Handwerk, das man spürt/ }).scrollIntoViewIfNeeded()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, 'home-about')
  })

  await test.step('Unser Prozess (Timeline)', async () => {
    await page.getByRole('heading', { name: 'In vier Schritten zu Ihrem Ofen' }).scrollIntoViewIfNeeded()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, 'home-process')
  })

  await test.step('Projekte-Galerie (Startseite) & 3D-Planung', async () => {
    await page.getByRole('heading', { name: 'Ausgewählte Arbeiten' }).scrollIntoViewIfNeeded()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, 'home-gallery')
    await page.getByRole('heading', { name: /Ihre Vision in 3D/ }).scrollIntoViewIfNeeded()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, 'home-3d')
  })

  await test.step('Service-Detail: Kachelöfen & Kaminbau', async () => {
    await page.goto('/')
    await page.getByRole('link', { name: /Kachelöfen & Kaminbau/ }).first().click()
    await expect(page).toHaveURL(/leistungen\/kachelofen-kaminbau/)
    await expect(page.getByRole('heading', { name: 'Kachelöfen & Kaminbau' })).toBeVisible()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, 'service-detail', true)
  })

  await test.step('Leistungen — Übersicht', async () => {
    await page.goto('/leistungen')
    await expect(page.getByRole('heading', { name: /Alles für Wärme und Raum/ })).toBeVisible()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, 'leistungen-overview', true)
  })

  await test.step('Projekte — Filter & Lightbox', async () => {
    await page.goto('/projekte')
    await revealAll(page)
    await page.getByRole('button', { name: 'Fliesen', exact: true }).click()
    await page.waitForTimeout(500)
    await shot(page, 'projects-filtered')

    await page.getByRole('button', { name: /Wohnraum-Fliesen XXL/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.waitForTimeout(400)
    await shot(page, 'projects-lightbox')

    await page.getByRole('button', { name: 'Nächstes Projekt' }).click()
    await page.waitForTimeout(400)
    await shot(page, 'projects-lightbox-next')
    await page.getByRole('button', { name: 'Schließen' }).click()
    await expect(dialog).toBeHidden()
  })

  await test.step('Über uns (Seite)', async () => {
    await page.goto('/ueber-uns')
    await expect(page.getByRole('heading', { name: /Ein Meisterbetrieb mit Geschichte/ })).toBeVisible()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, 'ueber-uns', true)
  })

  await test.step('3D-Planung (Detailseite)', async () => {
    await page.goto('/leistungen/3d-planung')
    await expect(page.getByRole('heading', { name: '3D-Planung & Entwürfe' })).toBeVisible()
    await revealAll(page)
    await page.waitForTimeout(500)
    await shot(page, '3d-planung', true)
  })

  await test.step('Kontakt — Formular-Validierung', async () => {
    await page.goto('/kontakt')
    await page.getByRole('button', { name: 'Nachricht senden' }).click()
    await expect(page.getByText('Bitte geben Sie Ihren Namen an.')).toBeVisible()
    await expect(page.getByText('Bitte stimmen Sie der Datenschutzerklärung zu.')).toBeVisible()
    await page.waitForTimeout(400)
    await shot(page, 'kontakt-validierung')
  })

  await test.step('Kontakt — erfolgreiche Anfrage', async () => {
    await page.getByLabel('Name').fill('Maria Beispiel')
    await page.getByLabel(/Telefon/).fill('012345 678900')
    await page.getByLabel('E-Mail').fill('maria@example.com')
    await page.getByLabel('Nachricht').fill('Ich interessiere mich für einen Kachelofen im Wohnzimmer und bitte um eine Beratung.')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Nachricht senden' }).click()
    await expect(page.getByText('Vielen Dank!')).toBeVisible()
    await page.waitForTimeout(400)
    await shot(page, 'kontakt-erfolg')
  })

  await test.step('Rechtliches — Impressum & Datenschutz (Footer)', async () => {
    await page.goto('/impressum')
    await expect(page.getByRole('heading', { name: 'Impressum' })).toBeVisible()
    await shot(page, 'impressum', true)
    await page.goto('/datenschutz')
    await expect(page.getByRole('heading', { name: 'Datenschutzerklärung' })).toBeVisible()
    await shot(page, 'datenschutz', true)
  })
})

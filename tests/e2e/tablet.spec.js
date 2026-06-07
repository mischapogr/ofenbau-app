import { test, expect } from '@playwright/test'
import fs from 'node:fs'

/**
 * Tablet walkthrough — covers the in-between breakpoint where the mobile
 * navigation is still active but content has more horizontal space.
 * Screenshots land in `demo-artifacts/shots/tablet/`.
 */
const SHOTS = 'demo-artifacts/shots/tablet'
let step = 0

test.beforeAll(() => fs.mkdirSync(SHOTS, { recursive: true }))

async function shot(page, name) {
  step += 1
  await page.screenshot({ path: `${SHOTS}/${String(step).padStart(2, '0')}-${name}.png` })
}

async function revealAll(page) {
  await page.evaluate(() =>
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('reveal-in'))
  )
}

async function expectNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow, `${label} should not overflow horizontally`).toBeLessThanOrEqual(1)
}

test('Tablet — Layout, Navigation & Kernfunktionen', async ({ page }) => {
  await page.route('**/contact', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  )

  await test.step('Tablet Startseite ohne horizontalen Überlauf', async () => {
    await page.goto('/')
    const cookieButton = page.getByRole('button', { name: 'Nur notwendige' })
    if (await cookieButton.isVisible()) await cookieButton.click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mit gesunder Wärme leben')
    await expect(page.getByRole('button', { name: 'Menü umschalten' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Beratung vereinbaren' }).first()).toBeVisible()
    await revealAll(page)
    await expectNoHorizontalOverflow(page, 'home')
    await shot(page, 'home')
  })

  await test.step('Tablet Navigation zu Leistungen', async () => {
    await page.getByRole('button', { name: 'Menü umschalten' }).click()
    const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation' })
    await expect(mobileNav).toBeVisible()
    await mobileNav.getByRole('link', { name: 'Leistungen' }).click()
    await expect(page).toHaveURL(/leistungen/)
    await expect(page.getByRole('heading', { name: /Alles für Wärme und Raum/ })).toBeVisible()
    await revealAll(page)
    await expectNoHorizontalOverflow(page, 'services')
    await shot(page, 'services')
  })

  await test.step('Tablet Service-Detail', async () => {
    await page.getByRole('link', { name: /3D-Planung/ }).first().click()
    await expect(page).toHaveURL(/leistungen\/3d-planung/)
    await expect(page.getByRole('heading', { name: 'Ihre Vision in 3D' })).toBeVisible()
    await revealAll(page)
    await expectNoHorizontalOverflow(page, 'service detail')
    await shot(page, 'service-detail')
  })

  await test.step('Tablet Projektgalerie mit Lightbox', async () => {
    await page.goto('/projekte')
    await page.getByRole('button', { name: 'Kaminbau', exact: true }).click()
    await page.getByRole('button', { name: /Heizkamin mit Eckscheibe/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Heizkamin mit Eckscheibe' })
    await expect(dialog).toBeVisible()
    await expectNoHorizontalOverflow(page, 'project lightbox')
    await shot(page, 'project-lightbox')
    await page.getByRole('button', { name: 'Schließen' }).click()
  })

  await test.step('Tablet Kontaktformular', async () => {
    await page.goto('/kontakt')
    await expect(
      page.getByRole('heading', { name: /Lassen Sie uns über Ihr Projekt sprechen/ })
    ).toBeVisible()
    await page.getByLabel('Name').fill('Tablet Test')
    await page.getByLabel(/Telefon/).fill('012345 678900')
    await page.getByLabel('E-Mail').fill('tablet@example.com')
    await page
      .getByLabel('Nachricht')
      .fill('Bitte prüfen Sie die Beratung für einen Ofen im Wohnbereich.')
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: 'Nachricht senden' }).click()
    await expect(page.getByText('Vielen Dank!')).toBeVisible()
    await expectNoHorizontalOverflow(page, 'contact')
    await shot(page, 'contact-success')
  })
})

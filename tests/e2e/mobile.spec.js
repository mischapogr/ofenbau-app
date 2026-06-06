import { test, expect } from '@playwright/test'
import fs from 'node:fs'

/**
 * Mobile walkthrough — responsive layout + mobile navigation drawer.
 * Recorded (video + trace) like the desktop demo; screenshots under
 * `demo-artifacts/shots/mobile/`.
 */
const SHOTS = 'demo-artifacts/shots/mobile'
let step = 0
test.beforeAll(() => fs.mkdirSync(SHOTS, { recursive: true }))
async function shot(page, name) {
  step += 1
  await page.screenshot({ path: `${SHOTS}/${String(step).padStart(2, '0')}-${name}.png` })
}

test('Mobile — Layout & Navigation', async ({ page }) => {
  await test.step('Mobile Startseite', async () => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mit gesunder Wärme leben')
    await page.waitForTimeout(400)
    await shot(page, 'home')
  })

  await test.step('Mobiles Menü öffnen', async () => {
    await page.getByRole('button', { name: 'Menü umschalten' }).click()
    const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation' })
    await expect(mobileNav).toBeVisible()
    await page.waitForTimeout(400)
    await shot(page, 'menu-open')
  })

  await test.step('Über das Menü zu den Projekten', async () => {
    await page
      .getByRole('navigation', { name: 'Mobile Navigation' })
      .getByRole('link', { name: 'Projekte' })
      .click()
    await expect(page).toHaveURL(/projekte/)
    await page.waitForTimeout(400)
    await shot(page, 'projects')
  })

  await test.step('Mobiles Kontaktformular', async () => {
    await page.goto('/kontakt')
    await expect(page.getByRole('heading', { name: /Lassen Sie uns über Ihr Projekt sprechen/ })).toBeVisible()
    await page.waitForTimeout(400)
    await shot(page, 'kontakt')
  })
})

import { test, expect } from '@playwright/test'

/**
 * Assertion-focused checks for the planning explorer on /leistungen/3d-planung
 * (premium feature): turntable keyboard stepping, variant swap + active-choice
 * chips, x-ray toggle, fullscreen focus trap, reduced motion, and the glTF
 * stage (<model-viewer>) incl. per-part material switching.
 *
 * Runs in every Playwright project (desktop / Pixel 7 / tablet).
 */

const PAGE = '/leistungen/3d-planung'

async function acceptNecessaryCookies(page) {
  const button = page.getByRole('button', { name: 'Nur notwendige' })
  if (await button.isVisible().catch(() => false)) await button.click()
}

async function openExplorer(page) {
  await page.goto(PAGE)
  await acceptNecessaryCookies(page)
  const explorer = page.locator('[data-planning-explorer]')
  await explorer.scrollIntoViewIfNeeded()
  // The explorer is lazy-loaded near the viewport; wait for the real stage.
  const stage = page.getByRole('slider', { name: /Rundblick/ })
  await expect(stage).toBeVisible()
  return { explorer, stage }
}

test.describe('Planning explorer', () => {
  test('is lazy-loaded and the turntable steps with the keyboard', async ({ page }) => {
    const { explorer, stage } = await openExplorer(page)

    // Honest label: the arc is -60° … +60°, not "360°".
    await expect(explorer.getByRole('button', { name: /^Rundblick -60° bis \+60°$/ })).toBeVisible()
    await expect(explorer.getByText('360°')).toHaveCount(0)

    await expect(stage).toHaveAttribute('aria-valuenow', '0')
    await stage.focus()
    await page.keyboard.press('ArrowRight')
    await expect(stage).toHaveAttribute('aria-valuenow', '20')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(stage).toHaveAttribute('aria-valuenow', '-20')

    // Interaction warmed the frame set: every frame is now in the DOM.
    await expect(stage.locator('img')).toHaveCount(7)

    // The arc is clamped: stepping past the end stays at the end.
    for (let i = 0; i < 6; i += 1) await page.keyboard.press('ArrowLeft')
    await expect(stage).toHaveAttribute('aria-valuenow', '-60')
  })

  test('only the current frame is requested before any interaction', async ({ page }) => {
    await page.goto(PAGE)
    await acceptNecessaryCookies(page)
    // Hovering the stage also warms the frames (cheap intent signal), so park
    // the mouse away from where the stage scrolls in on desktop.
    await page.mouse.move(1, 1)
    await page.locator('[data-planning-explorer]').scrollIntoViewIfNeeded()
    const stage = page.getByRole('slider', { name: /Rundblick/ })
    await expect(stage).toBeVisible()
    await expect(stage.locator('img')).toHaveCount(1)
  })

  test('variant swap changes the stage image and shows active choices', async ({ page }) => {
    const { explorer } = await openExplorer(page)

    // Scope to the aside: "Material" is also a category chip on the stage.
    const aside = explorer.getByRole('complementary')
    await aside.getByRole('button', { name: 'Material', exact: true }).click()
    await aside.getByRole('button', { name: 'Naturstein', exact: true }).click()

    const stageImage = explorer.locator('img[alt*="Simulation: Material · Naturstein"]')
    await expect(stageImage).toBeVisible()
    await expect(stageImage).toHaveAttribute('src', /material-naturstein/)

    // Active-choice chip row + reset + budget hand-off.
    const chips = explorer.getByLabel('Aktive Auswahl')
    await expect(chips).toContainText('Material: Naturstein')
    const budget = explorer.getByRole('link', { name: /Budget schätzen/ })
    await expect(budget).toHaveAttribute(
      'href',
      /\/leistungen\?typ=kachelofen&material=premium#budget-kalkulator/
    )

    await chips.getByRole('button', { name: 'Zurücksetzen' }).click()
    await expect(chips).toHaveCount(0)
    await expect(page.getByRole('slider', { name: /Rundblick/ })).toBeVisible()
  })

  test('budget hand-off prefills the estimator', async ({ page }) => {
    await page.goto('/leistungen?typ=kachelofen&form=corner&material=premium#budget-kalkulator')
    await acceptNecessaryCookies(page)
    await expect(page.getByText('Schritt 2 / 4')).toBeVisible()
    await expect(page.getByText('Premium-Ausführung', { exact: false }).first()).toBeVisible()
  })

  test('x-ray toggle shows the cutaway and its layers', async ({ page }) => {
    const { explorer } = await openExplorer(page)

    // The first example labels its cutaway "Innenaufbau".
    const xray = explorer.getByRole('button', { name: /Innenaufbau/ })
    await xray.click()
    await expect(xray).toHaveAttribute('aria-pressed', 'true')
    await expect(explorer.locator('img[alt*="Innenaufbau"]')).toHaveAttribute(
      'src',
      /planning-cutaway-kachelofen/
    )
    await expect(explorer.getByText('Schamotte-Feuerraum', { exact: false }).first()).toBeVisible()

    await xray.click()
    await expect(xray).toHaveAttribute('aria-pressed', 'false')
    await expect(page.getByRole('slider', { name: /Rundblick/ })).toBeVisible()
  })

  test('fullscreen traps focus and closes with Escape', async ({ page }) => {
    const { explorer } = await openExplorer(page)

    const open = explorer.getByRole('button', { name: '3D-Entwurf vergrößern' })
    await open.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'Schließen' })).toBeFocused()

    // Tab cycles within the dialog only.
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(dialog.getByRole('button', { name: 'Schließen' })).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(dialog.getByRole('button', { name: 'Nächste Ansicht' })).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(open).toBeFocused()
  })

  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const { explorer } = await openExplorer(page)
    await expect(explorer.getByRole('button', { name: 'Rundgang' })).toHaveCount(0)
  })

  test('loads the glTF model and switches materials per part', async ({ page }) => {
    const errors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    const { explorer } = await openExplorer(page)
    const button = explorer.getByRole('button', { name: '3D-Modell' })
    await expect(button).toBeVisible()
    await button.click()

    const viewer = explorer.locator('model-viewer')
    await expect(viewer).toBeVisible()
    // The library is imported and the model loads only once this stage opens.
    await page.waitForFunction(() => document.querySelector('model-viewer')?.loaded, null, {
      timeout: 30_000,
    })
    const partNames = await viewer.evaluate((el) => el.model.materials.map((m) => m.name))
    expect(partNames).toEqual(
      expect.arrayContaining(['Kacheln', 'Sims', 'Auflage', 'Sockel', 'Rahmen', 'Putz', 'Glas'])
    )
    const baseColor = (part) =>
      viewer.evaluate(
        (el, name) => el.model.getMaterialByName(name).pbrMetallicRoughness.baseColorFactor,
        part
      )

    // Preset: every part changes at once.
    await explorer.getByRole('button', { name: 'Modern', exact: true }).click()
    await expect.poll(() => baseColor('Kacheln')).toEqual([0.16, 0.16, 0.17, 1])
    await expect.poll(() => baseColor('Rahmen')).toEqual([0.75, 0.75, 0.75, 1])

    // Per-part choice: only the chosen part changes, the preset is no longer active.
    await explorer.getByRole('button', { name: 'Bauteile anpassen' }).click()
    await explorer
      .getByRole('group', { name: 'Kacheln' })
      .getByRole('button', { name: 'Terrakotta' })
      .click()
    await expect.poll(() => baseColor('Kacheln')).toEqual([0.72, 0.4, 0.26, 1])
    await expect.poll(() => baseColor('Rahmen')).toEqual([0.75, 0.75, 0.75, 1])
    await expect(explorer.getByRole('button', { name: 'Modern', exact: true })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
    await expect(explorer.getByTestId('model-summary')).toContainText('Terrakotta')

    // Fire toggle drives the emissive factor of the embers.
    await explorer.getByRole('button', { name: 'Feuer an' }).click()
    await expect
      .poll(() => viewer.evaluate((el) => el.model.getMaterialByName('Glut').emissiveFactor))
      .toEqual([1, 0.38, 0.08])

    await expect(explorer.getByRole('button', { name: 'Detail: Sichtscheibe' })).toBeVisible()
    expect(errors.filter((text) => /gltf|glb|three|model-viewer/i.test(text))).toEqual([])
  })
})

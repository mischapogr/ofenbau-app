#!/usr/bin/env node
/**
 * Captures the README screenshots into docs/screenshots/ (WebP) and the GitHub
 * social preview (docs/social-preview.png). The public demos are gated per
 * customer, so the README has to show the product through these images.
 *
 *   npm run screenshots
 *
 * Starts its own Vite dev server (Premium tier) on a free port, drives
 * Playwright's Chromium (software WebGL is enough for the 3D stage), and builds
 * an animated turntable preview from the rendered Modern-preset frames with ffmpeg.
 */
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, devices } from '@playwright/test'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'docs/screenshots')
const PORT = 5195
const BASE = `http://localhost:${PORT}`
mkdirSync(outDir, { recursive: true })

async function waitForServer(url, ms = 60_000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`dev server did not start: ${url}`)
}

async function saveWebp(buffer, name, width = 1280) {
  const file = resolve(outDir, `${name}.webp`)
  await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file)
  console.log(`  ${name}.webp  ${Math.round(statSync(file).size / 1024)} KB`)
}

async function dismissCookies(page) {
  // The banner slides in after a short delay.
  const button = page.getByRole('button', { name: 'Nur notwendige' })
  await button.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
  if (await button.isVisible().catch(() => false)) {
    await button.click()
    await button.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
  }
}

// Crop targets: the dark explorer box and the calculator card (no headings/margins).
const explorerBox = (explorer) => explorer.locator('.rounded-2xl.bg-ink-950').first()

// Section shots: hide the fixed site header so it doesn't overlay the section.
const hideHeader = (page) =>
  page.addStyleTag({ content: 'header { visibility: hidden !important; }' })

async function openExplorer(page) {
  await page.goto(`${BASE}/leistungen/3d-planung`, { waitUntil: 'networkidle' })
  await dismissCookies(page)
  await hideHeader(page)
  const explorer = page.locator('[data-planning-explorer]')
  await explorer.scrollIntoViewIfNeeded()
  await page.getByRole('slider', { name: /Rundblick/ }).waitFor({ timeout: 30_000 })
  return explorer
}

const server = spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], {
  cwd: root,
  env: { ...process.env, VITE_TIER: 'premium' },
  stdio: 'ignore',
})

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
try {
  await waitForServer(BASE)
  const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }

  // 1. Home hero
  {
    const page = await browser.newPage(desktop)
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await dismissCookies(page)
    await page.evaluate(() => document.fonts.ready)
    await saveWebp(await page.screenshot(), 'home')
    await page.close()
  }

  // 2. Rendered 360° turntable, Modern preset, 30°
  {
    const page = await browser.newPage(desktop)
    const explorer = await openExplorer(page)
    await explorer
      .getByRole('group', { name: 'Stil des Rundblicks' })
      .getByRole('button', { name: 'Modern' })
      .click()
    const stage = page.getByRole('slider', { name: /Rundblick/ })
    await stage.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.mouse.move(0, 0)
    await page.waitForTimeout(800)
    await saveWebp(await explorerBox(explorer).screenshot(), 'explorer-turntable')
    await page.close()
  }

  // 3. Real 3D model with the per-part material panel open (Natur preset)
  {
    const page = await browser.newPage(desktop)
    const explorer = await openExplorer(page)
    await explorer.getByRole('button', { name: '3D-Modell' }).click()
    await page.waitForFunction(() => document.querySelector('model-viewer')?.loaded, null, {
      timeout: 60_000,
    })
    await explorer.getByRole('button', { name: 'Natur', exact: true }).last().click()
    await explorer.getByRole('button', { name: 'Bauteile anpassen' }).click()
    await explorer.getByRole('button', { name: 'Feuer an' }).click()
    await page.locator('model-viewer').evaluate((el) => {
      el.autoRotate = false
      el.cameraOrbit = '28deg 74deg 6.2m'
      el.cameraTarget = '-0.4m 1.45m 0m' // stove sits below the material panel
      el.jumpCameraToGoal()
    })
    await page.waitForTimeout(1500)
    await saveWebp(await explorerBox(explorer).screenshot(), 'explorer-3d-model')
    await page.close()
  }

  // 4. Interactive calculators (budget estimator)
  {
    const page = await browser.newPage(desktop)
    await page.goto(`${BASE}/leistungen#budget-kalkulator`, { waitUntil: 'networkidle' })
    await dismissCookies(page)
    await hideHeader(page)
    const section = page.locator('#budget-kalkulator')
    await section.scrollIntoViewIfNeeded()
    await section.getByText('Kachelofen / Grundofen').first().click()
    await page.waitForTimeout(800)
    await saveWebp(await section.locator('.rounded-2xl').first().screenshot(), 'calculator')
    await page.close()
  }

  // 5. Mobile
  {
    const page = await browser.newPage({ ...devices['Pixel 7'] })
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await dismissCookies(page)
    await page.evaluate(() => document.fonts.ready)
    await saveWebp(await page.screenshot(), 'mobile', 540)
    await page.close()
  }

  // 6. Animated turntable preview from the rendered frames (Modern preset)
  {
    const framesDir = resolve(root, 'public/images/planning-frames/kachelofen-eckscheibe')
    const tmp = resolve(root, '_tmp/turntable-anim')
    rmSync(tmp, { recursive: true, force: true })
    mkdirSync(tmp, { recursive: true })
    const angles = Array.from({ length: 24 }, (_, i) => -165 + i * 15)
    // Start at 0° (front corner) and go once around.
    const order = [...angles.slice(11), ...angles.slice(0, 11)]
    for (const [i, angle] of order.entries()) {
      const src = resolve(framesDir, `turntable-modern-${String(angle).replace('-', 'm')}.webp`)
      await sharp(readFileSync(src))
        .resize({ width: 720 })
        .png()
        .toFile(resolve(tmp, `f${String(i).padStart(2, '0')}.png`))
    }
    const out = resolve(outDir, 'turntable.webp')
    execFileSync(
      'ffmpeg',
      [
        '-y',
        '-loglevel',
        'error',
        '-framerate',
        '8',
        '-i',
        resolve(tmp, 'f%02d.png'),
        '-loop',
        '0',
        '-c:v',
        'libwebp_anim',
        '-quality',
        '72',
        '-compression_level',
        '6',
        out,
      ],
      { stdio: 'inherit' }
    )
    rmSync(tmp, { recursive: true, force: true })
    console.log(`  turntable.webp  ${Math.round(statSync(out).size / 1024)} KB (animated)`)
  }

  // 7. Social preview 1280×640 for the GitHub repo settings
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 640 } })
    const frame = readFileSync(
      resolve(root, 'public/images/planning-frames/kachelofen-eckscheibe/turntable-natur-0.webp')
    ).toString('base64')
    await page.goto(BASE, { waitUntil: 'networkidle' }) // loads the self-hosted fonts
    await page.setContent(`<!doctype html><html><head><style>
      ${readFileSync(resolve(root, 'src/styles/fonts.css'), 'utf8').replaceAll("url('@", `url('${BASE}/node_modules/@`)}
      body{margin:0;width:1280px;height:640px;display:flex;background:#181412;color:#faf6f1;font-family:'Inter Variable',sans-serif}
      .text{flex:1;padding:64px 0 64px 72px;display:flex;flex-direction:column;justify-content:center;gap:22px}
      .eyebrow{font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:.14em;color:#e35205;font-size:20px}
      h1{font-family:'Fraunces Variable',serif;font-size:62px;line-height:1.05;margin:0}
      p{font-size:26px;line-height:1.4;color:#d8cfc6;margin:0}
      .tags{display:flex;gap:10px;flex-wrap:wrap}.tags span{border:1px solid #5a4d44;border-radius:999px;padding:6px 14px;font-size:18px;color:#d8cfc6}
      img{width:640px;height:640px;object-fit:cover}
    </style></head><body><div class="text"><div class="eyebrow">Open Source · MIT</div>
      <h1>Website-Vorlage für Handwerks&shy;betriebe</h1>
      <p>Vue 3 · 3D-Planung mit 360°-Rundblick · Konfigurator · Cloudflare</p>
      <div class="tags"><span>Kachelofen</span><span>Kamin</span><span>Fliesen</span></div></div>
      <img src="data:image/webp;base64,${frame}"></body></html>`)
    await page.evaluate(() => document.fonts.ready)
    const file = resolve(root, 'docs/social-preview.png')
    writeFileSync(
      file,
      await sharp(await page.screenshot())
        .png({ compressionLevel: 9 })
        .toBuffer()
    )
    console.log(`  social-preview.png  ${Math.round(statSync(file).size / 1024)} KB`)
    await page.close()
  }
} finally {
  await browser.close()
  server.kill()
}

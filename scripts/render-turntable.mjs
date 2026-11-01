#!/usr/bin/env node
/**
 * Renders a true 360° turntable from the stove model for the explorer's
 * "Rundblick" stage: 24 frames (15° steps, -165° … +180°) of
 * public/models/kachelofen-eckscheibe.glb, written as WebP to
 * public/images/planning-frames/kachelofen-eckscheibe/turntable-<angle>.webp.
 *
 * Frames come from the same geometry, so neighbouring angles always match —
 * unlike the AI-generated stills this replaces. Re-run after `npm run gen:model`.
 * Uses Playwright's Chromium (software WebGL is fine) and the bundled
 * <model-viewer>; no network access needed.
 *
 *   node scripts/render-turntable.mjs        # npm run gen:turntable
 */
import { Buffer } from 'node:buffer'
import { createServer } from 'node:http'
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/images/planning-frames/kachelofen-eckscheibe')
const WIDTH = 1280
const HEIGHT = 800 // 16:10, same geometry as the photo stage
const STEP = 15
const ANGLES = Array.from({ length: 360 / STEP }, (_, i) => -165 + i * STEP)
const BACKGROUND = ['#2a2420', '#120f0d'] // radial studio gradient (warm ink)

const files = {
  '/model-viewer.js': resolve(root, 'node_modules/@google/model-viewer/dist/model-viewer.min.js'),
  '/model.glb': resolve(root, 'public/models/kachelofen-eckscheibe.glb'),
}
const page = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#000}model-viewer{width:${WIDTH}px;height:${HEIGHT}px;display:block}</style>
<script type="module" src="/model-viewer.js"></script></head><body>
<model-viewer id="mv" src="/model.glb" interaction-prompt="none" shadow-intensity="1.1" shadow-softness="0.8"
  exposure="1" tone-mapping="neutral" camera-target="-0.45m 0.85m 0m" field-of-view="28deg"
  camera-orbit="0deg 74deg 4.6m"></model-viewer></body></html>`
const types = { '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.html': 'text/html' }

const server = createServer((req, res) => {
  const path = req.url.split('?')[0]
  if (path === '/') return res.writeHead(200, { 'content-type': types['.html'] }).end(page)
  const file = files[path]
  if (!file) return res.writeHead(404).end()
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' })
  res.end(readFileSync(file))
})
await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const base = `http://127.0.0.1:${server.address().port}`

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
try {
  const tab = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } })
  await tab.goto(base)
  await tab.waitForFunction(() => document.querySelector('#mv')?.loaded, null, { timeout: 60_000 })
  // Studio look: fire on (embers + warm glass), default "Landhaus" materials.
  await tab.evaluate(() => {
    const model = document.querySelector('#mv').model
    model.getMaterialByName('Glut')?.setEmissiveFactor([1, 0.38, 0.08])
    model.getMaterialByName('Glas')?.setEmissiveFactor([0.18, 0.06, 0.01])
  })

  for (const name of readdirSync(outDir)) {
    if (name.startsWith('turntable-')) rmSync(resolve(outDir, name))
  }
  mkdirSync(outDir, { recursive: true })

  let total = 0
  for (const angle of ANGLES) {
    const dataUrl = await tab.evaluate(
      async ({ angle, background, width, height }) => {
        const mv = document.querySelector('#mv')
        // model-viewer's theta is measured from +z; the stove's glass corner
        // faces +x/+z, so 45° looks straight at the corner at angle 0.
        mv.cameraOrbit = `${45 + angle}deg 74deg 4.6m`
        mv.jumpCameraToGoal()
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        await mv.updateComplete
        const png = await mv.toBlob({ mimeType: 'image/png' })
        const bitmap = await createImageBitmap(png)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        const g = ctx.createRadialGradient(
          width / 2,
          height * 0.45,
          40,
          width / 2,
          height / 2,
          width * 0.7
        )
        g.addColorStop(0, background[0])
        g.addColorStop(1, background[1])
        ctx.fillStyle = g
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(bitmap, 0, 0, width, height)
        return canvas.toDataURL('image/webp', 0.82)
      },
      { angle, background: BACKGROUND, width: WIDTH, height: HEIGHT }
    )
    const bytes = Buffer.from(dataUrl.split(',')[1], 'base64')
    const name = `turntable-${String(angle).replace('-', 'm')}.webp`
    writeFileSync(resolve(outDir, name), bytes)
    total += bytes.length
  }
  console.log(
    `wrote ${ANGLES.length} frames to ${outDir} (${Math.round(total / 1024)} KB total, ${WIDTH}x${HEIGHT})`
  )
  console.log(
    ANGLES.map(
      (angle) =>
        `      { angle: ${angle}, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-${String(angle).replace('-', 'm')}.webp' },`
    ).join('\n')
  )
} finally {
  await browser.close()
  server.close()
}

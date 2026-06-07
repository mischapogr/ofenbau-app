#!/usr/bin/env node
/**
 * convert-videos.mjs — converts the recorded Playwright demo videos from
 * .webm (VP8) to .mp4 (H.264 + yuv420p, faststart) for easy sharing with the
 * customer. Uses the bundled ffmpeg-static binary (no system ffmpeg needed).
 *
 * Run: npm run demo:mp4   (after `npm run test:e2e`)
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import ffmpegPath from 'ffmpeg-static'

const ROOT = 'demo-artifacts'

if (!existsSync(ROOT)) {
  console.error(`No ${ROOT}/ found — run "npm run test:e2e" first.`)
  process.exit(1)
}

function walk(dir) {
  let out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out = out.concat(walk(p))
    else if (entry.name.endsWith('.webm')) out.push(p)
  }
  return out
}

const webms = walk(ROOT)
if (!webms.length) {
  console.error(`No .webm videos under ${ROOT}/ — run "npm run test:e2e" first.`)
  process.exit(1)
}

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(1) + ' MB'

for (const src of webms) {
  const label = /tablet/i.test(src) ? 'tablet' : /mobile/i.test(src) ? 'mobile' : 'desktop'
  const out = join(ROOT, `walkthrough-${label}.mp4`)
  process.stdout.write(`Converting ${src} (${mb(src)}) -> ${out} … `)
  execFileSync(
    ffmpegPath,
    [
      '-y',
      '-i', src,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      out,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] }
  )
  console.log(`done (${mb(out)})`)
}

console.log('\nMP4s ready in demo-artifacts/:')
for (const label of ['desktop', 'mobile', 'tablet']) {
  const p = join(ROOT, `walkthrough-${label}.mp4`)
  if (existsSync(p)) console.log(`  • ${p}  (${mb(p)})`)
}

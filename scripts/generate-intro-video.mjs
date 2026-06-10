#!/usr/bin/env node
/**
 * generate-intro-video.mjs — renders the homepage intro video as a Ken-Burns
 * montage over existing site imagery (no external footage needed). Outputs
 * public/videos/intro.webm (VP9), intro.mp4 (H.264) and intro-poster.webp.
 * Uses the bundled ffmpeg-static binary (no system ffmpeg needed).
 *
 * Run: npm run gen:video   (re-run only when SEGMENTS change — keeps git churn low)
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import ffmpegPath from 'ffmpeg-static'

const SEGMENTS = [
  { src: 'public/images/hero.webp', dur: 4.0, zoom: 'in' },
  { src: 'public/images/project-2-heizkamin-panorama.webp', dur: 3.5, zoom: 'out' },
  { src: 'public/images/planning-3d-before.webp', dur: 3.0, zoom: 'in' },
  { src: 'public/images/planning-3d-after.webp', dur: 3.5, zoom: 'out' },
  { src: 'public/images/planning-example-kachelofen-eckscheibe.webp', dur: 4.0, zoom: 'in' },
]
const FPS = 30
const FADE = 0.8
const W = 1920
const H = 1080
// Pre-upscale before zoompan to avoid integer-pixel jitter.
const UPSCALE_W = 4800
const UPSCALE_H = 2700
const ZOOM_MAX = 1.14
const OUT_DIR = 'public/videos'
const MP4_WARN_MB = 5

const missing = SEGMENTS.filter((s) => !existsSync(s.src))
if (missing.length) {
  console.error('Missing source images:\n' + missing.map((s) => `  • ${s.src}`).join('\n'))
  process.exit(1)
}

mkdirSync(OUT_DIR, { recursive: true })
const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(1) + ' MB'

const inputs = SEGMENTS.flatMap((s) => ['-i', s.src])

const chains = []
SEGMENTS.forEach((s, i) => {
  const frames = Math.round(s.dur * FPS)
  const step = (ZOOM_MAX - 1) / frames
  const zoomExpr =
    s.zoom === 'in'
      ? `min(zoom+${step.toFixed(5)},${ZOOM_MAX})`
      : `if(eq(on,1),${ZOOM_MAX},max(zoom-${step.toFixed(5)},1.0))`
  chains.push(
    `[${i}:v]scale=${UPSCALE_W}:-2,crop=${UPSCALE_W}:${UPSCALE_H}:0:'max(0,(ih-${UPSCALE_H})/2)',` +
      `zoompan=z='${zoomExpr}':d=${frames}:x='iw/2-(iw/zoom)/2':y='ih/2-(ih/zoom)/2':s=${W}x${H}:fps=${FPS},` +
      `format=yuv420p,settb=AVTB[v${i}]`
  )
})

// Chain crossfades; each xfade offset = effective length of everything before it.
let label = 'v0'
let elapsed = SEGMENTS[0].dur
SEGMENTS.slice(1).forEach((s, idx) => {
  const i = idx + 1
  const out = i === SEGMENTS.length - 1 ? 'vout' : `x${i}`
  const offset = (elapsed - FADE).toFixed(2)
  chains.push(`[${label}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset}[${out}]`)
  elapsed = elapsed - FADE + s.dur
  label = out
})

const filtergraph = chains.join(';')
const intermediate = join(tmpdir(), `ofenbau-intro-${process.pid}.mp4`)

console.log(`Rendering ${elapsed.toFixed(1)}s montage (${SEGMENTS.length} segments) …`)
execFileSync(
  ffmpegPath,
  ['-y', ...inputs, '-filter_complex', filtergraph, '-map', '[vout]',
    '-c:v', 'libx264', '-crf', '16', '-preset', 'veryfast', '-an', intermediate],
  { stdio: ['ignore', 'ignore', 'inherit'] }
)

const targets = [
  {
    out: join(OUT_DIR, 'intro.webm'),
    args: ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', '-an'],
  },
  {
    out: join(OUT_DIR, 'intro.mp4'),
    args: ['-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', '-an'],
  },
  {
    out: join(OUT_DIR, 'intro-poster.webp'),
    args: ['-frames:v', '1', '-c:v', 'libwebp', '-quality', '80'],
  },
]

for (const { out, args } of targets) {
  process.stdout.write(`Encoding ${out} … `)
  execFileSync(ffmpegPath, ['-y', '-i', intermediate, ...args, out], {
    stdio: ['ignore', 'ignore', 'ignore'],
  })
  console.log(`done (${mb(out)})`)
}

rmSync(intermediate, { force: true })

const mp4Mb = statSync(join(OUT_DIR, 'intro.mp4')).size / 1024 / 1024
if (mp4Mb > MP4_WARN_MB) {
  console.warn(
    `\n⚠ intro.mp4 is ${mp4Mb.toFixed(1)} MB (> ${MP4_WARN_MB} MB) — consider rendering at 1280x720.`
  )
}
console.log('\nIntro video ready in public/videos/.')

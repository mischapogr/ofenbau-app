#!/usr/bin/env node
/**
 * generate-images.mjs — generates on-brand SVG scene illustrations for every
 * imagery slot in public/images/manifest.json, derived from the "Ofenbau
 * Mustermann" design system (warm light hearth palette).
 *
 * These are stylized, anonymized illustrations (no people, no real places) that
 * stand in for the photography described in public/images/PROMPTS.md. Replace any
 * <id>.svg with a real <id>.jpg photo to upgrade a slot — BaseImage picks up
 * whatever `image` path the data points at.
 *
 * Run: node scripts/generate-images.mjs
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/images')

// Warm "hearth" palette (mirrors src/styles/tokens.css).
const C = {
  wall: '#f3ece3',
  wallTop: '#faf6f1',
  floor: '#d8c3a4',
  floorDark: '#c6ac84',
  stone: '#e9dfd1',
  stoneEdge: '#d3c4ad',
  steel: '#2a2522',
  fireDark: '#231b16',
  glow: '#e35205',
  glow2: '#f6a23a',
  glow3: '#ffd27a',
  logs: '#9b6b3f',
  logsDark: '#7c5230',
  ink: '#1c1816',
  inkSoft: '#6b635e',
  line: '#b9aa98',
  paper: '#ffffff',
  pin: '#e35205',
  tile: '#ece3d6',
  tileAlt: '#e2d6c4',
  grout: '#cdbfa9',
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// --- scene helpers --------------------------------------------------------
function backdrop(w, h, floorRatio = 0.72) {
  const fy = Math.round(h * floorRatio)
  return `
  <rect width="${w}" height="${h}" fill="url(#wall)"/>
  <rect y="${fy}" width="${w}" height="${h - fy}" fill="url(#floor)"/>
  <rect y="${fy - 2}" width="${w}" height="3" fill="${C.stoneEdge}" opacity="0.5"/>`
}

function flames(cx, baseY, s = 1) {
  // layered ember flames
  return `
  <g opacity="0.96">
    <path d="M${cx} ${baseY} C ${cx - 26 * s} ${baseY - 34 * s}, ${cx - 18 * s} ${baseY - 60 * s}, ${cx} ${baseY - 78 * s}
            C ${cx + 20 * s} ${baseY - 58 * s}, ${cx + 26 * s} ${baseY - 30 * s}, ${cx} ${baseY} Z" fill="${C.glow}"/>
    <path d="M${cx} ${baseY} C ${cx - 16 * s} ${baseY - 24 * s}, ${cx - 11 * s} ${baseY - 44 * s}, ${cx} ${baseY - 58 * s}
            C ${cx + 13 * s} ${baseY - 42 * s}, ${cx + 16 * s} ${baseY - 22 * s}, ${cx} ${baseY} Z" fill="${C.glow2}"/>
    <path d="M${cx} ${baseY} C ${cx - 8 * s} ${baseY - 14 * s}, ${cx - 6 * s} ${baseY - 28 * s}, ${cx} ${baseY - 38 * s}
            C ${cx + 7 * s} ${baseY - 26 * s}, ${cx + 8 * s} ${baseY - 13 * s}, ${cx} ${baseY} Z" fill="${C.glow3}"/>
  </g>`
}

function logs(x, y, w) {
  let g = `<g>`
  const n = 3
  for (let i = 0; i < n; i++) {
    const lx = x + (i * w) / n
    g += `<ellipse cx="${lx + w / (2 * n)}" cy="${y}" rx="${w / (2 * n) - 3}" ry="9" fill="${C.logs}"/>
          <ellipse cx="${lx + w / (2 * n)}" cy="${y}" rx="${w / (2 * n) - 9}" ry="5" fill="${C.logsDark}"/>`
  }
  return g + `</g>`
}

// --- subject templates ----------------------------------------------------
function stove(w, h, { steel = false, bench = false } = {}) {
  const bodyW = Math.round(w * (steel ? 0.32 : 0.46))
  const bodyH = Math.round(h * (steel ? 0.6 : 0.66))
  const bx = Math.round(w / 2 - bodyW / 2)
  const by = Math.round(h * 0.72 - bodyH)
  const body = steel ? C.steel : C.stone
  const fbW = Math.round(bodyW * (steel ? 0.6 : 0.5))
  const fbH = Math.round(bodyH * (steel ? 0.42 : 0.4))
  const fbx = Math.round(w / 2 - fbW / 2)
  const fby = by + Math.round(bodyH * 0.16)
  let extra = ''
  if (bench)
    extra = `<rect x="${bx + bodyW - 6}" y="${by + bodyH * 0.55}" width="${bodyW * 0.7}" height="${bodyH * 0.45}" rx="6" fill="${C.stone}" stroke="${C.stoneEdge}"/>`
  return `
  <g>
    ${extra}
    <rect x="${bx}" y="${by}" width="${bodyW}" height="${bodyH}" rx="${steel ? bodyW / 2 : 10}" fill="${body}" stroke="${steel ? '#161310' : C.stoneEdge}" stroke-width="2"/>
    <rect x="${fbx}" y="${fby}" width="${fbW}" height="${fbH}" rx="6" fill="${C.fireDark}"/>
    <ellipse cx="${w / 2}" cy="${fby + fbH - 8}" rx="${fbW * 0.6}" ry="${fbH * 0.5}" fill="${C.glow}" opacity="0.45"/>
    ${flames(w / 2, fby + fbH - 10, Math.max(0.8, fbW / 70))}
    ${logs(fbx + 8, fby + fbH - 6, fbW - 16)}
  </g>`
}

function tileScene(w, h, { bath = false } = {}) {
  const cols = 4
  const rows = Math.round((cols * h) / w) + 1
  const gw = Math.round(w / cols)
  const gh = Math.round((h * 0.72) / rows)
  let cells = ''
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const fill = (r + c) % 2 ? C.tileAlt : C.tile
      cells += `<rect x="${c * gw + 4}" y="${r * gh + 4}" width="${gw - 8}" height="${gh - 8}" rx="3" fill="${fill}" stroke="${C.grout}" stroke-width="1.5"/>`
    }
  let fixture = ''
  if (bath) {
    fixture = `
    <circle cx="${w * 0.5}" cy="${h * 0.34}" r="${Math.min(w, h) * 0.13}" fill="none" stroke="${C.inkSoft}" stroke-width="3" opacity="0.55"/>
    <rect x="${w * 0.32}" y="${h * 0.62}" width="${w * 0.36}" height="${h * 0.06}" rx="6" fill="${C.logs}" opacity="0.5"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.6}" rx="${w * 0.09}" ry="${h * 0.025}" fill="#fff" opacity="0.85"/>`
  }
  return `<g>${cells}${fixture}</g>`
}

function wireframe(w, h) {
  const s = `stroke="${C.line}" stroke-width="2.5" fill="none" stroke-linejoin="round"`
  const x = w * 0.28,
    y = h * 0.24,
    bw = w * 0.34,
    bh = h * 0.5,
    d = w * 0.12
  return `
  <g ${s}>
    <rect x="${x}" y="${y}" width="${bw}" height="${bh}"/>
    <path d="M${x} ${y} l${d} ${-d * 0.7} h${bw} l${-d} ${d * 0.7}"/>
    <path d="M${x + bw} ${y} l${d} ${-d * 0.7} v${bh} l${-d} ${d * 0.7}"/>
    <line x1="${x + bw}" y1="${y + bh}" x2="${x + bw + d}" y2="${y + bh - d * 0.7}"/>
    <rect x="${x + bw * 0.22}" y="${y + bh * 0.3}" width="${bw * 0.56}" height="${bh * 0.4}"/>
    <line x1="${x - 10}" y1="${y + bh}" x2="${x + bw + d + 10}" y2="${y + bh}"/>
  </g>`
}

function mapScene(w, h) {
  let roads = ''
  for (let i = 1; i < 6; i++)
    roads += `<line x1="0" y1="${(i * h) / 6}" x2="${w}" y2="${(i * h) / 6 + 18}" stroke="#fff" stroke-width="7" opacity="0.9"/>`
  for (let i = 1; i < 8; i++)
    roads += `<line x1="${(i * w) / 8}" y1="0" x2="${(i * w) / 8 - 14}" y2="${h}" stroke="#fff" stroke-width="6" opacity="0.85"/>`
  const parks = `<rect x="${w * 0.12}" y="${h * 0.55}" width="${w * 0.16}" height="${h * 0.18}" rx="8" fill="#cdbfa0" opacity="0.7"/>
    <rect x="${w * 0.62}" y="${h * 0.2}" width="${w * 0.2}" height="${h * 0.16}" rx="8" fill="#cdbfa0" opacity="0.7"/>`
  const px = w * 0.5,
    py = h * 0.46,
    r = Math.min(w, h) * 0.07
  const pin = `
    <path d="M${px} ${py + r * 2.4} C ${px - r * 1.3} ${py + r * 0.6}, ${px - r} ${py - r}, ${px} ${py - r}
            C ${px + r} ${py - r}, ${px + r * 1.3} ${py + r * 0.6}, ${px} ${py + r * 2.4} Z" fill="${C.pin}"/>
    <circle cx="${px}" cy="${py - r * 0.05}" r="${r * 0.42}" fill="#fff"/>`
  return `<g>${roads}${parks}${pin}</g>`
}

function craftScene(w, h) {
  // abstract: a tile being set with a trowel + mortar ridges (no people)
  const tx = w * 0.28,
    ty = h * 0.3,
    tw = w * 0.44,
    th = h * 0.32
  let ridges = ''
  for (let i = 0; i < 6; i++)
    ridges += `<path d="M${tx} ${ty + th + 14 + i * 9} q ${tw / 2} 10 ${tw} 0" stroke="${C.logs}" stroke-width="3" fill="none" opacity="0.5"/>`
  return `
  <g>
    ${ridges}
    <rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="4" fill="${C.tile}" stroke="${C.grout}" stroke-width="2"/>
    <g transform="rotate(-24 ${w * 0.62} ${h * 0.22})">
      <rect x="${w * 0.5}" y="${h * 0.16}" width="${w * 0.22}" height="${h * 0.1}" rx="4" fill="${C.steel}"/>
      <rect x="${w * 0.7}" y="${h * 0.18}" width="${w * 0.12}" height="${h * 0.05}" rx="3" fill="${C.logsDark}"/>
    </g>
  </g>`
}

const TEMPLATES = {
  stove: (w, h) => stove(w, h),
  steel: (w, h) => stove(w, h, { steel: true }),
  stoveBench: (w, h) => stove(w, h, { bench: true }),
  stoveWide: (w, h) => stove(w, h),
  render: (w, h) => `<rect width="${w}" height="${h}" fill="#fbf8f4"/>${stove(w, h)}`,
  tile: (w, h) => tileScene(w, h),
  tileBath: (w, h) => tileScene(w, h, { bath: true }),
  wire: (w, h) => `<rect width="${w}" height="${h}" fill="${C.paper}"/>${wireframe(w, h)}`,
  map: (w, h) => `<rect width="${w}" height="${h}" fill="${C.wall}"/>${mapScene(w, h)}`,
  craft: (w, h) => craftScene(w, h),
}
const FLAT = new Set(['render', 'wire', 'map']) // templates that paint their own bg

const ITEMS = [
  { id: 'hero', t: 'stove', w: 1600, h: 1000, cap: 'Kachel- & Kaminofenbau' },
  { id: 'service-kachelofen', t: 'stove', w: 1000, h: 1250, cap: 'Kachelöfen & Kaminbau' },
  { id: 'service-fliesen', t: 'tile', w: 1000, h: 1250, cap: 'Fliesenarbeiten' },
  { id: 'service-3d-planung', t: 'render', w: 1000, h: 1250, cap: '3D-Planung' },
  { id: 'project-1-kachelofen-landhaus', t: 'stove', w: 900, h: 1200, cap: 'Kachelofen Landhaus' },
  { id: 'project-2-heizkamin-panorama', t: 'stoveWide', w: 1200, h: 800, cap: 'Heizkamin Panorama' },
  { id: 'project-3-kachelofen-sitzbank', t: 'stoveBench', w: 900, h: 1200, cap: 'Kachelofen mit Sitzbank' },
  { id: 'project-4-wohnraum-fliesen-xxl', t: 'tile', w: 1200, h: 800, cap: 'Wohnraum-Fliesen XXL' },
  { id: 'project-5-kaminofen-stahl', t: 'steel', w: 900, h: 1200, cap: 'Kaminofen Stahl' },
  { id: 'project-6-bad-naturstein', t: 'tileBath', w: 1200, h: 800, cap: 'Bad in Naturstein' },
  { id: 'project-7-grundofen-eck', t: 'stove', w: 900, h: 1200, cap: 'Grundofen Eck' },
  { id: 'project-8-kaminofen-speckstein', t: 'steel', w: 900, h: 1200, cap: 'Kaminofen Speckstein' },
  { id: 'about-craft', t: 'craft', w: 1000, h: 1250, cap: 'Handwerk in Arbeit' },
  { id: 'planning-3d-before', t: 'wire', w: 1200, h: 900, cap: '3D-Skizze' },
  { id: 'planning-3d-after', t: 'render', w: 1200, h: 900, cap: 'Fertiges Projekt' },
  { id: 'contact-map', t: 'map', w: 1600, h: 1000, cap: 'Musterstadt & Umgebung' },
]

function svg({ t, w, h, cap }) {
  const subject = TEMPLATES[t](w, h)
  const bg = FLAT.has(t) ? '' : backdrop(w, h)
  const capW = Math.min(w * 0.9, cap.length * 13 + 36)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(cap)}">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.wallTop}"/><stop offset="1" stop-color="${C.wall}"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.floor}"/><stop offset="1" stop-color="${C.floorDark}"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.32" r="0.85">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1c1816" stop-opacity="0.16"/>
    </radialGradient>
  </defs>
  ${bg}
  ${subject}
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <g>
    <rect x="28" y="${h - 60}" width="${capW}" height="34" rx="17" fill="#1c1816" opacity="0.82"/>
    <text x="46" y="${h - 38}" font-family="'Space Mono','Courier New',monospace" font-size="16" letter-spacing="2" fill="#fff" text-transform="uppercase">${esc(cap.toUpperCase())}</text>
  </g>
</svg>`
}

let n = 0
for (const it of ITEMS) {
  writeFileSync(resolve(OUT, `${it.id}.svg`), svg(it))
  n++
}
console.log(`Generated ${n} images into public/images/`)

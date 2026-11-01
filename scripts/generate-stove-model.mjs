#!/usr/bin/env node
/**
 * Generates public/models/kachelofen-eckscheibe.glb — a procedural, dependency-free
 * glTF 2.0 model of a tiled corner stove ("Kachelofen mit Eckscheibe") with a
 * heated bench, built so the planning explorer can switch materials per part:
 *
 *   part (glTF material name)  geometry
 *   ─────────────────────────  ───────────────────────────────────────────────
 *   Kacheln                    individually chamfered tiles, instanced per node
 *   Putz                       the plastered core visible in the joints
 *   Sockel                     plinth under body and bench
 *   Sims                       two-step cornice band
 *   Auflage                    bench slab + top cover plate
 *   Rahmen                     steel frame of the corner glass, air knob, flue
 *   Glas                       corner glass (two panes, alpha blend)
 *   Feuerraum / Holz / Glut    hollow firebox interior, logs, embers (emissive)
 *
 * The explorer (src/components/planning/ExplorerStageModel.vue) looks parts up by
 * material name through <model-viewer>'s scene-graph API and applies the PBR
 * factors defined in src/data/planning.js, so every part can be combined freely.
 * Units: metres, y up, origin on the floor under the body's centre.
 *
 *   node scripts/generate-stove-model.mjs      # npm run gen:model
 */
import { Buffer } from 'node:buffer'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'public/models/kachelofen-eckscheibe.glb')

// ------------------------------------------------------------------ materials
// Defaults = the "Landhaus" preset in planning.js. Order is irrelevant; parts are
// addressed by name.
const materials = {
  Kacheln: { baseColorFactor: [0.93, 0.86, 0.72, 1], metallicFactor: 0, roughnessFactor: 0.18 },
  Putz: { baseColorFactor: [0.9, 0.89, 0.86, 1], metallicFactor: 0, roughnessFactor: 0.95 },
  Sockel: { baseColorFactor: [0.55, 0.52, 0.48, 1], metallicFactor: 0, roughnessFactor: 0.85 },
  Sims: { baseColorFactor: [0.93, 0.86, 0.72, 1], metallicFactor: 0, roughnessFactor: 0.2 },
  Auflage: { baseColorFactor: [0.62, 0.45, 0.27, 1], metallicFactor: 0, roughnessFactor: 0.55 },
  Rahmen: { baseColorFactor: [0.1, 0.1, 0.1, 1], metallicFactor: 0.6, roughnessFactor: 0.45 },
  Glas: {
    baseColorFactor: [0.08, 0.09, 0.1, 0.42],
    metallicFactor: 0,
    roughnessFactor: 0.05,
    alphaMode: 'BLEND',
    doubleSided: true,
  },
  Feuerraum: { baseColorFactor: [0.07, 0.06, 0.05, 1], metallicFactor: 0, roughnessFactor: 0.95 },
  Holz: { baseColorFactor: [0.26, 0.17, 0.1, 1], metallicFactor: 0, roughnessFactor: 0.9 },
  Glut: {
    baseColorFactor: [0.35, 0.1, 0.02, 1],
    metallicFactor: 0,
    roughnessFactor: 0.8,
    emissiveFactor: [1, 0.38, 0.08],
  },
}
const materialIndex = Object.fromEntries(Object.keys(materials).map((name, i) => [name, i]))

// ------------------------------------------------------------------ dimensions
const BODY = 0.92 // outer footprint of the tiled body (x and z)
const CORE = 0.9 // plastered core (tiles sit 1 cm proud of it, so joints show Putz)
const TILE_T = 0.03 // tile thickness
const JOINT = 0.006
const CHAMFER = 0.012
const SOCKEL_H = 0.12
const TILE_TOP = 1.45 // top of the tiled zone
const BENCH = { x0: -1.46, x1: -BODY / 2, z0: -0.45, z1: 0.25, h: 0.48, sockelH: 0.06 }
// Opening for the corner glass on the +x/+z corner (in tile-grid coordinates).
const OPENING = { from: 0.0, to: CORE / 2, y0: 0.34, y1: 1.0 }

// ------------------------------------------------------------------ geometry
/** Chamfered cuboid centred at the origin (26 faces, flat-shaded). */
function chamferBox(w, h, d, c) {
  const x = w / 2
  const y = h / 2
  const z = d / 2
  const faces = []
  const quad = (n, a, b, cc, dd) => faces.push({ n, v: [a, b, cc, dd] })
  const tri = (n, a, b, cc) => faces.push({ n, v: [a, b, cc] })
  // Main faces, inset by the chamfer.
  quad([0, 0, 1], [-x + c, -y + c, z], [x - c, -y + c, z], [x - c, y - c, z], [-x + c, y - c, z])
  quad(
    [0, 0, -1],
    [x - c, -y + c, -z],
    [-x + c, -y + c, -z],
    [-x + c, y - c, -z],
    [x - c, y - c, -z]
  )
  quad([1, 0, 0], [x, -y + c, z - c], [x, -y + c, -z + c], [x, y - c, -z + c], [x, y - c, z - c])
  quad(
    [-1, 0, 0],
    [-x, -y + c, -z + c],
    [-x, -y + c, z - c],
    [-x, y - c, z - c],
    [-x, y - c, -z + c]
  )
  quad([0, 1, 0], [-x + c, y, z - c], [x - c, y, z - c], [x - c, y, -z + c], [-x + c, y, -z + c])
  quad(
    [0, -1, 0],
    [-x + c, -y, -z + c],
    [x - c, -y, -z + c],
    [x - c, -y, z - c],
    [-x + c, -y, z - c]
  )
  const s = Math.SQRT1_2
  // Twelve edge bevels.
  quad([0, s, s], [-x + c, y - c, z], [x - c, y - c, z], [x - c, y, z - c], [-x + c, y, z - c])
  quad([0, -s, s], [-x + c, -y, z - c], [x - c, -y, z - c], [x - c, -y + c, z], [-x + c, -y + c, z])
  quad([0, s, -s], [x - c, y - c, -z], [-x + c, y - c, -z], [-x + c, y, -z + c], [x - c, y, -z + c])
  quad(
    [0, -s, -s],
    [x - c, -y, -z + c],
    [-x + c, -y, -z + c],
    [-x + c, -y + c, -z],
    [x - c, -y + c, -z]
  )
  quad([s, 0, s], [x - c, -y + c, z], [x, -y + c, z - c], [x, y - c, z - c], [x - c, y - c, z])
  quad([-s, 0, s], [-x, -y + c, z - c], [-x + c, -y + c, z], [-x + c, y - c, z], [-x, y - c, z - c])
  quad([s, 0, -s], [x, -y + c, -z + c], [x - c, -y + c, -z], [x - c, y - c, -z], [x, y - c, -z + c])
  quad(
    [-s, 0, -s],
    [-x + c, -y + c, -z],
    [-x, -y + c, -z + c],
    [-x, y - c, -z + c],
    [-x + c, y - c, -z]
  )
  quad([s, s, 0], [x, y - c, z - c], [x, y - c, -z + c], [x - c, y, -z + c], [x - c, y, z - c])
  quad([-s, s, 0], [-x + c, y, z - c], [-x + c, y, -z + c], [-x, y - c, -z + c], [-x, y - c, z - c])
  quad([s, -s, 0], [x - c, -y, z - c], [x - c, -y, -z + c], [x, -y + c, -z + c], [x, -y + c, z - c])
  quad(
    [-s, -s, 0],
    [-x, -y + c, z - c],
    [-x, -y + c, -z + c],
    [-x + c, -y, -z + c],
    [-x + c, -y, z - c]
  )
  // Eight corner triangles.
  const t = 1 / Math.sqrt(3)
  tri([t, t, t], [x - c, y - c, z], [x, y - c, z - c], [x - c, y, z - c])
  tri([-t, t, t], [-x + c, y, z - c], [-x, y - c, z - c], [-x + c, y - c, z])
  tri([t, t, -t], [x - c, y, -z + c], [x, y - c, -z + c], [x - c, y - c, -z])
  tri([-t, t, -t], [-x + c, y - c, -z], [-x, y - c, -z + c], [-x + c, y, -z + c])
  tri([t, -t, t], [x - c, -y, z - c], [x, -y + c, z - c], [x - c, -y + c, z])
  tri([-t, -t, t], [-x + c, -y + c, z], [-x, -y + c, z - c], [-x + c, -y, z - c])
  tri([t, -t, -t], [x - c, -y + c, -z], [x, -y + c, -z + c], [x - c, -y, -z + c])
  tri([-t, -t, -t], [-x + c, -y, -z + c], [-x, -y + c, -z + c], [-x + c, -y + c, -z])
  return facesToGeometry(faces)
}

/** Plain cuboid; `inward` flips it into a hollow interior (normals point inside). */
function box(w, h, d, inward = false) {
  const x = w / 2
  const y = h / 2
  const z = d / 2
  const faces = [
    {
      n: [0, 0, 1],
      v: [
        [-x, -y, z],
        [x, -y, z],
        [x, y, z],
        [-x, y, z],
      ],
    },
    {
      n: [0, 0, -1],
      v: [
        [x, -y, -z],
        [-x, -y, -z],
        [-x, y, -z],
        [x, y, -z],
      ],
    },
    {
      n: [1, 0, 0],
      v: [
        [x, -y, z],
        [x, -y, -z],
        [x, y, -z],
        [x, y, z],
      ],
    },
    {
      n: [-1, 0, 0],
      v: [
        [-x, -y, -z],
        [-x, -y, z],
        [-x, y, z],
        [-x, y, -z],
      ],
    },
    {
      n: [0, 1, 0],
      v: [
        [-x, y, z],
        [x, y, z],
        [x, y, -z],
        [-x, y, -z],
      ],
    },
    {
      n: [0, -1, 0],
      v: [
        [-x, -y, -z],
        [x, -y, -z],
        [x, -y, z],
        [-x, -y, z],
      ],
    },
  ]
  if (inward) {
    for (const f of faces) {
      f.n = f.n.map((v) => -v)
      f.v.reverse()
    }
  }
  return facesToGeometry(faces)
}

/** Cylinder along +y, centred at the origin, flat caps. */
function cylinder(r, h, segments = 24) {
  const positions = []
  const normals = []
  const indices = []
  const y = h / 2
  for (let i = 0; i < segments; i += 1) {
    const a0 = (i / segments) * Math.PI * 2
    const a1 = ((i + 1) / segments) * Math.PI * 2
    const p0 = [Math.cos(a0) * r, Math.sin(a0) * r]
    const p1 = [Math.cos(a1) * r, Math.sin(a1) * r]
    const base = positions.length / 3
    positions.push(p0[0], -y, p0[1], p1[0], -y, p1[1], p1[0], y, p1[1], p0[0], y, p0[1])
    normals.push(
      p0[0] / r,
      0,
      p0[1] / r,
      p1[0] / r,
      0,
      p1[1] / r,
      p1[0] / r,
      0,
      p1[1] / r,
      p0[0] / r,
      0,
      p0[1] / r
    )
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
    // caps
    const top = positions.length / 3
    positions.push(0, y, 0, p0[0], y, p0[1], p1[0], y, p1[1])
    normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0)
    indices.push(top, top + 1, top + 2)
    const bot = positions.length / 3
    positions.push(0, -y, 0, p1[0], -y, p1[1], p0[0], -y, p0[1])
    normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0)
    indices.push(bot, bot + 1, bot + 2)
  }
  return { positions, normals, indices }
}

function facesToGeometry(faces) {
  const positions = []
  const normals = []
  const indices = []
  for (const face of faces) {
    const base = positions.length / 3
    for (const [vx, vy, vz] of face.v) {
      positions.push(vx, vy, vz)
      normals.push(...face.n)
    }
    for (let i = 1; i + 1 < face.v.length; i += 1) indices.push(base, base + i, base + i + 1)
  }
  return { positions, normals, indices }
}

/** Rotate a geometry about y by `deg`, then translate. */
function transform(geo, { x = 0, y = 0, z = 0, rotY = 0, rotX = 0 }) {
  const cy = Math.cos((rotY * Math.PI) / 180)
  const sy = Math.sin((rotY * Math.PI) / 180)
  const cx = Math.cos((rotX * Math.PI) / 180)
  const sx = Math.sin((rotX * Math.PI) / 180)
  const positions = []
  const normals = []
  const apply = (arr, out, translate) => {
    for (let i = 0; i < arr.length; i += 3) {
      let [px, py, pz] = [arr[i], arr[i + 1], arr[i + 2]]
      // rotate about x, then about y
      ;[py, pz] = [py * cx - pz * sx, py * sx + pz * cx]
      ;[px, pz] = [px * cy + pz * sy, -px * sy + pz * cy]
      out.push(px + (translate ? x : 0), py + (translate ? y : 0), pz + (translate ? z : 0))
    }
  }
  apply(geo.positions, positions, true)
  apply(geo.normals, normals, false)
  return { positions, normals, indices: geo.indices }
}

// -------------------------------------------------------- merged part meshes
/** One merged geometry per material (fewer draw calls); tiles are instanced separately. */
const merged = new Map()
function add(materialName, geo, placement = {}) {
  const g = transform(geo, placement)
  if (!merged.has(materialName))
    merged.set(materialName, { positions: [], normals: [], indices: [] })
  const m = merged.get(materialName)
  const base = m.positions.length / 3
  m.positions.push(...g.positions)
  m.normals.push(...g.normals)
  m.indices.push(...g.indices.map((i) => i + base))
}

// Plinths
add('Sockel', chamferBox(BODY + 0.04, SOCKEL_H, BODY + 0.04, 0.01), { y: SOCKEL_H / 2 })
add(
  'Sockel',
  chamferBox(BENCH.x1 - BENCH.x0 + 0.04, BENCH.sockelH, BENCH.z1 - BENCH.z0 + 0.04, 0.008),
  {
    x: (BENCH.x0 + BENCH.x1) / 2,
    y: BENCH.sockelH / 2,
    z: (BENCH.z0 + BENCH.z1) / 2,
  }
)

// Plastered core of the body, built around the firebox opening in the +x/+z corner.
const half = CORE / 2
const coreParts = [
  // left half (x < 0), full depth
  { x0: -half, x1: 0, z0: -half, z1: half, y0: SOCKEL_H, y1: TILE_TOP },
  // right-back quarter
  { x0: 0, x1: half, z0: -half, z1: 0, y0: SOCKEL_H, y1: TILE_TOP },
  // right-front quarter below and above the opening
  { x0: 0, x1: half, z0: 0, z1: half, y0: SOCKEL_H, y1: OPENING.y0 },
  { x0: 0, x1: half, z0: 0, z1: half, y0: OPENING.y1, y1: TILE_TOP },
]
for (const p of coreParts) {
  add('Putz', box(p.x1 - p.x0, p.y1 - p.y0, p.z1 - p.z0), {
    x: (p.x0 + p.x1) / 2,
    y: (p.y0 + p.y1) / 2,
    z: (p.z0 + p.z1) / 2,
  })
}

// Firebox: hollow interior, logs and embers, visible through the corner glass.
const cav = {
  x0: 0.01,
  x1: half + TILE_T,
  z0: 0.01,
  z1: half + TILE_T,
  y0: OPENING.y0 + 0.01,
  y1: OPENING.y1 - 0.01,
}
add('Feuerraum', box(cav.x1 - cav.x0, cav.y1 - cav.y0, cav.z1 - cav.z0, true), {
  x: (cav.x0 + cav.x1) / 2,
  y: (cav.y0 + cav.y1) / 2,
  z: (cav.z0 + cav.z1) / 2,
})
add('Glut', chamferBox(0.3, 0.05, 0.3, 0.01), { x: 0.2, y: cav.y0 + 0.03, z: 0.2 })
add('Holz', cylinder(0.035, 0.3, 14), { x: 0.17, y: cav.y0 + 0.09, z: 0.22, rotX: 90, rotY: 20 })
add('Holz', cylinder(0.032, 0.28, 14), { x: 0.24, y: cav.y0 + 0.09, z: 0.16, rotX: 90, rotY: -55 })
add('Holz', cylinder(0.03, 0.26, 14), { x: 0.2, y: cav.y0 + 0.15, z: 0.2, rotX: 90, rotY: 70 })

// Corner glass: two panes meeting at the corner edge, flush with the tile faces.
const paneOut = half + TILE_T + 0.004
const paneW = OPENING.to - OPENING.from
const paneH = OPENING.y1 - OPENING.y0
const paneY = (OPENING.y0 + OPENING.y1) / 2
add('Glas', box(paneW + TILE_T, paneH, 0.006), {
  x: OPENING.from + (paneW + TILE_T) / 2,
  y: paneY,
  z: paneOut,
})
add('Glas', box(0.006, paneH, paneW + TILE_T), {
  x: paneOut,
  y: paneY,
  z: OPENING.from + (paneW + TILE_T) / 2,
})

// Steel frame around both panes (top/bottom rails, outer stiles, corner post).
const F = 0.028 // frame bar thickness (square section)
const frameOut = half + TILE_T + 0.012
const railLen = paneW + TILE_T + F
for (const yy of [OPENING.y0 - F / 2, OPENING.y1 + F / 2]) {
  add('Rahmen', chamferBox(railLen, F, F, 0.004), {
    x: OPENING.from + railLen / 2 - F / 2,
    y: yy,
    z: frameOut,
  })
  add('Rahmen', chamferBox(F, F, railLen, 0.004), {
    x: frameOut,
    y: yy,
    z: OPENING.from + railLen / 2 - F / 2,
  })
}
add('Rahmen', chamferBox(F, paneH + 2 * F, F, 0.004), {
  x: OPENING.from - F / 2,
  y: paneY,
  z: frameOut,
})
add('Rahmen', chamferBox(F, paneH + 2 * F, F, 0.004), {
  x: frameOut,
  y: paneY,
  z: OPENING.from - F / 2,
})
add('Rahmen', chamferBox(F, paneH + 2 * F, F, 0.004), { x: frameOut, y: paneY, z: frameOut })
// Air-control knob and lever below the front pane.
add('Rahmen', cylinder(0.022, 0.03, 20), {
  x: 0.2,
  y: OPENING.y0 - 0.09,
  z: half + TILE_T + 0.015,
  rotX: 90,
})
add('Rahmen', chamferBox(0.12, 0.012, 0.012, 0.003), {
  x: 0.3,
  y: OPENING.y0 - 0.09,
  z: half + TILE_T + 0.02,
})

// Cornice (two steps) and the cover plate on top.
add('Sims', chamferBox(BODY + 0.06, 0.05, BODY + 0.06, 0.01), { y: TILE_TOP + 0.025 })
add('Sims', chamferBox(BODY + 0.1, 0.05, BODY + 0.1, 0.012), { y: TILE_TOP + 0.075 })
add('Auflage', chamferBox(BODY + 0.02, 0.03, BODY + 0.02, 0.01), { y: TILE_TOP + 0.115 })

// Bench core and slab.
add('Putz', box(BENCH.x1 - BENCH.x0 - 0.02, BENCH.h - BENCH.sockelH, BENCH.z1 - BENCH.z0 - 0.02), {
  x: (BENCH.x0 + BENCH.x1) / 2,
  y: BENCH.sockelH + (BENCH.h - BENCH.sockelH) / 2,
  z: (BENCH.z0 + BENCH.z1) / 2,
})
add('Auflage', chamferBox(BENCH.x1 - BENCH.x0 + 0.08, 0.05, BENCH.z1 - BENCH.z0 + 0.08, 0.012), {
  x: (BENCH.x0 + BENCH.x1) / 2 - 0.02,
  y: BENCH.h + 0.025,
  z: (BENCH.z0 + BENCH.z1) / 2,
})

// Flue pipe: vertical stub from the cover plate, elbow, run towards the back wall.
const flueR = 0.075
add('Rahmen', cylinder(flueR, 0.32, 28), { x: -0.2, y: TILE_TOP + 0.13 + 0.16, z: -0.2 })
add('Rahmen', cylinder(flueR + 0.012, 0.03, 28), { x: -0.2, y: TILE_TOP + 0.13 + 0.015, z: -0.2 })
add('Rahmen', cylinder(flueR, 0.42, 28), { x: -0.2, y: TILE_TOP + 0.13 + 0.32, z: -0.41, rotX: 90 })
add('Rahmen', chamferBox(flueR * 2 + 0.02, flueR * 2 + 0.02, 0.16, 0.02), {
  x: -0.2,
  y: TILE_TOP + 0.45,
  z: -0.26,
})

// -------------------------------------------------------------- tile layout
/** Tile instances: { x, y, z, rotY } placing the shared tile mesh (its +z face outward). */
const tileInstances = []
const tileMeshes = new Map() // `${w}x${h}` → mesh index placeholder (filled when written)

function tileRows(y0, y1, rows) {
  const h = (y1 - y0 - (rows - 1) * JOINT) / rows
  return Array.from({ length: rows }, (_, r) => ({ y: y0 + h / 2 + r * (h + JOINT), h }))
}
function tileCols(width, cols) {
  const w = (width - (cols - 1) * JOINT) / cols
  return Array.from({ length: cols }, (_, c) => ({ u: -width / 2 + w / 2 + c * (w + JOINT), w }))
}

/**
 * Lay tiles on one vertical face. `face` is 'front' (+z), 'back' (-z), 'right' (+x), 'left' (-x);
 * `cx/cz` is the face centre on the ground plan, `dist` the face distance from that centre,
 * `width` the face width, `skip(u, y, w, h)` can veto a tile (u runs left→right seen from outside).
 */
function layFace({ face, cx, cz, dist, width, y0, y1, rows, cols, skip }) {
  const rot = { front: 0, right: -90, back: 180, left: 90 }[face]
  for (const { y, h } of tileRows(y0, y1, rows)) {
    for (const { u, w } of tileCols(width, cols)) {
      if (skip && skip(u, y, w, h)) continue
      const out = dist + TILE_T / 2
      let x
      let z
      if (face === 'front') [x, z] = [cx + u, cz + out]
      if (face === 'back') [x, z] = [cx - u, cz - out]
      if (face === 'right') [x, z] = [cx + out, cz - u]
      if (face === 'left') [x, z] = [cx - out, cz + u]
      const key = `${w.toFixed(4)}x${h.toFixed(4)}`
      if (!tileMeshes.has(key)) tileMeshes.set(key, { w, h })
      tileInstances.push({ x, y, z, rotY: rot, key })
    }
  }
}

// Body: four faces, 4 columns × 6 rows; the +x/+z corner column is cut out for the glass.
const bodyRows = 6
const inOpening = (u, y, w, h) =>
  u + w / 2 > OPENING.from - 0.001 &&
  y + h / 2 > OPENING.y0 + 0.001 &&
  y - h / 2 < OPENING.y1 - 0.001
layFace({
  face: 'front',
  cx: 0,
  cz: 0,
  dist: half,
  width: CORE,
  y0: SOCKEL_H,
  y1: TILE_TOP,
  rows: bodyRows,
  cols: 4,
  skip: inOpening,
})
layFace({
  face: 'right',
  cx: 0,
  cz: 0,
  dist: half,
  width: CORE,
  y0: SOCKEL_H,
  y1: TILE_TOP,
  rows: bodyRows,
  cols: 4,
  skip: (u, y, w, h) => inOpening(-u, y, w, h),
})
layFace({
  face: 'back',
  cx: 0,
  cz: 0,
  dist: half,
  width: CORE,
  y0: SOCKEL_H,
  y1: TILE_TOP,
  rows: bodyRows,
  cols: 4,
})
layFace({
  face: 'left',
  cx: 0,
  cz: 0,
  dist: half,
  width: CORE,
  y0: SOCKEL_H,
  y1: TILE_TOP,
  rows: bodyRows,
  cols: 4,
})

// Bench: front, back and left end, 2 rows.
const bcx = (BENCH.x0 + BENCH.x1) / 2
const bcz = (BENCH.z0 + BENCH.z1) / 2
const bw = BENCH.x1 - BENCH.x0 - 0.02
const bd = BENCH.z1 - BENCH.z0 - 0.02
const benchY0 = BENCH.sockelH
const benchY1 = BENCH.h - 0.005
layFace({
  face: 'front',
  cx: bcx,
  cz: bcz,
  dist: bd / 2,
  width: bw,
  y0: benchY0,
  y1: benchY1,
  rows: 2,
  cols: 4,
})
layFace({
  face: 'back',
  cx: bcx,
  cz: bcz,
  dist: bd / 2,
  width: bw,
  y0: benchY0,
  y1: benchY1,
  rows: 2,
  cols: 4,
})
layFace({
  face: 'left',
  cx: bcx,
  cz: bcz,
  dist: bw / 2,
  width: bd,
  y0: benchY0,
  y1: benchY1,
  rows: 2,
  cols: 3,
})

// ------------------------------------------------------------------ writer
const bufferParts = []
const bufferViews = []
const accessors = []
let byteOffset = 0
const pad4 = (n) => (n + 3) & ~3

function addView(typedArray, target) {
  const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)
  const padded = pad4(bytes.length)
  bufferParts.push(bytes, Buffer.alloc(padded - bytes.length))
  bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.length, target })
  byteOffset += padded
  return bufferViews.length - 1
}

function minMax(values) {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < values.length; i += 3) {
    for (let k = 0; k < 3; k += 1) {
      min[k] = Math.min(min[k], values[i + k])
      max[k] = Math.max(max[k], values[i + k])
    }
  }
  return { min, max }
}

function primitiveFor(geo, materialName) {
  const count = geo.positions.length / 3
  if (count > 65535) throw new Error(`${materialName}: ${count} vertices exceed uint16 indices`)
  const posView = addView(new Float32Array(geo.positions), 34962)
  accessors.push({
    bufferView: posView,
    componentType: 5126,
    count,
    type: 'VEC3',
    ...minMax(geo.positions),
  })
  const posAcc = accessors.length - 1
  const normView = addView(new Float32Array(geo.normals), 34962)
  accessors.push({ bufferView: normView, componentType: 5126, count, type: 'VEC3' })
  const normAcc = accessors.length - 1
  const idxView = addView(new Uint16Array(geo.indices), 34963)
  accessors.push({
    bufferView: idxView,
    componentType: 5123,
    count: geo.indices.length,
    type: 'SCALAR',
  })
  const idxAcc = accessors.length - 1
  return {
    attributes: { POSITION: posAcc, NORMAL: normAcc },
    indices: idxAcc,
    material: materialIndex[materialName],
  }
}

const meshes = []
const nodes = []
// Merged part meshes → one node each.
for (const [name, geo] of merged) {
  meshes.push({ name, primitives: [primitiveFor(geo, name)] })
  nodes.push({ name, mesh: meshes.length - 1 })
}
// Shared tile meshes → one node per tile instance.
for (const [key, { w, h }] of tileMeshes) {
  meshes.push({
    name: `Kachel ${key}`,
    primitives: [primitiveFor(chamferBox(w, h, TILE_T, CHAMFER), 'Kacheln')],
  })
  tileMeshes.get(key).mesh = meshes.length - 1
}
const tileNodeStart = nodes.length
for (const t of tileInstances) {
  const a = (t.rotY * Math.PI) / 180
  nodes.push({
    name: 'Kachel',
    mesh: tileMeshes.get(t.key).mesh,
    translation: [t.x, t.y, t.z],
    rotation: [0, Math.sin(a / 2), 0, Math.cos(a / 2)],
  })
}
nodes.push({ name: 'Kacheln', children: tileInstances.map((_, i) => tileNodeStart + i) })
const rootChildren = [...Array.from({ length: tileNodeStart }, (_, i) => i), nodes.length - 1]
nodes.push({ name: 'Kachelofen Eckscheibe', children: rootChildren })

const bin = Buffer.concat(bufferParts)
const gltf = {
  asset: { version: '2.0', generator: 'ofenbau-app scripts/generate-stove-model.mjs' },
  scene: 0,
  scenes: [{ nodes: [nodes.length - 1] }],
  nodes,
  meshes,
  materials: Object.entries(materials).map(
    ([name, { emissiveFactor, alphaMode, doubleSided, ...pbr }]) => ({
      name,
      pbrMetallicRoughness: pbr,
      ...(emissiveFactor ? { emissiveFactor } : {}),
      ...(alphaMode ? { alphaMode } : {}),
      ...(doubleSided ? { doubleSided } : {}),
    })
  ),
  buffers: [{ byteLength: bin.length }],
  bufferViews,
  accessors,
}

const jsonBytes = Buffer.from(JSON.stringify(gltf))
const jsonPadded = Buffer.concat([
  jsonBytes,
  Buffer.alloc(pad4(jsonBytes.length) - jsonBytes.length, 0x20),
])
const binPadded = Buffer.concat([bin, Buffer.alloc(pad4(bin.length) - bin.length)])
const header = Buffer.alloc(12)
header.write('glTF', 0, 'ascii')
header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + binPadded.length, 8)
const jsonChunkHeader = Buffer.alloc(8)
jsonChunkHeader.writeUInt32LE(jsonPadded.length, 0)
jsonChunkHeader.write('JSON', 4, 'ascii')
const binChunkHeader = Buffer.alloc(8)
binChunkHeader.writeUInt32LE(binPadded.length, 0)
binChunkHeader.write('BIN\0', 4, 'ascii')

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(
  outPath,
  Buffer.concat([header, jsonChunkHeader, jsonPadded, binChunkHeader, binPadded])
)
const vertexCount = accessors.filter((a) => a.type === 'VEC3').reduce((n, a) => n + a.count, 0) / 2
console.log(
  `wrote ${outPath}: ${((binPadded.length + jsonPadded.length + 28) / 1024) | 0} KB, ${meshes.length} meshes, ${tileInstances.length} tiles, ${vertexCount} vertices, parts: ${Object.keys(materials).join(', ')}`
)

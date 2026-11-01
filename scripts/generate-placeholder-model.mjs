#!/usr/bin/env node
/**
 * Writes a small, valid binary glTF 2.0 placeholder of the "Kachelofen mit
 * Eckscheibe" to public/models/kachelofen-eckscheibe.glb — a handful of boxes
 * (corner stove body, bench, top slab, dark glass pane) with three
 * KHR_materials_variants (Kalkputz / Naturstein / Keramik) so the explorer's
 * 3D stage, material switch, hotspots and AR flow can be exercised without a
 * real model. No dependencies. Replace the output with a real export (see
 * public/models/README.md).
 *
 *   node scripts/generate-placeholder-model.mjs   # npm run gen:model
 */
import { Buffer } from 'node:buffer'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'public/models/kachelofen-eckscheibe.glb')

// ---------------------------------------------------------------- materials
// Index 0-2: the surface finishes (variants). 3: glass. 4: cast-iron frame.
const materials = [
  {
    name: 'Kalkputz',
    baseColorFactor: [0.93, 0.9, 0.84, 1],
    metallicFactor: 0,
    roughnessFactor: 0.95,
  },
  {
    name: 'Naturstein',
    baseColorFactor: [0.62, 0.56, 0.5, 1],
    metallicFactor: 0,
    roughnessFactor: 0.8,
  },
  {
    name: 'Keramik',
    baseColorFactor: [0.86, 0.78, 0.62, 1],
    metallicFactor: 0.05,
    roughnessFactor: 0.25,
  },
  {
    name: 'Glas',
    baseColorFactor: [0.05, 0.05, 0.06, 1],
    metallicFactor: 0.4,
    roughnessFactor: 0.15,
    emissiveFactor: [0.35, 0.12, 0.02],
  },
  {
    name: 'Gusseisen',
    baseColorFactor: [0.12, 0.11, 0.11, 1],
    metallicFactor: 0.7,
    roughnessFactor: 0.5,
  },
]
const variantNames = ['Kalkputz', 'Naturstein', 'Keramik']
const SURFACE = 0 // default material of the clad parts
const GLASS = 3
const IRON = 4

// ------------------------------------------------------------------- boxes
// [cx, cy, cz, w, h, d, material, usesVariants] — metres, y up, origin on the floor.
const boxes = [
  // L-shaped corner body: two wings meeting at the back corner.
  [-0.35, 0.7, 0.0, 0.7, 1.4, 0.6, SURFACE, true],
  [0.0, 0.7, -0.35, 0.6, 1.4, 0.7, SURFACE, true],
  // Heated bench along the left wing.
  [-0.55, 0.22, 0.75, 1.1, 0.44, 0.5, SURFACE, true],
  // Top slab with a small overhang.
  [-0.1, 1.42, -0.1, 1.26, 0.06, 1.26, SURFACE, true],
  // Corner glass pane (two thin panels meeting at the front corner).
  [0.0, 0.62, 0.31, 0.56, 0.5, 0.02, GLASS, false],
  [0.31, 0.62, 0.0, 0.02, 0.5, 0.56, GLASS, false],
  // Cast-iron frame around the glass.
  [0.0, 0.92, 0.31, 0.6, 0.05, 0.03, IRON, false],
  [0.0, 0.32, 0.31, 0.6, 0.05, 0.03, IRON, false],
  [0.31, 0.92, 0.0, 0.03, 0.05, 0.6, IRON, false],
  [0.31, 0.32, 0.0, 0.03, 0.05, 0.6, IRON, false],
  // Firebox interior (dark) behind the glass so it reads as a cavity.
  [0.14, 0.62, 0.14, 0.34, 0.48, 0.34, IRON, false],
]

function boxGeometry([cx, cy, cz, w, h, d]) {
  const x = w / 2
  const y = h / 2
  const z = d / 2
  // Six faces, four vertices each, CCW winding seen from outside.
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
  const positions = []
  const normals = []
  const indices = []
  faces.forEach((face, f) => {
    face.v.forEach(([vx, vy, vz]) => {
      positions.push(vx + cx, vy + cy, vz + cz)
      normals.push(...face.n)
    })
    const o = f * 4
    indices.push(o, o + 1, o + 2, o, o + 2, o + 3)
  })
  return { positions, normals, indices }
}

// -------------------------------------------------------------- bin layout
const bufferParts = []
const bufferViews = []
const accessors = []
const primitives = []
let byteOffset = 0

function pad4(n) {
  return (n + 3) & ~3
}

function addView(typedArray, target) {
  const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)
  const padded = pad4(bytes.length)
  bufferParts.push(bytes, Buffer.alloc(padded - bytes.length))
  bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.length, target })
  byteOffset += padded
  return bufferViews.length - 1
}

function minMax(values, size) {
  const min = Array(size).fill(Infinity)
  const max = Array(size).fill(-Infinity)
  for (let i = 0; i < values.length; i += size) {
    for (let k = 0; k < size; k += 1) {
      min[k] = Math.min(min[k], values[i + k])
      max[k] = Math.max(max[k], values[i + k])
    }
  }
  return { min, max }
}

for (const box of boxes) {
  const { positions, normals, indices } = boxGeometry(box)
  const [, , , , , , material, usesVariants] = box

  const posArr = new Float32Array(positions)
  const posView = addView(posArr, 34962)
  const { min, max } = minMax(positions, 3)
  accessors.push({
    bufferView: posView,
    componentType: 5126,
    count: positions.length / 3,
    type: 'VEC3',
    min,
    max,
  })
  const posAcc = accessors.length - 1

  const normView = addView(new Float32Array(normals), 34962)
  accessors.push({
    bufferView: normView,
    componentType: 5126,
    count: normals.length / 3,
    type: 'VEC3',
  })
  const normAcc = accessors.length - 1

  const idxView = addView(new Uint16Array(indices), 34963)
  accessors.push({
    bufferView: idxView,
    componentType: 5123,
    count: indices.length,
    type: 'SCALAR',
  })
  const idxAcc = accessors.length - 1

  const primitive = { attributes: { POSITION: posAcc, NORMAL: normAcc }, indices: idxAcc, material }
  if (usesVariants) {
    primitive.extensions = {
      KHR_materials_variants: {
        mappings: variantNames.map((name, i) => ({ material: i, variants: [i] })),
      },
    }
  }
  primitives.push(primitive)
}

const bin = Buffer.concat(bufferParts)

const gltf = {
  asset: { version: '2.0', generator: 'ofenbau-app scripts/generate-placeholder-model.mjs' },
  extensionsUsed: ['KHR_materials_variants'],
  extensions: { KHR_materials_variants: { variants: variantNames.map((name) => ({ name })) } },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ name: 'Kachelofen Eckscheibe (Platzhalter)', mesh: 0 }],
  meshes: [{ name: 'kachelofen', primitives }],
  materials: materials.map(({ name, emissiveFactor, ...pbr }) => ({
    name,
    pbrMetallicRoughness: pbr,
    ...(emissiveFactor ? { emissiveFactor } : {}),
  })),
  buffers: [{ byteLength: bin.length }],
  bufferViews,
  accessors,
}

// ------------------------------------------------------------ GLB container
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

const glb = Buffer.concat([header, jsonChunkHeader, jsonPadded, binChunkHeader, binPadded])
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, glb)
console.log(
  `wrote ${outPath} (${glb.length} bytes, ${boxes.length} boxes, variants: ${variantNames.join(', ')})`
)

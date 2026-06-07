import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const distDir = join(root, 'dist')
const publicImagesDir = join(root, 'public', 'images')

const budgets = {
  jsAssetKb: 180,
  cssAssetKb: 60,
  imageKb: 350,
}

const failures = []
const warnings = []

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function kb(path) {
  return Math.round((statSync(path).size / 1024) * 10) / 10
}

function checkAssets() {
  const assetsDir = join(distDir, 'assets')
  const files = walk(assetsDir)

  for (const file of files) {
    const size = kb(file)
    if (file.endsWith('.js') && size > budgets.jsAssetKb) {
      failures.push(`${file} is ${size} KB, over JS budget ${budgets.jsAssetKb} KB`)
    }
    if (file.endsWith('.css') && size > budgets.cssAssetKb) {
      failures.push(`${file} is ${size} KB, over CSS budget ${budgets.cssAssetKb} KB`)
    }
  }
}

function checkImages() {
  const images = walk(publicImagesDir).filter((file) => /\.(webp|jpg|jpeg|png|svg)$/i.test(file))

  for (const image of images) {
    const size = kb(image)
    if (size > budgets.imageKb) {
      warnings.push(`${image} is ${size} KB, over image review threshold ${budgets.imageKb} KB`)
    }
  }
}

try {
  checkAssets()
  checkImages()
} catch (error) {
  failures.push(error.message)
}

console.log('Performance budget report')
console.log(`JS asset budget: ${budgets.jsAssetKb} KB`)
console.log(`CSS asset budget: ${budgets.cssAssetKb} KB`)
console.log(`Image review threshold: ${budgets.imageKb} KB`)
console.log('')

if (warnings.length) {
  console.log(`Warnings (${warnings.length})`)
  for (const warning of warnings) console.log(`  - ${warning}`)
  console.log('')
}

if (failures.length) {
  console.log(`Failures (${failures.length})`)
  for (const failure of failures) console.log(`  - ${failure}`)
  process.exitCode = 1
} else {
  console.log('All hard budgets passed.')
}

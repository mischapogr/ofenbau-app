#!/usr/bin/env node
/**
 * Guard for public demo deploys: the Impressum and privacy policy of a demo
 * build name the real operator (src/config/demoOperator.js). Refuse to deploy
 * when those details are missing, so a demo never goes live with a fictional
 * or empty provider identification.
 *
 *   node scripts/check-demo-operator.mjs   # run by the demo:pages:* scripts
 */
import { loadEnv } from 'vite'

const env = { ...loadEnv('demo', process.cwd(), 'VITE_'), ...process.env }
const required = [
  'VITE_DEMO_OPERATOR_NAME',
  'VITE_DEMO_OPERATOR_STREET',
  'VITE_DEMO_OPERATOR_CITY',
  'VITE_DEMO_OPERATOR_EMAIL',
]
const missing = required.filter((key) => !String(env[key] || '').trim())

if (missing.length) {
  console.error(
    `Demo deploy blocked: missing operator details for the Impressum/Datenschutz:\n  ${missing.join('\n  ')}\n` +
      'Set them in .env.demo.local or the encrypted secrets file (see docs/DEMO_PAGES.md).'
  )
  process.exit(1)
}
console.log(`Demo operator: ${env.VITE_DEMO_OPERATOR_NAME} <${env.VITE_DEMO_OPERATOR_EMAIL}>`)

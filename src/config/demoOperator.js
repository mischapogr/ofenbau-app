/**
 * Operator of a public demo deployment (the person or company publishing it).
 *
 * In demo mode the business shown on the site ("Ofenbau Mustermann") is
 * fictional, so the Impressum (§ 5 DDG) and the privacy policy (Art. 13 GDPR)
 * must name the real operator instead. The values are public by nature but
 * owner-specific, so they come from env variables rather than the open-source
 * code: set them in `.env.demo.local` or via the owner's encrypted secrets.
 * `scripts/check-demo-operator.mjs` refuses demo deploys without them.
 */
const env = import.meta.env

const isDemo = env.VITE_APP_ENV === 'demo' || env.MODE === 'demo'
const value = (key) => String(env[key] || '').trim()

export const demoOperator = {
  /** True in demo builds: legal pages switch to the operator's details. */
  enabled: isDemo,
  name: value('VITE_DEMO_OPERATOR_NAME'),
  street: value('VITE_DEMO_OPERATOR_STREET'),
  city: value('VITE_DEMO_OPERATOR_CITY'),
  email: value('VITE_DEMO_OPERATOR_EMAIL'),
  phone: value('VITE_DEMO_OPERATOR_PHONE'),
}

/**
 * Owner opted into an invite-only preview without published operator details
 * (VITE_DEMO_GATED_WITHOUT_OPERATOR=true; the deploy guard only allows this on
 * projects with the per-customer gate active).
 */
demoOperator.inviteOnly =
  isDemo && String(env.VITE_DEMO_GATED_WITHOUT_OPERATOR || '').toLowerCase() === 'true'

demoOperator.configured = Boolean(
  demoOperator.name && demoOperator.street && demoOperator.city && demoOperator.email
)

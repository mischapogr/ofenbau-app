/**
 * Product tier catalog — the marketing/sales view of the two packages.
 *
 * Rendered as comparison cards on the demo access-code gate (DemoProtection.vue)
 * so a prospect sees exactly what each package contains before entering the code.
 * `id` matches the runtime tier from src/config/tier.js so the gate can badge the
 * package this particular demo build actually ships ("Diese Demo").
 *
 * `icon` values must exist in AppIcon.vue.
 */
export const productTiers = [
  {
    id: 'basis',
    name: 'Basis',
    tagline: 'Digitale Präsenz',
    summary:
      'Werden Sie online gefunden und wirken Sie seriös — die komplette Website mit Portfolio, Ratgeber und Kontakt.',
    highlight: false,
    includesBasis: false,
    features: [
      { label: 'Vollständige Website: Home, Leistungen, Über uns, Kontakt', icon: 'check' },
      { label: 'Projekt-Galerie mit Filter & Lightbox', icon: 'eye' },
      { label: 'Ratgeber mit 12 Fachartikeln & Suche', icon: 'chat' },
      { label: 'Standard-Kontaktformular (DSGVO-konform)', icon: 'check' },
      { label: 'Suchmaschinen-SEO: Meta-Tags, Sitemap, Structured Data', icon: 'check' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Wachstum & Akquise',
    summary:
      'Verwandeln Sie Besucher in qualifizierte Anfragen — und werden Sie auch von KI-Suchen gefunden.',
    highlight: true,
    includesBasis: true,
    features: [
      { label: 'Interaktive Rechner: Heizlast, Budget & 1. BImSchV', icon: 'calculator' },
      { label: '3D-Planung erleben mit interaktivem Explorer', icon: 'cube' },
      { label: 'Smartes Kontaktformular mit Standort & Einzugsgebiet', icon: 'pin' },
      { label: 'Regionale Landingpages für Städte im 50-km-Einsatzgebiet', icon: 'chimney' },
      { label: 'KI-/GEO-Sichtbarkeit: llms.txt, Prerendering, IndexNow', icon: 'render' },
    ],
  },
]

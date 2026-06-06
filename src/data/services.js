/**
 * Services / Leistungen — drives the homepage service cards, the /leistungen
 * overview, and the per-service detail pages (/leistungen/:slug).
 *
 * `motif` + `tone` feed the BaseImage fallback. `image` points at the
 * project-local realistic WebP assets used by cards and detail pages.
 */
export const services = [
  {
    slug: 'kachelofen-kaminbau',
    title: 'Kachelöfen & Kaminbau',
    short: 'Individueller Ofenbau',
    description:
      'Handgesetzte Kachel- und Grundöfen für gleichmäßige, gesunde Strahlungswärme — als Maßanfertigung für Ihren Raum.',
    motif: 'flame',
    tone: 'ember',
    image: '/images/service-kachelofen.webp',
    bullets: [
      'Grundöfen & Kachelöfen mit hoher Speicherwärme',
      'Heizkamine mit großzügigem Sichtfeuer',
      'Moderne Kaminöfen in vielen Designs',
      'Effiziente, emissionsarme Verbrennungstechnik',
    ],
    intro:
      'Ein Ofen ist das Herz des Hauses. Wir planen und bauen Kachelöfen, Grund- und Heizkamine als individuelle Maßanfertigung — abgestimmt auf Raum, Heizbedarf und Architektur.',
  },
  {
    slug: 'fliesenarbeiten',
    title: 'Fliesenarbeiten',
    short: 'Bad, Wohnraum & Sanierung',
    description:
      'Präzise verlegte Fliesen für Bäder, Wohnräume und Sanierungen — vom großformatigen Feinsteinzeug bis zum klassischen Mosaik.',
    motif: 'tile',
    tone: 'sand',
    image: '/images/service-fliesen.webp',
    bullets: [
      'Bäder & Wohnräume',
      'Großformate & Feinsteinzeug',
      'Natursteine & Mosaik',
      'Komplette Sanierungen aus einer Hand',
    ],
    intro:
      'Als Fliesenmeister setzen wir Flächen, die bleiben: sauber im Detail, exakt im Fugenbild und langlebig in der Ausführung — für Bad, Wohnraum und Sanierung.',
  },
  {
    slug: '3d-planung',
    title: '3D-Planung & Entwürfe',
    short: 'Sehen vor dem Bauen',
    description:
      'Fotorealistische 3D-Visualisierung Ihres Ofens und Ihrer Flächen — inklusive Materialauswahl und präziser Kalkulation, bevor gebaut wird.',
    motif: 'render',
    tone: 'slate',
    image: '/images/service-3d-planung.webp',
    bullets: [
      'Räumliche Visualisierung in 3D',
      'Materialauswahl am Modell',
      'Präzise Kalkulation vorab',
      'Sicher entscheiden — ohne böse Überraschungen',
    ],
    intro:
      'Bevor der erste Handgriff getan ist, sehen Sie Ihr Projekt fertig: Wir visualisieren Ofen und Flächen in fotorealistischem 3D, wählen Materialien am Modell und kalkulieren präzise.',
  },
]

export function getService(slug) {
  return services.find((s) => s.slug === slug) || null
}

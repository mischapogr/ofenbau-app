/**
 * Services / Leistungen — drives the homepage service cards, the /leistungen
 * overview, and the per-service detail pages (/leistungen/:slug).
 *
 * `motif` + `tone` feed the BaseImage fallback. `image` points at the
 * project-local realistic WebP assets used by cards and detail pages.
 */
export const serviceContentReview = {
  approvedForLaunch: false,
  note: 'Service wording and proof points must be reviewed against the final operator offer before launch.',
}

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
    proofPoints: [
      'Planung nach Raum, Heizbedarf und Architektur',
      'Material- und Ausführungsdetails vor Baubeginn abgestimmt',
      'Ausführung durch den Ofen- und Fliesenmeisterbetrieb',
    ],
    intro:
      'Ein Ofen ist das Herz des Hauses. Wir planen und bauen Kachelöfen, Grund- und Heizkamine als individuelle Maßanfertigung — abgestimmt auf Raum, Heizbedarf und Architektur.',
  },
  {
    slug: 'schornsteinbau',
    title: 'Schornsteinbau & Sanierung',
    short: 'Sicherer Anschluss',
    description:
      'Neue Schornsteinsysteme, Edelstahlschornsteine und Sanierungen für Kaminofen, Kachelofen und Heizkamin — fachgerecht geplant und montiert.',
    motif: 'chimney',
    tone: 'slate',
    image: '/images/planning-example-schornstein-kaminofen.webp',
    bullets: [
      'Edelstahl-Außenschornsteine für neue Feuerstätten',
      'Schornsteinsanierung und Querschnittsanpassung',
      'Ofenanschluss, Wanddurchführung und Brandschutzdetails',
      'Abstimmung mit dem zuständigen Schornsteinfeger',
    ],
    proofPoints: [
      'Anschlussdetails werden vor Montage geprüft',
      'Brandschutz und Wanddurchführung sind Teil der Planung',
      'Abstimmung mit dem zuständigen Schornsteinfeger vorgesehen',
    ],
    intro:
      'Damit ein Ofen zuverlässig und sicher zieht, muss der Schornstein zum Gerät und zum Gebäude passen. Wir planen und montieren passende Schornsteinsysteme, sanieren bestehende Anlagen und stimmen Anschlüsse sauber auf die Feuerstätte ab.',
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
    proofPoints: [
      'Fugenbild und Verlegeplan werden vorab abgestimmt',
      'Materialauswahl passend zu Raum, Nutzung und Pflegebedarf',
      'Saubere Detailausführung für Anschlüsse, Kanten und Übergänge',
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
    proofPoints: [
      'Entwurf basiert auf Maßen, Fotos und Materialwünschen',
      'Ansichten machen Proportionen und Details vor Ausführung sichtbar',
      'Kalkulation und Machbarkeit werden vor Umsetzung geprüft',
    ],
    intro:
      'Bevor der erste Handgriff getan ist, sehen Sie Ihr Projekt fertig: Wir visualisieren Ofen und Flächen in fotorealistischem 3D, wählen Materialien am Modell und kalkulieren präzise.',
  },
]

export function getService(slug) {
  return services.find((s) => s.slug === slug) || null
}

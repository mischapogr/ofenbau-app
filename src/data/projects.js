/**
 * Completed projects — "Unsere Projekte" gallery. Each item carries a
 * category used by the gallery filter, plus a motif/tone for the fallback
 * and an `image` pointing at the project-local realistic WebP asset.
 */
export const projectCategories = [
  { key: 'all', label: 'Alle' },
  { key: 'kachelofen', label: 'Kachelöfen' },
  { key: 'kaminofen', label: 'Kaminöfen' },
  { key: 'schornstein', label: 'Schornsteinbau' },
  { key: 'fliesen', label: 'Fliesen' },
  { key: 'modern', label: 'Modern' },
  { key: 'klassisch', label: 'Klassisch' },
]

export const projectReferenceReview = {
  approvedForLaunch: false,
  note: 'Demo/generated project references must be replaced with approved real customer references before launch.',
}

const pendingReferenceApproval = {
  realReference: false,
  photoRightsApproved: false,
  customerApproved: false,
  note: 'Replace demo/generated media with a real customer reference and document photo/customer approval before launch.',
}

export const projects = [
  {
    id: 'p1',
    title: 'Kachelofen Landhaus',
    description:
      'Handgesetzter Kachelofen mit klassischer Keramik und lang anhaltender Speicherwärme.',
    material: 'Keramik & Putz',
    category: ['kachelofen', 'klassisch'],
    motif: 'flame',
    tone: 'ember',
    image: '/images/project-1-kachelofen-landhaus.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p2',
    title: 'Heizkamin Panorama',
    description: 'Moderner Heizkamin mit breitem Sichtfeuer und ruhiger Putzfläche.',
    material: 'Stahl, Glas & Putz',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'slate',
    image: '/images/project-2-heizkamin-panorama.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p3',
    title: 'Kachelofen mit Sitzbank',
    description: 'Individuelle Ofenanlage mit Sitzbank, warmem Keramikton und Speichertechnik.',
    material: 'Keramik & Speicherstein',
    category: ['kachelofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
    image: '/images/project-3-kachelofen-sitzbank.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p4',
    title: 'Wohnraum-Fliesen XXL',
    description: 'Großformatige Bodenfliesen mit präzisem Fugenbild für einen offenen Wohnbereich.',
    material: 'Feinsteinzeug',
    category: ['fliesen', 'modern'],
    motif: 'tile',
    tone: 'slate',
    image: '/images/project-4-wohnraum-fliesen-xxl.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p5',
    title: 'Kaminofen Stahl',
    description: 'Kompakter Kaminofen mit reduziertem Anschlussdetail und modernem Stahlkörper.',
    material: 'Stahl & Glas',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'ink',
    image: '/images/project-5-kaminofen-stahl.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p6',
    title: 'Bad in Naturstein',
    description: 'Natursteinoptik, ruhiges Raster und hochwertige Detailausbildung im Nassbereich.',
    material: 'Naturstein & Feinsteinzeug',
    category: ['fliesen', 'klassisch'],
    motif: 'tile',
    tone: 'sand',
    image: '/images/project-6-bad-naturstein.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p7',
    title: 'Grundofen Eck',
    description:
      'Ecklösung mit hoher Speicherleistung und harmonischer Einbindung in den Wohnraum.',
    material: 'Putz & Speicherkeramik',
    category: ['kachelofen', 'modern'],
    motif: 'flame',
    tone: 'ember',
    image: '/images/project-7-grundofen-eck.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p8',
    title: 'Kaminofen Speckstein',
    description:
      'Kaminofen mit Specksteincharakter, kompakter Aufstellung und angenehmer Strahlungswärme.',
    material: 'Speckstein & Stahl',
    category: ['kaminofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
    image: '/images/project-8-kaminofen-speckstein.webp',
    review: { ...pendingReferenceApproval },
  },
  {
    id: 'p9',
    title: 'Edelstahl-Außenschornstein',
    description:
      'Nachgerüsteter Schornstein für einen Kaminofen mit sauberer Wanddurchführung und Fassadenbefestigung.',
    material: 'Edelstahl & Brandschutzdurchführung',
    category: ['schornstein', 'modern'],
    motif: 'chimney',
    tone: 'slate',
    image: '/images/planning-example-schornstein-kaminofen.webp',
    review: { ...pendingReferenceApproval },
  },
]

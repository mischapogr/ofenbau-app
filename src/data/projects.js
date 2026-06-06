/**
 * Completed projects — "Unsere Projekte" gallery. Each item carries a
 * category used by the gallery filter, plus a motif/tone for the fallback
 * and an `image` pointing at the project-local realistic WebP asset.
 */
export const projectCategories = [
  { key: 'all', label: 'Alle' },
  { key: 'kachelofen', label: 'Kachelöfen' },
  { key: 'kaminofen', label: 'Kaminöfen' },
  { key: 'fliesen', label: 'Fliesen' },
  { key: 'modern', label: 'Modern' },
  { key: 'klassisch', label: 'Klassisch' },
]

export const projects = [
  {
    id: 'p1',
    title: 'Kachelofen Landhaus',
    category: ['kachelofen', 'klassisch'],
    motif: 'flame',
    tone: 'ember',
    image: '/images/project-1-kachelofen-landhaus.webp',
  },
  {
    id: 'p2',
    title: 'Heizkamin Panorama',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'slate',
    image: '/images/project-2-heizkamin-panorama.webp',
  },
  {
    id: 'p3',
    title: 'Kachelofen mit Sitzbank',
    category: ['kachelofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
    image: '/images/project-3-kachelofen-sitzbank.webp',
  },
  {
    id: 'p4',
    title: 'Wohnraum-Fliesen XXL',
    category: ['fliesen', 'modern'],
    motif: 'tile',
    tone: 'slate',
    image: '/images/project-4-wohnraum-fliesen-xxl.webp',
  },
  {
    id: 'p5',
    title: 'Kaminofen Stahl',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'ink',
    image: '/images/project-5-kaminofen-stahl.webp',
  },
  {
    id: 'p6',
    title: 'Bad in Naturstein',
    category: ['fliesen', 'klassisch'],
    motif: 'tile',
    tone: 'sand',
    image: '/images/project-6-bad-naturstein.webp',
  },
  {
    id: 'p7',
    title: 'Grundofen Eck',
    category: ['kachelofen', 'modern'],
    motif: 'flame',
    tone: 'ember',
    image: '/images/project-7-grundofen-eck.webp',
  },
  {
    id: 'p8',
    title: 'Kaminofen Speckstein',
    category: ['kaminofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
    image: '/images/project-8-kaminofen-speckstein.webp',
  },
]

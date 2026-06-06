/**
 * Completed projects — "Unsere Projekte" gallery. Each item carries a
 * category used by the gallery filter, plus a motif/tone for the placeholder.
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
  },
  {
    id: 'p2',
    title: 'Heizkamin Panorama',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'slate',
  },
  {
    id: 'p3',
    title: 'Kachelofen mit Sitzbank',
    category: ['kachelofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
  },
  {
    id: 'p4',
    title: 'Wohnraum-Fliesen XXL',
    category: ['fliesen', 'modern'],
    motif: 'tile',
    tone: 'slate',
  },
  {
    id: 'p5',
    title: 'Kaminofen Stahl',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'ink',
  },
  {
    id: 'p6',
    title: 'Bad in Naturstein',
    category: ['fliesen', 'klassisch'],
    motif: 'tile',
    tone: 'sand',
  },
  {
    id: 'p7',
    title: 'Grundofen Eck',
    category: ['kachelofen', 'modern'],
    motif: 'flame',
    tone: 'ember',
  },
  {
    id: 'p8',
    title: 'Kaminofen Speckstein',
    category: ['kaminofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
  },
]

/**
 * Regions / Einsatzgebiete — drives the region-specific local SEO landing pages.
 * Clients searching for a stove builder in these cities will land here.
 */
export const serviceRegions = [
  {
    slug: 'leipzig',
    city: 'Leipzig',
    title: 'Kachelöfen & Kaminbau in Leipzig',
    description:
      'Ofenbau-Meisterbetrieb für Leipzig. Wir entwerfen und bauen Kachelöfen, Heizkamine und Schornsteine nach Maß.',
    intro:
      'Wir sind Ihr regionaler Partner für behagliche Wärme im Raum Leipzig. Als Meisterbetrieb planen und realisieren wir Kachelöfen und Kamine individuell für Ihr Zuhause.',
  },
  {
    slug: 'chemnitz',
    city: 'Chemnitz',
    title: 'Kaminbau & Kachelöfen in Chemnitz',
    description:
      'Ihr Ofenbauer für den Raum Chemnitz. Individuelle Heizkamine, Kachelöfen und Schornsteinsanierung vom Fachbetrieb.',
    intro:
      'Wärme erleben in Chemnitz und Umgebung. Wir entwerfen Ihren Traumofen fotorealistisch in 3D und setzen ihn handwerklich präzise in Ihrer Immobilie um.',
  },
  {
    slug: 'meissen',
    city: 'Meißen',
    title: 'Ofenbauer & Fliesenleger in Meißen',
    description:
      'Ofenbau und Fliesenarbeiten aus einer Hand in Meißen. Meisterqualität für Kachelöfen, Kamine und großformatige Fliesen.',
    intro:
      'Ihr Experte für Ofenbau und Fliesenarbeiten im Raum Meißen. Wir verbinden traditionelles Handwerk mit moderner 3D-Planung für Ihr perfektes Wohnerlebnis.',
  },
  {
    slug: 'nordsachsen',
    city: 'Nordsachsen',
    title: 'Kachelöfen & Kaminbau in Nordsachsen',
    description:
      'Ihr Ofenbauer für den Landkreis Nordsachsen. Individueller Kachel- & Kaminofenbau sowie Schornsteinsanierung vom Meisterbetrieb.',
    intro:
      'Meisterlicher Ofenbau in Nordsachsen. Wir planen und fertigen Ihren Ofen oder Kamin individuell nach Ihren Vorstellungen und Raumgegebenheiten.',
  },
]

export function getRegion(slug) {
  return serviceRegions.find((r) => r.slug === slug) || null
}

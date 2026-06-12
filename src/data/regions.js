/**
 * Regions / Einsatzgebiete - drives the region-specific local SEO landing pages.
 * Keep this as the single source of truth for sitemap, GEO text, JSON-LD and
 * contact-form service-area checks.
 */
export const SERVICE_AREA_RADIUS_KM = 50

const regionCities = [
  { slug: 'leipzig', city: 'Leipzig', area: 'Region Leipzig', lat: 51.3397, lon: 12.3731 },
  {
    slug: 'markkleeberg',
    city: 'Markkleeberg',
    area: 'Region Leipzig',
    lat: 51.2755,
    lon: 12.3691,
  },
  { slug: 'schkeuditz', city: 'Schkeuditz', area: 'Region Leipzig', lat: 51.3968, lon: 12.2216 },
  { slug: 'taucha', city: 'Taucha', area: 'Region Leipzig', lat: 51.3833, lon: 12.4833 },
  {
    slug: 'markranstaedt',
    city: 'Markranstädt',
    area: 'Region Leipzig',
    lat: 51.3009,
    lon: 12.2202,
    aliases: ['markranstadt'],
  },
  { slug: 'zwenkau', city: 'Zwenkau', area: 'Region Leipzig', lat: 51.2187, lon: 12.3307 },
  {
    slug: 'boehlen',
    city: 'Böhlen',
    area: 'Region Leipzig',
    lat: 51.2002,
    lon: 12.3869,
    aliases: ['bohlen'],
  },
  {
    slug: 'roetha',
    city: 'Rötha',
    area: 'Region Leipzig',
    lat: 51.1975,
    lon: 12.4144,
    aliases: ['rotha'],
  },
  { slug: 'borna', city: 'Borna', area: 'Region Leipzig', lat: 51.1242, lon: 12.4962 },
  { slug: 'brandis', city: 'Brandis', area: 'Region Leipzig', lat: 51.3358, lon: 12.6102 },
  { slug: 'wurzen', city: 'Wurzen', area: 'Region Leipzig', lat: 51.3707, lon: 12.7394 },
  { slug: 'grimma', city: 'Grimma', area: 'Region Leipzig', lat: 51.2384, lon: 12.7254 },
  { slug: 'bad-lausick', city: 'Bad Lausick', area: 'Region Leipzig', lat: 51.1445, lon: 12.6447 },
  { slug: 'colditz', city: 'Colditz', area: 'Region Leipzig', lat: 51.1282, lon: 12.8029 },
  {
    slug: 'nordsachsen',
    city: 'Nordsachsen',
    area: 'Landkreis Nordsachsen',
    lat: 51.5584,
    lon: 13.0043,
  },
  {
    slug: 'delitzsch',
    city: 'Delitzsch',
    area: 'Landkreis Nordsachsen',
    lat: 51.5255,
    lon: 12.3428,
  },
  {
    slug: 'eilenburg',
    city: 'Eilenburg',
    area: 'Landkreis Nordsachsen',
    lat: 51.4598,
    lon: 12.6334,
  },
  {
    slug: 'bad-dueben',
    city: 'Bad Düben',
    area: 'Landkreis Nordsachsen',
    lat: 51.5917,
    lon: 12.5849,
    aliases: ['bad duben'],
  },
  { slug: 'torgau', city: 'Torgau', area: 'Landkreis Nordsachsen', lat: 51.5602, lon: 13.0068 },
  { slug: 'oschatz', city: 'Oschatz', area: 'Landkreis Nordsachsen', lat: 51.3001, lon: 13.1098 },
  { slug: 'wermsdorf', city: 'Wermsdorf', area: 'Landkreis Nordsachsen', lat: 51.2833, lon: 12.95 },
  { slug: 'dahlen', city: 'Dahlen', area: 'Landkreis Nordsachsen', lat: 51.3644, lon: 12.9985 },
  {
    slug: 'muegeln',
    city: 'Mügeln',
    area: 'Landkreis Nordsachsen',
    lat: 51.2368,
    lon: 13.0456,
    aliases: ['mugeln'],
  },
  {
    slug: 'belgern-schildau',
    city: 'Belgern-Schildau',
    area: 'Landkreis Nordsachsen',
    lat: 51.4826,
    lon: 13.1247,
    aliases: ['belgern', 'schildau'],
  },
  {
    slug: 'dommitzsch',
    city: 'Dommitzsch',
    area: 'Landkreis Nordsachsen',
    lat: 51.6403,
    lon: 12.8797,
  },
]

function buildRegion(entry) {
  const isDistrict = entry.slug === 'nordsachsen'
  const locationLabel = isDistrict ? 'im Landkreis Nordsachsen' : `in ${entry.city}`
  const areaLabel = entry.area.startsWith('Landkreis') ? `im ${entry.area}` : `in der ${entry.area}`

  return {
    ...entry,
    title: `Kachelöfen & Kaminbau ${locationLabel}`,
    description: `Ofenbau-Meisterbetrieb für ${entry.city} und Umgebung. Individuelle Kachelöfen, Heizkamine, Kaminbau und Schornsteinsanierung im Umkreis von ${SERVICE_AREA_RADIUS_KM} km.`,
    intro: `Wir sind Ihr regionaler Partner für behagliche Wärme ${locationLabel}. Als Meisterbetrieb planen und realisieren wir Kachelöfen, Kamine und Fliesenarbeiten individuell für Ihr Zuhause ${areaLabel}.`,
    aliases: [entry.city, entry.slug, ...(entry.aliases || [])],
  }
}

export const serviceRegions = regionCities.map(buildRegion)

export function getRegion(slug) {
  return serviceRegions.find((r) => r.slug === slug) || null
}

export function getServiceAreaAliases(tier = 'premium') {
  return getActiveRegions(tier)
    .flatMap((region) => region.aliases || [region.city, region.slug])
    .map((alias) => alias.toLowerCase())
}

/**
 * Regional landing pages are a premium ("multi-region local SEO") feature.
 * Basis ships none. Pure + tier-param so the Vue app and Node build scripts agree.
 */
export function getActiveRegions(tier = 'premium') {
  return tier === 'basis' ? [] : serviceRegions
}

/**
 * Company profile + global navigation / contact data.
 * Single source of truth for NAP (name, address, phone) used across the
 * header, footer, contact page and structured data.
 */
export const companyProfileReview = {
  napApprovedForLaunch: false,
  googleBusinessProfileAligned: false,
  mapRouteVerified: false,
  note: 'Company NAP, opening hours, service area and social links must match the final operator data and Google Business Profile before launch.',
}

export const company = {
  name: 'Ofenbau Mustermann',
  legalName: 'Ofenbau Mustermann — Ofen- & Fliesenmeister',
  tagline: 'Ofen- & Fliesenmeister',
  claim: 'Mit gesunder Wärme leben.',
  address: {
    street: 'Musterstraße 1',
    zip: '12345',
    city: 'Musterstadt',
    region: 'Musterstadt und Umgebung',
  },
  phone: { label: '+49 (0) 000 000000', href: 'tel:+49000000000' },
  whatsapp: {
    label: '+49 (0) 000 000000',
    href: 'https://wa.me/49000000000',
    availability: 'Mo-Fr 08:00-17:00 Uhr erreichbar',
  },
  email: { label: 'info@ofenbau-mustermann.test', href: 'mailto:info@ofenbau-mustermann.test' },
  hours: 'Mo–Fr 08:00–17:00 Uhr',
}

export const primaryNav = [
  { name: 'Start', to: { name: 'home' } },
  { name: 'Leistungen', to: { name: 'services' } },
  { name: 'Projekte', to: { name: 'projects' } },
  { name: '3D erleben', to: { name: 'service-detail', params: { slug: '3d-planung' } } },
  { name: 'Über uns', to: { name: 'about' } },
  { name: 'Kontakt', to: { name: 'contact' } },
]

export const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'Pinterest', href: 'https://pinterest.com', icon: 'pinterest' },
]

export function isGenericSocialLink(link) {
  return /^https:\/\/(instagram|facebook|pinterest)\.com\/?$/i.test(link?.href || '')
}

export const publicSocialLinks = socialLinks.filter((link) => !isGenericSocialLink(link))

export const trustBadges = [
  'Meisterbetrieb',
  'Handwerk seit Generationen',
  'Regional in Musterstadt',
]

export function isGenericTrustBadge(badge) {
  return /muster|beispiel|demo|placeholder/i.test(String(badge || ''))
}

export const publicTrustBadges = trustBadges.filter((badge) => !isGenericTrustBadge(badge))

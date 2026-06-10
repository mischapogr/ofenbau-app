export const homepageContentReview = {
  approvedForLaunch: false,
  note: 'Homepage hero, about, process, CTA copy, public proof claims and media must be reviewed against the final operator material before launch.',
}

const pendingHomepageApproval = {
  copyApproved: false,
  mediaApproved: false,
  note: 'Confirm this homepage section uses final approved copy, claims and media before launch.',
}

export const homepageHeroStats = [
  { value: '30+', label: 'Jahre Erfahrung' },
  { value: '800+', label: 'Öfen & Projekte' },
  { value: '100%', label: 'Meisterarbeit' },
]

export const homepageAssets = {
  hero: {
    image: '/images/hero.webp',
    alt: 'Moderner Kaminofen mit Sichtfeuer in einem hellen Wohnraum',
    // Optional Ken-Burns intro loop (npm run gen:video) — remove to disable.
    video: {
      webm: '/videos/intro.webm',
      mp4: '/videos/intro.mp4',
      poster: '/videos/intro-poster.webp',
    },
  },
  about: {
    image: '/images/about-craft.webp',
    alt: 'Ofen- und Fliesenmeister bei der Arbeit',
  },
}

export const homepageReviewSections = [
  {
    id: 'hero',
    label: 'Hero claim, introduction, proof stats and hero image',
    source: 'src/components/HeroSection.vue',
    image: homepageAssets.hero.image,
    review: { ...pendingHomepageApproval },
  },
  {
    id: 'about',
    label: 'About teaser, craft claims, regional claim and about image',
    source: 'src/components/AboutSection.vue',
    image: homepageAssets.about.image,
    review: { ...pendingHomepageApproval },
  },
  {
    id: 'process',
    label: 'Homepage process timeline wording',
    source: 'src/data/process.js and src/components/ProcessTimeline.vue',
    image: '',
    review: { ...pendingHomepageApproval, mediaApproved: true },
  },
  {
    id: 'cta',
    label: 'Homepage consultation CTA wording',
    source: 'src/components/CTASection.vue',
    image: '',
    review: { ...pendingHomepageApproval, mediaApproved: true },
  },
]

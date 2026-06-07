export const publicPageContentReview = {
  approvedForLaunch: false,
  note: 'Standalone public page copy for about and contact pages must be reviewed against the final operator positioning before launch.',
}

const pendingPageApproval = {
  copyApproved: false,
  note: 'Confirm this public page section uses final approved copy before launch.',
}

export const aboutValues = [
  {
    title: 'Handwerk',
    text: 'Jeder Ofen entsteht in präziser Handarbeit — kein Stück gleicht dem anderen.',
  },
  {
    title: 'Qualität',
    text: 'Wir setzen auf langlebige Materialien und saubere, geprüfte Ausführung.',
  },
  {
    title: 'Vertrauen',
    text: 'Transparente Beratung und verlässliche Termine, von Anfang bis Übergabe.',
  },
]

export const publicPageReviewSections = [
  {
    id: 'about-header',
    page: '/ueber-uns',
    label: 'About page header claim and subtitle',
    source: 'src/pages/AboutView.vue',
    review: { ...pendingPageApproval },
  },
  {
    id: 'about-values',
    page: '/ueber-uns',
    label: 'About page value cards',
    source: 'src/data/pages.js -> aboutValues',
    review: { ...pendingPageApproval },
  },
  {
    id: 'contact-header',
    page: '/kontakt',
    label: 'Contact page header and consultation intro copy',
    source: 'src/pages/ContactView.vue',
    review: { ...pendingPageApproval },
  },
  {
    id: 'contact-form-intro',
    page: '/kontakt',
    label: 'Contact form heading, helper text and submit wording',
    source: 'src/pages/ContactView.vue and src/components/ContactForm.vue',
    review: { ...pendingPageApproval },
  },
]

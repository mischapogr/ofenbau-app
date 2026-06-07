<script setup>
import CookieConsent from '@/components/CookieConsent.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useJsonLd } from '@/composables/useJsonLd'
import { useAnalytics } from '@/composables/useAnalytics'
import { company } from '@/data/company'

const SITE_URL = (import.meta.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const googleSiteVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION

if (googleSiteVerification) {
  let verificationMeta = document.head.querySelector('meta[name="google-site-verification"]')
  if (!verificationMeta) {
    verificationMeta = document.createElement('meta')
    verificationMeta.setAttribute('name', 'google-site-verification')
    document.head.appendChild(verificationMeta)
  }
  verificationMeta.setAttribute('content', googleSiteVerification)
}

useAnalytics()

useJsonLd(
  {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: company.name,
    legalName: company.legalName,
    image: `${SITE_URL}/logo.svg`,
    description:
      'Individueller Kachel- & Kaminofenbau, Fliesenarbeiten und 3D-Planung vom Meisterbetrieb.',
    '@id': `${SITE_URL}/#business`,
    url: `${SITE_URL}/`,
    telephone: company.phone.label,
    email: company.email.label,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      postalCode: company.address.zip,
      addressLocality: company.address.city,
      addressCountry: 'DE',
    },
    areaServed: company.address.region,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
  },
  'local-business-jsonld'
)
</script>

<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </DefaultLayout>
  <CookieConsent />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

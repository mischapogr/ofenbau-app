<script setup>
import CookieConsent from '@/components/CookieConsent.vue'
import DemoProtection from '@/components/DemoProtection.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useDemoProtection } from '@/composables/useDemoProtection'
import { useJsonLd } from '@/composables/useJsonLd'
import { useAnalytics } from '@/composables/useAnalytics'
import { company } from '@/data/company'
import { getActiveServices } from '@/data/services'
import { getActiveRegions } from '@/data/regions'
import { tier } from '@/config/tier'

const SITE_URL = (import.meta.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const googleSiteVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION
const demoProtection = useDemoProtection()

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
    areaServed: getActiveRegions(tier).map((region) => ({
      '@type': region.slug === 'nordsachsen' ? 'AdministrativeArea' : 'City',
      name: region.city,
    })),
    knowsAbout: getActiveServices(tier).map((service) => service.title),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    potentialAction: {
      '@type': 'CommunicateAction',
      name: 'Beratung anfragen',
      target: `${SITE_URL}/kontakt`,
    },
  },
  'local-business-jsonld'
)
</script>

<template>
  <DemoProtection :protection="demoProtection" />
  <DefaultLayout v-if="!demoProtection.blocksApp">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </DefaultLayout>
  <CookieConsent v-if="!demoProtection.blocksApp" />
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

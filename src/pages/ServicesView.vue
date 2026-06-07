<script setup>
import PageHeader from '@/components/PageHeader.vue'
import ServiceCards from '@/components/ServiceCards.vue'
import ProcessTimeline from '@/components/ProcessTimeline.vue'
import CTASection from '@/components/CTASection.vue'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Leistungen',
  description:
    'Kachelöfen, Kaminbau, Schornsteinbau, Fliesenarbeiten und 3D-Planung vom Meisterbetrieb — Planung, Bau und Service aus einer Hand.',
  path: '/leistungen',
}))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Leistungen"
      title="Alles für Wärme und Raum — aus einer Hand"
      subtitle="Vom handgesetzten Kachelofen über sichere Schornsteinsysteme und meisterhafte Fliesenarbeiten bis zur fotorealistischen 3D-Planung. Wählen Sie einen Bereich für Details."
      :crumbs="[{ name: 'Leistungen', to: { name: 'services' } }]"
    />
    <ServiceCards />
    <ProcessTimeline />
    <CTASection />
  </div>
</template>

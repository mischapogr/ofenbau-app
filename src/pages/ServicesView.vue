<script setup>
import PageHeader from '@/components/PageHeader.vue'
import ServiceCards from '@/components/ServiceCards.vue'
import ProcessTimeline from '@/components/ProcessTimeline.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BudgetEstimator from '@/components/BudgetEstimator.vue'
import CTASection from '@/components/CTASection.vue'
import { useSeo } from '@/composables/useSeo'
import { hasFeature } from '@/config/tier'

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

    <section
      v-if="hasFeature('calculators')"
      id="budget-kalkulator"
      class="section bg-surface border-t border-content-muted/10 scroll-mt-16 lg:scroll-mt-20 focus:outline-none"
      tabindex="-1"
    >
      <BaseContainer class="max-w-4xl">
        <BudgetEstimator v-reveal />
      </BaseContainer>
    </section>

    <CTASection />
  </div>
</template>

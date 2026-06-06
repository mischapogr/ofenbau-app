<script setup>
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseCard from '@/components/BaseCard.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProcessTimeline from '@/components/ProcessTimeline.vue'
import CTASection from '@/components/CTASection.vue'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Über uns',
  description: 'Tradition, Handwerk und moderne Technik — der Meisterbetrieb hinter Ihrer Wärme.',
  path: '/ueber-uns',
}))

const values = [
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
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Über uns"
      title="Ein Meisterbetrieb mit Geschichte"
      subtitle="Seit Generationen bauen wir Öfen, Kamine und Flächen, die Wärme und Charakter ins Zuhause bringen."
      :crumbs="[{ name: 'Über uns', to: { name: 'about' } }]"
    />

    <AboutSection :show-cta="false" />

    <section class="section bg-surface-muted">
      <BaseContainer>
        <div class="grid gap-6 sm:grid-cols-3">
          <BaseCard
            v-for="(v, i) in values"
            :key="v.title"
            v-reveal="{ delay: i * 90 }"
            class="p-7"
          >
            <h3 class="font-display text-lg font-semibold text-brand-600">{{ v.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-content-muted">{{ v.text }}</p>
          </BaseCard>
        </div>
      </BaseContainer>
    </section>

    <ProcessTimeline />
    <CTASection />
  </div>
</template>

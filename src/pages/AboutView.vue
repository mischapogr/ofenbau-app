<script setup>
import BaseContainer from '@/components/BaseContainer.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Über uns',
  description: 'Tradition, Handwerk und moderne Technik seit Generationen.',
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
  <section class="section">
    <BaseContainer class="grid gap-12 lg:grid-cols-2 lg:items-center">
      <div>
        <h1 class="font-display text-4xl font-bold sm:text-5xl">Über uns</h1>
        <p class="mt-4 text-lg leading-relaxed text-content-muted">
          Ofenbau Mustermann ist ein Meisterbetrieb mit langer Tradition. Was als kleine Werkstatt
          begann, ist heute eine feste Größe im Ofen- und Kaminbau der Region.
        </p>
        <p class="mt-4 leading-relaxed text-content-muted">
          Wir verbinden überliefertes Handwerk mit moderner Verbrennungs- und Speichertechnik — für
          Wärme, die effizient, sicher und schön ist.
        </p>
      </div>
      <div
        class="aspect-video rounded-2xl bg-gradient-to-br from-brand-300 to-brand-700 shadow-card"
      />
    </BaseContainer>

    <BaseContainer class="mt-16">
      <div class="grid gap-6 sm:grid-cols-3">
        <BaseCard v-for="v in values" :key="v.title" class="p-6">
          <h3 class="text-lg font-semibold text-brand-600">{{ v.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-content-muted">{{ v.text }}</p>
        </BaseCard>
      </div>
    </BaseContainer>
  </section>
</template>

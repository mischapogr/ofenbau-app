<script setup>
import BaseContainer from '@/components/BaseContainer.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Leistungen',
  description: 'Kachelöfen, Heizkamine, Kaminöfen, Sanierung und Wartung vom Meisterbetrieb.',
  path: '/leistungen',
}))

const services = [
  {
    icon: 'flame',
    title: 'Kachelöfen & Grundöfen',
    description: 'Handgesetzte Speicheröfen für gleichmäßige, langanhaltende Strahlungswärme.',
  },
  {
    icon: 'fire',
    title: 'Heizkamine',
    description: 'Kamine mit großzügigem Sichtfeuer und effizienter Verbrennungstechnik.',
  },
  {
    icon: 'fire',
    title: 'Kaminöfen',
    description: 'Hochwertige Einzelöfen — schnell warm und in vielen Designs erhältlich.',
  },
  {
    icon: 'tools',
    title: 'Sanierung',
    description:
      'Modernisierung bestehender Anlagen nach aktuellen Sicherheits- und Emissionsstandards.',
  },
  {
    icon: 'tools',
    title: 'Wartung & Service',
    description: 'Regelmäßige Prüfung, Reinigung und Reparatur für einen sicheren Betrieb.',
  },
  {
    icon: 'leaf',
    title: 'Beratung & Planung',
    description: 'Individuelle Konzepte abgestimmt auf Raum, Heizbedarf und Architektur.',
  },
]
</script>

<template>
  <section class="section">
    <BaseContainer>
      <div class="max-w-2xl">
        <h1 class="font-display text-4xl font-bold sm:text-5xl">Leistungen</h1>
        <p class="mt-4 text-lg text-content-muted">
          Vom klassischen Kachelofen bis zur modernen Kaminanlage — wir begleiten Ihr Projekt von
          der Idee bis zur fertigen Wärmequelle.
        </p>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          v-for="s in services"
          :key="s.title"
          :icon="s.icon"
          :title="s.title"
          :description="s.description"
        />
      </div>
    </BaseContainer>
  </section>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
import ServiceCard from './ServiceCard.vue'
import { services } from '@/data/services'
</script>

<template>
  <BaseSection
    surface="muted"
    eyebrow="Unsere Leistungen"
    title="Handwerk für Wärme und Raum"
    subtitle="Kachelöfen, Schornsteine, Kamine und Fliesen — Planung, Bau und Service aus einer Hand."
  >
    <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="(service, i) in services" :key="service.slug" v-reveal="{ delay: i * 90 }">
        <ServiceCard :service="service" />
      </div>
    </div>
  </BaseSection>
</template>

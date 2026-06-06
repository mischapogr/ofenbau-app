<script setup>
import BaseContainer from '@/components/BaseContainer.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Seite nicht gefunden',
  description: 'Diese Seite existiert nicht.',
  path: '/404',
}))
</script>

<template>
  <section class="section">
    <BaseContainer class="flex flex-col items-center py-24 text-center">
      <p class="font-display text-7xl font-bold text-brand-600">404</p>
      <h1 class="mt-4 text-2xl font-bold">Seite nicht gefunden</h1>
      <p class="mt-2 max-w-md text-content-muted">
        Die angeforderte Seite existiert nicht oder wurde verschoben.
      </p>
      <BaseButton :to="{ name: 'home' }" size="lg" class="mt-8">Zur Startseite</BaseButton>
    </BaseContainer>
  </section>
</template>

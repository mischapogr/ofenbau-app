<script setup>
import BaseContainer from './BaseContainer.vue'
import Breadcrumbs from './Breadcrumbs.vue'

/**
 * PageHeader — subpage banner with breadcrumbs, eyebrow, title and subtitle.
 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  crumbs: { type: Array, default: () => [] },
})
</script>

<template>
  <Breadcrumbs v-if="crumbs.length" :items="crumbs" />
  <section class="bg-surface-muted">
    <BaseContainer class="py-14 sm:py-20">
      <div class="max-w-3xl">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 class="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-5 text-lg leading-relaxed text-content-muted">
          {{ subtitle }}
        </p>
      </div>
    </BaseContainer>
  </section>
</template>

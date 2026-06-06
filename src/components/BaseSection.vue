<script setup>
import BaseContainer from './BaseContainer.vue'

/**
 * BaseSection — consistent vertical rhythm + optional centered section header
 * (eyebrow / title / subtitle). `surface` switches the background tone.
 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  surface: { type: String, default: 'default' }, // default | muted | sand | ink
  align: { type: String, default: 'center' }, // center | left
  as: { type: String, default: 'section' },
})

const surfaces = {
  default: 'bg-surface text-content',
  muted: 'bg-surface-muted text-content',
  sand: 'bg-surface-sand text-content',
  ink: 'bg-ink-900 text-white',
}
</script>

<template>
  <component :is="as" class="section" :class="surfaces[surface] || surfaces.default">
    <BaseContainer>
      <header
        v-if="eyebrow || title || subtitle"
        v-reveal
        class="mb-12 max-w-2xl sm:mb-16"
        :class="align === 'center' ? 'mx-auto text-center' : ''"
      >
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2
          v-if="title"
          class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]"
        >
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="mt-4 text-lg leading-relaxed"
          :class="surface === 'ink' ? 'text-white/70' : 'text-content-muted'"
        >
          {{ subtitle }}
        </p>
      </header>
      <slot />
    </BaseContainer>
  </component>
</template>

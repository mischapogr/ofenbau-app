<script setup>
import BaseCard from './BaseCard.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'flame' }, // flame | fire | tools | leaf
})
</script>

<template>
  <BaseCard hoverable class="p-6">
    <div
      class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40"
    >
      <svg
        class="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <template v-if="icon === 'flame' || icon === 'fire'">
          <path
            d="M12 3c1.5 3 5 4.5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-5 .5 1.5 1.5 2 2 2-.5-2-1-4 1-6z"
          />
        </template>
        <template v-else-if="icon === 'tools'">
          <path
            d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z"
          />
        </template>
        <template v-else>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 5 .5 13-6 18-3-.5-5-2-7-5" />
        </template>
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-content">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm leading-relaxed text-content-muted">
      {{ description }}
    </p>
    <slot />
  </BaseCard>
</template>

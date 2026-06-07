<script setup>
import { RouterLink } from 'vue-router'
import BaseImage from './BaseImage.vue'
import AppIcon from './AppIcon.vue'

/**
 * ServiceCard — a single, fully-clickable service tile (image + title + copy).
 */
defineProps({
  service: { type: Object, required: true },
})
</script>

<template>
  <RouterLink
    :to="{ name: 'service-detail', params: { slug: service.slug } }"
    class="press-feedback group flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-content-muted/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
  >
    <div class="relative overflow-hidden">
      <BaseImage
        :src="service.image"
        :motif="service.motif"
        :tone="service.tone"
        rounded="rounded-none"
        ratio="16/10"
        :alt="service.title"
        class="transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span
        class="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-brand-600 shadow-sm backdrop-blur"
      >
        <AppIcon :name="service.motif" class="h-5 w-5" />
      </span>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <p class="eyebrow">{{ service.short }}</p>
      <h3 class="mt-2 font-display text-xl font-semibold text-content">{{ service.title }}</h3>
      <p class="mt-2 flex-1 text-sm leading-relaxed text-content-muted">
        {{ service.description }}
      </p>
      <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
        Mehr erfahren
        <AppIcon
          name="arrow"
          class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </div>
  </RouterLink>
</template>

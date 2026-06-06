<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import BaseContainer from './BaseContainer.vue'
import AppIcon from './AppIcon.vue'
import { useJsonLd } from '@/composables/useJsonLd'

/**
 * Breadcrumbs — shown on subpages. Emits BreadcrumbList structured data.
 * `items`: [{ name, to }] — the last item is rendered as the current page.
 */
const props = defineProps({
  items: { type: Array, required: true },
})

const SITE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
const full = computed(() => [{ name: 'Start', to: { name: 'home' } }, ...props.items])

// Resolve a path string for JSON-LD (best-effort from named routes).
const pathFor = {
  home: '/',
  services: '/leistungen',
  projects: '/projekte',
  about: '/ueber-uns',
  contact: '/kontakt',
}

useJsonLd(
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: full.value.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${pathFor[c.to?.name] || ''}`,
    })),
  },
  'breadcrumb-jsonld'
)
</script>

<template>
  <nav aria-label="Brotkrumen" class="border-b border-content-muted/10 bg-surface-muted/60">
    <BaseContainer class="flex items-center gap-1.5 py-3 text-sm">
      <template v-for="(crumb, i) in full" :key="i">
        <AppIcon v-if="i > 0" name="chevron" class="h-3.5 w-3.5 shrink-0 text-content-muted/50" />
        <RouterLink
          v-if="i < full.length - 1"
          :to="crumb.to"
          class="text-content-muted transition-colors hover:text-brand-600"
        >
          {{ crumb.name }}
        </RouterLink>
        <span v-else class="font-medium text-content" aria-current="page">{{ crumb.name }}</span>
      </template>
    </BaseContainer>
  </nav>
</template>

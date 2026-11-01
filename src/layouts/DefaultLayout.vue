<script setup>
import AppHeader from './AppHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface text-content">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
    >
      Zum Inhalt springen
    </a>
    <AppHeader />
    <main
      id="main"
      class="min-h-screen flex-1 scroll-mt-16 lg:scroll-mt-20 focus:outline-none"
      tabindex="-1"
    >
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

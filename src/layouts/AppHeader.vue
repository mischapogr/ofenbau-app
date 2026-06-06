<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseButton from '@/components/BaseButton.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const navItems = [
  { name: 'Start', to: { name: 'home' } },
  { name: 'Leistungen', to: { name: 'services' } },
  { name: 'Über uns', to: { name: 'about' } },
  { name: 'Kontakt', to: { name: 'contact' } },
]

const mobileOpen = ref(false)
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-content-muted/10 bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/70"
  >
    <BaseContainer class="flex h-16 items-center justify-between gap-4">
      <RouterLink
        :to="{ name: 'home' }"
        class="flex items-center gap-2 font-display text-lg font-bold"
      >
        <img src="/favicon.svg" alt="" class="h-8 w-8" />
        <span>Ofenbau <span class="text-brand-600">Mustermann</span></span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Hauptnavigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-content-muted transition-colors hover:text-content"
          active-class="text-brand-600"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <BaseButton :to="{ name: 'contact' }" size="sm" class="hidden sm:inline-flex">
          Beratung anfragen
        </BaseButton>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-content hover:bg-surface-muted md:hidden"
          :aria-expanded="mobileOpen"
          aria-label="Menü umschalten"
          @click="mobileOpen = !mobileOpen"
        >
          <svg
            v-if="!mobileOpen"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg
            v-else
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </BaseContainer>

    <!-- Mobile nav -->
    <Transition name="slide">
      <nav
        v-if="mobileOpen"
        class="border-t border-content-muted/10 md:hidden"
        aria-label="Mobile Navigation"
      >
        <BaseContainer class="flex flex-col py-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="rounded-lg px-3 py-3 text-base font-medium text-content-muted hover:bg-surface-muted hover:text-content"
            active-class="text-brand-600"
            @click="mobileOpen = false"
          >
            {{ item.name }}
          </RouterLink>
          <BaseButton :to="{ name: 'contact' }" block class="mt-2" @click="mobileOpen = false">
            Beratung anfragen
          </BaseButton>
        </BaseContainer>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

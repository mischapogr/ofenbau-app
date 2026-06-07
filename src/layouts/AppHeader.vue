<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseButton from '@/components/BaseButton.vue'
import AppIcon from '@/components/AppIcon.vue'
import { primaryNav, company } from '@/data/company'

const mobileOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function closeMobileMenu() {
  mobileOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b bg-surface/90 backdrop-blur transition-shadow supports-[backdrop-filter]:bg-surface/75"
    :class="scrolled ? 'border-content-muted/10 shadow-sm' : 'border-transparent'"
    @keydown.esc="closeMobileMenu"
  >
    <BaseContainer class="flex h-16 items-center justify-between gap-4 lg:h-20">
      <RouterLink
        :to="{ name: 'home' }"
        class="flex items-center gap-2.5 font-display text-lg font-semibold"
      >
        <img src="/logo.svg" alt="" class="h-9 w-9" />
        <span class="leading-none">
          {{ company.name }}
          <span
            class="mt-0.5 block font-sans text-[0.65rem] font-normal uppercase tracking-label text-content-muted"
          >
            {{ company.tagline }}
          </span>
        </span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
        <RouterLink
          v-for="item in primaryNav"
          :key="item.name"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-content-muted underline-offset-8 decoration-2 transition-colors hover:text-content"
          active-class="text-brand-600"
          exact-active-class="underline decoration-brand-500"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <BaseButton
          :to="{ name: 'contact', query: { topic: 'beratung' } }"
          size="sm"
          class="hidden sm:inline-flex"
        >
          Beratung vereinbaren
        </BaseButton>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="press-feedback inline-flex h-10 w-10 items-center justify-center rounded-lg text-content hover:bg-surface-muted lg:hidden"
          :aria-expanded="mobileOpen"
          aria-label="Menü umschalten"
          @click="mobileOpen = !mobileOpen"
        >
          <AppIcon :name="mobileOpen ? 'close' : 'menu'" class="h-6 w-6" />
        </button>
      </div>
    </BaseContainer>

    <!-- Mobile nav -->
    <Transition name="slide">
      <nav
        v-if="mobileOpen"
        class="border-t border-content-muted/10 bg-surface lg:hidden"
        aria-label="Mobile Navigation"
      >
        <BaseContainer class="flex flex-col py-3">
          <RouterLink
            v-for="item in primaryNav"
            :key="item.name"
            :to="item.to"
            class="press-feedback rounded-lg px-3 py-3 text-base font-medium text-content-muted underline-offset-8 decoration-2 hover:bg-surface-muted hover:text-content"
            active-class="text-brand-600"
            exact-active-class="underline decoration-brand-500"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </RouterLink>
          <BaseButton
            :to="{ name: 'contact', query: { topic: 'beratung' } }"
            block
            class="mt-3"
            @click="closeMobileMenu"
          >
            Beratung vereinbaren
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

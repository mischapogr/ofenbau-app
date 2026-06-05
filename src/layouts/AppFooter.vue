<script setup>
import { RouterLink } from 'vue-router'
import BaseContainer from '@/components/BaseContainer.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto border-t border-content-muted/10 bg-surface-muted/60">
    <BaseContainer class="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="flex items-center gap-2 font-display text-lg font-bold">
          <img src="/favicon.svg" alt="" class="h-8 w-8" />
          Ofenbau Mustermann
        </div>
        <p class="mt-3 max-w-xs text-sm text-content-muted">
          Meisterhafter Ofenbau seit Generationen. Kachelöfen, Kamine und individuelle Wärmelösungen
          für Ihr Zuhause.
        </p>
      </div>

      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wide text-content-muted">Leistungen</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li>
            <RouterLink :to="{ name: 'services' }" class="hover:text-brand-600"
              >Kachelöfen</RouterLink
            >
          </li>
          <li>
            <RouterLink :to="{ name: 'services' }" class="hover:text-brand-600"
              >Heizkamine</RouterLink
            >
          </li>
          <li>
            <RouterLink :to="{ name: 'services' }" class="hover:text-brand-600"
              >Sanierung</RouterLink
            >
          </li>
          <li>
            <RouterLink :to="{ name: 'services' }" class="hover:text-brand-600">Wartung</RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wide text-content-muted">
          Unternehmen
        </h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li>
            <RouterLink :to="{ name: 'about' }" class="hover:text-brand-600">Über uns</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: 'contact' }" class="hover:text-brand-600">Kontakt</RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-semibold uppercase tracking-wide text-content-muted">Kontakt</h4>
        <address class="mt-3 space-y-2 text-sm not-italic text-content-muted">
          <p>Musterstraße 1<br />12345 Musterstadt</p>
          <p><a href="tel:+490000000000" class="hover:text-brand-600">+49 (0) 000 000000</a></p>
          <p>
            <a href="mailto:info@ofenbau-mustermann.test" class="hover:text-brand-600"
              >info@ofenbau-mustermann.test</a
            >
          </p>
        </address>
      </div>
    </BaseContainer>

    <div class="border-t border-content-muted/10">
      <BaseContainer
        class="flex flex-col items-center justify-between gap-2 py-4 text-xs text-content-muted sm:flex-row"
      >
        <p>&copy; {{ year }} Ofenbau Mustermann. Alle Rechte vorbehalten.</p>
        <p class="flex gap-4">
          <a href="#" class="hover:text-brand-600">Impressum</a>
          <a href="#" class="hover:text-brand-600">Datenschutz</a>
        </p>
      </BaseContainer>
    </div>
  </footer>
</template>

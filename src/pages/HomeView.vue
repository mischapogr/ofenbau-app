<script setup>
import { computed } from 'vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseButton from '@/components/BaseButton.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import AppLoader from '@/components/AppLoader.vue'
import AppError from '@/components/AppError.vue'
import { useApi } from '@/composables/useApi'
import { useSeo } from '@/composables/useSeo'
import { fetchServices } from '@/services/contentService'

useSeo(() => ({
  title: 'Ofenbau Mustermann — Kachelöfen, Kamine & Ofenbau',
  description:
    'Meisterhafter Ofenbau, Kachelöfen und Kamine — handwerkliche Wärme für Ihr Zuhause.',
  path: '/',
}))

// Static fallback content so the page is meaningful without a backend.
const fallbackServices = [
  {
    id: 1,
    icon: 'flame',
    title: 'Kachelöfen',
    description: 'Individuell geplante Grundöfen und Kachelöfen mit hoher Speicherwärme.',
  },
  {
    id: 2,
    icon: 'fire',
    title: 'Heizkamine',
    description: 'Moderne Kamine mit Sichtfeuer und effizienter Wärmenutzung.',
  },
  {
    id: 3,
    icon: 'tools',
    title: 'Sanierung & Wartung',
    description: 'Bestandsöfen prüfen, modernisieren und sicher betreiben.',
  },
]

// Demonstrates the Axios + useApi loading/error flow. If no API is configured
// the request fails gracefully and we fall back to local content.
const { data, isLoading, error, execute } = useApi(fetchServices, { immediate: true })
const services = computed(() =>
  Array.isArray(data.value) && data.value.length ? data.value : fallbackServices
)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-surface to-surface dark:from-brand-950/30"
      />
      <BaseContainer class="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <span
            class="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
          >
            Meisterbetrieb · Handwerk seit Generationen
          </span>
          <h1 class="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Wärme, die <span class="text-brand-600">bleibt.</span>
          </h1>
          <p class="mt-5 max-w-xl text-lg leading-relaxed text-content-muted">
            Vom ersten Entwurf bis zum letzten Handgriff: Wir bauen Kachelöfen und Kamine, die Ihr
            Zuhause über Jahrzehnte behaglich machen.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <BaseButton :to="{ name: 'contact' }" size="lg">Kostenlose Beratung</BaseButton>
            <BaseButton :to="{ name: 'services' }" variant="outline" size="lg"
              >Leistungen ansehen</BaseButton
            >
          </div>
          <dl class="mt-12 grid max-w-md grid-cols-3 gap-6">
            <div>
              <dt class="text-2xl font-bold text-content">30+</dt>
              <dd class="text-sm text-content-muted">Jahre Erfahrung</dd>
            </div>
            <div>
              <dt class="text-2xl font-bold text-content">800+</dt>
              <dd class="text-sm text-content-muted">Öfen gebaut</dd>
            </div>
            <div>
              <dt class="text-2xl font-bold text-content">100%</dt>
              <dd class="text-sm text-content-muted">Meisterarbeit</dd>
            </div>
          </dl>
        </div>

        <div class="relative">
          <div
            class="aspect-[4/5] w-full rounded-2xl bg-gradient-to-b from-brand-400 to-brand-700 shadow-card"
          >
            <div class="flex h-full items-center justify-center">
              <svg
                class="h-32 w-32 text-white/90"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12 2c2 4 6 6 6 11a6 6 0 0 1-12 0c0-2.5 1.2-4.5 2.5-6.2C9 9 10 9.7 10.5 10 9.8 7.3 9.5 4.7 12 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- Services -->
    <section class="section">
      <BaseContainer>
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="font-display text-3xl font-bold sm:text-4xl">Unsere Leistungen</h2>
          <p class="mt-3 text-content-muted">Alles aus einer Hand — Planung, Bau und Service.</p>
        </div>

        <AppLoader v-if="isLoading" class="mt-12" label="Leistungen werden geladen …" />
        <AppError
          v-else-if="error && !services.length"
          class="mx-auto mt-12 max-w-lg"
          :message="error"
          @retry="execute"
        />
        <div v-else class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            v-for="service in services"
            :key="service.id || service.title"
            :icon="service.icon || 'flame'"
            :title="service.title"
            :description="service.description"
          />
        </div>
      </BaseContainer>
    </section>

    <!-- CTA -->
    <section class="section pt-0">
      <BaseContainer>
        <div
          class="overflow-hidden rounded-2xl bg-brand-600 px-6 py-12 text-center text-white sm:px-12"
        >
          <h2 class="font-display text-2xl font-bold sm:text-3xl">Bereit für Ihren neuen Ofen?</h2>
          <p class="mx-auto mt-3 max-w-xl text-brand-50">
            Lassen Sie uns gemeinsam die passende Lösung für Ihr Zuhause finden.
          </p>
          <BaseButton :to="{ name: 'contact' }" variant="secondary" size="lg" class="mt-6">
            Jetzt anfragen
          </BaseButton>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

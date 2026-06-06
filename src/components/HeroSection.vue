<script setup>
import BaseButton from './BaseButton.vue'
import BaseBadge from './BaseBadge.vue'
import BaseImage from './BaseImage.vue'
import AppIcon from './AppIcon.vue'
import { company } from '@/data/company'

const stats = [
  { value: '30+', label: 'Jahre Erfahrung' },
  { value: '800+', label: 'Öfen & Projekte' },
  { value: '100%', label: 'Meisterarbeit' },
]
</script>

<template>
  <section class="bg-ink-900 text-white">
    <div class="mx-auto grid w-full max-w-container lg:grid-cols-2">
      <!-- Copy -->
      <div class="flex flex-col justify-center px-5 py-20 sm:px-6 lg:px-12 lg:py-32">
        <BaseBadge tone="onDark" class="w-fit">
          <AppIcon name="flame" class="h-3.5 w-3.5 text-brand-400" />
          Meisterbetrieb · {{ company.tagline }}
        </BaseBadge>

        <h1 class="mt-6 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
          Mit gesunder Wärme leben
          <span class="mt-2 block text-brand-400">Individueller Kachel- &amp; Kaminofenbau</span>
        </h1>

        <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          Vom ersten Entwurf bis zum letzten Handgriff: handgesetzte Kachelöfen, Kamine und
          meisterhafte Fliesenarbeiten — für ein Zuhause, das über Jahrzehnte behaglich bleibt.
        </p>

        <div class="mt-9 flex flex-wrap gap-3">
          <BaseButton :to="{ name: 'contact' }" size="lg">
            Beratung vereinbaren
            <AppIcon name="arrow" class="h-4 w-4" />
          </BaseButton>
          <BaseButton :to="{ name: 'projects' }" variant="light" size="lg">
            Projekte ansehen
          </BaseButton>
        </div>

        <dl class="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
          <div v-for="s in stats" :key="s.label">
            <dt class="font-display text-3xl font-semibold text-white">{{ s.value }}</dt>
            <dd class="mt-1 text-sm text-white/55">{{ s.label }}</dd>
          </div>
        </dl>
      </div>

      <!-- Image -->
      <div class="relative min-h-[340px] lg:min-h-full">
        <BaseImage
          fill
          rounded="rounded-none"
          motif="flame"
          tone="ember"
          eager
          alt="Moderner Kaminofen mit Sichtfeuer in einem hellen Wohnraum"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900/40 to-transparent lg:from-ink-900"
          aria-hidden="true"
        />
      </div>
    </div>
  </section>
</template>

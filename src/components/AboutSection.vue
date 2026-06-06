<script setup>
import BaseContainer from './BaseContainer.vue'
import BaseImage from './BaseImage.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import { company } from '@/data/company'

defineProps({
  // On the dedicated About page we hide the "more" button (already there).
  showCta: { type: Boolean, default: true },
})

const points = [
  { icon: 'check', text: 'Eingetragener Meisterbetrieb (Ofen- & Luftheizungsbau)' },
  { icon: 'check', text: 'Geprüfte Fliesen- und Plattenarbeiten' },
  { icon: 'pin', text: `Regional für ${company.address.region}` },
]
</script>

<template>
  <section class="section bg-surface">
    <BaseContainer class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <!-- Image left -->
      <div v-reveal class="relative">
        <BaseImage
          src="/images/about-craft.svg"
          motif="portrait"
          tone="ink"
          ratio="4/5"
          alt="Ofen- und Fliesenmeister bei der Arbeit"
          class="shadow-card"
        />
        <div
          class="absolute -bottom-6 -right-4 hidden rounded-2xl bg-brand-500 px-6 py-5 text-white shadow-lift sm:block"
        >
          <p class="font-display text-3xl font-semibold leading-none">30+</p>
          <p class="mt-1 text-xs text-white/80">Jahre Handwerk</p>
        </div>
      </div>

      <!-- Content right -->
      <div v-reveal="{ delay: 100 }">
        <p class="eyebrow">Über uns</p>
        <h2 class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Handwerk, das man spürt — Wärme, die bleibt
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-content-muted">
          {{ company.name }} ist ein Meisterbetrieb mit langer Tradition. Was als kleine Werkstatt
          begann, ist heute eine feste Größe im Ofen-, Kamin- und Fliesenbau der Region.
        </p>
        <p class="mt-4 leading-relaxed text-content-muted">
          Wir verbinden überliefertes Handwerk mit moderner Verbrennungs- und Speichertechnik — für
          Wärme, die effizient, sicher und schön ist. Jeder Auftrag ist Vertrauenssache: ehrliche
          Beratung, saubere Ausführung und verlässliche Termine.
        </p>

        <ul class="mt-8 space-y-3">
          <li v-for="p in points" :key="p.text" class="flex items-center gap-3">
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
            >
              <AppIcon :name="p.icon" class="h-4 w-4" />
            </span>
            <span class="text-sm text-content">{{ p.text }}</span>
          </li>
        </ul>

        <BaseButton v-if="showCta" :to="{ name: 'about' }" variant="outline" class="mt-8">
          Mehr über uns
          <AppIcon name="arrow" class="h-4 w-4" />
        </BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>

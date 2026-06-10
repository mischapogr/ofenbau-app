<script setup>
import BaseContainer from './BaseContainer.vue'
import BaseButton from './BaseButton.vue'
import BaseBadge from './BaseBadge.vue'
import BaseImage from './BaseImage.vue'
import AppIcon from './AppIcon.vue'
import { planningBenefits } from '@/data/planning'
</script>

<template>
  <section class="section bg-surface">
    <BaseContainer>
      <div
        v-reveal
        class="overflow-hidden rounded-2xl bg-ink-900 text-white shadow-card ring-1 ring-ink-950/40"
      >
        <div class="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-14 lg:p-16">
          <!-- Left: copy + benefits -->
          <div>
            <BaseBadge tone="onDark" class="w-fit">
              <AppIcon name="render" class="h-3.5 w-3.5 text-brand-400" />
              3D-Planung erleben
            </BaseBadge>
            <h2 class="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Ihre Vision in 3D — erleben, bevor wir bauen
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-white/70">
              Wir visualisieren Ofen und Flächen fotorealistisch im echten Raum. So entscheiden Sie
              sicher — bei Form, Material, Details und Kosten.
            </p>

            <ul class="mt-8 space-y-5">
              <li v-for="b in planningBenefits" :key="b.title" class="flex gap-4">
                <span
                  class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400"
                >
                  <AppIcon :name="b.icon" class="h-5 w-5" />
                </span>
                <div>
                  <h3 class="font-semibold text-white">{{ b.title }}</h3>
                  <p class="mt-1 text-sm leading-relaxed text-white/60">{{ b.text }}</p>
                </div>
              </li>
            </ul>

            <BaseButton
              :to="{ name: 'service-detail', params: { slug: '3d-planung' } }"
              size="lg"
              class="mt-9"
            >
              3D-Entwurf anfragen
              <AppIcon name="arrow" class="h-4 w-4" />
            </BaseButton>
          </div>

          <!-- Right: before / after -->
          <div class="grid grid-cols-2 gap-4">
            <figure>
              <BaseImage
                src="/images/planning-3d-before.webp"
                motif="render"
                tone="slate"
                ratio="4/3"
                alt="3D-Skizze des Entwurfs"
                enlargeable
                caption="3D-Skizze des Entwurfs"
              />
              <figcaption class="mt-2 text-center text-xs uppercase tracking-label text-white/50">
                3D-Skizze
              </figcaption>
            </figure>
            <figure class="mt-8">
              <BaseImage
                src="/images/planning-3d-after.webp"
                motif="flame"
                tone="ember"
                ratio="4/3"
                alt="Fertig umgesetztes Projekt"
                enlargeable
                caption="Fertig umgesetztes Projekt"
              />
              <figcaption class="mt-2 text-center text-xs uppercase tracking-label text-white/50">
                Fertiges Projekt
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

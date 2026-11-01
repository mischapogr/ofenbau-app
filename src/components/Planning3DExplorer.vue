<script setup>
import BaseContainer from './BaseContainer.vue'
import AppIcon from './AppIcon.vue'
import ExplorerStageRotate from './planning/ExplorerStageRotate.vue'
import ExplorerStageVariant from './planning/ExplorerStageVariant.vue'
import ExplorerStageXray from './planning/ExplorerStageXray.vue'
import ExplorerStageModel from './planning/ExplorerStageModel.vue'
import ExplorerStageView from './planning/ExplorerStageView.vue'
import ExplorerStageBar from './planning/ExplorerStageBar.vue'
import ExplorerControls from './planning/ExplorerControls.vue'
import ExplorerFullscreen from './planning/ExplorerFullscreen.vue'
import { usePlanningExplorer } from '@/composables/usePlanningExplorer'
import './planning/explorer.css'

/**
 * Interactive planning explorer. State lives in `usePlanningExplorer` and is
 * provided to the stage/control sub-components; this file only lays out the
 * section, the stage switch and the aside.
 */
const {
  categories,
  activeCategory,
  selectCategory,
  stepView,
  openExpanded,
  isRotateMode,
  isVariantMode,
  isXrayMode,
  isModelMode,
} = usePlanningExplorer()
</script>

<template>
  <section class="section bg-surface-muted">
    <BaseContainer>
      <div v-reveal class="max-w-2xl">
        <p class="eyebrow">3D-Planung erleben</p>
        <h2 class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Von Idee, Material und Raum zur sicheren Entscheidung
        </h2>
        <p class="mt-4 text-lg leading-relaxed text-content-muted">
          Wechseln Sie zwischen Use Cases, Perspektiven, Planungsdetails und Entscheidungen. So
          sehen Sie vor der Umsetzung, wie Ofen, Material und Raum zusammenwirken.
        </p>
      </div>

      <div
        class="mt-10 overflow-hidden rounded-2xl bg-ink-950 text-white shadow-card ring-1 ring-ink-900"
      >
        <div class="grid gap-0 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div class="relative min-h-[26rem] bg-ink-900">
            <div class="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                class="press-feedback rounded-full px-3.5 py-2 text-xs font-semibold transition-colors"
                :class="
                  activeCategory === category
                    ? 'bg-brand-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                "
                :aria-pressed="activeCategory === category"
                @click="selectCategory(category)"
              >
                {{ category }}
              </button>
            </div>

            <div class="absolute right-4 top-4 z-10 flex gap-2">
              <button
                type="button"
                class="press-feedback inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
                aria-label="Vorherige Ansicht"
                @click="stepView(-1)"
              >
                <AppIcon name="chevron" class="h-5 w-5 rotate-180" />
              </button>
              <button
                type="button"
                class="press-feedback inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
                aria-label="Nächste Ansicht"
                @click="stepView(1)"
              >
                <AppIcon name="chevron" class="h-5 w-5" />
              </button>
              <button
                type="button"
                class="press-feedback inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
                aria-label="3D-Entwurf vergrößern"
                @click="openExpanded"
              >
                <AppIcon name="maximize" class="h-5 w-5" />
              </button>
            </div>

            <ExplorerStageRotate v-if="isRotateMode" />
            <ExplorerStageVariant v-else-if="isVariantMode" />
            <ExplorerStageModel v-else-if="isModelMode" />
            <ExplorerStageXray v-else-if="isXrayMode" />
            <ExplorerStageView v-else />

            <ExplorerStageBar />
          </div>

          <ExplorerControls />
        </div>
      </div>
    </BaseContainer>
  </section>

  <ExplorerFullscreen />
</template>

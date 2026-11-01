<script setup>
import AppIcon from '../AppIcon.vue'
import BaseButton from '../BaseButton.vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/** Bottom info bar: stage title/copy plus the per-mode controls and zoom. */
const {
  current,
  stageLabel,
  stageText,
  activeAnnotation,
  isRotateMode,
  isVariantMode,
  isModelMode,
  currentFrames,
  rotation,
  reducedMotion,
  goToFrame,
  toggleAutorotate,
  compareMode,
  compareBase,
  budgetRoute,
  currentFireZone,
  flamesOn,
  zoom,
  maxZoom,
  setZoom,
} = useExplorerContext()
</script>

<template>
  <div
    class="absolute bottom-4 left-4 right-4 z-10 grid gap-3 rounded-xl bg-ink-950/70 p-3 backdrop-blur md:grid-cols-[1fr_auto] md:items-center"
  >
    <div v-if="current">
      <p class="font-display text-xl font-semibold">{{ current.title }} · {{ stageLabel }}</p>
      <p class="mt-1 text-sm text-white/65">{{ stageText }}</p>
      <p v-if="activeAnnotation" class="mt-1 text-sm font-semibold text-brand-300">
        {{ activeAnnotation }}
      </p>
      <div v-if="isRotateMode" class="mt-2 flex items-center gap-3">
        <div class="flex items-center gap-1.5">
          <button
            v-for="(frame, index) in currentFrames"
            :key="frame.angle"
            type="button"
            class="press-feedback h-2.5 w-2.5 rounded-full transition-colors"
            :class="
              index === rotation.frameIndex.value ? 'bg-brand-500' : 'bg-white/25 hover:bg-white/45'
            "
            :aria-label="`Ansicht ${frame.angle}°`"
            :aria-pressed="index === rotation.frameIndex.value"
            @click="goToFrame(index)"
          ></button>
        </div>
        <span class="font-mono text-xs uppercase tracking-label text-white/50">
          {{ rotation.currentFrame.value?.angle }}°
        </span>
        <button
          v-if="!reducedMotion"
          type="button"
          class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          :class="
            rotation.autorotate.value
              ? 'bg-brand-500 text-white'
              : 'bg-white/10 text-white/65 hover:bg-white/20 hover:text-white'
          "
          :aria-pressed="rotation.autorotate.value"
          @click="toggleAutorotate()"
        >
          {{ rotation.autorotate.value ? 'Stopp' : 'Rundgang' }}
        </button>
      </div>
      <div v-else-if="isVariantMode" class="mt-2 flex flex-wrap items-center gap-2">
        <button
          v-if="compareBase"
          type="button"
          class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          :class="
            compareMode
              ? 'bg-brand-500 text-white'
              : 'bg-white/10 text-white/65 hover:bg-white/20 hover:text-white'
          "
          :aria-pressed="compareMode"
          @click="compareMode = !compareMode"
        >
          Vergleich Basis/Variante
        </button>
        <BaseButton v-if="budgetRoute" :to="budgetRoute" variant="light" size="sm">
          <AppIcon name="calculator" class="h-4 w-4" />
          Budget schätzen
        </BaseButton>
      </div>
      <div v-else-if="currentFireZone" class="mt-2">
        <button
          type="button"
          class="press-feedback inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          :class="
            flamesOn
              ? 'bg-brand-500 text-white'
              : 'bg-white/10 text-white/65 hover:bg-white/20 hover:text-white'
          "
          :aria-pressed="flamesOn"
          @click="flamesOn = !flamesOn"
        >
          <AppIcon name="flame" class="h-3.5 w-3.5" />
          {{ flamesOn ? 'Feuer aus' : 'Feuer an' }}
        </button>
      </div>
    </div>
    <div v-if="!isModelMode" class="flex items-center gap-2">
      <button
        type="button"
        class="press-feedback inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
        aria-label="Ansicht verkleinern"
        @click="setZoom(zoom - 0.15)"
      >
        <AppIcon name="zoomOut" class="h-4 w-4" />
      </button>
      <input
        v-model.number="zoom"
        type="range"
        min="1"
        :max="maxZoom"
        step="0.05"
        aria-label="3D-Ansicht zoomen"
        class="w-24 accent-brand-500"
      />
      <button
        type="button"
        class="press-feedback inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
        aria-label="Ansicht vergrößern"
        @click="setZoom(zoom + 0.15)"
      >
        <AppIcon name="zoomIn" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

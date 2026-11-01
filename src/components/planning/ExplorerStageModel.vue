<script setup>
import { onMounted, ref, watch } from 'vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/**
 * Real 3D stage: a glTF model in <model-viewer> (orbit, auto-rotate, AR,
 * KHR_materials_variants switching, hotspots). The library (~1 MB incl.
 * three.js) is imported on first open only, so the explorer's initial chunk
 * stays free of it. Rendered through `<component :is>` so Vue treats the
 * custom element as a plain tag without a compiler option.
 */
const { current, currentModel, reducedMotion, toggleModelMode } = useExplorerContext()

const ready = ref(false)
const failed = ref(false)
const viewer = ref(null)
const variantName = ref(null)
const availableVariants = ref([])
const activeHotspot = ref(null)

onMounted(async () => {
  try {
    await import('@google/model-viewer')
    ready.value = true
  } catch (error) {
    console.warn('model-viewer konnte nicht geladen werden', error)
    failed.value = true
    // Nothing to render without the library — hand the stage back.
    toggleModelMode()
  }
})

function onLoad() {
  const el = viewer.value
  availableVariants.value = el?.availableVariants || []
  variantName.value = el?.variantName ?? null
}

function selectVariant(name) {
  variantName.value = name
  if (viewer.value) viewer.value.variantName = name
}

function toggleHotspot(hotspot) {
  activeHotspot.value = activeHotspot.value === hotspot.label ? null : hotspot.label
}

// A new example resets the material choice; the element reloads via :src.
watch(currentModel, () => {
  variantName.value = null
  availableVariants.value = []
  activeHotspot.value = null
})
</script>

<template>
  <!-- `slot` here targets the custom element's native slots (hotspots, AR
       button), not Vue's deprecated slot syntax. -->
  <!-- eslint-disable vue/no-deprecated-slot-attribute -->
  <div class="relative h-full min-h-[26rem] overflow-hidden">
    <component
      :is="'model-viewer'"
      v-if="ready && currentModel"
      ref="viewer"
      class="plan-model"
      :src="currentModel.src"
      :poster="currentModel.poster || current?.image"
      :alt="`${current?.title} – interaktives 3D-Modell`"
      camera-controls
      touch-action="pan-y"
      :auto-rotate="reducedMotion ? null : ''"
      ar
      ar-modes="webxr scene-viewer quick-look"
      reveal="auto"
      loading="eager"
      shadow-intensity="1"
      exposure="0.95"
      :variant-name="variantName"
      @load="onLoad"
    >
      <button
        v-for="(hotspot, index) in currentModel.hotspots || []"
        :key="hotspot.label"
        :slot="`hotspot-${index + 1}`"
        type="button"
        class="plan-model__hotspot plan-hotspot"
        :class="activeHotspot === hotspot.label ? 'plan-hotspot--active' : ''"
        :data-position="hotspot.position"
        :data-normal="hotspot.normal || '0 1 0'"
        :aria-pressed="activeHotspot === hotspot.label"
        :aria-label="`Detail: ${hotspot.label}`"
        @click="toggleHotspot(hotspot)"
      >
        <span class="plan-hotspot__dot"></span>
        <span class="plan-hotspot__label">{{ hotspot.label }}</span>
      </button>
      <button
        slot="ar-button"
        type="button"
        class="press-feedback absolute bottom-24 right-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20"
      >
        In meinem Raum ansehen (AR)
      </button>
    </component>
    <div v-else class="flex h-full min-h-[26rem] items-center justify-center text-sm text-white/60">
      {{ failed ? '3D-Ansicht nicht verfügbar.' : 'Lädt 3D-Modell…' }}
    </div>

    <div
      v-if="ready && (availableVariants.length || activeHotspot)"
      class="absolute left-4 top-16 z-10 flex flex-wrap items-center gap-2"
    >
      <template v-if="availableVariants.length">
        <span class="text-xs font-semibold uppercase tracking-label text-white/50">Material</span>
        <button
          v-for="name in availableVariants"
          :key="name"
          type="button"
          class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          :class="
            variantName === name
              ? 'bg-brand-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          "
          :aria-pressed="variantName === name"
          @click="selectVariant(name)"
        >
          {{ name }}
        </button>
      </template>
      <span v-if="activeHotspot" class="text-sm font-semibold text-brand-300 sm:hidden">
        {{ activeHotspot }}
      </span>
    </div>
  </div>
</template>

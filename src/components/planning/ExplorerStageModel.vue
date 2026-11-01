<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'
import { srgbToLinearRgb } from '@/utils/color'

/**
 * Real 3D stage: a glTF model in <model-viewer> (orbit, auto-rotate, AR,
 * hotspots) with per-part material switching. Every part of the model is one
 * named glTF material (see scripts/generate-stove-model.mjs); the options and
 * presets in `planning.js` are PBR factors applied through the scene-graph
 * API, so any part can be combined with any other. The library (~1 MB incl.
 * three.js) is imported on first open only. Rendered through `<component :is>`
 * so Vue treats the custom element as a plain tag without a compiler option.
 */
const { current, currentModel, reducedMotion, toggleModelMode, activePresetKey, setPreset } =
  useExplorerContext()

const ready = ref(false)
const failed = ref(false)
const loaded = ref(false)
const viewer = ref(null)
const activeHotspot = ref(null)
const customize = ref(false)
const fireOn = ref(false)
/** part key → option key */
const choices = ref({})

const parts = computed(() => currentModel.value?.parts || [])
const presets = computed(() => currentModel.value?.presets || [])
const activePreset = computed(() => {
  const picked = choices.value
  return (
    presets.value.find((preset) =>
      Object.entries(preset.choices).every(([part, option]) => picked[part] === option)
    )?.key || null
  )
})
const summary = computed(() =>
  parts.value
    .map((part) => part.options.find((option) => option.key === choices.value[part.key])?.label)
    .filter(Boolean)
    .join(' · ')
)

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

function cssColor([r, g, b]) {
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`
}

function applyPart(partKey, optionKey) {
  const part = parts.value.find((item) => item.key === partKey)
  const option = part?.options.find((item) => item.key === optionKey)
  const material = viewer.value?.model?.getMaterialByName(partKey)
  if (!option || !material) return
  material.pbrMetallicRoughness.setBaseColorFactor([...srgbToLinearRgb(option.color), 1])
  material.pbrMetallicRoughness.setRoughnessFactor(option.roughness ?? 0.5)
  material.pbrMetallicRoughness.setMetallicFactor(option.metallic ?? 0)
}

function applyFire() {
  const fire = currentModel.value?.fire
  if (!fire) return
  const factors = fireOn.value ? fire.on : fire.off
  for (const [partKey, rgb] of Object.entries(factors)) {
    viewer.value?.model?.getMaterialByName(partKey)?.setEmissiveFactor(rgb)
  }
}

function applyAll() {
  for (const [partKey, optionKey] of Object.entries(choices.value)) applyPart(partKey, optionKey)
  applyFire()
}

function selectOption(partKey, optionKey) {
  choices.value = { ...choices.value, [partKey]: optionKey }
  applyPart(partKey, optionKey)
}

function selectPreset(preset) {
  choices.value = { ...preset.choices }
  setPreset(preset.key)
  applyAll()
}

function toggleFire() {
  fireOn.value = !fireOn.value
  applyFire()
}

function presetChoices() {
  const preset =
    presets.value.find((item) => item.key === activePresetKey.value) || presets.value[0]
  return preset ? { ...preset.choices } : {}
}

function resetChoices() {
  choices.value = presetChoices()
  applyAll()
}

function onLoad() {
  loaded.value = true
  applyAll()
}

function toggleHotspot(hotspot) {
  activeHotspot.value = activeHotspot.value === hotspot.label ? null : hotspot.label
}

// A new example resets the configuration; the element reloads via :src.
watch(
  currentModel,
  () => {
    loaded.value = false
    activeHotspot.value = null
    fireOn.value = false
    // Start from the preset the turntable is showing, so both views match.
    choices.value = presetChoices()
  },
  { immediate: true }
)
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
      camera-orbit="30deg 72deg 4.2m"
      camera-target="-0.25m 0.8m 0m"
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
        class="press-feedback absolute right-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/20"
      >
        In meinem Raum ansehen (AR)
      </button>
    </component>
    <div v-else class="flex h-full min-h-[26rem] items-center justify-center text-sm text-white/60">
      {{ failed ? '3D-Ansicht nicht verfügbar.' : 'Lädt 3D-Modell…' }}
    </div>

    <!-- Configuration panel: presets, optional per-part rows, fire toggle. -->
    <div
      v-if="ready && loaded && (presets.length || parts.length)"
      class="absolute left-4 top-16 z-10 flex max-h-[calc(100%-9rem)] max-w-[calc(100%-2rem)] flex-col gap-2 overflow-y-auto rounded-lg bg-ink-900/70 p-3 backdrop-blur"
      aria-label="Materialien konfigurieren"
    >
      <div v-if="presets.length" class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-label text-white/50">Stil</span>
        <button
          v-for="preset in presets"
          :key="preset.key"
          type="button"
          class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          :class="
            activePreset === preset.key
              ? 'bg-brand-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          "
          :aria-pressed="activePreset === preset.key"
          @click="selectPreset(preset)"
        >
          {{ preset.label }}
        </button>
        <button
          v-if="parts.length"
          type="button"
          class="press-feedback rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
          :aria-expanded="customize"
          @click="customize = !customize"
        >
          {{ customize ? 'Weniger' : 'Bauteile anpassen' }}
        </button>
        <button
          v-if="currentModel?.fire"
          type="button"
          class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          :class="
            fireOn
              ? 'bg-brand-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          "
          :aria-pressed="fireOn"
          @click="toggleFire"
        >
          {{ fireOn ? 'Feuer aus' : 'Feuer an' }}
        </button>
      </div>

      <div v-if="customize" class="flex flex-col gap-2 border-t border-white/10 pt-2">
        <div
          v-for="part in parts"
          :key="part.key"
          class="flex flex-wrap items-center gap-1.5"
          role="group"
          :aria-label="part.label"
        >
          <span class="w-24 shrink-0 text-xs font-semibold text-white/60">{{ part.label }}</span>
          <button
            v-for="option in part.options"
            :key="option.key"
            type="button"
            class="press-feedback flex items-center gap-1.5 rounded-full py-0.5 pl-1 pr-2.5 text-xs font-medium transition-colors"
            :class="
              choices[part.key] === option.key
                ? 'bg-brand-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            "
            :aria-pressed="choices[part.key] === option.key"
            :title="option.label"
            @click="selectOption(part.key, option.key)"
          >
            <span
              class="h-4 w-4 rounded-full border border-white/40"
              :style="{ background: cssColor(option.color) }"
              aria-hidden="true"
            ></span>
            {{ option.label }}
          </button>
        </div>
        <div class="flex items-center justify-between gap-2 pt-1">
          <span class="truncate text-xs text-white/50" data-testid="model-summary">{{
            summary
          }}</span>
          <button
            type="button"
            class="press-feedback shrink-0 text-xs font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline"
            @click="resetChoices"
          >
            Zurücksetzen
          </button>
        </div>
      </div>
    </div>

    <span
      v-if="activeHotspot"
      class="absolute right-4 top-14 z-10 text-sm font-semibold text-brand-300 sm:hidden"
    >
      {{ activeHotspot }}
    </span>
  </div>
</template>

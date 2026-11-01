<script setup>
import BaseImage from '../BaseImage.vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/**
 * Drag-to-rotate frame arc. Until the visitor interacts, only the current
 * frame is in the DOM; the first pointer/keyboard interaction warms the set
 * (see `warmFrames` in usePlanningExplorer).
 */
const {
  current,
  currentFrames,
  currentPresets,
  activePresetKey,
  setPreset,
  hasPresetFrames,
  rotation,
  framesWarmed,
  framesLoading,
  warmFrames,
  pinch,
  stageTransform,
  stageTouchAction,
  currentFrameFailed,
  markFailed,
  onRotatePointerDown,
  onRotatePointerMove,
  onRotatePointerUp,
  onStageKey,
} = useExplorerContext()

const frameWidth = 1600
const frameHeight = 1000
</script>

<template>
  <div class="relative h-full min-h-[26rem]">
    <div
      class="plan-rotate-stage h-full min-h-[26rem] overflow-hidden"
      :class="rotation.isDragging.value ? 'plan-rotate-stage--dragging' : ''"
      role="slider"
      tabindex="0"
      aria-label="Rundblick: Winkel mit Pfeiltasten oder Ziehen wechseln"
      :aria-valuemin="currentFrames[0]?.angle"
      :aria-valuemax="currentFrames[currentFrames.length - 1]?.angle"
      :aria-valuenow="rotation.currentFrame.value?.angle"
      :aria-valuetext="`${rotation.currentFrame.value?.angle}°`"
      :style="{ touchAction: stageTouchAction }"
      @pointerdown="onRotatePointerDown"
      @pointermove="onRotatePointerMove"
      @pointerup="onRotatePointerUp"
      @pointercancel="onRotatePointerUp"
      @lostpointercapture="onRotatePointerUp"
      @pointerenter="warmFrames"
      @focus="warmFrames"
      @keydown="onStageKey"
    >
      <div
        class="relative h-full transition-transform duration-500"
        :class="pinch.isZoomed.value ? 'transition-none' : ''"
        :style="{ transform: stageTransform }"
      >
        <template v-for="(frame, index) in currentFrames" :key="frame.image">
          <img
            v-if="framesWarmed || index === rotation.frameIndex.value"
            v-show="index === rotation.frameIndex.value && !currentFrameFailed"
            :src="frame.image"
            :width="frameWidth"
            :height="frameHeight"
            :alt="
              index === rotation.frameIndex.value
                ? `${current.title} - Rundblick ${frame.angle}°`
                : undefined
            "
            :aria-hidden="index !== rotation.frameIndex.value"
            class="h-full w-full object-cover"
            draggable="false"
            loading="eager"
            decoding="async"
            @error="markFailed(frame.image)"
          />
        </template>
        <BaseImage
          v-if="currentFrameFailed"
          :motif="current?.motif"
          :tone="current?.tone"
          :alt="`${current?.title} - Rundblick`"
          fill
          rounded="rounded-none"
        />
      </div>
      <div
        v-if="framesLoading"
        class="pointer-events-none absolute left-1/2 top-16 z-10 -translate-x-1/2"
      >
        <div
          class="flex items-center gap-2 rounded-full bg-ink-950/75 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur"
        >
          <span>Lädt Rundblick…</span>
          <span class="font-mono">
            {{ rotation.preloadLoaded.value }}/{{
              rotation.preloadTotal.value || currentFrames.length
            }}
          </span>
        </div>
      </div>
    </div>
    <!-- Material preset of the rendered turntable (shared with the 3D model). -->
    <div
      v-if="hasPresetFrames && currentPresets.length"
      class="absolute left-4 top-16 z-10 flex flex-wrap items-center gap-2 rounded-lg bg-ink-900/70 p-2 backdrop-blur"
      role="group"
      aria-label="Stil des Rundblicks"
    >
      <span class="pl-1 text-xs font-semibold uppercase tracking-label text-white/50">Stil</span>
      <button
        v-for="preset in currentPresets"
        :key="preset.key"
        type="button"
        class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
        :class="
          activePresetKey === preset.key
            ? 'bg-brand-500 text-white'
            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        "
        :aria-pressed="activePresetKey === preset.key"
        @click="setPreset(preset.key)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

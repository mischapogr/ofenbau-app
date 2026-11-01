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
</template>

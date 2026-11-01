<script setup>
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/**
 * Pinch/zoom canvas for the photo-based stages (view, x-ray). The inner box
 * matches the photo's 16/10 geometry exactly and is centered in the stage, so
 * annotation/fire percentages are photo coordinates — stable at every viewport
 * and zoom.
 */
const { pinch, stageTransform, stageTouchAction } = useExplorerContext()
</script>

<template>
  <div
    class="flex h-full min-h-[26rem] justify-center overflow-hidden"
    :style="{ touchAction: stageTouchAction }"
    @pointerdown="pinch.onPointerDown"
    @pointermove="pinch.onPointerMove"
    @pointerup="pinch.onPointerUp"
    @pointercancel="pinch.onPointerUp"
    @lostpointercapture="pinch.onPointerUp"
  >
    <div
      class="relative h-full shrink-0 transition-transform duration-500"
      :class="pinch.isZoomed.value ? 'transition-none' : ''"
      :style="{ transform: stageTransform, aspectRatio: '16 / 10' }"
    >
      <slot />
    </div>
  </div>
</template>

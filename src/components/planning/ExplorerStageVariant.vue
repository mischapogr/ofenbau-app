<script setup>
import BaseImage from '../BaseImage.vue'
import CompareSlider from '../CompareSlider.vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/**
 * Decision simulation: the whole-image variant (or the base photo) with any
 * stackable layer choices composited on top, or a before/after compare slider.
 */
const {
  current,
  activeVariant,
  activeVariantData,
  activeLayerList,
  displayedVariantSrc,
  compareMode,
  compareBase,
  variantImageFailed,
  markFailed,
  stageLabel,
  pinch,
  stageTransform,
  stageTouchAction,
} = useExplorerContext()
</script>

<template>
  <div class="relative h-full min-h-[26rem] overflow-hidden">
    <CompareSlider
      v-if="compareMode && compareBase"
      :before="compareBase"
      :after="activeVariantData.image"
      before-label="Basis"
      :after-label="activeVariant.choice"
      :alt="`${current?.title} - ${stageLabel}`"
    />
    <div
      v-else
      class="absolute inset-0 transition-transform duration-500"
      :class="pinch.isZoomed.value ? 'transition-none' : ''"
      :style="{ transform: stageTransform, touchAction: stageTouchAction }"
      @pointerdown="pinch.onPointerDown"
      @pointermove="pinch.onPointerMove"
      @pointerup="pinch.onPointerUp"
      @pointercancel="pinch.onPointerUp"
      @lostpointercapture="pinch.onPointerUp"
    >
      <BaseImage
        v-if="variantImageFailed"
        :motif="current?.motif"
        :tone="current?.tone"
        :alt="`${current?.title} - ${stageLabel}`"
        fill
        rounded="rounded-none"
      />
      <Transition v-else name="stage-fade">
        <img
          v-if="displayedVariantSrc"
          :key="displayedVariantSrc"
          :src="displayedVariantSrc"
          :alt="`${current?.title} - ${stageLabel}`"
          class="absolute inset-0 h-full w-full object-contain"
          loading="eager"
          decoding="async"
          draggable="false"
          @error="markFailed(displayedVariantSrc)"
        />
      </Transition>
      <img
        v-for="item in activeLayerList"
        :key="`${item.key}-${item.choice}`"
        :src="item.layer"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 h-full w-full object-contain"
        decoding="async"
        draggable="false"
      />
    </div>
  </div>
</template>

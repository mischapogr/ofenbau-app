<script setup>
import BaseImage from '../BaseImage.vue'
import ExplorerStageCanvas from './ExplorerStageCanvas.vue'
import ExplorerHotspots from './ExplorerHotspots.vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/** Plain photo view with hotspots and the optional fire simulation. */
const { current, currentView, showFlames, currentFireZone } = useExplorerContext()
</script>

<template>
  <ExplorerStageCanvas>
    <BaseImage
      v-if="current"
      :key="`${current.id}-${currentView?.label}`"
      :src="currentView?.image"
      :motif="current.motif"
      :tone="current.tone"
      :alt="`${current.title} - ${currentView?.label}`"
      fill
      rounded="rounded-none"
      eager
      class="absolute inset-0"
    />
    <div v-if="showFlames" class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        class="plan-fire"
        :style="{
          top: currentFireZone.top,
          left: currentFireZone.left,
          width: currentFireZone.width,
          height: currentFireZone.height,
        }"
      >
        <span class="plan-fire__glow plan-fire__glow--a"></span>
        <span class="plan-fire__glow plan-fire__glow--b"></span>
      </div>
    </div>
    <ExplorerHotspots />
  </ExplorerStageCanvas>
</template>

<script setup>
import BaseImage from '../BaseImage.vue'
import ExplorerStageCanvas from './ExplorerStageCanvas.vue'
import ExplorerHotspots from './ExplorerHotspots.vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/**
 * Cutaway ("Röntgenblick") stage. With a dedicated `xray.image` the technical
 * rendering is shown as-is; without one the base photo gets the blueprint
 * inversion (`.plan-xray`) as a schematic backdrop for the annotations.
 */
const { current, xrayImage, xrayLabel } = useExplorerContext()
</script>

<template>
  <ExplorerStageCanvas>
    <BaseImage
      v-if="current"
      :key="`${current.id}-xray`"
      :src="xrayImage || current.image"
      :motif="current.motif"
      :tone="current.tone"
      :alt="`${current.title} - ${xrayLabel}`"
      fill
      rounded="rounded-none"
      eager
      class="absolute inset-0"
      :class="!xrayImage ? 'plan-xray' : ''"
    />
    <ExplorerHotspots />
  </ExplorerStageCanvas>
</template>

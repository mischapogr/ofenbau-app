<script setup>
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/** Clickable annotation dots positioned in photo coordinates. */
const { currentAnnotations, activeAnnotation, toggleAnnotation } = useExplorerContext()
</script>

<template>
  <div v-if="currentAnnotations.length" class="pointer-events-none absolute inset-0 z-10">
    <button
      v-for="annotation in currentAnnotations"
      :key="annotation.label"
      type="button"
      class="plan-hotspot pointer-events-auto"
      :class="activeAnnotation === annotation.label ? 'plan-hotspot--active' : ''"
      :style="{ top: annotation.top, left: annotation.left }"
      :aria-pressed="activeAnnotation === annotation.label"
      :aria-label="`Detail: ${annotation.label}`"
      @click="toggleAnnotation(annotation)"
    >
      <span class="plan-hotspot__dot"></span>
      <span class="plan-hotspot__label">{{ annotation.label }}</span>
    </button>
  </div>
</template>

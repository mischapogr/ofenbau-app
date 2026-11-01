<script setup>
import { ref } from 'vue'

/**
 * Before/after comparison with a draggable divider. The `after` image sits on
 * top and is revealed right of the divider via clip-path; both images must
 * share the same framing for the seam to read cleanly.
 */
defineProps({
  before: { type: String, required: true },
  after: { type: String, required: true },
  beforeLabel: { type: String, default: 'Basis' },
  afterLabel: { type: String, default: 'Variante' },
  alt: { type: String, default: '' },
})

const position = ref(50)
const container = ref(null)
let dragging = false

function setFromClientX(clientX) {
  const rect = container.value?.getBoundingClientRect()
  if (!rect?.width) return
  const next = ((clientX - rect.left) / rect.width) * 100
  position.value = Math.min(100, Math.max(0, next))
}

function onPointerDown(event) {
  dragging = true
  try {
    event.currentTarget.setPointerCapture?.(event.pointerId)
  } catch {
    // pointer may already be gone
  }
  setFromClientX(event.clientX)
}

function onPointerMove(event) {
  if (dragging) setFromClientX(event.clientX)
}

function onPointerUp() {
  dragging = false
}

function onKeydown(event) {
  if (event.key === 'ArrowLeft') {
    position.value = Math.max(0, position.value - 5)
    event.preventDefault()
  }
  if (event.key === 'ArrowRight') {
    position.value = Math.min(100, position.value + 5)
    event.preventDefault()
  }
}
</script>

<template>
  <div
    ref="container"
    class="compare-slider absolute inset-0"
    role="slider"
    tabindex="0"
    :aria-label="`Vergleich: ${beforeLabel} und ${afterLabel}`"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(position)"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @lostpointercapture="onPointerUp"
    @keydown="onKeydown"
  >
    <img
      :src="before"
      :alt="`${alt} – ${beforeLabel}`"
      class="absolute inset-0 h-full w-full object-contain"
      draggable="false"
      decoding="async"
    />
    <img
      :src="after"
      :alt="`${alt} – ${afterLabel}`"
      class="absolute inset-0 h-full w-full object-contain"
      :style="{ clipPath: `inset(0 0 0 ${position}%)` }"
      draggable="false"
      decoding="async"
    />
    <span class="compare-slider__badge left-3">{{ beforeLabel }}</span>
    <span class="compare-slider__badge right-3">{{ afterLabel }}</span>
    <div class="compare-slider__divider" :style="{ left: `${position}%` }" aria-hidden="true">
      <span class="compare-slider__handle">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          class="h-4 w-4"
        >
          <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped>
.compare-slider {
  touch-action: none;
  cursor: ew-resize;
  user-select: none;
  -webkit-user-select: none;
}

.compare-slider__badge {
  position: absolute;
  top: 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 0.24rem 0.6rem;
  background: rgba(24, 20, 18, 0.72);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.compare-slider__divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.85);
  transform: translateX(-1px);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.45);
}

.compare-slider__handle {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  background: rgba(24, 20, 18, 0.78);
  color: white;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(8px);
}
</style>

import { computed, onBeforeUnmount, ref, watch } from 'vue'

const AUTOROTATE_MS = 900

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Drag-to-rotate state for an image frame arc (pseudo-360 viewer).
 * `frames` is a ref/computed of [{ angle, image }] sorted by angle; the arc is
 * clamped at both ends (no wrap-around).
 */
export function useFrameRotation(frames, { reducedMotion } = {}) {
  const frameIndex = ref(0)
  const isDragging = ref(false)
  const autorotate = ref(false)

  let drag = null
  let timer = null
  let direction = 1
  const preloadedSets = new Set()

  const frameCount = computed(() => frames.value?.length ?? 0)
  const hasFrames = computed(() => frameCount.value >= 2)
  const currentFrame = computed(() => frames.value?.[frameIndex.value] ?? null)

  function goToFrame(index) {
    frameIndex.value = clamp(index, 0, Math.max(0, frameCount.value - 1))
  }

  function stepFrame(delta) {
    stopAutorotate()
    goToFrame(frameIndex.value + delta)
  }

  function resetToCenter() {
    frameIndex.value = Math.floor(Math.max(0, frameCount.value - 1) / 2)
  }

  function onPointerDown(event) {
    if (!hasFrames.value) return
    stopAutorotate()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    drag = { startX: event.clientX, startFrame: frameIndex.value, width: event.currentTarget.clientWidth }
    isDragging.value = true
  }

  function onPointerMove(event) {
    if (!drag) return
    const delta = event.clientX - drag.startX
    const pxPerFrame = Math.max(36, drag.width / (frameCount.value * 2))
    // Dragging right orbits the camera left — "grab the object" feel.
    goToFrame(drag.startFrame - Math.round(delta / pxPerFrame))
  }

  function onPointerUp() {
    drag = null
    isDragging.value = false
  }

  function stopAutorotate() {
    autorotate.value = false
  }

  function toggleAutorotate() {
    if (reducedMotion?.value) return
    autorotate.value = !autorotate.value
  }

  watch(autorotate, (active) => {
    clearInterval(timer)
    timer = null
    if (!active) return
    timer = setInterval(() => {
      const last = frameCount.value - 1
      // Ping-pong across the clamped arc.
      if (frameIndex.value >= last) direction = -1
      else if (frameIndex.value <= 0) direction = 1
      goToFrame(frameIndex.value + direction)
    }, AUTOROTATE_MS)
  })

  if (reducedMotion) {
    watch(reducedMotion, (reduced) => {
      if (reduced) stopAutorotate()
    })
  }

  watch(frames, () => {
    stopAutorotate()
    resetToCenter()
  })
  resetToCenter()

  function preloadFrames() {
    const list = frames.value
    if (!list?.length) return
    const key = list[0].image
    if (preloadedSets.has(key)) return
    preloadedSets.add(key)
    const warm = () => {
      list.forEach((frame) => {
        const img = new Image()
        img.src = frame.image
      })
    }
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(warm, { timeout: 2000 })
    } else {
      setTimeout(warm, 200)
    }
  }

  onBeforeUnmount(() => clearInterval(timer))

  return {
    frameIndex,
    frameCount,
    hasFrames,
    currentFrame,
    isDragging,
    autorotate,
    toggleAutorotate,
    stopAutorotate,
    stepFrame,
    goToFrame,
    resetToCenter,
    preloadFrames,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}

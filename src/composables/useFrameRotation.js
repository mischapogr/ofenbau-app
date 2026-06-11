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
  const framesReady = ref(false)
  const preloadLoaded = ref(0)
  const preloadTotal = ref(0)

  let drag = null
  let timer = null
  let direction = 1
  const completedSets = new Set()
  const inflightSets = new Set()

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
    drag = {
      startX: event.clientX,
      startFrame: frameIndex.value,
      width: event.currentTarget.clientWidth,
    }
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

  function syncReadyState() {
    const key = frames.value?.[0]?.image
    framesReady.value = Boolean(key && completedSets.has(key))
    preloadLoaded.value = 0
    preloadTotal.value = 0
  }

  watch(frames, () => {
    stopAutorotate()
    resetToCenter()
    syncReadyState()
  })
  resetToCenter()
  syncReadyState()

  function preloadFrames({ immediate = false } = {}) {
    const list = frames.value
    if (!list?.length) return
    const key = list[0].image
    if (completedSets.has(key)) {
      framesReady.value = true
      return
    }
    if (inflightSets.has(key)) return
    inflightSets.add(key)
    preloadTotal.value = list.length
    preloadLoaded.value = 0
    const isCurrent = () => frames.value?.[0]?.image === key
    const warm = () => {
      let settled = 0
      list.forEach((frame) => {
        const img = new Image()
        const settle = () => {
          settled += 1
          if (isCurrent()) preloadLoaded.value = settled
          if (settled === list.length) {
            completedSets.add(key)
            inflightSets.delete(key)
            if (isCurrent()) framesReady.value = true
          }
        }
        img.onload = settle
        img.onerror = settle
        img.src = frame.image
      })
    }
    if (immediate) {
      warm()
    } else if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
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
    framesReady,
    preloadLoaded,
    preloadTotal,
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

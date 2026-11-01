import { computed, onBeforeUnmount, ref, unref, watch } from 'vue'

const AUTOROTATE_MS = 900

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Drag-to-rotate state for an image frame arc (pseudo-3D turntable).
 * `frames` is a ref/computed of [{ angle, image }] sorted by angle.
 *
 * The arc is clamped at both ends unless the frames cover a full circle: with
 * `wrap` unset, wrapping is derived from the angle coverage (span + one step
 * >= 360°), so a true 360° set spins continuously while a partial arc (e.g.
 * -60° … +60°) stops at its ends. Pass `wrap` (boolean or ref) to override.
 */
export function useFrameRotation(frames, { reducedMotion, wrap } = {}) {
  const frameIndex = ref(0)
  const isDragging = ref(false)
  const autorotate = ref(false)
  const framesReady = ref(false)
  const preloadLoaded = ref(0)
  const preloadTotal = ref(0)

  let drag = null
  let timer = null
  let direction = 1
  let velocityX = 0
  let lastMoveX = 0
  let lastMoveT = 0
  let inertiaFrame = null
  const completedSets = new Set()
  const inflightSets = new Set()

  const frameCount = computed(() => frames.value?.length ?? 0)
  const hasFrames = computed(() => frameCount.value >= 2)
  const currentFrame = computed(() => frames.value?.[frameIndex.value] ?? null)
  const arcRange = computed(() => {
    const list = frames.value || []
    if (list.length < 2) return { min: 0, max: 0, span: 0 }
    const min = Number(list[0].angle) || 0
    const max = Number(list[list.length - 1].angle) || 0
    return { min, max, span: max - min }
  })
  const spansFullCircle = computed(() => {
    const { span } = arcRange.value
    if (!hasFrames.value || span <= 0) return false
    const step = span / (frameCount.value - 1)
    return span + step >= 360
  })
  const wraps = computed(() => (wrap === undefined ? spansFullCircle.value : Boolean(unref(wrap))))

  function goToFrame(index) {
    const last = Math.max(0, frameCount.value - 1)
    frameIndex.value = wraps.value
      ? ((index % frameCount.value) + frameCount.value) % frameCount.value
      : clamp(index, 0, last)
  }

  function stepFrame(delta) {
    stopAutorotate()
    cancelInertia()
    goToFrame(frameIndex.value + delta)
  }

  function resetToCenter() {
    frameIndex.value = Math.floor(Math.max(0, frameCount.value - 1) / 2)
  }

  function cancelInertia() {
    if (inertiaFrame) cancelAnimationFrame(inertiaFrame)
    inertiaFrame = null
  }

  // Flick momentum: keep stepping frames after release with decaying
  // velocity; stops at the arc ends unless the set wraps.
  function startInertia(velocity, pxPerFrame) {
    cancelInertia()
    let v = velocity
    let travelled = 0
    let lastT = performance.now()
    const tick = (now) => {
      const dt = now - lastT
      lastT = now
      travelled += v * dt
      v *= Math.pow(0.9, dt / 16.7)
      while (Math.abs(travelled) >= pxPerFrame) {
        // Same inverted mapping as the live drag.
        const step = travelled > 0 ? -1 : 1
        const next = frameIndex.value + step
        if (!wraps.value && (next < 0 || next > frameCount.value - 1)) return
        goToFrame(next)
        travelled -= Math.sign(travelled) * pxPerFrame
      }
      if (Math.abs(v) > 0.05) inertiaFrame = requestAnimationFrame(tick)
      else inertiaFrame = null
    }
    inertiaFrame = requestAnimationFrame(tick)
  }

  function pxPerFrameFor(width) {
    return Math.max(36, width / (frameCount.value * 2))
  }

  function onPointerDown(event) {
    if (!hasFrames.value) return
    stopAutorotate()
    cancelInertia()
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // pointer may already be gone
    }
    drag = {
      startX: event.clientX,
      startFrame: frameIndex.value,
      width: event.currentTarget.clientWidth,
    }
    velocityX = 0
    lastMoveX = event.clientX
    lastMoveT = performance.now()
    isDragging.value = true
  }

  function onPointerMove(event) {
    if (!drag) return
    const now = performance.now()
    const dt = now - lastMoveT
    if (dt > 0) {
      const instant = (event.clientX - lastMoveX) / dt
      velocityX = 0.8 * instant + 0.2 * velocityX
    }
    lastMoveX = event.clientX
    lastMoveT = now
    const delta = event.clientX - drag.startX
    // Dragging right orbits the camera left — "grab the object" feel.
    goToFrame(drag.startFrame - Math.round(delta / pxPerFrameFor(drag.width)))
  }

  function onPointerUp() {
    const releasedDrag = drag
    drag = null
    isDragging.value = false
    if (!releasedDrag) return
    // Flicks faster than ~0.3 px/ms keep spinning; slower releases stop dead.
    if (Math.abs(velocityX) > 0.3 && !reducedMotion?.value) {
      startInertia(velocityX, pxPerFrameFor(releasedDrag.width))
    }
  }

  function cancelDrag() {
    drag = null
    isDragging.value = false
    cancelInertia()
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
    cancelInertia()
    timer = setInterval(() => {
      const last = frameCount.value - 1
      // Full circle: spin on; partial arc: ping-pong between the ends.
      if (wraps.value) direction = 1
      else if (frameIndex.value >= last) direction = -1
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

  // Same angles, different images (e.g. a material preset of the same
  // turntable): keep the current angle. A different arc starts at its centre.
  const sameAngles = (a = [], b = []) =>
    a.length === b.length && a.every((frame, i) => frame.angle === b[i]?.angle)
  watch(frames, (next, prev) => {
    cancelInertia()
    if (!sameAngles(next, prev)) {
      stopAutorotate()
      resetToCenter()
    }
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

  onBeforeUnmount(() => {
    clearInterval(timer)
    cancelInertia()
  })

  return {
    frameIndex,
    frameCount,
    hasFrames,
    currentFrame,
    arcRange,
    wraps,
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
    cancelDrag,
  }
}

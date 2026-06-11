import { computed, ref } from 'vue'

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function capturePointer(event) {
  try {
    event.currentTarget.setPointerCapture?.(event.pointerId)
  } catch {
    // pointer may already be gone (e.g. released mid-handler)
  }
}

/**
 * Two-finger pinch zoom with one-finger pan while zoomed and double-tap
 * reset. Exposes `scale`/`tx`/`ty` to be applied as a single transform on
 * the stage content; the caller routes pointer events here first and skips
 * its own drag handling while `activePointers >= 2` or `isZoomed`.
 */
export function usePinchZoom({ maxScale = 2, onPinchStart } = {}) {
  const scale = ref(1)
  const tx = ref(0)
  const ty = ref(0)
  const activePointers = ref(0)

  const pointers = new Map()
  let pinch = null
  let pan = null
  let lastTap = 0

  const isZoomed = computed(() => scale.value > 1.02)

  function reset() {
    scale.value = 1
    tx.value = 0
    ty.value = 0
  }

  // Keep the zoomed content covering the container: pan is limited to the
  // overflow created by the current scale.
  function clampOffsets(el) {
    const limitX = ((scale.value - 1) * (el?.clientWidth ?? 0)) / 2
    const limitY = ((scale.value - 1) * (el?.clientHeight ?? 0)) / 2
    tx.value = Math.min(limitX, Math.max(-limitX, tx.value))
    ty.value = Math.min(limitY, Math.max(-limitY, ty.value))
  }

  function onPointerDown(event) {
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    activePointers.value = pointers.size

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      pinch = {
        startDist: distance(a, b) || 1,
        startScale: scale.value,
        startTx: tx.value,
        startTy: ty.value,
        startMid: midpoint(a, b),
      }
      pan = null
      capturePointer(event)
      onPinchStart?.()
      return
    }

    if (event.pointerType === 'touch') {
      const now = performance.now()
      if (now - lastTap < 320 && isZoomed.value) reset()
      lastTap = now
    }
    if (isZoomed.value) {
      pan = { x: event.clientX, y: event.clientY, tx: tx.value, ty: ty.value }
      capturePointer(event)
    }
  }

  function onPointerMove(event) {
    if (pointers.has(event.pointerId)) {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    }

    if (pinch && pointers.size >= 2) {
      const [a, b] = [...pointers.values()]
      const ratio = distance(a, b) / pinch.startDist
      scale.value = Math.min(maxScale, Math.max(1, pinch.startScale * ratio))
      const mid = midpoint(a, b)
      tx.value = pinch.startTx + (mid.x - pinch.startMid.x)
      ty.value = pinch.startTy + (mid.y - pinch.startMid.y)
      clampOffsets(event.currentTarget)
      return
    }

    if (pan && isZoomed.value) {
      tx.value = pan.tx + (event.clientX - pan.x)
      ty.value = pan.ty + (event.clientY - pan.y)
      clampOffsets(event.currentTarget)
    }
  }

  function onPointerUp(event) {
    pointers.delete(event.pointerId)
    activePointers.value = pointers.size
    if (pointers.size < 2) pinch = null
    if (pointers.size === 0) pan = null
    if (!isZoomed.value) reset()
  }

  return {
    scale,
    tx,
    ty,
    isZoomed,
    activePointers,
    reset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}

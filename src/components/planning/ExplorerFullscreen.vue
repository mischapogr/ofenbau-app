<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from '../AppIcon.vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/**
 * Fullscreen modal of the current stage (teleported to <body>): focus trap,
 * Escape to close, arrow keys to step, body scroll lock, focus restore.
 */
const {
  expanded,
  closeExpanded,
  current,
  currentView,
  stageLabel,
  stageText,
  stepView,
  isRotateMode,
  isVariantMode,
  isModelMode,
  rotation,
  displayedVariantSrc,
  activeLayerList,
  markFailed,
  isXrayMode,
  xrayImage,
  xrayLabel,
  warmFrames,
} = useExplorerContext()

const modalRef = ref(null)
const closeButtonRef = ref(null)
let lastFocused = null

function trapFocus(e) {
  const root = modalRef.value
  if (!root) return
  const focusables = root.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables.length) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    last.focus()
    e.preventDefault()
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus()
    e.preventDefault()
  }
}

function onKey(e) {
  if (!expanded.value) return
  if (e.key === 'Escape') closeExpanded()
  if (e.key === 'Tab') trapFocus(e)
  if (e.key === 'ArrowRight') stepView(1)
  if (e.key === 'ArrowLeft') stepView(-1)
}

function onRotatePointerDown(e) {
  warmFrames()
  rotation.onPointerDown(e)
}

watch(expanded, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    window.addEventListener('keydown', onKey)
    lastFocused = document.activeElement
    nextTick(() => closeButtonRef.value?.focus())
  } else {
    window.removeEventListener('keydown', onKey)
    lastFocused?.focus?.()
    lastFocused = null
  }
})

onBeforeUnmount(() => {
  if (expanded.value) document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="plan-view">
      <div
        v-if="expanded && current"
        ref="modalRef"
        class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/92 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`${current.title} - ${currentView?.label}`"
        @click.self="closeExpanded"
      >
        <button
          ref="closeButtonRef"
          type="button"
          class="press-feedback absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Schließen"
          @click="closeExpanded"
        >
          <AppIcon name="close" class="h-6 w-6" />
        </button>
        <button
          type="button"
          class="press-feedback absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
          aria-label="Vorherige Ansicht"
          @click="stepView(-1)"
        >
          <AppIcon name="chevron" class="h-6 w-6 rotate-180" />
        </button>
        <button
          type="button"
          class="press-feedback absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          aria-label="Nächste Ansicht"
          @click="stepView(1)"
        >
          <AppIcon name="chevron" class="h-6 w-6" />
        </button>

        <figure class="w-full max-w-7xl">
          <img
            v-if="isRotateMode"
            :src="rotation.currentFrame.value?.image"
            :alt="`${current.title} - Rundblick ${rotation.currentFrame.value?.angle}°`"
            class="plan-rotate-stage max-h-[82vh] w-full rounded-2xl object-contain shadow-lift"
            :class="rotation.isDragging.value ? 'plan-rotate-stage--dragging' : ''"
            decoding="async"
            draggable="false"
            @pointerdown="onRotatePointerDown"
            @pointermove="rotation.onPointerMove"
            @pointerup="rotation.onPointerUp"
            @pointercancel="rotation.onPointerUp"
            @lostpointercapture="rotation.onPointerUp"
          />
          <div v-else-if="isVariantMode" class="relative h-[78vh] w-full">
            <Transition name="stage-fade">
              <img
                v-if="displayedVariantSrc"
                :key="displayedVariantSrc"
                :src="displayedVariantSrc"
                :alt="`${current.title} - ${stageLabel}`"
                class="absolute inset-0 h-full w-full rounded-2xl object-contain shadow-lift"
                decoding="async"
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
            />
          </div>
          <img
            v-else
            :src="
              isXrayMode
                ? xrayImage || current.image
                : isModelMode
                  ? current.image
                  : currentView?.image
            "
            :alt="
              isXrayMode
                ? `${current.title} - ${xrayLabel}`
                : `${current.title} - ${currentView?.label}`
            "
            class="max-h-[82vh] w-full rounded-2xl object-contain shadow-lift"
            :class="isXrayMode && !xrayImage ? 'plan-xray' : ''"
            decoding="async"
          />
          <figcaption class="mt-4 text-center text-white">
            <p class="font-display text-xl font-semibold">{{ current.title }} · {{ stageLabel }}</p>
            <p class="mt-1 text-sm text-white/60">{{ stageText }}</p>
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>

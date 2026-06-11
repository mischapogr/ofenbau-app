<script setup>
import { computed, nextTick, ref, watch, onBeforeUnmount } from 'vue'
import BaseContainer from './BaseContainer.vue'
import BaseButton from './BaseButton.vue'
import BaseImage from './BaseImage.vue'
import CompareSlider from './CompareSlider.vue'
import AppIcon from './AppIcon.vue'
import { planningExamples } from '@/data/planning'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useFrameRotation } from '@/composables/useFrameRotation'
import { useDeferredImage } from '@/composables/useDeferredImage'
import { usePinchZoom } from '@/composables/usePinchZoom'

const categories = ['Alle', ...new Set(planningExamples.map((example) => example.category))]
const activeCategory = ref('Alle')
const activeIndex = ref(0)
const activeViewIndex = ref(0)
const activeDecisionKey = ref('')
const zoom = ref(1)
const expanded = ref(false)
const stageMode = ref('view')

const reducedMotion = useReducedMotion()

const visibleExamples = computed(() =>
  activeCategory.value === 'Alle'
    ? planningExamples
    : planningExamples.filter((example) => example.category === activeCategory.value)
)
const current = computed(() => visibleExamples.value[activeIndex.value] || visibleExamples.value[0])
const currentViews = computed(() =>
  current.value?.views?.length
    ? current.value.views
    : [{ label: 'Ansicht', image: current.value?.image, text: current.value?.description }]
)
const currentView = computed(
  () => currentViews.value[activeViewIndex.value] || currentViews.value[0] || null
)
const currentAnnotations = computed(
  () => currentView.value?.annotations || current.value?.annotations || []
)
// Tapped hotspot; its label is echoed in the bottom info bar so it works on
// mobile where the inline labels are hidden.
const activeAnnotation = ref(null)
function toggleAnnotation(annotation) {
  activeAnnotation.value = activeAnnotation.value === annotation.label ? null : annotation.label
}
const activeDecisionOptions = computed(() => current.value?.decisions || [])
const activeDecision = computed(
  () =>
    activeDecisionOptions.value.find((option) => option.key === activeDecisionKey.value) ||
    activeDecisionOptions.value[0]
)

const currentFrames = computed(() => current.value?.frames || [])
const rotation = useFrameRotation(currentFrames, { reducedMotion })
const isRotateMode = computed(() => stageMode.value === 'rotate' && rotation.hasFrames.value)

// Pinch zoom shares one transform with the zoom slider; while pinching or
// zoomed, the rotate drag stands down so panning doesn't spin the arc.
const pinch = usePinchZoom({ maxScale: 2, onPinchStart: () => rotation.cancelDrag() })
const stageTransform = computed(
  () =>
    `translate(${pinch.tx.value}px, ${pinch.ty.value}px) scale(${(zoom.value * pinch.scale.value).toFixed(3)})`
)
const stageTouchAction = computed(() =>
  pinch.activePointers.value >= 2 || pinch.isZoomed.value ? 'none' : 'pan-y'
)

function onRotatePointerDown(e) {
  pinch.onPointerDown(e)
  if (pinch.activePointers.value >= 2 || pinch.isZoomed.value) return
  rotation.onPointerDown(e)
}
function onRotatePointerMove(e) {
  pinch.onPointerMove(e)
  if (pinch.activePointers.value >= 2 || pinch.isZoomed.value) return
  rotation.onPointerMove(e)
}
function onRotatePointerUp(e) {
  pinch.onPointerUp(e)
  rotation.onPointerUp(e)
}

const activeVariant = ref(null) // { key, choice }
const currentVariants = computed(() => current.value?.variants || null)
const activeVariantData = computed(() =>
  activeVariant.value
    ? currentVariants.value?.[activeVariant.value.key]?.[activeVariant.value.choice] || null
    : null
)
const isVariantMode = computed(() => stageMode.value === 'variant' && Boolean(activeVariantData.value))

// Decode-before-swap: the stage shows the previous variant until the next one
// is ready, then crossfades (see .stage-fade).
const variantImageSrc = computed(() => activeVariantData.value?.image || null)
const displayedVariantSrc = useDeferredImage(variantImageSrc)

const compareMode = ref(false)
const compareBase = computed(() => {
  const base = current.value?.image
  const variant = activeVariantData.value?.image
  return base && variant && base !== variant ? base : null
})

const failedImages = ref(new Set())
function markFailed(src) {
  if (!src || failedImages.value.has(src)) return
  const next = new Set(failedImages.value)
  next.add(src)
  failedImages.value = next
}
const variantImageFailed = computed(() =>
  Boolean(displayedVariantSrc.value && failedImages.value.has(displayedVariantSrc.value))
)
const currentFrameFailed = computed(() => {
  const src = rotation.currentFrame.value?.image
  return Boolean(src && failedImages.value.has(src))
})

function variantFor(key, choice) {
  return currentVariants.value?.[key]?.[choice] || null
}

const stageLabel = computed(() => {
  if (isVariantMode.value) {
    const option = activeDecisionOptions.value.find((item) => item.key === activeVariant.value.key)
    return `Simulation: ${option?.label} · ${activeVariant.value.choice}`
  }
  if (isRotateMode.value) return `Rundblick ${rotation.currentFrame.value?.angle ?? 0}°`
  return currentView.value?.label
})
const stageText = computed(() => {
  if (isVariantMode.value) return activeVariantData.value?.text
  if (isRotateMode.value)
    return 'Ziehen Sie das Bild, um den Entwurf aus verschiedenen Winkeln zu betrachten.'
  return currentView.value?.text
})

function syncStageMode() {
  activeVariant.value = null
  stageMode.value = rotation.hasFrames.value ? 'rotate' : 'view'
}

function selectChoice(option, choice) {
  if (!variantFor(option.key, choice)) return
  activeDecisionKey.value = option.key
  const isSame =
    activeVariant.value?.key === option.key && activeVariant.value?.choice === choice
  if (isSame) {
    syncStageMode()
    return
  }
  activeVariant.value = { key: option.key, choice }
  stageMode.value = 'variant'
  rotation.stopAutorotate()
  zoom.value = 1
}

function stepVariant(dir) {
  const option = activeDecisionOptions.value.find((item) => item.key === activeVariant.value?.key)
  if (!option) return
  const choices = option.choices.filter((choice) => variantFor(option.key, choice))
  const index = choices.indexOf(activeVariant.value.choice)
  if (index === -1 || choices.length < 2) return
  const next = choices[(index + dir + choices.length) % choices.length]
  activeVariant.value = { key: option.key, choice: next }
}

function selectCategory(category) {
  activeCategory.value = category
  activeIndex.value = 0
  activeViewIndex.value = 0
  zoom.value = 1
  syncStageMode()
}

function selectExample(index) {
  activeIndex.value = index
  activeViewIndex.value = 0
  zoom.value = 1
  syncStageMode()
}

function selectView(index) {
  activeViewIndex.value = index
  zoom.value = 1
  activeVariant.value = null
  stageMode.value = 'view'
}

function enterRotateMode() {
  if (!rotation.hasFrames.value) return
  activeVariant.value = null
  stageMode.value = 'rotate'
  rotation.resetToCenter()
  rotation.preloadFrames({ immediate: true })
  zoom.value = 1
}

function stepView(dir) {
  if (isVariantMode.value) {
    stepVariant(dir)
    return
  }
  if (isRotateMode.value) {
    rotation.stepFrame(dir)
    return
  }
  const count = currentViews.value.length
  if (!count) return
  activeViewIndex.value = (activeViewIndex.value + dir + count) % count
  zoom.value = 1
}

function setZoom(value) {
  zoom.value = Math.min(1.45, Math.max(1, value))
}

function closeExpanded() {
  expanded.value = false
}

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

function onStageKey(e) {
  if (e.key === 'ArrowRight') {
    stepView(1)
    e.preventDefault()
  }
  if (e.key === 'ArrowLeft') {
    stepView(-1)
    e.preventDefault()
  }
}

watch(
  current,
  (example) => {
    if (example?.frames?.length) rotation.preloadFrames()
    activeDecisionKey.value = example?.decisions?.[0]?.key || ''
    syncStageMode()
  },
  { immediate: true }
)

watch(expanded, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    window.addEventListener('keydown', onKey)
    rotation.stopAutorotate()
    lastFocused = document.activeElement
    nextTick(() => closeButtonRef.value?.focus())
  } else {
    window.removeEventListener('keydown', onKey)
    lastFocused?.focus?.()
    lastFocused = null
  }
})

watch(isVariantMode, (active) => {
  if (!active) compareMode.value = false
})

watch([stageMode, current], () => pinch.reset())
watch([currentView, current], () => {
  activeAnnotation.value = null
})

onBeforeUnmount(() => {
  if (expanded.value) document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <section class="section bg-surface-muted">
    <BaseContainer>
      <div v-reveal class="max-w-2xl">
        <p class="eyebrow">3D-Planung erleben</p>
        <h2 class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Von Idee, Material und Raum zur sicheren Entscheidung
        </h2>
        <p class="mt-4 text-lg leading-relaxed text-content-muted">
          Wechseln Sie zwischen Use Cases, Perspektiven, Planungsdetails und Entscheidungen. So
          sehen Sie vor der Umsetzung, wie Ofen, Material und Raum zusammenwirken.
        </p>
      </div>

      <div
        class="mt-10 overflow-hidden rounded-2xl bg-ink-950 text-white shadow-card ring-1 ring-ink-900"
      >
        <div class="grid gap-0 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div class="relative min-h-[26rem] bg-ink-900">
            <div class="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                class="press-feedback rounded-full px-3.5 py-2 text-xs font-semibold transition-colors"
                :class="
                  activeCategory === category
                    ? 'bg-brand-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                "
                :aria-pressed="activeCategory === category"
                @click="selectCategory(category)"
              >
                {{ category }}
              </button>
            </div>

            <div class="absolute right-4 top-4 z-10 flex gap-2">
              <button
                type="button"
                class="press-feedback inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
                aria-label="Vorherige Ansicht"
                @click="stepView(-1)"
              >
                <AppIcon name="chevron" class="h-5 w-5 rotate-180" />
              </button>
              <button
                type="button"
                class="press-feedback inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
                aria-label="Nächste Ansicht"
                @click="stepView(1)"
              >
                <AppIcon name="chevron" class="h-5 w-5" />
              </button>
              <button
                type="button"
                class="press-feedback inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20"
                aria-label="3D-Entwurf vergrößern"
                @click="expanded = true"
              >
                <AppIcon name="maximize" class="h-5 w-5" />
              </button>
            </div>

            <div
              v-if="isRotateMode"
              class="plan-rotate-stage h-full min-h-[26rem] overflow-hidden"
              :class="rotation.isDragging.value ? 'plan-rotate-stage--dragging' : ''"
              role="slider"
              tabindex="0"
              aria-label="3D-Rundblick: Winkel mit Pfeiltasten oder Ziehen wechseln"
              :aria-valuemin="currentFrames[0]?.angle"
              :aria-valuemax="currentFrames[currentFrames.length - 1]?.angle"
              :aria-valuenow="rotation.currentFrame.value?.angle"
              :style="{ touchAction: stageTouchAction }"
              @pointerdown="onRotatePointerDown"
              @pointermove="onRotatePointerMove"
              @pointerup="onRotatePointerUp"
              @pointercancel="onRotatePointerUp"
              @lostpointercapture="onRotatePointerUp"
              @keydown="onStageKey"
            >
              <div
                class="relative h-full transition-transform duration-500"
                :class="pinch.isZoomed.value ? 'transition-none' : ''"
                :style="{ transform: stageTransform }"
              >
                <img
                  v-for="(frame, index) in currentFrames"
                  v-show="index === rotation.frameIndex.value && !currentFrameFailed"
                  :key="frame.image"
                  :src="frame.image"
                  :alt="
                    index === rotation.frameIndex.value
                      ? `${current.title} - Rundblick ${frame.angle}°`
                      : undefined
                  "
                  :aria-hidden="index !== rotation.frameIndex.value"
                  class="h-full w-full object-cover"
                  draggable="false"
                  loading="eager"
                  decoding="async"
                  @error="markFailed(frame.image)"
                />
                <BaseImage
                  v-if="currentFrameFailed"
                  :motif="current?.motif"
                  :tone="current?.tone"
                  :alt="`${current?.title} - Rundblick`"
                  fill
                  rounded="rounded-none"
                />
              </div>
              <div
                v-if="!rotation.framesReady.value"
                class="pointer-events-none absolute left-1/2 top-16 z-10 -translate-x-1/2"
              >
                <div
                  class="flex items-center gap-2 rounded-full bg-ink-950/75 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur"
                >
                  <span>Lädt Rundblick…</span>
                  <span class="font-mono">
                    {{ rotation.preloadLoaded.value }}/{{
                      rotation.preloadTotal.value || currentFrames.length
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else-if="isVariantMode" class="relative h-full min-h-[26rem] overflow-hidden">
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
              </div>
            </div>
            <div
              v-else
              class="h-full overflow-hidden"
              :style="{ touchAction: stageTouchAction }"
              @pointerdown="pinch.onPointerDown"
              @pointermove="pinch.onPointerMove"
              @pointerup="pinch.onPointerUp"
              @pointercancel="pinch.onPointerUp"
              @lostpointercapture="pinch.onPointerUp"
            >
              <BaseImage
                v-if="current"
                :key="`${current.id}-${currentView?.label}`"
                :src="currentView?.image"
                :motif="current.motif"
                :tone="current.tone"
                :alt="`${current.title} - ${currentView?.label}`"
                ratio="16/10"
                rounded="rounded-none"
                eager
                class="h-full min-h-[26rem] transition-transform duration-500"
                :class="pinch.isZoomed.value ? 'transition-none' : ''"
                :style="{ transform: stageTransform }"
              />
            </div>

            <div
              v-if="!isRotateMode && !isVariantMode && currentAnnotations.length"
              class="pointer-events-none absolute inset-0 z-10"
            >
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

            <div
              class="absolute bottom-4 left-4 right-4 z-10 grid gap-3 rounded-xl bg-ink-950/70 p-3 backdrop-blur md:grid-cols-[1fr_auto] md:items-center"
            >
              <div v-if="current">
                <p class="font-display text-xl font-semibold">
                  {{ current.title }} · {{ stageLabel }}
                </p>
                <p class="mt-1 text-sm text-white/65">{{ stageText }}</p>
                <p v-if="activeAnnotation" class="mt-1 text-sm font-semibold text-brand-300">
                  {{ activeAnnotation }}
                </p>
                <div v-if="isRotateMode" class="mt-2 flex items-center gap-3">
                  <div class="flex items-center gap-1.5">
                    <button
                      v-for="(frame, index) in currentFrames"
                      :key="frame.angle"
                      type="button"
                      class="press-feedback h-2.5 w-2.5 rounded-full transition-colors"
                      :class="
                        index === rotation.frameIndex.value
                          ? 'bg-brand-500'
                          : 'bg-white/25 hover:bg-white/45'
                      "
                      :aria-label="`Ansicht ${frame.angle}°`"
                      :aria-pressed="index === rotation.frameIndex.value"
                      @click="rotation.goToFrame(index)"
                    ></button>
                  </div>
                  <span class="font-mono text-xs uppercase tracking-label text-white/50">
                    {{ rotation.currentFrame.value?.angle }}°
                  </span>
                  <button
                    v-if="!reducedMotion"
                    type="button"
                    class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                    :class="
                      rotation.autorotate.value
                        ? 'bg-brand-500 text-white'
                        : 'bg-white/10 text-white/65 hover:bg-white/20 hover:text-white'
                    "
                    :aria-pressed="rotation.autorotate.value"
                    @click="rotation.toggleAutorotate()"
                  >
                    {{ rotation.autorotate.value ? 'Stopp' : 'Rundgang' }}
                  </button>
                </div>
                <div v-else-if="isVariantMode && compareBase" class="mt-2">
                  <button
                    type="button"
                    class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                    :class="
                      compareMode
                        ? 'bg-brand-500 text-white'
                        : 'bg-white/10 text-white/65 hover:bg-white/20 hover:text-white'
                    "
                    :aria-pressed="compareMode"
                    @click="compareMode = !compareMode"
                  >
                    Vergleich Basis/Variante
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="press-feedback inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
                  aria-label="Ansicht verkleinern"
                  @click="setZoom(zoom - 0.15)"
                >
                  <AppIcon name="zoomOut" class="h-4 w-4" />
                </button>
                <input
                  v-model.number="zoom"
                  type="range"
                  min="1"
                  max="1.45"
                  step="0.05"
                  aria-label="3D-Ansicht zoomen"
                  class="w-24 accent-brand-500"
                />
                <button
                  type="button"
                  class="press-feedback inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
                  aria-label="Ansicht vergrößern"
                  @click="setZoom(zoom + 0.15)"
                >
                  <AppIcon name="zoomIn" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <aside class="bg-ink-950 p-5">
            <div class="flex items-center gap-2 text-sm font-semibold text-white/80">
              <AppIcon name="rotate" class="h-4 w-4 text-brand-400" />
              Perspektiven
            </div>
            <div class="mt-4 grid gap-3">
              <button
                v-for="(example, index) in visibleExamples"
                :key="example.id"
                type="button"
                class="press-feedback grid grid-cols-[5.5rem_1fr] gap-3 rounded-xl p-2 text-left transition-colors"
                :class="
                  activeIndex === index
                    ? 'bg-white/10 ring-1 ring-brand-400/50'
                    : 'bg-white/5 hover:bg-white/10'
                "
                @click="selectExample(index)"
              >
                <BaseImage
                  :src="example.image"
                  :motif="example.motif"
                  :tone="example.tone"
                  :alt="example.title"
                  ratio="4/3"
                  rounded="rounded-lg"
                />
                <span class="min-w-0 self-center">
                  <span class="block text-xs uppercase tracking-label text-brand-300">
                    {{ example.label }}
                  </span>
                  <span class="mt-1 block text-sm font-semibold text-white">{{
                    example.title
                  }}</span>
                </span>
              </button>
            </div>

            <div v-if="currentViews.length > 1 || rotation.hasFrames.value" class="mt-5">
              <p class="text-xs font-semibold uppercase tracking-label text-white/45">Ansichten</p>
              <button
                v-if="rotation.hasFrames.value"
                type="button"
                class="press-feedback mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                :class="
                  isRotateMode
                    ? 'bg-brand-500 text-white'
                    : 'bg-white/8 text-white/65 hover:bg-white/14 hover:text-white'
                "
                :aria-pressed="isRotateMode"
                @click="enterRotateMode"
              >
                <AppIcon name="rotate" class="h-4 w-4" />
                360°-Rundblick
              </button>
              <div class="mt-2 grid grid-cols-3 gap-2">
                <button
                  v-for="(view, index) in currentViews"
                  :key="view.label"
                  type="button"
                  class="press-feedback overflow-hidden rounded-lg text-left transition-colors"
                  :class="
                    !isRotateMode && activeViewIndex === index
                      ? 'ring-2 ring-brand-400/70'
                      : 'opacity-75 ring-1 ring-white/10 hover:opacity-100'
                  "
                  :aria-pressed="!isRotateMode && activeViewIndex === index"
                  @click="selectView(index)"
                >
                  <BaseImage
                    :src="view.image"
                    :motif="current?.motif"
                    :tone="current?.tone"
                    :alt="view.label"
                    ratio="16/10"
                    rounded="rounded-none"
                  />
                  <span
                    class="block px-2 py-1.5 text-xs font-semibold"
                    :class="!isRotateMode && activeViewIndex === index ? 'text-white' : 'text-white/65'"
                  >
                    {{ view.label }}
                  </span>
                </button>
              </div>
            </div>

            <div v-if="activeDecisionOptions.length" class="mt-5 border-t border-white/10 pt-5">
              <p class="text-xs font-semibold uppercase tracking-label text-white/45">
                Entscheidung simulieren
              </p>
              <div class="mt-3 grid grid-cols-2 gap-2">
                <button
                  v-for="option in activeDecisionOptions"
                  :key="option.key"
                  type="button"
                  class="press-feedback rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors"
                  :class="
                    activeDecisionKey === option.key
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/8 text-white/65 hover:bg-white/14 hover:text-white'
                  "
                  :aria-pressed="activeDecisionKey === option.key"
                  @click="activeDecisionKey = option.key"
                >
                  {{ option.label }}
                </button>
              </div>
              <div v-if="activeDecision" class="mt-3 flex flex-wrap gap-2">
                <template v-for="choice in activeDecision.choices" :key="choice">
                  <button
                    v-if="variantFor(activeDecision.key, choice)"
                    type="button"
                    class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                    :class="
                      isVariantMode &&
                      activeVariant?.key === activeDecision.key &&
                      activeVariant?.choice === choice
                        ? 'bg-brand-500 text-white'
                        : 'bg-white/8 text-white/70 hover:bg-white/16 hover:text-white'
                    "
                    :aria-pressed="
                      isVariantMode &&
                      activeVariant?.key === activeDecision.key &&
                      activeVariant?.choice === choice
                    "
                    @click="selectChoice(activeDecision, choice)"
                  >
                    {{ choice }}
                  </button>
                  <span v-else class="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70">
                    {{ choice }}
                  </span>
                </template>
              </div>
              <p
                v-if="currentVariants"
                class="mt-2 text-xs text-white/45"
              >
                Variante antippen, um sie in der Bühne zu sehen.
              </p>
            </div>

            <div v-if="current" class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="spec in current.specs"
                :key="spec"
                class="rounded-full bg-white/8 px-3 py-1 text-xs text-white/65"
              >
                {{ spec }}
              </span>
            </div>

            <BaseButton
              :to="{ name: 'contact', query: { topic: '3d-planung', source: '3d-planung' } }"
              size="lg"
              class="mt-6 w-full"
            >
              3D-Plan anfragen
              <AppIcon name="arrow" class="h-4 w-4" />
            </BaseButton>
          </aside>
        </div>
      </div>
    </BaseContainer>
  </section>

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
            @pointerdown="rotation.onPointerDown"
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
          </div>
          <img
            v-else
            :src="currentView?.image"
            :alt="`${current.title} - ${currentView?.label}`"
            class="max-h-[82vh] w-full rounded-2xl object-contain shadow-lift"
            decoding="async"
          />
          <figcaption class="mt-4 text-center text-white">
            <p class="font-display text-xl font-semibold">
              {{ current.title }} · {{ stageLabel }}
            </p>
            <p class="mt-1 text-sm text-white/60">{{ stageText }}</p>
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.plan-rotate-stage {
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.plan-rotate-stage--dragging {
  cursor: grabbing;
}

.plan-hotspot {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transform: translate(-0.75rem, -50%);
  border: 0;
  padding: 0;
  background: none;
  cursor: pointer;
}

.plan-hotspot--active .plan-hotspot__dot {
  box-shadow: 0 0 0 0.5rem rgba(227, 82, 5, 0.45);
}

.plan-hotspot__dot {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  background: rgb(var(--color-brand-500));
  box-shadow: 0 0 0 0.35rem rgba(227, 82, 5, 0.28);
}

.plan-hotspot__label {
  max-width: 8rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 0.24rem 0.55rem;
  background: rgba(24, 20, 18, 0.72);
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.15;
  white-space: nowrap;
  backdrop-filter: blur(8px);
}

.plan-view-enter-active,
.plan-view-leave-active {
  transition: opacity 0.22s ease;
}
.plan-view-enter-from,
.plan-view-leave-to {
  opacity: 0;
}

.stage-fade-enter-active,
.stage-fade-leave-active {
  transition: opacity 0.25s ease;
}
.stage-fade-enter-from,
.stage-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .stage-fade-enter-active,
  .stage-fade-leave-active {
    transition: none;
  }
}

@media (max-width: 640px) {
  .plan-hotspot__label {
    display: none;
  }
}
</style>

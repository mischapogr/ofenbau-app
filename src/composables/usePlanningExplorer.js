import { computed, inject, provide, ref, watch } from 'vue'
import { planningExamples } from '@/data/planning'
import { hasFeature } from '@/config/tier'
import { useReducedMotion } from '@/composables/useReducedMotion'
import { useFrameRotation } from '@/composables/useFrameRotation'
import { useDeferredImage } from '@/composables/useDeferredImage'
import { usePinchZoom } from '@/composables/usePinchZoom'

const EXPLORER_KEY = Symbol('planning-explorer')

const MAX_ZOOM = 1.45

function detectWebGl() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * All state + actions of the planning explorer, shared with the stage/control
 * sub-components via provide/inject (see `useExplorerContext`).
 *
 * Stage modes: `view` (photo + hotspots + fire), `rotate` (frame arc),
 * `xray` (cutaway), `variant` (decision simulation), `model` (glTF viewer).
 */
export function usePlanningExplorer() {
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
  const current = computed(
    () => visibleExamples.value[activeIndex.value] || visibleExamples.value[0]
  )
  const currentViews = computed(() =>
    current.value?.views?.length
      ? current.value.views
      : [{ label: 'Ansicht', image: current.value?.image, text: current.value?.description }]
  )
  const currentView = computed(
    () => currentViews.value[activeViewIndex.value] || currentViews.value[0] || null
  )

  // X-ray interior view: schematic look at Heizzüge, Schamotte & Co. so the
  // hidden build quality of a handcrafted stove becomes visible (premium "Aha").
  // With a dedicated `xray.image` (technical cutaway rendering) the stage shows
  // it as-is; without one it falls back to the CSS-inverted base photo.
  const currentXray = computed(() => current.value?.xray || null)
  const isXrayMode = computed(() => stageMode.value === 'xray' && Boolean(currentXray.value))
  const xrayImage = computed(() => currentXray.value?.image || null)
  const xrayLabel = computed(() => currentXray.value?.label || 'Röntgenblick: Innenleben')

  const currentAnnotations = computed(() =>
    isXrayMode.value
      ? currentXray.value?.annotations || []
      : currentView.value?.annotations || current.value?.annotations || []
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

  // ---------------------------------------------------------------- rotate
  // Material presets of the 3D model (Landhaus / Modern / Natur …). Shared by
  // the turntable and the model stage so both always show the same look; an
  // example with `frameSets` has one rendered turntable per preset.
  const currentPresets = computed(() => current.value?.model?.presets || [])
  const activePreset = ref(null)
  const activePresetKey = computed(() => activePreset.value || currentPresets.value[0]?.key || null)
  function setPreset(key) {
    activePreset.value = key
  }
  const hasPresetFrames = computed(() => Boolean(current.value?.frameSets))
  const currentFrames = computed(
    () => current.value?.frameSets?.[activePresetKey.value] || current.value?.frames || []
  )
  const rotation = useFrameRotation(currentFrames, { reducedMotion })
  const isRotateMode = computed(() => stageMode.value === 'rotate' && rotation.hasFrames.value)
  // Honest label: only a frame set that covers the full circle is a "360°".
  const arcLabel = computed(() => {
    if (rotation.wraps.value) return '360°-Rundblick'
    const { min, max } = rotation.arcRange.value
    return `Rundblick ${min}° bis ${max > 0 ? '+' : ''}${max}°`
  })

  // Frames are fetched on the first interaction with the stage, not on mount:
  // until then only the centre frame is in the DOM, so a visitor who never
  // touches the turntable never downloads the other frames.
  const framesWarmed = ref(false)
  function warmFrames() {
    if (framesWarmed.value || !rotation.hasFrames.value) return
    framesWarmed.value = true
    rotation.preloadFrames({ immediate: true })
  }
  const framesLoading = computed(
    () => framesWarmed.value && rotation.preloadTotal.value > 0 && !rotation.framesReady.value
  )

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
    warmFrames()
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
  function goToFrame(index) {
    warmFrames()
    rotation.goToFrame(index)
  }
  function toggleAutorotate() {
    warmFrames()
    rotation.toggleAutorotate()
  }

  // --------------------------------------------------------------- variants
  // Two kinds of decision choices (see `variants` in data/planning.js):
  //  - whole-image choices (`image`): one at a time, swap the stage photo;
  //  - layer choices (`layer`): a transparent overlay composited over the
  //    stage, so one layer per decision key can be active simultaneously.
  const activeVariant = ref(null) // { key, choice } — whole-image choice
  const activeLayers = ref({}) // { [decisionKey]: choice } — stackable choices
  const currentVariants = computed(() => current.value?.variants || null)
  const activeVariantData = computed(() =>
    activeVariant.value
      ? currentVariants.value?.[activeVariant.value.key]?.[activeVariant.value.choice] || null
      : null
  )
  const activeLayerList = computed(() =>
    Object.entries(activeLayers.value)
      .map(([key, choice]) => ({ key, choice, ...(variantFor(key, choice) || {}) }))
      .filter((item) => item.layer)
  )
  const hasActiveLayers = computed(() => activeLayerList.value.length > 0)
  const isVariantMode = computed(
    () =>
      stageMode.value === 'variant' && (Boolean(activeVariantData.value) || hasActiveLayers.value)
  )

  // Decode-before-swap: the stage shows the previous variant until the next one
  // is ready, then crossfades (see .stage-fade).
  const variantImageSrc = computed(() =>
    isVariantMode.value ? activeVariantData.value?.image || current.value?.image || null : null
  )
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
  function isChoiceActive(key, choice) {
    if (!isVariantMode.value) return false
    if (activeLayers.value[key] === choice) return true
    return activeVariant.value?.key === key && activeVariant.value?.choice === choice
  }
  function optionLabel(key) {
    return activeDecisionOptions.value.find((item) => item.key === key)?.label || key
  }
  // Chip row: everything currently configured on the stage.
  const activeChoices = computed(() => {
    if (!isVariantMode.value) return []
    const list = []
    if (activeVariantData.value) {
      list.push({
        key: activeVariant.value.key,
        label: optionLabel(activeVariant.value.key),
        choice: activeVariant.value.choice,
      })
    }
    for (const item of activeLayerList.value) {
      list.push({ key: item.key, label: optionLabel(item.key), choice: item.choice })
    }
    return list
  })

  // ------------------------------------------------------------------- fire
  // Fire simulation: a layered glow over the glass zone of the current view.
  // Only meaningful in plain view mode — rotate/variant images shift the camera.
  const flamesOn = ref(false)
  const currentFireZone = computed(() =>
    stageMode.value === 'view' ? currentView.value?.fire || null : null
  )
  const showFlames = computed(() => flamesOn.value && Boolean(currentFireZone.value))

  // ------------------------------------------------------------------ model
  // Real 3D stage (glTF via <model-viewer>): only offered when the example
  // ships a model and the device can actually render it.
  const modelSupported =
    typeof navigator !== 'undefined' && !navigator.connection?.saveData && detectWebGl()
  const currentModel = computed(() =>
    modelSupported && current.value?.model?.src ? current.value.model : null
  )
  const isModelMode = computed(() => stageMode.value === 'model' && Boolean(currentModel.value))

  // ------------------------------------------------------------- stage copy
  const stageLabel = computed(() => {
    if (isVariantMode.value) {
      const parts = activeChoices.value.map((item) => `${item.label} · ${item.choice}`)
      return `Simulation: ${parts.join(' + ')}`
    }
    if (isRotateMode.value) return `Rundblick ${rotation.currentFrame.value?.angle ?? 0}°`
    if (isXrayMode.value) return xrayLabel.value
    if (isModelMode.value) return currentModel.value.label || '3D-Modell'
    return currentView.value?.label
  })
  const stageText = computed(() => {
    if (isVariantMode.value) {
      return (
        activeVariantData.value?.text ||
        activeLayerList.value[activeLayerList.value.length - 1]?.text ||
        current.value?.description
      )
    }
    if (isRotateMode.value) {
      const { min, max } = rotation.arcRange.value
      return rotation.wraps.value
        ? 'Ziehen Sie das Bild, um den Entwurf einmal rundherum zu betrachten.'
        : `Ziehen Sie das Bild, um den Entwurf zwischen ${min}° und ${max > 0 ? '+' : ''}${max}° zu betrachten.`
    }
    if (isXrayMode.value) return currentXray.value?.text
    if (isModelMode.value)
      return (
        currentModel.value.text ||
        'Drehen, zoomen und Material wechseln — auf dem Smartphone auch in Ihrem Raum (AR).'
      )
    return currentView.value?.text
  })

  // ---------------------------------------------------------------- actions
  function resetVariants() {
    activeVariant.value = null
    activeLayers.value = {}
  }

  function syncStageMode() {
    resetVariants()
    stageMode.value = rotation.hasFrames.value ? 'rotate' : 'view'
  }

  function selectChoice(option, choice) {
    const variant = variantFor(option.key, choice)
    if (!variant) return
    activeDecisionKey.value = option.key
    if (variant.layer) {
      const next = { ...activeLayers.value }
      if (next[option.key] === choice) delete next[option.key]
      else next[option.key] = choice
      activeLayers.value = next
      if (!Object.keys(next).length && !activeVariantData.value) {
        syncStageMode()
        return
      }
    } else {
      const isSame =
        activeVariant.value?.key === option.key && activeVariant.value?.choice === choice
      if (isSame) {
        activeVariant.value = null
        if (!hasActiveLayers.value) {
          syncStageMode()
          return
        }
      } else {
        activeVariant.value = { key: option.key, choice }
      }
    }
    stageMode.value = 'variant'
    rotation.stopAutorotate()
    zoom.value = 1
  }

  function stepVariant(dir) {
    const option = activeDecisionOptions.value.find((item) => item.key === activeVariant.value?.key)
    if (!option) return
    const choices = option.choices.filter((choice) => {
      const variant = variantFor(option.key, choice)
      return variant && !variant.layer
    })
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
    resetVariants()
    stageMode.value = 'view'
  }

  function enterRotateMode() {
    if (!rotation.hasFrames.value) return
    resetVariants()
    stageMode.value = 'rotate'
    rotation.resetToCenter()
    warmFrames()
    zoom.value = 1
  }

  function toggleXrayMode() {
    if (!currentXray.value) return
    if (isXrayMode.value) {
      syncStageMode()
      return
    }
    resetVariants()
    stageMode.value = 'xray'
    rotation.stopAutorotate()
    zoom.value = 1
  }

  function toggleModelMode() {
    if (!currentModel.value) return
    if (isModelMode.value) {
      syncStageMode()
      return
    }
    resetVariants()
    stageMode.value = 'model'
    rotation.stopAutorotate()
    zoom.value = 1
  }

  // Showroom sample request: carries the configured variant into the contact
  // form so the builder can prepare the exact physical tiles for the visit.
  const sampleRequestQuery = computed(() => {
    if (!isVariantMode.value || !current.value || !activeChoices.value.length) return null
    const summary = activeChoices.value.map((item) => `${item.label} – ${item.choice}`).join(', ')
    return {
      topic: '3d-planung',
      source: 'showroom',
      note: `Ich möchte physische Muster im Showroom ansehen: ${summary} (Beispiel: ${current.value.title}).`,
    }
  })

  // Budget hand-off: the example's `budget` map translates the configured
  // choices into the Budget-Kalkulator's query params (see BudgetEstimator.vue).
  const budgetRoute = computed(() => {
    const budget = current.value?.budget
    if (!hasFeature('calculators') || !budget?.typ) return null
    const query = { typ: budget.typ }
    for (const item of activeChoices.value) {
      Object.assign(query, budget.params?.[item.key]?.[item.choice] || {})
    }
    return { name: 'services', hash: '#budget-kalkulator', query }
  })

  function stepView(dir) {
    if (isVariantMode.value) {
      stepVariant(dir)
      return
    }
    if (isRotateMode.value) {
      warmFrames()
      rotation.stepFrame(dir)
      return
    }
    if (isModelMode.value) return
    const count = currentViews.value.length
    if (!count) return
    activeViewIndex.value = (activeViewIndex.value + dir + count) % count
    zoom.value = 1
  }

  function setZoom(value) {
    zoom.value = Math.min(MAX_ZOOM, Math.max(1, value))
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

  function openExpanded() {
    expanded.value = true
    rotation.stopAutorotate()
  }
  function closeExpanded() {
    expanded.value = false
  }

  watch(
    current,
    (example) => {
      activeDecisionKey.value = example?.decisions?.[0]?.key || ''
      activePreset.value = null
      framesWarmed.value = rotation.framesReady.value
      syncStageMode()
    },
    { immediate: true }
  )

  // A preset swap on a warmed turntable fetches the new set right away.
  watch(activePresetKey, () => {
    if (framesWarmed.value) rotation.preloadFrames({ immediate: true })
  })

  watch(isVariantMode, (active) => {
    if (!active) compareMode.value = false
  })

  watch([stageMode, current], () => pinch.reset())
  watch([currentView, current, stageMode], () => {
    activeAnnotation.value = null
  })

  const explorer = {
    categories,
    activeCategory,
    activeIndex,
    activeViewIndex,
    activeDecisionKey,
    zoom,
    maxZoom: MAX_ZOOM,
    expanded,
    stageMode,
    reducedMotion,
    visibleExamples,
    current,
    currentViews,
    currentView,
    currentXray,
    isXrayMode,
    xrayImage,
    xrayLabel,
    currentAnnotations,
    activeAnnotation,
    toggleAnnotation,
    activeDecisionOptions,
    activeDecision,
    currentFrames,
    currentPresets,
    activePresetKey,
    setPreset,
    hasPresetFrames,
    rotation,
    isRotateMode,
    arcLabel,
    framesWarmed,
    framesLoading,
    warmFrames,
    goToFrame,
    toggleAutorotate,
    pinch,
    stageTransform,
    stageTouchAction,
    onRotatePointerDown,
    onRotatePointerMove,
    onRotatePointerUp,
    activeVariant,
    activeLayerList,
    activeVariantData,
    activeChoices,
    isVariantMode,
    displayedVariantSrc,
    compareMode,
    compareBase,
    markFailed,
    variantImageFailed,
    currentFrameFailed,
    variantFor,
    isChoiceActive,
    currentVariants,
    flamesOn,
    currentFireZone,
    showFlames,
    currentModel,
    isModelMode,
    stageLabel,
    stageText,
    resetVariants,
    selectChoice,
    selectCategory,
    selectExample,
    selectView,
    enterRotateMode,
    toggleXrayMode,
    toggleModelMode,
    sampleRequestQuery,
    budgetRoute,
    stepView,
    setZoom,
    onStageKey,
    openExpanded,
    closeExpanded,
  }

  provide(EXPLORER_KEY, explorer)
  return explorer
}

/** Access the explorer state provided by `usePlanningExplorer` in a parent. */
export function useExplorerContext() {
  const explorer = inject(EXPLORER_KEY, null)
  if (!explorer) {
    throw new Error('useExplorerContext() must be used inside <Planning3DExplorer>')
  }
  return explorer
}

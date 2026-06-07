<script setup>
import { ref, computed, watch, onBeforeUnmount, useAttrs } from 'vue'
import AppIcon from './AppIcon.vue'

/**
 * BaseImage — responsive media with a built-in, on-brand placeholder.
 *
 * If `src` is provided it renders a lazy, async-decoded <img> (and falls back
 * to the placeholder on error). Without `src` it renders a warm gradient
 * placeholder with a motif icon — so the template looks intentional offline.
 * Drop real photography in by setting `src` (e.g. '/images/kachelofen.jpg').
 */
const props = defineProps({
  src: { type: String, default: null },
  alt: { type: String, default: '' },
  motif: { type: String, default: 'flame' }, // flame | tile | render | portrait
  tone: { type: String, default: 'ember' }, // ember | sand | slate | ink
  ratio: { type: String, default: '4/3' },
  eager: { type: Boolean, default: false },
  rounded: { type: String, default: 'rounded-2xl' },
  fill: { type: Boolean, default: false }, // stretch to a relative parent instead of using ratio
  enlargeable: { type: Boolean, default: false },
  fullSrc: { type: String, default: '' },
  caption: { type: String, default: '' },
})

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const failed = ref(false)
const expanded = ref(false)
const showImg = computed(() => props.src && !failed.value)
const modalSrc = computed(() => props.fullSrc || props.src)
const rootAttrs = computed(() => {
  const rest = { ...attrs }
  delete rest.style
  return rest
})
const rootStyle = computed(() =>
  props.fill ? attrs.style : [attrs.style, { aspectRatio: props.ratio.replace('/', ' / ') }]
)

const tones = {
  ember: { grad: 'from-brand-400 via-brand-500 to-brand-700', icon: 'text-white/85' },
  sand: { grad: 'from-surface-sand via-brand-100 to-brand-300', icon: 'text-ink-800/30' },
  slate: { grad: 'from-ink-500 via-ink-700 to-ink-900', icon: 'text-white/75' },
  ink: { grad: 'from-ink-700 via-ink-900 to-ink-950', icon: 'text-brand-400/70' },
}
const tone = computed(() => tones[props.tone] || tones.ember)
const motifIcon = computed(() => (props.motif === 'portrait' ? 'star' : props.motif))

function openExpanded() {
  if (props.enlargeable && modalSrc.value) expanded.value = true
}

function closeExpanded() {
  expanded.value = false
}

function onKey(e) {
  if (expanded.value && e.key === 'Escape') closeExpanded()
}

watch(expanded, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  if (expanded.value) document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="overflow-hidden bg-surface-sand"
    :class="[rounded, fill ? 'absolute inset-0 h-full w-full' : 'relative']"
    :style="rootStyle"
  >
    <img
      v-if="showImg"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      class="h-full w-full object-cover"
      @error="failed = true"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-gradient-to-br"
      :class="tone.grad"
      role="img"
      :aria-label="alt"
    >
      <!-- soft vignette to read like a photograph -->
      <div
        class="pointer-events-none absolute inset-0"
        style="
          background:
            radial-gradient(120% 80% at 25% 15%, rgba(255, 255, 255, 0.18), transparent 55%),
            radial-gradient(120% 90% at 80% 100%, rgba(0, 0, 0, 0.22), transparent 60%);
        "
      />
      <AppIcon :name="motifIcon" class="h-1/4 w-1/4 max-h-24 max-w-[6rem]" :class="tone.icon" />
    </div>

    <button
      v-if="enlargeable && modalSrc"
      type="button"
      class="press-feedback absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink-950/60 text-white shadow-sm backdrop-blur transition-colors hover:bg-ink-950/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      :aria-label="`${caption || alt || 'Bild'} vergrößern`"
      @click.stop="openExpanded"
    >
      <AppIcon name="maximize" class="h-5 w-5" />
    </button>
  </div>

  <Teleport to="body">
    <Transition name="image-zoom">
      <div
        v-if="expanded"
        class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="caption || alt || 'Vergrößerte Bildansicht'"
        @click.self="closeExpanded"
      >
        <button
          type="button"
          class="press-feedback absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Schließen"
          @click="closeExpanded"
        >
          <AppIcon name="close" class="h-6 w-6" />
        </button>
        <figure class="w-full max-w-6xl">
          <img
            :src="modalSrc"
            :alt="alt"
            class="max-h-[82vh] w-full rounded-2xl object-contain shadow-lift"
            decoding="async"
          />
          <figcaption
            v-if="caption || alt"
            class="mt-4 text-center font-display text-lg font-semibold text-white"
          >
            {{ caption || alt }}
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.image-zoom-enter-active,
.image-zoom-leave-active {
  transition: opacity 0.2s ease;
}
.image-zoom-enter-from,
.image-zoom-leave-to {
  opacity: 0;
}
</style>

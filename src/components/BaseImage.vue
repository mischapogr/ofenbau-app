<script setup>
import { ref, computed } from 'vue'
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
})

const failed = ref(false)
const showImg = computed(() => props.src && !failed.value)

const tones = {
  ember: { grad: 'from-brand-400 via-brand-500 to-brand-700', icon: 'text-white/85' },
  sand: { grad: 'from-surface-sand via-brand-100 to-brand-300', icon: 'text-ink-800/30' },
  slate: { grad: 'from-ink-500 via-ink-700 to-ink-900', icon: 'text-white/75' },
  ink: { grad: 'from-ink-700 via-ink-900 to-ink-950', icon: 'text-brand-400/70' },
}
const tone = computed(() => tones[props.tone] || tones.ember)
const motifIcon = computed(() => (props.motif === 'portrait' ? 'star' : props.motif))
</script>

<template>
  <div
    class="overflow-hidden bg-surface-sand"
    :class="[rounded, fill ? 'absolute inset-0 h-full w-full' : 'relative']"
    :style="fill ? undefined : { aspectRatio: ratio.replace('/', ' / ') }"
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
  </div>
</template>

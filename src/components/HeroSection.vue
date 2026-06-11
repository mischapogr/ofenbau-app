<script setup>
import { onMounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseBadge from './BaseBadge.vue'
import BaseImage from './BaseImage.vue'
import AppIcon from './AppIcon.vue'
import { company } from '@/data/company'
import { homepageAssets, homepageHeroStats } from '@/data/home'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
  title: { type: String, default: 'Mit gesunder Wärme leben' },
  titleHighlight: { type: String, default: 'Individueller Kachel- & Kaminofenbau' },
  description: { type: String, default: 'Vom ersten Entwurf bis zum letzten Handgriff: handgesetzte Kachelöfen, Kamine und meisterhafte Fliesenarbeiten — für ein Zuhause, das über Jahrzehnte behaglich bleibt.' },
})

const heroVideo = homepageAssets.hero.video || null
const reducedMotion = useReducedMotion()
const videoReady = ref(false)
const videoPlaying = ref(false)
const videoEl = ref(null)

onMounted(() => {
  if (!heroVideo || reducedMotion.value) return
  // Defer the video request until the browser is idle so the hero image stays LCP.
  const enable = () => {
    videoReady.value = true
  }
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(enable, { timeout: 4000 })
  } else {
    setTimeout(enable, 2500)
  }
})

watch(reducedMotion, (reduced) => {
  if (reduced) {
    videoEl.value?.pause()
    videoReady.value = false
    videoPlaying.value = false
  }
})

function onVideoCanPlay() {
  videoEl.value?.play().catch(() => {
    // Autoplay blocked (e.g. iOS Low Power Mode) — keep the static image.
    videoReady.value = false
  })
}
</script>

<template>
  <section class="bg-ink-900 text-white">
    <div class="mx-auto grid w-full max-w-container lg:grid-cols-2">
      <!-- Copy -->
      <div class="flex flex-col justify-center px-5 py-20 sm:px-6 lg:px-12 lg:py-32">
        <BaseBadge tone="onDark" class="w-fit">
          <AppIcon name="flame" class="h-3.5 w-3.5 text-brand-400" />
          Meisterbetrieb · {{ company.tagline }}
        </BaseBadge>

        <h1 class="mt-6 font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
          {{ title }}
          <span class="mt-2 block text-brand-400">{{ titleHighlight }}</span>
        </h1>

        <p class="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          {{ description }}
        </p>

        <div class="mt-9 flex flex-wrap gap-3">
          <BaseButton :to="{ name: 'contact', query: { topic: 'beratung', source: 'hero' } }" size="lg">
            Beratung vereinbaren
            <AppIcon name="arrow" class="h-4 w-4" />
          </BaseButton>
          <BaseButton :to="{ name: 'projects' }" variant="light" size="lg">
            Projekte ansehen
          </BaseButton>
        </div>

        <dl class="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
          <div v-for="s in homepageHeroStats" :key="s.label">
            <dt class="font-display text-3xl font-semibold text-white">{{ s.value }}</dt>
            <dd class="mt-1 text-sm text-white/55">{{ s.label }}</dd>
          </div>
        </dl>
      </div>

      <!-- Image -->
      <div class="relative min-h-[340px] overflow-hidden lg:min-h-full">
        <BaseImage
          fill
          rounded="rounded-none"
          :src="homepageAssets.hero.image"
          motif="flame"
          tone="ember"
          eager
          :alt="homepageAssets.hero.alt"
        />
        <video
          v-if="heroVideo && videoReady"
          ref="videoEl"
          class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          :class="videoPlaying ? 'opacity-100' : 'opacity-0'"
          muted
          loop
          playsinline
          :poster="heroVideo.poster"
          aria-hidden="true"
          tabindex="-1"
          @canplay="onVideoCanPlay"
          @playing="videoPlaying = true"
        >
          <source :src="heroVideo.webm" type="video/webm" />
          <source :src="heroVideo.mp4" type="video/mp4" />
        </video>
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900/40 to-transparent lg:from-ink-900"
          aria-hidden="true"
        />
      </div>
    </div>
  </section>
</template>

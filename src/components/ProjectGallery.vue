<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import BaseSection from './BaseSection.vue'
import BaseButton from './BaseButton.vue'
import BaseImage from './BaseImage.vue'
import AppIcon from './AppIcon.vue'
import { projects, projectCategories } from '@/data/projects'

const props = defineProps({
  limit: { type: Number, default: 0 }, // 0 = show all
  showFilters: { type: Boolean, default: true },
  showCta: { type: Boolean, default: false },
})

const activeFilter = ref('all')

const filtered = computed(() => {
  const list =
    activeFilter.value === 'all'
      ? projects
      : projects.filter((p) => p.category.includes(activeFilter.value))
  return props.limit ? list.slice(0, props.limit) : list
})

// --- Lightbox -------------------------------------------------------------
const lightboxIndex = ref(-1)
const lightboxOpen = computed(() => lightboxIndex.value >= 0)
const current = computed(() => filtered.value[lightboxIndex.value] || null)

function open(i) {
  lightboxIndex.value = i
}
function close() {
  lightboxIndex.value = -1
}
function step(dir) {
  const n = filtered.value.length
  if (n) lightboxIndex.value = (lightboxIndex.value + dir + n) % n
}

function onKey(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

watch(lightboxOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})

// Reset lightbox if the filter changes underneath it.
watch(activeFilter, () => close())

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})

const ratios = ['4/3', '3/4', '1/1', '4/5']
</script>

<template>
  <BaseSection
    eyebrow="Unsere Projekte"
    title="Ausgewählte Arbeiten"
    subtitle="Ein Einblick in handgesetzte Öfen, Kamine und Flächen aus unserer Werkstatt."
  >
    <!-- Filters -->
    <div v-if="showFilters" class="mb-10 flex flex-wrap justify-center gap-2">
      <button
        v-for="cat in projectCategories"
        :key="cat.key"
        type="button"
        class="press-feedback rounded-full px-4 py-2 text-sm font-medium transition-colors"
        :class="
          activeFilter === cat.key
            ? 'bg-brand-500 text-white'
            : 'bg-surface-muted text-content-muted hover:bg-surface-sand hover:text-content'
        "
        :aria-pressed="activeFilter === cat.key"
        @click="activeFilter = cat.key"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Masonry-style grid -->
    <div class="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
      <button
        v-for="(p, i) in filtered"
        :key="p.id"
        type="button"
        class="press-feedback group block w-full break-inside-avoid overflow-hidden rounded-2xl text-left shadow-card ring-1 ring-content-muted/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        @click="open(i)"
      >
        <div class="relative overflow-hidden">
          <BaseImage
            :src="p.image"
            :motif="p.motif"
            :tone="p.tone"
            :ratio="ratios[i % ratios.length]"
            rounded="rounded-none"
            :alt="p.title"
            class="transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <div
            class="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/70 via-ink-950/5 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <div>
              <p class="font-display text-lg font-semibold text-white">{{ p.title }}</p>
              <p class="mt-0.5 text-xs uppercase tracking-label text-white/70">
                {{ projectCategories.find((c) => c.key === p.category[0])?.label }}
              </p>
              <p v-if="p.material" class="mt-1 text-xs text-white/70">{{ p.material }}</p>
            </div>
          </div>
        </div>
      </button>
    </div>

    <div v-if="showCta" class="mt-12 text-center">
      <BaseButton :to="{ name: 'projects' }" variant="outline" size="lg">
        Alle Projekte ansehen
        <AppIcon name="arrow" class="h-4 w-4" />
      </BaseButton>
    </div>

    <!-- Lightbox -->
    <Transition name="lb">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="current?.title"
        @click.self="close"
      >
        <button
          type="button"
          class="press-feedback absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Schließen"
          @click="close"
        >
          <AppIcon name="close" class="h-6 w-6" />
        </button>
        <button
          type="button"
          class="press-feedback absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
          aria-label="Vorheriges Projekt"
          @click="step(-1)"
        >
          <AppIcon name="chevron" class="h-6 w-6 rotate-180" />
        </button>
        <button
          type="button"
          class="press-feedback absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
          aria-label="Nächstes Projekt"
          @click="step(1)"
        >
          <AppIcon name="chevron" class="h-6 w-6" />
        </button>

        <div
          v-if="current"
          class="relative w-full max-w-4xl bg-surface rounded-2xl border border-content-muted/10 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[80vh] md:max-h-[75vh]"
        >
          <!-- Left side: Image -->
          <div
            class="relative w-full md:w-[50%] bg-ink-950 flex items-center justify-center shrink-0"
          >
            <BaseImage
              :src="current.image"
              :motif="current.motif"
              :tone="current.tone"
              ratio="3/2"
              rounded="rounded-none"
              :alt="current.title"
              eager
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Right side: Details Pane -->
          <div
            class="w-full flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between bg-surface min-h-0 text-left"
          >
            <div class="min-h-0">
              <!-- Category and Title -->
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {{
                    projectCategories.find((c) => c.key === current.category[0])?.label || 'Projekt'
                  }}
                </span>
                <span v-if="current.material" class="text-xs text-content-muted"
                  >· {{ current.material }}</span
                >
              </div>
              <h3 class="font-display text-xl md:text-2xl font-semibold text-ink-900 mb-3">
                {{ current.title }}
              </h3>
              <p v-if="current.description" class="text-sm text-content-muted mb-6 leading-relaxed">
                {{ current.description }}
              </p>

              <!-- Technical Specs -->
              <div v-if="current.specs" class="mb-6">
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-ink-900 border-b border-content-muted/10 pb-2 mb-3"
                >
                  Technische Daten
                </h4>
                <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm">
                  <template v-for="(val, key) in current.specs" :key="key">
                    <dt class="text-content-muted font-medium py-0.5">{{ key }}</dt>
                    <dd class="text-ink-900 font-semibold text-right md:text-left py-0.5">
                      {{ val }}
                    </dd>
                  </template>
                </dl>
              </div>

              <!-- Case Study -->
              <div v-if="current.caseStudy" class="mb-6">
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-ink-900 border-b border-content-muted/10 pb-2 mb-3"
                >
                  Projektbericht &amp; Details
                </h4>
                <p
                  class="text-xs md:text-sm text-content-muted leading-relaxed whitespace-pre-line"
                >
                  {{ current.caseStudy }}
                </p>
              </div>
            </div>

            <!-- Footer / CTA inside Lightbox -->
            <div
              class="mt-6 pt-4 border-t border-content-muted/10 flex items-center justify-between gap-4"
            >
              <BaseButton
                :to="{
                  name: 'contact',
                  query: {
                    topic: 'beratung',
                    note: `Anfrage zu Projekt: ${current.title}`,
                    source: 'gallery',
                  },
                }"
                size="sm"
                class="w-full sm:w-auto"
                @click="close"
              >
                Projekt anfragen
                <AppIcon name="arrow" class="h-4 w-4" />
              </BaseButton>
              <button
                type="button"
                class="press-feedback text-xs font-medium text-content-muted hover:text-ink-900 md:hidden"
                @click="close"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </BaseSection>
</template>

<style scoped>
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.25s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>

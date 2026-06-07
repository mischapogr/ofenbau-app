<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseImage from './BaseImage.vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  address: { type: String, required: true },
  mapHref: { type: String, required: true },
})

const storageKey = 'ofenbau-cookie-consent'
const consent = ref(null)

const hasComfortConsent = computed(() => !!consent.value?.comfort)
const embedSrc = computed(
  () => `https://www.google.com/maps?q=${encodeURIComponent(props.address)}&output=embed`
)

function readConsent() {
  try {
    consent.value = JSON.parse(localStorage.getItem(storageKey) || 'null')
  } catch (_error) {
    consent.value = null
  }
}

function persistComfortConsent() {
  const current = consent.value || {}
  const next = {
    choice: current.analytics ? 'custom' : 'comfort',
    necessary: true,
    analytics: !!current.analytics,
    comfort: true,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(storageKey, JSON.stringify(next))
  consent.value = next
  window.dispatchEvent(new CustomEvent('ofenbau-cookie-consent', { detail: next }))
}

function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('ofenbau-open-cookie-settings'))
}

function onConsentChanged(event) {
  consent.value = event.detail
}

onMounted(() => {
  readConsent()
  window.addEventListener('ofenbau-cookie-consent', onConsentChanged)
})

onBeforeUnmount(() => {
  window.removeEventListener('ofenbau-cookie-consent', onConsentChanged)
})
</script>

<template>
  <div class="overflow-hidden rounded-2xl bg-ink-900 shadow-card">
    <div class="relative aspect-[16/9] bg-ink-900">
      <iframe
        v-if="hasComfortConsent"
        :src="embedSrc"
        title="Google Maps Standortkarte"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="absolute inset-0 h-full w-full border-0"
      />
      <div v-else class="absolute inset-0">
        <BaseImage
          src="/images/contact-map.svg"
          motif="pin"
          tone="slate"
          ratio="16/9"
          alt="Karte mit Standort des Betriebs"
          rounded="rounded-none"
          fill
        />
        <div class="absolute inset-0 grid place-items-center bg-ink-950/70 p-5 text-center">
          <div class="max-w-sm text-white">
            <p class="font-display text-xl font-semibold">Google Maps</p>
            <p class="mt-2 text-sm leading-relaxed text-white/70">
              Die eingebettete Karte wird erst nach Ihrer Zustimmung zu Komfort-Cookies geladen.
            </p>
            <div class="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                class="press-feedback inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
                @click="persistComfortConsent"
              >
                Karte laden
                <AppIcon name="pin" class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="press-feedback inline-flex items-center justify-center rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                @click="openCookieSettings"
              >
                Einstellungen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid gap-4 p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p class="font-display text-xl font-semibold">Werkstatt & Beratung</p>
        <p class="mt-1 text-sm text-white/70">{{ address }}</p>
      </div>
      <a
        :href="mapHref"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-surface-muted"
      >
        Route planen
        <AppIcon name="arrow" class="h-4 w-4" />
      </a>
    </div>
  </div>
</template>

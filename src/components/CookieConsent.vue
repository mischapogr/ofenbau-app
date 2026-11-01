<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const storageKey = 'ofenbau-cookie-consent'

const visible = ref(false)
const showSettings = ref(false)
const preferences = reactive({
  analytics: false,
  comfort: false,
})

function persist(choice) {
  const consent = {
    choice,
    necessary: true,
    analytics: preferences.analytics,
    comfort: preferences.comfort,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(storageKey, JSON.stringify(consent))
  window.dispatchEvent(new CustomEvent('ofenbau-cookie-consent', { detail: consent }))
  visible.value = false
}

function acceptNecessary() {
  preferences.analytics = false
  preferences.comfort = false
  persist('necessary')
}

function acceptAll() {
  preferences.analytics = true
  preferences.comfort = true
  persist('all')
}

function saveSettings() {
  persist('custom')
}

function readConsent() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || 'null')
  } catch (_error) {
    return null
  }
}

function openSettings() {
  const consent = readConsent()
  preferences.analytics = !!consent?.analytics
  preferences.comfort = !!consent?.comfort
  showSettings.value = true
  visible.value = true
}

onMounted(() => {
  visible.value = !readConsent()
  window.addEventListener('ofenbau-open-cookie-settings', openSettings)
})

onBeforeUnmount(() => {
  window.removeEventListener('ofenbau-open-cookie-settings', openSettings)
})
</script>

<template>
  <Transition name="cookie-consent">
    <section
      v-if="visible"
      class="fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-content-muted/20 bg-surface/95 p-5 shadow-lift backdrop-blur sm:bottom-5 sm:left-1/2 sm:right-auto sm:w-[min(58rem,calc(100vw-2.5rem))] sm:-translate-x-1/2 sm:p-7"
      aria-labelledby="cookie-consent-title"
      role="dialog"
      aria-modal="false"
    >
      <div class="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div class="flex items-center gap-3">
            <span
              class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white"
              aria-hidden="true"
            >
              <AppIcon name="cookie" class="h-4 w-4" />
            </span>
            <h2 id="cookie-consent-title" class="font-display text-xl font-semibold text-content">
              Privatsphäre & Daten
            </h2>
          </div>

          <p class="mt-4 max-w-xl text-base leading-relaxed text-content-muted">
            Wir nutzen Cookies, um Ihr Erlebnis auf unserer Website zu verbessern. Einige sind
            technisch notwendig, während andere uns helfen, Inhalte stetig zu verbessern.
          </p>

          <button
            type="button"
            class="press-feedback mt-3 text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
            :aria-expanded="showSettings"
            @click="showSettings = !showSettings"
          >
            Einstellungen verwalten
          </button>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 md:min-w-[27rem]">
          <button
            type="button"
            class="press-feedback rounded-lg border-2 border-brand-500 bg-surface px-6 py-3 text-sm font-semibold text-brand-600 shadow-sm hover:bg-brand-50"
            @click="acceptNecessary"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            class="press-feedback rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-card hover:bg-brand-600"
            @click="acceptAll"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>

      <div
        v-if="showSettings"
        class="mt-6 grid gap-3 border-t border-content-muted/15 pt-5 sm:grid-cols-3"
      >
        <label
          class="rounded-xl bg-surface-muted p-4 text-sm text-content-muted ring-1 ring-content-muted/10"
        >
          <span class="flex items-center gap-2 font-semibold text-content">
            <input type="checkbox" checked disabled class="accent-brand-500" />
            Notwendig
          </span>
          <span class="mt-2 block">Erforderlich für Grundfunktionen der Website.</span>
        </label>

        <label
          class="rounded-xl bg-surface-muted p-4 text-sm text-content-muted ring-1 ring-content-muted/10"
        >
          <span class="flex items-center gap-2 font-semibold text-content">
            <input v-model="preferences.analytics" type="checkbox" class="accent-brand-500" />
            Analyse
          </span>
          <span class="mt-2 block">Hilft uns, die Nutzung der Seiten besser zu verstehen.</span>
        </label>

        <label
          class="rounded-xl bg-surface-muted p-4 text-sm text-content-muted ring-1 ring-content-muted/10"
        >
          <span class="flex items-center gap-2 font-semibold text-content">
            <input v-model="preferences.comfort" type="checkbox" class="accent-brand-500" />
            Komfort
          </span>
          <span class="mt-2 block"
            >Speichert optionale Einstellungen für ein besseres Erlebnis.</span
          >
        </label>

        <div class="sm:col-span-3 sm:text-right">
          <button
            type="button"
            class="press-feedback rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
            @click="saveSettings"
          >
            Auswahl speichern
          </button>
        </div>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.cookie-consent-enter-active,
.cookie-consent-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.cookie-consent-enter-from,
.cookie-consent-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}

@media (min-width: 640px) {
  .cookie-consent-enter-from,
  .cookie-consent-leave-to {
    transform: translate(-50%, 0.75rem);
  }
}
</style>

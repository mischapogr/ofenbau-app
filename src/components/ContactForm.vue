<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import AppError from './AppError.vue'
import AppIcon from './AppIcon.vue'
import PrivacyContent from './PrivacyContent.vue'
import { useContactStore } from '@/stores/contact'
import { contactTopics, getContactTopic } from '@/data/contactTopics'

const props = defineProps({
  // Label shown on the submit button + first field placeholder context.
  submitLabel: { type: String, default: 'Anfrage senden' },
  // Pre-fill the subject (e.g. "3D-Entwurf") when embedded on a service page.
  subject: { type: String, default: '' },
  showTopic: { type: Boolean, default: false },
  prefilledMessage: { type: String, default: '' },
  source: { type: String, default: '' },
})

const store = useContactStore()
const initialTopic = computed(() => getContactTopic(props.subject))

const form = reactive({
  topic: initialTopic.value.value,
  name: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  message: props.prefilledMessage || '',
  gdpr: false,
})

const errors = reactive({})
const touched = ref(false)
const privacyOpen = ref(false)
const privacyPanel = ref(null)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const selectedTopic = computed(() => getContactTopic(form.topic))
const selectedSubject = computed(() =>
  props.showTopic ? selectedTopic.value?.subject : props.subject || undefined
)

const badgeText = computed(() => {
  if (props.source === 'budget') return 'Budget-Kalkulation erfolgreich geladen'
  if (props.source === 'bimschv') return 'BImSchV-Ofendaten erfolgreich geladen'
  if (props.source === 'heizlast') return 'Heizlast-Raumdaten erfolgreich geladen'
  if (props.source === '3d-planung' || props.source === 'planning3d') return 'Thema 3D-Planung ausgewählt'
  if (props.source === 'gallery') return 'Projekt-Referenz erfolgreich geladen'
  if (props.source === 'knowledge') return 'Ratgeber-Referenz erfolgreich geladen'
  if (props.source === 'service-detail') return 'Thema voreingestellt'
  return ''
})

// Geolocation & Service Area Check
const detectingLocation = ref(false)
const userCoords = ref(null)

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function detectLocation() {
  if (!navigator.geolocation) return
  detectingLocation.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      userCoords.value = { lat: latitude, lon: longitude }
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=de`
        )
        if (response.ok) {
          const data = await response.json()
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb || ''
          const postcode = data.address.postcode || ''
          form.location = postcode ? `${postcode} ${city}` : city
        }
      } catch (err) {
        console.error('Reverse geocoding failed:', err)
      } finally {
        detectingLocation.value = false
      }
    },
    (err) => {
      console.warn('Geolocation error:', err)
      detectingLocation.value = false
    },
    { timeout: 8000 }
  )
}

const projectVolumeInfo = computed(() => {
  const msg = form.message.toLowerCase()
  const isPremium = msg.includes('premium') || msg.includes('exklusiv')
  const priceMatches = [...form.message.matchAll(/[\d.]+/g)].map(m => m[0].replace(/\./g, ''))
  const maxPrice = priceMatches.reduce((max, current) => {
    const val = parseInt(current, 10)
    if (!isNaN(val) && val > max && val < 100000) return val
    return max
  }, 0)
  
  // High volume if price is >= 12000, or premium tier, or large custom topic
  const isHighVolume = maxPrice >= 12000 || isPremium || ['kachelofen-kaminbau', '3d-planung'].includes(form.topic)
  return { isHighVolume, maxPrice }
})

const isOutsideServiceArea = computed(() => {
  if (userCoords.value) {
    const regions = [
      { lat: 48.7758, lon: 9.1829 }, // Stuttgart
      { lat: 48.8976, lon: 9.1916 }, // Ludwigsburg
      { lat: 48.7428, lon: 9.3072 }, // Esslingen
      { lat: 51.5584, lon: 13.0043 }, // Nordsachsen
    ]
    const minDist = Math.min(...regions.map(r => getDistance(userCoords.value.lat, userCoords.value.lon, r.lat, r.lon)))
    return minDist > 75
  }
  
  if (form.location.trim()) {
    const loc = form.location.toLowerCase()
    const inRegion = ['leipzig', 'chemnitz', 'meissen', 'nordsachsen', 'torgau', 'delitzsch'].some(city => loc.includes(city))
    const zipMatch = loc.match(/\b\d{5}\b/)
    if (zipMatch) {
      const zip = zipMatch[0]
      const isSW = zip.startsWith('70') || zip.startsWith('71') || zip.startsWith('72') || zip.startsWith('73')
      const isSN = zip.startsWith('04') || zip.startsWith('06') || zip.startsWith('08')
      if (isSW || isSN) return false
    }
    if (inRegion) return false
    return true
  }
  
  return false
})

watch(
  () => props.subject,
  () => {
    form.topic = initialTopic.value.value
  }
)

watch(
  () => props.prefilledMessage,
  (newVal) => {
    if (newVal) form.message = newVal
  }
)

function validate() {
  errors.topic = props.showTopic && !selectedTopic.value ? 'Bitte wählen Sie ein Thema aus.' : ''
  errors.name = form.name.trim() ? '' : 'Bitte geben Sie Ihren Namen an.'
  errors.email = !form.email.trim()
    ? 'Bitte geben Sie Ihre E-Mail an.'
    : emailRe.test(form.email)
      ? ''
      : 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
  errors.message = !form.message.trim()
    ? 'Bitte beschreiben Sie kurz Ihr Anliegen.'
    : form.message.trim().length >= 10
      ? ''
      : 'Bitte beschreiben Sie Ihr Anliegen etwas genauer.'
  errors.gdpr = form.gdpr ? '' : 'Bitte stimmen Sie der Datenschutzerklärung zu.'
  errors.website = form.website.trim() ? 'Diese Anfrage wurde als Spam erkannt.' : ''
  return (
    !errors.topic &&
    !errors.name &&
    !errors.email &&
    !errors.message &&
    !errors.gdpr &&
    !errors.website
  )
}

async function onSubmit() {
  touched.value = true
  if (!validate()) return
  const ok = await store.submit({
    name: form.name,
    email: form.email,
    phone: form.phone,
    location: form.location,
    website: form.website,
    message: form.message,
    subject: selectedSubject.value,
  })
  if (ok) {
    form.topic = initialTopic.value.value
    form.name = ''
    form.email = ''
    form.phone = ''
    form.location = ''
    form.website = ''
    form.message = ''
    form.gdpr = false
    touched.value = false
    userCoords.value = null
  }
}

function resetSuccess() {
  store.reset()
}

function openPrivacy() {
  privacyOpen.value = true
  nextTick(() => privacyPanel.value?.focus())
}

function closePrivacy() {
  privacyOpen.value = false
}

const fieldClass =
  'w-full rounded-lg border bg-surface px-4 py-2.5 text-content placeholder:text-content-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40'
function borderFor(key) {
  return errors[key] && touched.value
    ? 'border-red-400 focus:border-red-500'
    : 'border-content-muted/20 focus:border-brand-500'
}
</script>

<template>
  <!-- Success state -->
  <div
    v-if="store.succeeded"
    class="flex flex-col items-center rounded-2xl bg-surface p-8 text-center shadow-card ring-1 ring-content-muted/10"
    role="status"
  >
    <span
      class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600"
    >
      <AppIcon name="check" class="h-7 w-7" />
    </span>
    <h3 class="mt-4 font-display text-xl font-semibold">Vielen Dank!</h3>
    <p class="mt-2 max-w-sm text-content-muted">
      Ihre Anfrage ist bei uns eingegangen. Wir melden uns zeitnah für eine unverbindliche Beratung.
    </p>
    <BaseButton variant="ghost" class="mt-6" @click="resetSuccess"
      >Weitere Nachricht senden</BaseButton
    >
  </div>

  <!-- Form -->
  <form v-else class="space-y-5" novalidate @submit.prevent="onSubmit">
    <div
      v-if="badgeText"
      class="flex items-start gap-3 rounded-xl border border-brand-500/10 bg-brand-50/50 p-4 text-sm text-content animate-fade-in"
    >
      <span class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <AppIcon name="check" class="h-4 w-4" />
      </span>
      <div>
        <p class="font-semibold text-brand-800">{{ badgeText }}</p>
        <p class="mt-0.5 text-xs text-content-muted">
          Ihre Angaben aus dem vorherigen Schritt wurden als Vorlage in das Nachrichtenfeld geladen. Sie können den Text vor dem Senden beliebig anpassen.
        </p>
      </div>
    </div>

    <AppError
      v-if="store.error"
      :retryable="false"
      title="Senden fehlgeschlagen"
      :message="store.error"
    />

    <div v-if="showTopic">
      <label for="cf-topic" class="mb-1.5 block text-sm font-medium">Thema</label>
      <select
        id="cf-topic"
        v-model="form.topic"
        :class="[fieldClass, borderFor('topic')]"
        :aria-invalid="!!(errors.topic && touched)"
      >
        <option v-for="topic in contactTopics" :key="topic.value" :value="topic.value">
          {{ topic.label }}
        </option>
      </select>
      <p v-if="errors.topic && touched" class="mt-1 text-xs text-red-600">{{ errors.topic }}</p>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="cf-name" class="mb-1.5 block text-sm font-medium">Name</label>
        <input
          id="cf-name"
          v-model.trim="form.name"
          type="text"
          autocomplete="name"
          :class="[fieldClass, borderFor('name')]"
          :aria-invalid="!!(errors.name && touched)"
        />
        <p v-if="errors.name && touched" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
      </div>

      <div>
        <label for="cf-phone" class="mb-1.5 block text-sm font-medium">
          Telefon <span class="text-content-muted">(optional)</span>
        </label>
        <input
          id="cf-phone"
          v-model.trim="form.phone"
          type="tel"
          autocomplete="tel"
          :class="[fieldClass, 'border-content-muted/20 focus:border-brand-500']"
        />
      </div>
    </div>

    <div class="hidden" aria-hidden="true">
      <label for="cf-website">Website</label>
      <input
        id="cf-website"
        v-model.trim="form.website"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div>
        <label for="cf-email" class="mb-1.5 block text-sm font-medium">E-Mail</label>
        <input
          id="cf-email"
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          :class="[fieldClass, borderFor('email')]"
          :aria-invalid="!!(errors.email && touched)"
        />
        <p v-if="errors.email && touched" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label for="cf-location" class="mb-1.5 block text-sm font-medium">
          Ort / PLZ <span class="text-content-muted">(optional)</span>
        </label>
        <div class="relative flex items-center">
          <input
            id="cf-location"
            v-model.trim="form.location"
            type="text"
            placeholder="z.B. 70173 Stuttgart"
            :class="[fieldClass, 'pr-12 border-content-muted/20 focus:border-brand-500']"
          />
          <button
            type="button"
            class="absolute right-2 p-2 text-content-muted hover:text-brand-600 transition-colors focus:outline-none"
            :title="detectingLocation ? 'Ortung läuft...' : 'Standort automatisch ermitteln'"
            :disabled="detectingLocation"
            @click="detectLocation"
          >
            <AppIcon
              :name="detectingLocation ? 'rotate' : 'pin'"
              class="h-5 w-5"
              :class="{ 'animate-spin': detectingLocation }"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Einsatzgebiet Hinweis -->
    <div
      v-if="isOutsideServiceArea"
      class="rounded-xl border border-brand-500/15 bg-brand-50/25 p-4 text-xs leading-relaxed text-content animate-fade-in"
    >
      <div class="flex gap-2.5">
        <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-brand-500/10 text-brand-600">
          <AppIcon name="pin" class="h-3.5 w-3.5" />
        </span>
        <div>
          <p class="font-bold text-brand-800">
            {{ projectVolumeInfo.isHighVolume ? 'Lohnendes Projekt außerhalb unseres Einzugsgebiets' : 'Außerhalb unseres Einzugsgebiets' }}
          </p>
          <p class="mt-1 text-content-muted">
            {{
              projectVolumeInfo.isHighVolume
                ? 'Ihr Standort liegt außerhalb unseres Standard-Einsatzgebietes. Aufgrund Ihres größeren Projektumfangs prüfen wir Ihre Anfrage jedoch sehr gerne für eine überregionale Umsetzung!'
                : 'Ihr Standort liegt außerhalb unseres Standard-Einsatzgebietes (~75 km). Wir prüfen gerne individuell, ob eine Anreise für Ihr Projekt wirtschaftlich umsetzbar ist.'
            }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <label for="cf-message" class="mb-1.5 block text-sm font-medium">Nachricht</label>
      <textarea
        id="cf-message"
        v-model.trim="form.message"
        rows="5"
        :class="[fieldClass, borderFor('message')]"
        :aria-invalid="!!(errors.message && touched)"
      />
      <p v-if="errors.message && touched" class="mt-1 text-xs text-red-600">{{ errors.message }}</p>
    </div>

    <div>
      <label class="flex items-start gap-3 text-sm text-content-muted">
        <input
          v-model="form.gdpr"
          type="checkbox"
          class="mt-0.5 h-4 w-4 shrink-0 rounded border-content-muted/40 text-brand-500 focus:ring-brand-500"
        />
        <span>
          Ich habe die
          <button
            type="button"
            class="text-brand-600 underline hover:no-underline"
            @click.stop="openPrivacy"
          >
            Datenschutzerklärung
          </button>
          gelesen und stimme der Verarbeitung meiner Daten zu.
        </span>
      </label>
      <p v-if="errors.gdpr && touched" class="mt-1 text-xs text-red-600">{{ errors.gdpr }}</p>
    </div>

    <BaseButton type="submit" block size="lg" :disabled="store.isSubmitting">
      {{ store.isSubmitting ? 'Senden …' : submitLabel }}
      <AppIcon v-if="!store.isSubmitting" name="arrow" class="h-4 w-4" />
    </BaseButton>
  </form>

  <Teleport to="body">
    <Transition name="privacy-modal">
      <div
        v-if="privacyOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        @click.self="closePrivacy"
        @keydown.esc="closePrivacy"
      >
        <div
          ref="privacyPanel"
          class="max-h-[min(42rem,calc(100vh-2rem))] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-lift ring-1 ring-content-muted/10 sm:p-8"
          tabindex="-1"
          @keydown.esc="closePrivacy"
        >
          <div class="mb-5 flex items-start justify-between gap-4">
            <div>
              <p class="eyebrow">Datenschutz</p>
              <h2 id="privacy-modal-title" class="mt-2 font-display text-2xl font-semibold">
                Datenschutzerklärung
              </h2>
            </div>
            <button
              type="button"
              class="press-feedback inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-content hover:bg-surface-muted"
              aria-label="Datenschutzerklärung schließen"
              @click="closePrivacy"
            >
              <AppIcon name="close" class="h-5 w-5" />
            </button>
          </div>
          <PrivacyContent />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.privacy-modal-enter-active,
.privacy-modal-leave-active {
  transition: opacity 0.25s ease;
}
.privacy-modal-enter-from,
.privacy-modal-leave-to {
  opacity: 0;
}
</style>

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
})

const store = useContactStore()
const initialTopic = computed(() => getContactTopic(props.subject))

const form = reactive({
  topic: initialTopic.value.value,
  name: '',
  email: '',
  phone: '',
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
    website: form.website,
    message: form.message,
    subject: selectedSubject.value,
  })
  if (ok) {
    form.topic = initialTopic.value.value
    form.name = ''
    form.email = ''
    form.phone = ''
    form.website = ''
    form.message = ''
    form.gdpr = false
    touched.value = false
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

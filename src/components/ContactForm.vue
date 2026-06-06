<script setup>
import { reactive, ref } from 'vue'
import BaseButton from './BaseButton.vue'
import AppError from './AppError.vue'
import AppIcon from './AppIcon.vue'
import { useContactStore } from '@/stores/contact'

const props = defineProps({
  // Label shown on the submit button + first field placeholder context.
  submitLabel: { type: String, default: 'Anfrage senden' },
  // Pre-fill the subject (e.g. "3D-Entwurf") when embedded on a service page.
  subject: { type: String, default: '' },
})

const store = useContactStore()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  message: '',
  gdpr: false,
})

const errors = reactive({})
const touched = ref(false)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  errors.name = form.name.trim() ? '' : 'Bitte geben Sie Ihren Namen an.'
  errors.email = !form.email.trim()
    ? 'Bitte geben Sie Ihre E-Mail an.'
    : emailRe.test(form.email)
      ? ''
      : 'Bitte geben Sie eine gültige E-Mail-Adresse an.'
  errors.message = form.message.trim() ? '' : 'Bitte beschreiben Sie kurz Ihr Anliegen.'
  errors.gdpr = form.gdpr ? '' : 'Bitte stimmen Sie der Datenschutzerklärung zu.'
  return !errors.name && !errors.email && !errors.message && !errors.gdpr
}

async function onSubmit() {
  touched.value = true
  if (!validate()) return
  const ok = await store.submit({
    name: form.name,
    email: form.email,
    phone: form.phone,
    message: form.message,
    subject: props.subject || undefined,
  })
  if (ok) {
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
    form.gdpr = false
    touched.value = false
  }
}

function resetSuccess() {
  store.reset()
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
          <RouterLink :to="{ name: 'privacy' }" class="text-brand-600 underline hover:no-underline">
            Datenschutzerklärung
          </RouterLink>
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
</template>

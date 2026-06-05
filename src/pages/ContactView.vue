<script setup>
import { reactive } from 'vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import AppError from '@/components/AppError.vue'
import { useContactStore } from '@/stores/contact'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Kontakt',
  description: 'Vereinbaren Sie eine unverbindliche Beratung. Wir freuen uns auf Sie.',
  path: '/kontakt',
}))

const store = useContactStore()
const form = reactive({ name: '', email: '', message: '' })

async function onSubmit() {
  const ok = await store.submit({ ...form })
  if (ok) {
    form.name = ''
    form.email = ''
    form.message = ''
  }
}
</script>

<template>
  <section class="section">
    <BaseContainer class="grid gap-12 lg:grid-cols-2">
      <div>
        <h1 class="font-display text-4xl font-bold sm:text-5xl">Kontakt</h1>
        <p class="mt-4 text-lg text-content-muted">
          Schreiben Sie uns — wir melden uns zeitnah für eine unverbindliche Beratung.
        </p>
        <dl class="mt-8 space-y-4 text-sm">
          <div>
            <dt class="font-semibold text-content">Adresse</dt>
            <dd class="text-content-muted">Musterstraße 1, 12345 Musterstadt</dd>
          </div>
          <div>
            <dt class="font-semibold text-content">Telefon</dt>
            <dd>
              <a href="tel:+490000000000" class="text-brand-600 hover:underline"
                >+49 (0) 000 000000</a
              >
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-content">E-Mail</dt>
            <dd>
              <a href="mailto:info@ofenbau-mustermann.test" class="text-brand-600 hover:underline"
                >info@ofenbau-mustermann.test</a
              >
            </dd>
          </div>
        </dl>
      </div>

      <BaseCard class="p-6 sm:p-8">
        <form class="space-y-5" @submit.prevent="onSubmit">
          <div
            v-if="store.succeeded"
            class="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300"
            role="status"
          >
            Vielen Dank! Ihre Nachricht wurde gesendet.
          </div>

          <AppError
            v-if="store.error"
            :retryable="false"
            title="Senden fehlgeschlagen"
            :message="store.error"
          />

          <div>
            <label for="name" class="mb-1.5 block text-sm font-medium">Name</label>
            <input
              id="name"
              v-model.trim="form.name"
              type="text"
              required
              autocomplete="name"
              class="w-full rounded-xl border border-content-muted/20 bg-surface px-4 py-2.5 text-content focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          <div>
            <label for="email" class="mb-1.5 block text-sm font-medium">E-Mail</label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full rounded-xl border border-content-muted/20 bg-surface px-4 py-2.5 text-content focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          <div>
            <label for="message" class="mb-1.5 block text-sm font-medium">Nachricht</label>
            <textarea
              id="message"
              v-model.trim="form.message"
              rows="5"
              required
              class="w-full rounded-xl border border-content-muted/20 bg-surface px-4 py-2.5 text-content focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>

          <BaseButton type="submit" block size="lg" :disabled="store.isSubmitting">
            {{ store.isSubmitting ? 'Senden …' : 'Nachricht senden' }}
          </BaseButton>
          <p class="text-xs text-content-muted">
            Im Entwicklungsmodus landen versendete E-Mails in Mailpit unter
            <a
              href="http://localhost:8025"
              class="text-brand-600 hover:underline"
              target="_blank"
              rel="noopener"
              >localhost:8025</a
            >.
          </p>
        </form>
      </BaseCard>
    </BaseContainer>
  </section>
</template>

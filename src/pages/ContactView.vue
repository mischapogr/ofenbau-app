<script setup>
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseImage from '@/components/BaseImage.vue'
import ContactForm from '@/components/ContactForm.vue'
import AppIcon from '@/components/AppIcon.vue'
import { company } from '@/data/company'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Kontakt',
  description: 'Vereinbaren Sie eine unverbindliche Beratung — wir freuen uns auf Ihr Projekt.',
  path: '/kontakt',
}))

const details = [
  {
    icon: 'pin',
    label: 'Adresse',
    value: `${company.address.street}, ${company.address.zip} ${company.address.city}`,
  },
  { icon: 'phone', label: 'Telefon', value: company.phone.label, href: company.phone.href },
  { icon: 'mail', label: 'E-Mail', value: company.email.label, href: company.email.href },
  { icon: 'clock', label: 'Öffnungszeiten', value: company.hours },
]
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Kontakt"
      title="Lassen Sie uns über Ihr Projekt sprechen"
      subtitle="Schreiben Sie uns — wir melden uns zeitnah für eine unverbindliche Beratung."
      :crumbs="[{ name: 'Kontakt', to: { name: 'contact' } }]"
    />

    <section class="section bg-surface">
      <BaseContainer class="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <!-- Info -->
        <div>
          <dl class="space-y-5">
            <div v-for="d in details" :key="d.label" class="flex items-start gap-4">
              <span
                class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
              >
                <AppIcon :name="d.icon" class="h-5 w-5" />
              </span>
              <div>
                <dt class="text-sm font-medium text-content-muted">{{ d.label }}</dt>
                <dd class="mt-0.5 text-content">
                  <a v-if="d.href" :href="d.href" class="hover:text-brand-600">{{ d.value }}</a>
                  <span v-else>{{ d.value }}</span>
                </dd>
              </div>
            </div>
          </dl>

          <div class="mt-8 overflow-hidden rounded-2xl">
            <BaseImage
              src="/images/contact-map.svg"
              motif="pin"
              tone="slate"
              ratio="16/9"
              alt="Karte mit Standort des Betriebs"
            />
          </div>

          <p class="mt-4 text-xs text-content-muted">
            Im Entwicklungsmodus landen versendete Nachrichten in Mailpit unter
            <a
              href="http://localhost:8025"
              target="_blank"
              rel="noopener"
              class="text-brand-600 hover:underline"
            >
              localhost:8025 </a
            >.
          </p>
        </div>

        <!-- Form -->
        <div class="rounded-2xl bg-surface-muted p-6 sm:p-8">
          <h2 class="font-display text-2xl font-semibold">Anfrage senden</h2>
          <p class="mt-2 text-sm text-content-muted">
            Alle Felder mit Ausnahme der Telefonnummer sind erforderlich.
          </p>
          <div class="mt-6">
            <ContactForm submit-label="Nachricht senden" />
          </div>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import PrivacyContent from '@/components/PrivacyContent.vue'
import { company } from '@/data/company'
import { legalProfile } from '@/data/legal'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const isPrivacy = computed(() => route.name === 'privacy')

useSeo(() => ({
  title: isPrivacy.value ? 'Datenschutz' : 'Impressum',
  description: isPrivacy.value
    ? 'Datenschutzerklärung von Ofenbau Mustermann.'
    : 'Impressum und Anbieterkennzeichnung von Ofenbau Mustermann.',
  path: isPrivacy.value ? '/datenschutz' : '/impressum',
}))
</script>

<template>
  <div>
    <PageHeader
      :eyebrow="isPrivacy ? 'Datenschutz' : 'Impressum'"
      :title="isPrivacy ? 'Datenschutzerklärung' : 'Impressum'"
      :crumbs="[{ name: isPrivacy ? 'Datenschutz' : 'Impressum', to: { name: route.name } }]"
    />

    <section class="section bg-surface">
      <BaseContainer>
        <div class="max-w-2xl space-y-6 leading-relaxed text-content-muted">
          <p v-if="legalProfile.noticeIsTemplate" class="rounded-xl bg-surface-muted p-4 text-sm">
            <strong class="text-content">Hinweis:</strong> Dies ist eine Vorlage. Ersetzen Sie die
            folgenden Angaben durch Ihre rechtsgültigen Informationen.
          </p>

          <template v-if="!isPrivacy">
            <h2 class="font-display text-xl font-semibold text-content">Angaben gemäß § 5 TMG</h2>
            <p>
              {{ company.legalName }}<br />
              {{ company.address.street }}<br />
              {{ company.address.zip }} {{ company.address.city }}
            </p>
            <h2 class="font-display text-xl font-semibold text-content">Kontakt</h2>
            <p>
              Telefon: {{ company.phone.label }}<br />
              E-Mail: {{ company.email.label }}
            </p>
            <h2 class="font-display text-xl font-semibold text-content">
              Verantwortlich für den Inhalt
            </h2>
            <p>
              {{ legalProfile.contentResponsible.name }},
              {{ legalProfile.contentResponsible.address }}.
            </p>
          </template>

          <PrivacyContent v-else />
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

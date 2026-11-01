<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import PrivacyContent from '@/components/PrivacyContent.vue'
import { company } from '@/data/company'
import { legalProfile } from '@/data/legal'
import { demoOperator } from '@/config/demoOperator'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const isPrivacy = computed(() => route.name === 'privacy')

useSeo(() => ({
  title: isPrivacy.value ? 'Datenschutz' : 'Impressum',
  description: isPrivacy.value
    ? `Datenschutzerklärung von ${company.name}.`
    : `Impressum und Anbieterkennzeichnung von ${company.name}.`,
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
          <template v-if="demoOperator.enabled">
            <p class="rounded-xl bg-surface-muted p-4 text-sm">
              <strong class="text-content">Demo-Website:</strong> Das dargestellte Unternehmen „{{
                company.name
              }}“ ist fiktiv. Name, Anschrift, Telefonnummer, Referenzen, Bewertungen und
              Leistungsangaben sind Platzhalter; die Bilder sind KI-generiert. Über diese Website
              kommt kein Vertrag zustande.
            </p>
            <p
              v-if="!demoOperator.configured"
              class="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
              role="alert"
            >
              Betreiberangaben fehlen. Setzen Sie VITE_DEMO_OPERATOR_NAME, _STREET, _CITY und _EMAIL
              vor dem Veröffentlichen.
            </p>
          </template>
          <p
            v-else-if="legalProfile.noticeIsTemplate"
            class="rounded-xl bg-surface-muted p-4 text-sm"
          >
            <strong class="text-content">Hinweis:</strong> Dies ist eine Vorlage. Ersetzen Sie die
            folgenden Angaben durch Ihre rechtsgültigen Informationen.
          </p>

          <template v-if="!isPrivacy && demoOperator.enabled">
            <h2 class="font-display text-xl font-semibold text-content">
              Anbieter dieser Demo-Website (§ 5 DDG)
            </h2>
            <p>
              {{ demoOperator.name }}<br />
              {{ demoOperator.street }}<br />
              {{ demoOperator.city }}
            </p>
            <h2 class="font-display text-xl font-semibold text-content">Kontakt</h2>
            <p>
              E-Mail:
              <a :href="`mailto:${demoOperator.email}`" class="text-brand-600 underline">{{
                demoOperator.email
              }}</a>
              <template v-if="demoOperator.phone"><br />Telefon: {{ demoOperator.phone }}</template>
            </p>
            <h2 class="font-display text-xl font-semibold text-content">
              Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)
            </h2>
            <p>{{ demoOperator.name }}, Anschrift wie oben.</p>
            <h2 class="font-display text-xl font-semibold text-content">Quellcode</h2>
            <p>
              Diese Demo basiert auf einer quelloffenen Website-Vorlage (MIT-Lizenz). Die
              Beispielinhalte dienen ausschließlich der Vorführung.
            </p>
          </template>

          <template v-else-if="!isPrivacy">
            <h2 class="font-display text-xl font-semibold text-content">Angaben gemäß § 5 DDG</h2>
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
              Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)
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

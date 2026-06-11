<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import ContactForm from '@/components/ContactForm.vue'
import AppIcon from '@/components/AppIcon.vue'
import GoogleMapEmbed from '@/components/GoogleMapEmbed.vue'
import { company } from '@/data/company'
import { getContactTopic } from '@/data/contactTopics'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const selectedTopic = computed(() => getContactTopic(route.query.topic))
const initialMessage = computed(() => route.query.note || route.query.message || '')
const addressLabel = computed(
  () => `${company.address.street}, ${company.address.zip} ${company.address.city}`
)
const mapHref = computed(
  () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      addressLabel.value
    )}`
)

const sourceConfig = computed(() => {
  const src = route.query.source
  const configs = {
    budget: {
      title: 'Ihr individuelles Budgetangebot',
      subtitle: 'Ihr Projekt ist bereits durchkalkuliert. Senden Sie uns die Anfrage, um ein passendes Festpreisangebot zu erhalten.',
      formTitle: 'Angebot anfordern',
      formDesc: 'Ihre gewünschten Ausstattungsdaten und der berechnete Kostenrahmen wurden automatisch hinterlegt.',
      submitLabel: 'Angebot & 3D-Entwurf anfragen',
    },
    bimschv: {
      title: 'BImSchV Ofen-Check Auswertung',
      subtitle: 'Unser BImSchV-Rechner hat Handlungsbedarf für Ihre Feuerstätte ermittelt. Wir beraten Sie gerne zu Nachrüstung oder Austausch.',
      formTitle: 'Modernisierungs-Beratung',
      formDesc: 'Ihre Ofendaten aus dem BImSchV-Check wurden für unseren Schornsteinfeger-Meisterbetrieb hinterlegt.',
      submitLabel: 'Sanierungs-Check anfordern',
    },
    heizlast: {
      title: 'Heizlast-Berechnung & Beratung',
      subtitle: 'Ihre Heizlast-Werte wurden erfolgreich erfasst. Wir planen die Ofengröße optimal passend für Ihre Räume.',
      formTitle: 'Heizlast-Beratung anfordern',
      formDesc: 'Ihre berechnete Heizlast und Raumparameter wurden im Nachrichtentext hinterlegt.',
      submitLabel: 'Heizlast-Beratung anfragen',
    },
    showroom: {
      title: 'Showroom-Muster anfragen',
      subtitle: 'Sie haben Ihre Favoriten im 3D-Player gefunden? Wir legen die passenden Original-Muster für Ihren Showroom-Besuch bereit.',
      formTitle: 'Musterbox anfordern',
      formDesc: 'Ihre Material-Auswahl aus der 3D-Planung wurde in der Nachricht vermerkt. Nennen Sie uns gerne Ihren Wunschtermin.',
      submitLabel: 'Showroom-Termin anfragen',
    },
    '3d-planung': {
      title: '3D-Entwurfsplanung anfordern',
      subtitle: 'Visualisieren Sie Ihren Traumofen in 3D. Füllen Sie das Formular aus, um eine fotorealistische Planung zu starten.',
      formTitle: '3D-Planung anfordern',
      formDesc: 'Schildern Sie uns Ihre Design-Wünsche — wir erwecken sie in einer 3D-Zeichnung zum Leben.',
      submitLabel: '3D-Entwurf anfordern',
    },
    gallery: {
      title: 'Projekt-Anfrage',
      subtitle: 'Ihnen gefällt eines unserer Referenzprojekte? Wir bauen Ihren Ofen oder verlegen Ihre Fliesen ganz nach diesem Vorbild.',
      formTitle: 'Projekt anfragen',
      formDesc: 'Die Projekt-Referenz wurde in Ihrer Nachricht vermerkt. Teilen Sie uns gerne Ihre Anpassungswünsche mit.',
      submitLabel: 'Projekt-Anfrage senden',
    },
    knowledge: {
      title: 'Fragen zum Fachartikel',
      subtitle: 'Sie möchten mehr zum Thema erfahren oder eine unverbindliche Beratung vor Ort vereinbaren?',
      formTitle: 'Beratung anfragen',
      formDesc: 'Der Bezug zum Ratgeber-Fachartikel wurde vermerkt. Wir melden uns mit qualifizierten Antworten bei Ihnen.',
      submitLabel: 'Beratung anfragen',
    },
    'service-detail': {
      title: 'Beratung zum Meisterhandwerk',
      subtitle: 'Fragen zu unseren Leistungen oder ein konkretes Vorhaben? Lassen Sie uns gemeinsam Ihr Projekt planen.',
      formTitle: 'Leistungsanfrage senden',
      formDesc: 'Das gewählte Thema wurde voreingestellt. Beschreiben Sie uns Ihr Anliegen für ein unverbindliches Erstgespräch.',
      submitLabel: 'Beratung anfordern',
    },
  }
  return configs[src] || {
    title: 'Lassen Sie uns über Ihr Projekt sprechen',
    subtitle: 'Schreiben Sie uns — wir melden uns zeitnah für eine unverbindliche Beratung.',
    formTitle: 'Anfrage senden',
    formDesc: 'Alle Felder mit Ausnahme der Telefonnummer sind erforderlich.',
    submitLabel: 'Nachricht senden',
  }
})

useSeo(() => ({
  title: sourceConfig.value.title !== 'Lassen Sie uns über Ihr Projekt sprechen' ? `Kontakt — ${sourceConfig.value.title}` : 'Kontakt',
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
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: company.whatsapp.label,
    href: company.whatsapp.href,
    note: company.whatsapp.availability,
  },
  { icon: 'mail', label: 'E-Mail', value: company.email.label, href: company.email.href },
  { icon: 'clock', label: 'Öffnungszeiten', value: company.hours },
]
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Kontakt"
      :title="sourceConfig.title"
      :subtitle="sourceConfig.subtitle"
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
                <dd v-if="d.note" class="mt-1 text-xs text-content-muted">{{ d.note }}</dd>
              </div>
            </div>
          </dl>

          <GoogleMapEmbed class="mt-8" :address="addressLabel" :map-href="mapHref" />
        </div>

        <!-- Form -->
        <div class="rounded-2xl bg-surface-muted p-6 sm:p-8">
          <h2 class="font-display text-2xl font-semibold">{{ sourceConfig.formTitle }}</h2>
          <p class="mt-2 text-sm text-content-muted">
            {{ sourceConfig.formDesc }}
          </p>
          <div class="mt-6">
            <ContactForm
              :key="`${selectedTopic.value}-${initialMessage}-${route.query.source}`"
              show-topic
              :subject="selectedTopic.value"
              :prefilled-message="initialMessage"
              :source="route.query.source || ''"
              :submit-label="sourceConfig.submitLabel"
            />
          </div>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

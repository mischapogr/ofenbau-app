<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseImage from '@/components/BaseImage.vue'
import BaseButton from '@/components/BaseButton.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import ContactForm from '@/components/ContactForm.vue'
import CTASection from '@/components/CTASection.vue'
import AppIcon from '@/components/AppIcon.vue'
import ExplorerLazy from '@/components/planning/ExplorerLazy.vue'
import HeizlastCalculator from '@/components/HeizlastCalculator.vue'
import BimschvChecker from '@/components/BimschvChecker.vue'
import { getActiveServices } from '@/data/services'
import { getActiveRegions } from '@/data/regions'
import { planningBenefits, planningServices } from '@/data/planning'
import { topicForService } from '@/data/contactTopics'
import { useSeo } from '@/composables/useSeo'
import { useJsonLd } from '@/composables/useJsonLd'
import { tier, hasFeature } from '@/config/tier'

const route = useRoute()
// Restrict lookup to the active tier's services, so a basis build 404s on
// premium-only detail pages (e.g. /leistungen/3d-planung) instead of rendering them.
const activeServices = getActiveServices(tier)
const service = computed(() => activeServices.find((s) => s.slug === route.params.slug) || null)
const others = computed(() => activeServices.filter((s) => s.slug !== route.params.slug))
const is3d = computed(() => route.params.slug === '3d-planung')
const contactTopic = computed(() =>
  service.value ? topicForService(service.value.slug).value : 'beratung'
)
const siteUrl = (import.meta.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const faqJsonLd = computed(() => {
  if (!service.value?.faqs?.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.value.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: `${siteUrl}/leistungen/${service.value.slug}`,
  }
})

useSeo(() => ({
  title: service.value ? service.value.title : 'Leistung',
  description: service.value?.description,
  path: `/leistungen/${route.params.slug}`,
}))

useJsonLd(() => faqJsonLd.value, 'service-faq-jsonld')

useJsonLd(() => {
  if (!service.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.value.title,
    serviceType: service.value.title,
    description: service.value.description,
    url: `${siteUrl}/leistungen/${service.value.slug}`,
    provider: { '@id': `${siteUrl}/#business` },
    areaServed: getActiveRegions(tier).map((region) => ({
      '@type': region.slug === 'nordsachsen' ? 'AdministrativeArea' : 'City',
      name: region.city,
    })),
    availableLanguage: 'de',
  }
}, 'service-jsonld')
</script>

<template>
  <div v-if="service">
    <template v-if="is3d">
      <PageHeader
        eyebrow="Leistung"
        title="Ihre Vision in 3D"
        :subtitle="service.intro"
        :crumbs="[
          { name: 'Leistungen', to: { name: 'services' } },
          { name: service.title, to: { name: 'service-detail', params: { slug: service.slug } } },
        ]"
      />

      <section class="bg-surface pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24">
        <BaseContainer class="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div v-reveal>
            <p class="eyebrow">{{ service.short }}</p>
            <h2 class="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Planen, prüfen und entscheiden, bevor gebaut wird
            </h2>
            <p class="mt-5 max-w-xl text-lg leading-relaxed text-content-muted">
              Aus Skizzen, Maßen und Materialwünschen entsteht ein räumlicher Entwurf, der Wirkung,
              Proportionen und Details sichtbar macht.
            </p>
            <div class="mt-8 flex flex-col gap-3 sm:flex-row">
              <BaseButton
                :to="{ name: 'contact', query: { topic: contactTopic, source: 'service-detail' } }"
                size="lg"
              >
                3D-Entwurf anfragen
                <AppIcon name="arrow" class="h-4 w-4" />
              </BaseButton>
              <BaseButton :to="{ name: 'projects' }" variant="outline" size="lg">
                Projekte ansehen
              </BaseButton>
            </div>
          </div>

          <div v-reveal="{ delay: 100 }" class="relative">
            <div
              class="absolute -left-4 top-8 hidden h-48 w-48 rounded-full bg-brand-100/60 blur-3xl lg:block"
            />
            <div class="relative grid grid-cols-2 gap-4">
              <figure class="rounded-xl bg-surface-muted p-3 shadow-card">
                <BaseImage
                  src="/images/planning-3d-before.webp"
                  motif="render"
                  tone="slate"
                  ratio="4/5"
                  alt="Technische 3D-Skizze eines Ofenentwurfs"
                  rounded="rounded-lg"
                  enlargeable
                  caption="3D-Skizze eines Ofenentwurfs"
                  eager
                />
                <figcaption class="mt-3 flex items-center justify-between text-xs">
                  <span class="font-mono uppercase tracking-label text-content-muted"
                    >3D-Skizze</span
                  >
                  <span class="rounded-full bg-surface px-2 py-1 text-brand-600">01</span>
                </figcaption>
              </figure>
              <figure class="mt-10 rounded-xl bg-surface-muted p-3 shadow-card sm:mt-14">
                <BaseImage
                  src="/images/planning-3d-after.webp"
                  motif="flame"
                  tone="ember"
                  ratio="4/5"
                  alt="Fotorealistischer 3D-Entwurf eines Kaminofens"
                  rounded="rounded-lg"
                  enlargeable
                  caption="Fotorealistischer 3D-Entwurf"
                  eager
                />
                <figcaption class="mt-3 flex items-center justify-between text-xs">
                  <span class="font-mono uppercase tracking-label text-content-muted"
                    >Fertiger Entwurf</span
                  >
                  <span class="rounded-full bg-surface px-2 py-1 text-brand-600">02</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </BaseContainer>
      </section>

      <section class="section bg-surface-muted">
        <BaseContainer class="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div v-reveal>
            <p class="eyebrow">Vorteile der 3D-Planung</p>
            <h2 class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Mehr Sicherheit für Form, Material und Budget
            </h2>
          </div>
          <div v-reveal="{ delay: 100 }" class="grid gap-5">
            <article
              v-for="benefit in planningBenefits"
              :key="benefit.title"
              class="flex gap-4 rounded-xl bg-surface p-5 shadow-sm ring-1 ring-content-muted/10"
            >
              <span
                class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
              >
                <AppIcon :name="benefit.icon" class="h-5 w-5" />
              </span>
              <div>
                <h3 class="font-semibold">{{ benefit.title }}</h3>
                <p class="mt-1 text-sm leading-relaxed text-content-muted">{{ benefit.text }}</p>
              </div>
            </article>
          </div>
        </BaseContainer>
      </section>

      <section class="section bg-surface">
        <BaseContainer class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div v-reveal>
            <p class="eyebrow">Nachweise &amp; Sicherheit</p>
            <h2 class="mt-3 font-display text-3xl font-semibold leading-tight">
              Prüfpunkte vor der Umsetzung
            </h2>
          </div>
          <ul v-reveal="{ delay: 100 }" class="grid gap-4 sm:grid-cols-3">
            <li
              v-for="point in service.proofPoints"
              :key="point"
              class="rounded-xl bg-surface-muted p-5 text-sm leading-relaxed text-content-muted ring-1 ring-content-muted/10"
            >
              <AppIcon name="check" class="mb-4 h-5 w-5 text-brand-600" />
              {{ point }}
            </li>
          </ul>
        </BaseContainer>
      </section>

      <section class="section bg-surface-muted">
        <BaseContainer>
          <div v-reveal class="max-w-2xl">
            <p class="eyebrow">Unser 3D-Service</p>
            <h2 class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Vom ersten Raumgefühl bis zur machbaren Umsetzung
            </h2>
          </div>
          <div class="mt-10 grid gap-5 md:grid-cols-3">
            <article
              v-for="item in planningServices"
              :key="item.title"
              v-reveal
              class="rounded-xl bg-surface-muted p-6 shadow-sm ring-1 ring-content-muted/10"
            >
              <span
                class="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500 text-white"
              >
                <AppIcon name="cube" class="h-5 w-5" />
              </span>
              <h3 class="mt-5 font-semibold">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-content-muted">{{ item.text }}</p>
            </article>
          </div>
        </BaseContainer>
      </section>

      <ExplorerLazy />

      <section class="section bg-surface-muted">
        <BaseContainer class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div v-reveal>
            <p class="eyebrow">3D-Entwurf anfragen</p>
            <h2 class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Senden Sie uns Maße, Idee oder Fotos
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-content-muted">
              Wir prüfen Ihr Vorhaben und melden uns mit einem klaren nächsten Schritt für den
              unverbindlichen 3D-Entwurf.
            </p>
            <div class="mt-8 grid grid-cols-2 gap-4">
              <BaseImage
                src="/images/planning-3d-before.webp"
                motif="render"
                tone="slate"
                ratio="4/3"
                alt="3D-Skizze"
                rounded="rounded-xl"
                enlargeable
                caption="3D-Skizze"
              />
              <BaseImage
                src="/images/planning-3d-after.webp"
                motif="flame"
                tone="ember"
                ratio="4/3"
                alt="3D-Entwurf"
                rounded="rounded-xl"
                enlargeable
                caption="3D-Entwurf"
              />
            </div>
          </div>
          <div
            v-reveal="{ delay: 100 }"
            class="rounded-xl bg-surface p-5 shadow-card ring-1 ring-content-muted/10 sm:p-7"
          >
            <ContactForm
              subject="3D-Entwurf"
              submit-label="Anfrage senden"
              source="service-detail"
            />
          </div>
        </BaseContainer>
      </section>
    </template>

    <template v-else>
      <PageHeader
        eyebrow="Leistung"
        :title="service.title"
        :subtitle="service.intro"
        :crumbs="[
          { name: 'Leistungen', to: { name: 'services' } },
          { name: service.title, to: { name: 'service-detail', params: { slug: service.slug } } },
        ]"
      />

      <!-- Intro: image + key points -->
      <section class="section bg-surface">
        <BaseContainer class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div v-reveal>
            <BaseImage
              :src="service.image"
              :motif="service.motif"
              :tone="service.tone"
              ratio="4/3"
              :alt="service.title"
            />
          </div>
          <div v-reveal="{ delay: 100 }">
            <p class="eyebrow">{{ service.short }}</p>
            <h2 class="mt-3 font-display text-3xl font-semibold leading-tight">
              Das bieten wir Ihnen
            </h2>
            <ul class="mt-6 space-y-3.5">
              <li v-for="b in service.bullets" :key="b" class="flex items-start gap-3">
                <span
                  class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
                >
                  <AppIcon name="check" class="h-4 w-4" />
                </span>
                <span class="text-content">{{ b }}</span>
              </li>
            </ul>
            <BaseButton
              :to="{ name: 'contact', query: { topic: contactTopic, source: 'service-detail' } }"
              size="lg"
              class="mt-8"
            >
              Beratung anfragen
              <AppIcon name="arrow" class="h-4 w-4" />
            </BaseButton>
          </div>

          <div class="mt-8 rounded-xl bg-surface-muted p-5 ring-1 ring-content-muted/10">
            <p class="text-sm font-semibold uppercase tracking-label text-content-muted">
              Nachweise &amp; Sicherheit
            </p>
            <ul class="mt-4 grid gap-3">
              <li
                v-for="point in service.proofPoints"
                :key="point"
                class="flex items-start gap-3 text-sm leading-relaxed text-content-muted"
              >
                <AppIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>
        </BaseContainer>
      </section>

      <!-- Interactive Tools Section -->
      <section
        v-if="
          hasFeature('calculators') &&
          (service.slug === 'kachelofen-kaminbau' || service.slug === 'schornsteinbau')
        "
        :id="service.slug === 'kachelofen-kaminbau' ? 'heizlast-rechner' : 'bimschv-ofen-check'"
        class="section bg-surface border-t border-content-muted/10 scroll-mt-16 lg:scroll-mt-20 focus:outline-none"
        tabindex="-1"
      >
        <BaseContainer class="max-w-4xl">
          <!-- Technical cutaway: shows why Speichermasse and Zuglänge matter,
               as context for the Heizlast calculator below. -->
          <div
            v-if="service.slug === 'kachelofen-kaminbau'"
            v-reveal
            class="mb-14 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"
          >
            <BaseImage
              src="/images/kachelofen-schnitt.webp"
              ratio="22/15"
              alt="Schnittdarstellung eines Kachelofens: Schamotte-Feuerraum, Heizgaszüge, Wärmespeichermasse und Dämmung"
              rounded="rounded-xl"
              enlargeable
              caption="Schnitt durch einen handgesetzten Speicherofen"
            />
            <div>
              <p class="eyebrow">Innenaufbau</p>
              <h2 class="mt-3 font-display text-2xl font-semibold leading-tight sm:text-3xl">
                Warum Speichermasse und Zuglänge zählen
              </h2>
              <p class="mt-4 text-sm leading-relaxed text-content-muted">
                Der Schnitt zeigt, was die Kachel verbirgt: Der Schamotte-Feuerraum nimmt die Hitze
                des Abbrands auf, lange Heizgaszüge führen die heißen Gase durch die
                Wärmespeichermasse, und die Dämmebene lenkt die Strahlung in den Raum.
              </p>
              <p class="mt-3 text-sm leading-relaxed text-content-muted">
                Je größer die Speichermasse und je länger die Züge, desto länger hält die Wärme —
                und desto genauer muss die Leistung zum Raum passen. Berechnen Sie unten die
                Heizlast, damit Ihr Ofen weder über- noch unterdimensioniert wird.
              </p>
            </div>
          </div>
          <div v-reveal>
            <HeizlastCalculator v-if="service.slug === 'kachelofen-kaminbau'" />
            <BimschvChecker v-if="service.slug === 'schornsteinbau'" />
          </div>
        </BaseContainer>
      </section>

      <!-- Other services -->
      <section class="section bg-surface-muted">
        <BaseContainer>
          <h2 class="mb-10 font-display text-2xl font-semibold sm:text-3xl">Weitere Leistungen</h2>
          <div class="grid gap-6 sm:grid-cols-2">
            <ServiceCard v-for="s in others" :key="s.slug" :service="s" />
          </div>
        </BaseContainer>
      </section>

      <CTASection />
    </template>

    <section v-if="service.faqs?.length" class="section bg-surface">
      <BaseContainer class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div v-reveal>
          <p class="eyebrow">Häufige Fragen</p>
          <h2 class="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Fragen zu {{ service.title }}
          </h2>
          <p class="mt-4 text-content-muted">
            Kurze Antworten für die erste Einordnung. Die konkrete Planung klären wir anhand Ihrer
            Räume, Wünsche und technischen Rahmenbedingungen.
          </p>
        </div>
        <div v-reveal="{ delay: 100 }" class="grid gap-4">
          <article
            v-for="item in service.faqs"
            :key="item.question"
            class="rounded-xl bg-surface-muted p-5 ring-1 ring-content-muted/10"
          >
            <h3 class="font-semibold text-content">{{ item.question }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-content-muted">{{ item.answer }}</p>
          </article>
        </div>
      </BaseContainer>
    </section>
  </div>

  <!-- Unknown slug -->
  <section v-else class="section bg-surface">
    <BaseContainer class="py-20 text-center">
      <p class="font-display text-3xl font-semibold">Leistung nicht gefunden</p>
      <p class="mt-3 text-content-muted">Diese Leistung existiert nicht.</p>
      <BaseButton :to="{ name: 'services' }" size="lg" class="mt-8">Zu den Leistungen</BaseButton>
    </BaseContainer>
  </section>
</template>

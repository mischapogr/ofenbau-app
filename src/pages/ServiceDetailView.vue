<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseImage from '@/components/BaseImage.vue'
import BaseButton from '@/components/BaseButton.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import Planning3DSection from '@/components/Planning3DSection.vue'
import ContactForm from '@/components/ContactForm.vue'
import CTASection from '@/components/CTASection.vue'
import AppIcon from '@/components/AppIcon.vue'
import { getService, services } from '@/data/services'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const service = computed(() => getService(route.params.slug))
const others = computed(() => services.filter((s) => s.slug !== route.params.slug))
const is3d = computed(() => route.params.slug === '3d-planung')

useSeo(() => ({
  title: service.value ? service.value.title : 'Leistung',
  description: service.value?.description,
  path: `/leistungen/${route.params.slug}`,
}))
</script>

<template>
  <div v-if="service">
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
          <BaseButton :to="{ name: 'contact' }" size="lg" class="mt-8">
            Beratung anfragen
            <AppIcon name="arrow" class="h-4 w-4" />
          </BaseButton>
        </div>
      </BaseContainer>
    </section>

    <!-- 3D-specific premium block + inline request form -->
    <template v-if="is3d">
      <Planning3DSection />
      <section class="section bg-surface-muted">
        <BaseContainer class="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p class="eyebrow">3D-Entwurf anfragen</p>
            <h2 class="mt-3 font-display text-3xl font-semibold leading-tight">
              Senden Sie uns Ihre Idee
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-content-muted">
              Beschreiben Sie kurz Ihr Vorhaben — wir erstellen Ihnen einen unverbindlichen
              3D-Entwurf und melden uns mit den nächsten Schritten.
            </p>
          </div>
          <div>
            <ContactForm subject="3D-Entwurf" submit-label="Anfrage senden" />
          </div>
        </BaseContainer>
      </section>
    </template>

    <!-- Other services -->
    <section v-else class="section bg-surface-muted">
      <BaseContainer>
        <h2 class="mb-10 font-display text-2xl font-semibold sm:text-3xl">Weitere Leistungen</h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <ServiceCard v-for="s in others" :key="s.slug" :service="s" />
        </div>
      </BaseContainer>
    </section>

    <CTASection v-if="!is3d" />
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

<script setup>
import BaseContainer from './BaseContainer.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'

defineProps({
  title: { type: String, default: 'Starten Sie Ihr Projekt heute' },
  text: {
    type: String,
    default: 'Lassen Sie uns gemeinsam die passende Lösung für Ihr Zuhause finden — unverbindlich.',
  },
})
</script>

<template>
  <section class="bg-surface py-20 sm:py-24">
    <BaseContainer>
      <div
        v-reveal
        class="relative overflow-hidden rounded-2xl bg-brand-500 px-6 py-14 text-center text-white shadow-card sm:px-12 sm:py-16"
      >
        <div
          class="pointer-events-none absolute inset-0 opacity-30"
          style="
            background:
              radial-gradient(60% 120% at 100% 0%, rgba(255, 255, 255, 0.35), transparent 60%),
              radial-gradient(50% 120% at 0% 100%, rgba(0, 0, 0, 0.25), transparent 60%);
          "
          aria-hidden="true"
        />
        <div class="relative">
          <h2 class="font-display text-3xl font-semibold sm:text-4xl">{{ title }}</h2>
          <p class="mx-auto mt-4 max-w-xl text-lg text-white/85">{{ text }}</p>
          <BaseButton
            :to="{ name: 'contact', query: { topic: 'beratung', source: 'cta' } }"
            variant="light"
            size="lg"
            class="mt-8"
          >
            Beratung vereinbaren
            <AppIcon name="arrow" class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

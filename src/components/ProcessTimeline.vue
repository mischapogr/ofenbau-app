<script setup>
import BaseSection from './BaseSection.vue'
import AppIcon from './AppIcon.vue'
import { processSteps } from '@/data/process'
</script>

<template>
  <BaseSection
    surface="sand"
    eyebrow="Unser Prozess"
    title="In vier Schritten zu Ihrem Ofen"
    subtitle="Klar, transparent und termintreu — von der ersten Idee bis zur Übergabe."
  >
    <ol class="relative grid gap-8 md:grid-cols-4 md:gap-6">
      <!-- horizontal connector (desktop) -->
      <div
        class="absolute left-0 right-0 top-7 hidden h-px bg-brand-300/50 md:block"
        aria-hidden="true"
      />
      <li
        v-for="(step, i) in processSteps"
        :key="step.n"
        v-reveal="{ delay: i * 110 }"
        class="relative flex gap-4 md:flex-col md:gap-0"
      >
        <!-- vertical connector (mobile) -->
        <div
          v-if="i < processSteps.length - 1"
          class="absolute left-7 top-14 h-[calc(100%-1rem)] w-px bg-brand-300/50 md:hidden"
          aria-hidden="true"
        />
        <div
          class="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-sm ring-4 ring-surface-sand"
        >
          <AppIcon :name="step.icon" class="h-6 w-6" />
        </div>
        <div class="md:mt-5">
          <p class="font-mono text-xs font-medium text-brand-600">{{ step.n }}</p>
          <h3 class="mt-1 font-display text-lg font-semibold text-content">{{ step.title }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-content-muted">{{ step.text }}</p>
        </div>
      </li>
    </ol>
  </BaseSection>
</template>

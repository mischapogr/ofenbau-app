<script setup>
import HeroSection from '@/components/HeroSection.vue'
import ServiceCards from '@/components/ServiceCards.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProcessTimeline from '@/components/ProcessTimeline.vue'
import ProjectGallery from '@/components/ProjectGallery.vue'
import Planning3DSection from '@/components/Planning3DSection.vue'
import Planning3DExplorer from '@/components/Planning3DExplorer.vue'
import CTASection from '@/components/CTASection.vue'
import { company } from '@/data/company'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: `${company.name} — Kachelöfen, Kamine & Fliesen vom Meister`,
  description:
    'Mit gesunder Wärme leben: individueller Kachel- & Kaminofenbau, meisterhafte Fliesenarbeiten und 3D-Planung aus einer Hand.',
  path: '/',
}))
</script>

<template>
  <div>
    <HeroSection />
    <ServiceCards />
    <AboutSection />
    <ProcessTimeline />
    <ProjectGallery :limit="6" :show-filters="false" show-cta />
    <Planning3DSection />
    <Planning3DExplorer />
    <CTASection />
  </div>
</template>

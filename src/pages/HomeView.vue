<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import ServiceCards from '@/components/ServiceCards.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProcessTimeline from '@/components/ProcessTimeline.vue'
import ProjectGallery from '@/components/ProjectGallery.vue'
import Planning3DSection from '@/components/Planning3DSection.vue'
import Planning3DExplorer from '@/components/Planning3DExplorer.vue'
import CTASection from '@/components/CTASection.vue'
import { company } from '@/data/company'
import { getRegion } from '@/data/regions'
import { useSeo } from '@/composables/useSeo'
import { hasFeature } from '@/config/tier'

const route = useRoute()
const region = computed(() => getRegion(route.params.slug))

const heroTitle = computed(() => region.value ? region.value.title : 'Mit gesunder Wärme leben')
const heroHighlight = computed(() => region.value ? 'Meisterbetrieb vor Ort' : 'Individueller Kachel- & Kaminofenbau')
const heroDesc = computed(() => region.value ? region.value.intro : 'Vom ersten Entwurf bis zum letzten Handgriff: handgesetzte Kachelöfen, Kamine und meisterhafte Fliesenarbeiten — für ein Zuhause, das über Jahrzehnte behaglich bleibt.')

useSeo(() => {
  if (region.value) {
    return {
      title: `${region.value.title} — ${company.name}`,
      description: region.value.description,
      path: `/region/${region.value.slug}`,
    }
  }
  return {
    title: `${company.name} — Kachelöfen, Kamine & Fliesen vom Meister`,
    description:
      'Mit gesunder Wärme leben: individueller Kachel- & Kaminofenbau, meisterhafte Fliesenarbeiten und 3D-Planung aus einer Hand.',
    path: '/',
  }
})
</script>

<template>
  <div>
    <HeroSection 
      :title="heroTitle" 
      :title-highlight="heroHighlight"
      :description="heroDesc"
    />
    <ServiceCards />
    <AboutSection />
    <ProcessTimeline />
    <ProjectGallery :limit="6" :show-filters="false" show-cta />
    <template v-if="hasFeature('planning3d')">
      <Planning3DSection />
      <Planning3DExplorer />
    </template>
    <CTASection />
  </div>
</template>

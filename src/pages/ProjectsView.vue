<script setup>
import PageHeader from '@/components/PageHeader.vue'
import ProjectGallery from '@/components/ProjectGallery.vue'
import CTASection from '@/components/CTASection.vue'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
  title: 'Projekte',
  description:
    'Ausgewählte Kachelöfen, Kamine und Fliesenarbeiten aus unserer Werkstatt — gefiltert nach Kategorie.',
  path: '/projekte',
}))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Projekte"
      title="Unsere Arbeiten im Überblick"
      subtitle="Handgesetzte Öfen, Kamine und Flächen — filtern Sie nach Kategorie und öffnen Sie ein Projekt für eine größere Ansicht."
      :crumbs="[{ name: 'Projekte', to: { name: 'projects' } }]"
    />
    <ProjectGallery />
    <CTASection />
  </div>
</template>

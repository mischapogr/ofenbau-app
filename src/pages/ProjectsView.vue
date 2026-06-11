<script setup>
import PageHeader from '@/components/PageHeader.vue'
import ProjectGallery from '@/components/ProjectGallery.vue'
import CTASection from '@/components/CTASection.vue'
import { useSeo } from '@/composables/useSeo'
import { useJsonLd } from '@/composables/useJsonLd'
import { projects } from '@/data/projects'

useSeo(() => ({
  title: 'Projekte',
  description:
    'Ausgewählte Kachelöfen, Kamine und Fliesenarbeiten aus unserer Werkstatt — gefiltert nach Kategorie.',
  path: '/projekte',
}))

const SITE_URL = (import.meta.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')

useJsonLd(
  () => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projekte & Referenzen',
    url: `${SITE_URL}/projekte`,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.description,
        material: project.material,
        image: {
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}${project.image}`,
          caption: project.title,
        },
        creator: { '@id': `${SITE_URL}/#business` },
      },
    })),
  }),
  'projects-jsonld'
)
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

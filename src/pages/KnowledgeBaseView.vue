<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import BaseContainer from '@/components/BaseContainer.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseImage from '@/components/BaseImage.vue'
import AppIcon from '@/components/AppIcon.vue'
import { knowledgeArticles, getArticle } from '@/data/knowledgeBase'
import { company } from '@/data/company'
import { hasFeature } from '@/config/tier'
import { useSeo } from '@/composables/useSeo'
import { useJsonLd } from '@/composables/useJsonLd'
import { parseArticleContent } from '@/utils/articleMarkdown'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const selectedTag = ref('Alle')

const activeSlug = computed(() => route.params.slug || '')
const article = computed(() => getArticle(activeSlug.value))
const contentBlocks = computed(() => (article.value ? parseArticleContent(article.value.content) : []))

const tags = computed(() => {
  const allTags = knowledgeArticles.flatMap((a) => a.tags)
  return ['Alle', ...new Set(allTags)]
})

const filteredArticles = computed(() => {
  return knowledgeArticles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTag = selectedTag.value === 'Alle' || a.tags.includes(selectedTag.value)
    return matchesSearch && matchesTag
  })
})

useSeo(() => {
  if (article.value) {
    return {
      title: `${article.value.title} — Ofenbau-Ratgeber`,
      description: article.value.summary,
      path: `/ratgeber/${article.value.slug}`,
    }
  }
  return {
    title: 'Ratgeber & Fachwissen — Ofenbau Mustermann',
    description: 'Fachartikel rund um Kaminbau, 1. BImSchV Übergangsfristen, Ofen-Wartung, Strahlungswärme und meisterhafte Fliesenverlegung.',
    path: '/ratgeber',
  }
})

const SITE_URL = (import.meta.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')

useJsonLd(() => {
  if (!article.value) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.value.title,
    description: article.value.summary,
    datePublished: article.value.date,
    articleSection: article.value.category,
    keywords: article.value.tags.join(', '),
    inLanguage: 'de',
    mainEntityOfPage: `${SITE_URL}/ratgeber/${article.value.slug}`,
    author: { '@type': 'Organization', name: company.name, '@id': `${SITE_URL}/#business` },
    publisher: { '@type': 'Organization', name: company.name, '@id': `${SITE_URL}/#business` },
  }
}, 'article-jsonld')

function selectArticle(slug) {
  router.push({ name: 'knowledge-detail', params: { slug } })
}

function goBack() {
  router.push({ name: 'knowledge' })
}
</script>

<template>
  <div>
    <!-- Render Article Detail View -->
    <template v-if="article">
      <PageHeader
        eyebrow="Ratgeber"
        :title="article.title"
        :subtitle="article.summary"
        :crumbs="[
          { name: 'Ratgeber', to: { name: 'knowledge' } },
          { name: article.title, to: { name: 'knowledge-detail', params: { slug: article.slug } } },
        ]"
      />

      <section class="section bg-surface">
        <BaseContainer class="max-w-3xl">
          <!-- Back button -->
          <button 
            type="button" 
            class="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500 mb-8"
            @click="goBack"
          >
            <AppIcon name="arrow" class="h-4 w-4 rotate-180" />
            Zurück zur Übersicht
          </button>

          <!-- Article Meta info -->
          <div class="flex flex-wrap items-center gap-4 text-xs text-content-muted border-b border-content-muted/10 pb-6 mb-8">
            <span class="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
              {{ article.category }}
            </span>
            <span>Veröffentlicht am {{ article.date }}</span>
            <span>·</span>
            <span>{{ article.readTime }}</span>
          </div>

          <!-- Optional technical figure (e.g. cutaway or exploded drawing) -->
          <figure v-if="article.figure" class="mb-8" :class="article.figure.narrow && 'mx-auto max-w-sm'">
            <BaseImage
              :src="article.figure.src"
              :ratio="article.figure.ratio || '4/3'"
              :alt="article.figure.alt"
              rounded="rounded-xl"
              enlargeable
              :caption="article.figure.caption"
              eager
            />
            <figcaption class="mt-3 text-center text-xs leading-relaxed text-content-muted">
              {{ article.figure.caption }}
            </figcaption>
          </figure>

          <!-- Article Body — parseArticleContent HTML-escapes all text before
               injecting <strong> tags, so v-html is safe here. -->
          <!-- eslint-disable vue/no-v-html -->
          <article class="max-w-none text-content leading-relaxed space-y-5">
            <template v-for="(block, idx) in contentBlocks" :key="idx">
              <h3
                v-if="block.type === 'h3'"
                class="font-display text-2xl font-semibold text-ink-900 pt-4"
                v-html="block.html"
              />
              <h4
                v-else-if="block.type === 'h4'"
                class="font-display text-xl font-semibold text-brand-600 pt-2"
                v-html="block.html"
              />
              <ul
                v-else-if="block.type === 'ul'"
                class="list-disc pl-5 space-y-2.5 text-sm md:text-base text-content-muted"
              >
                <li v-for="(item, li) in block.items" :key="li" v-html="item" />
              </ul>
              <ol
                v-else-if="block.type === 'ol'"
                class="list-decimal pl-5 space-y-2.5 text-sm md:text-base text-content-muted"
              >
                <li v-for="(item, li) in block.items" :key="li" v-html="item" />
              </ol>
              <p
                v-else
                class="text-sm md:text-base text-content-muted"
                :class="block.callout && 'rounded-xl border-l-4 border-brand-500 bg-brand-50/70 px-5 py-4 !text-content'"
                v-html="block.html"
              />
            </template>
          </article>
          <!-- eslint-enable vue/no-v-html -->

          <!-- Specific BImSchV CTA if reading the BImSchV article -->
          <div
            v-if="hasFeature('calculators') && article.slug === 'bimschv-kaminofen-austauschpflicht'"
            class="mt-12 rounded-2xl bg-brand-50 border border-brand-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div class="text-left">
              <h4 class="font-display text-lg font-bold text-brand-900">Möchten Sie Ihre eigene Feuerstätte prüfen?</h4>
              <p class="mt-1 text-xs text-brand-800/80 leading-relaxed max-w-xl">
                Mit unserem interaktiven BImSchV Ofen-Check können Sie in wenigen Schritten prüfen, ob Ihr Kaminofen, Kachelofen oder Speicherofen von der gesetzlichen Austauschpflicht betroffen ist.
              </p>
            </div>
            <BaseButton 
              :to="{ name: 'service-detail', params: { slug: 'schornsteinbau' }, hash: '#bimschv-ofen-check' }" 
              class="shrink-0"
              size="md"
            >
              Zum BImSchV Ofen-Check
              <AppIcon name="arrow" class="h-4 w-4" />
            </BaseButton>
          </div>

          <!-- Contact trigger CTA -->
          <div class="mt-16 rounded-2xl bg-surface-muted p-8 text-center border border-content-muted/10">
            <h4 class="font-display text-xl font-semibold">Haben Sie Fragen zu diesem Thema?</h4>
            <p class="mt-2 text-sm text-content-muted max-w-md mx-auto">
              Als Meisterbetrieb beraten wir Sie gerne ausführlich zur 1. BImSchV, dem Ofenaustausch oder passenden Materialien.
            </p>
            <BaseButton 
              :to="{ name: 'contact', query: { topic: 'beratung', note: `Anfrage zum Fachartikel: ${article.title}`, source: 'knowledge' } }" 
              class="mt-6"
            >
              Unverbindlich beraten lassen
              <AppIcon name="arrow" class="h-4 w-4" />
            </BaseButton>
          </div>
        </BaseContainer>
      </section>
    </template>

    <!-- Render List View -->
    <template v-else>
      <PageHeader
        eyebrow="Ratgeber"
        title="Fachwissen für Wärme und Wohnraum"
        subtitle="Erfahren Sie alles Wissenswerte rund um moderne Ofentechnik, gesetzliche Richtlinien und Fliesenverlegung."
        :crumbs="[{ name: 'Ratgeber', to: { name: 'knowledge' } }]"
      />

      <section class="section bg-surface">
        <BaseContainer>
          <div class="grid gap-10 lg:grid-cols-[280px_1fr]">
            <!-- Filters Sidebar -->
            <div class="space-y-6">
              <div>
                <label for="search-art" class="block text-sm font-semibold text-ink-900 mb-2">Artikel durchsuchen</label>
                <div class="relative">
                  <input 
                    id="search-art"
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Suchen..." 
                    class="w-full rounded-lg border border-content-muted/20 bg-surface-muted px-4 py-2 text-sm text-content placeholder:text-content-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-ink-900 mb-3">Kategorien / Tags</h4>
                <div class="flex flex-wrap gap-2 lg:flex-col lg:items-start lg:gap-1.5">
                  <button 
                    v-for="tag in tags" 
                    :key="tag" 
                    type="button" 
                    class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all lg:rounded-lg lg:px-3 lg:py-2 lg:w-full lg:text-left"
                    :class="selectedTag === tag 
                      ? 'bg-brand-500 text-white shadow-sm' 
                      : 'bg-surface-muted text-content-muted hover:bg-surface-sand hover:text-content'"
                    @click="selectedTag = tag"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Articles Grid -->
            <div>
              <div v-if="filteredArticles.length === 0" class="py-12 text-center border border-dashed border-content-muted/20 rounded-2xl">
                <AppIcon name="close" class="mx-auto h-12 w-12 text-content-muted/40" />
                <h3 class="mt-4 font-semibold text-ink-900">Keine Artikel gefunden</h3>
                <p class="mt-1 text-sm text-content-muted">Passen Sie Ihre Suche oder Ihren Filter an.</p>
              </div>

              <div v-else class="grid gap-6 md:grid-cols-2">
                <article 
                  v-for="a in filteredArticles" 
                  :key="a.slug"
                  class="flex flex-col justify-between rounded-2xl bg-surface-muted border border-content-muted/10 p-6 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all cursor-pointer"
                  @click="selectArticle(a.slug)"
                >
                  <div>
                    <div class="flex items-center justify-between gap-4">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                        {{ a.category }}
                      </span>
                      <span class="text-xs text-content-muted">{{ a.readTime }}</span>
                    </div>
                    <h3 class="mt-3 font-display text-xl font-semibold text-ink-900 line-clamp-2">
                      {{ a.title }}
                    </h3>
                    <p class="mt-2 text-sm text-content-muted line-clamp-3 leading-relaxed">
                      {{ a.summary }}
                    </p>
                  </div>

                  <div class="mt-6 flex items-center justify-between border-t border-content-muted/10 pt-4">
                    <span class="text-xs text-content-muted">{{ a.date }}</span>
                    <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                      Weiterlesen
                      <AppIcon name="arrow" class="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </BaseContainer>
      </section>
    </template>
  </div>
</template>

import { createRouter, createWebHistory } from 'vue-router'
import { company } from '@/data/company'
import { hasFeature } from '@/config/tier'

const siteName = import.meta.env.VITE_APP_TITLE || company.name

/**
 * Routes use lazy-loaded page components so each route is its own chunk.
 * `meta.title` / `meta.description` feed the SEO composable + the global
 * afterEach guard below.
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomeView.vue'),
    meta: {
      title: `${siteName} — Kachelöfen, Kamine & Fliesen`,
      description:
        'Mit gesunder Wärme leben: individueller Kachel- & Kaminofenbau, Fliesenarbeiten und 3D-Planung vom Meisterbetrieb.',
    },
  },
  // Regional landing pages are a premium ("multi-region local SEO") feature.
  ...(hasFeature('regions')
    ? [
        {
          path: '/region/:slug',
          name: 'region',
          component: () => import('@/pages/HomeView.vue'),
        },
      ]
    : []),
  {
    path: '/leistungen',
    name: 'services',
    component: () => import('@/pages/ServicesView.vue'),
    meta: {
      title: `Leistungen — ${siteName}`,
      description: 'Kachelöfen, Kaminbau, Fliesenarbeiten und 3D-Planung vom Meisterbetrieb.',
    },
  },
  {
    path: '/leistungen/:slug',
    name: 'service-detail',
    component: () => import('@/pages/ServiceDetailView.vue'),
    meta: { title: `Leistung — ${siteName}` },
    // The 3D-planning service is premium-only; a basis build sends the slug
    // back to the overview instead of rendering "Leistung nicht gefunden".
    beforeEnter: (to) =>
      to.params.slug === '3d-planung' && !hasFeature('planning3d') ? { name: 'services' } : true,
  },
  {
    path: '/projekte',
    name: 'projects',
    component: () => import('@/pages/ProjectsView.vue'),
    meta: {
      title: `Projekte — ${siteName}`,
      description: 'Ausgewählte Kachelöfen, Kamine und Fliesenarbeiten aus unserer Werkstatt.',
    },
  },
  {
    path: '/ueber-uns',
    name: 'about',
    component: () => import('@/pages/AboutView.vue'),
    meta: {
      title: `Über uns — ${siteName}`,
      description: 'Tradition, Handwerk und moderne Technik seit Generationen.',
    },
  },
  {
    path: '/kontakt',
    name: 'contact',
    component: () => import('@/pages/ContactView.vue'),
    meta: {
      title: `Kontakt — ${siteName}`,
      description: 'Vereinbaren Sie eine unverbindliche Beratung. Wir freuen uns auf Sie.',
    },
  },
  {
    path: '/impressum',
    name: 'imprint',
    component: () => import('@/pages/LegalView.vue'),
    meta: { title: `Impressum — ${siteName}` },
  },
  {
    path: '/datenschutz',
    name: 'privacy',
    component: () => import('@/pages/LegalView.vue'),
    meta: { title: `Datenschutz — ${siteName}` },
  },
  {
    path: '/ratgeber',
    name: 'knowledge',
    component: () => import('@/pages/KnowledgeBaseView.vue'),
    meta: {
      title: `Ratgeber & Fachwissen — ${siteName}`,
      description:
        'Fachartikel rund um Kaminbau, 1. BImSchV Übergangsfristen, Ofen-Wartung, Strahlungswärme und meisterhafte Fliesenverlegung.',
    },
  },
  {
    path: '/ratgeber/:slug',
    name: 'knowledge-detail',
    component: () => import('@/pages/KnowledgeBaseView.vue'),
    meta: { title: `Ratgeber — ${siteName}` },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundView.vue'),
    meta: { title: `Seite nicht gefunden — ${siteName}` },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    }

    return new Promise((resolve) => {
      // Wait for page fade transition (180ms in App.vue) to finish before scrolling
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        } else if (to.hash) {
          resolve({ el: to.hash, behavior: 'smooth' })
        } else {
          resolve({ top: 0 })
        }
      }, 200)
    })
  },
})

// Keep the document title in sync as a sensible fallback; per-page SEO is
// handled more thoroughly by the useSeo composable.
router.afterEach((to) => {
  const title = to.meta?.title
  if (title) document.title = title

  // Handle focusing the target hash element if present
  if (to.hash) {
    // Wait for route transition and rendering to complete
    setTimeout(() => {
      try {
        const target = document.querySelector(to.hash)
        if (target) {
          target.focus({ preventScroll: true })
        }
      } catch (err) {
        console.warn('Failed to focus element for hash:', to.hash, err)
      }
    }, 400)
  }
})

export default router

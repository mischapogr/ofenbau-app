import { createRouter, createWebHistory } from 'vue-router'
import { company } from '@/data/company'

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
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// Keep the document title in sync as a sensible fallback; per-page SEO is
// handled more thoroughly by the useSeo composable.
router.afterEach((to) => {
  const title = to.meta?.title
  if (title) document.title = title
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

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
      title: 'Ofenbau Mustermann — Kachelöfen, Kamine & Ofenbau',
      description:
        'Meisterhafter Ofenbau, Kachelöfen und Kamine — handwerkliche Wärme für Ihr Zuhause.',
    },
  },
  {
    path: '/leistungen',
    name: 'services',
    component: () => import('@/pages/ServicesView.vue'),
    meta: {
      title: 'Leistungen — Ofenbau Mustermann',
      description: 'Kachelöfen, Heizkamine, Kaminöfen, Sanierung und Wartung vom Meisterbetrieb.',
    },
  },
  {
    path: '/ueber-uns',
    name: 'about',
    component: () => import('@/pages/AboutView.vue'),
    meta: {
      title: 'Über uns — Ofenbau Mustermann',
      description: 'Tradition, Handwerk und moderne Technik seit Generationen.',
    },
  },
  {
    path: '/kontakt',
    name: 'contact',
    component: () => import('@/pages/ContactView.vue'),
    meta: {
      title: 'Kontakt — Ofenbau Mustermann',
      description: 'Vereinbaren Sie eine unverbindliche Beratung. Wir freuen uns auf Sie.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundView.vue'),
    meta: { title: 'Seite nicht gefunden — Ofenbau Mustermann' },
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

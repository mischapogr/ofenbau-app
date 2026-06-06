/**
 * v-reveal — scroll-reveal directive.
 *
 * Adds the `.reveal` class immediately (initial hidden state) and toggles
 * `.reveal-in` when the element scrolls into view via IntersectionObserver.
 * Honours `prefers-reduced-motion` by showing content instantly.
 *
 * Usage:
 *   <div v-reveal>…</div>
 *   <div v-reveal="{ delay: 120 }">…</div>   // stagger in ms
 */
const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const reveal = {
  mounted(el, binding) {
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-in')
      return
    }

    el.classList.add('reveal')
    const delay = binding.value?.delay
    if (delay) el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('reveal-in')
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(el)
    el._revealObserver = observer
  },
  unmounted(el) {
    el._revealObserver?.disconnect()
  },
}

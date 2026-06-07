import { onBeforeUnmount, unref, watchEffect } from 'vue'

/**
 * useJsonLd — inject a JSON-LD <script> for the lifetime of a component
 * (e.g. BreadcrumbList on subpages). Removed automatically on unmount.
 *
 * @param {object|Function} data  A schema.org object, ref/computed, or getter.
 * @param {string} id    Unique id so repeated mounts replace cleanly.
 */
export function useJsonLd(data, id = 'route-jsonld') {
  if (typeof document === 'undefined') return

  let el = document.getElementById(id)

  const stop = watchEffect(() => {
    const value = typeof data === 'function' ? data() : unref(data)

    if (!value) {
      el?.parentNode?.removeChild(el)
      el = null
      return
    }

    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
    }

    el.textContent = JSON.stringify(value)
  })

  onBeforeUnmount(() => {
    stop()
    el?.parentNode?.removeChild(el)
  })
}

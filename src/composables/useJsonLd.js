import { onBeforeUnmount } from 'vue'

/**
 * useJsonLd — inject a JSON-LD <script> for the lifetime of a component
 * (e.g. BreadcrumbList on subpages). Removed automatically on unmount.
 *
 * @param {object} data  A schema.org object.
 * @param {string} id    Unique id so repeated mounts replace cleanly.
 */
export function useJsonLd(data, id = 'route-jsonld') {
  if (typeof document === 'undefined') return

  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)

  onBeforeUnmount(() => {
    el?.parentNode?.removeChild(el)
  })
}

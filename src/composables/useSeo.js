import { watchEffect, onBeforeUnmount } from 'vue'
import { company } from '@/data/company'

const SITE_NAME = import.meta.env.VITE_APP_TITLE || company.name
const SITE_URL = (import.meta.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '')
const DEFAULT_IMAGE = '/images/hero.webp'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function absoluteUrl(value) {
  if (!value) return ''
  try {
    return new URL(value, SITE_URL).href
  } catch (_error) {
    return value
  }
}

/**
 * useSeo — declaratively set title + meta tags for a page.
 * Accepts reactive getters so values can depend on fetched data.
 *
 * @param {() => ({ title?: string, description?: string, path?: string, image?: string })} getter
 */
export function useSeo(getter) {
  const stop = watchEffect(() => {
    const meta = (typeof getter === 'function' ? getter() : getter) || {}
    const fullTitle = meta.title
      ? meta.title.includes(SITE_NAME)
        ? meta.title
        : `${meta.title} — ${SITE_NAME}`
      : SITE_NAME

    const canonical = meta.path ? `${SITE_URL}${meta.path}` : SITE_URL
    const image = absoluteUrl(meta.image || DEFAULT_IMAGE)

    document.title = fullTitle
    upsertMeta('name', 'description', meta.description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:type', meta.type || 'website')
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', meta.description)
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    if (image) {
      upsertMeta('property', 'og:image', image)
      upsertMeta('name', 'twitter:image', image)
    }
    upsertCanonical(canonical)
  })

  onBeforeUnmount(stop)
}

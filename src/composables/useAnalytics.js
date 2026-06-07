import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const storageKey = 'ofenbau-cookie-consent'
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || ''

function readConsent() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || 'null')
  } catch (_error) {
    return null
  }
}

function installGoogleAnalytics() {
  if (!measurementId || typeof document === 'undefined') return false
  if (window.gtag) return true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  return true
}

function trackPage(path) {
  if (!measurementId || !window.gtag) return
  window.gtag('config', measurementId, {
    page_path: path,
    anonymize_ip: true,
  })
}

export function useAnalytics() {
  const route = useRoute()
  let enabled = false

  function applyConsent(consent = readConsent()) {
    enabled = !!measurementId && !!consent?.analytics
    if (!enabled) return
    if (installGoogleAnalytics()) trackPage(route.fullPath)
  }

  function onConsentChanged(event) {
    applyConsent(event.detail)
  }

  onMounted(() => {
    applyConsent()
    window.addEventListener('ofenbau-cookie-consent', onConsentChanged)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('ofenbau-cookie-consent', onConsentChanged)
  })

  watch(
    () => route.fullPath,
    (path) => {
      if (enabled) trackPage(path)
    }
  )
}

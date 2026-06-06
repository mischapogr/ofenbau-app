import { computed, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

/**
 * useTheme — the bridge between the theme store and the DOM.
 * Applies the `.dark` class on <html> and keeps it in sync with the store.
 */
export function useTheme() {
  const store = useThemeStore()
  const isDark = computed(() => store.mode === 'dark')

  function apply(mode) {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
  }

  function initTheme() {
    let initial = 'light'
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || stored === 'light') {
        initial = stored
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        initial = 'dark'
      }
    } catch (_e) {
      // ignore
    }
    store.setMode(initial)
    apply(initial)
  }

  // Reflect any store changes to the DOM.
  watch(
    () => store.mode,
    (mode) => apply(mode)
  )

  return {
    isDark,
    initTheme,
    toggle: store.toggle,
    setMode: store.setMode,
  }
}

import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'theme'

/**
 * Theme store — holds the active mode ('light' | 'dark') and persists it.
 * The actual DOM class toggling lives in the useTheme composable so this
 * store stays framework-agnostic and easy to test.
 */
export const useThemeStore = defineStore('theme', () => {
  const mode = ref('light')

  function setMode(next) {
    mode.value = next === 'dark' ? 'dark' : 'light'
    try {
      localStorage.setItem(STORAGE_KEY, mode.value)
    } catch (_e) {
      // Storage may be unavailable (private mode); fail silently.
    }
  }

  function toggle() {
    setMode(mode.value === 'dark' ? 'light' : 'dark')
  }

  return { mode, setMode, toggle }
})

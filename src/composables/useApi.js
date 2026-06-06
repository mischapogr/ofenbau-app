import { ref, shallowRef } from 'vue'

/**
 * useApi — wraps an async request function with loading/error/data state
 * plus a re-runnable `execute`. Pairs with the AppLoader / AppError components.
 *
 * @template T
 * @param {(...args: any[]) => Promise<T>} requestFn
 * @param {{ immediate?: boolean }} [options]
 *
 * @example
 *   const { data, isLoading, error, execute } = useApi(fetchServices, { immediate: true })
 */
export function useApi(requestFn, options = {}) {
  const data = shallowRef(null)
  const error = ref(null)
  const isLoading = ref(false)

  async function execute(...args) {
    isLoading.value = true
    error.value = null
    try {
      data.value = await requestFn(...args)
      return data.value
    } catch (err) {
      error.value = err?.normalizedMessage || err?.message || 'Unbekannter Fehler.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  if (options.immediate) {
    // Fire and forget; consumers read isLoading/error reactively.
    execute().catch(() => {})
  }

  return { data, error, isLoading, execute }
}

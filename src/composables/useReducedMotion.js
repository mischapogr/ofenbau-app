import { onBeforeUnmount, ref } from 'vue'

export function useReducedMotion() {
  const reduced = ref(false)

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches

    const onChange = (event) => {
      reduced.value = event.matches
    }
    query.addEventListener('change', onChange)
    onBeforeUnmount(() => query.removeEventListener('change', onChange))
  }

  return reduced
}

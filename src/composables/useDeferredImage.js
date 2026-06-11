import { ref, watch } from 'vue'

/**
 * Defers swapping an image source until the new image is decoded, so the
 * stage never shows a half-loaded image. Returns a ref that lags `src`
 * by one decode; pair it with a <Transition> for a flicker-free crossfade.
 */
export function useDeferredImage(src) {
  const displayed = ref(src.value ?? null)
  let token = 0

  watch(src, (next) => {
    const current = ++token
    if (!next) {
      displayed.value = null
      return
    }
    const img = new Image()
    img.src = next
    const apply = () => {
      if (token === current) displayed.value = next
    }
    if (img.decode) {
      img.decode().then(apply).catch(apply)
    } else {
      img.onload = apply
      img.onerror = apply
    }
  })

  return displayed
}

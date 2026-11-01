<script setup>
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Defers the planning explorer (its chunk and its images) until the section
 * is near the viewport. Reserves the stage height so nothing shifts when it
 * mounts. Without IntersectionObserver (or for prerendering) it mounts at once.
 */
const Planning3DExplorer = defineAsyncComponent(() => import('../Planning3DExplorer.vue'))

const root = ref(null)
const visible = ref(false)
let observer = null

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !root.value) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      visible.value = true
      observer?.disconnect()
      observer = null
    },
    { rootMargin: '600px 0px' }
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="root" data-planning-explorer>
    <Planning3DExplorer v-if="visible" />
    <section v-else class="section bg-surface-muted" aria-hidden="true">
      <div class="mx-auto min-h-[40rem] max-w-7xl rounded-2xl bg-ink-950/5"></div>
    </section>
  </div>
</template>

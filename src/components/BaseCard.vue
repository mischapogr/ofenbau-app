<script setup>
defineProps({
  as: { type: String, default: 'div' },
  hoverable: { type: Boolean, default: false },
})
</script>

<template>
  <component
    :is="as"
    class="rounded-2xl bg-surface shadow-card ring-1 ring-content-muted/10 transition-transform duration-200"
    :class="hoverable && 'hover:-translate-y-1'"
  >
    <slot />
  </component>
</template>

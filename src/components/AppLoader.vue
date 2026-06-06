<script setup>
defineProps({
  label: { type: String, default: 'Lädt …' },
  // 'inline' for buttons/sections, 'block' for full sections.
  size: { type: String, default: 'md' }, // sm | md | lg
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 py-8"
    role="status"
    aria-live="polite"
  >
    <span
      class="inline-block animate-spin rounded-full border-2 border-brand-600 border-t-transparent"
      :class="{
        'h-4 w-4': size === 'sm',
        'h-8 w-8': size === 'md',
        'h-12 w-12': size === 'lg',
      }"
    />
    <span class="text-sm text-content-muted">{{ label }}</span>
  </div>
</template>

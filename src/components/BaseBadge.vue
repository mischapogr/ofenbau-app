<script setup>
/**
 * BaseBadge — small pill used for trust signals / eyebrow chips.
 * `tone="onDark"` for use on charcoal panels.
 */
defineProps({
  tone: { type: String, default: 'brand' }, // brand | onDark | neutral
})

const tones = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-500/15',
  onDark: 'bg-white/10 text-white ring-1 ring-white/15',
  neutral: 'bg-surface-sand text-content ring-1 ring-content-muted/10',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
    :class="tones[tone] || tones.brand"
  >
    <slot />
  </span>
</template>

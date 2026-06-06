<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * BaseButton — polymorphic button / link.
 * Renders as <RouterLink>, <a> or <button> depending on props.
 */
const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | outline | ghost | light
  size: { type: String, default: 'md' }, // sm | md | lg
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none'

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
  }

  const variants = {
    primary: 'bg-brand-500 text-white shadow-sm hover:bg-brand-600 active:bg-brand-700',
    secondary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950',
    outline:
      'border border-content-muted/25 text-content hover:border-brand-500 hover:text-brand-600',
    ghost: 'text-content hover:bg-surface-muted',
    light: 'bg-white text-ink-900 shadow-sm hover:bg-surface-muted',
  }

  return [base, sizes[props.size], variants[props.variant], props.block && 'w-full']
})
</script>

<template>
  <component
    :is="tag"
    :to="to || undefined"
    :href="href || undefined"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :class="classes"
  >
    <slot />
  </component>
</template>

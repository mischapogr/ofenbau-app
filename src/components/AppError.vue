<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  title: { type: String, default: 'Etwas ist schiefgelaufen' },
  message: { type: String, default: 'Bitte versuchen Sie es später erneut.' },
  retryable: { type: Boolean, default: true },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-300/40 bg-red-50/60 px-6 py-8 text-center"
    role="alert"
  >
    <svg
      class="h-10 w-10 text-red-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5h.01" stroke-linecap="round" />
    </svg>
    <div>
      <p class="font-semibold text-content">{{ title }}</p>
      <p class="mt-1 text-sm text-content-muted">{{ message }}</p>
    </div>
    <BaseButton v-if="retryable" variant="outline" size="sm" @click="emit('retry')">
      Erneut versuchen
    </BaseButton>
  </div>
</template>

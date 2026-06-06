<script setup>
defineProps({
  as: { type: String, default: 'div' },
})
</script>

<template>
  <component :is="as" class="container-page">
    <slot />
  </component>
</template>

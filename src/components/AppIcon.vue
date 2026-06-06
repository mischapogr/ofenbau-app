<script setup>
/**
 * AppIcon — single source for all line icons (Lucide-style, 24px grid).
 * Stroke icons inherit `currentColor`; brand/social glyphs are filled.
 * Usage: <AppIcon name="flame" class="h-6 w-6" />
 */
defineProps({
  name: { type: String, required: true },
  title: { type: String, default: '' },
})

// Stroke path data keyed by name.
const strokePaths = {
  flame: 'M12 3c1.6 3.2 5 4.8 5 9a5 5 0 0 1-10 0c0-2 1-3.6 2-5 .5 1.6 1.6 2 2 2-.6-2.2-1-4.4 1-6z',
  tile: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  render: 'M12 3l8 4.5v9L12 21 4 16.5v-9L12 3zM12 3v18M4 7.5l8 4.5 8-4.5',
  tools: 'M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.1-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2 1.7-1.5z',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 5 .5 13-6 18-3-.5-5-2-7-5M9 14c2-3 5-5 8-6',
  chat: 'M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.7-.7L3 21l1.4-4.2A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z',
  cube: 'M12 3l8 4.5v9L12 21 4 16.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12 4 7.5',
  hammer:
    'M14 6l4 4M3 21l7-7M13 7l4-4 4 4-4 4-1.5-1.5M9.5 10.5L13 7l4 4-3.5 3.5a2.1 2.1 0 0 1-3-3z',
  check: 'M4 12.5l5 5L20 6.5',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  swatch: 'M4 4h7v12a3.5 3.5 0 1 1-7 0V4zM7.5 16.5h.01M11 9.5l4-4 5 5L11 19M11 16h9',
  calculator:
    'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v2M8 19h4',
  phone:
    'M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 18l5 2v3a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  pin: 'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevron: 'M9 6l6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  star: 'M12 4l2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 15.8 7.3 18.2l.9-5.1L4.5 9.5l5.2-.8L12 4z',
}

// Filled brand/social glyphs.
const fillPaths = {
  instagram:
    'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.36 1 .42 2.2.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 12 18.6 6.6 6.6 0 0 0 12 5.4zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6zm6.8-11.2a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z',
  facebook:
    'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.45 2.9h-2.35v7A10 10 0 0 0 22 12z',
  pinterest:
    'M12 2a10 10 0 0 0-3.6 19.3c-.05-.8-.1-2 .1-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.45 1.8-2.45.85 0 1.26.64 1.26 1.4 0 .85-.54 2.13-.82 3.3-.24 1 .5 1.8 1.46 1.8 1.76 0 3.1-1.85 3.1-4.5 0-2.36-1.7-4-4.12-4a4.27 4.27 0 0 0-4.46 4.3c0 .85.33 1.76.74 2.25a.3.3 0 0 1 .07.29l-.27 1.1c-.04.18-.14.22-.33.13-1.23-.57-2-2.37-2-3.82 0-3.1 2.26-5.96 6.5-5.96 3.42 0 6.08 2.44 6.08 5.7 0 3.4-2.14 6.13-5.12 6.13-1 0-1.94-.52-2.26-1.13l-.62 2.35c-.22.86-.82 1.94-1.23 2.6A10 10 0 1 0 12 2z',
}
</script>

<template>
  <svg
    v-if="strokePaths[name]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
  >
    <title v-if="title">{{ title }}</title>
    <path :d="strokePaths[name]" />
  </svg>
  <svg
    v-else-if="fillPaths[name]"
    viewBox="0 0 24 24"
    fill="currentColor"
    :role="title ? 'img' : undefined"
    :aria-hidden="title ? undefined : 'true'"
  >
    <title v-if="title">{{ title }}</title>
    <path :d="fillPaths[name]" />
  </svg>
</template>

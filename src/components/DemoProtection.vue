<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  protection: {
    type: Object,
    required: true,
  },
})

const accessCode = ref('')

async function submitAccessCode() {
  await props.protection.verifyAccessCode(accessCode.value)
}
</script>

<template>
  <div
    v-if="protection.isDemo && protection.watermarkEnabled && !protection.blocksApp"
    class="demo-watermark demo-watermark--dark"
    :style="{ '--wm-factor': protection.watermarkFactor }"
    aria-hidden="true"
  >
    <span v-for="index in 12" :key="index">{{ protection.watermarkText }}</span>
  </div>
  <div
    v-if="protection.isDemo && protection.watermarkEnabled && !protection.blocksApp"
    class="demo-watermark demo-watermark--light"
    :style="{ '--wm-factor': protection.watermarkFactor }"
    aria-hidden="true"
  >
    <span v-for="index in 12" :key="index">{{ protection.watermarkText }}</span>
  </div>

  <aside
    v-if="protection.isDemo && !protection.blocksApp"
    class="demo-copyright"
    aria-label="Demo Urheberrechtsschutz"
  >
    <strong>Geschuetzte Demo</strong>
    <span>{{ protection.copyrightNotice }}</span>
    <span>Autor: {{ protection.authorName }} · {{ protection.authorEmail }}</span>
  </aside>

  <section v-if="protection.blocksApp" class="demo-gate" aria-labelledby="demo-gate-title">
    <div class="demo-gate__panel">
      <p class="demo-gate__eyebrow">Geschuetzte Demo</p>
      <h1 id="demo-gate-title">Ofenbau Mustermann</h1>
      <p v-if="protection.blockedReason" class="demo-gate__copy">
        {{ protection.blockedReason }}
      </p>
      <form v-else class="demo-gate__form" @submit.prevent="submitAccessCode">
        <label for="demo-access-code">Zugangscode</label>
        <input
          id="demo-access-code"
          v-model="accessCode"
          type="password"
          autocomplete="current-password"
          required
        />
        <p v-if="protection.accessError" class="demo-gate__error">
          {{ protection.accessError }}
        </p>
        <BaseButton type="submit" :disabled="protection.verifying">
          Demo oeffnen
        </BaseButton>
      </form>
      <p class="demo-gate__note">
        Zugriff nur fuer {{ protection.customerName }}. Inhalte duerfen nicht kopiert,
        weitergegeben oder produktiv genutzt werden.
      </p>
      <p class="demo-gate__notice">
        {{ protection.copyrightNotice }} Autor: {{ protection.authorName }} ·
        {{ protection.authorEmail }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.demo-watermark {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  grid-template-columns: repeat(3, minmax(14rem, 1fr));
  gap: 5rem 3rem;
  padding: 2.5rem;
  pointer-events: none;
  overflow: hidden;
  font-family: 'Space Mono', monospace;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.demo-watermark span {
  display: block;
  transform: rotate(-24deg);
  white-space: nowrap;
}

.demo-watermark--dark {
  color: rgba(44, 36, 28, calc(0.1 * var(--wm-factor, 1)));
  text-shadow: 0 1px 0 rgba(255, 255, 255, calc(0.35 * var(--wm-factor, 1)));
}

.demo-watermark--light {
  color: rgba(255, 252, 246, calc(0.14 * var(--wm-factor, 1)));
  text-shadow: 0 1px 2px rgba(24, 20, 18, calc(0.2 * var(--wm-factor, 1)));
  transform: translate(2.4rem, 1.6rem);
}

.demo-watermark--light span {
  transform: rotate(-24deg) translateY(0.6rem);
}

.demo-copyright {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 80;
  display: grid;
  pointer-events: none;
  max-width: min(34rem, calc(100vw - 2rem));
  gap: 0.22rem;
  border: 1px solid rgba(44, 36, 28, 0.2);
  border-radius: 8px;
  padding: 0.72rem 0.85rem;
  background: rgba(255, 252, 246, 0.92);
  box-shadow: 0 0.85rem 2rem rgba(44, 36, 28, 0.14);
  color: rgb(var(--color-content));
  font-size: 0.78rem;
  line-height: 1.35;
}

.demo-copyright strong {
  color: rgb(var(--color-brand-700));
}

.demo-gate {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 1.25rem;
  background:
    linear-gradient(rgba(252, 248, 240, 0.92), rgba(252, 248, 240, 0.92)),
    url('/images/hero.webp') center / cover;
}

.demo-gate__panel {
  width: min(100%, 28rem);
  border: 1px solid rgba(44, 36, 28, 0.16);
  border-radius: 8px;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: rgba(255, 252, 246, 0.96);
  box-shadow: 0 1.5rem 4rem rgba(44, 36, 28, 0.18);
}

.demo-gate__eyebrow {
  margin: 0 0 0.6rem;
  color: rgb(var(--color-brand-600));
  font-family: 'Space Mono', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.demo-gate h1 {
  margin: 0;
  color: rgb(var(--color-content));
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(2rem, 6vw, 3rem);
  line-height: 1;
}

.demo-gate__copy,
.demo-gate__note {
  color: var(--color-content-muted);
  line-height: 1.6;
}

.demo-gate__copy {
  margin: 1rem 0 0;
}

.demo-gate__note,
.demo-gate__notice {
  margin: 1rem 0 0;
  font-size: 0.9rem;
}

.demo-gate__notice {
  border-top: 1px solid rgba(44, 36, 28, 0.12);
  padding-top: 1rem;
  color: rgb(var(--color-content));
}

.demo-gate__form {
  display: grid;
  gap: 0.8rem;
  margin-top: 1.25rem;
}

.demo-gate__form label {
  color: rgb(var(--color-content));
  font-weight: 700;
}

.demo-gate__form input {
  width: 100%;
  border: 1px solid rgba(44, 36, 28, 0.18);
  border-radius: 8px;
  padding: 0.85rem 0.95rem;
  background: #fffaf2;
  color: rgb(var(--color-content));
  font: inherit;
}

.demo-gate__form input:focus-visible {
  outline: 3px solid rgba(227, 82, 5, 0.28);
  outline-offset: 2px;
}

.demo-gate__error {
  margin: 0;
  color: #9a3412;
  font-weight: 700;
}

@media (max-width: 640px) {
  .demo-watermark {
    grid-template-columns: repeat(2, minmax(10rem, 1fr));
    gap: 3.5rem 2rem;
    font-size: 0.72rem;
  }

  .demo-copyright {
    right: 0.75rem;
    bottom: 0.75rem;
    max-width: calc(100vw - 1.5rem);
  }
}
</style>

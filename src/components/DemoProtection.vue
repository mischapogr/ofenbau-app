<script setup>
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import AppIcon from '@/components/AppIcon.vue'
import { productTiers } from '@/data/productTiers'
import { tier as activeTier } from '@/config/tier'

const props = defineProps({
  protection: {
    type: Object,
    required: true,
  },
})

const accessCode = ref('')

// The catalog only makes sense on the open gate (not when a hard block, e.g. an
// unauthorised host, replaces the form with an explanatory message).
const showCatalog = computed(
  () => props.protection.featureCatalogEnabled && !props.protection.blockedReason
)

// Each package is deployed under its own demo domain. Both cards forward to
// their deployment so a prospect can choose a package straight from the gate;
// the card for the package this build ships is flagged with a "Diese Demo"
// badge but stays clickable (it simply reloads its own gate).
function cardHref(t) {
  return props.protection.demoUrls?.[t.id] || null
}

function cardTag(t) {
  return cardHref(t) ? 'a' : 'article'
}

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
    <div class="demo-gate__panel" :class="{ 'demo-gate__panel--wide': showCatalog }">
      <p class="demo-gate__eyebrow">Geschuetzte Demo</p>
      <h1 id="demo-gate-title">Ofenbau Mustermann</h1>

      <div v-if="showCatalog" class="demo-catalog">
        <p class="demo-catalog__lead">
          Diese Website ist in zwei Paketen verfügbar. Klicken Sie ein Paket an,
          um direkt zur passenden Demo zu wechseln — anschließend geben Sie Ihren
          Zugangscode ein.
        </p>
        <div class="demo-catalog__grid">
          <component
            :is="cardTag(t)"
            v-for="t in productTiers"
            :key="t.id"
            :href="cardHref(t)"
            class="demo-tier"
            :class="{
              'demo-tier--premium': t.highlight,
              'demo-tier--active': t.id === activeTier,
              'demo-tier--link': cardHref(t),
            }"
          >
            <header class="demo-tier__head">
              <div>
                <h2 class="demo-tier__name">{{ t.name }}</h2>
                <p class="demo-tier__tagline">{{ t.tagline }}</p>
              </div>
              <span
                v-if="t.id === activeTier"
                class="demo-tier__badge demo-tier__badge--active"
              >
                Diese Demo
              </span>
              <span v-else-if="t.highlight" class="demo-tier__badge">Empfohlen</span>
            </header>
            <p class="demo-tier__summary">{{ t.summary }}</p>
            <p v-if="t.includesBasis" class="demo-tier__includes">Alles aus Basis +</p>
            <ul class="demo-tier__features">
              <li v-for="feature in t.features" :key="feature.label">
                <AppIcon :name="feature.icon" class="demo-tier__icon" />
                <span>{{ feature.label }}</span>
              </li>
            </ul>
            <span class="demo-tier__cta">
              {{ t.id === activeTier ? 'Diese Demo öffnen' : `${t.name}-Demo ansehen` }}
              <AppIcon name="arrow" class="demo-tier__cta-icon" />
            </span>
          </component>
        </div>
      </div>

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
  display: flex;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 1.25rem;
  background:
    linear-gradient(rgba(252, 248, 240, 0.92), rgba(252, 248, 240, 0.92)),
    url('/images/hero.webp') center / cover;
}

.demo-gate__panel {
  width: min(100%, 28rem);
  /* margin auto centers the panel when it fits the viewport and keeps the top
     edge reachable (scrollable) when it is taller, unlike place-items: center. */
  margin: auto;
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

.demo-gate__panel--wide {
  width: min(100%, 64rem);
}

.demo-catalog {
  margin-top: 1.5rem;
}

.demo-catalog__lead {
  margin: 0 0 1rem;
  color: var(--color-content-muted);
  line-height: 1.55;
}

.demo-catalog__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
}

.demo-tier {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(44, 36, 28, 0.16);
  border-radius: 10px;
  padding: 1.15rem 1.25rem;
  background: #fffaf2;
  color: rgb(var(--color-content));
  text-decoration: none;
}

.demo-tier--link {
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.demo-tier--link:hover {
  transform: translateY(-2px);
  border-color: rgba(227, 82, 5, 0.5);
  box-shadow: 0 0.9rem 2rem rgba(44, 36, 28, 0.16);
}

.demo-tier--link:focus-visible {
  outline: 3px solid rgba(227, 82, 5, 0.32);
  outline-offset: 2px;
}

.demo-tier--premium {
  border-color: rgba(227, 82, 5, 0.4);
  background: rgba(255, 247, 237, 0.9);
  box-shadow: 0 0.6rem 1.6rem rgba(227, 82, 5, 0.12);
}

.demo-tier--active {
  outline: 2px solid rgb(var(--color-brand-600));
  outline-offset: 2px;
}

.demo-tier__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.demo-tier__name {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-size: 1.5rem;
  line-height: 1.1;
  color: rgb(var(--color-content));
}

.demo-tier__tagline {
  margin: 0.15rem 0 0;
  color: rgb(var(--color-brand-600));
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.demo-tier__badge {
  flex-shrink: 0;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  background: rgba(44, 36, 28, 0.08);
  color: rgb(var(--color-content));
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
}

.demo-tier__badge--active {
  background: rgb(var(--color-brand-600));
  color: #fffaf2;
}

.demo-tier__summary {
  margin: 0.85rem 0 0;
  color: var(--color-content-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.demo-tier__includes {
  margin: 0.85rem 0 0;
  color: rgb(var(--color-brand-700));
  font-weight: 700;
  font-size: 0.82rem;
}

.demo-tier__features {
  margin: 0.85rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
}

.demo-tier__features li {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.86rem;
  line-height: 1.4;
  color: rgb(var(--color-content));
}

.demo-tier__icon {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.1rem;
  color: rgb(var(--color-brand-600));
}

.demo-tier__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(44, 36, 28, 0.1);
  color: rgb(var(--color-brand-700));
  font-weight: 700;
  font-size: 0.86rem;
}

.demo-tier--link:hover .demo-tier__cta-icon {
  transform: translateX(3px);
}

.demo-tier__cta-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.15s ease;
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

  .demo-catalog__grid {
    grid-template-columns: 1fr;
  }
}
</style>

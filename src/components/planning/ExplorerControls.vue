<script setup>
import AppIcon from '../AppIcon.vue'
import BaseButton from '../BaseButton.vue'
import BaseImage from '../BaseImage.vue'
import { useExplorerContext } from '@/composables/usePlanningExplorer'

/** Right-hand aside: example picker, view/stage switches, decisions, CTAs. */
const {
  visibleExamples,
  activeIndex,
  selectExample,
  current,
  currentViews,
  activeViewIndex,
  selectView,
  rotation,
  isRotateMode,
  arcLabel,
  enterRotateMode,
  currentXray,
  isXrayMode,
  xrayLabel,
  toggleXrayMode,
  currentModel,
  isModelMode,
  toggleModelMode,
  activeDecisionOptions,
  activeDecisionKey,
  activeDecision,
  variantFor,
  isChoiceActive,
  selectChoice,
  currentVariants,
  activeChoices,
  resetVariants,
  sampleRequestQuery,
} = useExplorerContext()

function clearChoices() {
  resetVariants()
  // Back to the example's default stage.
  if (rotation.hasFrames.value) enterRotateMode()
  else selectView(activeViewIndex.value)
}
</script>

<template>
  <aside class="bg-ink-950 p-5">
    <div class="flex items-center gap-2 text-sm font-semibold text-white/80">
      <AppIcon name="rotate" class="h-4 w-4 text-brand-400" />
      Perspektiven
    </div>
    <div class="mt-4 grid gap-3">
      <button
        v-for="(example, index) in visibleExamples"
        :key="example.id"
        type="button"
        class="press-feedback grid grid-cols-[5.5rem_1fr] gap-3 rounded-xl p-2 text-left transition-colors"
        :class="
          activeIndex === index
            ? 'bg-white/10 ring-1 ring-brand-400/50'
            : 'bg-white/5 hover:bg-white/10'
        "
        @click="selectExample(index)"
      >
        <BaseImage
          :src="example.image"
          :motif="example.motif"
          :tone="example.tone"
          :alt="example.title"
          ratio="4/3"
          rounded="rounded-lg"
        />
        <span class="min-w-0 self-center">
          <span class="block text-xs uppercase tracking-label text-brand-300">
            {{ example.label }}
          </span>
          <span class="mt-1 block text-sm font-semibold text-white">{{ example.title }}</span>
        </span>
      </button>
    </div>

    <div
      v-if="currentViews.length > 1 || rotation.hasFrames.value || currentXray || currentModel"
      class="mt-5"
    >
      <p class="text-xs font-semibold uppercase tracking-label text-white/45">Ansichten</p>
      <button
        v-if="rotation.hasFrames.value"
        type="button"
        class="press-feedback mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
        :class="
          isRotateMode
            ? 'bg-brand-500 text-white'
            : 'bg-white/8 text-white/65 hover:bg-white/14 hover:text-white'
        "
        :aria-pressed="isRotateMode"
        @click="enterRotateMode"
      >
        <AppIcon name="rotate" class="h-4 w-4" />
        {{ arcLabel }}
      </button>
      <button
        v-if="currentModel"
        type="button"
        class="press-feedback mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
        :class="
          isModelMode
            ? 'bg-brand-500 text-white'
            : 'bg-white/8 text-white/65 hover:bg-white/14 hover:text-white'
        "
        :aria-pressed="isModelMode"
        @click="toggleModelMode"
      >
        <AppIcon name="cube" class="h-4 w-4" />
        {{ currentModel.label || '3D-Modell' }}
      </button>
      <button
        v-if="currentXray"
        type="button"
        class="press-feedback mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
        :class="
          isXrayMode
            ? 'bg-brand-500 text-white'
            : 'bg-white/8 text-white/65 hover:bg-white/14 hover:text-white'
        "
        :aria-pressed="isXrayMode"
        @click="toggleXrayMode"
      >
        <AppIcon name="eye" class="h-4 w-4" />
        {{ xrayLabel }}
      </button>
      <div v-if="isXrayMode && currentXray?.layers?.length" class="mt-2 grid gap-2">
        <div
          v-for="layer in currentXray.layers"
          :key="layer.label"
          class="rounded-lg bg-white/5 p-2.5 ring-1 ring-white/10"
        >
          <p class="text-xs font-semibold text-brand-300">{{ layer.label }}</p>
          <p class="mt-0.5 text-xs leading-relaxed text-white/60">{{ layer.text }}</p>
        </div>
      </div>
      <div class="mt-2 grid grid-cols-3 gap-2">
        <button
          v-for="(view, index) in currentViews"
          :key="view.label"
          type="button"
          class="press-feedback overflow-hidden rounded-lg text-left transition-colors"
          :class="
            !isRotateMode && !isXrayMode && !isModelMode && activeViewIndex === index
              ? 'ring-2 ring-brand-400/70'
              : 'opacity-75 ring-1 ring-white/10 hover:opacity-100'
          "
          :aria-pressed="!isRotateMode && !isXrayMode && !isModelMode && activeViewIndex === index"
          @click="selectView(index)"
        >
          <BaseImage
            :src="view.image"
            :motif="current?.motif"
            :tone="current?.tone"
            :alt="view.label"
            ratio="16/10"
            rounded="rounded-none"
          />
          <span
            class="block px-2 py-1.5 text-xs font-semibold"
            :class="
              !isRotateMode && !isXrayMode && !isModelMode && activeViewIndex === index
                ? 'text-white'
                : 'text-white/65'
            "
          >
            {{ view.label }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="activeDecisionOptions.length" class="mt-5 border-t border-white/10 pt-5">
      <p class="text-xs font-semibold uppercase tracking-label text-white/45">
        Entscheidung simulieren
      </p>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <button
          v-for="option in activeDecisionOptions"
          :key="option.key"
          type="button"
          class="press-feedback rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors"
          :class="
            activeDecisionKey === option.key
              ? 'bg-brand-500 text-white'
              : 'bg-white/8 text-white/65 hover:bg-white/14 hover:text-white'
          "
          :aria-pressed="activeDecisionKey === option.key"
          @click="activeDecisionKey = option.key"
        >
          {{ option.label }}
        </button>
      </div>
      <div v-if="activeDecision" class="mt-3 flex flex-wrap gap-2">
        <template v-for="choice in activeDecision.choices" :key="choice">
          <button
            v-if="variantFor(activeDecision.key, choice)"
            type="button"
            class="press-feedback rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            :class="
              isChoiceActive(activeDecision.key, choice)
                ? 'bg-brand-500 text-white'
                : 'bg-white/8 text-white/70 hover:bg-white/16 hover:text-white'
            "
            :aria-pressed="isChoiceActive(activeDecision.key, choice)"
            @click="selectChoice(activeDecision, choice)"
          >
            {{ choice }}
          </button>
          <span v-else class="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70">
            {{ choice }}
          </span>
        </template>
      </div>
      <p v-if="currentVariants && !activeChoices.length" class="mt-2 text-xs text-white/45">
        Variante antippen, um sie in der Bühne zu sehen.
      </p>
      <div
        v-if="activeChoices.length"
        class="mt-3 flex flex-wrap items-center gap-2"
        aria-label="Aktive Auswahl"
      >
        <span
          v-for="item in activeChoices"
          :key="item.key"
          class="rounded-full bg-brand-500/20 px-2.5 py-1 text-xs font-semibold text-brand-200 ring-1 ring-brand-400/40"
        >
          {{ item.label }}: {{ item.choice }}
        </span>
        <button
          type="button"
          class="press-feedback rounded-full px-2.5 py-1 text-xs font-semibold text-white/65 underline-offset-2 hover:text-white hover:underline"
          @click="clearChoices"
        >
          Zurücksetzen
        </button>
      </div>
      <BaseButton
        v-if="sampleRequestQuery"
        :to="{ name: 'contact', query: sampleRequestQuery }"
        variant="light"
        size="sm"
        class="mt-3 w-full"
      >
        <AppIcon name="swatch" class="h-4 w-4" />
        Showroom-Muster anfragen
      </BaseButton>
    </div>

    <div v-if="current" class="mt-5 flex flex-wrap gap-2">
      <span
        v-for="spec in current.specs"
        :key="spec"
        class="rounded-full bg-white/8 px-3 py-1 text-xs text-white/65"
      >
        {{ spec }}
      </span>
    </div>

    <BaseButton
      :to="{ name: 'contact', query: { topic: '3d-planung', source: '3d-planung' } }"
      size="lg"
      class="mt-6 w-full"
    >
      3D-Plan anfragen
      <AppIcon name="arrow" class="h-4 w-4" />
    </BaseButton>
  </aside>
</template>

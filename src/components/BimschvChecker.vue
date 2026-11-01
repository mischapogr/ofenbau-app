<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'

const step = ref(1)
const stoveCategory = ref('') // 'standard', 'handcrafted', 'historic', 'other'

// Specific options
const year = ref('') // '1974', '1980', '1990', '2000', '2012', '2016'
const hasManufacturerProof = ref(null) // null, 'yes', 'no'
const hasRetrofit = ref(null) // null, 'yes', 'no' (for handcrafted tiled stoves)
const otherType = ref('') // 'open', 'cooker', 'sole'

const isAffected = computed(() => {
  if (stoveCategory.value === 'historic') return 'exempt'

  if (stoveCategory.value === 'other') {
    if (otherType.value === 'open') return 'restricted'
    if (otherType.value === 'cooker' || otherType.value === 'sole') return 'exempt'
    return null
  }

  if (stoveCategory.value === 'handcrafted') {
    if (hasRetrofit.value === null) return null
    return hasRetrofit.value === 'yes' ? 'compliant' : 'action_required'
  }

  // Standard Kaminofen
  if (!year.value) return null
  const y = parseInt(year.value)

  if (y >= 2015) {
    return 'compliant'
  }
  if (y >= 2010 && y < 2015) {
    return hasManufacturerProof.value === 'yes' ? 'compliant' : 'verify'
  }

  // pre-2010 standard stove: expired unless they have manufacturer proof for Stufe 2
  return hasManufacturerProof.value === 'yes' ? 'compliant' : 'expired'
})

const resultDetails = computed(() => {
  switch (isAffected.value) {
    case 'compliant':
      return {
        title: 'Anlage gesetzeskonform',
        statusText: 'Zulässig',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badgeColor: 'text-emerald-800 bg-emerald-500/10 border-emerald-500/20',
        desc: 'Ihr Ofen erfüllt die aktuellen Grenzwerte der 1. BImSchV (Stufe 2). Es besteht vorerst kein gesetzlicher Handlungsbedarf.',
        action: 'Regelmäßige Ofenwartung vereinbaren',
      }
    case 'exempt':
      return {
        title: 'Gesetzlich befreit',
        statusText: 'Befreit',
        color: 'text-sky-700 bg-sky-50 border-sky-200',
        badgeColor: 'text-sky-800 bg-sky-500/10 border-sky-500/20',
        desc: 'Ihr Ofen fällt unter eine gesetzliche Ausnahmeregelung (z.B. historischer Ofen vor 1950, Backofen/Küchenherd ≤ 15 kW oder einzige Heizquelle). Der Betrieb ist unbegrenzt zulässig.',
        action: 'Bestätigung & Wartung anfragen',
      }
    case 'restricted':
      return {
        title: 'Bedingt zulässig',
        statusText: 'Eingeschränkt',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeColor: 'text-amber-800 bg-amber-500/10 border-amber-500/20',
        desc: 'Für offene Kamine gelten keine Emissionsgrenzen, aber ein Nutzungsverbot für den regelmäßigen Betrieb. Der Ofen darf nur gelegentlich (max. 8 Tage pro Monat für je 5 Stunden) betrieben werden.',
        action: 'Beratung zu Umrüstung anfordern',
      }
    case 'verify':
      return {
        title: 'Nachweis erforderlich',
        statusText: 'Prüfung nötig',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeColor: 'text-amber-800 bg-amber-500/10 border-amber-500/20',
        desc: 'Feuerstätten mit Baujahr 2010 bis 2014 müssen nachweisen, dass sie Stufe 2 einhalten. Liegt keine Bescheinigung vor, muss der Schornsteinfeger eine Vor-Ort-Messung vornehmen.',
        action: 'Messung & Ofen-Check anfragen',
      }
    case 'action_required':
      return {
        title: 'Nachrüstung nötig!',
        statusText: 'Handlungsbedarf',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeColor: 'text-rose-800 bg-rose-500/10 border-rose-500/20',
        desc: 'Handwerklich gesetzte Kachelöfen/Grundöfen unterliegen speziellen Fristen (Ablauf war der 31.12.2024). Sie müssen entweder per Messung geprüft oder mit einem Partikelabscheider (Filter) nachgerüstet werden.',
        action: 'Partikelfilter-Nachrüstung anfragen',
      }
    case 'expired':
      return {
        title: 'Betriebsverbot! (Frist abgelaufen)',
        statusText: 'Stilllegung droht',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeColor: 'text-rose-800 bg-rose-500/10 border-rose-500/20',
        desc: 'Die gesetzliche Übergangsfrist für Ihren Kaminofen lief am 31.12.2024 ab. Der Weiterbetrieb ohne Stufe-2-Bescheinigung ist illegal. Sie sollten den Ofen austauschen, nachrüsten oder stilllegen.',
        action: 'Beratung zu Austausch/Sanierung',
      }
    default:
      return null
  }
})

// Projection calculations for stove drawing
const cx_bim = 90
const cy_bim = 120

function projectBim(X, Y, Z) {
  return {
    x: cx_bim + Z * 0.866 - X * 0.866,
    y: cy_bim + Z * 0.5 + X * 0.5 - Y,
  }
}

const stovePts = computed(() => {
  const isKachelofen = stoveCategory.value === 'handcrafted'
  const s_w = isKachelofen ? 26 : 22
  const s_d = isKachelofen ? 26 : 22
  const s_h = isKachelofen ? 60 : 48

  return {
    p000: projectBim(0, 0, 0),
    p100: projectBim(s_w, 0, 0),
    p001: projectBim(0, 0, s_d),
    p101: projectBim(s_w, 0, s_d),
    p010: projectBim(0, s_h, 0),
    p110: projectBim(s_w, s_h, 0),
    p011: projectBim(0, s_h, s_d),
    p111: projectBim(s_w, s_h, s_d),
  }
})

const firePoly = computed(() => {
  const isKachelofen = stoveCategory.value === 'handcrafted'
  const s_w = isKachelofen ? 26 : 22
  const s_d = isKachelofen ? 26 : 22
  const s_h = isKachelofen ? 60 : 48

  const w_left = s_w * 0.25
  const w_right = s_w * 0.75
  const h_bottom = s_h * 0.2
  const h_top = s_h * 0.5

  const p1 = projectBim(w_left, h_bottom, s_d)
  const p2 = projectBim(w_right, h_bottom, s_d)
  const p3 = projectBim(w_right, h_top, s_d)
  const p4 = projectBim(w_left, h_top, s_d)

  return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
})

const fluePipeTopY = 45
const fluePipePts = computed(() => {
  const isKachelofen = stoveCategory.value === 'handcrafted'
  const s_w = isKachelofen ? 26 : 22
  const s_d = isKachelofen ? 26 : 22
  const s_h = isKachelofen ? 60 : 48

  const p_start = projectBim(s_w / 2, s_h, s_d / 2)
  const p_up = { x: p_start.x, y: fluePipeTopY }
  const p_wall = { x: 135, y: fluePipeTopY }

  return {
    x1: p_start.x,
    y1: p_start.y,
    x2: p_up.x,
    y2: p_up.y,
    x3: p_wall.x,
    y3: p_wall.y,
  }
})

const contactMessage = computed(() => {
  let msg = `Hallo Ofenbau-Team,

ich habe meinen Ofen mit dem BImSchV-Checker überprüft und wünsche eine Beratung zur Gesetzeskonformität bzw. zu Modernisierungsmöglichkeiten.

Angaben zum Ofen:
`
  const catLabels = {
    standard: 'Heizkamin / Kaminofen (industriell)',
    handcrafted: 'Handwerklich gesetzter Kachelofen / Grundofen',
    historic: 'Historischer Ofen (vor 1950 errichtet)',
    other: 'Sonstige Feuerstätte (Ausnahmebereich)',
  }

  msg += `- Ofentyp: ${catLabels[stoveCategory.value]}\n`

  if (stoveCategory.value === 'standard') {
    const yearLabels = {
      1974: 'Vor 1975',
      1980: '1975 – 1984',
      1990: '1985 – 1994',
      2000: '1995 – März 2010',
      2012: 'März 2010 – 2014',
      2016: 'Ab 2015',
    }
    msg +=
      `- Baujahr: ${yearLabels[year.value] || year.value}\n` +
      `- Stufe-2-Zertifikat vorhanden: ${hasManufacturerProof.value === 'yes' ? 'Ja' : 'Nein'}\n`
  } else if (stoveCategory.value === 'handcrafted') {
    msg += `- Partikelfilter nachgerüstet / Messung erfolgt: ${hasRetrofit.value === 'yes' ? 'Ja' : 'Nein'}\n`
  } else if (stoveCategory.value === 'other') {
    const otherLabels = {
      open: 'Offener Kamin (gelegentliche Nutzung)',
      cooker: 'Herd / Backofen ≤ 15 kW',
      sole: 'Einzige Heizquelle der Wohnung',
    }
    msg += `- Art der Anlage: ${otherLabels[otherType.value] || otherType.value}\n`
  }

  msg +=
    `- Testergebnis: ${resultDetails.value?.title}\n\n` +
    `Ich freue mich auf Ihre Rückmeldung zur Besprechung des weiteren Vorgehens!\n\n` +
    `Viele Grüße`

  return msg
})

function reset() {
  stoveCategory.value = ''
  year.value = ''
  hasManufacturerProof.value = null
  hasRetrofit.value = null
  otherType.value = ''
  step.value = 1
}

function selectCategory(cat) {
  stoveCategory.value = cat
  if (cat === 'historic') {
    step.value = 4 // Direct to result
  } else {
    step.value = 2
  }
}

function handleStep2Next() {
  if (stoveCategory.value === 'standard') {
    const y = parseInt(year.value)
    if (y >= 2015) {
      step.value = 4 // Compliant natively
    } else {
      step.value = 3 // Check Stufe 2 proof
    }
  } else {
    step.value = 4 // Handcrafted / Other go to result
  }
}
</script>

<template>
  <div class="rounded-2xl border border-content-muted/10 bg-surface p-6 sm:p-8 shadow-card">
    <div class="flex items-center justify-between border-b border-content-muted/10 pb-5">
      <div class="flex items-center gap-3">
        <span
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
        >
          <AppIcon name="chimney" class="h-5 w-5" />
        </span>
        <div>
          <h3 class="font-display text-2xl font-semibold text-ink-900">BImSchV Ofen-Check</h3>
          <p class="mt-0.5 text-xs text-content-muted">
            Gesetzliche Abgasgrenzwerte &amp; Betriebsverbote prüfen
          </p>
        </div>
      </div>

      <span
        v-if="stoveCategory"
        class="rounded-full bg-brand-50 border border-brand-200/50 px-2.5 py-1 text-xs font-bold text-brand-700"
      >
        Schritt {{ step }} / 4
      </span>
    </div>

    <!-- Main Content Split Grid -->
    <div class="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <!-- Left Column: Questionnaire -->
      <div>
        <!-- Step 1: Category Selection -->
        <div v-if="step === 1">
          <label class="block text-sm font-semibold text-ink-900 mb-4"
            >Um was für eine Feuerstätte handelt es sich?</label
          >

          <div class="grid gap-4 sm:grid-cols-2">
            <button
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="selectCategory('standard')"
            >
              <span
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4"
              >
                <AppIcon name="flame" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Kaminofen &amp; Heizkamin</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed"
                >Industriell hergestellte Ofenbausätze oder freistehende Schwedenöfen.</span
              >
            </button>

            <button
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="selectCategory('handcrafted')"
            >
              <span
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4"
              >
                <AppIcon name="cube" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Kachelofen &amp; Grundofen</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed"
                >Vom Ofenbauer handwerklicher, vor Ort gemauerter Kachel- oder Speicherofen.</span
              >
            </button>

            <button
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="selectCategory('historic')"
            >
              <span
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4"
              >
                <AppIcon name="swatch" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Historischer Ofen</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed"
                >Vor dem 1. Januar 1950 errichtete Feuerstätte, unverändert an Ort und Stelle.</span
              >
            </button>

            <button
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="selectCategory('other')"
            >
              <span
                class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4"
              >
                <AppIcon name="tools" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Sonstige Ausnahmen</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed"
                >Offene Kamine, Kochherde, Backöfen oder einzige Wärmequellen einer Wohnung.</span
              >
            </button>
          </div>
        </div>

        <!-- Step 2: Specific branch questions -->
        <div v-if="step === 2" class="space-y-6">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600 mb-1">
            Anlagendetails
          </h4>

          <!-- Standard stove: Baujahr question -->
          <div v-if="stoveCategory === 'standard'" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-ink-900" for="stove-year"
                >Wann wurde Ihr Kaminofen bzw. Heizeinsatz gebaut?</label
              >
              <select
                id="stove-year"
                v-model="year"
                class="mt-2 w-full rounded-lg border border-content-muted/20 bg-surface-muted px-4 py-2.5 text-xs text-content focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="" disabled>Bitte Baujahr wählen...</option>
                <option value="1974">Vor 1975 (Uralt-Anlage)</option>
                <option value="1980">1975 – 1984</option>
                <option value="1990">1985 – 1994</option>
                <option value="2000">1995 – 21. März 2010</option>
                <option value="2012">22. März 2010 – 31. Dezember 2014 (Stufe 1)</option>
                <option value="2016">Ab 1. Januar 2015 (Stufe 2)</option>
              </select>
            </div>

            <div class="flex gap-4 pt-4 border-t border-content-muted/10">
              <BaseButton variant="ghost" class="flex-1" @click="step = 1">Zurück</BaseButton>
              <BaseButton :disabled="!year" class="flex-1" @click="handleStep2Next"
                >Weiter</BaseButton
              >
            </div>
          </div>

          <!-- Handcrafted stove: filter question -->
          <div v-if="stoveCategory === 'handcrafted'" class="space-y-4">
            <p class="text-xs font-bold text-ink-900 leading-tight">
              Handwerklich vor Ort gesetzte Kachelöfen/Grundöfen unterliegen einer Nachrüstpflicht
              für Feinstaubfilter oder einer Grenzwertprüfung.
            </p>
            <label class="block text-xs font-semibold text-content-muted mb-2"
              >Wurde bereits ein Partikelfilter nachgerüstet oder eine Messung durchgeführt?</label
            >

            <div class="flex flex-col gap-2.5">
              <label
                class="flex items-center gap-3 rounded-lg border border-content-muted/20 p-3 hover:bg-surface-muted cursor-pointer"
              >
                <input
                  v-model="hasRetrofit"
                  value="yes"
                  type="radio"
                  name="retrofit"
                  class="text-brand-500 focus:ring-brand-500"
                />
                <span class="text-xs font-medium"
                  >Ja, Feinstaubabscheider ist aktiv oder Messung war erfolgreich</span
                >
              </label>
              <label
                class="flex items-center gap-3 rounded-lg border border-content-muted/20 p-3 hover:bg-surface-muted cursor-pointer"
              >
                <input
                  v-model="hasRetrofit"
                  value="no"
                  type="radio"
                  name="retrofit"
                  class="text-brand-500 focus:ring-brand-500"
                />
                <span class="text-xs font-medium">Nein, bisher keine Nachrüstung oder Messung</span>
              </label>
            </div>

            <div class="flex gap-4 pt-4 border-t border-content-muted/10">
              <BaseButton variant="ghost" class="flex-1" @click="step = 1">Zurück</BaseButton>
              <BaseButton :disabled="hasRetrofit === null" class="flex-1" @click="handleStep2Next"
                >Auswerten</BaseButton
              >
            </div>
          </div>

          <!-- Other exemptions branch -->
          <div v-if="stoveCategory === 'other'" class="space-y-4">
            <label class="block text-xs font-bold text-ink-900 mb-2"
              >Welche besondere Bauform oder Nutzung liegt vor?</label
            >

            <div class="flex flex-col gap-2.5">
              <label
                class="flex items-start gap-3 rounded-lg border border-content-muted/20 p-3 hover:bg-surface-muted cursor-pointer"
              >
                <input
                  v-model="otherType"
                  value="open"
                  type="radio"
                  name="othertype"
                  class="mt-0.5 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span class="block text-xs font-bold">Offener Kamin</span>
                  <span class="block text-[10px] text-content-muted mt-0.5"
                    >Keine Ofentür vorhanden bzw. Betrieb nur bei offener Tür zulässig.</span
                  >
                </div>
              </label>

              <label
                class="flex items-start gap-3 rounded-lg border border-content-muted/20 p-3 hover:bg-surface-muted cursor-pointer"
              >
                <input
                  v-model="otherType"
                  value="cooker"
                  type="radio"
                  name="othertype"
                  class="mt-0.5 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span class="block text-xs font-bold">Herd / Backofen (nicht gewerblich)</span>
                  <span class="block text-[10px] text-content-muted mt-0.5"
                    >Ausschließlich zum Kochen/Backen verwendet, Nennwärmeleistung ≤ 15 kW.</span
                  >
                </div>
              </label>

              <label
                class="flex items-start gap-3 rounded-lg border border-content-muted/20 p-3 hover:bg-surface-muted cursor-pointer"
              >
                <input
                  v-model="otherType"
                  value="sole"
                  type="radio"
                  name="othertype"
                  class="mt-0.5 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <span class="block text-xs font-bold">Einzige Heizquelle der Wohnung</span>
                  <span class="block text-[10px] text-content-muted mt-0.5"
                    >Härtefallregelung: Es gibt keine andere Heizung (Zentralheizung etc.) im
                    Haus.</span
                  >
                </div>
              </label>
            </div>

            <div class="flex gap-4 pt-4 border-t border-content-muted/10">
              <BaseButton variant="ghost" class="flex-1" @click="step = 1">Zurück</BaseButton>
              <BaseButton :disabled="!otherType" class="flex-1" @click="handleStep2Next"
                >Auswerten</BaseButton
              >
            </div>
          </div>
        </div>

        <!-- Step 3: Certificate / measurement proof (Standard stove pre-2015) -->
        <div v-if="step === 3" class="space-y-4">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600 mb-1">
            Grenzwerte-Nachweis
          </h4>

          <p class="text-xs font-semibold text-ink-900 leading-relaxed">
            Liegt Ihnen eine schriftliche Herstellerbescheinigung oder ein positives Messprotokoll
            des Schornsteinfegers vor, das die Einhaltung der Grenzwerte der Stufe 2 nachweist?
          </p>

          <div class="flex flex-col gap-2.5">
            <label
              class="flex items-center gap-3 rounded-lg border border-content-muted/20 p-3 hover:bg-surface-muted cursor-pointer"
            >
              <input
                v-model="hasManufacturerProof"
                value="yes"
                type="radio"
                name="proof"
                class="text-brand-500 focus:ring-brand-500"
              />
              <span class="text-xs font-semibold">Ja, Bescheinigung/Nachweis ist vorhanden</span>
            </label>
            <label
              class="flex items-center gap-3 rounded-lg border border-content-muted/20 p-3 hover:bg-surface-muted cursor-pointer"
            >
              <input
                v-model="hasManufacturerProof"
                value="no"
                type="radio"
                name="proof"
                class="text-brand-500 focus:ring-brand-500"
              />
              <span class="text-xs font-semibold">Nein / Unbekannt</span>
            </label>
          </div>

          <div class="flex gap-4 pt-4 border-t border-content-muted/10">
            <BaseButton variant="ghost" class="flex-1" @click="step = 2">Zurück</BaseButton>
            <BaseButton :disabled="hasManufacturerProof === null" class="flex-1" @click="step = 4"
              >Auswerten</BaseButton
            >
          </div>
        </div>

        <!-- Step 4: Final Summary details -->
        <div v-if="step === 4" class="space-y-5">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600 mb-1">
            Auswertung beendet
          </h4>
          <p class="text-xs text-content leading-relaxed">
            Die gesetzliche Bewertung Ihrer Feuerstätte ist abgeschlossen. Auf der rechten Seite
            sehen Sie Ihr rechtliches Ergebnis sowie das schematische Prüfmodell.
          </p>

          <div
            class="rounded-xl bg-surface-muted border border-content-muted/10 p-4 space-y-2 text-xs text-content"
          >
            <h5 class="font-bold text-ink-900">Eingaben &amp; Kontext:</h5>
            <div class="flex justify-between border-b border-content-muted/5 pb-1">
              <span class="text-content-muted">Kategorie:</span>
              <span class="font-semibold">{{
                stoveCategory === 'handcrafted'
                  ? 'Grundofen'
                  : stoveCategory === 'historic'
                    ? 'Historisch'
                    : stoveCategory === 'other'
                      ? 'Ausnahme'
                      : 'Kaminofen'
              }}</span>
            </div>
            <div
              v-if="stoveCategory === 'standard'"
              class="flex justify-between border-b border-content-muted/5 pb-1"
            >
              <span class="text-content-muted">Bauzeitraum:</span>
              <span class="font-semibold">{{
                year === '2016' ? 'Ab 2015' : year === '2012' ? '2010 - 2014' : 'Vor 2010'
              }}</span>
            </div>
            <div
              v-if="stoveCategory === 'handcrafted'"
              class="flex justify-between border-b border-content-muted/5 pb-1"
            >
              <span class="text-content-muted">Partikelfilter:</span>
              <span class="font-semibold">{{
                hasRetrofit === 'yes' ? 'Ja (Nachgerüstet)' : 'Nein'
              }}</span>
            </div>
            <div
              v-if="stoveCategory === 'other'"
              class="flex justify-between border-b border-content-muted/5 pb-1"
            >
              <span class="text-content-muted">Ausnahme-Typ:</span>
              <span class="font-semibold">{{
                otherType === 'open'
                  ? 'Offener Kamin'
                  : otherType === 'sole'
                    ? 'Einzige Heizung'
                    : 'Küchenherd'
              }}</span>
            </div>
          </div>

          <div class="flex gap-4 pt-4 border-t border-content-muted/10">
            <BaseButton variant="ghost" class="flex-1" @click="reset">Erneut prüfen</BaseButton>
          </div>
        </div>
      </div>

      <!-- Right Column: Real-time Status Dashboard -->
      <div
        class="flex flex-col justify-between rounded-xl bg-surface-muted p-5 border border-brand-500/10 shadow-sm self-start lg:sticky lg:top-24"
      >
        <div>
          <!-- Large Status Banner -->
          <div class="text-center border-b border-content-muted/10 pb-4">
            <h4 class="text-[10px] uppercase tracking-wider font-bold text-content-muted">
              Rechtlicher Betriebsstatus
            </h4>

            <div v-if="resultDetails" class="mt-2.5 flex items-center justify-center gap-2">
              <span
                class="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm"
                :class="resultDetails.badgeColor"
              >
                {{ resultDetails.statusText }}
              </span>
            </div>
            <p v-else class="mt-2.5 font-display text-sm font-bold text-content-muted italic">
              Warten auf Angaben...
            </p>
          </div>

          <!-- Dynamic SVG room/stove schematic -->
          <div class="mt-5 space-y-2">
            <span class="text-[11px] font-bold text-content-muted block"
              >Schematisches Prüfmodell</span
            >

            <svg
              viewBox="0 0 200 160"
              class="w-full h-auto rounded-lg border border-content-muted/10 bg-surface-sand/20"
            >
              <defs>
                <pattern id="grid-check" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path
                    d="M 16 0 L 0 0 0 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="0.5"
                    class="text-brand-300/15"
                  />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid-check)" />

              <!-- Room blueprint background draft -->
              <g stroke="currentColor" stroke-width="0.8" class="text-brand-300/35" fill="none">
                <line x1="10" y1="145" x2="190" y2="145" stroke-width="1" />
                <line x1="120" y1="145" x2="120" y2="20" />
                <line x1="20" y1="110" x2="120" y2="110" stroke-dasharray="2 3" />
              </g>

              <!-- Exhaust Flue Pipe -->
              <g
                v-if="stoveCategory"
                stroke="currentColor"
                stroke-width="1.2"
                class="text-ink-500"
                fill="none"
              >
                <path
                  :d="`M ${fluePipePts.x1},${fluePipePts.y1} L ${fluePipePts.x2},${fluePipePts.y2} L ${fluePipePts.x3},${fluePipePts.y3}`"
                />
              </g>

              <!-- Particulate separator filter box on the flue -->
              <g v-if="stoveCategory">
                <rect
                  x="85"
                  y="52"
                  width="10"
                  height="14"
                  :fill="hasRetrofit === 'yes' ? '#059669' : 'rgba(74, 66, 62, 0.25)'"
                  stroke="currentColor"
                  class="text-ink-900"
                  stroke-width="0.8"
                />
                <text
                  v-if="hasRetrofit === 'yes'"
                  x="80"
                  y="62"
                  font-size="7"
                  text-anchor="end"
                  class="font-bold fill-emerald-700"
                >
                  Filter
                </text>
                <text
                  v-else
                  x="80"
                  y="62"
                  font-size="7"
                  text-anchor="end"
                  class="font-semibold fill-content-muted"
                >
                  Filter?
                </text>
              </g>

              <!-- 3D Stove Wedge/Box outline -->
              <g v-if="stoveCategory">
                <!-- Stove Left-Front Face -->
                <polygon
                  :points="`${stovePts.p001.x},${stovePts.p001.y} ${stovePts.p101.x},${stovePts.p101.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p011.x},${stovePts.p011.y}`"
                  fill="#292320"
                  :stroke="
                    isAffected === 'expired' || isAffected === 'action_required'
                      ? '#dc2626'
                      : '#1c1816'
                  "
                  stroke-width="1.2"
                />
                <!-- Stove Right-Front Face -->
                <polygon
                  :points="`${stovePts.p100.x},${stovePts.p100.y} ${stovePts.p101.x},${stovePts.p101.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p110.x},${stovePts.p110.y}`"
                  fill="#1c1816"
                  :stroke="
                    isAffected === 'expired' || isAffected === 'action_required'
                      ? '#dc2626'
                      : '#1c1816'
                  "
                  stroke-width="1.2"
                />
                <!-- Stove Top Face -->
                <polygon
                  :points="`${stovePts.p010.x},${stovePts.p010.y} ${stovePts.p110.x},${stovePts.p110.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p011.x},${stovePts.p011.y}`"
                  fill="#4a423e"
                  :stroke="
                    isAffected === 'expired' || isAffected === 'action_required'
                      ? '#dc2626'
                      : '#292320'
                  "
                  stroke-width="1"
                />

                <!-- Glowing embers -->
                <polygon
                  :points="firePoly"
                  fill="rgb(227, 82, 5)"
                  stroke="rgba(255,255,255,0.2)"
                  stroke-width="0.8"
                  class="ember-glow"
                />
              </g>

              <!-- Default drawing if no category chosen -->
              <g
                v-else
                stroke="currentColor"
                stroke-width="0.8"
                class="text-brand-400/30"
                fill="none"
              >
                <rect x="50" y="70" width="40" height="55" rx="2" />
                <line x1="70" y1="70" x2="70" y2="40" />
                <line x1="70" y1="40" x2="110" y2="40" />
              </g>

              <!-- Status badge shield icon overlaid on SVG -->
              <g v-if="isAffected">
                <!-- Outer shield circle -->
                <circle
                  cx="155"
                  cy="35"
                  r="14"
                  :fill="
                    isAffected === 'compliant'
                      ? '#059669'
                      : isAffected === 'exempt'
                        ? '#2563eb'
                        : isAffected === 'verify' || isAffected === 'restricted'
                          ? '#d97706'
                          : '#dc2626'
                  "
                  stroke="white"
                  stroke-width="1.5"
                  style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))"
                />

                <!-- Shield icon paths -->
                <!-- Checkmark for Compliant -->
                <path
                  v-if="isAffected === 'compliant' || isAffected === 'exempt'"
                  d="M 149,35 L 153,39 L 161,31"
                  stroke="white"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />

                <!-- Exclamation warning mark for expired/verify/action -->
                <g v-else stroke="white" stroke-width="2" stroke-linecap="round" fill="none">
                  <line x1="155" y1="28" x2="155" y2="36" />
                  <circle cx="155" cy="42" r="0.5" fill="white" stroke-width="1.5" />
                </g>
              </g>
            </svg>
          </div>

          <!-- Explanation Details -->
          <div v-if="resultDetails" class="mt-5 border-t border-content-muted/10 pt-4 space-y-3">
            <h5 class="text-[11px] font-bold uppercase tracking-wider text-brand-600">
              Gesetzlicher Befund
            </h5>

            <div :class="['rounded-lg border p-3.5 text-xs leading-relaxed', resultDetails.color]">
              <h6 class="font-bold font-display text-sm">{{ resultDetails.title }}</h6>
              <p class="mt-1.5 text-[11px] leading-normal">{{ resultDetails.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Back & CTA buttons at the bottom of the sidebar -->
        <div v-if="resultDetails" class="mt-6 border-t border-content-muted/10 pt-4 space-y-3">
          <!-- Contact Form CTA -->
          <BaseButton
            :to="{
              name: 'contact',
              query: { topic: 'sanierung', note: contactMessage, source: 'bimschv' },
            }"
            block
            size="md"
          >
            {{ resultDetails.action }}
            <AppIcon name="arrow" class="h-4 w-4" />
          </BaseButton>

          <p class="text-[9px] text-center text-content-muted leading-relaxed">
            *Dies ist eine unverbindliche Orientierungshilfe zur 1. BImSchV. Rechtlich bindende
            Feststellungen über Zulässigkeit und Messintervalle trifft ausschließlich Ihr
            bevollmächtigter Sch Bezirks-Schornsteinfeger.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fireEmber {
  0%,
  100% {
    fill: rgb(227, 82, 5);
    filter: drop-shadow(0 0 1px rgb(227, 82, 5));
  }
  50% {
    fill: rgb(239, 68, 68);
    filter: drop-shadow(0 0 3px rgb(220, 38, 38));
  }
}
.ember-glow {
  animation: fireEmber 2s infinite ease-in-out;
}
</style>

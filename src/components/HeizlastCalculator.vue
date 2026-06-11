<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'

// State variables
const activeTab = ref('quick') // 'quick' | 'detail'
const area = ref(45)
const height = ref(2.5)
const insulation = ref('modernized') // 'passive', 'modern_new', 'modernized', 'old'

// Detail Mode parameters
const roomType = ref('living') // 'living', 'bedroom', 'bathroom', 'kitchen'
const roomLocation = ref('middle') // 'middle', 'ground', 'roof'
const exposedWalls = ref(2) // 1, 2, 3, 4
const windowType = ref('double') // 'triple', 'double', 'single'
const hasLargeWindows = ref(false)
const showCopied = ref(false)

// Options definition
const insulationOptions = [
  { 
    value: 'passive', 
    label: 'KfW-Effizienzhaus / Passivhaus', 
    desc: 'Hervorragende Dämmung, kontrollierte Lüftung', 
    factor: 20 
  },
  { 
    value: 'modern_new', 
    label: 'Moderner Neubau / EnEV-Standard', 
    desc: 'Gute Isolierung, energiesparende Bauweise', 
    factor: 30 
  },
  { 
    value: 'modernized', 
    label: 'Sanierter Altbau / Standard', 
    desc: 'Nachträgliche Dämmung, Doppelverglasung', 
    factor: 45 
  },
  { 
    value: 'old', 
    label: 'Ungedämmter Altbau', 
    desc: 'Kaum Dämmung, hohe Kältebrücken', 
    factor: 70 
  }
]

const roomTypeOptions = [
  { value: 'living', label: 'Wohnzimmer / Küche (~21°C)', factor: 1.0 },
  { value: 'bedroom', label: 'Schlafzimmer (~18°C)', factor: 0.85 },
  { value: 'bathroom', label: 'Badezimmer (~24°C)', factor: 1.15 },
  { value: 'kitchen', label: 'Flur / Nebenräume (~19°C)', factor: 0.90 }
]

const roomLocationOptions = [
  { value: 'middle', label: 'Zwischengeschoss (beheizt)', factor: 0.90 },
  { value: 'ground', label: 'Erdgeschoss (unbeheizter Keller/Boden)', factor: 1.05 },
  { value: 'roof', label: 'Dachgeschoss (unter dem Dach)', factor: 1.12 }
]

const exposedWallsOptions = [
  { value: '1', label: '1 Außenwand (z.B. Reihenhaus)', factor: 0.90 },
  { value: '2', label: '2 Außenwände (z.B. Eckzimmer)', factor: 1.00 },
  { value: '3', label: '3 Außenwände', factor: 1.08 },
  { value: '4', label: 'Freistehend (4 Außenwände)', factor: 1.18 }
]

const windowTypeOptions = [
  { value: 'triple', label: '3-fach Verglasung (Modern)', factor: 0.88 },
  { value: 'double', label: '2-fach Verglasung (Standard)', factor: 1.00 },
  { value: 'single', label: 'Einfachverglasung (Altbau)', factor: 1.25 }
]

const selectedInsulation = computed(() => 
  insulationOptions.find(o => o.value === insulation.value)
)

const heatingLoad = computed(() => {
  const volume = area.value * height.value
  let factor = selectedInsulation.value.factor

  if (activeTab.value === 'detail') {
    const typeFactor = roomTypeOptions.find(o => o.value === roomType.value)?.factor || 1.0
    const locFactor = roomLocationOptions.find(o => o.value === roomLocation.value)?.factor || 1.0
    const wallFactor = exposedWallsOptions.find(o => o.value === String(exposedWalls.value))?.factor || 1.0
    const winFactor = windowTypeOptions.find(o => o.value === windowType.value)?.factor || 1.0
    const largeWindowMultiplier = hasLargeWindows.value ? 1.12 : 1.00
    
    factor = factor * typeFactor * locFactor * wallFactor * winFactor * largeWindowMultiplier
  }

  const watts = volume * factor
  return parseFloat((watts / 1000).toFixed(1))
})

const stoveRecommendation = computed(() => {
  const kw = heatingLoad.value
  let recs = []

  if (kw < 4.0) {
    recs = [
      {
        name: 'Speicherofen / Kaminofen (klein)',
        rating: 5,
        status: 'Optimal',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
        desc: 'Durch den geringen Wärmebedarf überhitzt der Raum nicht. Ein Speicherofen gibt die Wärme verzögert und sanft über Stunden ab.'
      },
      {
        name: 'Klassischer Grundofen / Kachelofen',
        rating: 3,
        status: 'Bedingt geeignet',
        statusColor: 'text-amber-700 bg-amber-50 border-amber-200/50',
        desc: 'Möglich, sollte jedoch mit einer geringen Holzmenge befeuert werden, da er sonst zu viel Energie an den Raum abgibt.'
      },
      {
        name: 'Wasserführender Kamin/Ofen',
        rating: 1,
        status: 'Nicht empfohlen',
        statusColor: 'text-rose-700 bg-rose-50 border-rose-200/50',
        desc: 'Die komplexe Anbindung an die Zentralheizung rechnet sich wirtschaftlich bei dieser geringen Heizlast meist nicht.'
      }
    ]
  } else if (kw <= 8.0) {
    recs = [
      {
        name: 'Klassischer Grundofen / Kachel- & Kaminofen',
        rating: 5,
        status: 'Optimal',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
        desc: 'Perfekt dimensioniert. Ein handgesetzter Grundofen speichert die Wärme und gibt sie als behagliche Strahlungswärme ab.'
      },
      {
        name: 'Speicherofen / Kaminofen (mittlere Größe)',
        rating: 4,
        status: 'Gut geeignet',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
        desc: 'Sehr gut geeignet für schnelle Wärmeabgabe, idealerweise mit integrierten Speicherelementen für anhaltenden Komfort.'
      },
      {
        name: 'Wasserführender Kamin/Ofen',
        rating: 3,
        status: 'Möglich',
        statusColor: 'text-amber-700 bg-amber-50 border-amber-200/50',
        desc: 'Möglich zur aktiven Entlastung Ihrer Zentralheizung, besonders sinnvoll bei offenem Wohnkonzept zu Nachbarräumen.'
      }
    ]
  } else {
    recs = [
      {
        name: 'Großer Kachelofen / Heizkamin',
        rating: 5,
        status: 'Optimal',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
        desc: 'Exzellente Wahl für große Räume. Bietet genügend Reserven für kalte Tage und erzeugt langanhaltende Wärme über gemauerte Züge.'
      },
      {
        name: 'Wasserführender Kamin/Ofen',
        rating: 5,
        status: 'Optimal',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/50',
        desc: 'Hervorragend geeignet. Überschüssige Energie wird direkt in Ihren Pufferspeicher geleitet und wärmt das gesamte Haus.'
      },
      {
        name: 'Kompakter Kaminofen',
        rating: 1,
        status: 'Nicht empfohlen',
        statusColor: 'text-rose-700 bg-rose-50 border-rose-200/50',
        desc: 'Zu geringe Leistung. Der Ofen müsste permanent unter Volllast laufen, was zu hohem Verschleiß und unzureichende Wärme führt.'
      }
    ]
  }

  return {
    type: kw < 4.0 ? 'Speicherofen / Kaminofen (kleine Heizlast)' : kw <= 8.0 ? 'Grundofen / Kachel- & Kaminofen' : 'Kachelofen / Heizkamin mit Zusatzfunktionen',
    desc: kw < 4.0 ? 'Ein moderner Speicherofen oder Kaminofen mit geringer kW-Zahl ist ideal. Zu hohe Heizleistungen würden den Raum schnell überhitzen.' : kw <= 8.0 ? 'Ein klassischer Grundofen mit Speicherfunktion ist die beste Wahl. Er gibt langanhaltende Strahlungswärme über Stunden ab, ohne den Raum aufzuheizen.' : 'Hier empfiehlt sich ein maßgeschneiderter Kachelofen oder ein großer Heizkamin, eventuell mit wasserführendem Heizeinsatz zur Unterstützung Ihrer Zentralheizung.',
    recs: recs
  }
})

// Projection parameters for dynamic 3D room blueprint
const cx = 150
const cy = 135

const X_max = computed(() => 8 * Math.sqrt(area.value))
const Z_max = computed(() => 8 * Math.sqrt(area.value))
const Y_max = computed(() => height.value * 20)

function project(X, Y, Z) {
  return {
    x: cx + Z * 0.866 - X * 0.866,
    y: cy + Z * 0.5 + X * 0.5 - Y
  }
}

const pts = computed(() => {
  const x_m = X_max.value
  const y_m = Y_max.value
  const z_m = Z_max.value
  
  return {
    p000: project(0, 0, 0),
    p100: project(x_m, 0, 0),
    p001: project(0, 0, z_m),
    p101: project(x_m, 0, z_m),
    p010: project(0, y_m, 0),
    p110: project(x_m, y_m, 0),
    p011: project(0, y_m, z_m),
    p111: project(x_m, y_m, z_m)
  }
})

const floorGridLines = computed(() => {
  const lines = []
  const x_m = X_max.value
  const z_m = Z_max.value
  
  for (let i = 1; i < 4; i++) {
    const p_start = project(i * x_m / 4, 0, 0)
    const p_end = project(i * x_m / 4, 0, z_m)
    lines.push({ x1: p_start.x, y1: p_start.y, x2: p_end.x, y2: p_end.y })
    
    const p_start2 = project(0, 0, i * z_m / 4)
    const p_end2 = project(x_m, 0, i * z_m / 4)
    lines.push({ x1: p_start2.x, y1: p_start2.y, x2: p_end2.x, y2: p_end2.y })
  }
  return lines
})

const isLeftExposed = computed(() => activeTab.value === 'detail' && exposedWalls.value >= 1)
const isRightExposed = computed(() => activeTab.value === 'detail' && exposedWalls.value >= 2)

const windowPoly = computed(() => {
  const x_m = X_max.value
  const y_m = Y_max.value
  const w_w = x_m * (hasLargeWindows.value ? 0.7 : 0.4)
  const w_h = y_m * (hasLargeWindows.value ? 0.72 : 0.45)
  const x_c = x_m / 2
  const y_c = y_m / 2
  
  const p1 = project(x_c - w_w/2, y_c - w_h/2, 0)
  const p2 = project(x_c + w_w/2, y_c - w_h/2, 0)
  const p3 = project(x_c + w_w/2, y_c + w_h/2, 0)
  const p4 = project(x_c - w_w/2, y_c + w_h/2, 0)
  
  return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
})

const windowLines = computed(() => {
  const x_m = X_max.value
  const y_m = Y_max.value
  const w_w = x_m * (hasLargeWindows.value ? 0.7 : 0.4)
  const w_h = y_m * (hasLargeWindows.value ? 0.72 : 0.45)
  const x_c = x_m / 2
  const y_c = y_m / 2

  const p_left = project(x_c - w_w / 2, y_c, 0)
  const p_right = project(x_c + w_w / 2, y_c, 0)
  
  const p_bottom = project(x_c, y_c - w_h / 2, 0)
  const p_top = project(x_c, y_c + w_h / 2, 0)

  return {
    h: { x1: p_left.x, y1: p_left.y, x2: p_right.x, y2: p_right.y },
    v: { x1: p_bottom.x, y1: p_bottom.y, x2: p_top.x, y2: p_top.y }
  }
})

const stovePts = computed(() => {
  const x_m = X_max.value
  const z_m = Z_max.value
  const s_w = 11
  const s_d = 11
  const s_h = Math.min(Y_max.value * 0.52, 34)
  
  const ox = x_m * 0.22
  const oz = z_m * 0.22
  
  return {
    p000: project(ox, 0, oz),
    p100: project(ox + s_w, 0, oz),
    p001: project(ox, 0, oz + s_d),
    p101: project(ox + s_w, 0, oz + s_d),
    p010: project(ox, s_h, oz),
    p110: project(ox + s_w, s_h, oz),
    p011: project(ox, s_h, oz + s_d),
    p111: project(ox + s_w, s_h, oz + s_d)
  }
})

const firePoly = computed(() => {
  const s_w = 11
  const s_d = 11
  const s_h = Math.min(Y_max.value * 0.52, 34)
  const ox = X_max.value * 0.22
  const oz = Z_max.value * 0.22
  
  const w_left = ox + s_w * 0.25
  const w_right = ox + s_w * 0.75
  const h_bottom = s_h * 0.25
  const h_top = s_h * 0.65
  
  const p1 = project(w_left, h_bottom, oz + s_d)
  const p2 = project(w_right, h_bottom, oz + s_d)
  const p3 = project(w_right, h_top, oz + s_d)
  const p4 = project(w_left, h_top, oz + s_d)
  
  return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
})

const contactMessage = computed(() => {
  const insulationLabel = insulationOptions.find(o => o.value === insulation.value)?.label || insulation.value
  
  if (activeTab.value === 'quick') {
    return `Hallo Ofenbau-Team,

ich habe meine Heizlast mit dem Heizlast-Rechner ermittelt und wünsche eine unverbindliche Beratung zu einem passenden Ofen.

Hier sind die Eckdaten meiner Schnell-Berechnung:
- Raumgröße: ${area.value} m²
- Raumhöhe: ${height.value} m
- Gebäudedämmung: ${insulationLabel}
- Berechnete Heizlast: ca. ${heatingLoad.value} kW

Ich freue mich auf Ihre Rückmeldung zur Ofenauslegung!

Viele Grüße`
  }
  
  const roomTypeLabel = roomTypeOptions.find(o => o.value === roomType.value)?.label || roomType.value
  const roomLocLabel = roomLocationOptions.find(o => o.value === roomLocation.value)?.label || roomLocation.value
  const wallsLabel = exposedWallsOptions.find(o => o.value === String(exposedWalls.value))?.label || exposedWalls.value
  const windowLabel = windowTypeOptions.find(o => o.value === windowType.value)?.label || windowType.value

  return `Hallo Ofenbau-Team,

ich habe meine Heizlast im Detail berechnet und wünsche eine unverbindliche Beratung zu einem passenden Ofen.

Hier sind meine genauen Raumdaten:
- Raumgröße: ${area.value} m²
- Raumhöhe: ${height.value} m
- Gebäudedämmung: ${insulationLabel}
- Raumtyp/Zieltemperatur: ${roomTypeLabel}
- Lage im Gebäude: ${roomLocLabel}
- Anzahl Außenwände: ${wallsLabel}
- Fensterverglasung: ${windowLabel}
- Große Fensterflächen vorhanden: ${hasLargeWindows.value ? 'Ja' : 'Nein'}
- Berechnete Heizlast: ca. ${heatingLoad.value} kW

Ich freue mich auf Ihre Rückmeldung zur optimalen Ofenplanung!

Viele Grüße`
})

function copySummary() {
  const insulationLabel = insulationOptions.find(o => o.value === insulation.value)?.label
  
  let summaryText = `Heizlast-Berechnung (Ofenbau):\n` +
    `- Raumgröße: ${area.value} m²\n` +
    `- Raumhöhe: ${height.value} m\n` +
    `- Dämmung: ${insulationLabel}\n`
    
  if (activeTab.value === 'detail') {
    const roomTypeLabel = roomTypeOptions.find(o => o.value === roomType.value)?.label
    const roomLocLabel = roomLocationOptions.find(o => o.value === roomLocation.value)?.label
    const wallsLabel = exposedWallsOptions.find(o => o.value === String(exposedWalls.value))?.label
    const windowLabel = windowTypeOptions.find(o => o.value === windowType.value)?.label

    summaryText += `- Raumtyp: ${roomTypeLabel}\n` +
      `- Lage: ${roomLocLabel}\n` +
      `- Außenwände: ${wallsLabel}\n` +
      `- Verglasung: ${windowLabel}\n` +
      `- Große Glasflächen: ${hasLargeWindows.value ? 'Ja' : 'Nein'}\n`
  }
  
  summaryText += `- Berechneter Heizbedarf (Heizlast): ${heatingLoad.value} kW`

  navigator.clipboard.writeText(summaryText).then(() => {
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
  })
}

function reset() {
  area.value = 45
  height.value = 2.5
  insulation.value = 'modernized'
  roomType.value = 'living'
  roomLocation.value = 'middle'
  exposedWalls.value = 2
  windowType.value = 'double'
  hasLargeWindows.value = false
}
</script>

<template>
  <div class="rounded-2xl border border-content-muted/10 bg-surface-muted p-6 sm:p-8 shadow-card">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-content-muted/10 pb-6">
      <div class="flex items-center gap-3">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <AppIcon name="calculator" class="h-5 w-5" />
        </span>
        <div>
          <h3 class="font-display text-2xl font-semibold text-ink-900">Heizlast-Rechner</h3>
          <p class="mt-0.5 text-xs text-content-muted">Dimensionierungshilfe für Ihren Kachelofen oder Kamin</p>
        </div>
      </div>
      
      <!-- Quick/Detail Tab Switch -->
      <div class="inline-flex rounded-lg bg-surface p-1 border border-content-muted/10 self-start sm:self-auto">
        <button 
          class="rounded-md px-3 py-1.5 text-xs font-semibold transition-all"
          :class="activeTab === 'quick' ? 'bg-brand-500 text-white shadow-sm' : 'text-content hover:bg-surface-muted'"
          type="button"
          @click="activeTab = 'quick'"
        >
          Schnell-Modus
        </button>
        <button 
          class="rounded-md px-3 py-1.5 text-xs font-semibold transition-all"
          :class="activeTab === 'detail' ? 'bg-brand-500 text-white shadow-sm' : 'text-content hover:bg-surface-muted'"
          type="button"
          @click="activeTab = 'detail'"
        >
          Detail-Planung
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr]">
      
      <!-- Left Column: Inputs -->
      <div class="space-y-6">
        
        <!-- Space Dimensions Card -->
        <div class="space-y-5">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600">Raum-Dimensionen</h4>
          
          <!-- Area Slider & Stepper -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-sm font-medium text-ink-900">Beheizbare Fläche</label>
              <div class="flex items-center gap-1.5">
                <input 
                  v-model.number="area" 
                  type="number" 
                  min="10" 
                  max="150" 
                  class="w-16 rounded border border-content-muted/20 bg-surface px-1.5 py-0.5 text-center text-sm font-bold text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
                <span class="text-xs font-semibold text-content-muted">m²</span>
              </div>
            </div>
            <input 
              v-model.number="area" 
              type="range" 
              min="10" 
              max="150" 
              step="1"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-content-muted/20 accent-brand-500"
            />
            <div class="mt-1 flex justify-between text-[10px] text-content-muted">
              <span>10 m²</span>
              <span>150 m²</span>
            </div>
          </div>

          <!-- Height Slider & Stepper -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-sm font-medium text-ink-900">Raumhöhe</label>
              <div class="flex items-center gap-1.5">
                <input 
                  v-model.number="height" 
                  type="number" 
                  min="2.0" 
                  max="4.5" 
                  step="0.1"
                  class="w-16 rounded border border-content-muted/20 bg-surface px-1.5 py-0.5 text-center text-sm font-bold text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
                <span class="text-xs font-semibold text-content-muted">m</span>
              </div>
            </div>
            <input 
              v-model.number="height" 
              type="range" 
              min="2.0" 
              max="4.5" 
              step="0.1"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-content-muted/20 accent-brand-500"
            />
            <div class="mt-1 flex justify-between text-[10px] text-content-muted">
              <span>2.0 m</span>
              <span>4.5 m</span>
            </div>
          </div>
        </div>

        <!-- Insulation Options (Radio Cards) -->
        <div class="space-y-4">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600">Gebäudedämmung</h4>
          <div class="grid gap-3 sm:grid-cols-2">
            <label 
              v-for="opt in insulationOptions" 
              :key="opt.value"
              class="relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer select-none transition-all hover:bg-surface"
              :class="insulation === opt.value 
                ? 'border-brand-500 bg-surface ring-1 ring-brand-500/30' 
                : 'border-content-muted/15 bg-surface/50'"
            >
              <input 
                v-model="insulation" 
                :value="opt.value" 
                type="radio" 
                name="insulation" 
                class="sr-only" 
              />
              <div>
                <span class="block text-xs font-bold text-ink-900 leading-tight">{{ opt.label }}</span>
                <span class="mt-1 block text-[10px] text-content-muted leading-tight">{{ opt.desc }}</span>
              </div>
              <span class="mt-3 block text-[10px] font-bold text-brand-600">
                Richtwert: {{ opt.factor }} W/m³
              </span>
            </label>
          </div>
        </div>

        <!-- Detail Parameters (Detailed Mode Only) -->
        <div v-if="activeTab === 'detail'" class="space-y-5 border-t border-content-muted/10 pt-5">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600">Zusätzliche Raumfaktoren</h4>
          
          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Room Type -->
            <div>
              <label class="mb-1.5 block text-xs font-bold text-content" for="roomType">Raumtyp &amp; Temperatur</label>
              <select 
                id="roomType"
                v-model="roomType" 
                class="w-full rounded-lg border border-content-muted/20 bg-surface px-3 py-2 text-xs text-content focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option v-for="o in roomTypeOptions" :key="o.value" :value="o.value">
                  {{ o.label }}
                </option>
              </select>
            </div>

            <!-- Room Location -->
            <div>
              <label class="mb-1.5 block text-xs font-bold text-content" for="roomLocation">Lage im Gebäude</label>
              <select 
                id="roomLocation"
                v-model="roomLocation" 
                class="w-full rounded-lg border border-content-muted/20 bg-surface px-3 py-2 text-xs text-content focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option v-for="o in roomLocationOptions" :key="o.value" :value="o.value">
                  {{ o.label }}
                </option>
              </select>
            </div>

            <!-- Exposed Walls -->
            <div>
              <label class="mb-1.5 block text-xs font-bold text-content" for="exposedWalls">Exponierte Außenwände</label>
              <select 
                id="exposedWalls"
                v-model.number="exposedWalls" 
                class="w-full rounded-lg border border-content-muted/20 bg-surface px-3 py-2 text-xs text-content focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option v-for="o in exposedWallsOptions" :key="o.value" :value="Number(o.value)">
                  {{ o.label }}
                </option>
              </select>
            </div>

            <!-- Window Type -->
            <div>
              <label class="mb-1.5 block text-xs font-bold text-content" for="windowType">Fensterverglasung</label>
              <select 
                id="windowType"
                v-model="windowType" 
                class="w-full rounded-lg border border-content-muted/20 bg-surface px-3 py-2 text-xs text-content focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option v-for="o in windowTypeOptions" :key="o.value" :value="o.value">
                  {{ o.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Large Windows Toggle -->
          <div class="pt-2">
            <label class="flex items-center gap-3 cursor-pointer select-none">
              <div class="relative">
                <input v-model="hasLargeWindows" type="checkbox" class="sr-only peer" />
                <div class="w-9 h-5 bg-content-muted/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
              </div>
              <div>
                <span class="text-xs font-bold text-ink-900">Große Fensterflächen / Glasfronten</span>
                <span class="block text-[10px] text-content-muted">Erhöht den spezifischen Lüftungs-/Wärmeverlust (+12%)</span>
              </div>
            </label>
          </div>
        </div>

      </div>

      <!-- Right Column: Results & Blueprint -->
      <div class="flex flex-col justify-between rounded-xl bg-surface p-5 sm:p-6 border border-brand-500/10 shadow-sm">
        
        <div>
          <!-- Calculated Heating Load -->
          <div class="flex justify-between items-start border-b border-content-muted/10 pb-4">
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-content-muted">Heizlast für diesen Raum</h4>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="font-display text-4xl font-extrabold text-ink-900 transition-all duration-300">{{ heatingLoad }}</span>
                <span class="text-xl font-bold text-content-muted">kW</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-content-muted uppercase block">Raumvolumen</span>
              <span class="text-sm font-bold text-brand-600">{{ (area * height).toFixed(0) }} m³</span>
            </div>
          </div>

          <!-- Dynamic SVG Blueprint representation -->
          <div class="mt-5 space-y-2">
            <div class="flex justify-between items-center text-[11px] font-bold text-content-muted">
              <span>Raummodell (Isometrisch)</span>
              <span v-if="activeTab === 'detail'" class="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Detail-Faktoren aktiv
              </span>
            </div>
            
            <svg 
              viewBox="0 0 300 250" 
              class="w-full h-auto rounded-xl border border-content-muted/10 bg-surface-sand/30"
            >
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5" class="text-brand-300/15" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid)" />

              <!-- Grid floor (draft lines) -->
              <g stroke="currentColor" stroke-width="0.8" class="text-brand-300/30">
                <line v-for="(line, idx) in floorGridLines" :key="idx" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" />
              </g>

              <!-- Floor Polygon -->
              <polygon 
                :points="`${pts.p000.x},${pts.p000.y} ${pts.p100.x},${pts.p100.y} ${pts.p101.x},${pts.p101.y} ${pts.p001.x},${pts.p001.y}`" 
                fill="rgba(243, 236, 227, 0.5)" 
                stroke="rgba(238, 158, 107, 0.4)"
                stroke-width="1.2"
              />

              <!-- Left Wall Polygon -->
              <polygon 
                :points="`${pts.p000.x},${pts.p000.y} ${pts.p100.x},${pts.p100.y} ${pts.p110.x},${pts.p110.y} ${pts.p010.x},${pts.p010.y}`" 
                :fill="isLeftExposed ? 'rgba(227, 82, 5, 0.08)' : 'rgba(74, 66, 62, 0.04)'" 
                :stroke="isLeftExposed ? 'rgb(227, 82, 5)' : 'rgba(74, 66, 62, 0.4)'"
                :stroke-dasharray="isLeftExposed ? '3 2' : 'none'"
                stroke-width="1.2"
              />

              <!-- Right Wall Polygon -->
              <polygon 
                :points="`${pts.p000.x},${pts.p000.y} ${pts.p001.x},${pts.p001.y} ${pts.p011.x},${pts.p011.y} ${pts.p010.x},${pts.p010.y}`" 
                :fill="isRightExposed ? 'rgba(227, 82, 5, 0.08)' : 'rgba(74, 66, 62, 0.04)'" 
                :stroke="isRightExposed ? 'rgb(227, 82, 5)' : 'rgba(74, 66, 62, 0.4)'"
                :stroke-dasharray="isRightExposed ? '3 2' : 'none'"
                stroke-width="1.2"
              />

              <!-- Ceiling outline -->
              <polygon 
                :points="`${pts.p010.x},${pts.p010.y} ${pts.p110.x},${pts.p110.y} ${pts.p111.x},${pts.p111.y} ${pts.p011.x},${pts.p011.y}`" 
                fill="none" 
                stroke="rgba(74, 66, 62, 0.25)" 
                stroke-dasharray="2 3"
                stroke-width="0.8"
              />

              <!-- Outer corner edges (semi-dashed) -->
              <line :x1="pts.p101.x" :y1="pts.p101.y" :x2="pts.p111.x" :y2="pts.p111.y" stroke="rgba(74, 66, 62, 0.3)" stroke-width="0.8" stroke-dasharray="2 2" />
              <line :x1="pts.p100.x" :y1="pts.p100.y" :x2="pts.p101.x" :y2="pts.p101.y" stroke="rgba(74, 66, 62, 0.3)" stroke-width="0.8" stroke-dasharray="2 2" />
              <line :x1="pts.p001.x" :y1="pts.p001.y" :x2="pts.p101.x" :y2="pts.p101.y" stroke="rgba(74, 66, 62, 0.3)" stroke-width="0.8" stroke-dasharray="2 2" />

              <!-- Window on left wall -->
              <g>
                <polygon 
                  :points="windowPoly" 
                  fill="rgba(14, 165, 233, 0.1)" 
                  stroke="rgba(14, 165, 233, 0.5)" 
                  stroke-width="1.2" 
                />
                <line 
                  :x1="windowLines.h.x1" :y1="windowLines.h.y1" 
                  :x2="windowLines.h.x2" :y2="windowLines.h.y2" 
                  stroke="rgba(14, 165, 233, 0.4)" stroke-width="0.8" 
                />
                <line 
                  :x1="windowLines.v.x1" :y1="windowLines.v.y1" 
                  :x2="windowLines.v.x2" :y2="windowLines.v.y2" 
                  stroke="rgba(14, 165, 233, 0.4)" stroke-width="0.8" 
                />
              </g>

              <!-- 3D Stove with glowing fire -->
              <g>
                <!-- Stove Left-Front Face -->
                <polygon 
                  :points="`${stovePts.p001.x},${stovePts.p001.y} ${stovePts.p101.x},${stovePts.p101.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p011.x},${stovePts.p011.y}`" 
                  fill="#292320" 
                  stroke="#1c1816" 
                  stroke-width="1.2"
                />
                <!-- Stove Right-Front Face -->
                <polygon 
                  :points="`${stovePts.p100.x},${stovePts.p100.y} ${stovePts.p101.x},${stovePts.p101.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p110.x},${stovePts.p110.y}`" 
                  fill="#1c1816" 
                  stroke="#1c1816" 
                  stroke-width="1.2"
                />
                <!-- Stove Top Face -->
                <polygon 
                  :points="`${stovePts.p010.x},${stovePts.p010.y} ${stovePts.p110.x},${stovePts.p110.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p011.x},${stovePts.p011.y}`" 
                  fill="#4a423e" 
                  stroke="#292320" 
                  stroke-width="1"
                />
                <!-- Fire Door -->
                <polygon 
                  :points="firePoly" 
                  fill="rgb(227, 82, 5)" 
                  stroke="rgba(255,255,255,0.2)" 
                  stroke-width="0.8"
                  class="fire-glow"
                />
              </g>

              <!-- Height Dimension Line -->
              <g stroke="currentColor" class="text-content-muted" stroke-width="0.8">
                <line :x1="pts.p100.x - 12" :y1="pts.p100.y - 7" :x2="pts.p110.x - 12" :y2="pts.p110.y - 7" />
                <line :x1="pts.p100.x - 15" :y1="pts.p100.y - 9" :x2="pts.p100.x - 9" :y2="pts.p100.y - 5" />
                <line :x1="pts.p110.x - 15" :y1="pts.p110.y - 9" :x2="pts.p110.x - 9" :y2="pts.p110.y - 5" />
                
                <text 
                  :x="pts.p110.x - 16" 
                  :y="(pts.p100.y + pts.p110.y) / 2" 
                  font-size="9" 
                  font-weight="bold"
                  text-anchor="end" 
                  class="fill-content-muted font-mono"
                >
                  {{ height.toFixed(1) }} m
                </text>
              </g>

              <!-- Labels -->
              <text 
                :x="pts.p101.x" 
                :y="pts.p101.y - 12" 
                font-size="10" 
                font-weight="bold"
                text-anchor="middle" 
                class="fill-brand-600 font-sans"
              >
                {{ area }} m²
              </text>
            </svg>
          </div>

          <!-- Gauge Bar -->
          <div class="mt-5">
            <h5 class="text-[10px] font-bold uppercase tracking-wider text-content-muted">Einordnung der Leistungsklasse</h5>
            <div class="relative mt-2.5 h-3 w-full rounded-full bg-slate-100 overflow-visible">
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 opacity-85"></div>
              
              <!-- Threshold marker lines -->
              <div class="absolute top-0 bottom-0 left-[26.6%] w-[1.5px] bg-slate-950/25" title="4 kW Schwelle"></div>
              <div class="absolute top-0 bottom-0 left-[53.3%] w-[1.5px] bg-slate-950/25" title="8 kW Schwelle"></div>
              
              <!-- Indicator pointer -->
              <div 
                class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                :style="{ left: `${Math.min(100, (heatingLoad / 15) * 100)}%` }"
              >
                <div class="h-5 w-2 rounded bg-ink-950 border border-white shadow-sm"></div>
              </div>
            </div>
            <div class="mt-1 flex justify-between text-[9px] font-bold text-content-muted">
              <span>0 kW</span>
              <span class="text-emerald-700">4 kW (Speicherofen)</span>
              <span class="text-amber-700">8 kW (Grundofen)</span>
              <span>15+ kW</span>
            </div>
          </div>

          <!-- Detailed suitability breakdown -->
          <div class="mt-5 border-t border-content-muted/10 pt-4 space-y-3">
            <h5 class="text-[11px] font-bold uppercase tracking-wider text-brand-600">Ofentyp-Vergleich</h5>
            
            <div class="space-y-2.5">
              <div 
                v-for="rec in stoveRecommendation.recs" 
                :key="rec.name"
                class="rounded-lg border border-content-muted/10 bg-surface-muted p-2.5 transition-all text-xs"
              >
                <div class="flex items-center justify-between font-semibold text-ink-900">
                  <span>{{ rec.name }}</span>
                  <span 
                    class="rounded px-1.5 py-0.5 text-[10px] font-bold border"
                    :class="rec.statusColor"
                  >
                    {{ rec.status }}
                  </span>
                </div>
                
                <div class="mt-1 flex items-center justify-between gap-4">
                  <p class="text-[10px] leading-relaxed text-content-muted flex-1">{{ rec.desc }}</p>
                  
                  <div class="flex shrink-0 gap-0.5" :title="`Eignung: ${rec.rating}/5 Sternen`">
                    <AppIcon 
                      v-for="i in 5" 
                      :key="i" 
                      name="star" 
                      class="h-3 w-3"
                      :class="i <= rec.rating ? 'text-amber-500 fill-amber-500' : 'text-content-muted/20 fill-transparent'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Summary & Actions -->
        <div class="mt-6 pt-4 border-t border-content-muted/10 space-y-4">
          <div class="flex gap-3">
            <!-- Reset Button -->
            <button 
              class="flex items-center justify-center rounded-lg border border-content-muted/20 px-3 py-2 text-content hover:bg-surface-muted hover:border-content-muted/40 transition-all text-xs font-semibold"
              title="Zurücksetzen"
              type="button"
              @click="reset"
            >
              <AppIcon name="rotate" class="h-4 w-4" />
            </button>

            <!-- Copy Summary Button -->
            <button 
              class="flex-1 flex items-center justify-center gap-2 rounded-lg border border-content-muted/20 bg-surface px-4 py-2 text-xs font-semibold text-content hover:bg-surface-muted transition-all"
              type="button"
              @click="copySummary"
            >
              <AppIcon v-if="showCopied" name="check" class="h-4 w-4 text-emerald-600" />
              <AppIcon v-else name="swatch" class="h-4 w-4" />
              <span>{{ showCopied ? 'Kopiert!' : 'Berechnung kopieren' }}</span>
            </button>
          </div>

          <!-- Contact Form CTA -->
          <BaseButton 
            :to="{ name: 'contact', query: { topic: 'kachelofen-kaminbau', note: contactMessage, source: 'heizlast' } }"
            block
            size="md"
          >
            Beratung mit Werten anfragen
            <AppIcon name="arrow" class="h-4 w-4" />
          </BaseButton>
          
          <p class="text-[9px] text-center text-content-muted leading-relaxed">
            *Dies ist eine unverbindliche Näherungsberechnung auf Basis typischer Raumparameter. Eine fachgerechte Heizlastberechnung nach <strong>DIN EN 12831</strong> wird vor der Ofeninstallation von uns durchgeführt.
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes firePulse {
  0%, 100% { fill: rgb(227, 82, 5); filter: drop-shadow(0 0 2px rgb(227, 82, 5)); }
  50% { fill: rgb(244, 194, 156); filter: drop-shadow(0 0 5px rgb(235, 125, 63)); }
}
.fire-glow {
  animation: firePulse 1.8s infinite ease-in-out;
}
</style>

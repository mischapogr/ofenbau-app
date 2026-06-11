<script setup>
import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'

const step = ref(1)
const projectType = ref('') // 'kamin', 'kachelofen', 'schornstein', 'fliesen'

// Kamin / Kachelofen details
const shape = ref('straight') // 'straight', 'corner', 'tunnel'
const chimneyNeeded = ref('no') // 'yes', 'no'
const waterConnection = ref('no') // 'yes', 'no'
const storageMass = ref('no') // 'yes', 'no'

// Fliesen details
const tileArea = ref(30) // m²
const substratePrep = ref('none') // 'none', 'removal'
const waterproofing = ref('no') // 'yes', 'no'
const pattern = ref('straight') // 'straight', 'diagonal'

// Schornstein details
const chimneyType = ref('exterior') // 'exterior', 'interior', 'sanierung'
const chimneyHeight = ref(6) // meters

// General details
const materialTier = ref('standard') // 'standard', 'premium'
const showCopied = ref(false)

// Line items generator (Live Bill of Materials)
const lineItems = computed(() => {
  if (!projectType.value) return []
  
  const items = []
  
  if (projectType.value === 'kamin' || projectType.value === 'kachelofen') {
    const isKachelofen = projectType.value === 'kachelofen'
    items.push({ 
      label: `Grundkonstruktion ${isKachelofen ? 'Kachelofen (Grundofen)' : 'Heizkamin'}`, 
      price: isKachelofen ? 9500 : 4800 
    })
    
    if (shape.value === 'corner') {
      items.push({ label: 'Eck-Konstruktion (Zuschnitt & Mehraufwand)', price: 600 })
    } else if (shape.value === 'tunnel') {
      items.push({ label: 'Tunnel-Konstruktion (Doppelscheibe & Sturzträger)', price: 1400 })
    }
    
    if (chimneyNeeded.value === 'yes') {
      items.push({ label: 'Neubau Schornsteinsystem (Edelstahl DW)', price: 2400 })
    }
    
    if (waterConnection.value === 'yes') {
      items.push({ label: 'Wasserführender Heizeinsatz & Sicherheitsgruppe', price: 3800 })
    }
    
    if (storageMass.value === 'yes') {
      items.push({ label: 'Zusätzlicher Schamotte-Speicherkern (12h-Wärme)', price: 1800 })
    }
    
    if (materialTier.value === 'premium') {
      const currentSubtotal = items.reduce((sum, item) => sum + item.price, 0)
      items.push({ 
        label: 'Premium-Ausführung (Naturstein / Speckstein / Design-Kacheln)', 
        price: Math.round(currentSubtotal * 0.38) 
      })
    }
  } else if (projectType.value === 'fliesen') {
    items.push({ label: 'Baustellen-Einrichtung, Planung & Nivellierung', price: 900 })
    
    const tileBasePrice = materialTier.value === 'premium' ? 150 : 110
    items.push({ 
      label: `Verlegearbeiten inkl. ${materialTier.value === 'premium' ? 'Premium-Fliesen XXL' : 'Standard-Fliesen'} (${tileArea.value} m²)`, 
      price: tileArea.value * tileBasePrice 
    })
    
    if (substratePrep.value === 'removal') {
      items.push({ label: 'Altbelag stemmen, Schleifen & Entsorgung', price: tileArea.value * 45 })
    }
    
    if (waterproofing.value === 'yes') {
      items.push({ label: 'Verbundabdichtung im Nassbereich (z.B. Dusche)', price: tileArea.value * 35 })
    }
    
    if (pattern.value === 'diagonal') {
      items.push({ label: 'Verlegung im Diagonal-/Fischgrätmuster', price: tileArea.value * 25 })
    }
  } else if (projectType.value === 'schornstein') {
    const isExterior = chimneyType.value === 'exterior'
    const isInterior = chimneyType.value === 'interior'
    const isSanierung = chimneyType.value === 'sanierung'
    
    let basePrice = 1600
    let label = 'Doppelwandiger Edelstahlschornstein (Außenwand)'
    if (isInterior) {
      basePrice = 2900
      label = 'Leichtbau-Schornsteinsystem F90 (Innenmontage)'
    } else if (isSanierung) {
      basePrice = 1100
      label = 'Kaminsanierung (Edelstahl-Innenrohr einziehen)'
    }
    
    items.push({ label: 'Planung, Brandschutzprüfung & Kernbohrung', price: 1200 })
    items.push({ label: `${label} (Standard 6m)`, price: basePrice })
    
    const heightDiff = chimneyHeight.value - 6
    if (heightDiff !== 0) {
      const pricePerMeter = isExterior ? 180 : isInterior ? 280 : 110
      items.push({ 
        label: `${heightDiff > 0 ? 'Zusatzhöhe' : 'Minderhöhe'} Schornsteinelemente (${Math.abs(heightDiff)}m)`, 
        price: heightDiff * pricePerMeter 
      })
    }
    
    if (materialTier.value === 'premium') {
      const currentSubtotal = items.reduce((sum, item) => sum + item.price, 0)
      items.push({ 
        label: 'Premium-Ausführung (z.B. Pulverbeschichtung RAL)', 
        price: Math.round(currentSubtotal * 0.35) 
      })
    }
  }
  
  return items
})

const calculatedEstimates = computed(() => {
  if (lineItems.value.length === 0) return { min: 0, max: 0, subtotal: 0 }
  
  const subtotal = lineItems.value.reduce((sum, item) => sum + item.price, 0)
  
  // Ballpark range (+/- 10%)
  const min = Math.round((subtotal * 0.90) / 100) * 100
  const max = Math.round((subtotal * 1.10) / 100) * 100
  
  return { min, max, subtotal }
})

const currentWording = computed(() => {
  switch (projectType.value) {
    case 'kamin':
      return 'Heizkamin / Kaminofen'
    case 'kachelofen':
      return 'Kachel- / Grundofen'
    case 'schornstein':
      return 'Schornsteinbau'
    case 'fliesen':
      return 'Fliesenarbeiten'
    default:
      return ''
  }
})

// Projection parameters for Kamin/Kachelofen preview
const cx_stove = 100
const cy_stove = 115

function projectStove(X, Y, Z) {
  return {
    x: cx_stove + Z * 0.866 - X * 0.866,
    y: cy_stove + Z * 0.5 + X * 0.5 - Y
  }
}

const stovePts = computed(() => {
  const isKachelofen = projectType.value === 'kachelofen'
  const isCorner = shape.value === 'corner'
  const isTunnel = shape.value === 'tunnel'
  
  const s_w = isTunnel ? 12 : 24
  const s_d = isTunnel ? 35 : 18
  const s_h = isKachelofen ? 60 : 48
  
  const ox = 0
  const oz = 0
  
  if (isCorner) {
    return {
      p_back: projectStove(0, 0, 0),
      p_left: projectStove(30, 0, 0),
      p_right: projectStove(0, 0, 30),
      p_front_l: projectStove(30, 0, 15),
      p_front_r: projectStove(15, 0, 30),
      
      t_back: projectStove(0, s_h, 0),
      t_left: projectStove(30, s_h, 0),
      t_right: projectStove(0, s_h, 30),
      t_front_l: projectStove(30, s_h, 15),
      t_front_r: projectStove(15, s_h, 30)
    }
  }
  
  return {
    p000: projectStove(ox, 0, oz),
    p100: projectStove(ox + s_w, 0, oz),
    p001: projectStove(ox, 0, oz + s_d),
    p101: projectStove(ox + s_w, 0, oz + s_d),
    p010: projectStove(ox, s_h, oz),
    p110: projectStove(ox + s_w, s_h, oz),
    p011: projectStove(ox, s_h, oz + s_d),
    p111: projectStove(ox + s_w, s_h, oz + s_d)
  }
})

const firePoly = computed(() => {
  const isKachelofen = projectType.value === 'kachelofen'
  const isCorner = shape.value === 'corner'
  const isTunnel = shape.value === 'tunnel'
  
  const s_w = isTunnel ? 12 : 24
  const s_d = isTunnel ? 35 : 18
  const s_h = isKachelofen ? 60 : 48
  
  if (isCorner) {
    const p1 = projectStove(25, s_h * 0.22, 20)
    const p2 = projectStove(20, s_h * 0.22, 25)
    const p3 = projectStove(20, s_h * 0.55, 25)
    const p4 = projectStove(25, s_h * 0.55, 20)
    return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
  }
  
  const w_left = s_w * 0.25
  const w_right = s_w * 0.75
  const h_bottom = s_h * 0.2
  const h_top = s_h * 0.5
  
  const p1 = projectStove(w_left, h_bottom, s_d)
  const p2 = projectStove(w_right, h_bottom, s_d)
  const p3 = projectStove(w_right, h_top, s_d)
  const p4 = projectStove(w_left, h_top, s_d)
  
  return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`
})

const chimneyPipePts = computed(() => {
  const isKachelofen = projectType.value === 'kachelofen'
  const isCorner = shape.value === 'corner'
  const isTunnel = shape.value === 'tunnel'
  
  const s_w = isTunnel ? 12 : 24
  const s_d = isTunnel ? 35 : 18
  const s_h = isKachelofen ? 60 : 48
  
  let p_start
  if (isCorner) {
    p_start = projectStove(15, s_h, 15)
  } else {
    p_start = projectStove(s_w / 2, s_h, s_d / 2)
  }
  
  const p_up = { x: p_start.x, y: p_start.y - 25 }
  const p_wall = { x: p_start.x + 50, y: p_start.y - 25 + 28 }
  
  return {
    x1: p_start.x,
    y1: p_start.y,
    x2: p_up.x,
    y2: p_up.y,
    x3: p_wall.x,
    y3: p_wall.y
  }
})

// Fliesen sizing
const tilePlaneSize = computed(() => 45 + Math.sqrt(tileArea.value) * 4.5)

// Schornstein pipe top Y mapping
const chimneyPipeTopY = computed(() => 132 - (chimneyHeight.value * 9))

const contactMessage = computed(() => {
  if (!projectType.value) return ''
  
  let msg = `Hallo Ofenbau-Team,

ich habe mein Projekt mit dem Budget-Kalkulator durchgeplant und wünsche ein unverbindliches Angebot.

Hier sind meine Wunschdaten:
`
  if (projectType.value === 'kamin' || projectType.value === 'kachelofen') {
    const typeLabel = projectType.value === 'kamin' ? 'Heizkamin / Kaminofen' : 'Kachel- / Grundofen'
    const shapeLabel = shape.value === 'corner' ? 'Eck-Modell' : shape.value === 'tunnel' ? 'Tunnel / Raumteiler' : 'Gerade Wand'
    
    msg += `- Gewerk: ${typeLabel}\n` +
      `- Ofen-Form: ${shapeLabel}\n` +
      `- Neuer Schornstein benötigt: ${chimneyNeeded.value === 'yes' ? 'Ja' : 'Nein (vorhanden)'}\n` +
      `- Wasserführende Heizunterstützung: ${waterConnection.value === 'yes' ? 'Ja' : 'Nein'}\n` +
      `- Zusätzliche Speichermasse: ${storageMass.value === 'yes' ? 'Ja' : 'Nein'}\n`
  } else if (projectType.value === 'fliesen') {
    const patternLabel = pattern.value === 'diagonal' ? 'Diagonal / Fischgrät' : 'Klassischer Kreuzverband'
    const prepLabel = substratePrep.value === 'removal' ? 'Altbelagsanierung / Entfernung' : 'Direkte Verlegung auf Estrich'
    
    msg += `- Gewerk: Fliesenarbeiten\n` +
      `- Verlegefläche: ${tileArea.value} m²\n` +
      `- Untergrundvorbereitung: ${prepLabel}\n` +
      `- Nassbereich-Abdichtung: ${waterproofing.value === 'yes' ? 'Ja' : 'Nein'}\n` +
      `- Verlegemuster: ${patternLabel}\n`
  } else if (projectType.value === 'schornstein') {
    const typeLabel = chimneyType.value === 'interior' ? 'Innenmontage (Leichtbauschacht)' : chimneyType.value === 'sanierung' ? 'Schornsteinsanierung' : 'Außenwandmontage (Edelstahl)'
    
    msg += `- Gewerk: Schornsteinbau\n` +
      `- Montageart: ${typeLabel}\n` +
      `- Geplante Höhe: ${chimneyHeight.value} Meter\n`
  }
  
  const materialLabel = materialTier.value === 'premium' ? 'Premium / Exklusiv' : 'Standard / Klassik'
  msg += `- Ausführung & Material: ${materialLabel}\n` +
    `- Geschätzter Kostenrahmen: ${formatPrice(calculatedEstimates.value.min)} – ${formatPrice(calculatedEstimates.value.max)}\n\n` +
    `Ich freue mich auf Ihre Rückmeldung zur Abstimmung eines Beratungstermins!\n\n` +
    `Viele Grüße`
    
  return msg
})

function formatPrice(val) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val)
}

function copySummary() {
  navigator.clipboard.writeText(contactMessage.value).then(() => {
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
  })
}

function reset() {
  projectType.value = ''
  shape.value = 'straight'
  chimneyNeeded.value = 'no'
  waterConnection.value = 'no'
  storageMass.value = 'no'
  tileArea.value = 30
  substratePrep.value = 'none'
  waterproofing.value = 'no'
  pattern.value = 'straight'
  chimneyType.value = 'exterior'
  chimneyHeight.value = 6
  materialTier.value = 'standard'
  step.value = 1
}

function setProjectType(type) {
  projectType.value = type
  step.value = 2
}
</script>

<template>
  <div class="rounded-2xl border border-content-muted/10 bg-surface p-6 sm:p-8 shadow-card">
    <div class="flex items-center justify-between border-b border-content-muted/10 pb-5">
      <div class="flex items-center gap-3">
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <AppIcon name="swatch" class="h-5 w-5" />
        </span>
        <div>
          <h3 class="font-display text-2xl font-semibold text-ink-900">Budget-Kalkulator</h3>
          <p class="mt-0.5 text-xs text-content-muted">Konfigurieren Sie Ihr Gewerk und erhalten Sie einen Richtpreis</p>
        </div>
      </div>
      
      <!-- Step Indicator Badge -->
      <span v-if="projectType" class="rounded-full bg-brand-50 border border-brand-200/50 px-2.5 py-1 text-xs font-bold text-brand-700">
        Schritt {{ step }} / 4
      </span>
    </div>

    <!-- main split layout -->
    <div class="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      
      <!-- Left Column: Step Content -->
      <div>
        
        <!-- Step 1: Project Type -->
        <div v-if="step === 1">
          <label class="block text-sm font-semibold text-ink-900 mb-4">Wählen Sie Ihr gewünschtes Gewerk:</label>
          <div class="grid gap-4 sm:grid-cols-2">
            <button 
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="setProjectType('kamin')"
            >
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4">
                <AppIcon name="flame" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Kaminbau</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed">Moderne Heizkamine &amp; Kaminöfen mit großem Sichtfeuer für schnelle Wärme.</span>
            </button>

            <button 
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="setProjectType('kachelofen')"
            >
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4">
                <AppIcon name="cube" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Kachelofen / Grundofen</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed">Traditionell handgesetzte Speicheröfen für langanhaltende Strahlungswärme.</span>
            </button>

            <button 
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="setProjectType('fliesen')"
            >
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4">
                <AppIcon name="tile" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Fliesenarbeiten</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed">Präzise Verlegung in Bad, Küche, Wohnbereich sowie Terrassen &amp; Balkone.</span>
            </button>

            <button 
              class="flex flex-col items-start rounded-xl border border-content-muted/10 p-5 hover:border-brand-500 hover:bg-surface-muted text-left transition-all"
              type="button"
              @click="setProjectType('schornstein')"
            >
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 mb-4">
                <AppIcon name="chimney" class="h-5 w-5" />
              </span>
              <span class="font-semibold text-ink-900">Schornsteinbau</span>
              <span class="mt-1.5 text-xs text-content-muted leading-relaxed">Brandsicherer Neubau in Edelstahl, Leichtbau oder Sanierung des Altbestands.</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Custom technical details -->
        <div v-if="step === 2" class="space-y-6">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600 mb-1">Technische Konfiguration</h4>
          
          <!-- Kamin & Kachelofen details -->
          <div v-if="projectType === 'kamin' || projectType === 'kachelofen'" class="space-y-5">
            <!-- Shape selection (custom cards) -->
            <div>
              <label class="block text-xs font-bold text-ink-900 mb-2.5">Stilelemente &amp; Form des Ofens</label>
              <div class="grid gap-3 sm:grid-cols-3">
                <label 
                  class="flex flex-col justify-between rounded-lg border p-3 cursor-pointer text-xs transition-all hover:bg-surface-muted"
                  :class="shape === 'straight' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/10'"
                >
                  <input v-model="shape" type="radio" value="straight" name="shape" class="sr-only" />
                  <span class="font-semibold text-ink-900">Gerade Wand</span>
                  <span class="mt-1 block text-[10px] text-content-muted leading-tight">Klassische Platzierung vor einer Wand.</span>
                </label>
                
                <label 
                  class="flex flex-col justify-between rounded-lg border p-3 cursor-pointer text-xs transition-all hover:bg-surface-muted"
                  :class="shape === 'corner' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/10'"
                >
                  <input v-model="shape" type="radio" value="corner" name="shape" class="sr-only" />
                  <span class="font-semibold text-ink-900">Eck-Modell (+600 €)</span>
                  <span class="mt-1 block text-[10px] text-content-muted leading-tight">Platzsparende Montage in der Raumecke.</span>
                </label>

                <label 
                  class="flex flex-col justify-between rounded-lg border p-3 cursor-pointer text-xs transition-all hover:bg-surface-muted"
                  :class="shape === 'tunnel' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/10'"
                >
                  <input v-model="shape" type="radio" value="tunnel" name="shape" class="sr-only" />
                  <span class="font-semibold text-ink-900">Tunnel / Raumteiler (+1.400 €)</span>
                  <span class="mt-1 block text-[10px] text-content-muted leading-tight">Sichtfeuer von zwei Seiten.</span>
                </label>
              </div>
            </div>

            <!-- Schornstein needed toggle -->
            <div class="border-t border-content-muted/10 pt-4">
              <label class="block text-xs font-bold text-ink-900 mb-2">Wird ein neuer Schornstein benötigt?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="chimneyNeeded" value="no" type="radio" name="chimney" class="text-brand-500 focus:ring-brand-500" />
                  <span>Nein, vorhandener Schornstein wird genutzt</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="chimneyNeeded" value="yes" type="radio" name="chimney" class="text-brand-500 focus:ring-brand-500" />
                  <span>Ja, doppelwandiger Edelstahl-Schornstein (+2.400 €)</span>
                </label>
              </div>
            </div>

            <!-- Water-connection toggle -->
            <div class="border-t border-content-muted/10 pt-4">
              <label class="block text-xs font-bold text-ink-900 mb-2">Wasserführung (Zentralheizungs-Kopplung)?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="waterConnection" value="no" type="radio" name="water" class="text-brand-500 focus:ring-brand-500" />
                  <span>Nein, reine Strahlungs-/Konvektionswärme</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="waterConnection" value="yes" type="radio" name="water" class="text-brand-500 focus:ring-brand-500" />
                  <span>Ja, wasserführender Heizeinsatz (+3.800 €)</span>
                </label>
              </div>
            </div>

            <!-- Additional storage mass toggle -->
            <div class="border-t border-content-muted/10 pt-4">
              <label class="block text-xs font-bold text-ink-900 mb-2">Schamotte-Speicherkern (Extra Masse)?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="storageMass" value="no" type="radio" name="storage" class="text-brand-500 focus:ring-brand-500" />
                  <span>Standard Speichermasse</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="storageMass" value="yes" type="radio" name="storage" class="text-brand-500 focus:ring-brand-500" />
                  <span>Ja, extra Speichermodule für 12h+ Wärme (+1.800 €)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Fliesenarbeiten details -->
          <div v-if="projectType === 'fliesen'" class="space-y-5">
            <!-- Verlegefläche area slider -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-ink-900">Geplante Verlegefläche</label>
                <div class="flex items-center gap-1.5">
                  <input 
                    v-model.number="tileArea" 
                    type="number" 
                    min="5" 
                    max="200" 
                    class="w-16 rounded border border-content-muted/20 bg-surface px-1.5 py-0.5 text-center text-sm font-bold text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                  <span class="text-xs font-semibold text-content-muted">m²</span>
                </div>
              </div>
              <input 
                v-model.number="tileArea" 
                type="range" 
                min="5" 
                max="200" 
                step="5"
                class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-content-muted/20 accent-brand-500"
              />
              <div class="mt-1 flex justify-between text-[10px] text-content-muted">
                <span>5 m² (z.B. Gäste-WC)</span>
                <span>200 m² (z.B. ganzes Haus)</span>
              </div>
            </div>

            <!-- Substrate prep toggle -->
            <div class="border-t border-content-muted/10 pt-4">
              <label class="block text-xs font-bold text-ink-900 mb-2">Untergrundvorbereitung (Altbelag)?</label>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2.5 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="substratePrep" value="none" type="radio" name="prep" class="text-brand-500 focus:ring-brand-500" />
                  <span>Direktverlegung auf verlegefertigen Estrich (+0 €)</span>
                </label>
                <label class="flex items-center gap-2.5 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="substratePrep" value="removal" type="radio" name="prep" class="text-brand-500 focus:ring-brand-500" />
                  <span>Altbelagsanierung (Alte Fliesen entfernen &amp; Untergrund fräsen) (+45 € / m²)</span>
                </label>
              </div>
            </div>

            <!-- Waterproofing toggle -->
            <div class="border-t border-content-muted/10 pt-4">
              <label class="block text-xs font-bold text-ink-900 mb-2">Feuchtraum-Abdichtung (Nassbereich)?</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="waterproofing" value="no" type="radio" name="waterproof" class="text-brand-500 focus:ring-brand-500" />
                  <span>Nein, normaler Wohnraum</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="waterproofing" value="yes" type="radio" name="waterproof" class="text-brand-500 focus:ring-brand-500" />
                  <span>Ja, Abdichtung nach DIN 18534 (Bad/Dusche) (+35 € / m²)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Schornsteinbau details -->
          <div v-if="projectType === 'schornstein'" class="space-y-5">
            <!-- Assembly Type -->
            <div>
              <label class="block text-xs font-bold text-ink-900 mb-2.5">Montageart &amp; Systemtyp</label>
              <div class="grid gap-3 sm:grid-cols-3">
                <label 
                  class="flex flex-col justify-between rounded-lg border p-3 cursor-pointer text-xs transition-all hover:bg-surface-muted"
                  :class="chimneyType === 'exterior' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/10'"
                >
                  <input v-model="chimneyType" type="radio" value="exterior" name="chtype" class="sr-only" />
                  <span class="font-semibold text-ink-900">Außenwand (DW)</span>
                  <span class="mt-1 block text-[10px] text-content-muted leading-tight">Doppelwandiger Edelstahl-Schornstein außen.</span>
                </label>
                
                <label 
                  class="flex flex-col justify-between rounded-lg border p-3 cursor-pointer text-xs transition-all hover:bg-surface-muted"
                  :class="chimneyType === 'interior' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/10'"
                >
                  <input v-model="chimneyType" type="radio" value="interior" name="chtype" class="sr-only" />
                  <span class="font-semibold text-ink-900">Innenmontage F90 (+1.300 €)</span>
                  <span class="mt-1 block text-[10px] text-content-muted leading-tight">Leichtbauschacht durch Decken und Dach.</span>
                </label>

                <label 
                  class="flex flex-col justify-between rounded-lg border p-3 cursor-pointer text-xs transition-all hover:bg-surface-muted"
                  :class="chimneyType === 'sanierung' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/10'"
                >
                  <input v-model="chimneyType" type="radio" value="sanierung" name="chtype" class="sr-only" />
                  <span class="font-semibold text-ink-900">Kaminsanierung (-500 €)</span>
                  <span class="mt-1 block text-[10px] text-content-muted leading-tight">Edelstahlrohr in bestehenden Schacht einziehen.</span>
                </label>
              </div>
            </div>

            <!-- Height slider -->
            <div class="border-t border-content-muted/10 pt-4">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-ink-900">Geplante Schornsteinhöhe</label>
                <div class="flex items-center gap-1.5">
                  <input 
                    v-model.number="chimneyHeight" 
                    type="number" 
                    min="4" 
                    max="12" 
                    class="w-16 rounded border border-content-muted/20 bg-surface px-1.5 py-0.5 text-center text-sm font-bold text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                  <span class="text-xs font-semibold text-content-muted">Meter</span>
                </div>
              </div>
              <input 
                v-model.number="chimneyHeight" 
                type="range" 
                min="4" 
                max="12" 
                step="1"
                class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-content-muted/20 accent-brand-500"
              />
              <div class="mt-1 flex justify-between text-[10px] text-content-muted">
                <span>4 Meter (Mindesthöhe)</span>
                <span>12 Meter</span>
              </div>
            </div>
          </div>

          <!-- Back / Next Buttons -->
          <div class="flex gap-4 pt-4 border-t border-content-muted/10">
            <BaseButton variant="ghost" class="flex-1" @click="step = 1">Zurück</BaseButton>
            <BaseButton class="flex-1" @click="step = 3">Weiter</BaseButton>
          </div>
        </div>

        <!-- Step 3: Material & Design Tier -->
        <div v-if="step === 3" class="space-y-6">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600 mb-1">Qualität &amp; Design</h4>
          
          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-ink-900 mb-3">Ausführung &amp; Materialqualität:</label>
              <div class="flex flex-col gap-3">
                <label 
                  class="flex items-start gap-4 rounded-xl border p-4 cursor-pointer select-none transition-all hover:bg-surface-muted"
                  :class="materialTier === 'standard' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/15 bg-surface/50'"
                >
                  <input v-model="materialTier" value="standard" type="radio" name="materials" class="mt-1 text-brand-500 focus:ring-brand-500" />
                  <div>
                    <span class="block font-semibold text-ink-900 text-sm">Standard / Meisterklasse</span>
                    <span class="mt-1 block text-xs text-content-muted leading-relaxed">
                      Klassische verputzte Ofenflächen, bewährte Standardkacheln, Fliesenverlegung im Standardformat (z.B. 30x60cm). Solide, langlebige Ausführung nach alter Schule.
                    </span>
                  </div>
                </label>

                <label 
                  class="flex items-start gap-4 rounded-xl border p-4 cursor-pointer select-none transition-all hover:bg-surface-muted"
                  :class="materialTier === 'premium' ? 'border-brand-500 bg-brand-50/10 ring-1 ring-brand-500/20' : 'border-content-muted/15 bg-surface/50'"
                >
                  <input v-model="materialTier" value="premium" type="radio" name="materials" class="mt-1 text-brand-500 focus:ring-brand-500" />
                  <div>
                    <span class="block font-semibold text-ink-900 text-sm">Premium / Exklusiv (+35-38%)</span>
                    <span class="mt-1 block text-xs text-content-muted leading-relaxed">
                      Exklusive Natursteinarbeiten, Specksteinverkleidungen, handgefertigte Kacheln aus Manufakturbetrieben, Großformat-Fliesen (XXL bis 120x120cm) oder anspruchsvolle Mosaikverlegung.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Fliesenverlege-Muster (only for fliesen) -->
            <div v-if="projectType === 'fliesen'" class="border-t border-content-muted/10 pt-4">
              <label class="block text-xs font-bold text-ink-900 mb-2">Gewünschtes Verlegemuster</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="pattern" value="straight" type="radio" name="pattern" class="text-brand-500 focus:ring-brand-500" />
                  <span>Klassischer Kreuzverband / Fugenbahn (+0 €)</span>
                </label>
                <label class="flex items-center gap-2 text-xs font-semibold text-content cursor-pointer">
                  <input v-model="pattern" value="diagonal" type="radio" name="pattern" class="text-brand-500 focus:ring-brand-500" />
                  <span>Diagonal / Fischgrätmuster / Verband (+25 € / m²)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Back / Calculate Buttons -->
          <div class="flex gap-4 pt-4 border-t border-content-muted/10">
            <BaseButton variant="ghost" class="flex-1" @click="step = 2">Zurück</BaseButton>
            <BaseButton class="flex-1" @click="step = 4">Berechnen</BaseButton>
          </div>
        </div>

        <!-- Step 4: Summary -->
        <div v-if="step === 4" class="space-y-5">
          <h4 class="text-xs uppercase tracking-wider font-bold text-brand-600 mb-1">Planung abgeschlossen</h4>
          
          <p class="text-sm text-content leading-relaxed">
            Vielen Dank für die Konfiguration! Auf der rechten Seite sehen Sie die geschätzte Budgetspanne und die detaillierte Postenaufstellung für Ihr Gewerk.
          </p>

          <div class="rounded-xl bg-surface-muted border border-content-muted/10 p-4 space-y-3 text-xs text-content">
            <h5 class="font-bold text-ink-900">Ausgewählte Optionen in der Zusammenfassung:</h5>
            <div class="grid gap-2 sm:grid-cols-2">
              <div class="flex justify-between border-b border-content-muted/5 pb-1">
                <span class="text-content-muted">Gewerk:</span>
                <span class="font-semibold">{{ currentWording }}</span>
              </div>
              <div class="flex justify-between border-b border-content-muted/5 pb-1">
                <span class="text-content-muted">Materialklasse:</span>
                <span class="font-semibold">{{ materialTier === 'premium' ? 'Premium' : 'Standard' }}</span>
              </div>
              
              <!-- Conditional Summary lines -->
              <template v-if="projectType === 'kamin' || projectType === 'kachelofen'">
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Ofen-Form:</span>
                  <span class="font-semibold">{{ shape === 'corner' ? 'Eck-Modell' : shape === 'tunnel' ? 'Tunnel' : 'Gerade' }}</span>
                </div>
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Schornstein:</span>
                  <span class="font-semibold">{{ chimneyNeeded === 'yes' ? 'Neu' : 'Vorhanden' }}</span>
                </div>
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Heiznetzkopplung:</span>
                  <span class="font-semibold">{{ waterConnection === 'yes' ? 'Ja' : 'Nein' }}</span>
                </div>
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Extra Speicher:</span>
                  <span class="font-semibold">{{ storageMass === 'yes' ? 'Ja' : 'Nein' }}</span>
                </div>
              </template>
              
              <template v-if="projectType === 'fliesen'">
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Fläche:</span>
                  <span class="font-semibold">{{ tileArea }} m²</span>
                </div>
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Verlegemuster:</span>
                  <span class="font-semibold">{{ pattern === 'diagonal' ? 'Diagonal' : 'Kreuzverband' }}</span>
                </div>
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Sanierung:</span>
                  <span class="font-semibold">{{ substratePrep === 'removal' ? 'Ja (Altbelag)' : 'Nein' }}</span>
                </div>
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Nass-Abdichtung:</span>
                  <span class="font-semibold">{{ waterproofing === 'yes' ? 'Ja' : 'Nein' }}</span>
                </div>
              </template>

              <template v-if="projectType === 'schornstein'">
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Montageart:</span>
                  <span class="font-semibold">{{ chimneyType === 'interior' ? 'Innenmontage' : chimneyType === 'sanierung' ? 'Sanierung' : 'Außenwand' }}</span>
                </div>
                <div class="flex justify-between border-b border-content-muted/5 pb-1">
                  <span class="text-content-muted">Schornsteinhöhe:</span>
                  <span class="font-semibold">{{ chimneyHeight }} Meter</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Back / Reset buttons -->
          <div class="flex gap-4 pt-4 border-t border-content-muted/10">
            <BaseButton variant="ghost" class="flex-1" @click="step = 3">Zurück</BaseButton>
            <BaseButton variant="ghost" class="flex-1" @click="reset">Zurücksetzen</BaseButton>
          </div>
        </div>

      </div>

      <!-- Right Column: Real-time cost & SVG preview -->
      <div class="flex flex-col justify-between rounded-xl bg-surface-muted p-5 border border-brand-500/10 shadow-sm self-start lg:sticky lg:top-24">
        
        <div>
          <!-- Budget range display -->
          <div class="text-center border-b border-content-muted/10 pb-4">
            <h4 class="text-[10px] uppercase tracking-wider font-bold text-content-muted">Unverbindliche Kostenschätzung</h4>
            <p v-if="projectType" class="mt-2 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl transition-all duration-300">
              {{ formatPrice(calculatedEstimates.min) }} – {{ formatPrice(calculatedEstimates.max) }}
            </p>
            <p v-else class="mt-2 font-display text-xl font-bold text-content-muted italic">
              Kein Gewerk gewählt
            </p>
            <p class="mt-1.5 text-[9px] text-content-muted leading-tight">
              *Inklusive deutscher Handwerksleistung, Materialien &amp; MwSt.
            </p>
          </div>

          <!-- Dynamic SVG Preview illustration -->
          <div class="mt-5 space-y-2">
            <span class="text-[11px] font-bold text-content-muted block">Projektentwurf (Vorschau)</span>
            
            <!-- Placeholder SVG -->
            <svg v-if="!projectType" viewBox="0 0 200 160" class="w-full h-auto rounded-lg border border-content-muted/10 bg-surface-sand/20">
              <defs>
                <pattern id="grid-bg" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" stroke-width="0.5" class="text-brand-300/15" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-bg)" />
              
              <g stroke="currentColor" stroke-width="0.8" class="text-brand-400/30" fill="none">
                <rect x="50" y="45" width="100" height="70" rx="4" />
                <path d="M 50 75 L 100 35 L 150 75" />
                <circle cx="100" cy="80" r="15" stroke-dasharray="2 3" />
                <line x1="100" y1="25" x2="100" y2="125" stroke-dasharray="1 3" />
                <line x1="40" y1="80" x2="160" y2="80" stroke-dasharray="1 3" />
              </g>
              <text x="100" y="140" font-size="9" text-anchor="middle" class="fill-content-muted font-semibold tracking-wide">
                Bitte Gewerk auswählen
              </text>
            </svg>

            <!-- Kamin / Kachelofen SVG -->
            <svg v-else-if="projectType === 'kamin' || projectType === 'kachelofen'" viewBox="0 0 200 160" class="w-full h-auto rounded-lg border border-content-muted/10 bg-surface-sand/20">
              <defs>
                <pattern id="grid-kamin" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" stroke-width="0.5" class="text-brand-300/15" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#grid-kamin)" />

              <!-- Room walls (draft backdrop) -->
              <g stroke="currentColor" stroke-width="0.8" class="text-brand-300/30" fill="none">
                <line x1="100" y1="130" x2="20" y2="90" />
                <line x1="100" y1="130" x2="180" y2="90" />
                <line x1="100" y1="130" x2="100" y2="30" />
              </g>

              <!-- Steel pipe connecting to chimney -->
              <g v-if="chimneyNeeded === 'yes'" stroke="currentColor" stroke-width="1.2" class="text-ink-600" fill="none">
                <path :d="`M ${chimneyPipePts.x1},${chimneyPipePts.y1} L ${chimneyPipePts.x2},${chimneyPipePts.y2} L ${chimneyPipePts.x3},${chimneyPipePts.y3}`" />
              </g>

              <!-- 3D Stove Wedge (Corner model) -->
              <g v-if="shape === 'corner'">
                <!-- Stove Left-Front Face -->
                <polygon 
                  :points="`${stovePts.p_left.x},${stovePts.p_left.y} ${stovePts.p_front_l.x},${stovePts.p_front_l.y} ${stovePts.t_front_l.x},${stovePts.t_front_l.y} ${stovePts.t_left.x},${stovePts.t_left.y}`" 
                  :fill="projectType === 'kachelofen' ? 'rgb(126, 44, 11)' : '#292320'" 
                  stroke="#1c1816" 
                  stroke-width="1"
                />
                <!-- Stove Front Center Face -->
                <polygon 
                  :points="`${stovePts.p_front_l.x},${stovePts.p_front_l.y} ${stovePts.p_front_r.x},${stovePts.p_front_r.y} ${stovePts.t_front_r.x},${stovePts.t_front_r.y} ${stovePts.t_front_l.x},${stovePts.t_front_l.y}`" 
                  :fill="projectType === 'kachelofen' ? 'rgb(198, 67, 4)' : '#3b322c'" 
                  stroke="#1c1816" 
                  stroke-width="1"
                />
                <!-- Stove Right-Front Face -->
                <polygon 
                  :points="`${stovePts.p_front_r.x},${stovePts.p_front_r.y} ${stovePts.p_right.x},${stovePts.p_right.y} ${stovePts.t_right.x},${stovePts.t_right.y} ${stovePts.t_front_r.x},${stovePts.t_front_r.y}`" 
                  :fill="projectType === 'kachelofen' ? 'rgb(103, 38, 13)' : '#1c1816'" 
                  stroke="#1c1816" 
                  stroke-width="1"
                />
                <!-- Stove Top Face -->
                <polygon 
                  :points="`${stovePts.t_back.x},${stovePts.t_back.y} ${stovePts.t_left.x},${stovePts.t_left.y} ${stovePts.t_front_l.x},${stovePts.t_front_l.y} ${stovePts.t_front_r.x},${stovePts.t_front_r.y} ${stovePts.t_right.x},${stovePts.t_right.y}`" 
                  :fill="projectType === 'kachelofen' ? 'rgb(161, 54, 6)' : '#4a423e'" 
                  stroke="#292320" 
                  stroke-width="0.8"
                />
              </g>

              <!-- 3D Stove Box (Straight or Tunnel) -->
              <g v-else>
                <!-- Stove Left-Front Face -->
                <polygon 
                  :points="`${stovePts.p001.x},${stovePts.p001.y} ${stovePts.p101.x},${stovePts.p101.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p011.x},${stovePts.p011.y}`" 
                  :fill="projectType === 'kachelofen' ? 'rgb(198, 67, 4)' : '#292320'" 
                  stroke="#1c1816" 
                  stroke-width="1"
                />
                <!-- Stove Right-Front Face -->
                <polygon 
                  :points="`${stovePts.p100.x},${stovePts.p100.y} ${stovePts.p101.x},${stovePts.p101.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p110.x},${stovePts.p110.y}`" 
                  :fill="projectType === 'kachelofen' ? 'rgb(103, 38, 13)' : '#1c1816'" 
                  stroke="#1c1816" 
                  stroke-width="1"
                />
                <!-- Stove Top Face -->
                <polygon 
                  :points="`${stovePts.p010.x},${stovePts.p010.y} ${stovePts.p110.x},${stovePts.p110.y} ${stovePts.p111.x},${stovePts.p111.y} ${stovePts.p011.x},${stovePts.p011.y}`" 
                  :fill="projectType === 'kachelofen' ? 'rgb(161, 54, 6)' : '#4a423e'" 
                  stroke="#292320" 
                  stroke-width="0.8"
                />
              </g>

              <!-- Glowing Fire glass pane -->
              <polygon 
                :points="firePoly" 
                fill="rgb(227, 82, 5)" 
                stroke="rgba(255,255,255,0.2)" 
                stroke-width="0.8"
                class="flame-glow"
              />

              <!-- Second glass pane for Tunnel layout -->
              <polygon 
                v-if="shape === 'tunnel'"
                :points="`${projectStove(12, 12, 10).x},${projectStove(12, 12, 10).y} ${projectStove(12, 12, 25).x},${projectStove(12, 12, 25).y} ${projectStove(12, 30, 25).x},${projectStove(12, 30, 25).y} ${projectStove(12, 30, 10).x},${projectStove(12, 30, 10).y}`" 
                fill="rgb(227, 82, 5)" 
                stroke="rgba(255,255,255,0.2)" 
                stroke-width="0.8"
                class="flame-glow"
              />

              <!-- Water-connection indicator -->
              <g v-if="waterConnection === 'yes'">
                <!-- Small blue circular pipe indicator -->
                <path d="M 25,145 L 35,145 M 30,140 L 30,150" stroke="#0284c7" stroke-width="1.5" />
                <text x="40" y="148" font-size="8" class="fill-sky-700 font-bold">H2O</text>
              </g>

              <!-- Speichermasse storage rings indicator -->
              <g v-if="storageMass === 'yes'" stroke="rgba(251, 146, 60, 0.6)" stroke-width="0.8" stroke-dasharray="2 2" fill="none">
                <line :x1="stovePts.p011.x - 2" :y1="stovePts.p011.y + 12" :x2="stovePts.p111.x + 2" :y2="stovePts.p111.y + 12" />
                <line :x1="stovePts.p011.x - 2" :y1="stovePts.p011.y + 18" :x2="stovePts.p111.x + 2" :y2="stovePts.p111.y + 18" />
              </g>
            </svg>

            <!-- Fliesenarbeiten SVG -->
            <svg v-else-if="projectType === 'fliesen'" viewBox="0 0 200 160" class="w-full h-auto rounded-lg border border-content-muted/10 bg-surface-sand/20">
              <defs>
                <pattern id="tile-pattern-straight" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.2" class="text-brand-600/30" />
                </pattern>
                <pattern id="tile-pattern-diagonal" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
                  <rect width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.2" class="text-brand-600/30" />
                </pattern>
                <linearGradient id="premium-marble" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f2eae0" />
                  <stop offset="55%" stop-color="#fff" />
                  <stop offset="100%" stop-color="#e2cfbb" />
                </linearGradient>
              </defs>
              
              <!-- Room walls blueprint draft -->
              <g stroke="currentColor" stroke-width="0.8" class="text-brand-300/30" fill="none">
                <line x1="100" y1="95" x2="20" y2="55" />
                <line x1="100" y1="95" x2="180" y2="55" />
                <line x1="100" y1="95" x2="100" y2="20" />
              </g>
              
              <!-- Rotated/Scaled plane for 3D floor tiles layout -->
              <g transform="translate(100, 95) scale(1, 0.5) rotate(45)">
                <!-- Plane limits -->
                <rect 
                  :x="-tilePlaneSize / 2" 
                  :y="-tilePlaneSize / 2" 
                  :width="tilePlaneSize" 
                  :height="tilePlaneSize" 
                  :fill="materialTier === 'premium' ? 'url(#premium-marble)' : 'rgba(255,255,255,0.75)'" 
                  stroke="currentColor" 
                  stroke-width="1.5"
                  class="text-brand-600/50"
                />
                <!-- Tile patterns overlay -->
                <rect 
                  :x="-tilePlaneSize / 2" 
                  :y="-tilePlaneSize / 2" 
                  :width="tilePlaneSize" 
                  :height="tilePlaneSize" 
                  :fill="pattern === 'diagonal' ? 'url(#tile-pattern-diagonal)' : 'url(#tile-pattern-straight)'" 
                />
              </g>
            </svg>

            <!-- Schornsteinbau SVG -->
            <svg v-else-if="projectType === 'schornstein'" viewBox="0 0 200 160" class="w-full h-auto rounded-lg border border-content-muted/10 bg-surface-sand/20">
              <defs>
                <linearGradient id="steel-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#94a3b8" />
                  <stop offset="50%" stop-color="#cbd5e1" />
                  <stop offset="100%" stop-color="#64748b" />
                </linearGradient>
                <linearGradient id="copper-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#b45309" />
                  <stop offset="50%" stop-color="#fb923c" />
                  <stop offset="100%" stop-color="#78350f" />
                </linearGradient>
              </defs>

              <g stroke="currentColor" stroke-width="0.8" class="text-brand-300/35" fill="none">
                <line x1="10" y1="140" x2="190" y2="140" stroke-width="1" />
                
                <line x1="70" y1="140" x2="70" y2="70" />
                <line x1="70" y1="70" x2="110" y2="40" />
                <line x1="110" y1="40" x2="150" y2="70" stroke-dasharray="2 2" />
                <line x1="70" y1="70" x2="30" y2="70" />
                
                <line x1="20" y1="105" x2="70" y2="105" />
              </g>

              <!-- Exterior Double-wall flue -->
              <g v-if="chimneyType === 'exterior'">
                <!-- Brackets -->
                <line x1="70" y1="120" x2="88" y2="120" stroke="currentColor" class="text-ink-500" stroke-width="1.5" />
                <line x1="70" y1="85" x2="88" y2="85" stroke="currentColor" class="text-ink-500" stroke-width="1.5" />
                
                <!-- Pipe -->
                <rect 
                  x="88" 
                  :y="chimneyPipeTopY" 
                  width="10" 
                  :height="135 - chimneyPipeTopY" 
                  :fill="materialTier === 'premium' ? 'url(#copper-gradient)' : 'url(#steel-gradient)'" 
                  stroke="currentColor" 
                  class="text-ink-900" 
                  stroke-width="0.8" 
                />
                <!-- Connection elbow -->
                <rect 
                  x="65" 
                  y="115" 
                  width="23" 
                  height="8" 
                  :fill="materialTier === 'premium' ? 'url(#copper-gradient)' : 'url(#steel-gradient)'" 
                  stroke="currentColor" 
                  class="text-ink-900" 
                  stroke-width="0.8" 
                />
                <!-- Rain hat -->
                <path :d="`M ${86},${chimneyPipeTopY} L ${100},${chimneyPipeTopY} L ${93},${chimneyPipeTopY - 5} Z`" fill="currentColor" class="text-ink-600" />
              </g>

              <!-- Interior Leichtbau F90 flue -->
              <g v-if="chimneyType === 'interior'">
                <!-- Shaft enclosing F90 -->
                <rect 
                  x="53" 
                  :y="chimneyPipeTopY" 
                  width="14" 
                  :height="138 - chimneyPipeTopY" 
                  fill="rgba(74, 66, 62, 0.08)" 
                  stroke="currentColor" 
                  stroke-width="0.8" 
                  stroke-dasharray="2 3"
                  class="text-brand-500" 
                />
                
                <!-- Steel tube inside -->
                <rect 
                  x="57" 
                  :y="chimneyPipeTopY - 3" 
                  width="6" 
                  :height="141 - chimneyPipeTopY" 
                  fill="url(#steel-gradient)" 
                  stroke="currentColor" 
                  class="text-ink-900" 
                  stroke-width="0.8" 
                />
                
                <!-- Weathering flashing at roof line (y ~ 55) -->
                <polygon points="45,58 75,58 65,52 55,52" fill="currentColor" class="text-ink-500" />
                <path :d="`M ${54},${chimneyPipeTopY - 3} L ${66},${chimneyPipeTopY - 3} L ${60},${chimneyPipeTopY - 7} Z`" fill="currentColor" class="text-ink-600" />
              </g>

              <!-- Chimney sanierung (old brick stack) -->
              <g v-if="chimneyType === 'sanierung'">
                <rect 
                  x="50" 
                  y="30" 
                  width="20" 
                  height="110" 
                  fill="rgba(227, 82, 5, 0.04)" 
                  stroke="currentColor" 
                  stroke-width="1.2" 
                  class="text-brand-300" 
                />
                <line x1="50" y1="55" x2="70" y2="55" stroke="currentColor" class="text-brand-300/30" stroke-width="0.8" />
                <line x1="50" y1="85" x2="70" y2="85" stroke="currentColor" class="text-brand-300/30" stroke-width="0.8" />
                <line x1="50" y1="115" x2="70" y2="115" stroke="currentColor" class="text-brand-300/30" stroke-width="0.8" />
                
                <!-- Stainless lining inside -->
                <rect 
                  x="57" 
                  y="22" 
                  width="6" 
                  height="118" 
                  fill="url(#steel-gradient)" 
                  stroke="currentColor" 
                  class="text-ink-900" 
                  stroke-width="0.8" 
                  opacity="0.85" 
                />
                
                <rect x="47" y="30" width="26" height="4" fill="currentColor" class="text-ink-500" />
                <path d="M 54,22 L 66,22 L 60,17 Z" fill="currentColor" class="text-ink-600" />
              </g>
            </svg>
          </div>

          <!-- Bill of Materials List (Cost Breakdown) -->
          <div class="mt-5 border-t border-content-muted/10 pt-4">
            <h5 class="text-[11px] font-bold uppercase tracking-wider text-brand-600 mb-2">Detaillierte Posten</h5>
            
            <div v-if="lineItems.length > 0" class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <div 
                v-for="item in lineItems" 
                :key="item.label"
                class="flex justify-between items-center text-[10px] py-1 border-b border-content-muted/5 last:border-b-0 text-content"
              >
                <span class="font-medium mr-2">{{ item.label }}</span>
                <span class="font-bold shrink-0 text-ink-900">{{ formatPrice(item.price) }}</span>
              </div>
            </div>
            <p v-else class="text-[10px] text-content-muted italic">
              Wählen Sie Optionen aus, um die detaillierte Postenaufstellung zu sehen.
            </p>
          </div>

        </div>

        <!-- Copy / CTA buttons at the bottom of the sidebar -->
        <div v-if="projectType" class="mt-6 border-t border-content-muted/10 pt-4 space-y-3">
          <div class="flex gap-2">
            <!-- Reset Button -->
            <button 
              class="flex items-center justify-center rounded-lg border border-content-muted/20 px-2.5 py-2 text-content hover:bg-surface-muted hover:border-content-muted/40 transition-all text-xs font-semibold"
              title="Zurücksetzen"
              type="button"
              @click="reset"
            >
              <AppIcon name="rotate" class="h-4 w-4" />
            </button>

            <!-- Copy Summary Button -->
            <button 
              class="flex-1 flex items-center justify-center gap-2 rounded-lg border border-content-muted/20 bg-surface px-3 py-2 text-xs font-semibold text-content hover:bg-surface-muted transition-all"
              type="button"
              @click="copySummary"
            >
              <AppIcon v-if="showCopied" name="check" class="h-4 w-4 text-emerald-600" />
              <AppIcon v-else name="swatch" class="h-4 w-4" />
              <span>{{ showCopied ? 'Kopiert!' : 'Kalkulation kopieren' }}</span>
            </button>
          </div>

          <!-- Contact Form CTA -->
          <BaseButton 
            :to="{ 
              name: 'contact', 
              query: { 
                topic: projectType === 'fliesen' ? 'fliesenarbeiten' : projectType === 'schornstein' ? 'schornsteinbau' : 'kachelofen-kaminbau', 
                note: contactMessage,
                source: 'budget'
              } 
            }"
            block
            size="md"
          >
            Angebot &amp; 3D-Entwurf anfragen
            <AppIcon name="arrow" class="h-4 w-4" />
          </BaseButton>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes flameAnimation {
  0%, 100% { fill: rgb(227, 82, 5); filter: drop-shadow(0 0 1px rgb(227, 82, 5)); }
  50% { fill: rgb(245, 158, 11); filter: drop-shadow(0 0 4px rgb(235, 125, 63)); }
}
.flame-glow {
  animation: flameAnimation 1.6s infinite ease-in-out;
}
</style>

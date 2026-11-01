/**
 * 3D-Planning content — benefits + service columns for Planning3DSection
 * and the /leistungen/3d-planung detail page, plus the examples that drive
 * Planning3DExplorer (views, frame arcs, x-ray, decisions/variants, models).
 */
export const planningContentReview = {
  approvedForLaunch: false,
  // All planning visuals are AI-generated demo content (see public/images/PROMPTS.md).
  // `demoContent` tells scripts/check-content-assets.mjs not to treat the
  // missing operator/media approvals as launch blockers.
  demoContent: true,
  note: '3D planning examples and generated planning visuals must be reviewed against the final operator workflow before launch.',
}

const pendingPlanningApproval = {
  operatorApproved: false,
  mediaRightsApproved: false,
  note: 'Confirm the planning example reflects a real operator workflow and that generated/visual media is approved before launch.',
}

export const planningBenefits = [
  {
    icon: 'eye',
    title: 'Räumliche Visualisierung',
    text: 'Fotorealistische Darstellung von Ofen und Flächen — im echten Raum, aus jedem Blickwinkel.',
  },
  {
    icon: 'swatch',
    title: 'Materialauswahl',
    text: 'Kacheln, Putz, Fliesen und Naturstein am Modell vergleichen, bevor Sie sich festlegen.',
  },
  {
    icon: 'calculator',
    title: 'Budgetrahmen schätzen',
    text: 'Form, Material und Ausstattung aus dem Entwurf direkt in den Budget-Kalkulator übernehmen — als erste Orientierung vor dem verbindlichen Angebot.',
  },
]

export const planningServices = [
  {
    title: 'Maßgeschneidertes Design',
    text: 'Entwürfe passgenau für Ihren Raum und Ihren Stil.',
  },
  {
    title: 'Technische Machbarkeit',
    text: 'Statik, Anschlüsse und Brandschutz von Anfang an mitgedacht.',
  },
  {
    title: 'Materialwelt',
    text: 'Kuratierte Oberflächen aus Kachel, Stein und Fliese.',
  },
]

// Decision types are defined per example (`decisions`) because each use case
// has different meaningful choices; choices without a `variants` entry render
// as plain (non-clickable) chips.
//
// `variants[key][choice]` schema:
//   { image, text }          whole-image choice — swaps the stage photo; only
//                            one whole-image choice is active at a time.
//   { layer, text }          stackable choice — `layer` is a transparent
//                            overlay (PNG/WebP with alpha, same 16/10 framing
//                            as `image`) composited over the stage, so one
//                            layer per decision key can be combined with the
//                            others (e.g. Material + Sichtscheibe). Layers
//                            also sit on top of an active whole-image choice.
//   `budget`                 optional per example: `{ typ, params }` maps the
//                            configured choices onto BudgetEstimator query
//                            params (`typ`, `form`, `material`) for the
//                            "Budget schätzen" hand-off.
//   `model`                  optional: `{ src, poster, label, text, hotspots }`
//                            enables the glTF stage (ExplorerStageModel);
//                            hotspots use model-viewer's `data-position` /
//                            `data-normal` strings in model space.
export const planningExamples = [
  {
    id: 'kachelofen-eckscheibe',
    category: 'Ofen',
    title: 'Kachelofen mit Eckscheibe',
    label: 'Eckscheibe',
    image: '/images/planning-example-kachelofen-eckscheibe.webp',
    views: [
      {
        label: 'Überblick',
        image: '/images/planning-example-kachelofen-eckscheibe.webp',
        text: 'Frontale Gesamtansicht mit Sitzbank, Ofenkörper und Eckscheibe.',
        annotations: [
          { label: 'Sitzbank', top: '66%', left: '27%' },
          { label: 'Sichtscheibe', top: '58%', left: '50%' },
          { label: 'Keramikfläche', top: '38%', left: '45%' },
          { label: 'Speicherkörper', top: '29%', left: '54%' },
        ],
        // Glass zone for the simulated fire overlay (box, % of the photo, like
        // the annotations; only on views where the firebox glass is visible).
        fire: { top: '47%', left: '46%', width: '7%', height: '13%' },
      },
      {
        label: 'Perspektive',
        image: '/images/planning-example-kachelofen-perspective.webp',
        text: 'Seitliche Perspektive für Tiefe, Sitzbank und Raumwirkung.',
        annotations: [
          { label: 'Raumtiefe', top: '30%', left: '44%' },
          { label: 'Sitzkante', top: '69%', left: '39%' },
          { label: 'Feuerraum', top: '53%', left: '60%' },
        ],
      },
      {
        label: 'Detail',
        image: '/images/planning-example-kachelofen-detail.webp',
        text: 'Detailansicht von Keramik, Fugenbild, Kanten und Feuerraum.',
        annotations: [
          { label: 'Fugenbild', top: '40%', left: '40%' },
          { label: 'Kachelkante', top: '45%', left: '64%' },
          { label: 'Feuerraum', top: '45%', left: '73%' },
        ],
      },
    ],
    // Interior schema for the X-ray view: a real technical cutaway rendering
    // (`image`) explains the hidden build quality — Heizzüge, Schamotte,
    // Speichermasse — that justifies a handcrafted stove.
    xray: {
      label: 'Innenaufbau',
      image: '/images/planning-cutaway-kachelofen.webp',
      text: 'Schnitt durch den Speicherofen: Heizzüge, Schamottekern und Speichermasse zeigen, warum ein handgesetzter Speicherofen stundenlang Strahlungswärme abgibt.',
      layers: [
        {
          label: 'Schamotte-Feuerraum',
          text: 'Schwerer Feuerraumkern aus Schamottesteinen nimmt die Hitze des Abbrands auf.',
        },
        {
          label: 'Keramische Heizzüge',
          text: 'Mäanderförmig geführte Züge leiten die heißen Gase durch die Speichermasse.',
        },
        {
          label: 'Speichermasse',
          text: 'Rund 1.000 kg Masse geben die Wärme über viele Stunden als milde Strahlung ab.',
        },
        {
          label: 'Dämmebene',
          text: 'Rückseitige Dämmung schützt die Wand und lenkt die Wärme in den Raum.',
        },
      ],
      annotations: [
        { label: 'Heizzüge', top: '40%', left: '54.5%' },
        { label: 'Schamottekern', top: '59%', left: '69%' },
        { label: 'Speichermasse', top: '46%', left: '48.5%' },
        { label: 'Dämmebene', top: '54%', left: '51.5%' },
      ],
    },
    // True 360° turntable rendered from the 3D model (npm run gen:turntable).
    frames: [
      { angle: -165, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m165.webp' },
      { angle: -150, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m150.webp' },
      { angle: -135, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m135.webp' },
      { angle: -120, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m120.webp' },
      { angle: -105, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m105.webp' },
      { angle: -90, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m90.webp' },
      { angle: -75, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m75.webp' },
      { angle: -60, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m60.webp' },
      { angle: -45, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m45.webp' },
      { angle: -30, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m30.webp' },
      { angle: -15, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-m15.webp' },
      { angle: 0, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-0.webp' },
      { angle: 15, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-15.webp' },
      { angle: 30, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-30.webp' },
      { angle: 45, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-45.webp' },
      { angle: 60, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-60.webp' },
      { angle: 75, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-75.webp' },
      { angle: 90, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-90.webp' },
      { angle: 105, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-105.webp' },
      { angle: 120, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-120.webp' },
      { angle: 135, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-135.webp' },
      { angle: 150, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-150.webp' },
      { angle: 165, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-165.webp' },
      { angle: 180, image: '/images/planning-frames/kachelofen-eckscheibe/turntable-180.webp' },
    ],
    decisions: [
      { key: 'form', label: 'Form', choices: ['gerade Linie', 'Ecke', 'Sitzbank'] },
      { key: 'material', label: 'Material', choices: ['Keramik', 'Naturstein', 'Putz'] },
      { key: 'view', label: 'Sichtscheibe', choices: ['frontal', 'Eckscheibe', 'Panorama'] },
      { key: 'detail', label: 'Detail', choices: ['Fuge', 'Kante', 'Anschluss'] },
    ],
    budget: {
      typ: 'kachelofen',
      params: {
        form: {
          'gerade Linie': { form: 'straight' },
          Ecke: { form: 'corner' },
          Sitzbank: { form: 'corner' },
        },
        material: {
          Keramik: { material: 'standard' },
          Naturstein: { material: 'premium' },
          Putz: { material: 'standard' },
        },
      },
    },
    // Placeholder glTF (see public/models/README.md) — replace with the real
    // Draco/KTX2-compressed scan or CAD export of this stove.
    model: {
      src: '/models/kachelofen-eckscheibe.glb',
      poster: '/images/planning-example-kachelofen-eckscheibe.webp',
      label: '3D-Modell',
      text: 'Drehen, zoomen, Materialien je Bauteil kombinieren — auf dem Smartphone auch in Ihrem Raum (AR).',
      hotspots: [
        { label: 'Sichtscheibe', position: '0.5 0.68 0.5', normal: '0.7 0 0.7' },
        { label: 'Sitzbank', position: '-0.95 0.53 -0.1', normal: '0 1 0' },
        { label: 'Speicherkörper', position: '-0.49 1.1 0.1', normal: '-1 0 0' },
        { label: 'Sims', position: '0 1.52 0.52', normal: '0 0.3 0.95' },
      ],
      // Per-part materials. `part` is the glTF material name in the model; the
      // explorer applies the PBR factors through <model-viewer>'s scene-graph
      // API, so every part can be combined with every other.
      parts: [
        {
          key: 'Kacheln',
          label: 'Kacheln',
          options: [
            { key: 'creme', label: 'Creme glasiert', color: [0.93, 0.86, 0.72], roughness: 0.18 },
            { key: 'weiss', label: 'Weiß matt', color: [0.95, 0.95, 0.93], roughness: 0.7 },
            { key: 'tannengruen', label: 'Tannengrün', color: [0.16, 0.32, 0.24], roughness: 0.15 },
            { key: 'ultramarin', label: 'Ultramarin', color: [0.12, 0.2, 0.45], roughness: 0.15 },
            { key: 'terrakotta', label: 'Terrakotta', color: [0.72, 0.4, 0.26], roughness: 0.35 },
            { key: 'anthrazit', label: 'Anthrazit', color: [0.16, 0.16, 0.17], roughness: 0.3 },
          ],
        },
        {
          key: 'Sims',
          label: 'Sims',
          options: [
            { key: 'creme', label: 'Creme glasiert', color: [0.93, 0.86, 0.72], roughness: 0.2 },
            {
              key: 'naturstein',
              label: 'Naturstein grau',
              color: [0.6, 0.58, 0.55],
              roughness: 0.8,
            },
            { key: 'anthrazit', label: 'Anthrazit', color: [0.16, 0.16, 0.17], roughness: 0.3 },
          ],
        },
        {
          key: 'Auflage',
          label: 'Bank & Ablage',
          options: [
            { key: 'eiche', label: 'Eiche geölt', color: [0.62, 0.45, 0.27], roughness: 0.55 },
            { key: 'nussbaum', label: 'Nussbaum', color: [0.36, 0.24, 0.16], roughness: 0.5 },
            { key: 'speckstein', label: 'Speckstein', color: [0.38, 0.4, 0.42], roughness: 0.4 },
            {
              key: 'naturstein',
              label: 'Naturstein hell',
              color: [0.78, 0.74, 0.68],
              roughness: 0.6,
            },
          ],
        },
        {
          key: 'Sockel',
          label: 'Sockel',
          options: [
            { key: 'naturstein', label: 'Naturstein', color: [0.55, 0.52, 0.48], roughness: 0.85 },
            { key: 'beton', label: 'Beton', color: [0.6, 0.6, 0.6], roughness: 0.9 },
            { key: 'anthrazit', label: 'Anthrazit', color: [0.16, 0.16, 0.17], roughness: 0.6 },
          ],
        },
        {
          key: 'Rahmen',
          label: 'Rahmen & Rohr',
          options: [
            {
              key: 'schwarz',
              label: 'Schwarz',
              color: [0.1, 0.1, 0.1],
              roughness: 0.45,
              metallic: 0.6,
            },
            {
              key: 'edelstahl',
              label: 'Edelstahl',
              color: [0.75, 0.75, 0.75],
              roughness: 0.3,
              metallic: 0.95,
            },
            {
              key: 'bronze',
              label: 'Bronze',
              color: [0.55, 0.4, 0.25],
              roughness: 0.4,
              metallic: 0.9,
            },
          ],
        },
        {
          key: 'Putz',
          label: 'Fugen',
          options: [
            { key: 'weiss', label: 'Weiß', color: [0.9, 0.89, 0.86], roughness: 0.95 },
            { key: 'hellgrau', label: 'Hellgrau', color: [0.7, 0.7, 0.68], roughness: 0.95 },
            { key: 'anthrazit', label: 'Anthrazit', color: [0.2, 0.2, 0.2], roughness: 0.9 },
          ],
        },
      ],
      // Named combinations; the first one matches the model's built-in defaults.
      presets: [
        {
          key: 'landhaus',
          label: 'Landhaus',
          choices: {
            Kacheln: 'creme',
            Sims: 'creme',
            Auflage: 'eiche',
            Sockel: 'naturstein',
            Rahmen: 'schwarz',
            Putz: 'weiss',
          },
        },
        {
          key: 'modern',
          label: 'Modern',
          choices: {
            Kacheln: 'anthrazit',
            Sims: 'anthrazit',
            Auflage: 'speckstein',
            Sockel: 'beton',
            Rahmen: 'edelstahl',
            Putz: 'hellgrau',
          },
        },
        {
          key: 'natur',
          label: 'Natur',
          choices: {
            Kacheln: 'tannengruen',
            Sims: 'naturstein',
            Auflage: 'nussbaum',
            Sockel: 'naturstein',
            Rahmen: 'bronze',
            Putz: 'weiss',
          },
        },
      ],
      // Emissive factors toggled by "Feuer an" (part → [r, g, b]).
      fire: {
        on: { Glut: [1, 0.38, 0.08], Glas: [0.18, 0.06, 0.01] },
        off: { Glut: [0.12, 0.03, 0], Glas: [0, 0, 0] },
      },
    },
    // Decision simulation: per choice an alternative visualization of this example.
    // Choices matching the base configuration point at the base Überblick image.
    variants: {
      form: {
        'gerade Linie': {
          image: '/images/planning-variants/kachelofen-eckscheibe/form-gerade-linie.webp',
          text: 'Gerader, wandbündiger Ofenkörper ohne Eckversatz.',
        },
        Ecke: {
          image: '/images/planning-example-kachelofen-eckscheibe.webp',
          text: 'Eckform mit gestuftem Speicherkörper — die Basisvariante.',
        },
        Sitzbank: {
          image: '/images/planning-variants/kachelofen-eckscheibe/form-sitzbank.webp',
          text: 'Umlaufende beheizte Sitzbank entlang der Wand.',
        },
      },
      material: {
        Keramik: {
          image: '/images/planning-example-kachelofen-eckscheibe.webp',
          text: 'Handgesetzte Keramikkacheln in Creme — die Basisvariante.',
        },
        Naturstein: {
          image: '/images/planning-variants/kachelofen-eckscheibe/material-naturstein.webp',
          text: 'Warme Natursteinplatten mit sichtbarer Textur.',
        },
        Putz: {
          image: '/images/planning-variants/kachelofen-eckscheibe/material-putz.webp',
          text: 'Monolithisch glatt verputzte Oberfläche ohne Fugen.',
        },
      },
      view: {
        frontal: {
          image: '/images/planning-variants/kachelofen-eckscheibe/view-frontal.webp',
          text: 'Flache frontale Sichtscheibe.',
        },
        Eckscheibe: {
          image: '/images/planning-example-kachelofen-eckscheibe.webp',
          text: 'Über Eck verglaster Feuerraum — die Basisvariante.',
        },
        Panorama: {
          image: '/images/planning-variants/kachelofen-eckscheibe/view-panorama.webp',
          text: 'Dreiseitig umlaufende Panorama-Sichtscheibe.',
        },
      },
      detail: {
        Fuge: {
          image: '/images/planning-variants/kachelofen-eckscheibe/detail-fuge.webp',
          text: 'Fugenbild und Glanzgrad der Keramik im Detail.',
        },
        Kante: {
          image: '/images/planning-variants/kachelofen-eckscheibe/detail-kante.webp',
          text: 'Handgearbeitete Kachelkante und Eckprofil.',
        },
        Anschluss: {
          image: '/images/planning-variants/kachelofen-eckscheibe/detail-anschluss.webp',
          text: 'Sauberer Anschluss von Ofenkörper, Wand und Boden.',
        },
      },
    },
    motif: 'flame',
    tone: 'ember',
    description:
      'Räumlicher Entwurf eines handgesetzten Kachelofens mit Sitzbank, keramischer Oberfläche und Eck-Sichtfenster.',
    specs: ['Kachelkeramik', 'Sitzbank', 'Eckscheibe', 'Speicherwärme'],
    annotations: [
      { label: 'Sitzbank', top: '66%', left: '27%' },
      { label: 'Sichtscheibe', top: '58%', left: '50%' },
      { label: 'Keramikfläche', top: '38%', left: '45%' },
      { label: 'Speicherkörper', top: '29%', left: '54%' },
    ],
    review: { ...pendingPlanningApproval },
  },
  {
    id: 'schornstein-kaminofen',
    category: 'Schornstein',
    title: 'Kaminofen mit Außenschornstein',
    label: 'Schornstein',
    image: '/images/planning-example-schornstein-exterior-v2.webp',
    views: [
      {
        label: 'Schnitt',
        image: '/images/planning-example-schornstein-kaminofen-v2.webp',
        text: 'Innen- und Außenbezug mit Ofenanschluss und Wanddurchführung.',
        annotations: [
          { label: 'Wanddurchführung', top: '27%', left: '54%' },
          { label: 'Ofenanschluss', top: '42%', left: '30%' },
          { label: 'Außenführung', top: '55%', left: '72%' },
          { label: 'Brandschutz', top: '16%', left: '60%' },
        ],
        fire: { top: '67%', left: '22%', width: '9%', height: '20%' },
      },
      {
        label: 'Außen',
        image: '/images/planning-example-schornstein-exterior-v2.webp',
        text: 'Fassadenansicht mit Schornsteinführung, Haltern und Dachabschluss.',
        annotations: [
          { label: 'Dachabschluss', top: '6%', left: '70%' },
          { label: 'Rohrführung', top: '19%', left: '70%' },
          { label: 'Wandhalter', top: '49%', left: '67%' },
          { label: 'Wandanschluss', top: '85%', left: '68%' },
        ],
      },
      {
        label: 'Anschluss',
        image: '/images/planning-example-schornstein-detail-v2.webp',
        text: 'Detailansicht von Wanddurchführung, Schelle und Edelstahlrohr.',
        annotations: [
          { label: 'Edelstahlrohr', top: '12%', left: '44%' },
          { label: 'Dichtkragen', top: '30%', left: '76%' },
          { label: 'Schelle', top: '74%', left: '38%' },
          { label: 'Prüföffnung', top: '88%', left: '47%' },
        ],
      },
      {
        label: 'Bauteile',
        image: '/images/planning-explosion-schornstein.webp',
        text: 'Explosionszeichnung aller Bauteile: vom Sockel über Brennkammer und Heizgaszüge bis zum Rauchrohranschluss.',
        annotations: [
          { label: 'Rauchrohr', top: '7%', left: '54.5%' },
          { label: 'Schamotte', top: '34%', left: '54.5%' },
          { label: 'Feuerraumtür', top: '59.5%', left: '53%' },
          { label: 'Zuluft', top: '80%', left: '52.5%' },
        ],
      },
    ],
    frames: [
      { angle: -45, image: '/images/planning-frames/schornstein-kaminofen/frame-v2-01.webp' },
      { angle: 0, image: '/images/planning-frames/schornstein-kaminofen/frame-v2-02.webp' },
      { angle: 45, image: '/images/planning-frames/schornstein-kaminofen/frame-v2-03.webp' },
    ],
    // Interior schema for the X-ray view: double-wall flue construction.
    xray: {
      text: 'Innenaufbau des Schornsteinsystems: doppelwandiges Edelstahlrohr mit Dämmschale, Reinigungsöffnung und brandschutzsicherer Wanddurchführung.',
      layers: [
        {
          label: 'Edelstahl-Innenrohr',
          text: 'Säurebeständiges Innenrohr führt die Abgase sicher und zugstark ab.',
        },
        {
          label: 'Dämmschale',
          text: 'Mineralische Dämmung hält die Abgase heiß und den Schornsteinzug stabil.',
        },
        {
          label: 'Wanddurchführung',
          text: 'Geprüfte Durchführung mit Sicherheitsabstand zu brennbaren Bauteilen.',
        },
        {
          label: 'Reinigungsöffnung',
          text: 'Revisionsklappe für Schornsteinfeger, Kontrolle und Wartung.',
        },
      ],
      annotations: [
        { label: 'Innenrohr', top: '38%', left: '72%' },
        { label: 'Dämmschale', top: '52%', left: '73%' },
        { label: 'Wanddurchführung', top: '27%', left: '54%' },
        { label: 'Reinigungsöffnung', top: '86%', left: '70%' },
      ],
    },
    decisions: [
      { key: 'rohr', label: 'Rohr-Finish', choices: ['Edelstahl', 'Schwarz matt'] },
      { key: 'ofen', label: 'Ofenkörper', choices: ['Stahl schwarz', 'Speckstein'] },
    ],
    budget: {
      typ: 'schornstein',
      params: { ofen: { Speckstein: { material: 'premium' } } },
    },
    variants: {
      rohr: {
        Edelstahl: {
          image: '/images/planning-example-schornstein-kaminofen-v2.webp',
          text: 'Gebürstetes Edelstahlrohr — die Basisvariante.',
        },
        'Schwarz matt': {
          image: '/images/planning-variants/schornstein-kaminofen/rohr-schwarz-matt-v2.webp',
          text: 'Mattschwarz beschichtetes Rauchrohr und Außenführung.',
        },
      },
      ofen: {
        'Stahl schwarz': {
          image: '/images/planning-example-schornstein-kaminofen-v2.webp',
          text: 'Schwarzer Stahlkorpus — die Basisvariante.',
        },
        Speckstein: {
          image: '/images/planning-variants/schornstein-kaminofen/ofen-speckstein-v2.webp',
          text: 'Specksteinverkleidung mit längerer Wärmespeicherung.',
        },
      },
    },
    motif: 'chimney',
    tone: 'slate',
    description:
      'Planungsansicht für Kaminofen, Wanddurchführung und Edelstahl-Außenschornstein inklusive Anschlussdetails.',
    specs: ['Edelstahl', 'Wanddurchführung', 'Brandschutz', 'Ofenanschluss'],
    annotations: [
      { label: 'Dachabschluss', top: '6%', left: '70%' },
      { label: 'Rohrführung', top: '19%', left: '70%' },
      { label: 'Wandhalter', top: '49%', left: '67%' },
      { label: 'Wandanschluss', top: '85%', left: '68%' },
    ],
    review: { ...pendingPlanningApproval },
  },
  {
    id: 'bad-fliesen',
    category: 'Fliesen',
    title: 'Badplanung mit Großformaten',
    label: 'Bad',
    image: '/images/planning-example-bad-fliesen.webp',
    views: [
      {
        label: 'Überblick',
        image: '/images/planning-example-bad-fliesen.webp',
        text: 'Gesamtplanung mit Dusche, Wanne, Waschtisch und Fliesenraster.',
        annotations: [
          { label: 'Fliesenraster', top: '33%', left: '75%' },
          { label: 'Duschbereich', top: '52%', left: '36%' },
          { label: 'Nische', top: '41%', left: '36%' },
          { label: 'Bodenanschluss', top: '66%', left: '36%' },
        ],
      },
      {
        label: 'Raum',
        image: '/images/planning-example-bad-perspective.webp',
        text: 'Eingangsperspektive für Wegeführung, Licht und Materialwirkung.',
        annotations: [
          { label: 'Wegeführung', top: '62%', left: '47%' },
          { label: 'Lichtkante', top: '33%', left: '53%' },
          { label: 'Materialwirkung', top: '40%', left: '67%' },
        ],
      },
      {
        label: 'Detail',
        image: '/images/planning-example-bad-detail.webp',
        text: 'Duschdetail mit Nische, Bodenanschluss, Ablauf und Fugenbild.',
        annotations: [
          { label: 'Nische', top: '33%', left: '45%' },
          { label: 'Ablauf', top: '66%', left: '44%' },
          { label: 'Fugenbild', top: '48%', left: '62%' },
        ],
      },
    ],
    frames: [
      { angle: -60, image: '/images/planning-frames/bad-fliesen/frame-01.webp' },
      { angle: -40, image: '/images/planning-frames/bad-fliesen/frame-02.webp' },
      { angle: -20, image: '/images/planning-frames/bad-fliesen/frame-03.webp' },
      { angle: 0, image: '/images/planning-frames/bad-fliesen/frame-04.webp' },
      { angle: 20, image: '/images/planning-frames/bad-fliesen/frame-05.webp' },
      { angle: 40, image: '/images/planning-frames/bad-fliesen/frame-06.webp' },
      { angle: 60, image: '/images/planning-frames/bad-fliesen/frame-07.webp' },
    ],
    decisions: [
      { key: 'format', label: 'Format', choices: ['Großformat', 'Mosaikakzent'] },
      { key: 'farbwelt', label: 'Farbwelt', choices: ['Sand', 'Anthrazit'] },
    ],
    budget: {
      typ: 'fliesen',
      params: { format: { Mosaikakzent: { material: 'premium' } } },
    },
    variants: {
      format: {
        Großformat: {
          image: '/images/planning-example-bad-fliesen.webp',
          text: 'Großformatige Feinsteinzeugplatten — die Basisvariante.',
        },
        Mosaikakzent: {
          image: '/images/planning-variants/bad-fliesen/format-mosaikakzent.webp',
          text: 'Mosaik-Akzentwand in der Dusche, Großformat im Raum.',
        },
      },
      farbwelt: {
        Sand: {
          image: '/images/planning-example-bad-fliesen.webp',
          text: 'Warme Sandtöne — die Basisvariante.',
        },
        Anthrazit: {
          image: '/images/planning-variants/bad-fliesen/farbwelt-anthrazit.webp',
          text: 'Anthrazitfarbene Flächen für einen kontrastreichen Auftritt.',
        },
      },
    },
    motif: 'tile',
    tone: 'sand',
    description:
      'Fotorealistischer Badentwurf mit Fliesenraster, Dusche, Wanne und Materialabstimmung vor Ausführung.',
    specs: ['Großformat', 'Natursteinoptik', 'Duschbereich', 'Fugenbild'],
    annotations: [
      { label: 'Fliesenraster', top: '33%', left: '75%' },
      { label: 'Duschbereich', top: '52%', left: '36%' },
      { label: 'Nische', top: '41%', left: '36%' },
      { label: 'Bodenanschluss', top: '66%', left: '36%' },
    ],
    review: { ...pendingPlanningApproval },
  },
  {
    id: 'materialien',
    category: 'Material',
    title: 'Material- und Detailauswahl',
    label: 'Material',
    image: '/images/planning-example-materialien.webp',
    views: [
      {
        label: 'Detail',
        image: '/images/planning-example-materialien.webp',
        text: 'Materialauswahl mit Keramik, Naturstein, Putz und Metallrahmen.',
        annotations: [
          { label: 'Keramik', top: '24%', left: '22%' },
          { label: 'Naturstein', top: '58%', left: '17%' },
          { label: 'Putzstruktur', top: '55%', left: '45%' },
          { label: 'Metallrahmen', top: '72%', left: '49%' },
        ],
      },
      {
        label: 'Board',
        image: '/images/planning-example-materialien-perspective.webp',
        text: 'Breitere Materialtafel neben dem geplanten Kamin.',
        annotations: [
          { label: 'Materialtafel', top: '52%', left: '33%' },
          { label: 'Kaminbezug', top: '35%', left: '68%' },
          { label: 'Oberfläche', top: '62%', left: '48%' },
        ],
      },
      {
        label: 'Makro',
        image: '/images/planning-example-materialien-detail.webp',
        text: 'Nahansicht der Oberflächen für Glanz, Relief und Steinstruktur.',
        annotations: [
          { label: 'Glanzgrad', top: '30%', left: '30%' },
          { label: 'Relief', top: '46%', left: '38%' },
          { label: 'Steinstruktur', top: '50%', left: '64%' },
        ],
      },
      {
        label: 'Musterboard',
        image: '/images/material-musterboard.webp',
        text: 'Beschriftetes Musterboard mit allen Material-Optionen: Kacheln, Naturstein, Putz, Stahlrahmen und Fugenfarben.',
        annotations: [
          { label: 'Kacheln', top: '28%', left: '38%' },
          { label: 'Naturstein', top: '38%', left: '78%' },
          { label: 'Putz', top: '57%', left: '25%' },
          { label: 'Stahlrahmen', top: '50%', left: '55%' },
          { label: 'Fugenfarben', top: '72%', left: '82%' },
        ],
      },
    ],
    frames: [
      { angle: -60, image: '/images/planning-frames/materialien/frame-01.webp' },
      { angle: -40, image: '/images/planning-frames/materialien/frame-02.webp' },
      { angle: -20, image: '/images/planning-frames/materialien/frame-03.webp' },
      { angle: 0, image: '/images/planning-frames/materialien/frame-04.webp' },
      { angle: 20, image: '/images/planning-frames/materialien/frame-05.webp' },
      { angle: 40, image: '/images/planning-frames/materialien/frame-06.webp' },
      { angle: 60, image: '/images/planning-frames/materialien/frame-07.webp' },
    ],
    decisions: [
      { key: 'farbton', label: 'Farbton', choices: ['Creme', 'Terrakotta'] },
      { key: 'oberflaeche', label: 'Oberfläche', choices: ['Matt', 'Glänzend'] },
    ],
    budget: {
      typ: 'kachelofen',
      params: { oberflaeche: { Glänzend: { material: 'premium' } } },
    },
    variants: {
      farbton: {
        Creme: {
          image: '/images/planning-example-materialien.webp',
          text: 'Cremefarbene Keramik und heller Stein — die Basisvariante.',
        },
        Terrakotta: {
          image: '/images/planning-variants/materialien/farbton-terrakotta.webp',
          text: 'Warme Terrakotta-Töne für Kachel und Putzfläche.',
        },
      },
      oberflaeche: {
        Matt: {
          image: '/images/planning-example-materialien.webp',
          text: 'Matte, geschliffene Oberflächen — die Basisvariante.',
        },
        Glänzend: {
          image: '/images/planning-variants/materialien/oberflaeche-glaenzend.webp',
          text: 'Glasierte, glänzende Keramik mit lebendigen Reflexen.',
        },
      },
    },
    motif: 'swatch',
    tone: 'ink',
    description:
      'Detailansicht für Kachel, Naturstein, Putzstruktur und Feuerraumrahmen als Entscheidungshilfe.',
    specs: ['Keramik', 'Naturstein', 'Putz', 'Metallrahmen'],
    annotations: [
      { label: 'Keramik', top: '24%', left: '22%' },
      { label: 'Naturstein', top: '58%', left: '17%' },
      { label: 'Putzstruktur', top: '55%', left: '45%' },
      { label: 'Metallrahmen', top: '72%', left: '49%' },
    ],
    review: { ...pendingPlanningApproval },
  },
]

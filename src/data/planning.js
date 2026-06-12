/**
 * 3D-Planning content — benefits + service columns for Planning3DSection
 * and the /leistungen/3d-planung detail page.
 */
export const planningContentReview = {
  approvedForLaunch: false,
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
    title: 'Präzise Kalkulation',
    text: 'Verbindliche Mengen und Kosten aus dem 3D-Modell — transparent und ohne Überraschungen.',
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
    frames: [
      { angle: -60, image: '/images/planning-frames/kachelofen-eckscheibe/frame-01.webp' },
      { angle: -40, image: '/images/planning-frames/kachelofen-eckscheibe/frame-02.webp' },
      { angle: -20, image: '/images/planning-frames/kachelofen-eckscheibe/frame-03.webp' },
      { angle: 0, image: '/images/planning-frames/kachelofen-eckscheibe/frame-04.webp' },
      { angle: 20, image: '/images/planning-frames/kachelofen-eckscheibe/frame-05.webp' },
      { angle: 40, image: '/images/planning-frames/kachelofen-eckscheibe/frame-06.webp' },
      { angle: 60, image: '/images/planning-frames/kachelofen-eckscheibe/frame-07.webp' },
    ],
    decisions: [
      { key: 'form', label: 'Form', choices: ['gerade Linie', 'Ecke', 'Sitzbank'] },
      { key: 'material', label: 'Material', choices: ['Keramik', 'Naturstein', 'Putz'] },
      { key: 'view', label: 'Sichtscheibe', choices: ['frontal', 'Eckscheibe', 'Panorama'] },
      { key: 'detail', label: 'Detail', choices: ['Fuge', 'Kante', 'Anschluss'] },
    ],
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
    image: '/images/planning-example-schornstein-kaminofen.webp',
    views: [
      {
        label: 'Schnitt',
        image: '/images/planning-example-schornstein-kaminofen.webp',
        text: 'Innen- und Außenbezug mit Ofenanschluss und Wanddurchführung.',
        annotations: [
          { label: 'Wanddurchführung', top: '52%', left: '50%' },
          { label: 'Ofenanschluss', top: '52%', left: '43%' },
          { label: 'Außenführung', top: '34%', left: '66%' },
          { label: 'Brandschutz', top: '46%', left: '54%' },
        ],
        fire: { top: '62%', left: '34%', width: '7%', height: '13%' },
      },
      {
        label: 'Außen',
        image: '/images/planning-example-schornstein-exterior.webp',
        text: 'Fassadenansicht mit Schornsteinführung, Haltern und Dachabschluss.',
        annotations: [
          { label: 'Dachabschluss', top: '11%', left: '55%' },
          { label: 'Rohrführung', top: '38%', left: '55%' },
          { label: 'Wandhalter', top: '49%', left: '55%' },
        ],
      },
      {
        label: 'Anschluss',
        image: '/images/planning-example-schornstein-detail.webp',
        text: 'Detailansicht von Wanddurchführung, Schelle und Edelstahlrohr.',
        annotations: [
          { label: 'Schelle', top: '30%', left: '51%' },
          { label: 'Dichtkragen', top: '37%', left: '63%' },
          { label: 'Edelstahlrohr', top: '60%', left: '37%' },
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
      { angle: -60, image: '/images/planning-frames/schornstein-kaminofen/frame-01.webp' },
      { angle: -40, image: '/images/planning-frames/schornstein-kaminofen/frame-02.webp' },
      { angle: -20, image: '/images/planning-frames/schornstein-kaminofen/frame-03.webp' },
      { angle: 0, image: '/images/planning-frames/schornstein-kaminofen/frame-04.webp' },
      { angle: 20, image: '/images/planning-frames/schornstein-kaminofen/frame-05.webp' },
      { angle: 40, image: '/images/planning-frames/schornstein-kaminofen/frame-06.webp' },
      { angle: 60, image: '/images/planning-frames/schornstein-kaminofen/frame-07.webp' },
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
        { label: 'Innenrohr', top: '28%', left: '64%' },
        { label: 'Dämmschale', top: '42%', left: '66%' },
        { label: 'Wanddurchführung', top: '52%', left: '50%' },
        { label: 'Reinigungsöffnung', top: '66%', left: '62%' },
      ],
    },
    decisions: [
      { key: 'rohr', label: 'Rohr-Finish', choices: ['Edelstahl', 'Schwarz matt'] },
      { key: 'ofen', label: 'Ofenkörper', choices: ['Stahl schwarz', 'Speckstein'] },
    ],
    variants: {
      rohr: {
        Edelstahl: {
          image: '/images/planning-example-schornstein-kaminofen.webp',
          text: 'Gebürstetes Edelstahlrohr — die Basisvariante.',
        },
        'Schwarz matt': {
          image: '/images/planning-variants/schornstein-kaminofen/rohr-schwarz-matt.webp',
          text: 'Mattschwarz beschichtetes Rauchrohr und Außenführung.',
        },
      },
      ofen: {
        'Stahl schwarz': {
          image: '/images/planning-example-schornstein-kaminofen.webp',
          text: 'Schwarzer Stahlkorpus — die Basisvariante.',
        },
        Speckstein: {
          image: '/images/planning-variants/schornstein-kaminofen/ofen-speckstein.webp',
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
      { label: 'Wanddurchführung', top: '52%', left: '50%' },
      { label: 'Ofenanschluss', top: '52%', left: '43%' },
      { label: 'Außenführung', top: '34%', left: '66%' },
      { label: 'Brandschutz', top: '46%', left: '54%' },
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

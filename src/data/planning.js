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

export const planningDecisionOptions = [
  {
    key: 'form',
    label: 'Form',
    choices: ['gerade Linie', 'Ecke', 'Sitzbank'],
  },
  {
    key: 'material',
    label: 'Material',
    choices: ['Keramik', 'Naturstein', 'Putz'],
  },
  {
    key: 'view',
    label: 'Sichtscheibe',
    choices: ['frontal', 'Eckscheibe', 'Panorama'],
  },
  {
    key: 'detail',
    label: 'Detail',
    choices: ['Fuge', 'Kante', 'Anschluss'],
  },
]

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
      },
      {
        label: 'Perspektive',
        image: '/images/planning-example-kachelofen-perspective.webp',
        text: 'Seitliche Perspektive für Tiefe, Sitzbank und Raumwirkung.',
        annotations: [
          { label: 'Raumtiefe', top: '48%', left: '56%' },
          { label: 'Sitzkante', top: '66%', left: '35%' },
          { label: 'Feuerraum', top: '55%', left: '48%' },
        ],
      },
      {
        label: 'Detail',
        image: '/images/planning-example-kachelofen-detail.webp',
        text: 'Detailansicht von Keramik, Fugenbild, Kanten und Feuerraum.',
        annotations: [
          { label: 'Fugenbild', top: '40%', left: '36%' },
          { label: 'Kachelkante', top: '55%', left: '53%' },
          { label: 'Feuerraum', top: '54%', left: '66%' },
        ],
      },
    ],
    frames: [
      { angle: -60, image: '/images/planning-frames/kachelofen-eckscheibe/frame-01.webp' },
      { angle: -40, image: '/images/planning-frames/kachelofen-eckscheibe/frame-02.webp' },
      { angle: -20, image: '/images/planning-frames/kachelofen-eckscheibe/frame-03.webp' },
      { angle: 0, image: '/images/planning-frames/kachelofen-eckscheibe/frame-04.webp' },
      { angle: 20, image: '/images/planning-frames/kachelofen-eckscheibe/frame-05.webp' },
      { angle: 40, image: '/images/planning-frames/kachelofen-eckscheibe/frame-06.webp' },
      { angle: 60, image: '/images/planning-frames/kachelofen-eckscheibe/frame-07.webp' },
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
      },
      {
        label: 'Außen',
        image: '/images/planning-example-schornstein-exterior.webp',
        text: 'Fassadenansicht mit Schornsteinführung, Haltern und Dachabschluss.',
        annotations: [
          { label: 'Dachabschluss', top: '18%', left: '59%' },
          { label: 'Rohrführung', top: '43%', left: '61%' },
          { label: 'Wandhalter', top: '55%', left: '55%' },
        ],
      },
      {
        label: 'Anschluss',
        image: '/images/planning-example-schornstein-detail.webp',
        text: 'Detailansicht von Wanddurchführung, Schelle und Edelstahlrohr.',
        annotations: [
          { label: 'Schelle', top: '38%', left: '51%' },
          { label: 'Dichtkragen', top: '52%', left: '43%' },
          { label: 'Edelstahlrohr', top: '45%', left: '62%' },
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
          { label: 'Lichtkante', top: '29%', left: '38%' },
          { label: 'Materialwirkung', top: '44%', left: '68%' },
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
          { label: 'Materialtafel', top: '40%', left: '31%' },
          { label: 'Kaminbezug', top: '45%', left: '70%' },
          { label: 'Oberfläche', top: '61%', left: '43%' },
        ],
      },
      {
        label: 'Makro',
        image: '/images/planning-example-materialien-detail.webp',
        text: 'Nahansicht der Oberflächen für Glanz, Relief und Steinstruktur.',
        annotations: [
          { label: 'Glanzgrad', top: '34%', left: '32%' },
          { label: 'Relief', top: '51%', left: '48%' },
          { label: 'Steinstruktur', top: '59%', left: '65%' },
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

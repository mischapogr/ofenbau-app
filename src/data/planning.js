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
      },
      {
        label: 'Perspektive',
        image: '/images/planning-example-kachelofen-perspective.webp',
        text: 'Seitliche Perspektive für Tiefe, Sitzbank und Raumwirkung.',
      },
      {
        label: 'Detail',
        image: '/images/planning-example-kachelofen-detail.webp',
        text: 'Detailansicht von Keramik, Fugenbild, Kanten und Feuerraum.',
      },
    ],
    motif: 'flame',
    tone: 'ember',
    description:
      'Räumlicher Entwurf eines handgesetzten Kachelofens mit Sitzbank, keramischer Oberfläche und Eck-Sichtfenster.',
    specs: ['Kachelkeramik', 'Sitzbank', 'Eckscheibe', 'Speicherwärme'],
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
      },
      {
        label: 'Außen',
        image: '/images/planning-example-schornstein-exterior.webp',
        text: 'Fassadenansicht mit Schornsteinführung, Haltern und Dachabschluss.',
      },
      {
        label: 'Anschluss',
        image: '/images/planning-example-schornstein-detail.webp',
        text: 'Detailansicht von Wanddurchführung, Schelle und Edelstahlrohr.',
      },
    ],
    motif: 'chimney',
    tone: 'slate',
    description:
      'Planungsansicht für Kaminofen, Wanddurchführung und Edelstahl-Außenschornstein inklusive Anschlussdetails.',
    specs: ['Edelstahl', 'Wanddurchführung', 'Brandschutz', 'Ofenanschluss'],
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
      },
      {
        label: 'Raum',
        image: '/images/planning-example-bad-perspective.webp',
        text: 'Eingangsperspektive für Wegeführung, Licht und Materialwirkung.',
      },
      {
        label: 'Detail',
        image: '/images/planning-example-bad-detail.webp',
        text: 'Duschdetail mit Nische, Bodenanschluss, Ablauf und Fugenbild.',
      },
    ],
    motif: 'tile',
    tone: 'sand',
    description:
      'Fotorealistischer Badentwurf mit Fliesenraster, Dusche, Wanne und Materialabstimmung vor Ausführung.',
    specs: ['Großformat', 'Natursteinoptik', 'Duschbereich', 'Fugenbild'],
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
      },
      {
        label: 'Board',
        image: '/images/planning-example-materialien-perspective.webp',
        text: 'Breitere Materialtafel neben dem geplanten Kamin.',
      },
      {
        label: 'Makro',
        image: '/images/planning-example-materialien-detail.webp',
        text: 'Nahansicht der Oberflächen für Glanz, Relief und Steinstruktur.',
      },
    ],
    motif: 'swatch',
    tone: 'ink',
    description:
      'Detailansicht für Kachel, Naturstein, Putzstruktur und Feuerraumrahmen als Entscheidungshilfe.',
    specs: ['Keramik', 'Naturstein', 'Putz', 'Metallrahmen'],
    review: { ...pendingPlanningApproval },
  },
]

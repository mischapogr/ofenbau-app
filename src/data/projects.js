/**
 * Completed projects — "Unsere Projekte" gallery. Each item carries a
 * category used by the gallery filter, plus a motif/tone for the fallback
 * and an `image` pointing at the project-local realistic WebP asset.
 */
export const projectCategories = [
  { key: 'all', label: 'Alle' },
  { key: 'kachelofen', label: 'Kachelöfen' },
  { key: 'kaminofen', label: 'Kaminöfen' },
  { key: 'schornstein', label: 'Schornsteinbau' },
  { key: 'fliesen', label: 'Fliesen' },
  { key: 'modern', label: 'Modern' },
  { key: 'klassisch', label: 'Klassisch' },
]

export const projectReferenceReview = {
  approvedForLaunch: false,
  note: 'Demo/generated project references must be replaced with approved real customer references before launch.',
}

const pendingReferenceApproval = {
  realReference: false,
  photoRightsApproved: false,
  customerApproved: false,
  note: 'Replace demo/generated media with a real customer reference and document photo/customer approval before launch.',
}

export const projects = [
  {
    id: 'p1',
    title: 'Kachelofen Landhaus',
    description:
      'Handgesetzter Kachelofen mit klassischer Keramik und lang anhaltender Speicherwärme.',
    material: 'Keramik & Putz',
    category: ['kachelofen', 'klassisch'],
    motif: 'flame',
    tone: 'ember',
    image: '/images/project-1-kachelofen-landhaus.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Nennwärmeleistung: '6.0 kW',
      Speicherzeit: 'Bis zu 18 Std. Wärmeabgabe',
      Speichermasse: 'ca. 1.200 kg',
      Material: 'Ofenkachel-Keramik, Schamotte',
      Standort: 'Stuttgart (Region)',
      Baujahr: '2024',
    },
    caseStudy:
      'Ein traditionell handwerklich gesetzter Kachelofen mit Speichertechnik für ein Einfamilienhaus im Landhausstil. Der Ofen wurde als primäre Wärmequelle für das Erdgeschoss konzipiert. Durch die massive Speichermasse aus Schamottesteinen nimmt der Ofen die Energie des Abbrands schnell auf und gibt sie über 18 Stunden als gesunde Infrarot-Strahlungswärme ab. Die handgefertigte Kachelkeramik sorgt für eine edle, zeitlose Optik.',
  },
  {
    id: 'p2',
    title: 'Heizkamin Panorama',
    description: 'Moderner Heizkamin mit breitem Sichtfeuer und ruhiger Putzfläche.',
    material: 'Stahl, Glas & Putz',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'slate',
    image: '/images/project-2-heizkamin-panorama.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Nennwärmeleistung: '8.5 kW',
      Brennstoff: 'Scheitholz',
      Sichtfenster: 'Dreiseitige Panoramaverglasung',
      System: 'Externe Luftzufuhr (raumluftunabhängig)',
      Standort: 'Ludwigsburg (Region)',
      Baujahr: '2025',
    },
    caseStudy:
      'Dieser moderne dreiseitige Panorama-Heizkamin wurde in ein neu errichtetes Architektenhaus integriert. Die Herausforderung lag in der raumluftunabhängigen Luftführung, da es sich um ein hochgedämmtes Niedrigenergiehaus handelt. Der Kamin verfügt über eine integrierte Scheibenspülung gegen Rußablagerungen und eine elektronische Abbrandsteuerung für maximale Effizienz und geringste Emissionen.',
  },
  {
    id: 'p3',
    title: 'Kachelofen mit Sitzbank',
    description: 'Individuelle Ofenanlage mit Sitzbank, warmem Keramikton und Speichertechnik.',
    material: 'Keramik & Speicherstein',
    category: ['kachelofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
    image: '/images/project-3-kachelofen-sitzbank.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Nennwärmeleistung: '7.0 kW',
      Besonderheit: 'Integrierte beheizte Ofenbank',
      Speichermasse: 'ca. 1.450 kg',
      Material: 'Keramik, Schamotte, Naturstein',
      Standort: 'Nordsachsen (Region)',
      Baujahr: '2024',
    },
    caseStudy:
      'Eine großzügig dimensionierte Kachelofenanlage mit integrierter, beheizter Sitzbank. Der Kachelofen wurde als gestalterisches Zentrum zwischen Küche und Wohnzimmer errichtet. Die Sitzbank wird direkt von den Heizgasen durchströmt und lädt an kalten Tagen zum Entspannen ein. Die warme, sandfarbene Ofenkeramik fügt sich harmonisch in das gemütliche Interieur ein.',
  },
  {
    id: 'p4',
    title: 'Wohnraum-Fliesen XXL',
    description: 'Großformatige Bodenfliesen mit präzisem Fugenbild für einen offenen Wohnbereich.',
    material: 'Feinsteinzeug',
    category: ['fliesen', 'modern'],
    motif: 'tile',
    tone: 'slate',
    image: '/images/project-4-wohnraum-fliesen-xxl.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Fliesenformat: '120 x 120 cm',
      Fliesenart: 'Kalibriertes Feinsteinzeug',
      Verlegeverfahren: 'Buttering-Floating',
      Fugenbreite: '2.0 mm',
      Standort: 'Esslingen (Region)',
      Baujahr: '2024',
    },
    caseStudy:
      'Verlegung von großformatigen Feinsteinzeugplatten (120 x 120 cm) in einem barrierefreien Wohnbereich. Zur Gewährleistung eines ebenen Verlegebilds ohne Überzähne wurde der Untergrund geschliffen und vollflächig nivelliert. Die Fliesen wurden im kombinierten Buttering-Floating-Verfahren hohlraumfrei verlegt, um die optimale Wärmeleitung der darunter liegenden Fußbodenheizung sicherzustellen.',
  },
  {
    id: 'p5',
    title: 'Kaminofen Stahl',
    description: 'Kompakter Kaminofen mit reduziertem Anschlussdetail und modernem Stahlkörper.',
    material: 'Stahl & Glas',
    category: ['kaminofen', 'modern'],
    motif: 'flame',
    tone: 'ink',
    image: '/images/project-5-kaminofen-stahl.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Nennwärmeleistung: '5.0 kW',
      Brennstoff: 'Scheitholz, Holzbriketts',
      Material: 'Stahl, Glaskeramik',
      Standort: 'Stuttgart (Region)',
      Baujahr: '2023',
    },
    caseStudy:
      'Ein kompakter, moderner Kaminofen aus hochwertigem Stahl mit integriertem Holzfach und Warmhaltefach. Durch seine schlanke zylindrische Form eignet er sich hervorragend für kleinere Wohnräume. Die Ofensteuerung ermöglicht eine präzise Regulierung der Verbrennungsluft, wodurch ein extrem sauberer und effizienter Abbrand erzielt wird. Das rahmenlose Sichtfenster bietet einen ungestörten Blick auf das Flammenspiel.',
  },
  {
    id: 'p6',
    title: 'Bad in Naturstein',
    description: 'Natursteinoptik, ruhiges Raster und hochwertige Detailausbildung im Nassbereich.',
    material: 'Naturstein & Feinsteinzeug',
    category: ['fliesen', 'klassisch'],
    motif: 'tile',
    tone: 'sand',
    image: '/images/project-6-bad-naturstein.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Material: 'Travertin-Naturstein, Feinsteinzeug',
      Fliesenformat: '60 x 60 cm',
      Besonderheit: 'Bodengleiche Walk-In Dusche',
      Verfugung: 'Epoxidharzfuge (wasserabweisend)',
      Standort: 'Heilbronn (Region)',
      Baujahr: '2024',
    },
    caseStudy:
      'Hochwertige Badgestaltung mit großformatigem Feinsteinzeug in Natursteinoptik (Travertin). Die Herausforderung bestand in der exakten Ausrichtung des Fugenbildes über Wand- und Bodenflächen hinweg sowie der Ausbildung einer Gefällefläche in der bodengleichen Dusche. Durch die Verwendung von Epoxidharzfugen ist der Nassbereich dauerhaft geschützt und besonders pflegeleicht.',
  },
  {
    id: 'p7',
    title: 'Grundofen Eck',
    description:
      'Ecklösung mit hoher Speicherleistung und harmonischer Einbindung in den Wohnraum.',
    material: 'Putz & Speicherkeramik',
    category: ['kachelofen', 'modern'],
    motif: 'flame',
    tone: 'ember',
    image: '/images/project-7-grundofen-eck.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Nennwärmeleistung: '5.5 kW',
      Speichermasse: 'ca. 1.100 kg',
      Wärmeabgabe: 'Bis zu 15 Std. Strahlungswärme',
      Material: 'Schamotte, Spezial-Ofenputz',
      Standort: 'Waiblingen',
      Baujahr: '2024',
    },
    caseStudy:
      'Ein individuell geplanter Grundofen in Eckaufstellung zur optimalen Raumnutzung. Der Ofen wurde Stein auf Stein aus massiver Schamotte gemauert. Durch das zweischalige System mit Ofenputz strahlt die Wärme besonders sanft ab. Ein großer Vorteil dieses Typs ist die langanhaltende Wärmeabgabe bei nur einmaligem Heizen pro Tag, ideal für moderne Wohnkonzepte.',
  },
  {
    id: 'p8',
    title: 'Kaminofen Speckstein',
    description:
      'Kaminofen mit Specksteincharakter, kompakter Aufstellung und angenehmer Strahlungswärme.',
    material: 'Speckstein & Stahl',
    category: ['kaminofen', 'klassisch'],
    motif: 'flame',
    tone: 'sand',
    image: '/images/project-8-kaminofen-speckstein.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      Nennwärmeleistung: '6.5 kW',
      Speichermaterial: 'Finnischer Speckstein',
      Gewicht: 'ca. 280 kg',
      System: 'Scheibenluftspülung',
      Standort: 'Nordsachsen (Region)',
      Baujahr: '2023',
    },
    caseStudy:
      'Dieser klassische Kaminofen vereint die schnelle Wärme eines Kaminofens mit den Vorzügen eines Speichersteins. Die massive Specksteinverkleidung nimmt die Hitze während des Abbrands auf und gibt sie auch nach dem Erlöschen des Feuers noch stundenlang als behagliche Strahlungswärme ab. Das eingebaute Aschefach und der Rüttelrost erleichtern die Reinigung.',
  },
  {
    id: 'p9',
    title: 'Edelstahl-Außenschornstein',
    description:
      'Nachgerüsteter Schornstein für einen Kaminofen mit sauberer Wanddurchführung und Fassadenbefestigung.',
    material: 'Edelstahl & Brandschutzdurchführung',
    category: ['schornstein', 'modern'],
    motif: 'chimney',
    tone: 'slate',
    image: '/images/planning-example-schornstein-kaminofen-v2.webp',
    review: { ...pendingReferenceApproval },
    specs: {
      System: 'Doppelwandiger Edelstahlschornstein',
      Innendurchmesser: '150 mm',
      Gesamthöhe: '6.2 m',
      Wanddurchführung: 'Brandschutzkarton WD300',
      Standort: 'Leipzig (Region)',
      Baujahr: '2024',
    },
    caseStudy:
      'Nachrüstung eines doppelwandigen Edelstahlschornsteins an der Außenfassade eines bestehenden Wohnhauses. Das Projekt umfasste die Kernbohrung durch die gedämmte Außenwand, den Einbau einer geprüften Brandschutzwanddurchführung sowie die fachgerechte Montage und Ausrichtung des Schornsteins an der Fassade. Die Anlage wurde mängelfrei durch den zuständigen Bezirksfeuerbeschauer abgenommen.',
  },
]

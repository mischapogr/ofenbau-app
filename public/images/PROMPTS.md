# Ofenbau Mustermann — Bild-Prompts (image generation set)

Generated from the configured Stitch design + the legal best-practices in `_tmp/TODO`
(tight crops on the craftsmanship, warm light interiors, **no recognizable people**,
no private clutter, anonymized).

Each slot already ships with a generated on-brand **`<id>.svg`** scene (see
`scripts/generate-images.mjs`, `npm run gen:images`) wired into the app. To upgrade a
slot to a real photograph, generate/shoot it per the prompt below, drop `<id>.jpg` into
this folder and point the matching `image` field (see `slot`) at `/images/<id>.jpg`.

## hero  
- **file:** `public/images/hero.jpg` · **ratio:** 16/10
- **slot:** Home hero banner background (HeroSection background image; conceptually company.claim hero)
- **prompt:** Photorealistic wide interior photograph of a premium modern living room dominated by a large contemporary corner Kachelofen / fireplace clad in warm beige stone panels, a wide glowing glass firebox with soft amber flames, neatly stacked split firewood in a built-in niche beside it, light oak plank flooring and a tall floor-to-ceiling window letting in soft natural daylight. Calm, upscale, architectural, hospitality mood. Warm cream and sand color palette with a single fireplace-orange glow accent. No people, no clutter, no brand logos, no text. Slight dark warm gradient at the lower edge for headline legibility. Editorial real-estate photography, full-frame, even soft light.

## service-kachelofen  
- **file:** `public/images/service-kachelofen.jpg` · **ratio:** 4/5
- **slot:** services.js item slug 'kachelofen-kaminbau' → image (service card + detail hero)
- **prompt:** Photorealistic close portrait-orientation photograph of a handcrafted tiled corner Kachelofen against a warm wood-paneled wall, showing the ceramic tile cladding in detail and a lit fire glowing warm orange behind the glass door. Premium custom stove craftsmanship, light oak slatted wall, stacked split logs in a niche. Warm cream/sand tones with a single ember glow. No people, no clutter, no logos, no text. Natural soft daylight, shallow depth of field, editorial interior photography.

## service-fliesen  
- **file:** `public/images/service-fliesen.jpg` · **ratio:** 4/5
- **slot:** services.js item slug 'fliesenarbeiten' → image (service card + detail hero)
- **prompt:** Photorealistic portrait-orientation photograph of a precisely tiled bathroom surface in soft beige tones: large-format light feinsteinzeug wall tiles with crisp clean grout lines and a stone-look texture, a floating wood vanity countertop with a white vessel basin and a round backlit mirror, a single hanging towel. Calm spa-like premium mood demonstrating master tile-laying (Fliesenmeister) precision. Warm cream and sand palette, soft natural daylight. No people, no clutter, no logos, no text. Editorial interior photography, shallow depth of field.

## service-3d-planung  
- **file:** `public/images/service-3d-planung.jpg` · **ratio:** 4/5
- **slot:** services.js item slug '3d-planung' → image (service card + detail hero)
- **prompt:** Photorealistic portrait-orientation render-style photograph representing 3D planning: a contemporary corner fireplace shown as a clean photorealistic visualization in a light minimalist living room with light wood-look flooring, warm beige stone surround and a glowing glass firebox, conveying a planned/rendered interior. Crisp, slightly idealized CG-real quality, warm cream and sand palette with a single ember glow. No people, no clutter, no logos, no text. Soft even studio-daylight lighting.

## project-1-kachelofen-landhaus  
- **file:** `public/images/project-1-kachelofen-landhaus.jpg` · **ratio:** 3/4
- **slot:** projects.js id 'p1' Kachelofen Landhaus → image (gallery tile)
- **prompt:** Photorealistic tall portrait photograph of a classic-meets-modern tiled Kachelofen in a country-house (Landhaus) living room: ceramic-tile-clad stove with a glowing rectangular firebox, stacked split logs beneath, on warm oak flooring against a soft plaster wall. Calm, architectural, upscale, cozy. Warm cream and sand palette with a single fireplace-orange glow. No people, no clutter, no logos, no text. Editorial interior photography, soft natural light.

## project-2-heizkamin-panorama  
- **file:** `public/images/project-2-heizkamin-panorama.jpg` · **ratio:** 3/2
- **slot:** projects.js id 'p2' Heizkamin Panorama → image (gallery tile)
- **prompt:** Photorealistic landscape photograph of a modern panorama Heizkamin: a wide L-shaped or panoramic glass firebox with warm flames built into a light masonry / pale plaster surround in a bright contemporary living space, sheer-lit tall windows nearby. Architectural, premium, airy. Warm cream and sand palette with a single ember glow. No people, no clutter, no logos, no text. Editorial interior photography, soft daylight.

## project-3-kachelofen-sitzbank  
- **file:** `public/images/project-3-kachelofen-sitzbank.jpg` · **ratio:** 3/4
- **slot:** projects.js id 'p3' Kachelofen mit Sitzbank → image (gallery tile)
- **prompt:** Photorealistic portrait photograph of a freestanding tiled / soapstone Kachelofen with an integrated tiled seating bench (Sitzbank), a black glass door with visible warm flames, set against a neutral warm plaster wall with light oak flooring. Traditional craftsmanship, cozy and premium. Warm cream and sand palette with a single ember glow. No people, no clutter, no logos, no text. Editorial interior photography, soft natural light.

## project-4-wohnraum-fliesen-xxl  
- **file:** `public/images/project-4-wohnraum-fliesen-xxl.jpg` · **ratio:** 3/2
- **slot:** projects.js id 'p4' Wohnraum-Fliesen XXL → image (gallery tile)
- **prompt:** Photorealistic landscape photograph of a modern open living room with large-format XXL floor tiles in soft warm grey-beige stone look, seamless precise grout lines, light walls and a tall window with sheer daylight, a hint of minimalist furniture. Demonstrates large-format tile-laying craft. Calm, airy, premium. Warm cream and sand palette. No people, no clutter, no logos, no text. Editorial interior photography, soft even light.

## project-5-kaminofen-stahl  
- **file:** `public/images/project-5-kaminofen-stahl.jpg` · **ratio:** 3/4
- **slot:** projects.js id 'p5' Kaminofen Stahl → image (gallery tile)
- **prompt:** Photorealistic portrait photograph of a minimalist Scandinavian-style steel Kaminofen: a tall slim cylindrical matte-black free-standing wood stove with a glowing fire visible through the glass, a woven basket of split logs beside it, soft neutral rug and pale warm walls in a bright airy Nordic interior. Modern, clean, premium. Warm cream and sand palette with a single ember glow. No people, no clutter, no logos, no text. Editorial interior photography, soft daylight.

## project-6-bad-naturstein  
- **file:** `public/images/project-6-bad-naturstein.jpg` · **ratio:** 3/2
- **slot:** projects.js id 'p6' Bad in Naturstein → image (gallery tile)
- **prompt:** Photorealistic landscape photograph of a calm spa-like bathroom in natural stone: marble-look / travertine wall and floor tiling in warm beige tones, a round backlit mirror, a stone washbasin on a wood counter, soft indirect lighting. Demonstrates natural-stone tile (Fliesen) craft. Premium, serene. Warm cream and sand palette. No people, no clutter, no logos, no text. Editorial interior photography, soft daylight.

## project-7-grundofen-eck  
- **file:** `public/images/project-7-grundofen-eck.jpg` · **ratio:** 3/4
- **slot:** projects.js id 'p7' Grundofen Eck → image (gallery tile)
- **prompt:** Photorealistic portrait photograph of a modern corner Grundofen (masonry heater) clad in large warm-beige stone panels with a tall slim glass firebox and warm flames, an integrated bench and stacked split firewood beside it, on light oak flooring against a plaster wall. Architectural, upscale, calm. Warm cream and sand palette with a single ember glow. No people, no clutter, no logos, no text. Editorial interior photography, soft natural light.

## project-8-kaminofen-speckstein  
- **file:** `public/images/project-8-kaminofen-speckstein.jpg` · **ratio:** 3/4
- **slot:** projects.js id 'p8' Kaminofen Speckstein → image (gallery tile)
- **prompt:** Photorealistic portrait photograph of a classic soapstone (Speckstein) Kaminofen: a freestanding stove with smooth warm-grey soapstone cladding, a black glass door showing glowing flames, set against a neutral warm wall with light wood flooring and a small stack of split logs. Traditional craftsmanship, cozy premium mood. Warm cream and sand palette with a single ember glow. No people, no clutter, no logos, no text. Editorial interior photography, soft natural light.

## about-craft  
- **file:** `public/images/about-craft.jpg` · **ratio:** 4/5
- **slot:** AboutSection feature image (about page) — anonymized craft, not a portrait
- **prompt:** Photorealistic portrait-orientation photograph of master stove-builder craftsmanship in progress, anonymized: close-up of skilled hands (no face, no recognizable person) setting a ceramic tile onto a Kachelofen with a trowel and fresh mortar, warm workshop light, tile samples and tools arranged neatly nearby. Tactile, trustworthy, hand-built quality. Warm cream and sand palette with warm tungsten glow. No faces, no people identifiable, no clutter, no logos, no text. Editorial documentary photography, shallow depth of field.

## planning-3d-before  
- **file:** `public/images/planning-3d-before.jpg` · **ratio:** 4/3
- **slot:** Planning3DSection before image (planning.js / 3D-Planung detail, '3D-Skizze')
- **prompt:** Photorealistic image of a grayscale architectural 3D wireframe / line-drawing sketch of a modern corner Kachelofen with an integrated bench unit, shown in clean technical outline form on a plain white background, conveying the planning stage. Minimal, precise, blueprint-like. No color photography, no people, no logos, no text labels baked in. Crisp CAD/render line-art aesthetic.

## planning-3d-after  
- **file:** `public/images/planning-3d-after.jpg` · **ratio:** 4/3
- **slot:** Planning3DSection after image (planning.js / 3D-Planung detail, 'Fertiges Projekt')
- **prompt:** Photorealistic finished render/photo of the exact same modern corner Kachelofen with integrated bench from the 3D sketch, now built in warm beige stone with a glowing glass firebox and stacked split firewood, in a warm minimalist living room with light wood-look flooring. Demonstrates the before-to-after 3D-planning result; geometry matches the wireframe. Warm cream and sand palette with a single ember glow. No people, no clutter, no logos, no text. Editorial interior photography, soft daylight.

## contact-map  
- **file:** `public/images/contact-map.jpg` · **ratio:** 16/10
- **slot:** Contact page location map / area visual (company.address region 'Musterstadt und Umgebung')
- **prompt:** Soft, warm-toned stylized map illustration of a small German town and its surrounding region, rendered in cream and sand tones with light streets, gentle parks and a single burnt-orange location pin marking the workshop. Calm, premium, minimal cartographic style matching a warm light brand. No real place names, no readable street labels, no people, no logos. Flat illustrative map aesthetic, generous whitespace.


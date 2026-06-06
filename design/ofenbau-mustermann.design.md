---
name: Ofenbau Mustermann
description: >
  Warm, light "hearth" design system for a premium German stove- and tile-builder
  (Ofen- & Fliesenmeister). Cream and sand surfaces, warm-charcoal ink panels for
  hero/footer, and a single burnt-orange fireplace accent. A display serif (Fraunces)
  pairs with Inter for body and Space Mono for eyebrow labels on soft 8px geometry.
  Single polished light theme — NO dark mode. This is the explicit counterpart to the
  dark "Max Mustermann" monolith system and must not clash with it.
colors:
  # Semantic surfaces & content (light theme)
  surface: "#ffffff"
  surface-muted: "#faf6f1"
  surface-sand: "#f3ece3"
  content: "#1c1816"
  content-muted: "#6b635e"
  # Primary / brand — burnt-orange "hearth" accent
  primary: "#e35205"
  primary-hover: "#c64304"
  on-primary: "#ffffff"
  # Ink — warm charcoal for hero/footer dark panels
  ink-900: "#181412"
  ink-800: "#1c1816"
  ink-700: "#292320"
  # Brand ramp (50–950)
  brand-50: "#fdf4ee"
  brand-100: "#fae3d0"
  brand-200: "#f4c29c"
  brand-300: "#ee9e6b"
  brand-400: "#eb7d3f"
  brand-500: "#e35205"
  brand-600: "#c64304"
  brand-700: "#a13606"
  brand-800: "#7e2c0b"
  brand-900: "#67260d"
  brand-950: "#371004"
  # Ink ramp (50–950)
  ink-50: "#f5f3f2"
  ink-100: "#e6e2e0"
  ink-200: "#c7c0bc"
  ink-300: "#9e9590"
  ink-400: "#6e6662"
  ink-500: "#4a423e"
  ink-600: "#352e2b"
  ink-950: "#0f0c0b"
  # Hairlines / borders
  border: "#e8e2d8"
  ring: "#f3ece3"
typography:
  display:
    family: "Fraunces, Georgia, ui-serif, serif"
    role: "Wordmark, hero headline, section headings"
    weights: [400, 500, 600]
    tracking: "-0.01em"
    sizes:
      hero: "clamp(2.5rem, 6vw, 4.5rem) / 1.05"
      h2: "clamp(2rem, 4vw, 3rem) / 1.1"
      h3: "1.5rem / 1.2"
  body:
    family: "Inter, ui-sans-serif, system-ui, sans-serif"
    role: "Body copy, nav links, card descriptions, footer, form labels"
    weights: [400, 500, 600]
    sizes:
      base: "1rem / 1.65"
      lead: "1.125rem / 1.6"
      sm: "0.875rem / 1.5"
  label:
    family: "\"Space Mono\", ui-monospace, monospace"
    role: "Eyebrow labels, pill chips, process step numbers, kicker text"
    weights: [400, 700]
    transform: "uppercase"
    tracking: "0.12em"
    size: "0.75rem"
spacing:
  unit: "4px"
  container-max: "80rem (1280px)"
  gutter: "1.5rem mobile / 2rem desktop"
  section-gap: "5rem–8rem (clamp generous whitespace between sections)"
  card-padding: "1.5rem–2rem"
  radius:
    lg: "0.5rem (8px)"
    xl: "0.75rem (12px)"
    2xl: "1.25rem (20px)"
---

## Brand & Style

Ofenbau Mustermann is a premium, hospitality-warm "hearth" brand for a master stove
and tile builder (Ofen- & Fliesenmeister) with the claim **"Mit gesunder Wärme leben."**
The visual language evokes the calm warmth of a glowing stove in a sunlit room:
cream and sand surfaces, the occasional warm-charcoal ink panel for the hero and footer,
and a single burnt-orange accent that reads like firelight. It is editorial and
unhurried — large premium photography of finished craftsmanship, generous whitespace,
high-contrast serif headlines, and quiet monospace eyebrow labels.

This is a **single, polished light theme — there is NO dark mode.** It is the explicit
counterpart to the separate dark "Max Mustermann" monolith system that also lives in this
repo; the two must never be mixed. Where Max Mustermann is a dark, dense monolith, Ofenbau
Mustermann is light, warm, airy, and soft. To re-skin, edit `src/styles/tokens.css` only —
it is the single source of truth, with colors stored as space-separated RGB channels so
Tailwind's `<alpha-value>` opacity modifier works (e.g. `bg-brand-500/50`).

Mood words: warm, crafted, trustworthy, premium, calm, hand-built, regional.

## Colors

Authoritative values come from `src/styles/tokens.css` (Stitch "hearth" mapping).

**Semantic surfaces & content (light theme)**

| Token | Hex | Use |
|---|---|---|
| `surface` | `#ffffff` | Card surfaces, top of page |
| `surface-muted` | `#faf6f1` | Default warm off-white page background |
| `surface-sand` | `#f3ece3` | Alternating section background, subtle panels |
| `content` | `#1c1816` | Primary heading + body ink on light |
| `content-muted` | `#6b635e` | Secondary/body text, captions, labels |
| `border` | `#e8e2d8` | Hairline borders, card rings, dividers |

**Primary / brand — burnt-orange "hearth" accent**

| Token | Hex | Use |
|---|---|---|
| `primary` / `brand-500` | `#e35205` | CTA fill, icons, active nav underline, accent band |
| `primary-hover` / `brand-600` | `#c64304` | Hover/pressed state |
| `brand-50` | `#fdf4ee` | Soft peach tint behind icons, eyebrow chip fill |
| `brand-100` | `#fae3d0` | Subtle accent backgrounds, badges |
| `brand-700` | `#a13606` | Accent text on light, deep icon fill |

Full brand ramp: `50 #fdf4ee` · `100 #fae3d0` · `200 #f4c29c` · `300 #ee9e6b` ·
`400 #eb7d3f` · `500 #e35205` · `600 #c64304` · `700 #a13606` · `800 #7e2c0b` ·
`900 #67260d` · `950 #371004`.

**Ink — warm charcoal for dark panels (hero / footer / CTA band)**

| Token | Hex | Use |
|---|---|---|
| `ink-900` | `#181412` | Hero/footer panel background, deepest charcoal |
| `ink-800` / `content` | `#1c1816` | Dark panel base, primary ink |
| `ink-700` | `#292320` | Raised surfaces on dark panels |
| `ink-300` | `#9e9590` | Muted text on dark panels |
| `ink-100` | `#e6e2e0` | Body text on dark panels |

Full ink ramp: `50 #f5f3f2` · `100 #e6e2e0` · `200 #c7c0bc` · `300 #9e9590` ·
`400 #6e6662` · `500 #4a423e` · `600 #352e2b` · `700 #292320` · `800 #1c1816` ·
`900 #181412` · `950 #0f0c0b`.

**Usage rules**

- Burnt-orange is a **single accent** — never two competing accents. Use it for CTAs,
  icons, active states, the CTA band, and small chips only. Keep large areas cream/sand.
- Ink panels (hero, footer, the "Starten Sie Ihr Projekt heute" CTA band) are warm
  charcoal `ink-900`, never pure black, and never the dark Max-Mustermann monolith look.
- Body text is `content` on light surfaces, `ink-100` on dark panels. Labels use
  `content-muted`.
- Fireplace-glow amber/orange appears inside photography only, not as a UI token.

## Typography

Three families, each with one clear job:

- **Display — Fraunces (serif).** High-contrast warm display serif for the wordmark
  ("Ofenbau Mustermann"), the hero headline, and every section heading
  ("Unsere Leistungen", "Unser Prozess", "Unsere Projekte", "Über uns"). Weights 400–600,
  tracking `-0.01em`. Hero `clamp(2.5rem, 6vw, 4.5rem)/1.05`; section H2
  `clamp(2rem, 4vw, 3rem)/1.1`; H3 `1.5rem/1.2`.
- **Body — Inter (sans).** Nav links, body copy, card descriptions, footer, and all form
  field labels. Regular `1rem/1.65`; lead paragraphs `1.125rem/1.6`; small `0.875rem/1.5`.
  Card titles and the active nav item use Inter 600.
- **Label — Space Mono (mono).** Eyebrow/kicker labels, pill chips ("3D-Skizze",
  "Fertiges Projekt"), and process step numbers (01–04). Uppercase, tracking `0.12em`,
  `0.75rem`. This is the calm, technical counterweight to the warm serif.

Pairing intent: editorial and premium. Serif headlines carry the warmth and personality;
Inter keeps everything legible and modern; Space Mono adds a quiet, crafted, "blueprint"
precision that nods to the 3D-planning service.

## Layout & Spacing

- **Base unit 4px.** All spacing is a multiple of 4 (`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`).
- **Container max 80rem (1280px)**, centered, with `1.5rem` mobile / `2rem` desktop gutters.
- **Generous section gaps:** `5rem–8rem` of vertical breathing room between sections;
  whitespace is part of the premium feel — never crowd the photography.
- **Alternating backgrounds:** sections alternate `surface-muted` (`#faf6f1`) and
  `surface-sand` (`#f3ece3`); white `surface` for cards sitting on top.
- **Grids:** services 3-up, process 4-up, projects 2×3 / 3-up masonry mixing portrait and
  landscape tiles. Collapse to single column on mobile with the same generous rhythm.
- **Hero and footer** are full-bleed warm-charcoal `ink-900` panels; the CTA band is a
  full-bleed burnt-orange block.

## Elevation & Depth

Soft, warm, low-contrast elevation — **never** the hard, dark Max-Mustermann monolith
shadows. Stitch ROUND_EIGHT geometry: default radius **8px** (`radius-lg`), cards `12px`
(`radius-xl`), large feature panels `20px` (`radius-2xl`). Pills/CTAs use full or `lg`
radius.

| Token | Value | Use |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgb(40 24 16 / 0.06)` | Inputs, chips, resting nav |
| `shadow-card` | `0 4px 12px rgb(40 24 16 / 0.06), 0 12px 32px rgb(40 24 16 / 0.08)` | Service/project cards at rest |
| `shadow-lift` | `0 14px 28px rgb(40 24 16 / 0.12), 0 28px 64px rgb(40 24 16 / 0.14)` | Card hover, sticky header on scroll |

Shadows are tinted warm (`rgb(40 24 16)`), low-opacity, and diffuse so they read like soft
daylight, not drop-shadow. Cards combine `shadow-card` with a `1px` `border` (`#e8e2d8`)
hairline ring for crisp edges on cream backgrounds. Hover lifts cards with `shadow-lift`
and a subtle `translateY(-2px)`.

## Components

**Buttons**
- *Primary:* burnt-orange `brand-500` fill, white text, `radius-lg` (8px) — pill on hero
  ("Mehr erfahren") and the consultation CTA ("Beratungsgespräch vereinbaren"). Hover →
  `brand-600`, `shadow-sm`→`shadow-card`. Inter 500/600.
- *Secondary:* warm-charcoal `ink-800` fill or `ink-800` outline on light, white/`content`
  text, `radius-lg`. Used where orange would compete.
- *Tertiary / ghost:* transparent with `content` text and an `border` outline; on dark
  panels, `ink-100` text with a hairline `ink-700` outline.
- *On dark panels:* primary stays burnt-orange; ghost buttons use `ink-100` text.

**Cards**
- White `surface`, `radius-xl` (12px), `shadow-card` + `1px` `border` ring.
- Service cards: small burnt-orange circular icon (`brand-50` tint disc, `brand-500`
  glyph), Inter 600 title, `content-muted` description.
- Project / gallery cards: full-bleed photo, caption label overlaid lower-left in white
  Space Mono on a soft ink gradient scrim.
- Hover: `shadow-lift`, `translateY(-2px)`, `200ms ease`.

**Sticky header**
- Transparent over the hero, then `surface` with `shadow-sm`/`border` bottom hairline once
  scrolled. Serif wordmark left with Inter tagline beneath ("Ofen- & Fliesenmeister"),
  Inter nav center/right, burnt-orange primary CTA pill far right. Active nav item: Inter
  600 with a `brand-500` underline.

**Eyebrow labels & chips**
- Space Mono, uppercase, `0.12em` tracking, `content-muted` or `brand-700`; optional
  `brand-50` pill fill with full radius. Used above section headings and on
  before/after chips ("3D-Skizze" / "Fertiges Projekt").

**Process timeline**
- 4 circular `brand-500` line-icons on `brand-50` discs, Space Mono step number (01–04),
  Inter 600 title, `content-muted` text. Horizontal on desktop, vertical on mobile.

**Forms (contact / 3D-Entwurf anfragen)**
- White inputs, `border` hairline, `radius-lg`, `shadow-sm`; focus ring `brand-500/40`.
  Inter labels. Primary submit button in burnt-orange.

**CTA band**
- Full-bleed burnt-orange `brand-500` block, white Fraunces headline
  ("Starten Sie Ihr Projekt heute"), white/`ink-900`-outline secondary button.

**Footer**
- Full-bleed warm-charcoal `ink-900` panel: contact NAP block, "Start"/sitemap link column
  with a `brand-400` column heading, social icons, and a muted `ink-300` baseline strip
  ("Arbeitsbereich: Musterstadt und Umgebung").

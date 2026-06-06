# Design System

This document describes the implemented Ofenbau Mustermann design system: a warm,
light, premium craft system for a German stove builder and tile master
(`Kachelofen`, `Kamin`, `Fliesenmeister`).

The live source of truth is [src/styles/tokens.css](../src/styles/tokens.css).
Tailwind exposes those tokens in [tailwind.config.js](../tailwind.config.js).
The Stitch mirror is [design/ofenbau-mustermann.design.md](../design/ofenbau-mustermann.design.md).

## Design Intent

The site should feel calm, premium, regional, and hand-built. It uses warm cream
surfaces, large realistic imagery, quiet spacing, editorial serif headings, and a
single burnt-orange hearth accent.

Core attributes:

- Warm, light, and crafted
- Premium without looking decorative or overdesigned
- Trustworthy and conversion-focused
- Built around realistic stove, fireplace, tile, and planning imagery
- Single light theme only

Do not mix this system with the separate dark "Max Mustermann" monolith Stitch
system. Ofenbau Mustermann is airy, warm, and photographic; it is not brutalist,
dark, or 0-radius.

## Sources Of Truth

| Area | File | Role |
|---|---|---|
| Live tokens | [src/styles/tokens.css](../src/styles/tokens.css) | Authoritative colors, radius, shadows, container width |
| Tailwind mapping | [tailwind.config.js](../tailwind.config.js) | Exposes tokens as utilities |
| Global styles | [src/styles/main.css](../src/styles/main.css) | Base styles, section rhythm, eyebrow utility, reveal motion |
| Stitch mirror | [design/ofenbau-mustermann.design.md](../design/ofenbau-mustermann.design.md) | Google Stitch `design.md` format |
| Image prompts | [public/images/PROMPTS.md](../public/images/PROMPTS.md) | Asset slots and generation prompts |
| Architecture notes | [docs/ARCHITECTURE.md](./ARCHITECTURE.md) | Implementation and Stitch sync context |

When changing visual language, update `tokens.css` first, then sync Tailwind usage
and `design/ofenbau-mustermann.design.md`.

## Stitch Design Systems

The configured Stitch project contains more than one design system. Only one is
active in this application.

| Stitch design system | Asset id | Status | Role |
|---|---|---|---|
| Ofenbau Mustermann | `assets/5933609171211310555` | Active | Warm light hearth system implemented in this repo |
| Max Mustermann | `assets/3824a26f7e40400292d99c26618d270f` | Inactive | Separate dark monolith concept; do not use for this site |

The active Ofenbau Mustermann system is mirrored in
[design/ofenbau-mustermann.design.md](../design/ofenbau-mustermann.design.md).
If Stitch is updated directly, reconcile those changes back into `tokens.css`
and this documentation before building on them.

## Color System

Use the semantic tokens in code instead of raw hex values.

| Token | Hex | Usage |
|---|---:|---|
| `surface` | `#ffffff` | Cards, form fields, page top surfaces |
| `surface-muted` | `#faf6f1` | Warm off-white page background |
| `surface-sand` | `#f3ece3` | Alternate sections and subtle image fallbacks |
| `content` | `#1c1816` | Primary copy on light surfaces |
| `content-muted` | `#6b635e` | Secondary copy, captions, supporting text |
| `brand-500` | `#e35205` | Primary CTA, active states, important icons |
| `brand-600` | `#c64304` | Hover and pressed CTA state |
| `brand-50` | `#fdf4ee` | Soft icon discs and pale accent chips |
| `ink-900` | `#181412` | Hero and footer dark panels |
| `ink-700` | `#292320` | Raised dark-panel surfaces |
| `ink-100` | `#e6e2e0` | Text on dark panels |

Rules:

- Use burnt orange as one restrained accent. Do not introduce competing accent hues.
- Use `ink-*` only for warm charcoal panels and dark-surface text, never pure black.
- Use cream/sand backgrounds for most page sections.
- Let photography carry the fireplace glow. Do not turn the whole UI orange.

## Typography

| Role | Font | Tailwind | Usage |
|---|---|---|---|
| Display | Fraunces | `font-display` | Logo wordmark, hero headline, section headings |
| Body/UI | Inter | `font-sans` | Navigation, body copy, buttons, forms, card text |
| Label | Space Mono | `font-mono tracking-label uppercase` | Eyebrows, step numbers, compact technical labels |

Rules:

- Hero and section headings use `font-display`.
- Labels use the `.eyebrow` utility from `main.css`.
- Body copy should remain readable and restrained: `text-content` or
  `text-content-muted`.
- Avoid adding new font families.

## Layout And Spacing

Global utilities:

- `.container-page`: centered max-width container with responsive gutters.
- `.section`: standard vertical rhythm for full-width sections.
- `.eyebrow`: mono uppercase label for section kickers.

Layout rules:

- Use generous whitespace. Premium craft should feel calm, not dense.
- Use `max-w-container` for primary content.
- Alternate `bg-surface`, `bg-surface-muted`, and `bg-surface-sand` to create
  rhythm.
- Hero and footer can use `bg-ink-900`; most other sections should stay light.
- Mobile stacks first; desktop uses 2-column hero/about/planning and 3-up service
  or gallery grids where appropriate.

## Radius, Shadows, And Motion

The system follows Stitch `ROUND_EIGHT` as the baseline.

| Token | Value | Usage |
|---|---|---|
| `rounded-lg` | `0.5rem` | Buttons, compact controls |
| `rounded-xl` | `0.75rem` | Cards and image frames |
| `rounded-2xl` | `1.25rem` | Large feature panels |
| `shadow-sm` | soft warm small shadow | Buttons, inputs, header |
| `shadow-card` | warm card elevation | Cards and feature images |
| `shadow-lift` | stronger warm elevation | Hovered cards, overlays |

Rules:

- Prefer soft warm shadows over hard grey/black shadows.
- Keep cards visually light. Do not nest cards inside cards.
- Hover motion should be subtle: small lift, short transition, no flashy animation.
- The reveal animation in `main.css` respects `prefers-reduced-motion`.

## Components

### Buttons

Implemented in [BaseButton.vue](../src/components/BaseButton.vue).

Variants:

- `primary`: `brand-500` fill, white text, main conversion action.
- `secondary`: warm charcoal fill.
- `outline`: light-surface secondary action.
- `ghost`: low-emphasis text action.
- `light`: white button for dark/photo contexts.

Use primary buttons for consultation CTAs such as `Beratung vereinbaren`. Avoid
using multiple primary buttons in one small region.

### Cards

Implemented in [BaseCard.vue](../src/components/BaseCard.vue) and service/gallery
components.

Cards use:

- `bg-surface`
- `rounded-2xl`
- `shadow-card`
- subtle ring
- optional hover lift

Use cards for repeated items: services, project tiles, process highlights, and
form panels. Do not style whole page sections as floating cards.

### Images

Implemented in [BaseImage.vue](../src/components/BaseImage.vue).

The site now uses realistic generated WebP assets for the main photographic slots:

- `hero.webp`
- `service-*.webp`
- `project-*.webp`
- `about-craft.webp`
- `planning-3d-before.webp`
- `planning-3d-after.webp`

SVG files remain available as fallbacks and for non-photographic slots such as the
contact map.

Rules:

- Use realistic imagery for stove, fireplace, tile, and planning work.
- Keep images warm, architectural, uncluttered, and logo-free.
- Use correct aspect ratios from `public/images/PROMPTS.md`.
- Do not add stock-looking dark, blurry, or generic decorative imagery.

### Header And Footer

Header:

- White surface
- Serif brand wordmark
- Inter navigation
- Primary CTA on desktop
- Compact mobile menu icon

Footer:

- `ink-900` full-width panel
- Warm muted text
- Service/legal/contact grouping
- No pure black background

### Forms

Contact form fields should use:

- White surface
- Subtle border
- `rounded-lg`
- `shadow-sm`
- `brand-500` focus ring

Success and error states should stay clear and restrained.

## Page Patterns

Homepage:

- Dark/photo-led hero with conversion CTA
- Service cards directly after hero
- About craft section with realistic hands-on imagery
- Process timeline
- Project gallery
- 3D planning section with before/after visuals
- Lead CTA
- Contact form and footer

Service detail pages:

- Use the same service WebP assets as the overview cards.
- Keep detail copy concise and conversion-oriented.
- Include a clear path to contact.

Projects page:

- Filter chips use the brand accent for active state.
- Gallery images should remain the visual focus.
- Keep captions short.

3D planning:

- Use the wireframe and finished render pair.
- Maintain the before/after relationship visually.

## Accessibility And Performance

- All meaningful images need accurate `alt` text.
- Decorative icons should not duplicate nearby text for screen readers.
- Use WebP for generated photos.
- Keep image files optimized; current generated WebPs are small enough for static
  hosting.
- Preserve visible focus states.
- Maintain readable contrast on image overlays and dark panels.

## Maintenance Checklist

When adding or changing UI:

1. Use existing tokens and Tailwind utilities first.
2. Check whether an existing base component already solves the need.
3. Use `font-display`, `font-sans`, and `font-mono` according to their roles.
4. Keep orange restrained to CTAs, icons, active states, and small accents.
5. Prefer realistic project imagery over placeholders for customer-facing areas.
6. Run `npm run build`.
7. For layout or image changes, capture desktop and mobile screenshots with
   Playwright.

When changing the design system itself:

1. Update [src/styles/tokens.css](../src/styles/tokens.css).
2. Update [tailwind.config.js](../tailwind.config.js) only if token names or new
   token groups change.
3. Update [design/ofenbau-mustermann.design.md](../design/ofenbau-mustermann.design.md).
4. Update this document.
5. Rebuild and visually verify at desktop and mobile sizes.

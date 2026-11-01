# Architecture

How the Ofenbau Mustermann site is structured after the UX/UI refactor, and how
the **Stitch** design system maps into the codebase.

For implementation-facing design rules, see
[`docs/DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

## Design system → tokens

The visual language is driven by the configured Stitch project
**"Modern Stove Builder Homepage"** (warm, light "hearth" direction). Its design
DNA is mapped into CSS custom properties in [`src/styles/tokens.css`](../src/styles/tokens.css)
and surfaced to Tailwind in [`tailwind.config.js`](../tailwind.config.js):

| Token group                                  | Stitch source                                                         | Tailwind utilities                       |
| -------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------- |
| `brand` (50–950)                             | Burnt-orange accent `#e35205` / `#ec6d13`                             | `bg-brand-500`, `text-brand-600`, …      |
| `ink` (50–950)                               | Warm charcoal panels & text `#1c1816`                                 | `bg-ink-900`, `text-white` on ink        |
| `surface` / `surface-muted` / `surface-sand` | Cream / off-white backgrounds                                         | `bg-surface-muted`, …                    |
| `content` / `content-muted`                  | Charcoal body text                                                    | `text-content`, `text-content-muted`     |
| radius `lg` (8px)                            | Stitch `ROUND_EIGHT`                                                  | `rounded-lg`                             |
| shadows `sm` / `card` / `lift`               | Soft warm elevation                                                   | `shadow-card`, `hover:shadow-lift`       |
| fonts                                        | Display **Fraunces** (serif) + body **Inter** + labels **Space Mono** | `font-display`, `font-sans`, `font-mono` |

The site is a **single light theme** — the previous dark-mode toggle, `useTheme`
composable and `theme` store were removed. To re-skin, edit `tokens.css` only.

> The Stitch project also carries a saved _dark "monolith"_ design-system asset
> ("Max Mustermann"). It was intentionally **not** used — the rendered Stitch
> screens and the brief both call for the warm, light direction implemented here.

## Information architecture

```
/                      Home — full conversion flow (one section per block)
/leistungen            Services overview (cards + process + CTA)
/leistungen/:slug      Service detail (kachelofen-kaminbau | schornsteinbau | fliesenarbeiten | 3d-planung*)
/projekte              Project gallery (filters + lightbox)
/ueber-uns             About (story + values + process)
/kontakt               Contact (NAP + form)
/impressum /datenschutz  Legal (shared LegalView)
/* (catch-all)         NotFound
```

`*` premium only: `src/config/tier.js` (`VITE_TIER=basis|premium`, injected by
`vite.config.js`) exposes `hasFeature()`; `/leistungen/3d-planung` redirects to
`/leistungen` in a basis build (router `beforeEnter`), the nav item and the Home
sections are hidden, and `getActiveServices(tier)` filters the service cards.

The **Home** page composes the brief's flow in order:
`HeroSection → ServiceCards → AboutSection → ProcessTimeline → ProjectGallery →
Planning3DSection → Planning3DExplorer (lazy) → CTASection`.

## Components

Reusable UI lives flat in `src/components/`:

**Primitives** — `BaseButton`, `BaseCard`, `BaseContainer`, `BaseSection`
(rhythm + section header), `BaseBadge`, `BaseImage` (lazy photo with an on-brand
gradient/motif placeholder fallback), `AppIcon` (single line-icon set),
`AppLoader`, `AppError`.

**Sections / blocks** — `HeroSection`, `ServiceCards` (+ `ServiceCard`),
`AboutSection`, `ProcessTimeline`, `ProjectGallery`, `Planning3DSection`,
`Planning3DExplorer`, `CTASection`, `ContactForm`, `PageHeader`, `Breadcrumbs`,
`SiteFooter`, plus the calculators `BudgetEstimator`, `HeizlastCalculator`,
`BimschvChecker`.

**Planning explorer** (`Planning3DExplorer.vue` + `components/planning/`) —
an image-based "pseudo-3D" viewer with an optional real glTF stage:

- `composables/usePlanningExplorer.js` holds all state/actions and provides it
  to the sub-components (`useExplorerContext()`); the orchestrator only lays
  out section, stage switch and aside.
- Stages: `ExplorerStageRotate` (drag/keyboard frame arc via
  `useFrameRotation`, honest arc label — only a frame set covering 360° wraps),
  `ExplorerStageView` (photo + hotspots + CSS fire), `ExplorerStageXray`
  (cutaway), `ExplorerStageVariant` (decision simulation: whole-image swaps,
  stackable `layer` overlays, compare slider), `ExplorerStageModel`
  (`<model-viewer>` loaded on first open: orbit, AR, per-part materials via the scene-graph API,
  hotspots; offered only with WebGL and without `saveData`).
- `ExplorerControls` (aside), `ExplorerStageBar` (info bar: dots/autorotate,
  compare, "Budget schätzen" hand-off into `BudgetEstimator` query params,
  fire toggle, zoom), `ExplorerFullscreen` (teleported modal with focus trap),
  `ExplorerLazy` (mounts the explorer chunk near the viewport).
- Frames are fetched on the first interaction with the stage, not on mount.
- Placeholder model: `public/models/kachelofen-eckscheibe.glb`
  (`npm run gen:model`, see `public/models/README.md`).

Layout: `layouts/DefaultLayout.vue` (skip-link + `AppHeader` + `<main>` +
`SiteFooter`) and `layouts/AppHeader.vue` (sticky, scroll shadow, persistent CTA,
accessible mobile menu).

## Content (data layer)

All copy/structure is data-driven so components stay presentational:

- `data/company.js` — name, NAP, primary nav, social links, trust badges
- `data/services.js` — the four services (drives cards, overview, detail pages; `BASIS_SERVICE_SLUGS` for the basis tier)
- `data/projects.js` — gallery items + filter categories
- `data/process.js` — the four process steps
- `data/planning.js` — 3D benefits + service columns + the explorer examples (views, frame arcs — the Kachelofen one a 24-frame 360° turntable rendered from the model by `scripts/render-turntable.mjs` —, x-ray, decisions/`variants`, `budget` map, `model`; schema documented inline). All visuals are AI-generated demo content (`planningContentReview.demoContent`).

For handover/editing guidance see [`docs/CONTENT_GUIDE.md`](./CONTENT_GUIDE.md).
Run `npm run content:inventory` to export `docs/CONTENT_INVENTORY.json` with
placeholder flags and editable field references.

## Cross-cutting concerns

- **Motion** — `directives/reveal.js` registers `v-reveal` globally in `main.js`;
  it adds `.reveal` (hidden) then `.reveal-in` on intersection, and no-ops under
  `prefers-reduced-motion`. Styles live in `styles/main.css`.
- **SEO** — `composables/useSeo.js` (title + OG/Twitter per route);
  `composables/useJsonLd.js` injects `BreadcrumbList` from `Breadcrumbs.vue`;
  `index.html` holds the static `LocalBusiness` JSON-LD + font preconnects.
- **Forms** — `ContactForm.vue` does client-side validation (required fields,
  email pattern, GDPR consent) with inline errors and success/error states, and
  submits through the existing `stores/contact.js` → `services/contactService.js`
  → Axios `httpClient`.
- **Performance** — routes are lazy-loaded (per-route chunks), images are
  `loading="lazy"` + `decoding="async"`, fonts use `display=swap` + preconnect.
  Run `npm run perf:budget` after `npm run build` to check hard JS/CSS budgets
  and flag oversized image assets for review.
- **Static checks** — `npm run a11y:static` checks common accessibility mistakes
  in Vue templates; `npm run content:assets` verifies data-driven image
  references exist in `public/images/`.

## Design systems (Stitch sync)

The canonical, authoritative design system is the repo itself
(`src/styles/tokens.css` + this doc), exported as a Stitch-format design.md at
[`design/ofenbau-mustermann.design.md`](../design/ofenbau-mustermann.design.md).

The configured Stitch project (`STITCH_PROJECT_ID`, see `.mcp.env.example`) holds **two** design
systems that must never be mixed:

| Stitch design system                    | Asset id                        | Role                                                                                       |
| --------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ |
| **Ofenbau Mustermann** (light "hearth") | `assets/<your-light-system-id>` | **Primary** — mirrors this repo (light, `#e35205`, ROUND_EIGHT, Fraunces/Inter/Space Mono) |
| **Max Mustermann** (dark "monolith")    | `assets/<your-dark-system-id>`  | Kept, unused by the app (dark brutalist variant)                                           |

The light system was re-created from `design.md` (it had been removed from the
project by mistake). To re-sync after editing tokens: update
`design/ofenbau-mustermann.design.md` and apply it in Stitch (or re-run
`create_design_system` with the updated theme).

## Imagery

Primary customer-facing photography slots now use realistic generated WebP assets
(`public/images/*.webp`) wired into the app: hero, three services, about craft,
eight projects, and the 3D before/after pair. The contact map remains an
illustrative SVG slot.

The original generated SVG scenes are still kept as fallback/reference assets.
They are produced by [`scripts/generate-images.mjs`](../scripts/generate-images.mjs)
— regenerate with `npm run gen:images` — from the warm "hearth" palette:
stylized, anonymized stove, tile, wireframe, render, craft and map scenes.

The accompanying photography spec lives in
[`public/images/PROMPTS.md`](../public/images/PROMPTS.md) (human-readable) and
[`public/images/manifest.json`](../public/images/manifest.json) (machine-readable)
— each slot has a ratio, the data field it maps to, and a photorealistic
generation prompt following simple legal guidance (warm light
interiors, no logos, no readable text, anonymized craft where people are implied).

To replace a photo slot: export `public/images/<id>.webp` and point the matching
`image` field at it, e.g. `image: '/images/service-kachelofen.webp'` on the
`kachelofen-kaminbau` entry in `data/services.js`. `BaseImage` falls back to its
in-DOM gradient placeholder if a referenced file is ever missing.

> Note: Stitch (in this environment) exposes only composite full-page screen
> _screenshots_, not discrete image assets, so photos can't be auto-exported from
> it. With the **Ofenbau Mustermann** design system now in the project, you can
> also generate fresh on-brand screens directly in the Stitch UI.

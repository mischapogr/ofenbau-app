# Architecture

How the Ofenbau Mustermann site is structured after the UX/UI refactor, and how
the **Stitch** design system maps into the codebase.

## Design system → tokens

The visual language is driven by the configured Stitch project
**"Modern Stove Builder Homepage"** (warm, light "hearth" direction). Its design
DNA is mapped into CSS custom properties in [`src/styles/tokens.css`](../src/styles/tokens.css)
and surfaced to Tailwind in [`tailwind.config.js`](../tailwind.config.js):

| Token group | Stitch source | Tailwind utilities |
| --- | --- | --- |
| `brand` (50–950) | Burnt-orange accent `#e35205` / `#ec6d13` | `bg-brand-500`, `text-brand-600`, … |
| `ink` (50–950) | Warm charcoal panels & text `#1c1816` | `bg-ink-900`, `text-white` on ink |
| `surface` / `surface-muted` / `surface-sand` | Cream / off-white backgrounds | `bg-surface-muted`, … |
| `content` / `content-muted` | Charcoal body text | `text-content`, `text-content-muted` |
| radius `lg` (8px) | Stitch `ROUND_EIGHT` | `rounded-lg` |
| shadows `sm` / `card` / `lift` | Soft warm elevation | `shadow-card`, `hover:shadow-lift` |
| fonts | Display **Fraunces** (serif) + body **Inter** + labels **Space Mono** | `font-display`, `font-sans`, `font-mono` |

The site is a **single light theme** — the previous dark-mode toggle, `useTheme`
composable and `theme` store were removed. To re-skin, edit `tokens.css` only.

> The Stitch project also carries a saved *dark "monolith"* design-system asset
> ("Max Mustermann"). It was intentionally **not** used — the rendered Stitch
> screens and the brief both call for the warm, light direction implemented here.

## Information architecture

```
/                      Home — full conversion flow (one section per block)
/leistungen            Services overview (cards + process + CTA)
/leistungen/:slug      Service detail (kachelofen-kaminbau | fliesenarbeiten | 3d-planung)
/projekte              Project gallery (filters + lightbox)
/ueber-uns             About (story + values + process)
/kontakt               Contact (NAP + form)
/impressum /datenschutz  Legal (shared LegalView)
/* (catch-all)         NotFound
```

The **Home** page composes the brief's flow in order:
`HeroSection → ServiceCards → AboutSection → ProcessTimeline → ProjectGallery →
Planning3DSection → CTASection`.

## Components

Reusable UI lives flat in `src/components/`:

**Primitives** — `BaseButton`, `BaseCard`, `BaseContainer`, `BaseSection`
(rhythm + section header), `BaseBadge`, `BaseImage` (lazy photo with an on-brand
gradient/motif placeholder fallback), `AppIcon` (single line-icon set),
`AppLoader`, `AppError`.

**Sections / blocks** — `HeroSection`, `ServiceCards` (+ `ServiceCard`),
`AboutSection`, `ProcessTimeline`, `ProjectGallery`, `Planning3DSection`,
`CTASection`, `ContactForm`, `PageHeader`, `Breadcrumbs`, `SiteFooter`.

Layout: `layouts/DefaultLayout.vue` (skip-link + `AppHeader` + `<main>` +
`SiteFooter`) and `layouts/AppHeader.vue` (sticky, scroll shadow, persistent CTA,
accessible mobile menu).

## Content (data layer)

All copy/structure is data-driven so components stay presentational:

- `data/company.js` — name, NAP, primary nav, social links, trust badges
- `data/services.js` — the three services (drives cards, overview, detail pages)
- `data/projects.js` — gallery items + filter categories
- `data/process.js` — the four process steps
- `data/planning.js` — 3D benefits + service columns

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

## Swapping in real photography

`BaseImage` renders a styled placeholder until a real `src` is provided. To use
photos, set `image` on the relevant `data/*` entry (e.g.
`image: '/images/kachelofen.jpg'` in `data/services.js`) or pass `:src` directly;
it falls back to the placeholder automatically if the file is missing.

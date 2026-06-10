# AI.md

Universal guidance file for AI coding agents working in this repository
(Claude Code, Codex, Google Antigravity, Qoder, Cursor, Windsurf, Copilot, …).

## Project

**ofenbau-app** — marketing website for Ofenbau Mustermann, a stove &
fireplace (Kachelofen / Kamin) craft business. Content is German.

## Stack & package manager

- Vue 3 (Composition API, `<script setup>`) · Vite 6 · Vue Router 4 · Pinia 2
- Tailwind CSS 3 (token-driven, single light theme) · Axios
- ESLint (flat config) + Prettier · Node 22 LTS
- Package manager: **npm** (`package-lock.json` committed)
- Local environment: **Docker Compose** (app + Mailpit)

## Common commands

| Action | Command |
| --- | --- |
| Dev (Docker, standard) | `docker compose up -d` → http://localhost:5173 |
| Dev (local) | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` (fix) · `npm run lint:check` (CI) |
| Format | `npm run format` · `npm run format:check` |
| Full local launch gate | `npm run preflight` |
| Launch readiness report | `npm run launch:report` (non-failing) · `npm run launch:check` (strict) |
| Launch handoff docs | `npm run launch:actions` · `npm run launch:evidence` |
| Deployment smoke | `npm run deploy:all -- https://domain.example` |
| Demo walkthrough | `npm run test:e2e` · `npm run demo:mp4` |
| Prod build (Docker) | `docker compose -f docker-compose.prod.yml up -d --build` |

Mailpit web UI (dev mail catcher): http://localhost:8023

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full map.

- `src/main.js` bootstraps Pinia + Router and registers the global `v-reveal`
  directive; `src/App.vue` mounts the layout + `<RouterView>` (page transition).
- `src/styles/tokens.css` — design tokens as CSS variables, surfaced to Tailwind
  (`brand`, `ink`, `surface`, `content`). Single source of truth for colour,
  mapped from the configured Stitch project. **Single light theme — no dark mode.**
- `src/data/` — content modules (`company`, `services`, `projects`, `process`,
  `planning`). Edit copy/structure here, not in components.
- `src/components/` — `Base*` primitives + `AppIcon` + section blocks
  (`HeroSection`, `ServiceCards`/`ServiceCard`, `AboutSection`, `ProcessTimeline`,
  `ProjectGallery`, `Planning3DSection`, `CTASection`, `ContactForm`, `PageHeader`,
  `Breadcrumbs`, `SiteFooter`).
- `src/composables/` — `useApi` (loading/error/data), `useSeo` (per-route meta),
  `useJsonLd` (BreadcrumbList on subpages). `src/directives/reveal.js` = `v-reveal`.
- `src/services/httpClient.js` — central Axios instance; all API calls go through
  it. `src/stores/contact.js` — contact-form submission lifecycle.
- `src/layouts/` (DefaultLayout, AppHeader), `src/pages/` (lazy-loaded views:
  Home, Services, ServiceDetail, Projects, About, Contact, Legal, NotFound).
- `@` is aliased to `src/` (see `vite.config.js`, `jsconfig.json`).

## Design system

Source of truth, in priority order:

1. `src/styles/tokens.css` — the live design tokens (colours stored as
   space-separated RGB channels so Tailwind's `<alpha-value>` modifier works),
   surfaced to Tailwind in `tailwind.config.js`. **Edit colour/radius/shadow here**
   and the whole UI follows.
2. `design/ofenbau-mustermann.design.md` — the same system in Google Stitch
   `design.md` format, mirrored in the Stitch project as the design system
   **"Ofenbau Mustermann"** (`assets/5933609171211310555`). Keep it in sync with `tokens.css`.
3. `docs/ARCHITECTURE.md` — narrative map (token table, components, imagery, Stitch sync).

**Identity:** one warm, **light** "hearth" theme — **there is NO dark mode** (the
toggle, `useTheme` and the theme store were removed; do not reintroduce them).

**Tokens (use Tailwind utilities, never hard-code hex):**

- `surface` / `surface-muted` (cream `#faf6f1`, the default page bg) / `surface-sand` — light surfaces.
- `content` / `content-muted` — charcoal body/heading text.
- `brand` 50–950 — the burnt-orange accent (`brand-500` = `#e35205`, hover `brand-600`).
- `ink` 50–950 — warm charcoal for full-bleed hero / footer / CTA dark panels (`ink-900` = `#181412`).
- `rounded-lg` (8px) is the default radius; elevation is `shadow-card` / `shadow-lift` (soft, warm — no hard/black shadows).

**Type:** `font-display` = Fraunces (serif — wordmark, hero, section headings);
`font-sans` = Inter (body/UI); `font-mono` = Space Mono (uppercase `.eyebrow`
labels + process step numbers). Fonts are loaded in `index.html`.

**Do:**

- Treat burnt-orange as a **single** accent — CTAs, icons, active states, the CTA band, chips. Keep large areas cream/sand; reserve `ink-900` panels for hero/footer/CTA.
- Build new sections by composing `BaseSection` (eyebrow/title/subtitle + rhythm) with the `Base*` primitives; wrap reveal-on-scroll content with `v-reveal`.
- Use `BaseImage` for imagery (`:src` + `motif`/`tone` placeholder fallback). Generated on-brand scenes live in `public/images/*.svg` (`npm run gen:images`); swap in real photos per `public/images/PROMPTS.md`.

**Don't:**

- Don't add `dark:` variants, a second accent colour, hard/black shadows, or sharp
  0-radius "monolith" styling. That brutalist dark look is the **separate** Stitch
  design system **"Max Mustermann"** (`assets/3824a26f7e40400292d99c26618d270f`),
  which is intentionally kept but **not used** by this app — never mix the two.

## Conventions for AI agents

- Match existing style: 2-space indent, no semicolons, single quotes (Prettier).
- Reusable UI goes in `src/components/`; page-level views in `src/pages/`.
- Color/spacing/radius come from tokens (Tailwind `brand`/`ink`/`surface`/`content`),
  not ad-hoc hex values. Single light theme — do not add `dark:` variants
  (see **Design system** above).
- New routes: add to `src/router/index.js` with `meta.title`/`meta.description`
  and call `useSeo` in the page.
- API access only via `src/services/*` + `useApi`; surface loading/errors with
  `AppLoader` / `AppError`.

## MCP / tooling

See [docs/MCP.md](./docs/MCP.md). Rules: use **context7** before writing
Vue/Vite/Tailwind/Pinia/Axios/Docker code; **stitch** before new layouts — apply
the existing **"Ofenbau Mustermann"** design system and keep design DNA flowing
through `tokens.css` (don't invent a new system; keep "Max Mustermann");
**codegraphcontext** before refactoring; **playwright** after UI changes. Keep MCP
filesystem access scoped to the project root; never commit secrets.

## Commits

- Do not include "Generated with Claude Code" or other AI attribution in commit
  messages.

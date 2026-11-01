# Ofenbau Mustermann — Vue 3 craft-business website template

An open-source, production-shaped marketing website for a fictional stove &
fireplace business (Kachelofen / Kamin). Built with **Vue 3 + Vite + Tailwind**,
it ships everything a small craft business site needs plus a few showcase
features: an optional **demo mode** (access gate + watermark), a **Basis/Premium
tier switch** via feature flags, interactive **calculators**, regional SEO pages,
and an image-based **planning explorer** with an optional real-3D stage.

The UI and content are German; code and docs are English. All business data,
photos and references are placeholders (AI-generated imagery, see
[`public/images/PROMPTS.md`](./public/images/PROMPTS.md)).

> Licensed under [MIT](./LICENSE). Contributions welcome — see
> [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Tech stack

- **Vue 3** (Composition API, `<script setup>`), **Vite 6**, **Vue Router 4**, **Pinia 2**
- **Tailwind CSS 3** with CSS-variable design tokens (`src/styles/tokens.css`) —
  single warm light theme (cream surfaces, charcoal `ink` panels, burnt-orange accent)
- **Axios** service layer with interceptors & error normalisation
- Scroll-reveal animations (`v-reveal`, respects reduced motion)
- SEO meta per route (`useSeo`), LocalBusiness / BreadcrumbList JSON-LD, prerendering
- ESLint (flat config) + Prettier, Playwright e2e, GitHub Actions CI
- Docker (Node 22 LTS) dev + production images, **Mailpit** for local mail
- Cloudflare Pages deploy with Pages Functions (contact sink, optional server-side gate)

---

## Quick start (Docker)

> Requires Docker + Docker Compose. No local Node install needed.

```bash
cp .env.example .env        # adjust values if needed
docker compose up -d
```

| Service                               | URL                     |
| ------------------------------------- | ----------------------- |
| **App** (Vite dev server, hot reload) | <http://localhost:5173> |
| **Mailpit** (catches dev emails)      | <http://localhost:8023> |

```bash
docker compose logs -f app      # follow app logs
docker compose down             # stop everything
docker compose up -d --build    # rebuild after dependency changes
```

## Local start (without Docker)

```bash
npm install                # Node 22+; also installs the pre-commit leak guard
cp .env.example .env
npm run dev                # http://localhost:5173
```

No secrets are required to build or run. See [`docs/SECRETS.md`](./docs/SECRETS.md)
for what is public, what is a deployment secret, and how the repo owner keeps
their own credentials encrypted in git.

### NPM scripts

| Script                                            | Description                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| `npm run dev` / `dev:demo`                        | Vite dev server (`:5173`) / in demo mode (`:5174`)                    |
| `npm run build`                                   | Production build + prerender to `dist/`                               |
| `npm run build:demo`                              | Demo build (noindex, demo mode per `.env.demo`)                       |
| `npm run build:basis` / `build:premium`           | Production build for one tier                                         |
| `npm run build:demo:basis` / `build:demo:premium` | Demo build for one tier                                               |
| `npm run preview` / `preview:demo`                | Preview the current `dist/`                                           |
| `npm run lint` / `lint:check`                     | ESLint (fix / CI)                                                     |
| `npm run format` / `format:check`                 | Prettier (write / CI)                                                 |
| `npm run test:e2e`                                | Playwright: recorded walkthrough + explorer assertions                |
| `npm run test:e2e:report`                         | Open the Playwright HTML report                                       |
| `npm run demo:mp4`                                | Convert recorded walkthrough videos to `.mp4` (needs `ffmpeg-static`) |
| `npm run gen:images`                              | Regenerate the on-brand SVG fallback imagery                          |
| `npm run gen:model`                               | Regenerate the procedural stove GLB for the 3D stage                  |
| `npm run perf:budget`                             | Check JS/CSS budgets of the last build                                |
| `npm run preflight`                               | Full local gate: build, lint, audits, smoke checks, Playwright        |
| `npm run launch:report` / `launch:check`          | Launch-readiness report (reports go to `docs/generated/`)             |
| `npm run demo:pages:basis` / `premium` / `all`    | Deploy demo builds to Cloudflare Pages                                |
| `npm run demo:up` / `demo:url` / `demo:down`      | Ad-hoc demo via Cloudflare quick tunnel                               |
| `npm run secrets:edit`                            | Owner only: edit the sops-encrypted secrets file                      |

The remaining `content:*`, `legal:*`, `deploy:*` and `launch:*` scripts generate
checklists and run smoke tests for a real go-live; they are optional tooling.

---

## Features you can switch on and off

### Tiers (feature flags)

`VITE_TIER=basis|premium` (default `premium`) resolves in
`src/config/tier.js` to a feature map: `calculators`, `planning3d`,
`smartContact`, `regions`, `geoAiSuite`. Components and routes check
`hasFeature('…')`; the build scripts above create one bundle per tier. The
Basis/Premium catalogue shown on the demo gate lives in `src/data/productTiers.js`.

### Demo mode

`VITE_APP_ENV=demo` (the `demo` Vite mode, `.env.demo`) enables a deterrent
layer for sharing previews:

| Variable                                                     | Purpose                                                                           |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `VITE_DEMO_PROTECTION_ENABLED`                               | Master switch for the demo layer                                                  |
| `VITE_DEMO_CUSTOMER_NAME`                                    | Name shown in the gate and watermark                                              |
| `VITE_DEMO_AUTHOR_NAME` / `VITE_DEMO_AUTHOR_EMAIL`           | Optional contact shown in the notice bar (empty = anonymous)                      |
| `VITE_DEMO_COPYRIGHT_NOTICE`                                 | Text of the notice bar                                                            |
| `VITE_DEMO_ALLOWED_HOSTS`                                    | Comma-separated host allow-list; supports `*.example.de`                          |
| `VITE_DEMO_WATERMARK_ENABLED` / `VITE_DEMO_WATERMARK_FACTOR` | Repeated visual watermark and its density                                         |
| `VITE_DEMO_FEATURE_CATALOG_ENABLED`                          | Show the Basis/Premium package switch (notice bar) and cards (gate)               |
| `VITE_DEMO_URL_BASIS` / `VITE_DEMO_URL_PREMIUM`              | Where the catalogue cards forward to                                              |
| `VITE_DEMO_ACCESS_CODE_HASH`                                 | SHA-256 hex of a client-side access code (empty = none). Never commit a real hash |

The client-side code check is casual gating only (the hash ships in the bundle).
For a real gate on Cloudflare Pages set the `DEMO_ACCESS_CODE` secret and
`functions/_middleware.js` stops serving the app to unauthenticated visitors —
see [`docs/SECRETS.md`](./docs/SECRETS.md) and [`docs/DEMO_PAGES.md`](./docs/DEMO_PAGES.md).

### Planning explorer ("3D")

`src/components/planning/` is an image-based viewer: a drag-to-rotate turntable
(for the Kachelofen a true 360° per material preset, rendered from the 3D model by
`npm run gen:turntable`),
hotspots, cutaway ("Röntgenblick"), stackable material variants with a compare
slider, and a lazy-loaded `<model-viewer>` stage with per-part material
switching (tiles, cornice, bench slab, plinth, frame, joints) plus style presets
and a fire toggle. The stove GLB is generated by `npm run gen:model`; see
[`public/models/README.md`](./public/models/README.md) for swapping in a real
export. It is a `premium` feature.

---

## Production build

```bash
docker compose -f docker-compose.prod.yml up -d --build   # nginx on http://localhost:8080
# or
npm run build && npm run preview
```

Three committed Vite mode files hold **public** defaults:

| Mode          | File               | Build                | Purpose                                     |
| ------------- | ------------------ | -------------------- | ------------------------------------------- |
| `development` | `.env.development` | `npm run build:dev`  | Local defaults, demo mode off               |
| `demo`        | `.env.demo`        | `npm run build:demo` | Shareable preview: noindex, gate, watermark |
| `production`  | `.env.production`  | `npm run build`      | Normal production build                     |

Only `VITE_`-prefixed variables reach the client. The contact API
(`server/contact-api.mjs`, `Dockerfile.contact`) reads `MAIL_HOST`, `MAIL_PORT`,
`MAIL_FROM`, `MAIL_TO`, `SMTP_TIMEOUT_MS` at runtime.

---

## Deploying the demo

- **Cloudflare Pages** (permanent URL): `npm run demo:pages:premium` — see
  [`docs/DEMO_PAGES.md`](./docs/DEMO_PAGES.md). A GitHub Actions workflow
  (`.github/workflows/pages-deploy.yml`) does the same when the repository
  secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set.
- **Quick tunnel** from your machine: `npm run demo:up` — see
  [`docs/DEMO_TUNNEL.md`](./docs/DEMO_TUNNEL.md).

---

## Project structure

```
.
├─ index.html                 # SEO meta + fonts + LocalBusiness JSON-LD
├─ vite.config.js             # @ alias, dev server, dev contact API, tier define
├─ tailwind.config.js         # token-driven theme (brand / ink / surface / content)
├─ playwright.config.js       # walkthrough recording (CI=1: assertions only)
├─ Dockerfile.*               # dev / prod (nginx) / contact API images
├─ docker-compose*.yml        # dev, prod, demo (quick tunnel)
├─ wrangler.toml              # Cloudflare Pages project config
├─ functions/                 # Pages Functions: contact sink, healthz, demo gate
├─ server/                    # standalone contact API (SMTP → Mailpit / real SMTP)
├─ scripts/                   # build helpers, generators, checks and smoke tests
├─ secrets/                   # owner's sops+age encrypted credentials (optional)
├─ docs/                      # ARCHITECTURE, SECRETS, MCP, demo + launch runbooks
├─ design/                    # design system in Stitch design.md format
├─ public/                    # images (AI-generated .webp + SVG fallbacks), videos, models
└─ src/
   ├─ main.js / App.vue       # bootstrap, layout, page transition, demo layer
   ├─ config/tier.js          # tier feature flags
   ├─ components/             # Base* primitives, section blocks, planning/ explorer
   ├─ data/                   # content modules (company, services, projects, planning, …)
   ├─ composables/            # useApi, useSeo, useJsonLd, useDemoProtection, …
   ├─ pages/ · router/        # lazy-loaded views + routes with SEO meta
   ├─ stores/ · services/     # Pinia (contact) + Axios httpClient
   └─ styles/                 # tokens.css (design tokens) + main.css (Tailwind)
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full component and
route map, and [`AI.md`](./AI.md) for the conventions AI agents and humans follow.

---

## Architecture notes

- **Design tokens** are CSS custom properties in `src/styles/tokens.css`, surfaced
  to Tailwind (`brand`, `ink`, `surface`, `content`) so the whole UI follows from
  one place. Single light theme — no dark mode.
- **Content** lives in `src/data/*` so copy and structure changes never touch components.
- **Sections** are self-contained components composed by the pages; subpages share
  `PageHeader` and `BaseSection`.
- **Motion**: `v-reveal` fades sections in on scroll and no-ops under
  `prefers-reduced-motion`.
- **API layer**: requests go through `services/httpClient.js`; `useApi` wraps any
  request with `isLoading` / `error` / `data` / `execute`.
- **SEO**: `useSeo` sets title and Open Graph meta per route; `useJsonLd` injects
  BreadcrumbList; `scripts/prerender.mjs` renders static HTML per route.

---

## AI-assisted development (MCP)

The repo ships an [`.mcp.json`](./.mcp.json) for Claude Code, Codex, Cursor,
Windsurf, VS Code and friends (context7, filesystem, playwright, github, stitch,
sequential-thinking, codegraphcontext, docker). Tokens go into the git-ignored
`.mcp.env` (template `.mcp.env.example`), loaded by `.envrc` via direnv.
Read [`docs/MCP.md`](./docs/MCP.md) for setup and the usage rules.

---

## License

[MIT](./LICENSE) © 2026 Mischa Pogrebnyak. Imagery and videos under
`public/` are AI-generated placeholders released under the same license;
replace them with your own material before using the site for a real business.

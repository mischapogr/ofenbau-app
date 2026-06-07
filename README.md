# Ofenbau Mustermann

Production-ready marketing website for **Ofenbau Mustermann** — a stove &
fireplace (Kachelofen / Kamin) craft business. Built with **Vue 3 + Vite**,
runs entirely in **Docker Compose** for local development, and is configured for
**AI-assisted development** across multiple agents via MCP.

---

## Tech stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 6** build tool
- **Vue Router 4** (lazy-loaded routes)
- **Pinia 2** state management
- **Tailwind CSS 3** with CSS-variable design tokens (`src/styles/tokens.css`)
- **Axios** API service layer with interceptors & error normalisation
- Single warm **light theme** mapped from the configured Stitch project
  (cream surfaces, charcoal `ink` panels, burnt-orange accent; Fraunces + Inter)
- Scroll-reveal animations (`v-reveal` directive, respects reduced motion)
- SEO-friendly meta tags (`useSeo` composable) + LocalBusiness / BreadcrumbList
  structured data (`useJsonLd`)
- ESLint (flat config) + Prettier
- Docker (Node 22 LTS) dev + production images, **Mailpit** for local mail

---

## Quick start (Docker — recommended)

> Requires Docker + Docker Compose. No local Node install needed.

```bash
cp .env.example .env        # adjust values if needed
docker compose up -d
```

Then open:

| Service | URL |
| --- | --- |
| **App** (Vite dev server, hot reload) | <http://localhost:5173> |
| **Mailpit** (catches dev emails) | <http://localhost:8023> |

Useful commands:

```bash
docker compose logs -f app      # follow app logs
docker compose down             # stop everything
docker compose up -d --build    # rebuild after dependency changes
```

Hot reload works through the bind-mounted source (`.:/app`) with file polling
enabled, so edits on the host refresh the browser automatically.

---

## Local start (without Docker)

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

### NPM scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server on `0.0.0.0:5173` |
| `npm run dev:demo` | Start Vite dev server in demo mode on `0.0.0.0:5174` |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Development-mode static build to `dist/` |
| `npm run build:demo` | Demo build with noindex assets, host gate, watermark and demo JS obfuscation |
| `npm run preview` | Preview the production build |
| `npm run preview:demo` | Preview the current `dist/` build on `0.0.0.0:5174` |
| `npm run lint` | ESLint with `--fix` |
| `npm run lint:check` | ESLint without fixing (CI) |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |
| `npm run gen:images` | Regenerate the on-brand SVG imagery (`public/images/*.svg`) |
| `npm run company:check` | Validate structured company/NAP/contact/social data |
| `npm run content:review` | Regenerate the content approval checklist |
| `npm run content:placeholders` | Regenerate the placeholder/review finding report |
| `npm run content:inventory` | Export structured content inventory to `docs/CONTENT_INVENTORY.json` |
| `npm run content:assets` | Check referenced content media and approval state |
| `npm run legal:review` | Regenerate the Impressum/Datenschutz handoff checklist |
| `npm run privacy:check` | Verify privacy disclosure and consent coverage |
| `npm run deploy:config` | Check Docker/nginx/.env production wiring |
| `npm run deploy:all -- <url>` | Run aggregate deployment smoke checks against a target URL |
| `npm run launch:actions` | Regenerate current production handoff action items |
| `npm run launch:evidence` | Regenerate the local launch evidence snapshot |
| `npm run launch:report` | Print non-failing launch readiness blockers/warnings |
| `npm run launch:check` | Strict production launch gate |
| `npm run preflight` | Full local launch gate: build, lint, audits, smoke checks and Playwright |
| `npm run test:e2e` | Run the recorded Playwright demo (video + screenshots + trace) |
| `npm run test:e2e:report` | Open the demo HTML report (video, trace, steps) |
| `npm run demo:mp4` | Convert the recorded demo videos (`.webm`) to shareable `.mp4` |

---

## Demo walkthrough (Playwright)

A guided end-to-end demo records the whole site and its functionality for the
customer — every page, the service detail + 3D pages, the project gallery filter
and lightbox, contact-form validation and success, responsive navigation on
mobile/tablet, and the legal pages.

Run it yourself (the config boots the dev server automatically — nothing else to
start):

```bash
npm run test:e2e          # 1. runs the demo and records video + screenshots + trace
npm run demo:mp4          # 2. converts the .webm recordings to shareable .mp4
npm run test:e2e:report   #    (optional) open the HTML report — embedded video + step trace
```

`demo:mp4` uses the bundled `ffmpeg-static` binary, so **no system ffmpeg is
required**. Specs live in `tests/e2e/` (`demo.spec.js` = desktop tour,
`mobile.spec.js` = mobile nav, `tablet.spec.js` = tablet breakpoint); recording is configured in
`playwright.config.js`.

### Where the recordings are

Everything is written under `demo-artifacts/` (and `playwright-report/`). These
folders are git-ignored — they are generated locally on each run, not committed.

```
demo-artifacts/
├─ walkthrough-desktop.mp4                         ← shareable video (after `npm run demo:mp4`)
├─ walkthrough-mobile.mp4                           ← shareable video (after `npm run demo:mp4`)
├─ walkthrough-tablet.mp4                           ← shareable video (after `npm run demo:mp4`)
├─ shots/
│  ├─ desktop/01-home-hero.png … 17-datenschutz.png  ← numbered step screenshots (desktop)
│  ├─ mobile/01-home.png … 04-kontakt.png            ← numbered step screenshots (mobile)
│  └─ tablet/01-home.png … 05-contact-success.png    ← numbered step screenshots (tablet)
├─ demo-…-desktop-demo/
│  ├─ video.webm                                   ← raw desktop recording
│  └─ trace.zip                                     ← step-by-step trace
├─ mobile-…-mobile-demo/
   ├─ video.webm                                   ← raw mobile recording
   └─ trace.zip
└─ tablet-…-tablet-demo/
   ├─ video.webm                                   ← raw tablet recording
   └─ trace.zip

playwright-report/index.html                        ← HTML report (`npm run test:e2e:report`)
```

| What | Where | How to open |
| --- | --- | --- |
| **Shareable videos (MP4)** | `demo-artifacts/walkthrough-desktop.mp4`, `…-mobile.mp4`, `…-tablet.mp4` | any video player |
| Raw recordings (WebM) | `demo-artifacts/<run>/video.webm` | any video player |
| Step screenshots | `demo-artifacts/shots/{desktop,mobile}/*.png` | any image viewer |
| Interactive report | `playwright-report/index.html` | `npm run test:e2e:report` |
| Trace (per step, DOM + network) | `demo-artifacts/<run>/trace.zip` | `npx playwright show-trace <file>` |

## Production build

A separate multi-stage production image builds the app and serves the static
output with nginx (SPA history fallback included).

```bash
# Build + serve locally on http://localhost:8080
docker compose -f docker-compose.prod.yml up -d --build
```

Or build the image directly:

```bash
docker build -f Dockerfile.prod \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t ofenbau-mustermann:prod .
docker run -p 8080:80 ofenbau-mustermann:prod
```

---

## Environments and demo protection

The app has three committed public Vite mode files:

| Mode | File | Build command | Purpose |
| --- | --- | --- | --- |
| `development` | `.env.development` | `npm run build:dev` | Local/dev defaults, demo protection disabled |
| `demo` | `.env.demo` | `npm run build:demo` | Unsigned customer demos, noindex, watermark, host gate and obfuscated JS |
| `production` | `.env.production` | `npm run build` | Normal production build, demo protection disabled |

Demo protection is a deterrent layer for potential customers before contract
signature. It does not replace hosting-level access control such as Basic Auth,
Cloudflare Access or a private preview URL. The static app can only make copying
less convenient and more attributable.

Demo-specific public variables:

| Variable | Purpose |
| --- | --- |
| `VITE_APP_ENV` | `development`, `demo` or `production` |
| `VITE_DEMO_PROTECTION_ENABLED` | Enables the runtime demo gate |
| `VITE_DEMO_CUSTOMER_NAME` | Name shown in the gate and watermark |
| `VITE_DEMO_AUTHOR_NAME` | Author name shown in demo watermark and copyright notice |
| `VITE_DEMO_AUTHOR_EMAIL` | Author contact shown in demo copyright notice |
| `VITE_DEMO_COPYRIGHT_NOTICE` | German copyright/protection text shown in demo mode |
| `VITE_DEMO_ALLOWED_HOSTS` | Comma-separated host allow-list; supports `*.example.de` |
| `VITE_DEMO_WATERMARK_ENABLED` | Enables the repeated visual watermark |
| `VITE_DEMO_ACCESS_CODE_HASH` | Optional SHA-256 hex hash for a client-side access code |
| `VITE_DEMO_OBFUSCATE` | Enables demo bundle obfuscation during `build:demo` |
| `VITE_DEMO_OBFUSCATE_AGGRESSIVE` | Enables heavier control-flow flattening; test carefully |

Generate a demo access-code hash:

```bash
node -e "const {createHash}=require('node:crypto'); console.log(createHash('sha256').update(process.argv[1]).digest('hex'))" "demo-passcode"
```

Production-style Docker can build either target:

```bash
# Production
docker compose -f docker-compose.prod.yml up -d --build

# Demo
BUILD_MODE=demo \
VITE_APP_ENV=demo \
VITE_APP_URL=https://demo.example.de \
VITE_DEMO_CUSTOMER_NAME="Musterkunde GmbH" \
VITE_DEMO_ALLOWED_HOSTS=demo.example.de \
VITE_DEMO_ACCESS_CODE_HASH=<sha256-hex> \
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Project structure

```
.
├─ index.html                 # SEO meta + fonts + LocalBusiness JSON-LD
├─ vite.config.js             # @ alias, dev server (host/port/polling)
├─ tailwind.config.js         # token-driven theme (brand / ink / surface / content)
├─ postcss.config.js
├─ eslint.config.js           # flat config (Vue + Prettier)
├─ .prettierrc.json
├─ Dockerfile.dev             # Vite dev server, hot reload
├─ Dockerfile.prod            # multi-stage build → nginx
├─ docker-compose.yml         # app + mailpit (dev)
├─ docker-compose.prod.yml    # nginx-served prod build
├─ nginx.conf                 # SPA fallback + caching + security headers
├─ .env.example
├─ .mcp.json                  # canonical MCP server list (source of truth)
├─ docs/
│  ├─ MCP.md                  # MCP setup & usage guide (read this)
│  ├─ LAUNCH_RUNBOOK.md       # production launch and smoke-test runbook
│  ├─ PRODUCTION_INPUTS.md    # real operator/env/legal input checklist
│  ├─ LAUNCH_ACTION_ITEMS.md  # generated current handoff checklist
│  ├─ LAUNCH_EVIDENCE_REPORT.md # generated local launch evidence snapshot
│  └─ audits/                 # generated smoke-test audit artifacts
└─ src/
   ├─ main.js                 # app bootstrap (Pinia + Router + v-reveal)
   ├─ App.vue                 # layout + router view + page transition
   ├─ assets/                 # static imported assets
   ├─ components/             # Base* primitives, section blocks (HeroSection,
   │                          #   ServiceCards, AboutSection, ProcessTimeline,
   │                          #   ProjectGallery, Planning3DSection, CTASection,
   │                          #   ContactForm, SiteFooter), AppIcon, …
   ├─ data/                   # content modules (company, services, projects, …)
   ├─ directives/             # reveal.js (scroll-reveal directive)
   ├─ layouts/                # DefaultLayout, AppHeader
   ├─ pages/                  # Home, Services, ServiceDetail, Projects, About,
   │                          #   Contact, Legal, NotFound
   ├─ router/                 # routes + meta + scroll behaviour
   ├─ stores/                 # Pinia store (contact)
   ├─ services/               # Axios httpClient + contactService
   ├─ composables/            # useApi, useSeo, useJsonLd
   └─ styles/                 # tokens.css (design tokens) + main.css (Tailwind)
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full component/route
map and how the Stitch design DNA is mapped into tokens.

---

## Architecture notes

- **Design tokens** are CSS custom properties in `src/styles/tokens.css`, surfaced
  to Tailwind (`brand`, `ink`, `surface`, `content`) so the whole UI follows from
  one place. Values are mapped from the configured Stitch project (warm light
  "hearth" direction). See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
- **Content** lives in `src/data/*` (company NAP/nav, services, projects, process,
  3D benefits) so copy/structure changes never require touching components.
- **Sections** are self-contained components composed by the pages; subpages share
  `PageHeader` (breadcrumbs + banner) and `BaseSection` (rhythm + header).
- **Motion**: the `v-reveal` directive (`src/directives/reveal.js`) fades sections
  in on scroll via IntersectionObserver, and no-ops under `prefers-reduced-motion`.
- **API layer**: requests go through `services/httpClient.js` (base URL, timeout,
  auth header, normalised errors); `useApi` wraps any request with
  `isLoading` / `error` / `data` / `execute` (`AppLoader` / `AppError`).
- **SEO**: `useSeo` sets title + Open Graph / Twitter meta per route; `useJsonLd`
  injects BreadcrumbList on subpages; `index.html` carries the LocalBusiness schema.

---

## Environment variables

Only `VITE_`-prefixed variables are exposed to the client. See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `VITE_APP_ENV` | Build/runtime mode: `development`, `demo` or `production` |
| `VITE_APP_TITLE` | Optional site-title override; omit to use `src/data/company.js` -> `company.name` |
| `VITE_APP_DESCRIPTION` | Default meta description |
| `VITE_APP_URL` | Canonical base URL |
| `VITE_API_BASE_URL` | Axios base URL |
| `VITE_API_TIMEOUT` | Axios timeout (ms) |
| `VITE_GA_MEASUREMENT_ID` | Optional GA4 measurement ID, loaded only after analytics consent |
| `VITE_GOOGLE_SITE_VERIFICATION` | Optional Search Console verification token |
| `VITE_DEMO_*` | Demo-only deterrence settings; see "Environments and demo protection" |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM`, `MAIL_TO`, `SMTP_TIMEOUT_MS` | Contact API SMTP delivery settings; not exposed to the client |

---

## AI-assisted development (MCP)

This repo is configured for **Claude Code, Codex, Google Antigravity, Qoder,
Cursor, Windsurf and VS Code / Copilot**. The canonical MCP server list is
[`.mcp.json`](./.mcp.json); each tool reads it directly or you copy its
`mcpServers` block into the tool's own config (see [`docs/MCP.md`](./docs/MCP.md)).

**Read [`docs/MCP.md`](./docs/MCP.md) for the full guide.** In short:

- **context7** — up-to-date docs (use **before** writing Vue/Vite/Tailwind/Pinia/Axios/Docker code).
- **stitch** — UI/UX generation (use **before** building new layouts; map design DNA into `tokens.css`).
- **codegraphcontext** — code graph (use **before** refactoring).
- **playwright** — browser testing (use **after** UI changes).
- **sequential-thinking** — planning complex work.
- **github** — issues / PRs / branches / reviews.
- **filesystem** — project-scoped file access only.
- **docker** *(optional)* — containers, logs, compose.

Secrets (e.g. `GITHUB_PERSONAL_ACCESS_TOKEN`, and Stitch's `STITCH_API_KEY` /
`STITCH_PROJECT_ID`) are passed via env vars — copy `.mcp.env.example` →
`.mcp.env`. The project ships a `.envrc`, so with [direnv](https://direnv.net)
those load automatically (`direnv allow`); otherwise `source .mcp.env` per shell.
Never commit real tokens; never widen filesystem access beyond the project root.

---

## License

Proprietary — © Ofenbau Mustermann.

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
| **Mailpit** (catches dev emails) | <http://localhost:8025> |

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
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint with `--fix` |
| `npm run lint:check` | ESLint without fixing (CI) |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |
| `npm run gen:images` | Regenerate the on-brand SVG imagery (`public/images/*.svg`) |
| `npm run test:e2e` | Run the recorded Playwright demo (video + screenshots + trace) |
| `npm run test:e2e:report` | Open the demo HTML report (video, trace, steps) |
| `npm run demo:mp4` | Convert the recorded demo videos (`.webm`) to shareable `.mp4` |

---

## Demo walkthrough (Playwright)

A guided end-to-end demo records the whole site and its functionality for the
customer — every page, the service detail + 3D pages, the project gallery filter
and lightbox, contact-form validation and success, the mobile nav drawer, and the
legal pages.

```bash
npm run test:e2e          # runs the demo and records video + screenshots + trace
npm run test:e2e:report   # opens the HTML report (embedded video, step trace)
npm run demo:mp4          # converts the .webm recordings to shareable .mp4
```

`demo:mp4` writes `demo-artifacts/walkthrough-desktop.mp4` and
`walkthrough-mobile.mp4` (H.264, plays everywhere) using the bundled
`ffmpeg-static` binary — no system ffmpeg required.

Artifacts land in `demo-artifacts/` — a `video.webm` per run, numbered step
screenshots under `demo-artifacts/shots/{desktop,mobile}/`, and a Playwright
`trace.zip` (open with `npx playwright show-trace <file>`). Specs live in
`tests/e2e/` (`demo.spec.js` desktop tour, `mobile.spec.js` responsive nav);
`playwright.config.js` records everything and boots the dev server automatically.

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
│  └─ mcp/                    # Claude Desktop config example
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
| `VITE_APP_TITLE` | Site name (titles, SEO) |
| `VITE_APP_DESCRIPTION` | Default meta description |
| `VITE_APP_URL` | Canonical base URL |
| `VITE_API_BASE_URL` | Axios base URL |
| `VITE_API_TIMEOUT` | Axios timeout (ms) |
| `MAIL_*` | Mailpit/mailer reference (not exposed to client) |

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

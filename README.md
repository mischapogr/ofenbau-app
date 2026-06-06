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
- Dark / light mode (class strategy, no flash on load)
- SEO-friendly meta tags (`useSeo` composable + per-route meta)
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

---

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
├─ index.html                 # SEO meta + no-flash theme bootstrap
├─ vite.config.js             # @ alias, dev server (host/port/polling)
├─ tailwind.config.js         # token-driven theme, darkMode: 'class'
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
   ├─ main.js                 # app bootstrap (Pinia + Router)
   ├─ App.vue                 # layout + router view + theme init
   ├─ assets/                 # static imported assets
   ├─ components/             # reusable UI (BaseButton, BaseCard, AppLoader, AppError, ThemeToggle, …)
   ├─ layouts/                # DefaultLayout, AppHeader, AppFooter
   ├─ pages/                  # Home, Services, About, Contact, NotFound
   ├─ router/                 # routes + meta + scroll behaviour
   ├─ stores/                 # Pinia stores (theme, contact)
   ├─ services/               # Axios httpClient + API services
   ├─ composables/            # useTheme, useApi, useSeo
   └─ styles/                 # tokens.css (design tokens) + main.css (Tailwind)
```

---

## Architecture notes

- **Design tokens** are CSS custom properties in `src/styles/tokens.css`, surfaced
  to Tailwind (`brand`, `surface`, `content`) so utilities and dark mode stay in
  sync from one place. This is the target for Stitch design DNA.
- **Theme**: `useTheme` composable owns the DOM `.dark` toggle; `stores/theme.js`
  holds + persists the mode. `index.html` applies the stored/system theme before
  paint to avoid a flash.
- **API layer**: all requests go through `services/httpClient.js` (base URL,
  timeout, auth header, normalised errors). The `useApi` composable wraps any
  request with `isLoading` / `error` / `data` / `execute`, paired with the
  `AppLoader` and `AppError` components (demoed on the Home page).
- **SEO**: `useSeo` sets title + Open Graph / Twitter meta per route; routes also
  carry `meta.title` / `meta.description`.

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

Secrets (`GITHUB_PERSONAL_ACCESS_TOKEN`, `STITCH_API_KEY`) are passed via env
vars — copy `.mcp.env.example` → `.mcp.env`. Never commit real tokens; never
widen filesystem access beyond the project root.

---

## License

Proprietary — © Ofenbau Mustermann.

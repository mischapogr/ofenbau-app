# AI.md

Universal guidance file for AI coding agents working in this repository
(Claude Code, Codex, Google Antigravity, Qoder, Cursor, Windsurf, Copilot, …).

## Project

**ofenbau-mustermann-app** — marketing website for Ofenbau Mustermann, a stove &
fireplace (Kachelofen / Kamin) craft business. Content is German.

## Stack & package manager

- Vue 3 (Composition API, `<script setup>`) · Vite 6 · Vue Router 4 · Pinia 2
- Tailwind CSS 3 (token-driven, `darkMode: 'class'`) · Axios
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
| Prod build (Docker) | `docker compose -f docker-compose.prod.yml up -d --build` |

Mailpit web UI (dev mail catcher): http://localhost:8025

## Architecture

- `src/main.js` bootstraps Pinia + Router; `src/App.vue` mounts the layout,
  `<RouterView>`, and initialises the theme.
- `src/styles/tokens.css` — design tokens as CSS variables, surfaced to Tailwind
  (`brand`, `surface`, `content`). Single source of truth for color/dark mode.
- `src/composables/` — `useTheme` (DOM `.dark` toggle), `useApi`
  (loading/error/data wrapper), `useSeo` (per-route meta tags).
- `src/services/httpClient.js` — central Axios instance (base URL, timeout, auth
  header, error normalisation). All API calls go through here.
- `src/stores/` — Pinia stores (`theme`, `contact`).
- `src/layouts/` (DefaultLayout/Header/Footer), `src/pages/` (lazy-loaded views),
  `src/components/` (reusable UI: `Base*`, `App*`, `ThemeToggle`, `FeatureCard`).
- `@` is aliased to `src/` (see `vite.config.js`, `jsconfig.json`).

## Conventions for AI agents

- Match existing style: 2-space indent, no semicolons, single quotes (Prettier).
- Reusable UI goes in `src/components/`; page-level views in `src/pages/`.
- Color/spacing/radius come from tokens (Tailwind `brand`/`surface`/`content`),
  not ad-hoc hex values — keep dark mode working.
- New routes: add to `src/router/index.js` with `meta.title`/`meta.description`
  and call `useSeo` in the page.
- API access only via `src/services/*` + `useApi`; surface loading/errors with
  `AppLoader` / `AppError`.

## MCP / tooling

See [docs/MCP.md](./docs/MCP.md). Rules: use **context7** before writing
Vue/Vite/Tailwind/Pinia/Axios/Docker code; **stitch** before new layouts (map
design DNA into `tokens.css`); **codegraphcontext** before refactoring;
**playwright** after UI changes. Keep MCP filesystem access scoped to the project
root; never commit secrets.

## Commits

- Do not include "Generated with Claude Code" or other AI attribution in commit
  messages.

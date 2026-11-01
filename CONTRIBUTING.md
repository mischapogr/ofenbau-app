# Contributing

Thanks for your interest. This repository is a Vue 3 + Vite website template for
a craft business (German UI, English docs). Issues and pull requests are welcome.

## Getting started

```bash
npm install            # Node 22+; also wires up the pre-commit leak guard
npm run dev            # http://localhost:5173
# or: docker compose up -d   (app + Mailpit on http://localhost:8023)
```

No secrets are needed. MCP tokens for AI-assisted work are optional — see
[`docs/MCP.md`](./docs/MCP.md) and [`docs/SECRETS.md`](./docs/SECRETS.md).

## Before you open a pull request

```bash
npm run lint:check
npm run format:check
npm run build:demo:premium
npx playwright test          # first time: npx playwright install --with-deps chromium
```

CI runs the same four steps.

## Conventions

- Match the existing style: 2-space indent, no semicolons, single quotes (Prettier).
- Colours, radii and shadows come from `src/styles/tokens.css` via Tailwind
  (`brand`, `ink`, `surface`, `content`) — never hard-code hex values. Single
  light theme; do not add `dark:` variants. See [`AI.md`](./AI.md).
- Content lives in `src/data/`, reusable UI in `src/components/`, page views in
  `src/pages/`. New routes get `meta.title` / `meta.description` and call `useSeo`.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org):
  `feat(scope): add …`, `fix: …`, `docs: …`.

## How the optional features work

- **Tiers** — `VITE_TIER=basis|premium` toggles feature flags in
  `src/config/tier.js` (calculators, planning explorer, smart contact, regional
  pages, GEO/AI suite). `premium` is the default.
- **Demo mode** — `VITE_APP_ENV=demo` enables an optional access-code gate,
  watermark, host allow-list and the Basis/Premium feature catalogue
  (`src/composables/useDemoProtection.js`, `src/components/DemoProtection.vue`).
  A server-side gate for Cloudflare Pages lives in `functions/_middleware.js`.
- **Planning explorer** — the image-based "3D" viewer in `src/components/planning/`
  plus an optional `<model-viewer>` stage; assets and prompts are documented in
  `public/images/PROMPTS.md` and `public/models/README.md`.

## Reporting security issues

Please do not open public issues for vulnerabilities — see [`SECURITY.md`](./SECURITY.md).

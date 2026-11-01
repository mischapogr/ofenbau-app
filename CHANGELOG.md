# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Conventional Commits](https://www.conventionalcommits.org).

## [Unreleased]

### Added

- MIT license, contributing guide, security policy and GitHub Actions CI.
- Optional server-side demo gate for Cloudflare Pages (`functions/_middleware.js`,
  `functions/api/demo-unlock.js`, `public/demo-gate.html`).
- Encrypted owner secrets with sops + age (`secrets/`, `.sops.yaml`, `docs/SECRETS.md`)
  and a pre-commit leak guard (`.githooks/pre-commit`, gitleaks).
- Planning explorer split into `src/components/planning/*` with honest rotation
  labels, stackable variant overlays, lazy loading, a budget-estimator deep link,
  Playwright assertions and an optional `<model-viewer>` 3D stage with a
  procedurally generated stove GLB (`npm run gen:model`) whose parts (tiles,
  cornice, bench slab, plinth, frame, joints) switch materials independently,
  with style presets and a fire toggle.
- 360° turntables for the Kachelofen example rendered from the 3D model, one
  per material preset (`npm run gen:turntable`, 3 × 24 frames), replacing the
  AI-generated ±60° arc. The turntable and the 3D model share the active preset.

- The demo notice bar carries a Basis/Premium package switch, so the package
  choice stays available when no access code is configured. The public demos
  now run without an access code.

### Fixed

- Material colours are converted from sRGB to linear before reaching the 3D
  renderer, so dark finishes (Anthrazit, Tannengrün) no longer look washed out.

### Changed

- Demo mode no longer obfuscates the bundle and no longer embeds an author
  identity or anti-reuse wording; everything is driven by `VITE_DEMO_*` variables.
- Generated launch/content reports are written to `docs/generated/` (git-ignored).

### Removed

- `javascript-obfuscator` build step, internal go-to-market and launch reports,
  private design-tool identifiers.

# Design system source

`ofenbau-mustermann.design.md` is the canonical **Ofenbau Mustermann** design
system in [Google Stitch](https://stitch.withgoogle.com/) `design.md` format
(YAML frontmatter + markdown). It is derived from the repo's source of truth,
`src/styles/tokens.css`, and the reference screens, and is the warm, light
"hearth" system the app implements.

It can be mirrored into your own Stitch project (`STITCH_PROJECT_ID`) as the
design system **"Ofenbau Mustermann"**. The original project also holds a dark
**"Max Mustermann"** monolith system that must never be mixed with this one.

See [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) → *Design systems (Stitch
sync)* for how to keep the repo, this file, and Stitch in sync.

> **AI agents:** read [`AI.md`](../AI.md) → *Design system* before touching styles.
> It has the token usage, type scale, and the do/don't rules (single light
> "hearth" theme, **no dark mode**, single burnt-orange accent, `ink` panels —
> never the dark "Max Mustermann" look). The live source of truth is
> `src/styles/tokens.css`; this file is its Stitch mirror — change tokens first,
> then update this `design.md` to match.

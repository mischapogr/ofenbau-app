# MCP Setup & Usage Guide

This project is configured for AI-assisted development across multiple agents
(**Claude Code, Codex, Google Antigravity, Qoder, Cursor, Windsurf, VS Code /
Copilot, Claude Desktop**). MCP (Model Context Protocol) servers give every agent
the same capabilities: live docs, safe file access, browser testing, repo
management, design generation, code-graph analysis and structured planning.

> **Golden rule:** the canonical server list lives in [`.mcp.json`](../.mcp.json)
> at the project root. Every other agent config mirrors it. When you add or
> change a server, update `.mcp.json` first, then propagate.

---

## 1. Configured MCP servers

| Server | Package / Image | Secrets | What it's for |
| --- | --- | --- | --- |
| **context7** | `@upstash/context7-mcp` | – | Up-to-date docs & code examples |
| **filesystem** | `@modelcontextprotocol/server-filesystem` | – | Safe file access, **scoped to the project root** |
| **sequential-thinking** | `@modelcontextprotocol/server-sequential-thinking` | – | Structured planning / debugging |
| **playwright** | `@playwright/mcp` | – | Browser testing & visual checks |
| **github** | `ghcr.io/github/github-mcp-server` (Docker) | `GITHUB_PERSONAL_ACCESS_TOKEN` | Issues, PRs, branches, commits, reviews |
| **codegraphcontext** | `codegraphcontext` (via `uvx`) | – | Graph of components/routes/stores/services |
| **stitch** | `stitch-mcp` (Kargatharaakash) | `GOOGLE_CLOUD_PROJECT` + gcloud ADC | UI/UX generation, design-to-code |
| **docker** *(optional)* | `docker-mcp` / Docker MCP toolkit | – | Inspect containers, logs, compose |

### When to use each (the development rules)

- **Always use `context7` BEFORE generating code** for Vue 3, Vite, Vue Router,
  Pinia, Tailwind CSS, Axios or Docker Compose. Don't rely on memory for APIs.
- **Use `stitch` BEFORE creating new page layouts or UI components.** Generate a
  high-fidelity layout, extract its design DNA, then map it onto
  [`src/styles/tokens.css`](../src/styles/tokens.css) so tokens stay reusable.
- **Use `codegraphcontext` BEFORE refactoring** existing code — check dependency
  and blast radius across components, routes, stores, composables and services.
- **Use `playwright` AFTER UI changes** — responsive testing, navigation, forms,
  visual regression. Test the app on `http://localhost:5173`.
- **Use `sequential-thinking`** for complex refactors, architecture decisions and
  multi-step debugging.
- **Use `github`** for repository workflow: issues, PRs, branches, commits,
  reviews.
- **Use `filesystem`** for file access — it is restricted to the project root.
- **Use `docker`** (if available) to check containers, logs and compose services.

### Security rules

- Never expose `.env` values or secrets to MCP tools unless explicitly required.
- MCP **filesystem access is limited to the project directory** (`.` /
  `${workspaceFolder}` / an absolute project path — never `/` or `$HOME`).
- Secrets are passed via environment variables (`GITHUB_PERSONAL_ACCESS_TOKEN`,
  `GOOGLE_CLOUD_PROJECT`), never hard-coded. See [`.mcp.env.example`](../.mcp.env.example).
- Docker Compose remains the standard local environment (`docker compose up -d`).

---

## 2. Prerequisites

- **Node 22+** (for `npx`-based servers).
- **Docker** running (for the GitHub MCP image, and the `docker` MCP).
- **`uv`/`uvx`** (for `codegraphcontext`) — install from <https://docs.astral.sh/uv/>.
- A **GitHub PAT** with `repo` scope for the GitHub server.
- For **Stitch**: the [`stitch-mcp`](https://github.com/Kargatharaakash/stitch-mcp)
  package (auto-fetched via `npx`) and a Google Cloud project with the Stitch API
  enabled. It authenticates through gcloud Application Default Credentials — there
  is **no API key**.

Load secrets once per shell before starting an agent:

```bash
cp .mcp.env.example .mcp.env   # then fill in the values
set -a; source .mcp.env; set +a
```

> **Stitch setup:** `stitch-mcp` runs via `npx -y stitch-mcp` and authenticates
> with Google Cloud (not an API key). One-time:
>
> ```bash
> gcloud auth login
> gcloud auth application-default login
> gcloud auth application-default set-quota-project YOUR_GCP_PROJECT_ID
> gcloud beta services mcp enable stitch.googleapis.com
> ```
>
> Then set `GOOGLE_CLOUD_PROJECT` (your project id) in the server's `env`.
> In **Antigravity**, install Stitch from the built-in MCP marketplace instead
> (Agent pane → ⋯ → MCP Servers → search "Stitch" → Install) and paste the project
> there. The design-to-code workflow (Stitch → `tokens.css` → Vue) is unchanged.

---

## 3. Per-agent setup

All agents use the same server definitions; only the file location and a couple
of schema details differ.

### Claude Code
Reads [`.mcp.json`](../.mcp.json) at the project root automatically. Approve the
servers when prompted (`/mcp` to inspect). `${ENV}` placeholders are expanded
from your shell environment.

### Codex (CLI / IDE)
Codex reads project-scoped MCP servers from `.mcp.json` as well. If your Codex
version uses `~/.codex/config.toml`, translate each entry to:

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp@latest"]
```

### Cursor
Copy the `mcpServers` object from [`.mcp.json`](../.mcp.json) into
`.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global), then verify under
**Settings → MCP**. Cursor uses the same `mcpServers` schema and expands `${ENV}`
from your shell.

### VS Code / GitHub Copilot
Add the servers via **MCP: Add Server** (or a `.vscode/mcp.json`). VS Code uses a
`servers` + `inputs` schema (not `mcpServers`), so wrap secrets as `inputs` with
`"password": true` to be prompted securely on first use instead of storing tokens
on disk. Reuse the command/args from [`.mcp.json`](../.mcp.json). Start servers
from the **MCP: List Servers** command.

### Windsurf (Cascade)
Merge the `mcpServers` object from [`.mcp.json`](../.mcp.json) into
`~/.codeium/windsurf/mcp_config.json` (or add via **Settings → Cascade → MCP →
Add custom server**). Windsurf has no project root, so set the filesystem server
to an **absolute path** and paste real values (it does not expand `${ENV}`).

### Claude Desktop
Use [`docs/mcp/claude-desktop.json`](./mcp/claude-desktop.json). Merge into:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Claude Desktop has no project root, so the filesystem server uses an **absolute
path** — set it to your checkout. It does not expand `${ENV}`; paste real tokens.

### Google Antigravity
Antigravity supports MCP via its settings (**Settings → MCP / Tools → Add MCP
server**) or an `mcp.json`/`mcp_config.json` in its config dir. Reuse the same
server blocks from `.mcp.json`. Scope filesystem to this project's absolute path.

### Qoder
Qoder reads MCP servers from its MCP settings panel (**Settings → MCP**) or a
project `mcp.json`. Reuse the `.mcp.json` blocks verbatim; pass secrets through
environment variables and keep filesystem scoped to the project.

---

## 4. Keeping configs in sync (multi-agent hygiene)

Because several agents (Claude Code, Codex, Antigravity, Qoder, Cursor, …) edit
this repo:

1. **`.mcp.json` is the single source of truth.** Change it first; every agent
   either reads it directly or you copy its `mcpServers` block into the agent's
   own config (see §3). The only committed mirror is
   [`docs/mcp/claude-desktop.json`](./mcp/claude-desktop.json), kept because
   Claude Desktop needs an absolute filesystem path and literal tokens.
2. Keep secrets out of git — only `*.example` files are committed; `.mcp.env` is
   git-ignored. Per-tool configs you create locally (`.cursor/mcp.json`,
   `.vscode/mcp.json`) are git-ignored too.
3. Keep filesystem scope at the project root in every config.
4. Project conventions for all agents live in [`AI.md`](../AI.md) and
   [`CLAUDE.md`](../CLAUDE.md).

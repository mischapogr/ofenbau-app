# Secrets and configuration

This is a public repository. The rule is simple: **nothing in git can unlock
anything on its own.** Three kinds of values exist.

| Kind                            | Examples                                                                                       | Where it lives                                                                | In git?                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| Public build config             | every `VITE_*` variable (`.env.development`, `.env.demo`, `.env.production`)                   | committed env files                                                           | yes — these ship to the browser, so they are never secret |
| Developer credentials           | `GITHUB_PERSONAL_ACCESS_TOKEN`, `STITCH_API_KEY`, `STITCH_PROJECT_ID`, `CLOUDFLARE_API_TOKEN`  | your git-ignored `.mcp.env` (template: `.mcp.env.example`)                    | no                                                        |
| Runtime secrets of a deployment | `DEMO_SESSION_SECRET` for the per-customer gate (codes themselves are hashes in Cloudflare KV) | Cloudflare Pages secrets (`wrangler pages secret put …`), `.dev.vars` locally | no                                                        |

The repo owner additionally keeps **their own** credentials encrypted in
`secrets/ofenbau.enc.env` (sops + age) so a fresh clone on another machine is
ready after restoring one key file. Contributors ignore that file entirely.

## For contributors

```bash
cp .mcp.env.example .mcp.env     # fill in what you need (MCP servers only)
direnv allow                     # or: set -a; source .mcp.env; set +a
```

That is all. The app itself needs no secrets to build or run locally.

## Demo access code (client-side gate)

The optional demo gate in `src/composables/useDemoProtection.js` compares an
unsalted SHA-256 of the entered code with `VITE_DEMO_ACCESS_CODE_HASH`. Because
the hash is baked into the public bundle it can be brute-forced offline, so:

- keep `VITE_DEMO_ACCESS_CODE_HASH=""` in the committed `.env.demo`;
- use a long random code (`openssl rand -base64 18`);
- supply the hash at build time through the environment (`direnv` + sops for the
  owner, a GitHub Actions secret in CI) or the git-ignored `.env.demo.local`;
- treat it as casual gating only. For real protection use the server-side gate.

Compute a hash:

```bash
node -e "const {createHash}=require('node:crypto'); console.log(createHash('sha256').update(process.argv[1]).digest('hex'))" "your-code"
```

## Per-customer gate (Cloudflare Pages Functions)

Prospects log in with personal codes managed by `npm run demo:access`; only
SHA-256 hashes of the codes are stored, in the `DEMO_ACCESS` KV namespace. The
only secret is `DEMO_SESSION_SECRET`, which signs the session cookies and the
package-handoff tokens; `npm run demo:access -- setup` copies it from your
environment to all demo projects. Details and commands:
[`DEMO_PAGES.md`](./DEMO_PAGES.md#customer-access-codes).

## Cloudflare deploys

`npm run demo:pages:*` deploys with `wrangler pages deploy`. Authentication is
either the interactive `wrangler login` (OAuth, stored outside the repo) or the
env vars `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`. Create the token with
the single permission **Account → Cloudflare Pages → Edit** (optionally
**User → User Details → Read**); do not use the broad "Edit Cloudflare Workers"
template. The same two values are the GitHub Actions secrets used by
`.github/workflows/pages-deploy.yml`.

## Owner workflow: sops + age

Install once (Linux):

```bash
sudo apt install age                      # or the release tarball into ~/.local/bin
# sops: https://github.com/getsops/sops/releases (binary or .deb)
age-keygen -o ~/.config/sops/age/keys.txt && chmod 600 ~/.config/sops/age/keys.txt
```

Back up `~/.config/sops/age/keys.txt` in your password manager. Its public
recipient is listed in `.sops.yaml`.

| Task                | Command                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Edit secrets        | `npm run secrets:edit` (= `sops secrets/ofenbau.enc.env`)                                            |
| Read one value      | `sops decrypt secrets/ofenbau.enc.env \| grep STITCH_API_KEY`                                        |
| Load into the shell | automatic via `.envrc` (`direnv allow` once) — nothing is written to disk                            |
| New machine         | restore the key file, `direnv allow`, done                                                           |
| Add a second key    | add its `age1…` to `.sops.yaml`, then `sops updatekeys secrets/ofenbau.enc.env`                      |
| Rotate the age key  | add new key, `sops updatekeys`, remove old key, `sops rotate -i secrets/ofenbau.enc.env`             |
| Rotate a credential | revoke at the provider, update the value, re-run `wrangler pages secret put` if it is a Pages secret |

Only add keys that have a value. `.envrc` exports every key, so an empty
`CLOUDFLARE_ACCOUNT_ID=` makes wrangler ignore your `wrangler login`, and an empty
`GITHUB_PERSONAL_ACCESS_TOKEN=` blanks the token your shell already has. Remove a
key with `sops unset secrets/ofenbau.enc.env '["KEY"]'`.

Accepted trade-off: if the age key ever leaks, every historical version of the
encrypted file becomes readable. The answer is rotating the credentials inside
it, which you would do anyway.

## Leak guards

- `.githooks/pre-commit` (installed by `npm install` through the `prepare`
  script) refuses local secret files and runs [gitleaks](https://github.com/gitleaks/gitleaks)
  on staged changes when it is installed.
- Enable **Secret scanning** and **Push protection** in the GitHub repository
  settings (free for public repos).
- Full-history scan: `gitleaks git --redact`.

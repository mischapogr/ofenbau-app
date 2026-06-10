# Demo tunnel runbook

> **For a permanent, always-on demo** (no laptop, no Docker, stable URL) use
> Cloudflare Pages instead — see [`DEMO_PAGES.md`](./DEMO_PAGES.md). This tunnel
> is the quick, throwaway option for ad-hoc shares from your own machine.

Exposes the protected demo to an external customer over HTTPS using a Cloudflare
**quick tunnel** in front of the obfuscated `build:demo` (served by `vite preview`).

- **Access code:** `***REMOVED-DEMO-CODE***`
- **Stack:** `docker-compose.demo.yml` — `ofenbau-demo-web` (build + serve) and
  `ofenbau-demo-tunnel` (Cloudflare quick tunnel), both `restart: unless-stopped`.

## Everyday use

```bash
npm run demo:up      # start: build the obfuscated demo, serve it, open the tunnel
npm run demo:url     # print the current https://<random>.trycloudflare.com + code
npm run demo:down    # stop everything
```

Send the customer the URL from `demo:url` plus the access code. That's it.

## The URL changes — that's expected

A quick-tunnel hostname is random and is **re-assigned every time the tunnel
process starts fresh** — i.e. after a reboot, a crash, or a deliberate refresh.
`restart: unless-stopped` keeps the containers alive across reboots/crashes, but
each fresh start produces a **new** URL.

When that happens you do **not** rebuild anything — the demo build already trusts
`*.trycloudflare.com` (see `VITE_DEMO_ALLOWED_HOSTS` in `.env.demo`). Just read the
new link and re-share it:

```bash
npm run demo:url
```

To **deliberately rotate** to a fresh URL (e.g. to retire a link you shared):

```bash
npm run demo:refresh   # restarts the tunnel → new URL → prints it
```

The current URL is also saved to `_tmp/demo-url.txt`.

## How `demo:url` finds the link

`scripts/demo-tunnel-url.mjs` reads cloudflared's metrics endpoint
`http://127.0.0.1:20241/quicktunnel` (published by the tunnel container). If that
is unreachable it falls back to scraping `docker logs ofenbau-demo-tunnel`.

## Why it isn't a permanent URL

A fixed URL needs a **named tunnel** bound to a DNS record in a **domain you own
on Cloudflare** (free plan). Without a domain, quick tunnels are the only option
and their URLs are ephemeral by design. If you later get a domain, the upgrade is:
`cloudflared tunnel login` → `tunnel create` → `tunnel route dns <name> demo.<your-domain>`
→ point the tunnel at `demo-web:5174` via a credentials-file config, and add
`demo.<your-domain>` to `VITE_DEMO_ALLOWED_HOSTS` before building.

## Security notes

- The tunnel terminates TLS at Cloudflare; the access gate hashes the code with
  `crypto.subtle`, which only works over HTTPS — so the tunnel URL works but plain
  `http://…:5174` / LAN-IP access cannot unlock the gate.
- `.env.demo` (incl. the access-code hash) is committed; this is casual gating, not
  real security. Treat the demo as semi-public.

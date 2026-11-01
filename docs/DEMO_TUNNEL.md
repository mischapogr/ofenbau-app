# Demo tunnel runbook

> For a permanent, always-on demo (no laptop, no Docker, stable URL) use
> Cloudflare Pages instead — see [`DEMO_PAGES.md`](./DEMO_PAGES.md). This tunnel
> is the quick, throwaway option for ad-hoc shares from your own machine.

Exposes the demo build to an external viewer over HTTPS using a Cloudflare
**quick tunnel** in front of `build:demo` (served by `vite preview`).

- **No per-customer gate:** the tunnel serves the build with `vite preview`,
  which has no Pages Functions, so anyone with the link can open it. Use it only
  for short shares; prospects get the gated Pages demos
  ([`DEMO_PAGES.md`](./DEMO_PAGES.md#customer-access-codes)).
- **Stack:** `docker-compose.demo.yml` — `ofenbau-demo-web` (build + serve) and
  `ofenbau-demo-tunnel` (Cloudflare quick tunnel), both `restart: unless-stopped`.

## Everyday use

```bash
npm run demo:up      # start: build the demo, serve it, open the tunnel
npm run demo:url     # print the current https://<random>.trycloudflare.com
npm run demo:down    # stop everything
```

Send the viewer the URL from `demo:url` plus the access code.

## The URL changes — that's expected

A quick-tunnel hostname is random and is re-assigned every time the tunnel
process starts fresh (reboot, crash, deliberate refresh). `restart: unless-stopped`
keeps the containers alive, but each fresh start produces a new URL.

You do not rebuild anything — the demo build already trusts `*.trycloudflare.com`
(see `VITE_DEMO_ALLOWED_HOSTS` in `.env.demo`). Just read the new link:

```bash
npm run demo:url
npm run demo:refresh   # deliberately rotate to a fresh URL
```

The current URL is also saved to `_tmp/demo-url.txt`.

## How `demo:url` finds the link

`scripts/demo-tunnel-url.mjs` reads cloudflared's metrics endpoint
`http://127.0.0.1:20241/quicktunnel` (published by the tunnel container). If that
is unreachable it falls back to scraping `docker logs ofenbau-demo-tunnel`.

## Why it isn't a permanent URL

A fixed URL needs a **named tunnel** bound to a DNS record in a domain you own
on Cloudflare (free plan). The upgrade is: `cloudflared tunnel login` →
`tunnel create` → `tunnel route dns <name> demo.<your-domain>` → point the tunnel
at `demo-web:5174` via a credentials file, and add `demo.<your-domain>` to
`VITE_DEMO_ALLOWED_HOSTS` before building. The tunnel token is then a runtime
secret — keep it out of git (see [`SECRETS.md`](./SECRETS.md)).

## Security notes

- The tunnel terminates TLS at Cloudflare; the client gate hashes the code with
  `crypto.subtle`, which only works over HTTPS — plain `http://…:5174` access
  cannot unlock it.
- The client-side gate is casual gating, not real security. For a real gate use
  the Pages deployment with the server-side middleware.

# Deployment Cutover Checklist

Generated: 2026-06-11T06:09:43.197Z

Use this worksheet for production DNS, HTTPS, hosting and post-deploy handoff.
It summarizes repository deployment wiring and lists the external cutover
proof that must be captured outside the repo. Do not store hosting passwords,
DNS credentials or private provider screenshots here.

## Repository Deployment Wiring

| Check | Source | Status | Detail |
| --- | --- | --- | --- |
| Dockerfile.prod | `Dockerfile.prod` | Done | Production nginx image build exists. |
| Dockerfile.contact | `Dockerfile.contact` | Done | Contact API image build exists. |
| Compose file | `docker-compose.prod.yml` | Done | Production-style web/api services are defined. |
| Nginx API proxy | `nginx.conf` | Done | Same-origin `/api` is proxied to the contact API. |
| SPA fallback | `nginx.conf` | Done | Client-side routes return `index.html`. |
| Nginx security headers | `nginx.conf` | Done | Security headers are configured for HTML/API responses and repeated in the hashed-asset location. |
| Production env example | `.env.production.example` | Done | Deployment env checklist exists. |

## Current Deployment Inputs

| Input | Current state | Source |
| --- | --- | --- |
| Public HTTPS domain | http://localhost:5173 (open) | Deployment env -> `VITE_APP_URL` |
| Contact API base URL | /api (ready) | Deployment env -> `VITE_API_BASE_URL` |
| Production SMTP values | Open | Deployment env -> `MAIL_HOST`, `MAIL_FROM`, `MAIL_TO` |
| GA4 measurement ID | (empty) (open) | Deployment env -> `VITE_GA_MEASUREMENT_ID` |
| Search Console token | (empty) (open) | Deployment env -> `VITE_GOOGLE_SITE_VERIFICATION` |

## Cutover Verification Steps

| Step | Command or action | Expected result | Evidence to record |
| --- | --- | --- | --- |
| Build production image | Hosting CI or `docker compose -f docker-compose.prod.yml build` | Web and contact API images build with production env values. | Record build ID, commit and image tag. |
| DNS cutover | Configure A/AAAA/CNAME records at DNS provider | Final domain resolves to the hosting target. | Record DNS provider, record type, target and TTL. |
| HTTPS certificate | Hosting provider / reverse proxy certificate setup | Production URL serves HTTPS without certificate warnings. | Record certificate issuer and expiration date. |
| Production health | `npm run deploy:all -- https://domain.example` | Route/API/header, SEO, analytics consent, Maps consent, contact-link, accessibility, visual and performance smoke checks pass; set `ANALYTICS_SMOKE_GA_ID` when GA4 is enabled. | Attach command output to launch evidence. |
| Sitemap and robots | Open `/sitemap.xml` and `/robots.txt` on production domain | Both files reference the final HTTPS production domain. | Record URLs and timestamp. |
| Contact mailbox proof | `CONTACT_DELIVERY_CONFIRM=send npm run contact:delivery -- https://domain.example` | Marked contact test is received in the real mailbox. | Record mailbox checker and timestamp. |
| Search Console and GA4 | `npm run launch:accounts` plus manual Google checks | Ownership, sitemap, GA4 consent and Realtime checks are completed. | Record property/stream IDs and checker. |
| Rollback path | Hosting provider rollback or previous image redeploy | Known rollback action exists before DNS/live traffic is switched. | Record rollback owner and command/provider action. |

## Useful Commands

```bash
npm run launch:deployment
npm run deploy:config
npm run deploy:links -- https://domain.example
npm run launch:check
ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example
CONTACT_DELIVERY_CONFIRM=send CONTACT_DELIVERY_REPLY_TO=launch-test@example.de npm run contact:delivery -- https://domain.example
npm run launch:evidence
```

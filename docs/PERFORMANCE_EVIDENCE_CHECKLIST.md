# Performance Evidence Checklist

Generated: 2026-06-07T18:14:04.397Z

Use this worksheet for production performance handoff. Local browser smoke
checks catch regressions before launch; Lighthouse/PageSpeed and field data
must still be captured on the final HTTPS domain.

## Local Performance Evidence

| Check | Command or artifact | Current evidence |
| --- | --- | --- |
| Static asset budgets | `npm run perf:budget` | JS/CSS hard budgets pass and large images are reviewed. |
| Browser performance smoke | `npm run deploy:perf -- http://localhost:5174` inside preflight | Core public routes pass timing, resource, image and console/error checks. |
| Visual smoke artifact | docs/audits/VISUAL_SMOKE.md | Present (2026-06-07T14:07:07.051Z). |
| Production URL readiness | VITE_APP_URL=http://localhost:5173 | Open |

## Browser Smoke Budgets

| Metric | Budget |
| --- | --- |
| DOMContentLoaded | 3500ms |
| Load | 6000ms |
| FCP | 2500ms |
| LCP | 4000ms |
| TBT | 300ms |
| CLS | 0.1 |
| Transfer | 2500KB |
| Resources | 120 |

## Production Performance Evidence

| Step | Command or action | Expected result | Evidence to record |
| --- | --- | --- | --- |
| Production browser performance smoke | `npm run deploy:perf -- https://domain.example` | Routes pass DOM/load, FCP, LCP, TBT, CLS, transfer, resource, broken-image and browser-error checks. | Attach command output to launch evidence. |
| Aggregate deploy smoke | `ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example` | Performance smoke passes as part of the full route/API/header, SEO, analytics/Maps consent, contact-link, accessibility and visual suite. | Attach command output to launch evidence. |
| Lighthouse/PageSpeed mobile | Manual Lighthouse or PageSpeed run on production URL | Mobile performance, accessibility, best-practices and SEO scores are recorded with any issues triaged. | Record report URL/file, date, device mode and follow-up owner. |
| Lighthouse/PageSpeed desktop | Manual Lighthouse or PageSpeed run on production URL | Desktop scores are recorded with any render-blocking, image, cache or JS issues triaged. | Record report URL/file, date, device mode and follow-up owner. |
| Field evidence | Search Console Core Web Vitals / CrUX when available | Field data is checked after the domain has enough traffic, or noted as unavailable at launch. | Record status in launch ticket. |

## Useful Commands

```bash
npm run launch:performance
npm run perf:budget
npm run deploy:perf -- https://domain.example
ANALYTICS_SMOKE_GA_ID=G-... npm run deploy:all -- https://domain.example
npm run preflight
```

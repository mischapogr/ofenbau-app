# Content Editing Guide

This project does not include a browser CMS. The lightweight editing workflow is
static and data-driven: content lives in `src/data/*`, while pages and
components render those data files.

## Edit These Files

| Content area | File | Notes |
| --- | --- | --- |
| Company/NAP, nav, social links | `src/data/company.js` | Replace all placeholder company, address, phone, email and social values before launch; switch `companyProfileReview` flags only after final NAP, Google Business Profile and Maps route checks. |
| Services | `src/data/services.js` | Drives home cards, service overview and service detail pages; switch `serviceContentReview.approvedForLaunch` only after wording/proof points are approved. |
| Projects/references | `src/data/projects.js` | Drives the filterable gallery and lightbox. Use only approved real project photos for launch; switch `projectReferenceReview.approvedForLaunch` only after approvals are documented. |
| Process steps | `src/data/process.js` | Drives the workflow timeline. |
| 3D planning copy/examples | `src/data/planning.js` | Drives the 3D planning sections and examples. |
| Legal/privacy | `src/data/legal.js`, `src/pages/LegalView.vue`, `src/components/PrivacyContent.vue` | Must be reviewed with the final operator details; launch flags live in `src/data/legal.js`. |

## Image Replacement

Put launch images in `public/images/` and reference them with absolute public
paths such as `/images/project-1-kachelofen-landhaus.webp`.

Recommended rules:

- Use WebP for photos.
- Keep individual images under roughly 350 KB unless there is a clear reason.
- Keep filenames stable when replacing existing placeholder/generated images.
- Confirm project/reference photo rights before launch.
- After replacing demo references, set `projectReferenceReview.approvedForLaunch`
  in `src/data/projects.js` to `true`.

## Content Inventory

Generate a machine-readable inventory:

```bash
npm run content:inventory
```

This writes `docs/CONTENT_INVENTORY.json`, including placeholder flags for known
demo patterns such as `Muster`, `Mustermann`, dummy phone numbers, `.test`,
`example.com` and localhost values.

## Launch Editing Checklist

1. Replace `src/data/company.js` with real NAP data, then set `companyProfileReview.napApprovedForLaunch`, `companyProfileReview.googleBusinessProfileAligned` and `companyProfileReview.mapRouteVerified` to `true` after verification.
2. Replace generic social profile URLs.
3. Review every service title, intro, description and bullet, then set `serviceContentReview.approvedForLaunch` to `true`.
4. Replace generated/demo project references with approved real projects and set `projectReferenceReview.approvedForLaunch` to `true`.
5. Confirm all referenced images exist in `public/images/`.
6. Replace legal template text and representative details, then switch the reviewed flags in `src/data/legal.js`.
7. Run `npm run content:inventory`, `npm run launch:report`, `npm run build` and `npm run test:e2e`.

Use `npm run content:assets` after replacing images. It fails if a service,
project or 3D planning example points at a missing file.

For a complete operator-facing list of required real-world inputs, use
`docs/PRODUCTION_INPUTS.md`.

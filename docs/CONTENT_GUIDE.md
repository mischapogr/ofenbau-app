# Content Editing Guide

This project does not include a browser CMS. The lightweight editing workflow is
static and data-driven: content lives in `src/data/*`, while pages and
components render those data files.

## Edit These Files

| Content area | File | Notes |
| --- | --- | --- |
| Company/NAP, nav, social links | `src/data/company.js` | Replace all placeholder company, address, phone, email and social values before launch; generic social homepage URLs stay hidden in the public footer until replaced; switch `companyProfileReview` flags only after final NAP, Google Business Profile and Maps route checks. |
| Contact topics and mailbox subjects | `src/data/contactTopics.js` | Drives contact form topic labels, email subject suffixes and service-detail topic preselection; switch `contactTopicReview` and `contactTopicRoutingReview` only after operator/mailbox approval. |
| Homepage copy, claims and media | `src/data/home.js`, `src/components/HeroSection.vue`, `src/components/AboutSection.vue`, `src/components/ProcessTimeline.vue`, `src/components/CTASection.vue` | Review hero/about/process/CTA copy, proof claims and media; switch `homepageContentReview.approvedForLaunch` only after final operator approval. |
| About/contact page copy | `src/data/pages.js`, `src/pages/AboutView.vue`, `src/pages/ContactView.vue` | Review standalone about/contact page headers, value cards and form intro copy; switch `publicPageContentReview.approvedForLaunch` only after final operator approval. |
| Services | `src/data/services.js` | Drives home cards, service overview and service detail pages; switch `serviceContentReview.approvedForLaunch` only after wording/proof points are approved. |
| Projects/references | `src/data/projects.js` | Drives the filterable gallery and lightbox. Use only approved real project photos for launch; switch `projectReferenceReview.approvedForLaunch` only after approvals are documented. |
| Process steps | `src/data/process.js` | Drives the workflow timeline. |
| 3D planning copy/examples | `src/data/planning.js` | Drives the 3D planning sections and examples; switch `planningContentReview.approvedForLaunch` only after the operator workflow and media approvals are documented. |
| Legal/privacy | `src/data/legal.js`, `src/pages/LegalView.vue`, `src/components/PrivacyContent.vue` | Must be reviewed with the final operator details; launch flags live in `src/data/legal.js`. |

## Image Replacement

Put launch images in `public/images/` and reference them with absolute public
paths such as `/images/project-1-kachelofen-landhaus.webp`.

Recommended rules:

- Use WebP for photos.
- Keep individual images under roughly 350 KB unless there is a clear reason.
- Keep filenames stable when replacing existing placeholder/generated images.
- Confirm project/reference photo rights and 3D planning visual approvals before launch.
- Confirm contact topic labels, email subject suffixes and service-detail topic routing before launch.
- After approving contact topics and routing, set `contactTopicReview.approvedForLaunch`
  and `contactTopicRoutingReview.approvedForLaunch` in `src/data/contactTopics.js`
  to `true`.
- Confirm homepage hero/about media and public proof claims before launch.
- After approving homepage copy and media, set `homepageContentReview.approvedForLaunch`
  in `src/data/home.js` to `true`.
- After approving about/contact page copy, set `publicPageContentReview.approvedForLaunch`
  in `src/data/pages.js` to `true`.
- After replacing demo references, set `projectReferenceReview.approvedForLaunch`
  in `src/data/projects.js` to `true`.
- After approving 3D planning examples, set `planningContentReview.approvedForLaunch`
  in `src/data/planning.js` to `true`.

## Content Review Checklist

Generate a human-readable review worksheet for service, project and 3D planning
approval:

```bash
npm run content:review
```

This writes `docs/generated/CONTENT_REVIEW_CHECKLIST.md`, including contact topic rows,
homepage review sections, standalone about/contact page sections, every service
detail route, content counts, project media path, 3D planning example path and
per-item approval state.

## Content Inventory

Generate a machine-readable inventory:

```bash
npm run content:inventory
```

This writes `docs/generated/CONTENT_INVENTORY.json`, including placeholder flags for known
demo patterns such as `Muster`, `Mustermann`, dummy phone numbers, `.test`,
`example.com` and localhost values.

## Placeholder Report

Generate a human-readable placeholder and approval report:

```bash
npm run content:placeholders
```

This writes `docs/generated/PLACEHOLDER_CONTENT_REPORT.md`, listing structured fields that
still look like demo data, generic social links or unresolved launch approvals.

## Launch Editing Checklist

1. Replace `src/data/company.js` with real NAP data, then set `companyProfileReview.napApprovedForLaunch`, `companyProfileReview.googleBusinessProfileAligned` and `companyProfileReview.mapRouteVerified` to `true` after verification.
2. Replace generic social profile URLs; the public footer intentionally hides platform-homepage placeholders until real profiles are entered.
3. Review contact topics, email subject suffixes and service-detail routing, then set contact topic approval flags to `true`.
4. Review homepage hero/about/process/CTA copy, proof claims and media, then set `homepageContentReview.approvedForLaunch` to `true`.
5. Review standalone about/contact page copy, then set `publicPageContentReview.approvedForLaunch` to `true`.
6. Review every service title, intro, description and bullet, then set `serviceContentReview.approvedForLaunch` to `true`.
7. Replace generated/demo project references with approved real projects and set `projectReferenceReview.approvedForLaunch` to `true`.
8. Confirm 3D planning examples and generated visuals match the real workflow, then set `planningContentReview.approvedForLaunch` to `true`.
9. Confirm all referenced images exist in `public/images/`.
10. Replace legal template text and representative details, then switch the reviewed flags in `src/data/legal.js`.
11. Run `npm run content:review`, `npm run content:placeholders`, `npm run content:inventory`, `npm run launch:report`, `npm run build` and `npm run test:e2e`.

Use `npm run content:assets` after replacing images. It fails if a service,
project or 3D planning example points at a missing file.

For a complete operator-facing list of required real-world inputs, use
`docs/PRODUCTION_INPUTS.md`. To generate a fillable worksheet from the current
repo state, run `npm run launch:inputs`; it writes `docs/generated/OPERATOR_INPUT_FORM.md`.

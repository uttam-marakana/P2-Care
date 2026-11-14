# Site audit findings

Audit date: 2026-11-14  
Method: source inspection, frontend production build, and limited browser checks on local routes. No external crawler, production deployment, analytics account, search-console account, or screen-reader test was available.

## Overall assessment

The site has a clear public route structure, route-level metadata, a protected admin area, robots directives, a sitemap, responsive layouts, and Firebase/mock operating modes. It is not production-ready for organic search until the canonical production host and sitemap are configured and the organization confirms the published hospital identity, address, phone, clinical content, and legal requirements.

## Findings

| Priority | Status | Finding | Evidence and action |
|---|---|---|---|
| P0 — release blocker | Open | Static SEO files use an example host. | `frontend/public/robots.txt`, `frontend/public/sitemap.xml`, `frontend/.env.example`, and the canonical/social URL templates require the approved public host. Replace every example origin before deployment; verify the built canonical, sitemap, robots response, and social image URL use that same host. |
| P1 — high | Open | Search metadata is client-rendered. | `SEO.jsx` updates title, description, canonical, and social metadata in a React effect. Search engines may execute this, but crawlers and link unfurlers can initially receive only the static HTML metadata. Validate rendered output with crawler tools; use prerendering or server rendering if reliable non-JavaScript metadata is required. |
| P1 — high | Open | The sitemap is a manually maintained list and omits individual doctor profiles. | `frontend/public/sitemap.xml` lists public collection pages, not `/doctors/:id` pages. Generate or update profile URLs from the published CMS data and keep drafts and admin routes excluded. There is currently no individual article-detail route to include. |
| P1 — high | Verify | Structured data contains fixed clinic details. | `frontend/src/components/seo/HospitalSchema.jsx` publishes the hospital type, street/locality, phone, region, and specialty list. Confirm every value with the organization and keep it consistent with the contact and visit pages. Remove any claim that cannot be verified. |
| P1 — high | Open | Social and legal footer destinations are incomplete. | Social anchors in `Footer.jsx` use `href="#"`; the privacy/accessibility labels are plain text. Supply real approved destinations or render non-interactive text, and publish the applicable privacy, accessibility, and terms information before production. |
| P1 — high | Verify | Firebase authentication requests failed during local browser QA. | Browser checks observed failed Firebase-hosted auth resource requests while the UI rendered. Verify Firebase project configuration, authorized domains, API availability, and production origin; retest a real sign-in flow before release. |
| P2 — medium | Open | No automated test or lint scripts are defined. | Frontend and backend package manifests expose build/dev/start scripts but no automated test/lint runner. Add route/form/API smoke tests and an accessibility check in CI; retain the production build as a compilation gate. |
| P2 — medium | Open | Accessibility needs a dedicated pass. | Visible focus styles and labeled form controls are present, but a keyboard/screen-reader review, skip-to-content link, error announcement check, and contrast check were not completed. Test with keyboard and assistive technology before release. |
| P2 — medium | Open | Clinic location text must be verified for accuracy. | The site uses a fixed Silver Oaks Hospital / Phase-IX / Sector-63 / SAS Nagar address. Confirm the full postal address, map destination, and service area with the organization; do not infer missing locality data. |
| P2 — medium | Open | Privacy and analytics behavior is not established by this repository review. | Confirm whether analytics, tracking, cookies, or third-party embeds are enabled by the deployment. Provide required notices/consent and retention disclosures for the applicable jurisdictions. |
| P3 — low | Fixed in audit | Several search placeholders exposed icon component names; a campus phase string was corrupted. | Search placeholders now use user-facing wording, and the campus address now uses “Phase-IX” consistently. |

## Checks completed

- `npm run build` in `frontend/` passed. Vite emitted a non-blocking warning that the main JavaScript chunk exceeds 500 kB minified.
- Browser spot checks confirmed the service illustrations, doctor fallback portraits, footer menu behavior, appointment field rendering, and responsive page width on tested screens.
- Country-aware phone input uses libphonenumber metadata; sample mobile numbers for India, the United States, the United Kingdom, and Germany were validated and normalized to international format.
- Public pages include Gujarati, Hindi, and English language selection; the selected language persists in browser storage. Bundled sample CMS content has translations, while new CMS-authored copy needs localized entries.
- `git diff --check` passed during the audit.
- `robots.txt` excludes `/admin`; authorization still depends on application/API access controls.
- `.env` and the local Firebase service-account JSON are ignored by Git and are not tracked in the inspected index. Keep them out of source bundles and backups intended for public download; rotate credentials if they were ever exposed or committed elsewhere.

## Not included in this repository audit

- A live production crawl, index coverage, ranking, backlinks, and Search Console/Analytics data.
- Lighthouse/Core Web Vitals measurements on production hosting.
- Medical, legal, privacy, regulatory, or address verification by the organization.
- Full browser/device, keyboard, screen-reader, load, or end-to-end testing.

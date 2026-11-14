# Production readiness checklist

Use this as a release gate. Assign an owner and record a verification date for each item that depends on organization or hosting access.

## Domain and SEO

- [ ] Confirm the canonical production domain and whether `www` or apex is canonical.
- [ ] Set `VITE_SITE_URL` to that HTTPS origin in the production frontend build environment.
- [ ] Replace the example origin in `frontend/public/robots.txt` and every URL in `frontend/public/sitemap.xml`.
- [ ] Verify built canonical, Open Graph URL, social preview image, sitemap, and robots responses use the chosen origin.
- [ ] Publish only canonical public routes and approved doctor profiles in the sitemap.
- [ ] Confirm intended indexability; keep admin/login and private content non-indexable without treating robots as access control.
- [ ] Inspect rendered title, description, canonical, Open Graph/Twitter cards, and JSON-LD with external validators after deployment.
- [ ] Submit the sitemap to Search Console; check index coverage and fix crawl errors.

## Hospital, clinical, and contact facts

- [ ] Approve the official hospital and partner names used on the site.
- [ ] Verify the complete physical address and map destination.
- [ ] Verify patient helpline number, hours, emergency instructions, and WhatsApp destination.
- [ ] Verify every published specialty, service, doctor credential, biography, language, and availability claim.
- [ ] Obtain image permissions and clinician approval for portraits and medical imagery.
- [ ] Have qualified clinical reviewers approve health articles, FAQs, and emergency copy.

## Runtime configuration

- [ ] Configure production frontend Firebase web app values and allowed authentication domains.
- [ ] Configure backend Firebase Admin credentials only in the backend secret store.
- [ ] Set `VITE_USE_MOCK_DATA=false`, `USE_MOCK_DATA=false`, `NODE_ENV=production`, and `ALLOW_MOCK_IN_PRODUCTION=false`.
- [ ] Set exact `FRONTEND_URL` and `ALLOWED_ORIGINS`; do not use wildcard origins.
- [ ] Configure Resend and verify sender/domain authentication, recipient routing, and notification failure visibility.
- [ ] Set `BACKEND_PUBLIC_URL`, API base URL, HTTPS, rate limits, and production health monitoring.
- [ ] Verify Firebase rules/indexes and create a real authorized admin account.
- [ ] Ensure the local ignored service-account JSON and `.env` files are not included in build artifacts or public archives; rotate any credential with a history of exposure.
- [ ] Provide durable disk and backups for `backend/uploads/media/`; test restore behavior.

## Privacy, security, and accessibility

- [ ] Publish reviewed privacy, terms, and accessibility information and link them in the footer.
- [ ] Review analytics, cookies, external embeds, data retention, and consent obligations for intended jurisdictions.
- [ ] Verify access control for admin routes and protected API endpoints with real non-admin and admin accounts.
- [ ] Test appointment, contact, and newsletter validation, throttling, and error states.
- [ ] Complete keyboard-only navigation, visible focus, screen-reader labels/error announcements, color contrast, and zoom/reflow checks.
- [ ] Ensure emergency content directs life-threatening cases to the applicable local emergency service.

## Quality and monitoring

- [ ] Run frontend production build and backend startup/health checks from their respective package directories.
- [ ] Run functional tests for every public route, appointment submission, contact submission, sign-in, role checks, CMS changes, and media upload.
- [ ] Test production browser console/network, Firebase auth, email delivery, CORS, and uploads.
- [ ] Measure Core Web Vitals on production pages and address mobile performance/image sizing.
- [ ] Add automated smoke, unit/integration, accessibility, and dependency checks to CI.
- [ ] Monitor health endpoint, API errors, auth failures, email delivery, media disk capacity, and backup success.

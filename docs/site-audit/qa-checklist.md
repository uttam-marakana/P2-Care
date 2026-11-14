# Release QA checklist

Record browser/device, build or commit, tester, date, and result when running this checklist. A checked item means it was actually tested in the target environment.

## Responsive layout

- [ ] Check phone widths around 320, 375, and 430 CSS pixels.
- [ ] Check tablet widths around 640, 768, and 1024 CSS pixels.
- [ ] Check desktop widths at 1280 CSS pixels and above.
- [ ] Confirm no horizontal overflow, clipped controls, overlapping sticky/floating UI, or inaccessible menus.
- [ ] Confirm footer dropdowns work on mobile and footer link lists remain visible on desktop.

## Public navigation and content

- [ ] Follow header and footer links to every public route; confirm route title, H1, page content, and scroll position.
- [ ] Test browser back/forward navigation and unknown routes.
- [ ] Check all external links, map links, call links, WhatsApp links, and approved social/legal links.
- [ ] Check image loading, fallback behavior, descriptive alt text, and image crop on mobile.
- [ ] Confirm no placeholder copy, demo data, unapproved location wording, or draft content appears publicly.

## Forms

- [ ] Appointment: verify required name, country, phone, specialty, and date fields.
- [ ] Appointment: verify country selector shows country names in the menu and only the calling-code prefix when closed.
- [ ] Appointment: verify the placeholder and maximum national digits change by selected country; changing country clears the old number.
- [ ] Appointment: verify invalid and valid mobile numbers, international-format API value, optional email/time, and submit failure/success states.
- [ ] Contact: test name/reply/message validation and network errors.
- [ ] Newsletter: test valid/invalid email, duplicate/server failures, and success state.
- [ ] Confirm form errors are visible, associated with fields, and announced to assistive technology.

## Admin and backend

- [ ] Verify login, logout, session expiry, unauthorized route redirects, and non-admin access denial.
- [ ] Test appointment list/search/filter/status/note workflows and authorized deletion.
- [ ] Test doctor/service/article/FAQ create, edit, publish/draft, search, and delete workflows.
- [ ] Test media upload validation, loading, serving, deletion, and persistence after backend restart.
- [ ] Verify `/health`, CORS, rate limits, API errors, request IDs, and operational audit records.
- [ ] Confirm email notifications and Firebase persistence in the configured production-like environment.

## SEO and accessibility

- [ ] Inspect title, description, canonical, robots, social preview, and structured data on each public route.
- [ ] Check `robots.txt` and XML sitemap over HTTPS; confirm no example host and no private URLs.
- [ ] Test keyboard access, focus visibility, labels, accessible names, error announcements, contrast, and 200% zoom.
- [ ] Review accessibility with at least one screen reader and automated accessibility tooling.
- [ ] Inspect production network and console errors; test in current Chrome, Firefox, and Safari (including mobile Safari).

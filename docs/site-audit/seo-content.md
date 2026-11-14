# SEO wording and content guidance

## Current route metadata

Route titles and descriptions are configured in `frontend/src/routes/AppRoutes.jsx`. Titles receive the ` | P2Care Hospital` suffix from `frontend/src/components/seo/SEO.jsx`.

| Route | Current title | Current description |
|---|---|---|
| `/` | Patient-first hospital care | Patient-first hospital care, specialist services, appointment booking and support from the P2Care Hospital care team. |
| `/services` | Hospital services and specialties | Explore cardiology, orthopedics, neurology, pediatrics, women's health and general medicine services. |
| `/doctors` | Find a doctor | Meet P2Care Hospital doctors, review their specialties and experience, and find a care professional for your needs. |
| `/doctors/:id` | Doctor name and specialty | Profile-specific description assembled from the name, specialty, experience, and approved bio. |
| `/appointment` | Book an appointment | Request a hospital appointment online. A P2Care care coordinator will contact you to confirm your visit. |
| `/hospital` | Plan your hospital visit | Plan your visit to P2Care Hospital, including location, patient support, accessibility and what to bring. |
| `/emergency` | Emergency care and patient guidance | Find P2Care Hospital emergency care information and 24/7 patient guidance. For life-threatening emergencies, contact local emergency services. |
| `/articles` | Health articles and patient guidance | Read practical health articles, patient guidance and stories from the P2Care Hospital care team. |
| `/contact` | Contact P2Care Hospital | Find hospital directions, call the patient helpline or send a message to the P2Care Hospital care team. |
| `/faq` | Hospital patient FAQs | Get answers about appointments, preparing for a hospital visit, patient support and emergency care. |

These are concise, descriptive starting points, not a ranking guarantee. Keep each page focused on its real content; avoid adding an unverified geographic target or claims the organization has not approved.

## Metadata implementation

- `frontend/index.html` contains a static fallback title, description, canonical template, Open Graph metadata, Twitter card metadata, and the default social image.
- `frontend/src/components/seo/SEO.jsx` sets the route title, description, canonical, Open Graph URL/image, and Twitter image at runtime.
- The default social preview is `frontend/public/images/site-share-card.svg` (1200 × 630). Verify the absolute image URL after configuring the production host and preview it in major social debuggers.
- The root, hospital, and contact routes add `HospitalSchema`; profile routes now emit a profile-specific title and description.
- Keep the canonical URL host, `robots.txt` sitemap URL, sitemap `<loc>` values, social image host, and production `VITE_SITE_URL` identical.

## Content quality rules

1. Use one descriptive H1 per public page and make it match the page purpose.
2. Keep title tags unique and specific; avoid repeating the brand name in the route title because the SEO helper appends it.
3. Write plain-language descriptions that summarize the visible page. Do not promise appointment availability, outcomes, or clinical services that have not been verified.
4. Have a qualified clinician review medical articles, FAQs, specialties, and doctor credentials. Display review/update dates and author/reviewer information where the organization can substantiate them.
5. Confirm doctor names, specialty, qualifications, experience, languages, availability, biographies, and portrait permissions before publishing.
6. Confirm the hospital's official name, phone, address, map link, service area, and emergency instructions. Use the same approved facts in page copy, metadata, structured data, and directories.
7. Give informative images descriptive alt text; use empty alt text only for decorative images.
8. Use internal links with descriptive labels. Replace placeholder social links and plain-text legal labels with approved destinations.
9. Keep drafts and admin-only content out of the sitemap and public structured data.
10. After launch, submit the sitemap in Search Console and inspect representative pages for canonical, indexability, rendered metadata, and structured-data errors.

## Sitemap and crawl directives

`frontend/public/robots.txt` and `frontend/public/sitemap.xml` already exist, but currently contain an example host. Replace it with the approved host before deploying. Add published doctor profile URLs when generating the sitemap; exclude `/admin`, login, drafts, and other non-indexable routes. Do not block assets required to render public pages.

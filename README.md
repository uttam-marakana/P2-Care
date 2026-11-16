# P2Care Hospital

P2Care is a React/Vite hospital website with an Express API, a protected admin console, Firebase-backed production services, and a mock mode for local UI development.

## Project layout

```text
frontend/  React public website, patient portal, admin UI, and static SEO files
backend/   Express API, Firebase Admin integration, local public-media storage
firebase/  Firestore and Firebase Storage rules, Firestore indexes
README.md  Project setup, operations, architecture, and release checklist
```

There is no root npm workspace. Run package commands from `frontend/` or `backend/`.

## Features

- Public hospital pages, appointment requests, doctor profiles, articles, FAQs, and contact/newsletter forms.
- Gujarati, Hindi, and English public UI language selection. Bundled sample content is translated; new CMS-authored copy needs matching translation entries.
- Doctor-profile appointment requests preselect the doctor and specialty.
- Patient account sign-up/sign-in uses Firebase Authentication and requires a verified email.
- Patient accounts show linked appointments, private reports, appointment status updates, and hospital news.
- Patients can claim earlier guest appointments only when their verified email matches the appointment email.
- Admin routes include dashboard, appointments, CMS, media, communications, patient records, and hospital updates.
- Admins can upload patient reports (PDF, JPG, or PNG, up to 5 MB). Files are stored in a private Firebase Storage bucket and served through authenticated API routes. Direct browser Storage and Firestore access is denied.
- Published hospital updates appear in patient notification inboxes. Update emails are sent only to opted-in patient accounts and newsletter subscribers; newsletter messages include an unsubscribe link.
- WhatsApp uses browser click-to-chat links. There is no WhatsApp Cloud API integration.
- `@vercel/analytics` and `@vercel/speed-insights` are installed in the frontend.

## Local development

Use Node.js 22 or a version supported by the installed Vite toolchain. Install each app independently:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev -- --host 0.0.0.0
```

The public website is at `http://localhost:5173`, the admin login is at `http://localhost:5173/admin/login`, and backend health is at `http://localhost:4000/health`.

Run the production frontend build from `frontend/`:

```bash
npm run build
```

Run the backend in production mode from `backend/`:

```bash
npm start
```

There are no dedicated frontend or backend `test` or `lint` scripts in the package manifests. The production build checks frontend compilation, not full functional, accessibility, or Firebase integration behavior.

### Optional mock mode

Firebase-backed mode is the default. Set the following flags to `true` only when intentionally testing against local mock data:

```env
# frontend/.env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:4000
```

```env
# backend/.env
USE_MOCK_DATA=true
PORT=4000
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

The local demo admin credentials are:

```text
Email:    admin@p2care.local
Password: P2Care@123
```

Mock data is for development only. Patient account, real Firebase profile, and private report operations require Firebase mode. Do not configure production mock mode.

## Architecture and access control

```text
Browser
  ├── React public site / patient portal / admin UI
  └── Firebase Authentication ID token
          |
          v
      Express API
        ├── authentication, roles, permissions, and validation
        ├── Firebase Admin SDK → Firestore and Firebase Authentication
        ├── Firebase Admin SDK → private patient reports in Storage
        ├── local durable filesystem → public CMS media
        └── Resend → optional email notifications
```

- The browser does not perform direct Firestore or Storage reads/writes. Firestore and Storage rules deny direct client access.
- The API verifies bearer tokens and enforces roles/permissions. Frontend route guards are for user experience and are not the security boundary.
- Patient endpoints verify the patient role and verified-email status. Patient appointment and report queries are scoped to the authenticated user.
- Admin report access is permission checked and report ownership is matched against the selected patient.
- The backend uses standardized JSON responses:

```json
{ "ok": true, "data": {} }
```

Errors use `{ "ok": false, "error": { "code": "...", "message": "..." } }`.

## Firebase setup

Create/configure a Firebase project and enable:

- Authentication with Email/Password
- Firestore
- Firebase Storage
- A Firebase Web App

Copy `frontend/.env.example` to `frontend/.env` and `backend/.env.example` to `backend/.env`. Configure these production settings:

```env
# Frontend build-time configuration
VITE_USE_MOCK_DATA=false
VITE_SITE_URL=https://your-real-domain.com
VITE_API_BASE_URL=https://your-api-domain.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_WHATSAPP_NUMBER=...
```

```env
# Backend runtime configuration; keep all secrets server-side
USE_MOCK_DATA=false
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-real-domain.com
ALLOWED_ORIGINS=https://your-real-domain.com
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Never put Firebase Admin credentials or Resend credentials in frontend variables or source control. The Firebase web-app values are client-side configuration, not Admin credentials.

Create or update an initial Firebase admin account by setting `FIREBASE_ADMIN_EMAIL`, `FIREBASE_ADMIN_PASSWORD`, and optionally `FIREBASE_ADMIN_NAME` in `backend/.env`, then run:

```bash
cd backend
npm run firebase:seed
```

Deploy Firestore and Storage access rules (and Firestore indexes) using Firebase CLI:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

The project files are `firebase/firestore.rules`, `firebase/firestore.indexes.json`, and `firebase/storage.rules`. Confirm the configured Storage bucket name in Firebase before setting `FIREBASE_STORAGE_BUCKET`.

The currently shared production rules use a different direct-client data model (`users`, `patientId`, `blogs`, and `contacts`). P2Care's backend instead uses `profiles/{uid}`, `patient_uid`, `articles`, `services`, and `contact_inquiries`, and performs data operations through the Admin SDK. Admin SDK requests bypass Firestore rules, so API authorization is enforced in Express. Keep repository rules deny-all for direct client access; do not merge the shared owner/admin rules into this backend-only model without intentionally adding direct client Firestore access and its complete ownership/security design. Deploying repository rules requires an explicit Firebase CLI/console action and was not performed as part of this repository change.

The existing Firebase Console index for `appointments(patientId ASC, createdAt DESC, __name__ DESC)` does not match P2Care's appointment schema or sort order. It is retained in the repository config so deploying the updated indexes does not discard an existing console index that may be used elsewhere. The API filters appointments by `patient_uid` and sorts them by `appointment_date` descending; the matching API index is also configured as `patient_uid ASC, appointment_date DESC`. Matching patient-owned indexes are configured for `patient_reports` and `patient_notifications`, whose API queries sort by `created_at` descending. Indexes are performance/query configuration, not security rules, and Admin SDK access is not restricted by them.

### Media and report storage

- Public website media is stored at `backend/uploads/media/`, with metadata in `backend/uploads/media/media.json`. Production backend hosting must provide persistent storage and backups for this directory; ephemeral serverless filesystems are not sufficient.
- Patient reports use a private Firebase Storage bucket and are downloaded through authenticated, ownership-checked API routes.

### Email and notifications

Appointment and hospital-update emails use Resend when `RESEND_API_KEY` and a verified `NOTIFICATION_FROM_EMAIL` are configured. Set `HOSPITAL_NOTIFICATION_EMAIL` for hospital appointment alerts. Without a working provider, email delivery is skipped or recorded as unavailable; verify the Communications panel and delivery logs after deployment.

## Deployment

The Vercel project serves the Vite frontend as a single-page application. The repository's `vercel.json` rewrite supports client-side routes; it does not deploy the Express backend.

1. Configure the Vercel project root/build settings for `frontend/` (install/build with npm and output `dist`).
2. Set the frontend production variables above in Vercel and redeploy; `VITE_*` values are embedded at build time.
3. Deploy the Express backend separately to a persistent Node.js hosting service. Configure the backend environment there and set `VITE_API_BASE_URL` to its public HTTPS URL in Vercel.
4. Set exact `FRONTEND_URL` and `ALLOWED_ORIGINS` values to the real website origin(s); do not use a wildcard CORS origin.
5. Set `BACKEND_PUBLIC_URL` to the backend's public HTTPS URL for generated public media URLs.
6. Configure Firebase Authentication authorized domains and deploy Firebase rules/indexes.
7. Configure Resend and verify its sender domain if email notifications are required.
8. Test the public domain, backend `/health`, sign-in, appointment creation/status, patient report access, CORS, email delivery, and all required storage persistence.

Never use `localhost` as the deployed API base URL or backend CORS origin. Keep `ALLOW_MOCK_IN_PRODUCTION=false`; the backend blocks mock mode in production by default.

## SEO, content, and audit notes

- Route metadata is defined in `frontend/src/routes/AppRoutes.jsx` and applied by `frontend/src/components/seo/SEO.jsx`. The SEO component updates metadata in the browser; validate rendered metadata with search crawlers and social preview tools after deployment.
- The static files `frontend/public/robots.txt` and `frontend/public/sitemap.xml` must use the approved production domain. The sitemap is manually maintained and should be updated to include approved, published doctor profile routes. Keep admin, login, and private pages out of the sitemap; robots directives are not access control.
- Hospital structured data contains organization-specific facts. Verify hospital name, address, phone, region, specialties, and map links with the organization before release; keep them consistent across site copy and metadata.
- Replace placeholder social links and provide approved privacy/accessibility destinations. Publish reviewed privacy, terms, and accessibility information before production.
- Have qualified clinicians approve medical articles, FAQs, emergency wording, doctor credentials, and service claims. Obtain image permissions.
- After launch, submit the sitemap to Search Console and inspect canonical URLs, indexing, structured data, Core Web Vitals, and social previews.

## Release checklist

Before a production release:

- [ ] Set the real canonical domain in Vercel `VITE_SITE_URL`, robots, sitemap, and all canonical/social URLs; remove example domains.
- [ ] Set `VITE_API_BASE_URL` to the separate HTTPS backend and verify the backend is deployed and monitored.
- [ ] Set frontend and backend mock mode to `false`; use `NODE_ENV=production` and keep `ALLOW_MOCK_IN_PRODUCTION=false`.
- [ ] Configure production Firebase web-app and server-only Admin credentials, Storage bucket, and Firebase Authentication authorized domains.
- [ ] Deploy Firestore/Storage rules and indexes. Confirm browser-direct access is denied.
- [ ] Configure exact backend CORS origins, Resend sender/recipient details, and persistent backend media storage with backups.
- [ ] Verify a real admin account, patient sign-up/email verification, appointment claiming, appointment status notifications, and patient data isolation.
- [ ] Verify authorized admin report upload and patient-only report download using test files; ensure reports do not become public URLs.
- [ ] Test each public route, appointment/contact/newsletter validation, language switching, and mobile/tablet/desktop layouts.
- [ ] Complete keyboard, screen-reader, focus, contrast, zoom/reflow, and external-link checks.
- [ ] Verify approved hospital contact/address/clinical facts, privacy/legal pages, analytics/consent requirements, and social links.
- [ ] Inspect browser console/network errors, API health/errors, Firebase authentication, email delivery, and production logs.

## Known review items

These are not confirmed defects in every deployment; they require access to the actual production configuration and organization-approved details:

- The sample environment files contain example domains and local API URLs. Replace them in production.
- Vercel serves only the frontend; a separately deployed backend and correct API URL are required for live API features.
- A production bundle build has reported a non-blocking main JavaScript chunk-size warning above 500 kB. Consider code splitting and verify mobile performance.
- Verify the live Vercel domain is publicly accessible; a deployment can be successful while Deployment Protection requires sign-in.
- No complete production crawl, live Firebase patient flow, real email delivery, accessibility audit, or full device/browser matrix is implied by a local build or mock-mode test.

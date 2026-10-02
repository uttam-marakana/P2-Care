# P2Care Hospital — Complete Frontend + Backend

A full-stack P2Care Hospital website with a React/Vite frontend, Express backend, Firebase production integration, and a development mock-data mode that works before Firebase is configured.

## Project structure

```text
P2Care-Hospital/
├── frontend/              # React + Vite public website and admin panel
├── backend/               # Express API for appointments and protected updates
├── firebase/               # Firestore rules and indexes
├── docs/                   # Architecture and deployment documentation
├── package.json            # Workspace scripts
└── .gitignore
```

## Two operating modes

### 1. Development / mock mode — no Firebase required

Frontend `.env`:

```env
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:4000
VITE_WHATSAPP_NUMBER=9118001234567
```

Backend `.env`:

```env
USE_MOCK_DATA=true
PORT=4000
FRONTEND_URL=http://localhost:5173
```

The admin panel uses local mock data and browser `localStorage`. Public appointment submission also works locally. The backend can run in mock mode and exposes `/health` plus mock appointment API behavior.

Demo admin credentials:

```text
Email:    admin@p2care.local
Password: P2Care@123
```

### 2. Production / Firebase mode

Frontend:

```env
VITE_USE_MOCK_DATA=false
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-firebase-web-app-id
VITE_API_BASE_URL=https://your-api-domain.example.com
VITE_WHATSAPP_NUMBER=9118001234567
```

Backend:

```env
USE_MOCK_DATA=false
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=4000
FRONTEND_URL=https://your-frontend-domain.example.com
ALLOWED_ORIGINS=https://your-frontend-domain.example.com
```

The browser authenticates with Firebase Authentication. The Express backend verifies the Firebase ID token and performs Firestore reads/writes through the Firebase Admin SDK. The browser does not access Firestore directly.

## Run locally

From the project root:

```bash
npm install
```

Create `frontend/.env` from `frontend/.env.example` and `backend/.env` from `backend/.env.example`.

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

Open:

```text
http://localhost:5173
```

Admin:

```text
http://localhost:5173/admin/login
```

Backend health:

```text
http://localhost:4000/health
```

## WhatsApp

The project uses browser click-to-chat only. There is no WhatsApp Cloud API integration. Appointment/contact actions open WhatsApp using the configured `VITE_WHATSAPP_NUMBER` and predefined messages.

## Important production notes

- Never expose Firebase Admin credentials to the frontend.
- Frontend Firebase Web App configuration is client-side configuration; Admin credentials are server-only.
- Replace all placeholder hospital contact values before production launch.
- Deploy `firebase/firestore.rules` and `firebase/firestore.indexes.json`.
- Run `npm --workspace backend run firebase:seed` after configuring Firebase.


### Icon library
The frontend uses `react-icons` (Font Awesome 6 icons via `react-icons/fa6`) for all UI and brand icons.

## Batch 1 — Admin Operations

The current release includes the complete first admin batch:

- Dashboard analytics and appointment activity overview
- Upcoming and recent appointment summaries
- Appointment search, status, department and date filters
- Appointment detail view, internal notes, status workflow and deletion
- Doctors CRUD with profile fields, slug, languages and publication status
- Services CRUD with slug, description, icon and publication status
- Articles CRUD with slug, category, excerpt, content, publish date and read time
- FAQ CRUD with question, answer, category and publication status
- Mock mode persistence through browser localStorage
- Firebase CRUD preserved for production mode
- Staff-only appointment deletion policy added to the Firebase schema

Mock mode remains enabled by default for local development. Set `VITE_USE_MOCK_DATA=false` on the frontend and `USE_MOCK_DATA=false` on the backend when switching to configured Firebase infrastructure.


## Current roadmap status

- Batch 1 — Admin dashboard and core CMS/appointment UI: complete.
- Batch 2 — Backend/API architecture, authentication, authorization, validation and standardized API contracts: complete.
- Batch 3 — Storage & Media Management: complete.
- Batch 4 — Notifications & Communication: complete.
- Batch 5 — Security & Production Hardening: complete.
- Batch 6 — Firebase integration: complete at the application-code level.
- Supabase data migration: intentionally not included; the source Supabase project contains no application data.
- Firebase live configuration and authenticated browser QA require the target Firebase project credentials.

## Batch 3 — Media Management

The admin console includes a Media Library and reusable image upload controls for Doctors, Services and Articles. Media is stored locally under `backend/uploads/media` in both mock and Firebase modes. Firebase Storage is intentionally not used.

## Current development batches

- Batch 1 — Admin & CMS features
- Batch 2 — Backend/API architecture
- Batch 3 — Storage & Media Management
- Batch 4 — Notifications & Communication




## Batch 5 — Security & Production Hardening

The backend now includes Helmet security headers, exact CORS origin allowlisting, request IDs, API/public-write/authentication rate limits, strict JSON parsing, production mock-mode protection, non-leaking production error responses, image magic-byte validation, and an operational audit trail. The admin Security page exposes runtime protection status and recent audit events.

Security environment variables include `NODE_ENV`, `ALLOWED_ORIGINS`, `API_RATE_LIMIT`, `PUBLIC_WRITE_RATE_LIMIT`, `AUTH_RATE_LIMIT`, and `ALLOW_MOCK_IN_PRODUCTION`. Mock mode is intentionally blocked when `NODE_ENV=production` unless explicitly overridden.


## Data provider

P2Care uses Firebase Authentication + Firestore through the Express backend. Firebase Storage is intentionally not used; media is stored locally under `backend/uploads/media/`. Mock mode remains available for development.

For Firebase setup, seeding, and final verification, follow `docs/firebase-setup.md`.

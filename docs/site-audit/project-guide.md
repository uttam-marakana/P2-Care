# Project overview and local operation

## Application

P2Care is a React 19/Vite public hospital-information and appointment-request site with an admin CMS. The Express 5 backend exposes the API, uses Firebase Authentication and Firestore when configured, and supports a local mock-data mode.

```text
frontend/  React, Vite, public pages, admin UI, SEO metadata, static assets
backend/   Express API, Firebase Admin integration, media and notifications
firebase/ Firestore rules, indexes, and Firebase project configuration
docs/     Architecture, setup, deployment, batch notes, and this audit package
```

The repository does not contain a root `package.json` or npm workspace scripts. Install and run each app from its own directory.

## Local setup

Use Node.js 22 or another version supported by the installed Vite toolchain.

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

The public site is served at `http://localhost:5173`; the backend health endpoint is `http://localhost:4000/health`. Keep both local `.env` files untracked.

For local mock mode, use `VITE_USE_MOCK_DATA=true` in the frontend and `USE_MOCK_DATA=true` in the backend. The frontend and backend must both be configured consistently. Do not use mock mode in production.

The mock admin account is for local development only:

```text
admin@p2care.local
P2Care@123
```

## Useful commands

```bash
# frontend/
npm run dev
npm run build
npm run preview

# backend/
npm run dev
npm start
npm run firebase:seed
```

There are no dedicated `test` or `lint` scripts in the frontend or backend package manifests. The production build is a useful compilation check, not a substitute for functional, accessibility, or integration testing.

## System boundaries

- The browser uses Firebase Authentication for configured production sign-in.
- Protected API requests send a Firebase ID token to Express; the backend performs Firestore operations with Firebase Admin.
- Media uploads are stored under `backend/uploads/media/`, not Firebase Storage. Production hosting must provide durable storage and backups for this directory.
- Appointment, contact, and newsletter requests use backend API routes.
- WhatsApp uses browser click-to-chat links; there is no WhatsApp Cloud API integration.
- Admin routes require authorization. Excluding `/admin` in `robots.txt` is crawl guidance, not access control.

For deeper existing technical detail, see [architecture](../architecture.md), [Firebase setup](../firebase-setup.md), and [deployment](../deployment.md).

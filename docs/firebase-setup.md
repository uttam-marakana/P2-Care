# P2Care — Firebase Setup & Final Verification

P2Care now uses Firebase Authentication + Firestore through the Express backend. **Firebase Storage is intentionally not used.** Uploaded media remains on the backend filesystem under `backend/uploads/media/`.

## Architecture

```text
React frontend
    |
    | Firebase Authentication ID token
    v
Express API
    |
    +--> Firebase Admin SDK --> Firebase Authentication
    |
    +--> Firebase Admin SDK --> Firestore
    |
    +--> Local filesystem --> backend/uploads/media
    |
    +--> Resend --> email notifications
```

The browser does not access Firestore directly. Firestore rules therefore deny direct browser reads/writes; the Admin SDK accesses Firestore server-side.

## 1. Firebase project

Create/configure a Firebase project and enable:

- Authentication → Email/Password
- Firestore Database
- A Firebase Web App

Create a server service account and keep its private key server-side.

## 2. Environment files

Copy:

- `frontend/.env.example` → `frontend/.env`
- `backend/.env.example` → `backend/.env`

Set `VITE_USE_MOCK_DATA=false` and `USE_MOCK_DATA=false` when using Firebase.

Never put Firebase Admin credentials in the frontend.

## 3. Seed Firebase

Set `FIREBASE_ADMIN_EMAIL`, `FIREBASE_ADMIN_PASSWORD`, and optionally `FIREBASE_ADMIN_NAME` in `backend/.env`, then run:

```bash
npm install
npm --workspace backend run firebase:seed
```

The seed command creates initial content if it does not already exist and creates/updates the admin Firebase Auth user plus its `profiles/{uid}` document.

## 4. Firestore security

Deploy:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

The repository rules deny browser access. Application data access is performed by Firebase Admin SDK on the Express server.

## 5. Local media

Media uploads are stored at:

```text
backend/uploads/media/
backend/uploads/media/media.json
```

The directory must be persistent on the production host. Do not use an ephemeral serverless filesystem for production media.

## 6. Mock mode

Mock mode remains available for local development:

```text
frontend: VITE_USE_MOCK_DATA=true
backend:  USE_MOCK_DATA=true
```

Demo credentials:

```text
Email: admin@p2care.local
Password: P2Care@123
```

## 7. Final verification

Run the following after Firebase credentials are configured:

```bash
npm --workspace frontend run build
node --check backend/src/server.js
```

Then verify:

1. `GET /health` returns Firebase mode.
2. Admin can sign in with Firebase Authentication.
3. `GET /api/auth/me` returns the Firebase profile and permissions.
4. Public content loads from Firestore.
5. Admin content create/update/delete works.
6. Appointments create/update/delete works according to permissions.
7. Media upload/list/delete works using the local filesystem.
8. Audit logs are written to Firestore.
9. Notification logging works; Resend is optional.
10. Browser direct Firestore access is denied.

## Data migration

No Supabase data migration is required or included. The previous Supabase project contains no application data, so this project starts with a clean Firebase dataset.

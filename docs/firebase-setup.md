# P2Care — Firebase Setup & Final Verification

P2Care uses Firebase Authentication, Firestore, and private Firebase Storage through the Express backend. Public website media remains on the backend filesystem under `backend/uploads/media/`; patient reports are stored in a private Firebase Storage bucket.

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
    +--> Local filesystem --> backend/uploads/media (public site media)
    |
    +--> Firebase Storage --> private patient reports
    |
    +--> Resend --> email notifications
```

The browser does not access Firestore directly. Firestore rules therefore deny direct browser reads/writes; the Admin SDK accesses Firestore server-side.

## 1. Firebase project

Create/configure a Firebase project and enable:

- Authentication → Email/Password
- Firestore Database
- Firebase Storage bucket
- A Firebase Web App

Create a server service account and keep its private key server-side.

## 2. Environment files

Copy:

- `frontend/.env.example` → `frontend/.env`
- `backend/.env.example` → `backend/.env`

Set `VITE_USE_MOCK_DATA=false` and `USE_MOCK_DATA=false` when using Firebase.
Set `FIREBASE_STORAGE_BUCKET` in `backend/.env` to the project's bucket name (for example, `your-project.firebasestorage.app`).

Never put Firebase Admin credentials in the frontend.

## 3. Seed Firebase

Set `FIREBASE_ADMIN_EMAIL`, `FIREBASE_ADMIN_PASSWORD`, and optionally `FIREBASE_ADMIN_NAME` in `backend/.env`, then run:

```bash
cd backend
npm install
npm run firebase:seed
```

The seed command creates initial content if it does not already exist and creates/updates the admin Firebase Auth user plus its `profiles/{uid}` document.

## 4. Firestore security

Deploy:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

The repository rules deny browser access. Application data access is performed by Firebase Admin SDK on the Express server.

Deploy Storage rules as well:

```bash
firebase deploy --only storage
```

The rules deny direct browser access. Patient reports are downloaded through authenticated API endpoints that check patient ownership.

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
cd frontend
npm run build
cd ../backend
node --check src/server.js
```

Then verify:

1. `GET /health` returns Firebase mode.
2. Admin can sign in with Firebase Authentication.
3. `GET /api/auth/me` returns the Firebase profile and permissions.
4. Public content loads from Firestore.
5. Admin content create/update/delete works.
6. Appointments create/update/delete works according to permissions.
7. Media upload/list/delete works using the local filesystem.
8. Patient signup requires verified email, and appointment claims match only the verified account email.
9. Admin uploads private PDF/JPG/PNG reports; only that patient and authorized admins can download them.
10. Appointment status updates appear in the associated patient's inbox; hospital updates appear in every patient inbox.
11. Hospital-update emails go only to opted-in patient accounts and newsletter subscribers. Emails include an unsubscribe link, and account holders can also change the email preference in their profile. Configure Resend for delivery.
12. Audit logs are written to Firestore.
13. Browser direct Firestore and Storage access is denied.

## Data migration

No Supabase data migration is required or included. The previous Supabase project contains no application data, so this project starts with a clean Firebase dataset.

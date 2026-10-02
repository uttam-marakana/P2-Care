# Local Development

## Install

From the repository root:

```bash
npm install
```

## Run mock mode

Backend:

```bash
npm run dev:backend
```

Frontend, in another terminal:

```bash
npm run dev:frontend
```

Open `http://localhost:5173/admin/login`.

Demo credentials:

```text
admin@p2care.local
P2Care@123
```

The backend should report mock mode at:

```text
http://localhost:4000/
http://localhost:4000/health
```

## Test protected API manually

```bash
curl -H "Authorization: Bearer mock-development-token" http://localhost:4000/api/auth/me
curl -H "Authorization: Bearer mock-development-token" http://localhost:4000/api/appointments
curl -H "Authorization: Bearer mock-development-token" 'http://localhost:4000/api/content/doctors?includeDrafts=true'
```

## Switch to Firebase

Frontend `frontend/.env`:

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Backend `backend/.env`:

```env
USE_MOCK_DATA=false
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FRONTEND_URL=http://localhost:5173
```

Seed initial Firebase content/admin:

```bash
npm --workspace backend run firebase:seed
```

## Security development settings

```env
NODE_ENV=development
USE_MOCK_DATA=true
ALLOWED_ORIGINS=http://localhost:5173
API_RATE_LIMIT=120
PUBLIC_WRITE_RATE_LIMIT=20
AUTH_RATE_LIMIT=10
ALLOW_MOCK_IN_PRODUCTION=false
```

The backend returns an `X-Request-ID` header for every request. The admin Security page reads the runtime protection configuration and audit trail.

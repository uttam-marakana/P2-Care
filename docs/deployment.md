# Deployment Guide

## 1. Frontend

From `frontend/`:

```bash
npm install
npm run build
```

Configure:

```env
VITE_SITE_URL=https://your-real-domain.com
VITE_API_BASE_URL=https://api.your-real-domain.com
VITE_USE_MOCK_DATA=false
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_WHATSAPP_NUMBER=9118001234567
```

## 2. Backend

From `backend/`:

```bash
npm install
npm start
```

Configure:

```env
USE_MOCK_DATA=false
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-real-domain.com
ALLOWED_ORIGINS=https://your-real-domain.com
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RESEND_API_KEY=re_...
NOTIFICATION_FROM_EMAIL=P2Care Hospital <appointments@your-domain.com>
HOSPITAL_NOTIFICATION_EMAIL=appointments@your-domain.com
BACKEND_PUBLIC_URL=https://api.your-real-domain.com
```

Firebase Admin credentials and Resend credentials must remain server-side.

## 3. Firebase

Deploy Firestore rules and indexes from the `firebase/` directory using Firebase CLI, or apply the repository files through the Firebase Console.

The browser is intentionally denied direct Firestore access. The Express API uses Firebase Admin SDK.

## 4. Media persistence

The application intentionally does not use Firebase Storage. Persist:

```text
backend/uploads/media/
```

on a durable disk/volume. Backups should include `media.json` and the media files.

## 5. Notifications

Appointment events can send transactional email through Resend. WhatsApp remains browser click-to-chat only.

## 6. SEO

Replace the example domain in `frontend/public/robots.txt` and `frontend/public/sitemap.xml`, then submit the sitemap to Google Search Console after deployment.

## 7. Security

- Never commit `.env` files.
- Never expose Firebase Admin credentials in the frontend.
- Keep the admin area protected by Firebase Auth and profile-based authorization.
- Keep appointment/contact/newsletter writes rate-limited.
- Use HTTPS for frontend and backend in production.
- Keep `ALLOW_MOCK_IN_PRODUCTION=false`.

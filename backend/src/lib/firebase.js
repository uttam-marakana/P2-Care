import admin from "firebase-admin";
import { config } from "./config.js";

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK once.
 *
 * Firebase credentials are read from backend/.env.
 * Never expose these credentials through frontend environment variables.
 */
function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (config.useMockData) {
    return null;
  }

  const projectId = config.firebaseProjectId;
  const clientEmail = config.firebaseClientEmail;
  const privateKey = config.firebasePrivateKey;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are missing. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in backend/.env.",
    );
  }

  const normalizedPrivateKey = privateKey.replace(/\\n/g, "\n");

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: normalizedPrivateKey,
    }),
  });

  return firebaseApp;
}

/**
 * Get the Firebase Admin application.
 */
export function getFirebaseApp() {
  return initializeFirebase();
}

/**
 * Get Firebase Admin Auth.
 */
export function getFirebaseAuth() {
  const app = initializeFirebase();

  if (!app) {
    return null;
  }

  return admin.auth(app);
}

/**
 * Get Firestore.
 */
export function getFirebaseFirestore() {
  const app = initializeFirebase();

  if (!app) {
    return null;
  }

  return admin.firestore(app);
}

/**
 * Get Firebase Admin SDK.
 *
 * This is useful when a service needs access to multiple
 * Firebase Admin modules.
 */
export function getFirebaseAdmin() {
  initializeFirebase();

  return admin;
}

/**
 * Check whether Firebase is available.
 */
export function isFirebaseConfigured() {
  return Boolean(
    config.firebaseProjectId &&
    config.firebaseClientEmail &&
    config.firebasePrivateKey,
  );
}

export default admin;

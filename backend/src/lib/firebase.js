import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from './config.js';

const firebaseReady = Boolean(
  config.firebaseProjectId &&
  config.firebaseClientEmail &&
  config.firebasePrivateKey,
);

let firebaseApp = null;

if (firebaseReady) {
  firebaseApp = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: config.firebaseProjectId,
          clientEmail: config.firebaseClientEmail,
          privateKey: config.firebasePrivateKey.replace(/\\n/g, '\n'),
        }),
      });
}

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export { firebaseReady };

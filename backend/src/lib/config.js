import 'dotenv/config';

// Mock mode remains available for local development. Firebase is the production data/auth provider.
const useMockData = String(process.env.USE_MOCK_DATA ?? 'true').toLowerCase() === 'true';
const nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv === 'production' && useMockData && String(process.env.ALLOW_MOCK_IN_PRODUCTION).toLowerCase() !== 'true') {
  throw new Error('Mock mode is disabled in production. Set USE_MOCK_DATA=false before deployment.');
}

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map((value) => value.trim()).filter(Boolean);

if (!useMockData && !process.env.FIREBASE_PROJECT_ID) throw new Error('Missing required environment variable: FIREBASE_PROJECT_ID');
if (!useMockData && !process.env.FIREBASE_CLIENT_EMAIL) throw new Error('Missing required environment variable: FIREBASE_CLIENT_EMAIL');
if (!useMockData && !process.env.FIREBASE_PRIVATE_KEY) throw new Error('Missing required environment variable: FIREBASE_PRIVATE_KEY');

export const config = {
  nodeEnv,
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowedOrigins,
  apiRateLimit: Number(process.env.API_RATE_LIMIT || 120),
  publicWriteRateLimit: Number(process.env.PUBLIC_WRITE_RATE_LIMIT || 20),
  authRateLimit: Number(process.env.AUTH_RATE_LIMIT || 10),
  useMockData,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  notificationFromEmail: process.env.NOTIFICATION_FROM_EMAIL,
  backendPublicUrl: process.env.BACKEND_PUBLIC_URL || `http://localhost:${Number(process.env.PORT || 4000)}`,
  hospitalNotificationEmail: process.env.HOSPITAL_NOTIFICATION_EMAIL,
};

if (!config.useMockData && !config.resendApiKey) console.warn('RESEND_API_KEY is not configured. Email notifications will be skipped.');

import express from 'express';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './lib/config.js';
import { fail } from './lib/http.js';
import appointmentsRouter from './routes/appointments.js';
import contentRouter from './routes/content.js';
import authRouter from './routes/auth.js';
import mediaRouter from './routes/media.js';
import notificationsRouter from './routes/notifications.js';
import contactRouter from './routes/contact.js';
import securityRouter from './routes/security.js';
import { recordAudit } from './services/audit.js';
import { apiRateLimit, corsOrigin, requestId } from './middleware/security.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(requestId);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.use(cors({ origin: corsOrigin, methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'], exposedHeaders: ['X-Request-ID'] }));
app.use(express.json({ limit: '7mb', strict: true }));
app.use('/api', apiRateLimit);

app.get('/', (_req, res) => res.json({ ok: true, service: 'p2care-backend', version: '2.0.0', mode: config.useMockData ? 'mock' : 'firebase', health: '/health' }));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'p2care-backend', version: '2.0.0', mode: config.useMockData ? 'mock' : 'firebase' }));
// Operational audit trail runs before route handlers so authenticated user context is available at response completion.
app.use('/api', (req, res, next) => {
  res.on('finish', () => {
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) return;
    recordAudit({ req, action: `${req.method} ${req.path}`, statusCode: res.statusCode }).catch((error) => console.error('Audit error:', error.message));
  });
  next();
});
app.use('/api/appointments', appointmentsRouter);
app.use('/api/content', contentRouter);
app.use('/api/auth', authRouter);
app.use('/api/media', mediaRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/security', securityRouter);
app.use('/uploads', (req, res, next) => {
  if (req.path.endsWith('/media.json')) return fail(res, 404, 'NOT_FOUND', 'Resource not found.');
  return next();
});
app.use('/uploads', express.static(fileURLToPath(new URL('../uploads', import.meta.url)), {
  fallthrough: true,
  index: false,
  dotfiles: 'deny',
  maxAge: config.nodeEnv === 'production' ? '1d' : 0,
}));

app.use((req, res) => fail(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} was not found.`));
app.use((err, req, res, _next) => {
  console.error(`[${req.requestId || 'no-request-id'}]`, err);
  if (err?.message === 'CORS origin not allowed.') return fail(res, 403, 'CORS_DENIED', 'Request origin is not allowed.');
  return fail(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal server error.');
});

app.listen(config.port, () => console.log(`P2Care backend listening on http://localhost:${config.port} (${config.useMockData ? 'mock' : 'firebase'} mode)`));

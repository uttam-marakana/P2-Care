import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { config } from '../lib/config.js';

export function requestId(req, res, next) {
  const incoming = String(req.get('x-request-id') || '').trim();
  const id = /^[A-Za-z0-9._:-]{8,100}$/.test(incoming) ? incoming : crypto.randomUUID();
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
}

export function corsOrigin(origin, callback) {
  if (!origin || config.allowedOrigins.includes('*') || config.allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('CORS origin not allowed.'));
}

const common = { standardHeaders: 'draft-8', legacyHeaders: false };
export const apiRateLimit = rateLimit({ ...common, windowMs: 15 * 60 * 1000, limit: config.apiRateLimit });
export const publicWriteRateLimit = rateLimit({ ...common, windowMs: 10 * 60 * 1000, limit: config.publicWriteRateLimit, message: { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } } });
export const authRateLimit = rateLimit({ ...common, windowMs: 10 * 60 * 1000, limit: config.authRateLimit, message: { ok: false, error: { code: 'RATE_LIMITED', message: 'Too many authentication requests. Please try again later.' } } });

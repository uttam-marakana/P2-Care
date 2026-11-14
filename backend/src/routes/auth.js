import { Router } from 'express';
import { requireAuth, requireIdentity } from '../middleware/auth.js';
import { asyncHandler, fail, ok } from '../lib/http.js';
import { authRateLimit } from '../middleware/security.js';
import { z } from 'zod';
import { createDocument, getDocument, updateDocument } from '../lib/firestore.js';
import { config } from '../lib/config.js';

const router = Router();
router.use(authRateLimit);
router.get('/me', requireAuth, (req, res) => ok(res, {
  user: { id: req.user.id, email: req.user.email },
  profile: req.profile,
  permissions: req.permissions,
}));

const patientProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  newsletterOptIn: z.boolean().optional(),
});

router.post('/patient-profile', requireIdentity, asyncHandler(async (req, res) => {
  const parsed = patientProfileSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid patient profile details.', parsed.error.flatten());
  if (!req.decodedToken.email_verified) {
    return fail(res, 403, 'EMAIL_VERIFICATION_REQUIRED', 'Verify your email address before creating a patient profile.');
  }
  if (config.useMockData) return fail(res, 503, 'PATIENT_ACCOUNTS_UNAVAILABLE', 'Patient accounts require Firebase Authentication and Firestore.');

  const uid = req.user.uid;
  const existing = await getDocument('profiles', uid);
  if (existing && existing.role !== 'patient') {
    return fail(res, 409, 'ACCOUNT_ROLE_CONFLICT', 'This account is configured for staff access.');
  }
  const profile = {
    id: uid,
    full_name: parsed.data.fullName,
    name: parsed.data.fullName,
    email: String(req.decodedToken.email || '').trim().toLowerCase(),
    role: 'patient',
    newsletter_opt_in: existing?.newsletter_opt_in ?? parsed.data.newsletterOptIn ?? false,
    updated_at: new Date().toISOString(),
  };
  const saved = existing
    ? await updateDocument('profiles', uid, profile)
    : await createDocument('profiles', { ...profile, created_at: new Date().toISOString() }, uid);
  return ok(res, { profile: saved });
}));

export default router;

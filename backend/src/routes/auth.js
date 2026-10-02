import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ok } from '../lib/http.js';
import { authRateLimit } from '../middleware/security.js';

const router = Router();
router.use(authRateLimit);
router.get('/me', requireAuth, (req, res) => ok(res, {
  user: { id: req.user.id, email: req.user.email },
  profile: req.profile,
  permissions: req.permissions,
}));

export default router;

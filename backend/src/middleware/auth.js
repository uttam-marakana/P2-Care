import { firebaseAuth } from '../lib/firebase.js';
import { config } from '../lib/config.js';
import { getProfileById } from '../lib/firestore.js';
import { fail } from '../lib/http.js';

const permissions = {
  admin: [
    'dashboard:read',
    'appointments:read', 'appointments:write', 'appointments:delete',
    'content:read', 'content:write', 'content:delete',
    'media:read', 'media:write', 'media:delete',
    'notifications:read', 'notifications:send',
    'security:read', 'audit:read',
  ],
  staff: [
    'dashboard:read',
    'appointments:read', 'appointments:write',
    'content:read', 'content:write',
    'media:read', 'media:write',
    'notifications:read',
    'security:read', 'audit:read',
  ],
};

export async function requireAuth(req, res, next) {
  if (config.useMockData) {
    const authorization = req.headers.authorization || '';
    if (authorization !== 'Bearer mock-development-token') {
      return fail(res, 401, 'AUTH_REQUIRED', 'Authentication required.');
    }
    req.user = { id: 'mock-admin-001', email: 'admin@p2care.local' };
    req.profile = { id: 'mock-admin-001', role: 'admin', full_name: 'P2Care Admin' };
    req.permissions = permissions.admin;
    return next();
  }

  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) return fail(res, 401, 'AUTH_REQUIRED', 'Authentication required.');
  if (!firebaseAuth) return fail(res, 503, 'AUTH_UNAVAILABLE', 'Firebase authentication is not configured.');

  try {
    const user = await firebaseAuth.verifyIdToken(token);
    const profile = await getProfileById(user.uid);
    const role = profile?.role || user.role || user.adminRole;
    if (!profile || !permissions[role]) {
      return fail(res, 403, 'STAFF_ACCESS_REQUIRED', 'Staff access required.');
    }

    req.user = { id: user.uid, email: user.email || profile.email || null, ...user };
    req.profile = { ...profile, id: user.uid, role };
    req.permissions = permissions[role];
    return next();
  } catch (error) {
    console.error('Firebase token verification failed:', error?.message || error);
    return fail(res, 401, 'INVALID_SESSION', 'Invalid or expired session.');
  }
}

export function requireStaff(req, res, next) {
  return requireAuth(req, res, next);
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.profile || !roles.includes(req.profile.role)) {
      return fail(res, 403, 'ROLE_REQUIRED', 'You do not have permission to perform this action.');
    }
    return next();
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.permissions?.includes(permission)) {
      return fail(res, 403, 'PERMISSION_REQUIRED', `Missing permission: ${permission}.`);
    }
    return next();
  };
}

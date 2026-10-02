import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { config } from "../lib/config.js";
import { fail } from "../lib/http.js";
import { getFirebaseAuth, getFirebaseFirestore } from "../lib/firebase.js";

const firebaseAuth = getFirebaseAuth();
const firestore = getFirebaseFirestore();

/**
 * Development/mock administrator.
 *
 * Mock mode is intentionally isolated from Firebase.
 * It should never be enabled in production unless explicitly allowed
 * by the existing production guard in config/security middleware.
 */
const MOCK_USER = {
  id: "mock-admin",
  uid: "mock-admin",
  email: "admin@p2care.local",
  role: "admin",
  permissions: [
    "content:read",
    "content:write",

    "appointments:read",
    "appointments:write",
    "appointments:delete",

    "media:read",
    "media:write",
    "media:delete",

    "notifications:read",
    "notifications:send",

    "audit:read",

    "security:read",
  ],
};

/**
 * Permissions available to an administrator.
 *
 * Keep this list centralized so a Firebase admin account receives
 * the same permissions everywhere in the application.
 */
const ADMIN_PERMISSIONS = [
  "content:read",
  "content:write",

  "appointments:read",
  "appointments:write",
  "appointments:delete",

  "media:read",
  "media:write",
  "media:delete",

  "notifications:read",
  "notifications:send",

  "audit:read",

  "security:read",
];

/**
 * Permissions available to staff users.
 *
 * Adjust this list if your application later introduces
 * more granular staff permissions.
 */
const STAFF_PERMISSIONS = [
  "content:read",

  "appointments:read",
  "appointments:write",

  "media:read",

  "notifications:read",

  "security:read",
];

/**
 * Normalize role.
 */
function normalizeRole(role) {
  if (typeof role !== "string") {
    return "staff";
  }

  const normalized = role.trim().toLowerCase();

  if (normalized === "admin") {
    return "admin";
  }

  return "staff";
}

/**
 * Normalize permissions coming from Firestore/custom claims.
 */
function normalizePermissions(permissions) {
  if (!Array.isArray(permissions)) {
    return [];
  }

  return [
    ...new Set(
      permissions
        .filter((permission) => typeof permission === "string")
        .map((permission) => permission.trim())
        .filter(Boolean),
    ),
  ];
}

/**
 * Get the default permission set for a role.
 */
function permissionsForRole(role) {
  if (role === "admin") {
    return [...ADMIN_PERMISSIONS];
  }

  return [...STAFF_PERMISSIONS];
}

/**
 * Merge explicitly stored permissions with role permissions.
 *
 * This allows the Firestore profile to contain additional permissions
 * in the future while still ensuring that an admin gets the complete
 * administrator permission set.
 */
function buildPermissions(role, explicitPermissions = []) {
  const rolePermissions = permissionsForRole(role);
  const normalizedExplicit = normalizePermissions(explicitPermissions);

  return [...new Set([...rolePermissions, ...normalizedExplicit])];
}

/**
 * Load the user's Firestore profile.
 *
 * Expected document:
 *
 * profiles/{uid}
 *
 * Example:
 *
 * {
 *   email: "admin@example.com",
 *   name: "P2Care Admin",
 *   role: "admin",
 *   permissions: [
 *     "content:read",
 *     "content:write"
 *   ]
 * }
 */
async function getUserProfile(uid) {
  const snapshot = await firestore.collection("profiles").doc(uid).get();

  if (!snapshot.exists) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/**
 * Verify Firebase ID token and construct the application user.
 */
async function authenticateFirebaseUser(req) {
  const firebaseAuth = getFirebaseAuth();
  const firestore = getFirebaseFirestore();

  if (!authorization) {
    return {
      ok: false,
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Authentication is required.",
    };
  }

  if (!authorization.startsWith("Bearer ")) {
    return {
      ok: false,
      status: 401,
      code: "INVALID_AUTH_HEADER",
      message: "Invalid authorization header.",
    };
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return {
      ok: false,
      status: 401,
      code: "INVALID_AUTH_TOKEN",
      message: "Authentication token is missing.",
    };
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    const uid = decodedToken.uid;

    const profile = await getUserProfile(uid);

    /**
     * The application requires a profile for staff/admin access.
     */
    if (!profile) {
      return {
        ok: false,
        status: 403,
        code: "PROFILE_REQUIRED",
        message: "No staff profile is configured for this account.",
      };
    }

    const role = normalizeRole(profile.role ?? decodedToken.role);

    const permissions = buildPermissions(
      role,
      profile.permissions ?? decodedToken.permissions,
    );

    return {
      ok: true,
      user: {
        id: uid,
        uid,
        email: decodedToken.email ?? profile.email ?? null,
        name: profile.name ?? profile.displayName ?? null,
        role,
      },
      profile,
      permissions,
    };
  } catch (error) {
    console.error("Firebase authentication failed:", error);

    return {
      ok: false,
      status: 401,
      code: "INVALID_TOKEN",
      message: "Authentication token is invalid or expired.",
    };
  }
}

/**
 * Require an authenticated user.
 */
export async function requireAuth(req, res, next) {
  try {
    /**
     * Mock mode:
     * Use the existing development mock token.
     */
    if (config.useMockData) {
      const authorization = req.headers.authorization;

      if (authorization === "Bearer mock-development-token") {
        req.user = {
          ...MOCK_USER,
        };

        req.profile = {
          id: MOCK_USER.id,
          uid: MOCK_USER.uid,
          email: MOCK_USER.email,
          name: "P2Care Admin",
          role: "admin",
          permissions: [...MOCK_USER.permissions],
        };

        req.permissions = [...MOCK_USER.permissions];

        return next();
      }

      return fail(res, 401, "AUTH_REQUIRED", "Authentication is required.");
    }

    const result = await authenticateFirebaseUser(req);

    if (!result.ok) {
      return fail(res, result.status, result.code, result.message);
    }

    req.user = result.user;
    req.profile = result.profile;
    req.permissions = result.permissions;

    return next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    return fail(
      res,
      500,
      "AUTH_MIDDLEWARE_ERROR",
      "Unable to authenticate the request.",
    );
  }
}

/**
 * Require a specific permission.
 *
 * Example:
 *
 * requirePermission("content:read")
 */
export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      /**
       * Make sure authentication has happened first.
       */
      if (!req.user) {
        return fail(res, 401, "AUTH_REQUIRED", "Authentication is required.");
      }

      const permissions = normalizePermissions(req.permissions);

      if (!permissions.includes(permission)) {
        return fail(
          res,
          403,
          "PERMISSION_REQUIRED",
          `Missing permission: ${permission}.`,
        );
      }

      return next();
    } catch (error) {
      console.error(`Permission middleware failed for ${permission}:`, error);

      return fail(
        res,
        500,
        "PERMISSION_CHECK_FAILED",
        "Unable to verify permissions.",
      );
    }
  };
}

/**
 * Optional helper for checking multiple permissions.
 *
 * Any matching permission is sufficient.
 */
export function requireAnyPermission(...requiredPermissions) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return fail(res, 401, "AUTH_REQUIRED", "Authentication is required.");
      }

      const permissions = normalizePermissions(req.permissions);

      const hasPermission = requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );

      if (!hasPermission) {
        return fail(
          res,
          403,
          "PERMISSION_REQUIRED",
          "You do not have permission to perform this action.",
        );
      }

      return next();
    } catch (error) {
      console.error("Multiple permission middleware failed:", error);

      return fail(
        res,
        500,
        "PERMISSION_CHECK_FAILED",
        "Unable to verify permissions.",
      );
    }
  };
}

/**
 * Optional helper for requiring all permissions.
 */
export function requireAllPermissions(...requiredPermissions) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return fail(res, 401, "AUTH_REQUIRED", "Authentication is required.");
      }

      const permissions = normalizePermissions(req.permissions);

      const missing = requiredPermissions.filter(
        (permission) => !permissions.includes(permission),
      );

      if (missing.length > 0) {
        return fail(
          res,
          403,
          "PERMISSION_REQUIRED",
          `Missing permission: ${missing.join(", ")}.`,
        );
      }

      return next();
    } catch (error) {
      console.error("All permissions middleware failed:", error);

      return fail(
        res,
        500,
        "PERMISSION_CHECK_FAILED",
        "Unable to verify permissions.",
      );
    }
  };
}

/**
 * Export the permission definitions so seed scripts or other
 * backend modules can use the same source of truth.
 */
export {
  ADMIN_PERMISSIONS,
  STAFF_PERMISSIONS,
  normalizePermissions,
  permissionsForRole,
};

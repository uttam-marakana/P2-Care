import { Router } from "express";
import { asyncHandler, fail, ok } from "../lib/http.js";
import { requirePermission } from "../middleware/auth.js";
import { getAuditLogs } from "../services/audit.js";
import { config } from "../lib/config.js";

const router = Router();
router.get(
  "/audit",
  requirePermission("audit:read"),
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    try {
      return ok(res, { logs: await getAuditLogs(limit) });
    } catch (_) {
      return fail(res, 500, "AUDIT_LIST_FAILED", "Unable to load audit logs.");
    }
  }),
);
router.get("/status", requirePermission("security:read"), (_req, res) =>
  ok(res, {
    mode: config.useMockData ? "mock" : "firebase",
    nodeEnv: config.nodeEnv,
    security: {
      helmet: true,
      corsAllowlist: config.allowedOrigins,
      apiRateLimit: config.apiRateLimit,
      publicWriteRateLimit: config.publicWriteRateLimit,
      authRateLimit: config.authRateLimit,
      mockProductionGuard: true,
    },
  }),
);
export default router;

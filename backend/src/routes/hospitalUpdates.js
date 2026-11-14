import { Router } from "express";
import { z } from "zod";
import { config } from "../lib/config.js";
import { collectionRef, createDocument, getDocument, updateDocument } from "../lib/firestore.js";
import { asyncHandler, created, fail, ok } from "../lib/http.js";
import { requirePermission } from "../middleware/auth.js";
import {
  createMockHospitalUpdate,
  listMockHospitalUpdates,
  updateMockHospitalUpdate,
} from "../lib/mockStore.js";
import { publishHospitalUpdate } from "../services/notifications.js";

const router = Router();
const updateSchema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(5).max(3000),
});

router.get("/", requirePermission("notifications:read"), asyncHandler(async (_req, res) => {
  if (config.useMockData) return ok(res, { updates: listMockHospitalUpdates() });
  const snapshot = await collectionRef("hospital_updates").get();
  const updates = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  return ok(res, { updates });
}));

router.post("/", requirePermission("notifications:send"), asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "VALIDATION_ERROR", "Invalid hospital update.", parsed.error.flatten());
  const update = {
    ...parsed.data,
    status: "draft",
    created_by: req.user.uid,
  };
  if (config.useMockData) return created(res, { update: createMockHospitalUpdate(update) });
  return created(res, { update: await createDocument("hospital_updates", update) });
}));

router.post("/:id/publish", requirePermission("notifications:send"), asyncHandler(async (req, res) => {
  const update = config.useMockData
    ? listMockHospitalUpdates().find((item) => item.id === req.params.id)
    : await getDocument("hospital_updates", req.params.id);
  if (!update) return fail(res, 404, "UPDATE_NOT_FOUND", "Hospital update not found.");
  if (update.status !== "draft") return fail(res, 409, "UPDATE_ALREADY_PUBLISHED", "This hospital update has already been published.");

  const publishedAt = new Date().toISOString();
  const publishing = {
    status: "published",
    published_at: publishedAt,
    published_by: req.user.uid,
  };
  const saved = config.useMockData
    ? updateMockHospitalUpdate(update.id, publishing)
    : await updateDocument("hospital_updates", update.id, publishing);
  if (config.useMockData) {
    return ok(res, { update: saved, delivery: { inAppRecipients: 0, emailRecipients: 0, delivery: "simulated" } });
  }

  try {
    const delivery = await publishHospitalUpdate({ ...update, ...saved });
    const finalUpdate = await updateDocument("hospital_updates", update.id, { delivery });
    return ok(res, { update: finalUpdate, delivery });
  } catch (error) {
    await updateDocument("hospital_updates", update.id, { delivery: { delivery: "failed" } });
    console.error("Hospital update publishing failed:", error);
    return fail(res, 502, "UPDATE_DELIVERY_FAILED", "The update was published, but delivery could not be completed.");
  }
}));

export default router;

import { Router } from "express";
import { z } from "zod";
import { config } from "../lib/config.js";
import { collectionRef, createDocument, getDocument, updateDocument } from "../lib/firestore.js";
import { asyncHandler, created, fail, ok } from "../lib/http.js";
import { requirePermission } from "../middleware/auth.js";
import { getFirebaseFirestore } from "../lib/firebase.js";
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
  const publishedAt = new Date().toISOString();
  const publishing = {
    status: "publishing",
    published_at: publishedAt,
    published_by: req.user.uid,
  };
  let update;
  if (config.useMockData) {
    update = listMockHospitalUpdates().find((item) => item.id === req.params.id);
    if (!update) return fail(res, 404, "UPDATE_NOT_FOUND", "Hospital update not found.");
    if (update.status !== "draft") return fail(res, 409, "UPDATE_ALREADY_PUBLISHED", "This hospital update has already been published.");
    update = updateMockHospitalUpdate(update.id, publishing);
  } else {
    const ref = collectionRef("hospital_updates").doc(req.params.id);
    update = await getFirebaseFirestore().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists) return null;
      const current = { id: snapshot.id, ...snapshot.data() };
      if (current.status !== "draft") return false;
      transaction.update(ref, publishing);
      return { ...current, ...publishing };
    });
    if (update === null) return fail(res, 404, "UPDATE_NOT_FOUND", "Hospital update not found.");
    if (update === false) return fail(res, 409, "UPDATE_ALREADY_PUBLISHED", "This hospital update has already been published.");
  }
  if (config.useMockData) {
    const delivery = await publishHospitalUpdate(update);
    const saved = updateMockHospitalUpdate(update.id, { status: "published", delivery });
    return ok(res, { update: saved, delivery });
  }

  try {
    const delivery = await publishHospitalUpdate(update);
    const finalUpdate = await updateDocument("hospital_updates", update.id, { status: "published", delivery });
    return ok(res, { update: finalUpdate, delivery });
  } catch (error) {
    await updateDocument("hospital_updates", update.id, { status: "delivery_failed", delivery: { delivery: "failed" } });
    console.error("Hospital update publishing failed:", error);
    return fail(res, 502, "UPDATE_DELIVERY_FAILED", "The update was published, but delivery could not be completed.");
  }
}));

export default router;

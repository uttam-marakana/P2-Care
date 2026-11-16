import { Router } from "express";
import { z } from "zod";
import { config } from "../lib/config.js";
import { asyncHandler, fail, ok } from "../lib/http.js";
import { collectionRef, getDocument, updateDocument } from "../lib/firestore.js";
import { getFirebaseFirestore } from "../lib/firebase.js";
import { requirePatient } from "../middleware/auth.js";
import {
  downloadPatientReport,
  getPatientReport,
  listPatientReports,
} from "../services/patientRecords.js";

const router = Router();

router.use(requirePatient);

router.get("/profile", (req, res) => ok(res, { profile: req.profile }));

router.patch("/profile", asyncHandler(async (req, res) => {
  const parsed = z.object({
    fullName: z.string().trim().min(2).max(120).optional(),
    newsletterOptIn: z.boolean().optional(),
  }).safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "VALIDATION_ERROR", "Invalid patient profile details.", parsed.error.flatten());
  if (!Object.keys(parsed.data).length) return fail(res, 400, "EMPTY_UPDATE", "No profile changes were supplied.");
  const changes = {
    ...(parsed.data.fullName ? { full_name: parsed.data.fullName, name: parsed.data.fullName } : {}),
    ...(parsed.data.newsletterOptIn !== undefined ? { newsletter_opt_in: parsed.data.newsletterOptIn } : {}),
  };
  if (config.useMockData) return fail(res, 503, "PATIENT_ACCOUNTS_UNAVAILABLE", "Patient profiles require Firebase.");
  const profile = await updateDocument("profiles", req.user.uid, changes);
  return ok(res, { profile });
}));

router.get("/appointments", asyncHandler(async (req, res) => {
  if (config.useMockData) return ok(res, { appointments: [] });
  const snapshot = await collectionRef("appointments")
    .where("patient_uid", "==", req.user.uid)
    .orderBy("appointment_date", "desc")
    .get();
  const appointments = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => `${b.appointment_date} ${b.appointment_time || ""}`.localeCompare(`${a.appointment_date} ${a.appointment_time || ""}`));
  return ok(res, { appointments });
}));

router.post("/appointments/claim", asyncHandler(async (req, res) => {
  if (config.useMockData) return fail(res, 503, "PATIENT_ACCOUNTS_UNAVAILABLE", "Appointment claiming requires Firebase.");
  const email = String(req.user.email || "").trim().toLowerCase();
  if (!email) return fail(res, 400, "EMAIL_REQUIRED", "A verified email address is required to claim appointments.");
  const firestore = getFirebaseFirestore();
  const snapshot = await collectionRef("appointments").get();
  const matching = snapshot.docs.filter((doc) => {
    const appointment = doc.data();
    return String(appointment.email || "").trim().toLowerCase() === email && !appointment.patient_uid;
  });
  let claimed = 0;
  for (const candidate of matching) {
    const wasClaimed = await firestore.runTransaction(async (transaction) => {
      const current = await transaction.get(candidate.ref);
      if (!current.exists) return false;
      const appointment = current.data();
      if (appointment.patient_uid || String(appointment.email || "").trim().toLowerCase() !== email) return false;
      transaction.update(candidate.ref, { patient_uid: req.user.uid, updated_at: new Date().toISOString() });
      return true;
    });
    if (wasClaimed) claimed += 1;
  }
  return ok(res, { claimed });
}));

router.get("/notifications", asyncHandler(async (req, res) => {
  if (config.useMockData) return ok(res, { notifications: [] });
  const snapshot = await collectionRef("patient_notifications")
    .where("patient_uid", "==", req.user.uid)
    .orderBy("created_at", "desc")
    .get();
  const notifications = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .slice(0, 100);
  return ok(res, { notifications });
}));

router.patch("/notifications/:id/read", asyncHandler(async (req, res) => {
  if (config.useMockData) return fail(res, 503, "PATIENT_ACCOUNTS_UNAVAILABLE", "Patient notifications require Firebase.");
  const notification = await getDocument("patient_notifications", req.params.id);
  if (!notification || notification.patient_uid !== req.user.uid) {
    return fail(res, 404, "NOTIFICATION_NOT_FOUND", "Notification not found.");
  }
  const updated = await updateDocument("patient_notifications", notification.id, {
    read_at: notification.read_at || new Date().toISOString(),
  });
  return ok(res, { notification: updated });
}));

router.get("/reports", asyncHandler(async (req, res) => {
  if (config.useMockData) return ok(res, { reports: [] });
  const reports = await listPatientReports(req.user.uid);
  return ok(res, { reports: reports.map(({ storage_path, ...report }) => report) });
}));

router.get("/reports/:id/download", asyncHandler(async (req, res) => {
  if (config.useMockData) return fail(res, 503, "PATIENT_ACCOUNTS_UNAVAILABLE", "Patient reports require Firebase Storage.");
  const report = await getPatientReport(req.params.id);
  if (!report || report.patient_uid !== req.user.uid) {
    return fail(res, 404, "REPORT_NOT_FOUND", "Report not found.");
  }
  const buffer = await downloadPatientReport(report);
  res.set({
    "Content-Type": report.mime_type,
    "Content-Length": buffer.length,
    "Content-Disposition": `attachment; filename="${report.file_name.replace(/["\\\r\n]/g, "_")}"`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  return res.send(buffer);
}));

export default router;

import { Router } from "express";
import { z } from "zod";
import { config } from "../lib/config.js";
import { collectionRef, getDocument } from "../lib/firestore.js";
import { asyncHandler, created, fail, ok } from "../lib/http.js";
import { requirePermission } from "../middleware/auth.js";
import { getFirebaseFirestore } from "../lib/firebase.js";
import {
  downloadPatientReport,
  getPatientReport,
  listPatientReports,
  MAX_REPORT_BYTES,
  validatePatientReport,
  uploadPatientReport,
} from "../services/patientRecords.js";

const router = Router();
const uploadSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
  data: z.string().min(1).max(7_000_000),
});

function decodeFile(data) {
  const match = /^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/.exec(data);
  if (!match) throw new Error("Invalid report file payload.");
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > MAX_REPORT_BYTES) throw new Error("Report must be 5 MB or smaller.");
  return { mimeType: match[1], buffer };
}

router.get("/", requirePermission("patients:read"), asyncHandler(async (_req, res) => {
  if (config.useMockData) return ok(res, { patients: [] });
  const snapshot = await collectionRef("profiles").where("role", "==", "patient").get();
  const patients = snapshot.docs
    .map((doc) => {
      const profile = doc.data();
      return {
        id: doc.id,
        full_name: profile.full_name || profile.name || "",
        email: profile.email || "",
        created_at: profile.created_at || null,
        newsletter_opt_in: Boolean(profile.newsletter_opt_in),
      };
    })
    .sort((a, b) => String(a.full_name || a.name || "").localeCompare(String(b.full_name || b.name || "")));
  return ok(res, { patients });
}));

router.get("/:uid", requirePermission("patients:read"), asyncHandler(async (req, res) => {
  if (config.useMockData) return fail(res, 404, "PATIENT_NOT_FOUND", "Patient not found.");
  const profile = await getDocument("profiles", req.params.uid);
  if (!profile || profile.role !== "patient") return fail(res, 404, "PATIENT_NOT_FOUND", "Patient not found.");
  return ok(res, { patient: {
    id: profile.id,
    full_name: profile.full_name || profile.name || "",
    email: profile.email || "",
    created_at: profile.created_at || null,
    newsletter_opt_in: Boolean(profile.newsletter_opt_in),
  } });
}));

router.get("/:uid/reports", requirePermission("patients:read"), asyncHandler(async (req, res) => {
  if (config.useMockData) return ok(res, { reports: [] });
  const profile = await getDocument("profiles", req.params.uid);
  if (!profile || profile.role !== "patient") return fail(res, 404, "PATIENT_NOT_FOUND", "Patient not found.");
  const reports = await listPatientReports(req.params.uid);
  return ok(res, { reports: reports.map(({ storage_path, ...report }) => report) });
}));

router.post("/:uid/reports", requirePermission("reports:write"), asyncHandler(async (req, res) => {
  if (config.useMockData) return fail(res, 503, "PRIVATE_REPORTS_UNAVAILABLE", "Private report storage requires Firebase Storage.");
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "VALIDATION_ERROR", "Invalid patient report.", parsed.error.flatten());
  const profile = await getDocument("profiles", req.params.uid);
  if (!profile || profile.role !== "patient") return fail(res, 404, "PATIENT_NOT_FOUND", "Patient not found.");
  let file;
  try {
    file = decodeFile(parsed.data.data);
    if (file.mimeType !== parsed.data.mimeType) return fail(res, 400, "REPORT_TYPE_MISMATCH", "The uploaded file type does not match its declared type.");
    validatePatientReport(file);
  } catch (error) {
    return fail(res, 400, "REPORT_VALIDATION_FAILED", error.message);
  }
  try {
    const report = await uploadPatientReport({
      patientUid: req.params.uid,
      uploadedBy: req.user.uid,
      fileName: parsed.data.fileName,
      ...file,
    });
    const { storage_path, ...safeReport } = report;
    return created(res, { report: safeReport });
  } catch (error) {
    console.error("Private patient report upload failed:", error);
    return fail(res, 503, "REPORT_UPLOAD_FAILED", "Unable to securely store the report. Check Firebase Storage configuration and try again.");
  }
}));

router.get("/:uid/reports/:reportId/download", requirePermission("patients:read"), asyncHandler(async (req, res) => {
  if (config.useMockData) return fail(res, 503, "PRIVATE_REPORTS_UNAVAILABLE", "Private report storage requires Firebase Storage.");
  const report = await getPatientReport(req.params.reportId);
  if (!report || report.patient_uid !== req.params.uid) return fail(res, 404, "REPORT_NOT_FOUND", "Report not found.");
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

import crypto from "node:crypto";
import path from "node:path";
import { getStorage } from "firebase-admin/storage";
import { getFirebaseApp } from "../lib/firebase.js";
import { collectionRef, createDocument, getDocument } from "../lib/firestore.js";

export const MAX_REPORT_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["application/pdf", { extension: "pdf", signature: (buffer) => buffer.subarray(0, 5).toString() === "%PDF-" }],
  ["image/jpeg", { extension: "jpg", signature: (buffer) => buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff }],
  ["image/png", { extension: "png", signature: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) }],
]);

function getPrivateBucket() {
  const app = getFirebaseApp();
  const bucketName = app.options.storageBucket;
  if (!bucketName) throw new Error("FIREBASE_STORAGE_BUCKET is not configured.");
  return getStorage(app).bucket(bucketName);
}

function safeFileName(fileName) {
  const base = path.basename(String(fileName || "report"));
  return base.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120) || "report";
}

export function validatePatientReport({ mimeType, buffer }) {
  const type = allowedTypes.get(mimeType);
  if (!type) throw new Error("Reports must be PDF, JPG or PNG files.");
  if (!Buffer.isBuffer(buffer) || buffer.length === 0 || buffer.length > MAX_REPORT_BYTES) {
    throw new Error("Reports must be between 1 byte and 5 MB.");
  }
  if (!type.signature(buffer)) throw new Error("The uploaded file does not match its declared format.");
  return type;
}

export async function listPatientReports(patientUid) {
  const snapshot = await collectionRef("patient_reports")
    .where("patient_uid", "==", patientUid)
    .get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export async function getPatientReport(reportId) {
  return getDocument("patient_reports", reportId);
}

export async function uploadPatientReport({ patientUid, uploadedBy, fileName, mimeType, buffer }) {
  const type = validatePatientReport({ mimeType, buffer });
  const id = crypto.randomUUID();
  const storagePath = `patient-reports/${patientUid}/${id}.${type.extension}`;
  const bucket = getPrivateBucket();
  const file = bucket.file(storagePath);
  const metadata = {
    contentType: mimeType,
    metadata: { patientUid, reportId: id },
  };
  await file.save(buffer, { resumable: false, metadata });
  try {
    return await createDocument(
      "patient_reports",
      {
        patient_uid: patientUid,
        file_name: safeFileName(fileName),
        mime_type: mimeType,
        size: buffer.length,
        storage_path: storagePath,
        uploaded_by: uploadedBy,
      },
      id,
    );
  } catch (error) {
    await file.delete({ ignoreNotFound: true }).catch((cleanupError) => {
      console.error("Private report cleanup failed:", cleanupError.message);
    });
    throw error;
  }
}

export async function downloadPatientReport(report) {
  const [buffer] = await getPrivateBucket().file(report.storage_path).download();
  return buffer;
}

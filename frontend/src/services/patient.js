import { apiRequest, fetchPrivateFile } from "@/services/api";

export async function getPatientAppointments() {
  return (await apiRequest("/api/patient/appointments", { auth: true })).appointments ?? [];
}

export async function claimPatientAppointments() {
  return apiRequest("/api/patient/appointments/claim", {
    method: "POST",
    body: {},
    auth: true,
  });
}

export async function getPatientNotifications() {
  return (await apiRequest("/api/patient/notifications", { auth: true })).notifications ?? [];
}

export async function markPatientNotificationRead(id) {
  return apiRequest(`/api/patient/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
    body: {},
    auth: true,
  });
}

export async function getPatientReports() {
  return (await apiRequest("/api/patient/reports", { auth: true })).reports ?? [];
}

export async function downloadPatientReport(id) {
  return fetchPrivateFile(`/api/patient/reports/${encodeURIComponent(id)}/download`);
}

export async function updatePatientPreferences(values) {
  return (await apiRequest("/api/patient/profile", {
    method: "PATCH",
    body: values,
    auth: true,
  })).profile;
}

export async function getAdminPatients() {
  return (await apiRequest("/api/patients", { auth: true })).patients ?? [];
}

export async function getAdminPatientReports(uid) {
  return (await apiRequest(`/api/patients/${encodeURIComponent(uid)}/reports`, {
    auth: true,
  })).reports ?? [];
}

export async function uploadAdminPatientReport(uid, { fileName, mimeType, data }) {
  return (await apiRequest(`/api/patients/${encodeURIComponent(uid)}/reports`, {
    method: "POST",
    body: { fileName, mimeType, data },
    auth: true,
  })).report;
}

export async function downloadAdminPatientReport(uid, reportId) {
  return fetchPrivateFile(
    `/api/patients/${encodeURIComponent(uid)}/reports/${encodeURIComponent(reportId)}/download`,
  );
}

export async function getHospitalUpdates() {
  return (await apiRequest("/api/hospital-updates", { auth: true })).updates ?? [];
}

export async function createHospitalUpdate(values) {
  return (await apiRequest("/api/hospital-updates", {
    method: "POST",
    body: values,
    auth: true,
  })).update;
}

export async function publishHospitalUpdate(id) {
  return apiRequest(`/api/hospital-updates/${encodeURIComponent(id)}/publish`, {
    method: "POST",
    body: {},
    auth: true,
  });
}

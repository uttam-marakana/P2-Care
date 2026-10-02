import { isMockMode } from "@/lib/adminMode";
import {
  mockListContent,
  mockSaveContent,
  mockRemoveContent,
  mockListAppointments,
  mockUpdateAppointment,
  mockCreateAppointment,
  mockRemoveAppointment,
} from "@/services/mockAdmin";
import { apiRequest } from "@/services/api";
const tableMap = {
  doctors: "doctors",
  services: "services",
  articles: "articles",
  faqs: "faqs",
};
function normalizeContentPayload(type, record) {
  const payload = { ...record };
  delete payload.created_at;
  delete payload.updated_at;
  if (type === "doctors" && typeof payload.languages === "string")
    payload.languages = payload.languages
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  return payload;
}
export async function listContent(type, { includeDrafts = false } = {}) {
  if (isMockMode) return mockListContent(type, { includeDrafts });
  const data = await apiRequest(
    `/api/content/${tableMap[type]}${includeDrafts ? "?includeDrafts=true" : ""}`,
    { auth: includeDrafts },
  );
  return data.items ?? [];
}
export async function saveContent(type, record) {
  if (isMockMode) return mockSaveContent(type, record);
  const payload = normalizeContentPayload(type, record);
  const data = payload.id
    ? await apiRequest(`/api/content/${tableMap[type]}/${payload.id}`, {
        method: "PATCH",
        body: payload,
        auth: true,
      })
    : await apiRequest(`/api/content/${tableMap[type]}`, {
        method: "POST",
        body: payload,
        auth: true,
      });
  return data.item;
}
export async function removeContent(type, id) {
  if (isMockMode) return mockRemoveContent(type, id);
  await apiRequest(`/api/content/${tableMap[type]}/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
export async function listAppointments() {
  if (isMockMode) return mockListAppointments();
  return (
    (await apiRequest("/api/appointments", { auth: true })).appointments ?? []
  );
}
export async function getAppointment(id) {
  if (isMockMode)
    return mockListAppointments().find((item) => item.id === id) || null;
  return (await apiRequest(`/api/appointments/${id}`, { auth: true }))
    .appointment;
}
export async function updateAppointment(id, changes) {
  if (isMockMode) return mockUpdateAppointment(id, changes);
  return (
    await apiRequest(`/api/appointments/${id}`, {
      method: "PATCH",
      body: changes,
      auth: true,
    })
  ).appointment;
}
export async function createAppointment(values) {
  if (isMockMode) return mockCreateAppointment(values);
  return (
    await apiRequest("/api/appointments", {
      method: "POST",
      body: {
        name: values.name,
        phone: values.phone,
        email: values.email || "",
        reason: values.reason,
        date: values.date,
        time: values.time || "",
        notes: values.notes || "",
        doctorId: values.doctorId || null,
      },
    })
  ).appointment;
}
export async function removeAppointment(id) {
  if (isMockMode) return mockRemoveAppointment(id);
  await apiRequest(`/api/appointments/${id}`, { method: "DELETE", auth: true });
}
export async function getProfile() {
  if (isMockMode) return mockProfile();
  const data = await apiRequest("/api/auth/me", { auth: true });
  return data.profile || null;
}
export async function submitContactInquiry(values) {
  return (
    await apiRequest("/api/contact/inquiries", { method: "POST", body: values })
  ).inquiry;
}
export async function subscribeNewsletter(email) {
  return (
    await apiRequest("/api/contact/newsletter", {
      method: "POST",
      body: { email },
    })
  ).subscription;
}
export async function getNotificationStatus() {
  return (await apiRequest("/api/notifications/status", { auth: true })).status;
}
export async function listNotificationLogs() {
  return (
    (await apiRequest("/api/notifications/logs", { auth: true })).logs ?? []
  );
}
export async function resendAppointmentStatusEmail(id) {
  return (
    await apiRequest(`/api/notifications/appointments/${id}/status-email`, {
      method: "POST",
      auth: true,
    })
  ).notification;
}

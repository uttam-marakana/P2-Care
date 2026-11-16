// Mock mode is opt-in; default to Firebase-backed behavior in every environment.
const configuredMockMode = import.meta.env.VITE_USE_MOCK_DATA;
export const isMockMode =
  String(configuredMockMode ?? "false").toLowerCase() === "true";
export const MOCK_ADMIN = {
  email: "admin@p2care.local",
  password: "P2Care@123",
  id: "mock-admin-001",
  role: "admin",
  full_name: "P2Care Admin",
};
export const MOCK_SESSION_KEY = "p2care_mock_admin_session";
export const MOCK_DATA_KEY = "p2care_mock_admin_data";

import { MOCK_ADMIN, MOCK_DATA_KEY, MOCK_SESSION_KEY } from "@/lib/adminMode";
const seed = {
  doctors: [
    {
      id: "doctor-1",
      name: "Dr. Arjun Sharma",
      specialty: "Cardiology",
      credentials: "MBBS, MD",
      experience: "12 years",
      availability: "Mon–Fri",
      bio: "Consultant cardiologist focused on preventive and clinical cardiac care.",
      status: "published",
      created_at: "2026-01-10T09:00:00.000Z",
    },
    {
      id: "doctor-2",
      name: "Dr. Meera Patel",
      specialty: "Internal Medicine",
      credentials: "MBBS, MD",
      experience: "9 years",
      availability: "Mon–Sat",
      bio: "Physician providing comprehensive adult medical care.",
      status: "published",
      created_at: "2026-01-12T09:00:00.000Z",
    },
  ],
  services: [
    {
      id: "service-1",
      name: "Emergency Care",
      detail: "Round-the-clock emergency support and triage.",
      icon: "Siren",
      status: "published",
      created_at: "2026-01-08T09:00:00.000Z",
    },
    {
      id: "service-2",
      name: "Diagnostics",
      detail: "Diagnostic services to support accurate clinical decisions.",
      icon: "Activity",
      status: "published",
      created_at: "2026-01-09T09:00:00.000Z",
    },
  ],
  articles: [
    {
      id: "article-1",
      title: "When should you schedule a health check-up?",
      category: "Wellness",
      excerpt: "A practical guide to routine preventive care.",
      content: "Regular health check-ups can help identify risks early.",
      date: "2026-02-10",
      read: "4 min",
      status: "published",
      created_at: "2026-02-10T09:00:00.000Z",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      q: "How can I request an appointment?",
      a: "Submit the appointment form and continue the conversation on WhatsApp.",
      category: "Appointments",
      status: "published",
      created_at: "2026-02-11T09:00:00.000Z",
    },
    {
      id: "faq-2",
      q: "Can I contact the hospital on WhatsApp?",
      a: "Yes. Use the WhatsApp button to start a chat with the hospital team.",
      category: "General",
      status: "published",
      created_at: "2026-02-12T09:00:00.000Z",
    },
  ],
  appointments: [
    {
      id: "appointment-1",
      patient_name: "Rahul Mehta",
      phone: "+91 98765 43210",
      email: "rahul@example.com",
      department: "Cardiology",
      appointment_date: "2026-09-29",
      appointment_time: "10:30",
      notes: "First consultation",
      admin_notes: "",
      status: "pending",
      created_at: "2026-09-27T08:30:00.000Z",
    },
    {
      id: "appointment-2",
      patient_name: "Priya Shah",
      phone: "+91 99887 66554",
      email: "priya@example.com",
      department: "Internal Medicine",
      appointment_date: "2026-09-30",
      appointment_time: "12:00",
      notes: "Follow-up visit",
      admin_notes: "Please confirm availability.",
      status: "confirmed",
      created_at: "2026-09-26T11:00:00.000Z",
    },
  ],
};
const clone = (value) => JSON.parse(JSON.stringify(value));
function readData() {
  try {
    const stored = localStorage.getItem(MOCK_DATA_KEY);
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  const initial = clone(seed);
  try {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(initial));
  } catch (_) {}
  return initial;
}
function writeData(data) {
  try {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(data));
  } catch (_) {}
  return data;
}
export function resetMockData() {
  writeData(clone(seed));
}
export function mockSignIn(email, password) {
  if (
    email.trim().toLowerCase() !== MOCK_ADMIN.email ||
    password !== MOCK_ADMIN.password
  )
    return { error: new Error("Invalid demo credentials.") };
  const session = {
    user: { id: MOCK_ADMIN.id, email: MOCK_ADMIN.email },
    access_token: "mock-development-token",
  };
  try {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } catch (_) {}
  window.dispatchEvent(new Event("p2care-mock-auth"));
  return { data: { session }, error: null };
}
export function mockGetSession() {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    return { session: raw ? JSON.parse(raw) : null };
  } catch (_) {
    return { session: null };
  }
}
export function mockSignOut() {
  try {
    localStorage.removeItem(MOCK_SESSION_KEY);
  } catch (_) {}
  window.dispatchEvent(new Event("p2care-mock-auth"));
}
export function mockProfile() {
  return { ...MOCK_ADMIN };
}
export function mockListContent(type, { includeDrafts = false } = {}) {
  const items = readData()[type] || [];
  return clone(
    includeDrafts ? items : items.filter((item) => item.status === "published"),
  );
}
export function mockSaveContent(type, record) {
  const data = readData();
  const items = data[type] || [];
  const now = new Date().toISOString();
  const saved = { ...record, updated_at: now };
  if (record.id) {
    const index = items.findIndex((item) => item.id === record.id);
    if (index === -1) throw new Error("Item not found.");
    items[index] = { ...items[index], ...saved };
  } else {
    saved.id = `${type.slice(0, -1)}-${Date.now()}`;
    saved.created_at = now;
    items.unshift(saved);
  }
  data[type] = items;
  writeData(data);
  return clone(saved);
}
export function mockRemoveContent(type, id) {
  const data = readData();
  data[type] = (data[type] || []).filter((item) => item.id !== id);
  writeData(data);
}
export function mockListAppointments() {
  return clone(readData().appointments || []);
}
export function mockCreateAppointment(values) {
  const data = readData();
  const appointment = {
    id: `appointment-${Date.now()}`,
    patient_name: values.name,
    phone: values.phone,
    email: values.email || null,
    department: values.reason,
    doctor_id: values.doctorId || null,
    appointment_date: values.date,
    appointment_time: values.time || null,
    notes: values.notes || null,
    admin_notes: "",
    status: "pending",
    created_at: new Date().toISOString(),
  };
  data.appointments = [appointment, ...(data.appointments || [])];
  writeData(data);
  return clone(appointment);
}
export function mockUpdateAppointment(id, changes) {
  const data = readData();
  const index = (data.appointments || []).findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Appointment not found.");
  data.appointments[index] = {
    ...data.appointments[index],
    ...changes,
    updated_at: new Date().toISOString(),
  };
  writeData(data);
  return clone(data.appointments[index]);
}

export function mockRemoveAppointment(id) {
  const data = readData();
  const before = (data.appointments || []).length;
  data.appointments = (data.appointments || []).filter(
    (item) => item.id !== id,
  );
  if (data.appointments.length === before)
    throw new Error("Appointment not found.");
  writeData(data);
}

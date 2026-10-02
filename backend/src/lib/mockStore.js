const seed = {
  doctors: [
    { id: 'doctor-1', name: 'Dr. Arjun Sharma', slug: 'dr-arjun-sharma', specialty: 'Cardiology', credentials: 'MBBS, MD', experience: '12 years', availability: 'Mon–Fri', languages: ['English', 'Hindi', 'Punjabi'], initials: 'AS', tone: 'from-[#d5e9e4] via-[#bddbd7] to-[#a4c3c9]', bio: 'Consultant cardiologist focused on preventive and clinical cardiac care.', status: 'published', created_at: '2026-01-10T09:00:00.000Z' },
    { id: 'doctor-2', name: 'Dr. Meera Patel', slug: 'dr-meera-patel', specialty: 'Internal Medicine', credentials: 'MBBS, MD', experience: '9 years', availability: 'Mon–Sat', languages: ['English', 'Hindi', 'Punjabi'], initials: 'MP', tone: 'from-[#d5e9e4] via-[#bddbd7] to-[#a4c3c9]', bio: 'Physician providing comprehensive adult medical care.', status: 'published', created_at: '2026-01-12T09:00:00.000Z' },
  ],
  services: [
    { id: 'service-1', name: 'Emergency Care', slug: 'emergency-care', detail: 'Round-the-clock emergency support and triage.', icon: 'Siren', status: 'published', created_at: '2026-01-08T09:00:00.000Z' },
    { id: 'service-2', name: 'Diagnostics', slug: 'diagnostics', detail: 'Diagnostic services to support accurate clinical decisions.', icon: 'Activity', status: 'published', created_at: '2026-01-09T09:00:00.000Z' },
  ],
  articles: [
    { id: 'article-1', title: 'When should you schedule a health check-up?', slug: 'when-should-you-schedule-a-health-check-up', category: 'Wellness', excerpt: 'A practical guide to routine preventive care.', content: 'Regular health check-ups can help identify risks early.', date: '2026-02-10', read: '4 min', tone: 'from-[#d5e9e4] via-[#bddbd7] to-[#a4c3c9]', status: 'published', created_at: '2026-02-10T09:00:00.000Z' },
  ],
  faqs: [
    { id: 'faq-1', q: 'How can I request an appointment?', a: 'Submit the appointment form and continue the conversation on WhatsApp.', category: 'Appointments', status: 'published', created_at: '2026-02-11T09:00:00.000Z' },
    { id: 'faq-2', q: 'Can I contact the hospital on WhatsApp?', a: 'Yes. Use the WhatsApp button to start a chat with the hospital team.', category: 'General', status: 'published', created_at: '2026-02-12T09:00:00.000Z' },
  ],
  notifications: [],
  contact_inquiries: [],
  newsletter_subscribers: [],
  audit_logs: [],
  appointments: [
    { id: 'appointment-1', patient_name: 'Rahul Mehta', phone: '+91 98765 43210', email: 'rahul@example.com', department: 'Cardiology', appointment_date: '2026-09-29', appointment_time: '10:30', notes: 'First consultation', admin_notes: '', status: 'pending', created_at: '2026-09-27T08:30:00.000Z' },
    { id: 'appointment-2', patient_name: 'Priya Shah', phone: '+91 99887 66554', email: 'priya@example.com', department: 'Internal Medicine', appointment_date: '2026-09-30', appointment_time: '12:00', notes: 'Follow-up visit', admin_notes: 'Please confirm availability.', status: 'confirmed', created_at: '2026-09-26T11:00:00.000Z' },
  ],
};

let data = structuredClone(seed);
const clone = (value) => structuredClone(value);

export function resetMockData() { data = structuredClone(seed); }
export function listMockContent(type, { includeDrafts = false } = {}) {
  const items = data[type] || [];
  return clone(includeDrafts ? items : items.filter((item) => item.status === 'published'));
}
export function saveMockContent(type, record) {
  const items = data[type] || [];
  const now = new Date().toISOString();
  if (record.id) {
    const index = items.findIndex((item) => item.id === record.id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...record, updated_at: now };
    return clone(items[index]);
  }
  const item = { ...record, id: `${type.slice(0, -1)}-${Date.now()}`, created_at: now, updated_at: now };
  items.unshift(item);
  data[type] = items;
  return clone(item);
}
export function removeMockContent(type, id) {
  const items = data[type] || [];
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  data[type] = next;
  return true;
}
export function listMockAppointments() { return clone(data.appointments); }
export function createMockAppointment(values) {
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
    admin_notes: '',
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  data.appointments.unshift(appointment);
  return clone(appointment);
}
export function updateMockAppointment(id, changes) {
  const index = data.appointments.findIndex((item) => item.id === id);
  if (index === -1) return null;
  data.appointments[index] = { ...data.appointments[index], ...changes, updated_at: new Date().toISOString() };
  return clone(data.appointments[index]);
}
export function removeMockAppointment(id) {
  const next = data.appointments.filter((item) => item.id !== id);
  if (next.length === data.appointments.length) return false;
  data.appointments = next;
  return true;
}

export function addMockNotification(notification) {
  data.notifications = [
    { id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...notification },
    ...(data.notifications || []),
  ].slice(0, 100);
  return clone(data.notifications[0]);
}

export function listMockNotifications() {
  return clone(data.notifications || []);
}

export function addMockContactInquiry(inquiry) {
  data.contact_inquiries = [{ id: `inquiry-${Date.now()}`, ...inquiry }, ...(data.contact_inquiries || [])].slice(0, 100);
  return clone(data.contact_inquiries[0]);
}

export function addMockNewsletterSubscriber(email) {
  const exists = (data.newsletter_subscribers || []).some((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!exists) data.newsletter_subscribers = [{ id: `subscriber-${Date.now()}`, email, created_at: new Date().toISOString() }, ...(data.newsletter_subscribers || [])].slice(0, 500);
  return exists ? null : clone(data.newsletter_subscribers[0]);
}

export function addMockAuditLog(entry) {
  data.audit_logs = [{ id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...entry }, ...(data.audit_logs || [])].slice(0, 500);
  return clone(data.audit_logs[0]);
}
export function listMockAuditLogs() { return clone(data.audit_logs || []); }

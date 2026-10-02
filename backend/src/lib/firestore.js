import { firestore } from './firebase.js';

export function requireFirestore() {
  if (!firestore) throw new Error('Firebase Firestore is not configured.');
  return firestore;
}

export function collectionRef(name) {
  return requireFirestore().collection(name);
}

export async function listCollection(name, { includeDrafts = false, orderBy = 'created_at', descending = true } = {}) {
  let query = collectionRef(name);
  if (!includeDrafts) query = query.where('status', '==', 'published');
  query = query.orderBy(orderBy, descending ? 'desc' : 'asc');
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getDocument(name, id) {
  const snapshot = await collectionRef(name).doc(id).get();
  return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function createDocument(name, data, id = null) {
  const now = new Date().toISOString();
  const ref = id ? collectionRef(name).doc(id) : collectionRef(name).doc();
  const item = { ...data, id: ref.id, created_at: data.created_at || now, updated_at: now };
  await ref.set(item);
  return item;
}

export async function updateDocument(name, id, changes) {
  const ref = collectionRef(name).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  const updated = { ...changes, updated_at: new Date().toISOString() };
  await ref.set(updated, { merge: true });
  const snapshot = await ref.get();
  return { id: snapshot.id, ...snapshot.data() };
}

export async function deleteDocument(name, id) {
  const ref = collectionRef(name).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return false;
  await ref.delete();
  return true;
}

export async function addDocument(name, data) {
  return createDocument(name, data);
}

export async function getProfileById(id) {
  return getDocument('profiles', id);
}

export async function getAppointmentWithDoctor(id) {
  const appointment = await getDocument('appointments', id);
  if (!appointment) return null;
  const doctor = appointment.doctor_id ? await getDocument('doctors', appointment.doctor_id) : null;
  return { ...appointment, doctors: doctor ? { id: doctor.id, name: doctor.name, specialty: doctor.specialty } : null };
}

export async function listAppointmentsWithDoctors() {
  const snapshot = await collectionRef('appointments').orderBy('appointment_date', 'asc').get();
  const appointments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const doctorIds = [...new Set(appointments.map((item) => item.doctor_id).filter(Boolean))];
  const doctors = new Map();
  await Promise.all(doctorIds.map(async (id) => {
    const doctor = await getDocument('doctors', id);
    if (doctor) doctors.set(id, doctor);
  }));
  return appointments.map((appointment) => ({
    ...appointment,
    doctors: appointment.doctor_id && doctors.has(appointment.doctor_id)
      ? { id: appointment.doctor_id, name: doctors.get(appointment.doctor_id).name, specialty: doctors.get(appointment.doctor_id).specialty }
      : null,
  })).sort((a, b) => `${a.appointment_date} ${a.appointment_time || ''}`.localeCompare(`${b.appointment_date} ${b.appointment_time || ''}`));
}

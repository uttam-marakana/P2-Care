import { randomUUID } from 'node:crypto';
import { Resend } from 'resend';
import { config } from '../lib/config.js';
import { addMockNotification, listMockNotifications, listMockNewsletterSubscribers } from '../lib/mockStore.js';
import { addDocument, collectionRef } from '../lib/firestore.js';
import { getFirebaseFirestore } from '../lib/firebase.js';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;
function appointmentSummary(a) { return [`Patient: ${a.patient_name}`, `Phone: ${a.phone}`, `Email: ${a.email || 'Not provided'}`, `Department: ${a.department || 'General care'}`, `Date: ${a.appointment_date}`, `Time: ${a.appointment_time || 'Not specified'}`, `Patient note: ${a.notes || 'None'}`].join('\n'); }
function baseResult(type, recipient, status, message) { return { type, recipient, status, message, created_at: new Date().toISOString() }; }
async function sendEmail({ to, subject, text, type, appointmentId }) {
  if (!to) return baseResult(type, null, 'skipped', 'No recipient email was provided.');
  if (config.useMockData) return baseResult(type, to, 'skipped', 'Email delivery is simulated in mock mode.');
  if (!resend || !config.notificationFromEmail) return baseResult(type, to, 'skipped', 'Email provider is not configured.');
  try {
    const result = await resend.emails.send({ from: config.notificationFromEmail, to: [to], subject, text });
    return { ...baseResult(type, to, 'sent', 'Email sent successfully.'), provider_id: result?.data?.id, appointment_id: appointmentId };
  } catch (error) { return { ...baseResult(type, to, 'failed', error?.message || 'Email delivery failed.'), appointment_id: appointmentId }; }
}
async function recordResults(results) {
  if (config.useMockData) results.forEach((item) => addMockNotification(item));
  else await Promise.all(results.map((item) => addDocument('notification_logs', item).catch((error) => console.error('Notification log write failed:', error.message))));
  return results;
}
export async function notifyNewAppointment(appointment) {
  const results = [];
  if (config.hospitalNotificationEmail) results.push(await sendEmail({ to: config.hospitalNotificationEmail, type: 'appointment_created_hospital', appointmentId: appointment.id, subject: `New appointment request — ${appointment.patient_name}`, text: `A new P2Care appointment request was received.\n\n${appointmentSummary(appointment)}\n\nOpen the admin panel to review and respond.` }));
  else results.push(baseResult('appointment_created_hospital', null, 'skipped', 'Hospital notification email is not configured.'));
  if (appointment.email) results.push(await sendEmail({ to: appointment.email, type: 'appointment_received_patient', appointmentId: appointment.id, subject: 'P2Care received your appointment request', text: `Thank you, ${appointment.patient_name}. We received your appointment request and a P2Care coordinator will contact you to confirm the visit.\n\nRequested date: ${appointment.appointment_date}\nRequested time: ${appointment.appointment_time || 'Not specified'}\nDepartment: ${appointment.department || 'General care'}` }));
  return recordResults(results);
}
export async function notifyAppointmentStatus(appointment) {
  const results = [];
  if (appointment.patient_uid && !config.useMockData) {
    await addDocument('patient_notifications', {
      patient_uid: appointment.patient_uid,
      type: 'appointment_status',
      title: 'Appointment status updated',
      message: '',
      status: appointment.status,
      appointment_id: appointment.id,
      created_at: new Date().toISOString(),
      read_at: null,
    });
  }
  if (appointment.email) {
    results.push(await sendEmail({
      to: appointment.email,
      type: 'appointment_status_patient',
      appointmentId: appointment.id,
      subject: `P2Care appointment ${appointment.status}`,
      text: `Hello ${appointment.patient_name},\n\nYour P2Care appointment request is now ${appointment.status}.\n\nDate: ${appointment.appointment_date}\nTime: ${appointment.appointment_time || 'Please contact our care desk'}\nDepartment: ${appointment.department || 'General care'}\n\nIf you need help, call +91 1800 123 4567.`,
    }));
  } else {
    results.push(baseResult('appointment_status_patient', null, 'skipped', 'Patient has no email address.'));
  }
  return recordResults(results);
}
export async function sendAppointmentStatusEmail(appointment) {
  if (!appointment) return { status: 'failed', message: 'Appointment not found.' };
  const [result] = await recordResults([await sendEmail({ to: appointment.email, type: 'appointment_status_manual', appointmentId: appointment.id, subject: `P2Care appointment ${appointment.status}`, text: `Hello ${appointment.patient_name},\n\nYour P2Care appointment request is now ${appointment.status}.\n\nDate: ${appointment.appointment_date}\nTime: ${appointment.appointment_time || 'Please contact our care desk'}\nDepartment: ${appointment.department || 'General care'}\n\nIf you need help, call +91 1800 123 4567.` })]);
  return result;
}
export function getNotificationStatus() { return { provider: 'resend', configured: Boolean(resend && config.notificationFromEmail), fromEmail: config.notificationFromEmail || null, hospitalNotificationEmail: config.hospitalNotificationEmail || null, mode: config.useMockData ? 'mock' : 'firebase', note: config.useMockData ? 'Email delivery is simulated in mock mode.' : 'Email delivery uses Resend when configured.' }; }
export async function getNotificationLogs() {
  if (config.useMockData) return listMockNotifications();
  const snapshot = await collectionRef('notification_logs').orderBy('created_at', 'desc').limit(100).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function publishHospitalUpdate(update) {
  if (config.useMockData) {
    return {
      inAppRecipients: 0,
      emailRecipients: listMockNewsletterSubscribers().length,
      emailsSent: 0,
      delivery: 'simulated',
    };
  }

  const [patientSnapshot, subscriberSnapshot] = await Promise.all([
    collectionRef('profiles').where('role', '==', 'patient').where('newsletter_opt_in', '==', true).get(),
    collectionRef('newsletter_subscribers').get(),
  ]);
  const patientProfiles = patientSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const emails = new Map();
  for (const profile of patientProfiles) {
    const email = String(profile.email || '').trim().toLowerCase();
    if (email) emails.set(email, { to: email, unsubscribeToken: null });
  }
  for (const doc of subscriberSnapshot.docs) {
    const email = String(doc.data().email || '').trim().toLowerCase();
    if (email) {
      const unsubscribeToken = doc.data().unsubscribe_token || randomUUID();
      if (!doc.data().unsubscribe_token) await doc.ref.update({ unsubscribe_token: unsubscribeToken });
      emails.set(email, { to: email, unsubscribeToken });
    }
  }
  const now = new Date().toISOString();
  for (let index = 0; index < patientProfiles.length; index += 400) {
    const batch = getFirebaseFirestore().batch();
    for (const profile of patientProfiles.slice(index, index + 400)) {
      const ref = collectionRef('patient_notifications').doc();
      batch.set(ref, {
        id: ref.id,
        patient_uid: profile.id,
        type: 'hospital_update',
        title: update.title,
        message: update.body,
        update_id: update.id,
        created_at: now,
        read_at: null,
      });
    }
    await batch.commit();
  }
  const results = [];
  const recipients = [...emails.values()];
  for (let index = 0; index < recipients.length; index += 10) {
    results.push(...await Promise.all(recipients.slice(index, index + 10).map(({ to, unsubscribeToken }) =>
      sendEmail({
        to,
        type: 'hospital_update',
        subject: `P2Care Hospital update: ${update.title}`,
        text: `${update.title}\n\n${update.body}\n\nYou are receiving this message because you opted in to P2Care Hospital updates.${unsubscribeToken ? `\n\nUnsubscribe: ${config.frontendUrl}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}` : `\n\nManage your email preferences: ${config.frontendUrl}/account`}`,
      }),
    )));
  }
  await recordResults(results);
  return {
    inAppRecipients: patientProfiles.length,
    emailRecipients: recipients.length,
    emailsSent: results.filter((result) => result.status === 'sent').length,
    delivery: !recipients.length
      ? 'no_recipients'
      : results.every((result) => result.status === 'sent')
        ? 'sent'
        : results.some((result) => result.status === 'sent')
          ? 'partial'
          : results.some((result) => result.status === 'failed')
            ? 'failed'
            : 'skipped',
  };
}

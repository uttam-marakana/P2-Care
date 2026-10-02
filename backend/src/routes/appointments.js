import { Router } from 'express';
import { z } from 'zod';
import { config } from '../lib/config.js';
import { createMockAppointment, listMockAppointments, removeMockAppointment, updateMockAppointment } from '../lib/mockStore.js';
import { createDocument, deleteDocument, getAppointmentWithDoctor, getDocument, listAppointmentsWithDoctors, updateDocument } from '../lib/firestore.js';
import { requirePermission } from '../middleware/auth.js';
import { asyncHandler, created, fail, ok } from '../lib/http.js';
import { publicWriteRateLimit } from '../middleware/security.js';
import { notifyAppointmentStatus, notifyNewAppointment } from '../services/notifications.js';

const router = Router();
const appointmentSchema = z.object({ name: z.string().trim().min(2).max(120), phone: z.string().trim().regex(/^[+0-9 ()-]{8,18}$/), email: z.string().trim().email().max(160).optional().or(z.literal('')), reason: z.string().trim().min(1).max(120), date: z.string().date(), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().or(z.literal('')), notes: z.string().trim().max(500).optional().or(z.literal('')), doctorId: z.string().optional().nullable() });
const updateSchema = z.object({ status: z.enum(['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show']).optional(), admin_notes: z.string().trim().max(2000).optional().nullable(), appointment_date: z.string().date().optional(), appointment_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().nullable(), doctor_id: z.string().optional().nullable() });

router.get('/', requirePermission('appointments:read'), asyncHandler(async (_req, res) => {
  if (config.useMockData) return ok(res, { appointments: listMockAppointments() });
  try { return ok(res, { appointments: await listAppointmentsWithDoctors() }); }
  catch (error) { return fail(res, 500, 'APPOINTMENT_LIST_FAILED', 'Unable to load appointments.', error.message); }
}));

router.get('/:id', requirePermission('appointments:read'), asyncHandler(async (req, res) => {
  if (config.useMockData) {
    const data = listMockAppointments().find((item) => item.id === req.params.id);
    if (!data) return fail(res, 404, 'APPOINTMENT_NOT_FOUND', 'Appointment not found.');
    return ok(res, { appointment: data });
  }
  try {
    const data = await getAppointmentWithDoctor(req.params.id);
    if (!data) return fail(res, 404, 'APPOINTMENT_NOT_FOUND', 'Appointment not found.');
    return ok(res, { appointment: data });
  } catch (error) { return fail(res, 500, 'APPOINTMENT_GET_FAILED', 'Unable to load appointment.', error.message); }
}));

router.post('/', publicWriteRateLimit, asyncHandler(async (req, res) => {
  const parsed = appointmentSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid appointment details.', parsed.error.flatten());
  const v = parsed.data;
  if (config.useMockData) {
    const data = createMockAppointment(v);
    await notifyNewAppointment(data);
    return created(res, { appointment: data });
  }
  try {
    const data = await createDocument('appointments', {
      patient_name: v.name, phone: v.phone, email: v.email || null, department: v.reason,
      doctor_id: v.doctorId || null, appointment_date: v.date, appointment_time: v.time || null,
      notes: v.notes || null, admin_notes: null, status: 'pending',
    });
    const appointment = await getAppointmentWithDoctor(data.id);
    await notifyNewAppointment(appointment);
    return created(res, { appointment });
  } catch (error) { return fail(res, 409, 'APPOINTMENT_CREATE_FAILED', 'Unable to save appointment.', error.message); }
}));

router.patch('/:id', requirePermission('appointments:write'), asyncHandler(async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid appointment update.', parsed.error.flatten());
  if (!Object.keys(parsed.data).length) return fail(res, 400, 'EMPTY_UPDATE', 'No fields were supplied for update.');
  if (config.useMockData) {
    const data = updateMockAppointment(req.params.id, parsed.data);
    if (!data) return fail(res, 404, 'APPOINTMENT_NOT_FOUND', 'Appointment not found.');
    return ok(res, { appointment: data });
  }
  try {
    const existing = await getDocument('appointments', req.params.id);
    if (!existing) return fail(res, 404, 'APPOINTMENT_NOT_FOUND', 'Appointment not found.');
    await updateDocument('appointments', req.params.id, parsed.data);
    const data = await getAppointmentWithDoctor(req.params.id);
    if (existing.status !== data.status && data.status) await notifyAppointmentStatus(data);
    return ok(res, { appointment: data });
  } catch (error) { return fail(res, 409, 'APPOINTMENT_UPDATE_FAILED', 'Unable to update appointment.', error.message); }
}));

router.delete('/:id', requirePermission('appointments:delete'), asyncHandler(async (req, res) => {
  if (config.useMockData) {
    if (!removeMockAppointment(req.params.id)) return fail(res, 404, 'APPOINTMENT_NOT_FOUND', 'Appointment not found.');
    return ok(res, { id: req.params.id });
  }
  try {
    if (!await deleteDocument('appointments', req.params.id)) return fail(res, 404, 'APPOINTMENT_NOT_FOUND', 'Appointment not found.');
    return ok(res, { id: req.params.id });
  } catch (error) { return fail(res, 409, 'APPOINTMENT_DELETE_FAILED', 'Unable to delete appointment.', error.message); }
}));

export default router;

import { Router } from 'express';
import { config } from '../lib/config.js';
import { asyncHandler, fail, ok } from '../lib/http.js';
import { requirePermission } from '../middleware/auth.js';
import { getNotificationLogs, getNotificationStatus, sendAppointmentStatusEmail } from '../services/notifications.js';
import { listMockAppointments } from '../lib/mockStore.js';
import { getAppointmentWithDoctor } from '../lib/firestore.js';

const router = Router();
router.get('/status', requirePermission('notifications:read'), (_req, res) => ok(res, { status: getNotificationStatus() }));
router.get('/logs', requirePermission('notifications:read'), asyncHandler(async (_req, res) => ok(res, { logs: await getNotificationLogs() })));
router.post('/appointments/:id/status-email', requirePermission('notifications:send'), asyncHandler(async (req, res) => {
  const appointment = config.useMockData ? listMockAppointments().find((item) => item.id === req.params.id) || null : await getAppointmentWithDoctor(req.params.id);
  if (!appointment) return fail(res, 404, 'APPOINTMENT_NOT_FOUND', 'Appointment not found.');
  const result = await sendAppointmentStatusEmail(appointment);
  if (result.status === 'failed') return fail(res, 502, 'NOTIFICATION_FAILED', result.message);
  return ok(res, { notification: result });
}));
export default router;

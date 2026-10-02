import { config } from '../lib/config.js';
import { addMockAuditLog, listMockAuditLogs } from '../lib/mockStore.js';
import { addDocument, collectionRef } from '../lib/firestore.js';

export async function recordAudit({ req, action, entity = null, entityId = null, statusCode = null }) {
  const entry = {
    actor_id: req.user?.id || null,
    actor_email: req.user?.email || null,
    action,
    entity,
    entity_id: entityId,
    method: req.method,
    path: req.path,
    status_code: statusCode,
    request_id: req.requestId || null,
    ip: req.ip || null,
    user_agent: req.get('user-agent') || null,
    created_at: new Date().toISOString(),
  };
  if (config.useMockData) { addMockAuditLog(entry); return entry; }
  try { return await addDocument('audit_logs', entry); }
  catch (error) { console.error('Audit log write failed:', error.message); return entry; }
}

export async function getAuditLogs(limit = 100) {
  if (config.useMockData) return listMockAuditLogs().slice(0, limit);
  const snapshot = await collectionRef('audit_logs').orderBy('created_at', 'desc').limit(limit).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

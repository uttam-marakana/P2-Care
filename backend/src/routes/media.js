import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, created, fail, ok } from '../lib/http.js';
import { requirePermission } from '../middleware/auth.js';
import { MAX_MEDIA_BYTES, listMedia, removeMedia, uploadMedia } from '../services/storage.js';

const router = Router();
const schema = z.object({
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  data: z.string().min(1),
  folder: z.string().trim().max(60).optional().default('general'),
});

function decodeDataUrl(data) {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(data);
  if (!match) throw new Error('Invalid image payload.');
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > MAX_MEDIA_BYTES) throw new Error('Image must be 5 MB or smaller.');
  return { mimeType: match[1], buffer };
}

router.get('/', requirePermission('media:read'), asyncHandler(async (_req, res) => {
  return ok(res, { items: await listMedia() });
}));

router.post('/', requirePermission('media:write'), asyncHandler(async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid media upload.', parsed.error.flatten());
  try {
    const decoded = decodeDataUrl(parsed.data.data);
    if (decoded.mimeType !== parsed.data.mimeType) return fail(res, 400, 'MEDIA_TYPE_MISMATCH', 'The uploaded image type does not match its declared type.');
    const item = await uploadMedia({ fileName: parsed.data.fileName, mimeType: parsed.data.mimeType, buffer: decoded.buffer, folder: parsed.data.folder });
    return created(res, { item });
  } catch (error) {
    return fail(res, 400, 'MEDIA_UPLOAD_FAILED', error.message);
  }
}));

router.delete('/:id', requirePermission('media:delete'), asyncHandler(async (req, res) => {
  try {
    const removed = await removeMedia(req.params.id);
    if (!removed) return fail(res, 404, 'MEDIA_NOT_FOUND', 'Media item not found.');
    return ok(res, { id: req.params.id });
  } catch (error) {
    return fail(res, 400, 'MEDIA_DELETE_FAILED', error.message);
  }
}));

export default router;

import { Router } from 'express';
import { z } from 'zod';
import { config } from '../lib/config.js';
import { listMockContent, removeMockContent, saveMockContent } from '../lib/mockStore.js';
import { createDocument, deleteDocument, listCollection, updateDocument } from '../lib/firestore.js';
import { requirePermission } from '../middleware/auth.js';
import { asyncHandler, created, fail, ok } from '../lib/http.js';

const router = Router();
const allowedTypes = ['doctors', 'services', 'articles', 'faqs'];
const base = z.object({ status: z.enum(['draft', 'published']).optional() });
const schemas = {
  doctors: base.extend({ name: z.string().trim().min(2).max(160), slug: z.string().trim().max(180).optional().or(z.literal('')), specialty: z.string().trim().min(2).max(120), credentials: z.string().trim().max(200).optional().or(z.literal('')), experience: z.string().trim().max(100).optional().or(z.literal('')), availability: z.string().trim().max(200).optional().or(z.literal('')), bio: z.string().trim().max(5000).optional().or(z.literal('')), languages: z.array(z.string().trim().max(60)).max(10).optional(), initials: z.string().trim().max(10).optional().or(z.literal('')), tone: z.string().trim().max(200).optional().or(z.literal('')), image_url: z.string().url().max(2000).optional().or(z.literal('')) }),
  services: base.extend({ name: z.string().trim().min(2).max(160), slug: z.string().trim().max(180).optional().or(z.literal('')), detail: z.string().trim().max(5000).optional().or(z.literal('')), icon: z.string().trim().max(80).optional().or(z.literal('')), image_url: z.string().url().max(2000).optional().or(z.literal('')) }),
  articles: base.extend({ title: z.string().trim().min(3).max(220), slug: z.string().trim().max(240).optional().or(z.literal('')), category: z.string().trim().max(100).optional().or(z.literal('')), excerpt: z.string().trim().max(500).optional().or(z.literal('')), content: z.string().trim().min(1).max(30000), date: z.string().trim().max(40).optional().or(z.literal('')), read: z.string().trim().max(40).optional().or(z.literal('')), tone: z.string().trim().max(200).optional().or(z.literal('')), image_url: z.string().url().max(2000).optional().or(z.literal('')) }),
  faqs: base.extend({ q: z.string().trim().min(3).max(500), a: z.string().trim().min(1).max(5000), category: z.string().trim().max(100).optional().or(z.literal('')) }),
};

function validateType(req, res, next) {
  if (!allowedTypes.includes(req.params.type)) return fail(res, 404, 'CONTENT_TYPE_NOT_FOUND', 'Unknown content type.');
  req.contentType = req.params.type;
  return next();
}

router.use('/:type', validateType);

router.get('/:type', (req, res, next) => {
  if (req.query.includeDrafts === 'true') return requirePermission('content:read')(req, res, next);
  return next();
}, asyncHandler(async (req, res) => {
  const type = req.contentType;
  const includeDrafts = req.query.includeDrafts === 'true';
  if (config.useMockData) return ok(res, { items: listMockContent(type, { includeDrafts }) });
  try {
    return ok(res, { items: await listCollection(type, { includeDrafts }) });
  } catch (error) {
    return fail(res, 500, 'CONTENT_LIST_FAILED', 'Unable to load content.', error.message);
  }
}));

router.post('/:type', requirePermission('content:write'), asyncHandler(async (req, res) => {
  const type = req.contentType;
  const parsed = schemas[type].safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid content details.', parsed.error.flatten());
  if (config.useMockData) return created(res, { item: saveMockContent(type, parsed.data) });
  try {
    return created(res, { item: await createDocument(type, parsed.data) });
  } catch (error) {
    return fail(res, 409, 'CONTENT_CREATE_FAILED', 'Unable to create content.', error.message);
  }
}));

router.patch('/:type/:id', requirePermission('content:write'), asyncHandler(async (req, res) => {
  const type = req.contentType;
  const parsed = schemas[type].partial().safeParse(req.body);
  if (!parsed.success) return fail(res, 400, 'VALIDATION_ERROR', 'Invalid content update.', parsed.error.flatten());
  if (!Object.keys(parsed.data).length) return fail(res, 400, 'EMPTY_UPDATE', 'No fields were supplied for update.');
  if (config.useMockData) {
    const data = saveMockContent(type, { id: req.params.id, ...parsed.data });
    if (!data) return fail(res, 404, 'CONTENT_NOT_FOUND', 'Content item not found.');
    return ok(res, { item: data });
  }
  try {
    const data = await updateDocument(type, req.params.id, parsed.data);
    if (!data) return fail(res, 404, 'CONTENT_NOT_FOUND', 'Content item not found.');
    return ok(res, { item: data });
  } catch (error) {
    return fail(res, 409, 'CONTENT_UPDATE_FAILED', 'Unable to update content.', error.message);
  }
}));

router.delete('/:type/:id', requirePermission('content:delete'), asyncHandler(async (req, res) => {
  const type = req.contentType;
  if (config.useMockData) {
    if (!removeMockContent(type, req.params.id)) return fail(res, 404, 'CONTENT_NOT_FOUND', 'Content item not found.');
    return ok(res, { id: req.params.id });
  }
  try {
    if (!await deleteDocument(type, req.params.id)) return fail(res, 404, 'CONTENT_NOT_FOUND', 'Content item not found.');
    return ok(res, { id: req.params.id });
  } catch (error) {
    return fail(res, 409, 'CONTENT_DELETE_FAILED', 'Unable to delete content.', error.message);
  }
}));

export default router;

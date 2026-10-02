export function ok(res, data = {}, status = 200) {
  return res.status(status).json({ ok: true, data });
}

export function created(res, data = {}) {
  return ok(res, data, 201);
}

export function fail(res, status, code, message, details) {
  const body = { ok: false, error: { code, message } };
  if (details !== undefined && process.env.NODE_ENV !== 'production') body.error.details = details;
  return res.status(status).json(body);
}

export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

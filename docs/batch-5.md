# Batch 5 — Security & Production Hardening

## Included
- Helmet security headers with application-safe CSP handling.
- Exact CORS origin allowlist via `ALLOWED_ORIGINS`.
- Request IDs through `X-Request-ID` for operational tracing.
- Global API rate limiting plus stricter public-write and authentication limits.
- Mock mode is blocked when `NODE_ENV=production` unless explicitly overridden.
- Strict JSON parsing and bounded request body size.
- Backend authentication and role/permission checks remain the security boundary.
- Production API errors no longer expose Zod/database details.
- Media uploads validate both declared MIME type and file magic bytes.
- Audit logs record mutating API operations without storing request bodies or patient payloads.
- Admin security endpoints expose runtime security configuration and audit history.

## Environment

```env
NODE_ENV=development
USE_MOCK_DATA=true
ALLOWED_ORIGINS=http://localhost:5173
API_RATE_LIMIT=120
PUBLIC_WRITE_RATE_LIMIT=20
AUTH_RATE_LIMIT=10
ALLOW_MOCK_IN_PRODUCTION=false
```

For production, use `USE_MOCK_DATA=false` and configure the real Firebase credentials during the final Firebase integration phase.

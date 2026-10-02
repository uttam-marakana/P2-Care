# P2Care Hospital Architecture

## Runtime layers

```text
Browser / React
      │
      │ public requests + authenticated API requests
      ▼
Express API
      │
      ├── authentication / role / permission middleware
      ├── Zod validation
      ├── standardized JSON responses
      └── services / repositories
      │
      ▼
Firebase
  ├── Auth
  ├── PostgreSQL
  └── Storage (future media layer)
```

## Development mode

The project is mock-first for local development. `VITE_USE_MOCK_DATA=true` keeps the frontend independent from Firebase. `USE_MOCK_DATA=true` lets the backend start without Firebase credentials and exposes the same API contracts using in-memory seed data.

## Production mode

Set both mock flags to `false`. The browser authenticates with Firebase Auth and sends the resulting bearer token to the Express API. The Express API validates that token, loads the staff profile, applies role/permission rules, validates request data, and then accesses Firebase using the server-only secret key.

The frontend does not directly mutate CMS or appointment tables in real mode.

## API response contract

Success:

```json
{
  "ok": true,
  "data": {}
}
```

Error:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": {}
  }
}
```

## API areas

- `/health` — service health.
- `/api/auth/me` — authenticated user/profile/permissions.
- `/api/appointments` — patient appointment lifecycle.
- `/api/content/doctors` — doctor CMS.
- `/api/content/services` — service CMS.
- `/api/content/articles` — article CMS.
- `/api/content/faqs` — FAQ CMS.

## Security boundary

The frontend route guard is for user experience. It is not a security boundary. Every protected API operation is authorized on the backend using the bearer token, staff profile and permission set.

## Remediation Finding 12

**Status:** Fixed

**Fix date:** 2026-06-08

**What was changed:**

HTTP security headers were implemented directly into the frontend deployment configuration (`frontend/firebase.json`). This ensures that the web server instructs client browsers to enforce runtime security boundaries.

**Files modified**

- `frontend/firebase.json`

**Before**

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

**After**

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
          { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000 https://api.cloudinary.com; img-src 'self' data: https://res.cloudinary.com;" }
        ]
      }
    ]
  }
}
```

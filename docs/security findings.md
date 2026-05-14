# Security findings

## Audit priority

- [ ] 1 | `backend/.env` | Secrets, credentials, JWT key strength
- [ ] 2 | `frontend/.env` | Firebase keys, API URLs baked into frontend
- [ ] 3 | `frontend/src/config.js` | Hardcoded config in source
- [ ] 4 | `frontend/build/` or `dist/` | Secrets baked into production bundle
- [ ] 5 | `backend/package.json` → `npm audit` | Known CVE dependencies
- [ ] 6 | `frontend/package.json` → `npm audit` | Known CVE dependencies
- [ ] 7 | `firebase.json` + `.firebaserc` | Firebase misconfiguration
- [ ] 8 | `backend/src/api.js` | CORS, global middleware, security headers
- [ ] 9 | `backend/src/routes/` | Full endpoint inventory
- [ ] 10 | `backend/src/middlewares/` | Auth guards
- [ ] 11 | `backend/src/validators/` | Input validation coverage
- [ ] 12 | `backend/src/models/` | Schema, mass assignment
- [ ] 13 | `backend/src/controllers/` | Business logic
- [ ] 14 | `frontend/src/App.jsx` | Route structure, auth guards client-side
- [ ] 15 | `frontend/src/pages/` | Sensitive data handling, localStorage abuse
- [ ] 16 | `frontend/src/components/` | XSS surface, `dangerouslySetInnerHTML`
- [ ] 17 | `frontend/src/utils/` | Crypto helpers, token handling
- [ ] 18 | `backend/src/utils/`, `commands/` | Hardcoded secrets, insecure helpers

## Findings:

### Finding 1: Description.

**Severity: High**

**Description:** Description.

**Impact:** Impact.

**Recommendation:** Recommendation.

# Security findings

## Audit priority

- [x] 1 | `backend/.env` | Secrets, credentials, JWT key strength
- [x] 2 | `frontend/.env` | Firebase keys, API URLs baked into frontend
- [x] 3 | `frontend/src/config.js` | Hardcoded config in source
- [x] 4 | `frontend/build/` or `dist/` | Secrets baked into production bundle
- [x] 5 | `backend/package.json` → `npm audit` | Known CVE dependencies
- [x] 6 | `frontend/package.json` → `npm audit` | Known CVE dependencies
- [x] 7 | `firebase.json` + `.firebaserc` | Firebase misconfiguration
- [x] 8 | `backend/src/api.js` | CORS, global middleware, security headers
- [x] 9 | `backend/src/routes/` | Full endpoint inventory
- [x] 10 | `backend/src/middlewares/` | Auth guards
- [x] 11 | `backend/src/validators/` | Input validation coverage
- [x] 12 | `backend/src/models/` | Schema, mass assignment
- [x] 13 | `backend/src/controllers/` | Business logic
- [x] 14 | `frontend/src/App.jsx` | Route structure, auth guards client-side
- [ ] 15 | `frontend/src/pages/` | Sensitive data handling, localStorage abuse
- [ ] 16 | `frontend/src/components/` | XSS surface, `dangerouslySetInnerHTML`
- [x] 17 | `frontend/src/utils/` | Crypto helpers, token handling
- [ ] 18 | `backend/src/utils/`, `commands/` | Hardcoded secrets, insecure helpers

## Findings:

### Finding 1: Credentials exposure risk mitigated by proper `.gitignore` discipline.

**Severity: Low / Informational**

**Location:** `backend/.gitignore`, `backend/.env`, `frontend/.gitignore`, `frontend/.env`

**Description:** Despite the repository being public on Github since 2023, the `.env` file containing production credentials was never committed to version control. Git history search confirms no credential strings appear in any of the 80+ commits. The `.gitignore` correctly excluded `.env` throughout the project lifecycle.

**Residual risk:** 

The repo is still public and contains full application source code, which reveals the structure of the project.

The `.env` file exists locally with credentials that have been unrotated since 2023. Standard hygiene would suggest rotating them regardless.

---

### Finding 2: Weak JWT secret likely insufficient entropy, used without processing.

**Severity: High**

**Location:** `backend/.env`, `backend/src/utils/create-token.js`

**Source:** [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html#secret-key)

**Description:** The JWT secret is 88 characters of mixed alphanumeric and has two issues:

- It appears manually typed rather than cryptographically generated. A proper secret should come from `crypto.randomBytes(64).toString('hex')` which produces 128 hex characters with guaranteed entropy.

- The variable is named `JWT_KEY`. It is used as the HMAC secret without any processing, key length and entropy are the only protections.

**Impact:** If this secret is known, an attacker can forge arbitrary JWTs, impersonate any user including admins and bypass all authentication.

**Recommendation:** 

- Rotate immediately.

- Generate properly `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.

- Consider RS256 (asymmetric) instead of HS256: The private key signs, the public key verifies, so even if the verification key leaks, tokens can't be forged.

---

### Finding 3: HTTP/HTTPS port configuration - Development vs production separation.

**Severity: Informational**

**Location:** `backend/.env`

**Description:** Port 3000 is used for local development and port 443 was activated for production deployment.

This is actually a correct practice: Production used port 443 (HTTPS) while local development ran on 3000.

TLS termination in production was either handled by Heroku's built-in SSL (which it provides automatically on all dynos) or a custom certificate. Since the app is deprecated this is hard to verify retroactively, but Heroku's default behaviour would have provided TLS, so this is likely a non-issue.

---

### Finding 4: MongoDB weak password and unrotated credentials.

**Severity: Medium**

**Location:** `backend/.env`

**Sources:**
- [OWASP Authentication Cheat Sheet — Passwords](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls)
- [CWE-521: Weak Password Requirements](https://cwe.mitre.org/data/definitions/521.html)

**Description:** The MongoDB Atlas connection is configured with a weak dictionary-phrase password containing no special characters and no verified entropy. Credentials have been unrotated since July 2023 (approximately 3 years).

**Evidence:**

- `DB_HOST`: Live MongoDB Atlas cluster hostname (redacted)
- `DB_USER`: Static database username (redacted)
- `DB_PASSWORD`: Weak dictionary phrase, no special characters (redacted)
- `DB_PORT`: 27017 (MongoDB default port)

**Impact:** An attacker who obtains these credentials through any vector, like local file access, backup exposure or insider threat, gains full read/write access to the production DB containing real user PII.

**Recommendation:**

- Rotate `DB_PASSWORD` immediately using a cryptographically random value.

- Use a secrets manager, like AWS Secrets Manager for credential storage in future projects rather than `.env` files.

---

### Finding 5: MongoDB Atlas configured to allow connections from any IP address.

**Severity: High**

**Location:** MongoDB Atlas dashboard

**Description:** The MongoDB Atlas cluster was configured with a network access rule of `0.0.0.0/0` during its entire production lifetime. This setting was confirmed active in the Atlas dashboard post-deprecation.

**Evidence:**
- Atlas IP Access List entry: `0.0.0.0/0` — Status: Active
- No IP restriction rules present

**Impact:** Combined with Finding 4 (weak database password), this means the database was fully exposed to the internet with no network-layer protection. Any attacker with the credentials could connect directly to MongoDB from anywhere in the world without needing to compromise the application server first. 

**Recommendation:** In future projects, restrict Atlas network access to specific server IPs only. For dynamic infrastructure, use VPC peering or Atlas Private Endpoints rather than allowlisting `0.0.0.0/0`.

**Source:** (Configure IP Access List Entries in MongoDB)[https://www.mongodb.com/docs/atlas/security/ip-access-list/?interface-default-atlas-cli=atlas-cli]

---

### Finding 6: Default MongoDB port.

**Severity: Informational**

**Location:** `backend/.env`

**Description:** Default port in use means no port obfuscation. Not a control, but worth noting in the context of the Atlas exposure surface above.

---

### Finding 7: Security-conscious development practices observed.

**Severity: N/A - Positive control**

**Location:** `.gitignore`, `backend/.env`, `frontend/.env`, `frontend/src/config.js`, `backend/src/controllers/user/`, git history

**Description:** Despite the security issues documented in this report, several deliberate security-conscious practices were observed throughout the codebase: 

- **Secrets management:** Credentials and API keys are consistently excluded from version control across the project. Both `.env` files and `config.js` (which contains hardcoded API keys) are explicitly listed in `.gitignore` across frontend and backend. Git history confirms no credential strings in any commits. This reflects deliberate secrets management discipline rather than accidental omission.

- **Sensitive field exclusion from API responses:** User controllers explicitly exclude sensitive fields from database queries and responses:
  - `user/get-all.js` and `user/get-by-id.js` use `.select('-password -mfaSecret')` to exclude sensitive fields at query level.
  - `user/login.js` and `user/register.js` explicitly delete `password` and `mfaSecret` before sending responses.

- **Mass assignment protection at creation layer:** All create controllers explicitly whitelist fields passed to the database rather than passing the full request body. Notably, `role` is hardcoded as `'BASIC'` in the register controller rather than accepted from user input, demonstrating awareness of privilege escalation risk at the creation layer.

- **Input validation on create endpoints:** Joi validation schemas are consistently implemented across all create controllers with type checking, lenght limits and format validation.

- **Mongoose ObjectId casting:** Mongoose's strict ObjectId type casting provides implicit protection against NoSQL injection via ID parameters. MongoDB operators passed as ID values are rejected before reaching the database.

---

### Finding 8: Cloudinary unsigned upload preset exposed via public JS bundle.

**Severity: High**

**Location:** `frontend/.env`, `frontend/dist/`, `frontend/build/`, Cloudinary dashboard

**Source:** [Managing upload presets in Cloudinary](https://cloudinary.com/documentation/upload_presets)

**Description:** The frontend uses Vite, which bakes all `VITE_` prefixed environment variables into the compiled JavaScript bundle at build time. The Cloudinary cloud name `VITE_CLOUDINARY_ID` was therefore publicly readable in the production bundle by anyone who visited the site or inspected the JS files.

Independently, the Cloudinary account has an unsigned upload preset active since June 2023, configured with public access mode. Unsigned presets require no authentication or API secret - only the cloud name and preset name are needed to upload files.

**Evidence:** 

- `VITE_CLOUDINARY_ID`: Cloud name present in `frontend/.env` and baked into production bundle at build time.

- Cloudinary dashboard: Upload preset unsigned, Access mode: Public, Created: Jun 22, 2023, Status: Active.

**Attack scenario:**

Any actor who visited the production site could extract the cloud name from the public JS bundle and use it with the known unsigned preset to upload arbitrary files to the account with no authentication.

```bash
curl -X POST https://api.cloudinary.com/v1_1/<redacted>/image/upload \
  -F "file=@any_file.jpg" \
  -F "upload_preset=<redacted>"
```

**Impact:** 

- Unauthorized file uploads to the Cloudinary account.
- Storage quota exhaustion.
- Hosting of malicious or illegal content on the application's media domain.
- No authentication log: The uploads would appear legitimate in Cloudinary's dashboard.

**Recommendation:**

- Disable or delete the unsigned upload preset immediately.
- For future projects, use signed uploads with a backend-generated signature (the API secret never leaves the server).
- Audit Cloudinary storage for any unexpected uploads since June 2023.

**Status:** Upload preset disabled post-audit on May 14th, 2026.

---

### Finding 9: Production API hostname disclosed in frontend source.

**Severity: Low**

**Location:** `frontend/.env`

**Evidence:**

- `VITE_API_URL`: Production API URL present in commented line (redacted)

**Description:** The commented-out production API URL reveals the hosting 
platform (Render) and the exact production API hostname. While commented out 
in the `.env` file, this value is present in the repository and discloses 
infrastructure details to anyone with access to the source code.

**Impact:** Low in isolation. Combined with other findings, an attacker 
performing reconnaissance on the application would immediately know the 
production API endpoint without needing to discover it through scanning.

**Recommendation:** Use placeholder values in committed configuration 
files rather than real hostnames, even in comments.

---

### Finding 10: API key hardcoded in source file and exposed in production bundle.

**Severity: Medium**

**Location:** `frontend/src/config.js`, `frontend/src/components/Weather/index.jsx`

**Source:** [CWE-798: Use of Hard-coded Credentials](https://cwe.mitre.org/data/definitions/798.html)

**Description:** The OpenWeather API key is hardcoded directly in `frontend/src/config.js` and imported by the Weather component. Unlike `.env` variables which are managed through environment configuration, this value is committed or at risk of being committed as source code. The file is gitignored, but the import chain confirms the key was compiled into every production bundle and deployed to Firebase, where it was readable by anyone who inspected the JavaScript source.

**Evidence:**

- `frontend/src/config.js`: Contains `OPENWEATHER_API_KEY` (redacted)

- `frontend/src/components/Weather/index.jsx` line 3: 
  `import { OPENWEATHER_API_KEY } from "../../config"`

- Key confirmed active in OpenWeather dashboard at time of audit.

**Impact:**

- Any visitor to the production site could extract the API key from the compiled JavaScript bundle using browser devtools.

- Unauthorized use of the key could exhaust the free tier quota, breaking weather functionality for legitimate users.

- Key has been active and unrotated since at least 2023.

**Recommendation:**

- Move API calls that require keys to the backend. The frontend requests weather data from your own API, which then calls OpenWeather server-side. The key never reaches the client.

- Rotate the OpenWeather API key immediately.

- Never hardcode API keys in frontend source files regardless of gitignore status. Use environment variables and treat all frontend values as public.

**Status:** Key deactivated post-audit on May 14th, 2026.

---

### Finding 11: Multiple high and critical severity vulnerabilities in production dependencies

**Severity: High**

**Location:** `backend/package.json`, `frontend/package.json`

**Sources:**
- [GHSA-fjxv-7rqg-78g4 — form-data](https://github.com/advisories/GHSA-fjxv-7rqg-78g4)
- [GHSA-qwph-4952-7xr6 — jsonwebtoken](https://github.com/advisories/GHSA-qwph-4952-7xr6)
- [GHSA-hjrf-2m68-5959 — jsonwebtoken](https://github.com/advisories/GHSA-hjrf-2m68-5959)
- [GHSA-8cf7-32gw-wr33 — jsonwebtoken](https://github.com/advisories/GHSA-8cf7-32gw-wr33)
- [GHSA-wf5p-g6vw-rhxx — axios](https://github.com/advisories/GHSA-wf5p-g6vw-rhxx)
- [GHSA-g644-9gfx-q4q4 — vm2](https://github.com/advisories/GHSA-g644-9gfx-q4q4)

**Description:** Running `npm audit` against both backend and frontend reveals a combined 101 vulnerabilities. Filtering to production dependencies with direct application impact surfaces the following critical issues:

#### Backend

**Critical:**

- `form-data` (`GHSA-fjxv-7rqg-78g4`): Uses unsafe random function for multipart boundary generation, potentially allowing boundary prediction attacks on file upload endpoints.

**High:**

- `jsonwebtoken  <=8.5.1` (`GHSA-qwph-4952-7xr6`, `GHSA-hjrf-2m68-5959`, `GHSA-8cf7-32gw-wr33`): Three CVEs affecting the JWT library used for all authentication in this application. Vulnerabilities include signature validation bypass via insecure default algorithm and token forgery via `RSA/HMAC` algorithm confusion. This compounds Finding 2 (weak JWT secret).

- `express  <=4.21.2` (Multiple CVEs): The core web framework depends on vulnerable version of `body-parser` (DoS via URL encoding), `path-to-regexp` (ReDoS via route parameters) and `qs` (DoS via array parsing). All POST endpoints and route handlers are affected.

- `bcrypt  5.0.1 - 5.1.1` (GHSA-34x7-hfp2-rc4v via tar): The password hashing library depends on a vulnerable version of `tar` via `@mapbox/node-pre-gyp`. Exploitability requires local build context but affects the integrity of the dependency chain.

#### Frontend

**Critical:**

- `vm2 <=3.11.2` (20 CVEs including sandbox escape): Transitive dependency introduced via `cloudinary@1.37.2` dependency chain `cloudinary → proxy-agent → pac-proxy-agent → pac-resolver → degenerator → vm2`. Root cause is outdated Cloudinary SDK. Fix available by upgrading to `cloudinary@2.10.0`.
- `form-data` (GHSA-fjxv-7rqg-78g4): Same as backend.

**High:**
- `axios  1.0.0 - 1.15.1` (20 CVEs): HTTP client used for all API communication. CVEs include CSRF, SSRF, prototype pollution, credential leakage and request hijacking. All frontend-to-backend requests affected.
- `dompurify  <=3.3.3` (multiple XSS bypass CVEs): HTML sanitization library with multiple XSS bypass vulnerabilities. Presence of DOMPurify confirms user-generated HTML is rendered somewhere in the app, which means an active XSS surface requiring investigation.
- `react-draft-wysiwyg`: Rich text editor depending on vulnerable `immutable` via `draft-js`. No fix available for underlying vulnerability. Rich text editors are a classic XSS vector.

**Evidence:**

```sh
# Backend
npm audit
63 vulnerabilities (23 low, 6 moderate, 32 high, 2 critical)
```

```sh
# Frontend
npm audit
38 vulnerabilities (4 low, 12 moderate, 20 high, 2 critical)
```

**Combined:** 101 vulnerabilities.

**Impact:** The `jsonwebtoken` vulnerabilities are most severe in context. Potential authentication bypass without knowing the JWT secret. The `axios` vulnerabilities affect every API call made by the frontend. The `vm2` critical chain, while transitive, represents a significant supply chain risk introduced by a single outdated direct dependency.

**Recommendation:**
- Run `npm audit fix` for non-breaking fixes in both projects.
- Update `jsonwebtoken` to `>=9.0.0` (Note this is a breaking change requiring code review of all JWT verification calls).
- Update `express` to `>=4.21.3`
- Update `axios` to `>=1.15.2`.
- Update `cloudinary` to `>=2.10.0` (Breaking change. Resolves entire vm2 chain).
- Schedule regular `npm audit` runs as part of the CI/CD pipeline
- Consider adding `npm audit --audit-level=high` as a build gate that fails the pipeline on High or Critical findings.

**Note:** The `dompurify` and `react-draft-wysiwyg` findings indicate an active XSS surface that will be investigated further in items 15 and 16 of the audit checklist.

---

### Finding 12: No HTTP security headers configured in Firebase Hosting.

**Severity: Medium**

**Location:** `frontend/firebase.json`

**Source:** [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)

**Description:** The Firebase Hosting configuration does not define any HTTP security headers. Firebase supports custom response headers via the `headers` key in `firebase.json`, but none are configured. As a result the production frontend was served without standard security headers during its entire active lifetime.

**Missing headers and their impact:**

- `Content-Security-Policy` absence allows unrestricted script execution, significantly increasing XSS impact.
- `X-Frame-Options` or `frame-ancestors` CSP directive. Their absence allows the application to be embedded in iframes, enabling clickjacking attacks.
- `X-Content-Type-Options: nosniff` absence allows browsers to MIME-sniff responses, potentially executing uploaded content as scripts.
- `Strict-Transport-Security` absence means HTTPS is not enforced at the browser level for returning visitors.
- `Referrer-Policy` absence means full URLs including tokens may leak in Referer headers to third-party resources.

**Recommendation:** Add a `headers` block to `firebase.json`:

```json
"headers": [
  {
    "source": "**",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Strict-Transport-Security", 
        "value": "max-age=31536000; includeSubDomains" },
      { "key": "Content-Security-Policy", 
        "value": "default-src 'self'; script-src 'self'" }
    ]
  }
]
```

**Note:** CSP configuration requires careful tuning to avoid breaking legitimate functionality. Start with report-only mode using `Content-Security-Policy-Report-Only`.

---

### Finding 13: Insecure Express configuration, missing security middleware and wildcard CORS.

**Severity: High**

**Location:** `backend/src/api.js`

**Sources:**
- [OWASP CORS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#cors)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [npm helmet](https://helmetjs.github.io/)

**Description:** The Express app entry point configures several middleware with insecure defaults and omits critical security middleware entirely.

**Issue 1: Wildcard CORS (High):**

`cors()` is called with no configuration, resulting in `Access-Control-Allow-Origin: *`.

Any domain can make cross-origin requests to the API. Combined with JWT-based authentication stored client-side, a malicious website could make authenticated API requests on behalf of any logged-in user who visits it.

**Issue 2: No request body size limit (Medium):**

```js
app.use(express.json())
```

No `limit` option is configured. An attacker can send arbitrarily large JSON payloads, potentially causing memory exhaustation and DoS.

**Issue 3: Missing security middleware (Medium):**

The following standard security middleware is absent:
- `helmet`: Sets HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.).
- `express-rate-limit`: Prevents brute force and DoS attacks.
- `hpp`: Prevents HTTP parameter poluttion attacks.

**Issue 4: Raw error logging at application level (Low):**

```js
console.error('Could not connect to the database => ', error)
```

Raw error objects logged to console may expose database connection strings, host names and driver internals in server logs.

**Evidence:**
```js
app.use(cors())              // no origin restriction
app.use(express.json())      // no size limit
app.use('/', routes)         // no rate limiting, no helmet
```

**Impact:**
- Wildcard CORS enables cross-site request forgery style attacks from any malicious domain against authenticated users.
- Unbounded request body enables memory exhaustation DoS.
- Missing security headers leave the API response surface unprotected.

**Recommendation:**
```js
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
}))
app.use(express.json({ limit: '10kb' }))
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}))
```

---

### Finding 14: Complete authorization bypass via client-controlled role header | Broken access control.

**Severity: Critical**

**Location:** `backend/src/middlewares/check-user-role.js`, `backend/src/routes/users.js`

**Sources:**
- [OWASP Top 10 A01:2021 — Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [CWE-639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

**Description:** The `checkUserRole` middleware, which protects all admin-level endpoints, determines the user's role by reading a client-supplied HTTP header named `userrole` rather than verifying the role server-side against the database or a trusted JWT claim.

```js
// check-user-role.js
const userRole = request.headers['userrole'] // Trusts client input.
if (userRole) {
  const roleMatches = roles.find(role => role === userRole)
  if (roleMatches) {
      next() // Grants access based on attacker-controlled value.
  }
}
```

Any authenticated user can bypass all role checks by adding a singles HTTP header to their requests. The role-based access control system provides zero security protection.

**Evidence: PoC confirmed during audit:**

- Step 1: Register attacker account (BASIC role):
  ```json
  POST /register
  {
    "nickname": "Attacker",
    "email": "attacker@attacker.com.uy",
    "password": "supersecret"
  }
  => 200 OK, role: "BASIC"
  ```

- Step 2: Access admin user list with role bypass header:
  ```json
  GET /admin/users
  Authorization: Bearer <attacker_token>
  userrole: ADMIN
  => 200 OK (Full user list returned including emails phone numbers, addresses of all users)
  ```

- Step 3: Delete any user with role bypass header:
  ```json
  DELETE /admin/users/<target_id>
  Authorization: Bearer <attacker_token>
  userrole: ADMIN
  => 200 OK (User deleted successfully)
  ```

**Impact:**
Any authenticated user (including self-registered accounts with no vetting) can instantly escalate to ADMIN privileges by adding a single HTTP header. This enables:

- Full read access to all user PII (emails, phone numbers, addresses).
- Deletion of any user account including administrator.
- Access to all other admin-protected endpoints across the entire API.
- Complete compromise of the application's access control model.

This vulnerability renders the entire RBAC implementation ineffective. Every endpoint protected by `checkUserRole()` across all route files must be considered unprotected.

**Root cause:** Role was validated against a client-supplied header rather than a server-side trusted source. Authorization decisions must never be based on client-controlled input.

**Full scope of bypass | Affected endpoints across all route files:**

The `checkUserRole()` bypass affects 27 endpoints across 5 route files.
Any authenticated user can perform the following actions by adding `userrole: ADMIN` to any request:

- Read full PII of all registered users.
- Delete any user, event, lot, preoffer, ad or post.
- Create, update or delete any content across the entire applicartion.
- Access all admin-only data views.

This constitutes a complete collapse of the application's access control model. The RBAC implementation provides zero security value.

**Recommendation:**
Roles must be verified server-side on every request. The correct approach is to look up the user's role from the database using the verified JWT identity:

```js
module.exports = (roles) => {
  return async (request, response, next) => {
    try {
      const user = await userModel.findById(request.user.id)
      if (!user) return response.status(401).json({ 
        message: 'Unauthorized' 
      })
      if (!roles.includes(user.role)) {
        return response.status(403).json({ 
          message: 'Forbidden access' 
        })
      }
      next()
    } catch (error) {
      return response.status(500).json({ 
        message: 'Internal server error' 
      })
    }
  }
}
```

**Status:** Vulnerability confirmed via live PoC on May 2026.
App deprecated. No active users at risk.

---

### Finding 15: Unauthenticated access to sensitive endpoint.

The endpoint `router.post('/preoffers', getAllPreoffers)` that handles auction data containing potentially sensitive financial information. They're fully public with no authentication required.

---

### Finding 16: Misrouted controller in `preforrers.js`.

```js
const getPostsByTag = require('../controllers/post/get-by-tag')
```

A post controller is imported in the preoffers route but never used. This is dead code that suggest copy-past errors during development.

---

### Finding 17: Authorization header sent without Bearer prefix.

**Severity: Informational**

**Location:** `backend/src/middlewares/check-user-credentials.js`, frontend HTTP client.

**Description:** The client sends the JWT token in the Authorization header without the standard `Beared ` prefix. The middleware reads the header raw without stripping any prefix, which works correctly given the current client behavior.

However this deviates from the RFC 7235 standard which defines the Authorization header format as `Beared <token>`. If a standars-compliant client or third integration sends the header with the `Bearer ` prefix, authentication will fail silently.

**Evidence:**
```sh
Authorization: eyJhbGci...  <= no "Bearer " prefix
```

**Recommendation:** Standarize to RFC 7235 format on both client and server:

- Server: extract token with `request.headers.authorization?.split(' ')[1]`
- Client: send header as `Authorization: Bearer <token>`

---

### Finding 18: Role claim missing from JWT (`request.user.role` always undefined).

**Severity: High**

**Location:** `backend/src/middlewares/check-user-credentials.js`, `backend/src/utils/create-token.js`

**Sources:**
- [RFC 7519 §4 — JWT Claims](https://www.rfc-editor.org/rfc/rfc7519#section-4)
- [CWE-285: Improper Authorization](https://cwe.mitre.org/data/definitions/285.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html#centralize-your-authorization-logic)

**Description:** The middleware inserts `decoded.role` into `request.user`, but `create-token.js` never encodes a `role` claim in the JWT payload. As a result `request.user.role` is always `undefined` throughout the entire app.

This compounds Finding 14: Even a corrected `checkUserRole` middleware that read from `request.user.role` instead of the client-supplied header would still fail, because the role is never available from the token.

**Evidence:**
```js
// create-token.js: Role never encoded.
return jwt.sign({
  id: user.id,
  name: user.name,
  email: user.email,
  type: tokenType // No role claim
}, process.env.JWT_KEY, { expiresIn })

// check-user-credentials.js: Role always undefined.
request.user = {
  id: decoded.id,
  name: decoded.name,
  email: decoded.email,
  role: decoded.role // Always undefined.
}
```

**Recommendation:** Either encode the role in the JWT at token creation time or look up user's role from the database in the middleware using the verified `id` claim.

---

### Finding 19: Systemic raw error logging pattern.

**Severity: Low**

**Location:** Multiple files throughout the codebase.

**Description:** Raw `console.error(error)` calls appear throughout the app including `api.js`, `check-user-credentials.js` and multiple controllers. This pattern exposes internal error details, stack traces and library internals in server logs.

**Evidence:** 67 `console.error()` or `console.log()` calls across 32 controller files. Every controller in the application logs raw error objects to console without sanitization.

**Recommendation:** Use a structured logger such as `winston` or `pino` with log levels and sanitized error objects. Never log raw error objects in production.

---

### Finding 20: Input validation absent in all update controllers.

**Severity: High**

**Description:** All create controllers implement Joi validation schemas (a positive development practice). However no update controller implements any validation. All update controllers accept the entire unvalidated request body and apply it directly to the model via `doc.set(request.body)`.

This inconsistency (validation on create, none on update), suggests validation was added to creation flows to solve inmediate functional problems but was never applied systematically to the full CRUD surface.

### Finding 21: Mass assignment via unvalidated update controllers enables privilege escalation to ADMIN.

**Location:** 
`backend/src/controllers/user/update.js`, `backend/src/controllers/event/update.js`, `backend/src/controllers/lot/update.js`, `backend/src/controllers/ad/update.js`, `backend/src/controllers/preoffer/update.js`.

**Sources:**
- [OWASP Mass Assignment Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [CWE-915: Improperly Controlled Modification of Dynamically-Determined Object Attributes](https://cwe.mitre.org/data/definitions/915.html)
- [OWASP Top 10 A01:2021 — Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)

**Description:** All update controllers apply the entire unvalidated request body directly to the model using `doc.set(request.body)` followed by `doc.save()`. No field whitelistening, validation or sanitization is performed. This allows an attacker to modify any field on any model including sensitive fields as `role`, `mfaEnabled`, `password` and `email`.

The user update endpoint is the most severe instance: Any authenticated user can escalate their own privileges to ADMIN by sending a single field in the update request body.

```js
// user/update.js: Entire request body applied directly.
user.set(request.body)  // No field whitelisting.
user.save()
```

**Evidence: PoC confirmed during audit:**

Step 1: Register attacker account (BASIC role):

```json
POST /register
=> role: "BASIC", id: "<redacted>"
```

Step 2: Update own role to ADMIN:

```json
PUT /user/<attacker_id>/update
Authorization: Bearer <attacker_token>
Content-Type: application/json

{ "role": "ADMIN" }

=> 200 OK: "User info updated successfully"
```

Step 3: Login to confirm privilege escalation:

```json
POST /login
=> role: "ADMIN" confirmed
```

**Impact:**
- Any self-registered user can escalate to ADMIN with a single request.
- No exploitation of other vulenrabilities required. This is a standalone complete privilege escalation chain.
- Combined with Finding 14 (broken role check) and Finding 2 (open registration), this creates a trivial path to full application compromise: `Register freely => Escalate to ADMIN => Bypass all role checks`.

- All other update controllers are equally vulnerable to mass assignment. Event, lot, ad and preoffer models can have arbitrary fields overwritten.

**Recommendation:**
Explicitly whitelist allowed fields in every update controller:

```js
// user/update.js — safe version
const allowedFields = ['nickname', 'phone', 'address', 'telephone']
const updateData = Object.fromEntries(
    Object.entries(request.body).filter(([key]) => 
        allowedFields.includes(key)
    )
)
user.set(updateData)
user.save()
```

Never use `doc.set(request.body)` directly. Role, password, email and mfaEnable must never be updatable through the general update endpoint, they require dedicated endpoints with additional verification steps.

---

### Finding 22: User model missing enum constraint on role field and trim applied to password.

**Severity: Medium**

**Location:** `backend/src/models/user.js`

**Sources:**
- [Mongoose Schema Validation](https://mongoosejs.com/docs/validation.html)
- [CWE-20: Improper Input Validation](https://cwe.mitre.org/data/definitions/20.html)

**Description:** The user model schema has two security-relevant issues:

**Issue 1: No enum constraint on role field:**

  ```js
  role: {
    type: String,
    required: true,
    trim: true
    // Missing: enum: ['BASIC', 'CONS', 'AUTHOR', 'ADMIN'].
  }
  ```

  The `role` field accepts any string value with no validation at the database layer. Other models in the same codebase correctly use `enum` constraints on sensitive fields (`adSchema.position`, `postSchema.category`), but this pattern was not applied to the security-critical `role` field. A database-layer enum would provide defense-in-depth against arbitrary role injection even if controller validation is bypassed.

**Issue 2: Trim applied to password field:**

  ```js
  password: {
    type: String,
    required: true,
    trim: true  // Silently modifies passwords with spaces.
  }
  ```

  `trim: true` silently strips leading and trailing whitespace from passwords before storage. This modifies user-supplied passwords without their knowledge, reduces effective password keyspace and creates inconsistent behavior if the authentication flow does not apply the same trimming.

**Impact:**
- Missing role enum allows arbitrary role strings to be stored, compounding Finding 21.
- Password trimming silently weakens passwords containing spaces and creates potential authentication inconsistencies.

**Recommendation:**

```js
role: {
    type: String,
    required: true,
    enum: ['BASIC', 'CONS', 'AUTHOR', 'ADMIN'],
    default: 'BASIC'
},
password: {
    type: String,
    required: true
    // Remove trim: true
}
```

---

### Finding 23: Unvalidated user input passed to RegExp constructor | ReDoS and regex injection.

**Severity: High**

**Location:** `backend/src/controllers/post/search-by-title.js`, `backend/src/controllers/post/search-published-by-title.js`

**Sources:**
- [OWASP ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [CWE-1333: Inefficient Regular Expression Complexity](https://cwe.mitre.org/data/definitions/1333.html)

**Description:** User-supplied search input is passed directly to the JavaScript `RegExp()` constructor without sanitization or escaping:

```js
const { title } = request.query
const regex = new RegExp(title, 'i')  // Unsanitized user input.
postModel.find({ title: regex })
```

This creates two attack vectors:

**ReDoS:** An attacker can supply a pathologically complex regex pattern that causes catastrophic backtracking in the Node.js regex engine, blocking the event loop and making the server unresponsive for all users.

**Regex injection:** An attacker can use regex metacharacters to manipulate the search query:
  - `.*` matches all posts regardless of title.
  - `.{10000}` forces expensive pattern matching across all documents.
  - `^(a+)+$` causes catastrophic backtracking.

**Evidence:**
  
  - Test 1: Regex injection returning all posts:

  ```json
  GET /posts/search?title=.*
  => 200 OK: All 12 posts returned regardless of title.
  ```

  - Test 2: ReDoS patterns tested on small dataset:

  ```json
  GET /posts/search?title=^(a+)+$
  GET /posts/search?title=(x+x+)+y
  => 404 ReDoS not triggered on development dataset of 12 records.
  Risk increases significantly with dataset size in production.
  ```

**Confirmed:** Regex injection allows an unauthenticated attacker to bypass search intent and retrieve arbitrary post data. On a production dataset, ReDoS patterns could block the Node.js event loop causin denial of service for all users.

**Impact:**
  - Denial of service via event loop backing.
  - Unauthorized data exposure via regex manipulation.
  - Amplified by lack of rate limiting (Finding 13).

**Recommendation:**
Escape user input before passing to RegExp or use MongoDB's text search instead:

```js
const { title } = request.query

// Option 1: Escape regex metacharacters.
const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const regex = new RegExp(escapedTitle, 'i')

// Option 2: Use MongoDB text search (preferred).
postModel.find({ $text: { $search: title } })
```

---

### Finding 24: Authentication state stored in localStorage | Client-side role bypass.

**Severity: High**

**Location:** `frontend/src/App.jsx`

**Sources:**
- [OWASP HTML5 Security — Local Storage](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage)
- [CWE-922: Insecure Storage of Sensitive Information](https://cwe.mitre.org/data/definitions/922.html)

**Description:** The app stores all authentication state in `localStorage` including the user object, role, token and refresh token. On every page load, `role` is read directly from `localStorage` into application state and used by `RequireAuth` to determine route access.

```js
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
  role: localStorage.getItem("role"),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
};
```

Since localStorage is fully accessible to JavaScript running in the browser, any attacker physical access to the browser or an XSS vector can manipulate these values directly.

**EVidence: localStorage role manipulation confirmed:**

```js
// Running in browser devtools console while logged in as BASIC user:

// Step 1: Modify role and user object in localStorage:
localStorage.setItem("role", "ADMIN")
localStorage.setItem("user", JSON.stringify({
  ...JSON.parse(localStorage.getItem("user")),
  role: "ADMIN"
}))

// Step 2: Hard refresh.
// Result: UI renders as ADMIN, admin routes accessible in browser.
```

**Confirmed:** After localStorage manipulation and page refresh, a BASIC user's browser renders the full admin UI. The `RequireAuth` component grants access to all admin routes based solely on the manipulated localStorage value.

**Note:** This attack requires no server interaction and leaves no server-side audit trail. It's purely a client-side bypass and does not grant actual backend privileges on its own, however, combined with Finding 14 (broken backend role via `userrole` header), full application compromise is achieved at both layers.

**Impact:**
  - Frontend route protection via `RequireAuth` is completely bypassable.
  - MFA state (`mfaEnabled`) stored in localStorage can be disabled: `localStorage.setItem("user", JSON.stringify({...user, mfaEnabled: false}))`.
  - Refresh token stored in localStorage is vulnerable to XSS theft. Any XSS vulnerability allows permanent session hijacking.
  - Combined with Finding 14 (broken backend role check), there is no effective access control at any layer.

**Recommendation:**
  - Store refrsh tokens in `HttpOnly cookies` inaccessible to JS entirely.
  - Never store role or security-sensitive flags in localStorage.
  - Derive authentication state from the verified JWT on each request rather than from client-stored values.
  - Frontend route protection should be treated as UX only, never as a security control.

---

### Finding 25: Frontend error loggin exposes sensitive information in browser console.

**Severity: Low**

**Location:** `frontend/src/utils/refresh-token.js`

**Description:** The refresh token utility logs raw error objects to the browser console on failure:

```js
.catch(error => {
  console.error(error)  // Exposes error details in devtools
  dispatch({ type: LOGOUT })
  navigate('/login')
})
```

In production, this exposes token refresh errors, server response details and netowrk information to anyone with browser devtools open. This extends the systemic raw error logging pattern identified in Finding 19 to the frontend layer.

Additionally, any refresh failure, including server errors caused by the DoS vulnerabilities in Finding 11, silently logs out all active users with no explanation, creating a potential availability impact.

**Recommendation:**
  - Remove `console.error()` calls from production builds.
  - Use a frontend logging service (like Sentry) that captures errors server-side without exposing them in the browser.
  - Display a user-friendly error message rather than silently logging out.

## Vulnerability chains:

### Chain 1: Anonymous user to full application compromise

This chain demonstrates how an unauthenticated attacker can achieve complete administrative control of the app in three requests using only documented findings.

**Severity: Critical**

- Step 1: Create attacker account (Finding 2):

  ```json
  POST /register
  No authentication required, no vetting, account immediately active.
  => Attacker account created with role: BASIC
  ```

- Step 2: Escalate to ADMIN (Finding 21):

  ```json
  PUT /user/<attacker_id>/update
  Authorization: Bearer <attacker_token>
  { "role": "ADMIN" }
  => Role updated to ADMIN in database
  ```

- Step 3: Access all admin endpoints (Finding 14):

  ```
  GET /admin/users
  Authorization: Bearer <attacker_token>
  userrole: ADMIN
  => Full user list returned including all PII
  => Any user can be deleted
  => Any content can be modified or deleted
  ```

**Total time to full compromise:** under 60 seconds
**Prerequisites:** None. Internet access only.

**Findings involved:**
- Finding 2 — Unauthenticated open registration
- Finding 21 — Mass assignment privilege escalation
- Finding 14 — Broken role-based access control
- Finding 5 — MongoDB exposed to internet (enables direct DB access once credentials obtained)


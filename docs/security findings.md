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

### Finding 1: Credentials exposure risk mitigated by proper `.gitignore` discipline.

**Severity: Low / Informational**

**Location:** `backend/.gitignore`, `backend/.env`, `frontend/.gitignore`, `frontend/.env`

**Description:** Despite the repository being public on Github since 2023, the `.env` file containing production credentials was never committed to version control. Git history search confirms no credential strings appear in any of the 80+ commits. The `.gitignore` correctly excluded `.env` throughout the project lifecycle.

**Residual risk:** 

The repo is still public and contains full application source code, which reveals the structure of the project.

The `.env` file exists locally with credentials that have been unrotated since 2023. Standard hygiene would suggest rotating them regardless.

<hr />

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

<hr />

### Finding 3: HTTP/HTTPS port configuration - Development vs production separation.

**Severity: Informational**

**Location:** `backend/.env`

**Description:** Port 3000 is used for local development and port 443 was activated for production deployment.

This is actually a correct practice: Production used port 443 (HTTPS) while local development ran on 3000.

TLS termination in production was either handled by Heroku's built-in SSL (which it provides automatically on all dynos) or a custom certificate. Since the app is deprecated this is hard to verify retroactively, but Heroku's default behaviour would have provided TLS, so this is likely a non-issue.

<hr />

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

<hr />

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

<hr />

### Finding 6: Default MongoDB port.

**Severity: Informational**

**Location:** `backend/.env`

**Description:** Default port in use means no port obfuscation. Not a control, but worth noting in the context of the Atlas exposure surface above.

<hr />

### Finding 7: Environment variable separation.

**Severity: N/A - Positive control**

**Location:** `.gitignore`, `backend/.env`, `frontend/.env`, `frontend/src/config.js`, git history

**Description:** Credentials and API keys are consistently excluded from version control across the project. Both `.env` files and `config.js` (which contains hardcoded API keys) are explicitly listed in `.gitignore` across frontend and backend. Git history confirms no credential strings in any commits. This reflects deliberate secrets management discipline rather than accidental omission.

<hr />

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

<hr />

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

<hr />

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

<hr />

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


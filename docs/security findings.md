# Security findings

## Audit priority

- [x] 1 | `backend/.env` | Secrets, credentials, JWT key strength
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

### Finding 1: Credentials exposure risk mitigated by proper `.gitignore` discipline.

**Severity: Low / Informational**

**Description:** Despite the repository being public on Github since 2023, the `.env` file containing production credentials was never committed to version control. Git history search confirms no credential strings appear in any of the 80+ commits. The `.gitignore` correctly excluded `.env` throughout the project lifecycle.

**Residual risk:** 

The repo is still public and contains full application source code, which reveals the structure of the project.

The `.env` file exists locally with credentials that have been unrotated since 2023. Standard hygiene would suggest rotating them regardless.

### Finding 2: Weak JWT secret likely insufficient entropy, used without processing.

**Severity: High**

**Description:** The JWT secret is 88 characters of mixed alphanumeric and has two issues:

- It appears manually typed rather than cryptographically generated. A proper secret should come from `crypto.randomBytes(64).toString('hex')` which produces 128 hex characters with guaranteed entropy.

- The variable is named `JWT_KEY`. As it being used as the HMAC secret without any processing, key length and entropy are the only protections.

**Impact:** If this secret is known, an attacker can forge arbitrary JWTs, impersonate any user including admins and bypass all authentication.

**Recommendation:** 

- Rotate immediately.

- Generate properly `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.

- Consider RS256 (asymmetric) instead of HS256: The private key signs, the public key verifies, so even if the verification key leaks, tokens can't be forged.

### Finding 3: HTTP/HTTPS port configuration - Development vs production separation.

**Severity: Informational**

**Description:** Port 3000 is used for local development and port 443 was activated for production deployment.

This is actually a correct practice: Production used port 443 (HTTPS) while local development ran on 3000.

TLS termination in production was either handled by Heroku's built-in SSL (which it provides automatically on all dynos) or a custom certificate. Since the app is deprecated this is hard to verify retroactively, but Heroku's default behaviour would have provided TLS, so this is likely a non-issue.

### Finding 4: MongoDB weak password and unrotated credentials.

**Severity: Medium**

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

### Finding 4b: MongoDB Atlas configured to allow connections from any IP address.

**Severity: High**

**Description:** The MongoDB Atlas cluster was configured with a network access rule of `0.0.0.0/0` during its entire production lifetime. This setting was confirmed active in the Atlas dashboard post-deprecation.

**Evidence:**
- Atlas IP Access List entry: `0.0.0.0/0` — Status: Active
- No IP restriction rules present

**Impact:** Combined with Finding 4 (weak database password), this means the database was fully exposed to the internet with no network-layer protection. Any attacker with the credentials could connect directly to MongoDB from anywhere in the world without needing to compromise the application server first. 

**Recommendation:** In future projects, restrict Atlas network access to specific server IPs only. For dynamic infrastructure, use VPC peering or Atlas Private Endpoints rather than allowlisting `0.0.0.0/0`.

### Finding 5: Default MongoDB port.

**Severity: Informational**

**Description:** Default port in use means no port obfuscation. Not a control, but worth noting in the context of the Atlas exposure surface above.

### Finding 6: Environment variable separation.

**Severity: N/A - Positive control**

**Description:** The fact that all credentials are in environment variables rather than hardcoded in source files is worth mention as a positive control. The git history confirmed this - no credential string appeared in 80+ commits.

### Finding 7: Security controls added retroactively — TO DO

### Finding 8: JWT PII exposure in token payload — TO DO

### Finding 9: No token revocation mechanism — TO DO
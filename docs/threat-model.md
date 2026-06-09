# Application threat model (STRIDE)

## System architecture and data flow

This application operates across three distinct operational layers. Security boundaries dictate that all client-side operations are treated as entirely untrusted, establishing the backend Express engine as our primary trust perimeter.

**Trust perimeters and boundaries:**

1. **Client-side vector:** The Firebase-hosted React UI. This layer is exposed directly to the user and is considered fully untrusted.
2. **API gateway:** The perimeter where incoming HTTP requests cross into the backend Express runtime. This is the first true boundary where security controls are actively enforced.
3. **Persistent data storage:** The secure channel linking the Express backend to the MongoDB Atlas cluster over encrypted TLS connections.

---

## STRIDE core threat analysis

A structured threat assesment was performed against the application's primary attack vectors using the Microsoft STRIDE model.

### 1. Spoofing (Identity):

- **Threat scenario:** Adversaries bypass local applications routers or forge identity contexts to access restricted management mechanisms whitout valid verification.
- **Remediation result:** Closed the gate on **Finding 15** by injecting the core signature check validation (`checkUserCredentials()`) directly into the backend routing chain to drop unauthenticated anonymous traffic.

### 2. Tampering (Data integrity):

- **Threat scenario:** Adversaries inject unauthorized client-side scripts (XSS) to hijack user sessions or modify incoming parameters to bypass strict database validation rules.
- **Remediation result:** Resolved **Finding 12** by implementing a protective `Content-Security-Policy` (CSP) via Firebase Hosting configuration to block arbitrary script execution and prevent local token theft.

### 3. Repudiation (Audit trial/Non repudiation):

- **Threat scenario:** High-privilege actions, destructive database operations or system errors occur without generating an unalterable, structured trace log, making it impossible to establish an immutable timeline.
- **Remediation result:** Established clear technical architectural guidelines for upgrading native `console.log` statements to a dedicated, write-restricted logging facility reserved strictly for administrators and forensic auditors.

### 4. Information disclosure (Confidentiality):

- **Threat scenario:** Exposure of underlying database configuration states, environment credentials or open exposure of backend endpoints allows malicious actors to harvest proprietary financial datasets or PII.
- **Remediation result:** Closed the wide-open access loophole on `/api/preoffers` and rotated legacy, low-entropy cloud database credentials (**Finding 4**) to completely lock down the confidentiality of the persistent layer.

### 5. Denial of Service (Availability):

- **Threat scenario:** Unhandled system exceptions leaking raw stack traces, port mappings and internal server paths, allowing an attacker to map out infrastructure specifics and target automated resource exhaustion attacks against the system.
- **Remediation result:** Hardened runtime environment variables and mapped out future sprint milestones to capture raw exceptions before they leak details to public consumers.

### 6. Elevation of privilege (Authorization):

- **Threat scenario:** A basic authenticated user alters parameters inside a malicious JSON payload (for example, executing a mass-assigment injection changing their status to `"role": "ADMIN"`) to gain administrative control over the backend.
- **Remediation result:** Patched **Finding 22** by writing strict backend-layer schema constraints to drop unauthorized authority modificaions at the database.
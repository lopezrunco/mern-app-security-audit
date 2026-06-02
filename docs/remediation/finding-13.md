## Remediation Finding 13

**Status:** Fixed

**Fix date:** 2026-06-02

**What was changed:**

The core Express application bootstrap entry point in `backend\src\api.js` was refactored to replace weak network defaults and introduce critical missing defensive layers.

- **Wildcard CORS elimination:** The unregulated `cors()` configuration was restricted to selectively authorize incoming requests solely originating from the designated `FRONTEND_URL` environment variable, explicitly defining safe HTTP tracking verbs and allowed request headers.

- **Request limitation policies:** A global payload ceiling of `10kb` was enforced on incoming JSON streams to block memory-exhaustation attacks. Concurrently, a request rate limiter throttling inbound connections to maximum of 100 requests per 15-minute windows was bound to the routing engine.

- **Header hardening:** The `helmet` middleware suite was integrated globally to systematically inject standard browser security headers.

- **Log sanitization:** Raw database configuration errors were decoupled from direct engine outputs to prevent database connection configurations or infrastructure details from being exposed via stack traces.

**Files modified**

- `backend\src\api.js`

**Code change:**

**Before**

```js
const express = require('express')
const cors = require('cors')
const getDbConnectionString = require('./utils/get-db-connection-string')
const routes = require('./routes')

const app = express()

app.use(cors())         // => No origin restriction.
app.use(express.json()) // => No size limit.
app.use('/', routes)    // => No rate limiting. No helmet.

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT)
        console.log('Connected to database.')
    }).catch(error => {
        console.error('Could not connect to the database => ', error)
    })
```

**After**

```js
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const getDbConnectionString = require('./utils/get-db-connection-string')
const routes = require('./routes')

const app = express()

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
app.use('/', routes)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT)
        console.log('Connected to database.')
    }).catch(error => {
        console.error('Database Connection Error: Failed to establish connection securely.')
    })
```

**Retest result:**

Comprehensive network perimeter and behavioral testing was conducted locally using a combination of automated shell scripts, browser runtime execution environments and API clients to validate the enforcement of the new security controls.

Validation confirmed that:

- **Security headers (Helmet):** Inspection of outbound HTTP response payloads confirmed the active injection of standard security-hardening headers, ensuring systemic resistance to MIME-sniffing and cross-context interface framing.

- **Payload constraint enforcement:** Transmitting a synthetic JSON entity stream exceeding the `10kb` limiting successfully forced the Express body-parsing engine to terminate processing immediately, preventing potential heap memory exhaustion.

- **Rate limiting defense:** Simulating an automated script-driven traffic burst via a rapid loop script successfully tripped the transaction ceiling, prompting the backend to temporarily drop excess connections and isolate the incoming IP footprint.

- **Cross Origin validation (CORS):** Attempting to execute unauthorized cross orogin API fetches from an unlisted domain via the browser console triggered an immediate CORS runtime restriction, neutralizing unauthorized cross site data extraction vectors.

---

![Perimeter response headers verify active Helmet protections](./screenshots/helmet%20security%20headers%20active.jpg)

*Perimeter response headers verify active Helmet protections.*

![Large payload rejected with an HTTP 413 Payload too large](./screenshots/payload%20limit%20blocks%20large%20json.jpg)

*Large payload rejected with an HTTP 413 Payload too large.*

![Automated request floods throttled with a Too many requests error](./screenshots/rate%20limiting%20throttles%20traffic.jpg)

*Automated request floods throttled with a Too many requests error.*

![Browser console simulation confirms cross-origin fetch actions from unauthorized external contexts are intercepted and dropped by native client-side CORS verification.](./screenshots/cors%20blocks%20unauthorized%20origin.jpg)

*Browser console simulation confirms cross-origin fetch actions from unauthorized external contexts are intercepted and dropped by native client-side CORS verification.*
## Remediation Finding 15

**Status:** Fixed

**Fix date:** 2026-06-08

**What was changed:**

The access control configuration governing pre-auction transaction records was hardened to eliminate unauthorized data harvesting vectors.

**Files modified**

- `backend/src/routes/preoffers.js`

**Code change:**

**Before**

```js
router.post('/preoffers', getAllPreoffers)
```

**After**

```js
router.post('/preoffers', checkUserCredentials(), checkUserRole(['ADMIN', 'CONS', 'BASIC']), getAllPreoffers)
```

**Retest result:**

The endpoint was re-tested end-to-end via Insomnia. The validation confirmed that:

- Issuing an anonymous data harvest query to the endpoint with no session token headers attached results in an immediate intercept by the security gateway, returning a `401 Unauthorized` status response.

    ![Insomnia diagnostic capture confirming rejection of anonymous traffic with a 401 Unauthorized state.](./screenshots/POST%20request%20to%20preoffers%20with%20no%20headers%20returns%20401.jpg)

    *Insomnia diagnostic capture confirming rejection of anonymous traffic with a 401 Unauthorized state.*

- Attaching a valid, server-signed session authorization token passes the gatewat checks successfully, allowing normal database query execution and returning a `200 OK` response.

    ![Insomnia validation capture verifying authorized data retrieval following successful cryptographic signature validation.](./screenshots/POST%20request%20to%20preoffers%20with%20auth%20token%20returns%20200.jpg)

    *Insomnia validation capture verifying authorized data retrieval following successful cryptographic signature validation.*


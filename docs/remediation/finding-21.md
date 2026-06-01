## Remediation Finding 21

**Status:** Fixed

**Fix date:** 2026-06-01

**What was changed:**

The object-binding logic across all resource update controllers was entirely refactored to neutralize application-wide Mass Assignment vulnerabilities (CWE-915).

Previously, these endpoints passed the unvalidated `request.body` directly into Mongoose's `doc.set()` method, allowing users to modify unauthorized structural, relational or administrative properties. The remediation replaces this with a strict whitelisting architecture using `Object.fromEntries()`. Each controller now explicitly defines an array of mutable properties (`allowedFields`), stripping out any unexpected keys or privilege escalation vectores (such as `role` in users, or `userId` in preoffers) before modifications are commited to the database.

**Files modified**

- `backend\src\controllers\ad\update.js`

- `backend\src\controllers\event\update.js`

- `backend\src\controllers\lot\update.js`

- `backend\src\controllers\post\update.js`

- `backend\src\controllers\preoffer\update.js`

- `backend\src\controllers\user\update.js`

**Code change:**

The `user/update.js` controller is shown as the primary architectural representative for this fix.

**Before**

```js
user.set(request.body)
user.save()
```

**After**

```js
const allowedFields = ['nickname', 'phone', 'address', 'telephone']
const updateData = Object.fromEntries(Object.entries(request.body).filter(([key]) => 
    allowedFields.includes(key)
))
user.set(updateData)
user.save()
```

**Retest result:**

All 6 affected update endpoints were re-tested using Insomnia after deploying the remediation to confirm complete data integrity validation.

- User profile (`PUT /user/:id/update`): Replaying the 3-ste privilege escalarion explit confirmed that injecting `{ "role": "ADMIN" }` is discarded. Subsequent authentication responses verify the test user account remains restricted to the `BASIC` role.

- Ad, Event, Post, Lot and Preoffer updates: Testing unvalidated parameters confirmed that fields outside the explicit whitelist are dropped safely. Permitted modifications continue to execute successfully with a `200 OK` response.

---

![Step 1: Unauthenticated user registration successfully creates a baseline BASIC account.](./screenshots/attacker%20registers%20basic%20account.jpg)

*Step 1: Unauthenticated user registration successfully creates a baseline BASIC account.*

![Step 2: Attacker attempts to inject the role modification parameter via mass assignment.](./screenshots/attacker%20tries%20to%20update%20own%20role%20to%20admin.jpg)

*Step 2: Attacker attempts to inject the role modification parameter via mass assignment.*

![Step 3: Subsequent login response confirms the account role remains restricted to BASIC, proving the remediation works.](./screenshots/login%20confirms%20escalation%20failed.jpg)

*Step 3: Subsequent login response confirms the account role remains restricted to BASIC, proving the remediation works.*
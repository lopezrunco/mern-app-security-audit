## Remediation Finding 22

**Status:** Fixed

**Fix date:** 2026-06-08

**What was changed:**

The Mongoose data access layer configuration inside the User model was updated to enforce strict type contraints and preserve cryptographic input integrity.

- **Database-layer role enlistment:** An `enum` constraint was applied directly to the security-critical `role` schema field, explicity whitelisting the permitted privilege tiers: `['BASIC', 'CONS', 'AUTHOR', 'ADMIN']`. A default `BASIC` parameter was also implemented to ensure a fail-safe posture for unclassified account sign-ups. This establishes defense-in-depth, guarateeing that invalid or spoofed role injections are instantly rejected at the persistent layer even if upstream controller validation fails.

- **Password entropy preservation:** The `trim: true` modifier was removed from the `password` field definition. This ensure that user-defined passwords containing white spaces are preserved without trunctation, maintaining the user's intended keyspaces and preventing authentication behavior mismatches. 

**Files modified**

- `backend/src/models/user.js`

**Before**

```js
role: {
    type: String,
    required: true,
    trim: true
},
password: {
    type: String,
    required: true,
    trim: true
}
```

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
}
```

**Retest result:**

The user validation constraints were re-tested locally issuing targeted raw JSON payloads via API diagnostic queries.

Validation confirmed that: 

- Forcing an invalid registration payload matching `{ "role": "ATTACKER" }` fails immeiately, triggering a core database validation exception indicating that the parameter is not a recognized enum option.

    ![Mongoose validation failure confirming rejection of arbitrary role payload string.](./screenshots/attacker%20is%20not%20a%20valid%20enum%20value%20for%20path%20role.jpg)

    *Mongoose validation failure confirming rejection of arbitrary role payload string.*

- Authentication routines properly verified a user account generated with leading/trailing password spaces (`"   supersecret   "`), validating that characters are no longer stripped out invisibly during hadh evaluations.

    ![Successful authorization transaction verifying retention of original password whitespaces.](./screenshots/logged%20in%20with%20a%20password%20with%20spaces.jpg)

    *Successful authorization transaction verifying retention of original password whitespaces.*


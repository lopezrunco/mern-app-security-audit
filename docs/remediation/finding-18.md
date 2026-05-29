## Remediation Finding 18

**Status:** Fixed

**Fix date:** 2026-05-29

**What was changed:**

The JWT generation logic in `backend\src\utils\create-token.js` was updated to include the authenticated user's `role` within the signed token payload.

Previously, `check-user-credentials.js` attempted to populate `request.user.role` from `decoded.role`, but the JWT payload did not contain a `role` claim. As a result `request.user.role` was always `undefined`, preventing authorization middleware from reliably enforcing role-based access control.

The remediation ensures the role is now embedded into newly issued access and refresh tokens.

**Files modified**

- `backend\src\utils\create-token.js`

**Code change:**

**Before**

```js
return jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    type: tokenType
}, process.env.JWT_KEY, { expiresIn })
```

**After**

```js
return jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    type: tokenType
}, process.env.JWT_KEY, { expiresIn })
```

**Retest result:**

The issue was re-tested using Insomnia after deploying the remediation.

Validation confirmed that:
- Newly issued JWTs now contain a valid `role` claim.
- `check-user-credentials.js` correctly populates `request.user.role` from the verified JWT payload.
- The original PoC condition `request.user.role === undefined` could no longer be reproduced.

Server-side debug output confirmed the following duing authenticated requests:

![Decoded JWT output and request.user output](./screenshots/decoded%20jwt%20output%20and%20request%20user%20output.jpg)

*Decoded JWT output and request.user output*
## Remediation Finding 2

**Status:** Fixed

**Fix date:** 2026-06-01

**What was changed:**

The manually typed `JWT_KEY` was deprecated. A cryptographically secure 256-but key (128 hec characters) was generated using Node.js `crypto.randomBytes(64)`. The environment configuration was updated to `JWT_SECRET` and both `create-token` and `check-user-credentials.js` were refactored to utilize the high-entropy secret, completely mitigating offline token-forgery risks.

**Files modified**

- `backend\.env`

- `backend\src\middlewares\check-user-credentials.js`

- `backend\src\utils\create-token.js`

**Code change:**

`backend\src\utils\create-token.js`:

**Before**

```js
return jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
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
}, process.env.JWT_SECRET, { expiresIn })
```

`backend\src\middlewares\check-user-credentials.js`:

**Before:**

```js
const decoded = jwt.verify(token, process.env.JWT_KEY)
```

**After:**

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

**Retest result:**

The authentication routine was fully re-tested using Insomnia to confirm successful end-to-end token validation with the new crypthographic secret:

- Token issue test: A login request was executed successfully against `POST /login`. The server generated and issued a new access token signed with the 128-character high-entropy `JWT_SECRET`.

- Token verification test: The newly issued token was sent inside the `Authorization` header to a protected endpoint. The server parsed, cryptographically validated and accepted the signature seamlessly, returning a `200 OK` authenticated response.

- Legacy rejection test: Attempting to authenticate using an older token generated with the compromised `JWT_KEY` string was correctly rejected by the server, proving the old signing secret has been completely invalidated.
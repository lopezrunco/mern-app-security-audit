## Remediation Finding 14

**Status:** Fixed

**Fix date:** 2026-05-29

**What was changed:**

The `checkUserRole` authorization middleware in `app\backend\src\middlewares\check-user-role.js` was entirely rewritten to eliminate reliance on client-controlled input.

Previously, the middleware trusted a client-supplied HTTP header named `userrole` to make access control decisions, allowing an attacker to trivially bypass Role-Based Access Control (RBAC). The remediation replaces this logic with a secure, server side database lookup. The middleware now extracts the trusted user ID from the authenticated request object and queries the database directly to fetch and verify the user's actual role.

**Files modified**

- `backend\src\middlewares\check-user-role.js`

**Code change:**

**Before**

```js
module.exports = (roles) => {
    return (request, response, next) => {
        const userRole = request.headers['userrole']

        if (userRole) {
            const roleMatches = roles.find(role => role === userRole)

            if (roleMatches) {
                next()
            } else {
                return response.status(403).json({
                    message: 'Forbidden access'
                })
            }
        } else {
            return response.status(401).json({
                message: 'Invalid credentials'
            })
        }
    }
}
```

**After**

```js
const { userModel } = require('../models/user')

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

**Retest result:**

The issue was re-tested using Insomnia after deploying the remediation.

Validation confirmed that:
- The server now completely ignores the client-supplied `userrole: ADMIN` HTTP header.
- Privileged endpoint like administrative user listing (`GET /admin/users`) and resource deletion (`DELETE /admin/users/<target_id>`) securely validate the true account permissions against the database.
- The original PoC exploit conditions no longer work. Replaying the attacks with a `BASIC` user account token now correctly triggers a `403 Forebidden access` response, maintaining application data integrity and confidentiality.

---

![Attacker creates a new account](./screenshots/attacker%20creates%20a%20new%20account.jpg)

*Step 1: Unauthenticated user registration successfully creates a BASIC account for validation testing.*

![Attacker listing all user gets a 403](./screenshots/attacker%20listing%20all%20user%20gets%20a%20403.jpg)

*Step 2: Unauthorized access to admin user listing is successfully blocked, returning a 403 Forbidden response despite the injected role header.*

![Attacker listing all users gets a 403](./screenshots/attacker%20listing%20all%20user%20gets%20a%20403.jpg)

*Step 3: Destructive endpoint test confirms arbitrary account deletion is completely mitigated and returns a 403 Forbidden response.*
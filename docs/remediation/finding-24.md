## Remediation Finding 24

**Status:** Partially fixed

**Fix date:** 2026-06-05

**What was changed:**

The frontend authentication state lifecycle was refactored to eliminate insecure reliance on mutable, plaintext `localStorage` parameters for authorization decisions.

Previously, the standalone `role` string key was stored inside `localStorage` upon login and read directly into the application state on page loads. This allowed client-side privilege escalation because an attacker could manipulate the `localStorage.role` value to bypass the frontend `RequireAuth` route guards.

The remediation completely removes the separate `role` tracking from `localStorage`. Instead, a client-side parsing utility function (`getRoleFromToken`) was introduced to dynamically decode the middle payload block of the cryptographically signed JSON Web Token on initialization and runtime state dispatches. Because the frontend state context now derives the user's role directly from the server-signed JWT payload, client-side tampering with local storage parameters no longer compromises the authorization layer.

**Files modified**

- `frontend/src/App.jsx`

**Code change:**

**Before**

```js
// Initial state of auth context
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
  role: localStorage.getItem("role"),
  token: localStorage.getItem("token"),
  id: localStorage.getItem("id"),
  refreshToken: localStorage.getItem("refreshToken"),
  showingLoader: false,
};

// Reducer LOGIN case
case LOGIN:
  localStorage.setItem("user", JSON.stringify(action.payload.user));
  localStorage.setItem("role", action.payload.user.role);
  localStorage.setItem("token", action.payload.user.token);
  localStorage.setItem("id", action.payload.user.id);
  localStorage.setItem("refreshToken", action.payload.user.refreshToken);

  return {
    ...state,
    isAuthenticated: true,
    user: action.payload.user,
    role: action.payload.user.role,
    token: action.payload.user.token,
    id: action.payload.user.id,
    refreshToken: action.payload.user.refreshToken,
  };
```

**After**

```js
const getRoleFromToken = (token) => {
    if (!token) return null
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.role ?? null
    } catch {
        return null
    }
}

const token = localStorage.getItem("token")

const initialState = {
  isAuthenticated: !!token,
  user: JSON.parse(localStorage.getItem("user")),
  role: getRoleFromToken(token), // Derived from JWT
  token: token,
  id: localStorage.getItem("id"),
  refreshToken: localStorage.getItem("refreshToken"),
  showingLoader: false,
};

// Reducer LOGIN case
case LOGIN:
    localStorage.setItem("user", JSON.stringify(action.payload.user));
    localStorage.setItem("token", action.payload.user.token);
    localStorage.setItem("id", action.payload.user.id);
    localStorage.setItem("refreshToken", action.payload.user.refreshToken);

    return {
    ...state,
    isAuthenticated: true,
    user: action.payload.user,
    role: getRoleFromToken(action.payload.user.token), // Derived from JWT.
    token: action.payload.user.token,
    id: action.payload.user.id,
    refreshToken: action.payload.user.refreshToken,
    };
```

**Retest result:**

The issue was re-tested using browser developer tools and an injection payload to simulate a client-side role manipulation attack.

Validation confirmed that:

- Forcing `"role": "ADMIN"` inside the `localStorage` user profile JSON object while logged as `BASIC` user, no longer triggers an authorizarion bypass.

- Upon a hard refresh, the `App.jsx` initialization logic ignored the manipulated local storage profile properties, executing `atob()` on the `token` string to pull the original backend-signed claim (`BASIC`).

- Direct navigation to administrative endpoints (`http://localhost:5173/admin`) was successfully blocked by the client-side `RequireAuth` guard, automatically redirecting the unauthorized session context to the 403 page.

![Successful rejection of client-side role manipulation resulting in a 403 Forbidden redirect.](./screenshots/rejection%20of%20client%20side%20role%20manipulation.jpg)

*Successful rejection of client-side role manipulation resulting in a 403 Forbidden redirect.* -->

---

**Residual risk & Recommendation note:**

This remediation addresses the immediate frontend role manipulation exploit vector. However, storing active tokens (`token` and `refreshToken`) in `localStorage` remains a residual risk as they are still vulnerable to extraction via potential XSS vectors. A complete structural fix will require an architectural overhaul to migrate session state management away from `localStorage` to secure, server-side `HttpOnly` and `SameSite` cookies.

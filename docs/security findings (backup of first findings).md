# Security findings

## Finding 1: MFA disabled at Frontend reducer.

**Severity: High**

**Description:** The `ENABLE_MFA` reducer is present in the codebase but the MFA enforcement logic is commented out throughout the application flow, suggesting MFA was deprioritized during development and never enforced at the backend level.

**Impact:** If MFA is only toggled via frontend state flag (`localStorage`), an attacker can bypass it entirely by manipulating `localStorage` directly in the browser console (`localStorage.setItem("user", JSON.stringify({...user, mfaEnabled: false}))`) or by intercepting and modifying API responses. MFA enforced only on the client is effectively no MFA.

**Recommendation:** MFA must be validated server-side on every authenticated request or at session creation time. The backend should refuse to issue a session token unless the MFA challenge has been conpleted and verified independently of any client-supplied flag.

## Finding 2: Registration endpoint exposed despite Frontend suppression.

**Severity: High**

**Description:** The `/register` route and its associated UI elements are commented out in the React frontend, suggesting an intent to restrict registration. However, the underlying backend endpoint remains active.

**Impact:** Any actor who discovers the endpoint (via directory brute-forcing, JS bundle analysis or source code review) can register accounts without restriction. This completely bypasses the intended access control.

**Recommendation:** Registration should be controlled at the API layer, either by disabling the route entirely in Express, adding an invite/admin-only gate or enforcing rate limiting and CAPTCHA. 

**Evidence:**

![Register endpoint exposed](./screenshots/register%20endpoint%20exposed.jpg)

The screenshot shows a HTTP request in Insomnia to the register endpoint.
The account was created with no authentication, no email verification, no CAPTCHA, no rate limiting.
The frontend supression is entirely ineffective.

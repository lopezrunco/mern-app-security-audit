## Remediation Finding 27

**Status:** Fixed

**Fix date:** 2026-06-02

**What was changed:**

The client-side post rendering components were updated to enforce strict context sanitization using `DOMPurify`.

Previously, the public page (`PostById`) and the author dashboard component (`Card`) rendered raw blog content directly into the DOM via React's `dangerouslySetInnerHTML` attribute without any data scrubbing or neutralizarion layer. This allowed an attacker to execute arbitrary JS (Stored XSS) inside the browser session of any visitor loading the infected article.

To resolve this safely, `DOMPurify` was integrated to sanitize all HTML data feeds immediately prior to DOM insertion, cleanly stripping execution strings, malicious event handlers (like `onerror`), and scripts.

**Files modified**

- `frontend\src\pages\author-backoffice\MyPostById\components\Card\index.jsx`
- `frontend\src\pages\blog\PostById\index.jsx`

**Code change:**

**Before**

```js
// frontend\src\pages\author-backoffice\MyPostById\components\Card\index.jsx
<div dangerouslySetInnerHTML={{ __html: myPost.content }} />

// frontend\src\pages\blog\PostById\index.jsx
<div dangerouslySetInnerHTML={{ __html: content }} />
```

**After**

```js
// frontend\src\pages\author-backoffice\MyPostById\components\Card\index.jsx
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(myPost.content) }} />

// frontend\src\pages\blog\PostById\index.jsx
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

**Retest result:**

Dynamic source-code evaluation, application navigation and input manipulation assessments were conducted locally across frontend and backend environments to verify the mitigation.

Validation confirmed that:

- **Client-side document context isolation:** Injectiong a weaponized Stored XSS payload string (`<img src=x onerror=alert('XSS_VULNERABILITY_EXECUTED')>`) no longer executes arbitrary JS code or opens unexpected windows within the browser application.

- **Layered Defense-in-Depth verification:** Inspection of the active browser DOM tree via devtools confirmed that the payload is safely isolated. The runtime browser strictly renders the data as literal, harmless text primitives using HTML entities (`&lt;p&gt;` and `&lt;img src=x...&gt;`).

- **Core security resilience:** The integrated `DOMPurify` routine acts as an ironclad context barrier, ensuring that even if unescaped raw data streams bypass input layers directly into MongoDB, the client layer strips executing attributes before parsing the layout.

---

![Stored XSS neutralized via DOMPurify](./screenshots/stored%20xss%20neutralized%20via%20dompurify.jpg)

*Inspecting the runtime DOM elements confirms that the execution string was eliminated and safely escaped into literal text primitives, breaking the XSS attack vector while maintaining design structure.*

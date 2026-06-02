## Remediation Finding 23

**Status:** Fixed

**Fix date:** 2026-06-02

**What was changed:**

Implemented strict input sanitization within the post title search controllers to eliminate risks associated with Regex Injection and Regular Expression Denial of Service (ReDoS).

Before compiling the user-supplied string parameter into a dynamic `RegExp` object, a string replacement mas was added to automatically escape regex control tokens (such as `.*+?^${}()|[]\`). This forces the underlying regular expression engine to evaluate all user input as strict literal strings, preventing attackers from injecting structural wildcard queries or forcing computational catastrophic backtracking paths.

**Files modified**

- `backend\src\controllers\post\search-by-title.js`
- `backend\src\controllers\post\search-published-by-title.js`

**Code change:**

**Before**

```js
const { title } = request.query
const regex = new RegExp(title, 'i')
```

**After:**

```js
const { title } = request.query
const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const regex = new RegExp(escapedTitle, 'i')
```

**Retest result:**

The original PoC vectors were rerun via Insomnia to verify functionality post-remediation.

- **Regex injection test:** Sending a wildcard string (`GET /posts/search?title=.*`) no longer matches or leakes all database entries. It safely yields a `404 Not found` reponse.

    ![Wildcard blocked](./screenshots/search%20by%20title%20wildcard%20blocked.jpg)

    *Wildcard blocked.*

- **ReDoS vector test:** Sending nested quatifier payloads (such as `GET /posts/search?title=(x+x+)+y`) is treated as a literal query, immediately responing with a clean `404 Not found`.

    ![ReDoS pattern blocked](./screenshots/search%20by%20title%20redos%20pattern%20blocked.jpg)

    *ReDoS pattern blocked.*

# Semgrep SAST Analysis | Phase 5a

## Scan configuration
- Tool: Semgrep OSS v1.168.0.
- Ruleset: --config=auto (official registry)
- Date: 07-07-2026
- Targets: legacy/backend, legacy/frontend, app/backend, app/frontend

## Results summary

| Target | Findings |
|--------|---------|
| Legacy backend | 4 |
| Legacy frontend | 2 |
| Patched backend | 4 |
| Patched frontend | 0 |

## Finding comparison: Manual vs Automated coverage

| Semgrep Finding | Severity | Manual Finding | Status |
|----------------|----------|---------------|--------|
| CSRF middleware missing | INFO | Not in original report | New finding |
| ReDoS — search-by-title.js | WARNING | Finding 23 | Confirmed |
| ReDoS — search-published-by-title.js | WARNING | Finding 23 | Confirmed |
| ReDoS — get-by-user-id-and-title.js | WARNING | Finding 23 (partial) | Gap identified |
| dangerouslySetInnerHTML — MyPostById | WARNING | Finding 27 | Confirmed |
| dangerouslySetInnerHTML — PostById | WARNING | Finding 27 | Confirmed |

## Remediation validation

The patched frontend returned zero Semgrep findings, confirming that Finding 27 (dangerouslySetInnerHTML XSS) was successfully remediated. The tool-based validation provides independent confirmation of the manual fix.

## Coverage gap analysis

Semgrep identified 6 of 30 findings (20%). The 24 findings it missed include all 3 Critical vulnerabilities:

- Business logic flaws (Finding 14: Role bypass via custom header).
- Architectural security decisions (Finding 24: localStorage token storage).
- Configuration vulnerabilities (Finding 8: Cloudinary unsigned preset).
- Chained vulnerabilities requiring context (Findings 21, 18).

This confirms that automated SAST tools are effective for detecting known code patterns but cannot replace manual security review for logic-level vulnerabilities.

## New finding surfaced

Finding 31: No CSRF protection on Express API (see security-findings.md).

## Gap identified by Semgrep

Semgrep identified an instance of the ReDoS vulenrability (Finding 23) in `get-by-user-id-and-title.js` that was missed during manual remediation. THe original Finding 23 fix was applied to `search-by-title.js` and `search-published-by-title.js` but not to this third controller using the same pattern.

This demonstrates a key value of automated SAST scanning: systematic coverage across all files, catching gaps that manual review may miss when the same pattern appears in multiple locations.

**Action taken:** Regex escaping applied to `get-by-user-id-and-title.js`.
Commit: `3f1e6e0`

## Raw scan outputs

- legacy/backend/semgrep-backend-report.json
- legacy/frontend/semgrep-frontend-report.json  
- app/backend/semgrep-backend-patched-report.json
- app/frontend/semgrep-frontend-patched-report.json
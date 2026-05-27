# MERN App Security Audit

## Overview

This project is a security-focused audit and remediation of a legacy full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js).

The original application was developed during 2023 and later became deprecated. It has since been selected as the foundation for future production development, making security remediation a business requirement. 

This repository documents the complete application security lifecycle:

- Auditing the legacy codebase against real attack scenarios.
- Identifying and documenting vulnerabilities with working PoCs.
- Remediating Critical and High severity findings.
- Retesting to verify fixes are effective.
- Delivering a hardened codebase ready for future development.

## Objectives

- Reconstruct and stabilize a legacy full-stack application
- Establish a working baseline environment
- Perform structured security testing on exposed attack surfaces
- Identify common web application vulnerabilities
- Document findings in a professional security-report format
- Apply and validate security fixes
- Deliver a hardened codebase suitable as a foundation for future production development.

## Tooling

**Security testing:**
  - Insomnia
  - npm audit

**Development:** 
  - Node.js
  - React
  - MongoDB
  - VSCode

**References & assistance:**
  - OWASP Cheat Sheets
  - CWE database
  - Claude AI

## Repository Structure

```
/legacy
  /frontend   → Original frontend (unchanged snapshot)
  /backend    → Original backend (unchanged snapshot)

/app
  → Patched version of the application

/docs
  → Security findings, threat model, notes, and methodology

/reports
  → Final write-ups, vulnerability summaries, PoCs
```

## Project phases

For this project I will follow this AppSec workflow:

- [x] **Phase 1: Audit:** Structured vulnerability assessment o the legacy codebase.

- [ ] **Phase 2: Report (in progress):** Professional security findings documentation.

- [ ] **Phase 3: Remediation (starting):** Apply fixes to `/app` directory, documented per finding.

- [ ] **Phase 4: Retest (after remediation):** Verifying each fix closes the vulnerability. Re-running PoCs against the patched version.

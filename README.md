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

## How to navigate this repo

Start here:
1. [Executive Summary EN](./reports/executive-summary%20(EN).md) => one page overview of findings (English version)  
2. [Executive Summary ES](./reports/executive-summary%20(original%20ES).md) => one page overview of findings (Spanish version)
3. [Security Findings](./docs/security%20findings.md) => full technical findings with PoCs  
4. [Organizational Context](./reports/organizational%20context.md) => context and developer perspective  
5. [`/legacy`](./legacy/) => original unmodified codebase that was audited  
6. [`/app`](./app/) => patched version (remediation in progress)

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

## Audit methodology

This assessment was performed through a combination of:
  - Manual code review of backend and frontend codebase.
  - Dynamic testing using Insomnia and browser devtools.
  - Proof of concept exploitation in a local dev ebvironment.
  - Dependency analysis via `npm audit`.
  - Configuration review of Firebase, MongoDB and Cloudinary.

All vulnerabilities marked as confirmed include working reproduction steps tested against the running application locally.

## Evidence standard

Each confirmed finding includes at least one of:
  - Reproducible HTTP request/response trace.
  - Code snippet from affected source file.
  - Screenshots captured during live testing.
  - Observable impact in application state (UI or database).

## Test environment

  - Application: MERN stack legacy app (2023).
  - Node.js: v22.12.0
  - MongoDB: Atlas cluster
  - Browser: Brave and Firefox
  - API testing: Insomnia
  - Frontend build tool: Vite/REact

All test were executed in a controlled local/development environment.
No production systems were intentionally harmed during this audit.

## Repository Structure

```
/legacy (Unchanged version of the application)

/app (Patched version of the application)

/docs

/reports
```

## Project phases

For this project I will follow this AppSec workflow:

- [x] **Phase 1: Audit:** Structured vulnerability assessment o the legacy codebase.

- [x] **Phase 2: Report:** Professional security findings documentation.

- [x] **Phase 3: Remediation:** 16 of 30 findings remediated.

- [x] **Phase 4: Retest:** Verified each fix closes the vulnerability. Re-running PoCs against the patched version.

- [ ] **Phase 5: Burp Suite validation**: Passive and active scanning against legacy codebase. Repeater-based retest of remediated Critical findings. Comparison of automated vs manual finding coverage.

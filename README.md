# MERN App Security Audit

## Overview

This project is a security-focused audit and rebuild of a legacy full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js).

The original application was developed during 2023 and later became deprecated. This repository documents the process of:

- Restoring the legacy system to a working baseline
- Identifying functional and security-related issues
- Performing structured security testing
- Applying fixes and documenting remediation steps

The goal of this project is to conduct a real-world application security (AppSec) workflow on a legacy codebase.

## Objectives

- Reconstruct and stabilize a legacy full-stack application
- Establish a working baseline environment
- Perform structured security testing on exposed attack surfaces
- Identify common web application vulnerabilities
- Document findings in a professional security-report format
- Apply and validate security fixes

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

## Workflow

For this project I will follow this AppSec workflow:

- [] **Phase 1: Audit:** Find and document without touching the code.

- [] **Phase 2: Threat model & report:** Write up all the findings (`/reports`) prioritizing by severity. 

- [] **Phase 3: Remediation:** Work in `/app` fixing the findings and comuenting the changes. 

- [] **Phase 4: Retest:** Go back through the findings list and verify each fix actually closes the vulnerability. Re-run the PoCs against the patched version.  

- [] **Phase 5: Remediation report:** Document what was fixed, how, and the retest results. This will be the closing artifact. 
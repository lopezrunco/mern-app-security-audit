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
# Executive summary

## MERN Application Security audit

**Application:** Campo Eventos | Live Livestock Auction Platform
**Audit period:** May 2026
**Auditor:** Damián López Runco (original developer)
**Report version:** 1.0

## Overview

This report presents the findings of a structured security audit conducted on a legacy MERN stack web application originally built in 2023 to support live livestock auction broadcasts in Uruguay. The application was developed for Campo TV and the auctions were broadcast through Uruguayan channels VTV and Campo TV during its active period.

Following a change of ownership at CampoTV, the project was paused and later deprecated. However the codebase has been retained as a foundation for potential future development, making this security audit a business requirement before any reuse.

During the active development period, a security review was proposed to management but was not approved due to budget constraints. This decision, common in time-pressured projects, is a primary contributing factor to the vulnerabilities documented in this report. It's documented here not to assign blame but to illustrate how organizational decisions directly translate into technical risk and why security investment at the development stage is significantly less expensive than remediation after the fact.

The potential future application would serve rural livestock auction offices across Uruguay, handling sensitive financial and client data for agricultural businesses.

The audit was conducted by the original developer of the application, providing unique insight into both the technical implementation and the organizational conditions that produced the identified vulnerabilities.

## Key finding

**Any person with internet access could gain complete administrative control of this application in under 60 seconds, with no prior knowledge of the system.**

This was confirmed through live testing. The steps required are:
1. Create a free account (registration is open to anyone)
2. Send one request to promote that account to administrator.
3. Access all user data, delete accounts and modify any content.

No special tools, technical expertise or insider knowledge are required.

## Risk summary

The audit identified **30 security findings** including:

| Severity | Count | Business meaning |
|----------|-------|-----------------|
| Critical | 3 | Immediate, confirmed exploitable risk |
| High | 11 | Significant risk requiring urgent attention |
| Medium | 7 | Important issues to address before production |
| Low / Informational | 9 | Minor issues and process observations |

Three complete attack chains were demonstrated with working proof of concept evidence:

**Chain 1: Full platform takeover:** An anonymous internet user can become a platform administrator in three requests, gaining the ability to read all user personal data, delete any account and modify all content.

**Chain 2: Malicious file delivery to all visitors:** An attacker with administrator access can upload a malicious file disguised as an event image. That file is then served to every visitor of the platform, potentially executing malicious code in their browsers.

**Chain 3: Mass session hijacking via blog posts:** An attacker can publish a blog post containing hidden malicious code. Every visitor who reads the post has their login credentials silently stolen, giving the attacker access to their accounts.

## Data at risk

During its production lifetime, the application stored the following user data:
- Full names and nicknames
- Email addresses
- Phone numbers
- Physical addresses
- Auction pre-offer amounts and bidding history
- Account credentials (passwords)

The database was publicly accessible from any IP address on the internet throughout the entire production period with no network-layer restrictions.

## Root causes

The vulnerabilities in this application share common root causes:

1. **Security controls added too late:** Authentication and authorization were retrofitted after the core app was built, creating gaps that were never fully closed.

2. **Business pressure over security investment:** Multiple security features were explicitly disabled or deferred to meet delivery deadlines, with intent to restore them that was never fulfilled.

3. **Inherited insecure patterns:** Several vulnerabilities reflect development practices taught during formal education that appear correct but contain fundamental security flaws.

4. **No security review process:** The absence of code review, automated security scanning or security testing allowed vulnerabilities to accumulate undetected across 80+ commits over two years.

## Before this codebase can be reused

The following must be resolved before this application is used as the foundation for any new development:

| Priority | Issue | Risk if ignored |
|----------|-------|----------------|
| 1 | Fix broken authorization system | Any user becomes admin |
| 2 | Fix mass assignment on user updates | Instant privilege escalation |
| 3 | Restrict open registration | Uncontrolled account creation |
| 4 | Add role to JWT token | Authorization permanently broken |
| 5 | Fix CORS configuration | Cross-site attacks enabled |
| 6 | Update all dependencies | 101 known vulnerabilities |
| 7 | Move auth tokens out of localStorage | Session theft via XSS |
| 8 | Add input validation to update endpoints | Data integrity compromise |
| 9 | Sanitize HTML before rendering | Stored XSS on public pages |
| 10 | Route file uploads through backend | Malicious file delivery |

## What was done right

Not all findings are negative. The audit identified several deliberate security practices worth preserving in future development:

- Credentials were never committed to version control despite the repository being public.
- Sensitive fields (passwords, MFA secrets) are correctly excluded from API responses.
- Input validation exists on all data creation endpoints.
- Database injection via ID parameters is implicitly prevented by the Mongoose ODM.

These practices demonstrate security awareness that, with systematic application, would significantly reduce the risk profile of the rebuilt application.

## Recommendation

This codebase **should not be used in production in its current state.** The critical findings represent confirmed, exploitable vulnerabilities.

The remediation roadmap in the organizational context document provides a prioritized list of fixes. Once critical and high findings are resolved and verified through retesting, the codebase will provide a solid foundation for future development.

Full technical findings are documented in `security-findings.md`.

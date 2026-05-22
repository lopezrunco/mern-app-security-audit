## Organizational Context

This application was developed under significant time pressure with no dedicated security budget or review process. Several findings in this report reflect deliberate shortcuts taken to meet 
delivery deadlines rather than lack of security awareness.

This is a documented pattern in software development known as security debt: security controls that are deferred, disabled, or never implemented due to business constraints. Like technical debt, security debt compounds over time and becomes increasingly expensive to remediate.

The developer (the author of this report) was also the original developer of the application. This dual perspective, having built the system and now auditing it, provides unique insight into the  decisions made and the pressures that drove them.

## Developer perspective on Finding 14

I implemented the `checkUserRole` middleware with genuine intent to protect admin endpoints. Commit history shows it being progressively applied across the codebase as a deliberate security measure. At the time of development, the middleware appeared to function correctly in manual testing (Requests without the header were rejected with 403).

What wasn't recognized was that the header itself was client-controlled, meaning any attacker who knew the header name could supply it. The middleware was tested for the **presence and value** of a header, not for the **trustworthiness** of its source.

A control that appears to work is not the same as a control that is secure.
Security testing must go beyond **does it block normal users** to **can an attacker bypass it deliberately**.

## Post-Audit Cleanup

Upon completion of this security audit, the following actions were taken 
to ensure no residual risk remains from the deprecated application:

| Action | Service | Date |
|--------|---------|------|
| Unsigned upload preset disabled | Cloudinary | May 14, 2026 |
| Cloudinary account deleted | Cloudinary | TBD |
| MongoDB Atlas cluster deleted | MongoDB Atlas | TBD |
| Heroku application deleted | Heroku | TBD |
| GitHub repository made private or deleted | GitHub | TBD |
| JWT secret rotated | Local `.env` | TBD |
| Database password rotated | Local `.env` | TBD |
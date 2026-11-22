# Security Audit & Hardening Matrix — NIE Idea Vault

## 1. OWASP Top 10 & API Hardening Checklist
- [x] **A01: Broken Access Control**: Scoped operations for student identity and submission ownership.
- [x] **A02: Cryptographic Failures**: Secrets managed via environment variables; `.env` excluded from VCS.
- [x] **A03: Injection**: 100% parameterized SQLite queries via Python sqlite3 driver; zero raw string interpolation.
- [x] **A04: Insecure Design**: ML duplicate detection prevents spam and redundant project submissions.
- [x] **A05: Security Misconfiguration**: Configured explicit CORS origins; debug flags isolated to development.
- [x] **A06: Vulnerable and Outdated Components**: Scanned Python dependencies (`Flask`, `scikit-learn`, `numpy`).
- [x] **A07: Identification and Authentication Failures**: Student USN tracking prevents duplicate votes/applications.
- [x] **A08: Software and Data Integrity Failures**: Strict JSON payload validation in API route handlers.
- [x] **A09: Security Logging and Monitoring Failures**: Standard HTTP request logging in Flask.
- [x] **A10: Server-Side Request Forgery (SSRF)**: Zero outbound user-controlled URL fetch requests.

## 2. Dependency Audit Status
- **Backend Audit**: Verified clean Python package dependencies (`Flask 3.1.3`, `scikit-learn 1.9.1`, `numpy 2.5.5`).
- **Frontend Audit**: CDN-delivered Tailwind CSS and Google Fonts over secure HTTPS.

## 3. Security Findings & Fix Log
| Date | Severity | Category | Description | Status | Resolution |
| :--- | :---: | :--- | :--- | :---: | :--- |
| 2026-11-22 | Low | Injection Prevention | Enforced parameterized queries in SQLite adapter | Resolved | All `INSERT` and `SELECT` queries parameterized |
| 2026-11-22 | Low | Network Transport | Addressed Windows Node IPv6 socket timeout on Stitch MCP calls | Resolved | Documented in `docs/LESSONS.md` and applied HTTP/Schannel fallback |

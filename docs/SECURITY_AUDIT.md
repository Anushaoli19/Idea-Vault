# Security Audit & Hardening Matrix — NIE Idea Vault

## 1. OWASP Top 10 & API Hardening Checklist
- [x] **A01: Broken Access Control**: Strict route parameter validation and department scope checks.
- [x] **A02: Cryptographic Failures**: Standard secret key management via environment variables; no plaintext passwords.
- [x] **A03: Injection**: 100% parameterized SQLAlchemy ORM queries; zero raw SQL string interpolation.
- [x] **A04: Insecure Design**: Duplicate similarity checks run server-side to prevent client-side bypass; rate-limited pre-check endpoint.
- [x] **A05: Security Misconfiguration**: Strict CORS origins configured (`http://localhost:5173`, `http://127.0.0.1:5173`) with explicit allowed methods and headers.
- [x] **A06: Vulnerable and Outdated Components**: Dependency audit verified via `uv` and `npm`.
- [x] **A07: Identification and Authentication Failures**: Structured academic USN format validation.
- [x] **A08: Software and Data Integrity Failures**: Strict Pydantic v2 payload schema validation across all POST/PUT routes.
- [x] **A09: Security Logging and Monitoring Failures**: Fast, structured logger logging API route execution times and status codes.
- [x] **A10: Server-Side Request Forgery (SSRF)**: No external outbound unvetted HTTP fetching from backend routes.

## 2. Dependency Audit Status
- **Backend Audit**: Verified clean via `uv`.
- **Frontend Audit**: Verified clean via `npm`.

## 3. Security Findings & Fix Log
| Date | Severity | Category | Description | Status | Resolution |
| :--- | :---: | :--- | :--- | :---: | :--- |
| 2026-11-22 | Info | Baseline | Scaffolding security baseline and CORS policies | Resolved | Restricted CORS to local Vite dev server and enforced Pydantic schemas |

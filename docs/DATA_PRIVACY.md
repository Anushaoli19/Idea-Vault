# Data Privacy, Secrets & Compliance Policy — NIE Idea Vault

## 1. Sensitive Data & PII Inventory
| Data Element | Classification | Storage Location | Encryption At Rest | Masked in Logs |
| :--- | :--- | :--- | :---: | :---: |
| Student USN | Student PII | SQLite (`upvotes`, `interests`) | Plaintext (Local Dev) | No |
| Student Name | Student PII | SQLite / Client LocalStorage | Plaintext (Local Dev) | No |
| Project IP / Proposals | Intellectual Property | SQLite (`ideas`) | Plaintext | No |
| Session / Secret Keys | Secret | `.env` / Environment variables | Environment variable | Yes |

## 2. Secret Management & Zero-Leak Protocol
- **Strict Rule**: Never commit `.env` or hardcode sensitive tokens/keys in repository files.
- **Local Dev**: Configured via `.env` (sanitized template in `.env.example`).
- **Git Hygiene**: Verified `.gitignore` blocks `.env`, `*.db`, and credentials.

## 3. Input Sanitization & Integrity
- All user inputs (project titles, descriptions, role applications) are parameterized through SQLite DB adapters to prevent SQL injection.
- Frontend rendering uses text node assignments or sanitized attributes to prevent cross-site scripting (XSS).

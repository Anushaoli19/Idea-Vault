# Data Privacy, Secrets & Compliance Policy — NIE Idea Vault

## 1. Sensitive Data & PII Inventory
| Data Element | Classification | Storage Location | Encryption At Rest | Masked in Logs |
| :--- | :--- | :--- | :---: | :---: |
| Student USN | Academic Identifier | DB (`users` table) | Stored as string | No |
| Student Email | PII | DB (`users` table) | Stored as string | Masked |
| CGPA & Academic Standing | Confidential Academic | DB (`users` table) | Numeric | Masked |
| Session / Auth Tokens | Secret | Client Memory / Authorization Header | Encrypted (JWT HS256) | Yes |
| Capstone Proposals & IP | Academic Intellectual Property | DB (`ideas` table) | Standard DB Storage | No |

## 2. Secret Management & Zero-Leak Protocol
- **Strict Rule**: No real secrets, passwords, tokens, or encryption keys in source code or documentation files.
- **Local Dev**: Handled exclusively via `.env` (strictly ignored in `.gitignore`).
- **Template**: `.env.example` documents all required keys with empty or fake placeholder values.
- **Secret Scanning**: Pre-commit verification ensures staged files do not contain exposed credentials.

## 3. Authentication & Session Security
- Student session identifiers use standard Bearer token mechanisms.
- All mock auth tokens generated for development have deterministic expiration (`exp`) claims and signature verification (`HS256`).

## 4. Data Retention & Academic IP Safeguards
- **Student Data Retention**: Capstone archives are preserved for academic accreditation and prior art reference.
- **Duplicate Detection Privacy**: Vector similarity operates on anonymized problem statements and keyword tags without exposing proprietary unreleased hardware schematics to unverified viewers.

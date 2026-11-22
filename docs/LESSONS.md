# Lessons Learned & Self-Correction Log — NIE Idea Vault

Format: Append-only log recording build/test failures, unexpected edge cases, and user corrections. When a rule is reinforced multiple times, promote it to root `AGENTS.md`.

---

## [2026-11-22] — Harness Initialization & Stitch Asset Extraction
- **Trigger / What Happened**: Scaffolding the fullstack-doc-harness and unpacking the uploaded `stitch_idea_vault_platform.zip`.
- **Root Cause**: New project initialization in clean workspace `d:\vault`.
- **Fix Applied**: Extracted all 13 Google Stitch screens, configured `.gitignore` to protect environment and database secrets, and established complete living documentation in `docs/`.
- **Rule Going Forward**: Keep `.gitignore` updated with `stitch_temp/`, `.env`, and `*.db`; always verify changes with automated tests and type checks before declaring task completion.
- **Promoted to AGENTS.md**: Yes

---

<!-- Append new failure logs below -->

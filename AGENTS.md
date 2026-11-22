# Agent Directives & Project Rules

Welcome to NIE Idea Vault. This document defines operating rules, architectural invariants, code standards, and verification expectations for all AI coding agents working in this repository.

## 1. Operating Rules & Core Principles
- **Read-First Protocol**: Before proposing or modifying code, agents MUST read:
  1. `docs/CONTEXT.md` (Current project state and immediate focus)
  2. `docs/HANDOFF.md` (Last session notes, open blockers, recent commits)
  3. `docs/TASK.md` (Active phase, current in-progress task `[/]`)
  4. `docs/LESSONS.md` (Past failures, gotchas, and self-correction rules)
- **Living Documentation Sync**: Documentation is not secondary; it is code. Any architectural change, schema addition, endpoint addition, or UX workflow change MUST be reflected immediately in `docs/ARCHITECTURE.md`, `docs/USER_GUIDE.md`, and `docs/TASK.md`.
- **Zero Secret Exposure**: Never write real API keys, passwords, JWT secrets, or connection strings into markdown files, commit messages, or source code. Always use `.env` (ignored by git) and declare schemas in `.env.example`.
- **UI & UX Standard**: Adhere strictly to the Stitch Design System tokens (Primary: `#3525cd`, Primary Container: `#4f46e5`, Secondary: `#006c49`, Surface: `#f8f9ff`, Font: `Inter`). Solid, deliberate color palettes, accessible contrast, semantic HTML, and clean typography. Avoid glassmorphism, unreadable translucent blur effects, and generic template bloat.

## 2. Tech Stack & Environment
- **Backend**: Python 3.11+ / Flask REST API with SQLite3 and scikit-learn (`TfidfVectorizer` + `cosine_similarity`).
- **Frontend**: Semantic HTML5, Tailwind CSS with custom Stitch Design System theme tokens, Material Symbols, Vanilla ES6+ JavaScript.
- **Database**: SQLite3 (`idea_vault.db`) with parameterized queries.
- **Package Management**: Python virtual environment (`.venv`).

## 3. Workflow & Verification Gates
1. **Self-Correction Gate**:
   - If a test, build, lint, or runtime command fails, immediately diagnose the root cause.
   - Record the failure in `docs/LESSONS.md` with: Trigger, Root Cause, Fix, and Rule Going Forward.
   - If the rule applies universally across sessions, promote it into this file under Section 5.
2. **Milestone Verification Gate**:
   - Run automated verification scripts (`python -m pytest` or API validation scripts).
   - Verify security (parameterized queries, input validation, strict CORS).
   - Mark task `[x]` in `docs/TASK.md` with verification timestamp and notes.
3. **Commit & Push Protocol**:
   - Create focused, atomic commits following Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
   - Never run `git reset --hard` or `git push --force` without explicit user permission.

## 4. Key Project Commands
- **Backend Setup & Run**: `python backend/app.py` (Runs on `http://127.0.0.1:5000`)
- **Backend Tests**: `python -m unittest discover backend`
- **Frontend Live Preview**: Serve statically or via Flask backend static handler at `http://127.0.0.1:5000`

## 5. Learned Rules (Promoted from LESSONS.md)
- *Rule 1*: Upstream Google API/Stitch MCP requests on Windows Node environments may encounter IPv6 DNS connection timeouts; use Windows Schannel or forced IPv4 fallback.
- *Rule 2*: Duplicate idea detection must evaluate both title and description similarity using TF-IDF + Cosine Similarity before insertion, returning detailed match information (similarity score, matching title, author) to trigger the interactive Duplicate Warning modal.

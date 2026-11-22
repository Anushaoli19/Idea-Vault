# Agent Directives & Project Rules — NIE Idea Vault

Welcome to the **NIE Idea Vault** project. This document defines operating rules, architectural invariants, code standards, and verification expectations for all AI coding agents working in this repository.

## 1. Operating Rules & Core Principles
- **Read-First Protocol**: Before proposing or modifying code, agents MUST read:
  1. `docs/CONTEXT.md` (Current project state and immediate focus)
  2. `docs/HANDOFF.md` (Last session notes, open blockers, recent commits)
  3. `docs/TASK.md` (Active phase, current in-progress task `[/]`)
  4. `docs/LESSONS.md` (Past failures, gotchas, and self-correction rules)
- **Living Documentation Sync**: Documentation is code. Any architectural change, schema addition, endpoint addition, or UX workflow change MUST be reflected immediately in `docs/ARCHITECTURE.md`, `docs/USER_GUIDE.md`, and `docs/TASK.md`.
- **Zero Secret Exposure**: Never write real API keys, passwords, JWT secrets, or connection strings into markdown files, commit messages, or source code. Always use `.env` (ignored by git) and declare schemas in `.env.example`.
- **UI & UX Standard**: Exact compliance with Google Stitch design system for NIE Idea Vault (`nie_idea_vault/DESIGN.md`):
  - Primary Accent: `#4F46E5` / `#3525CD` (Electric Indigo)
  - Surface Background: `#F8F9FF`
  - Container Tones: `#EFF4FF`, `#CBDBF5`, `#E5EEFF`
  - Status Accents: `#006C49` (Secondary Emerald), `#885500` / `#684000` (Amber Similarity Warning), `#BA1A1A` (Error/Danger)
  - Inter font family & Material Symbols Outlined. Accessible contrast (WCAG AA), full-rounded pills/cards (`border-radius: 12px–20px`), subtle elevation shadows. No muddy transparencies or unstructured styling.

## 2. Tech Stack & Environment
- **Backend**: Python 3.13 / FastAPI managed with `uv`.
- **Duplicate Similarity Engine**: Scikit-Learn TF-IDF Vectorizer + Cosine Similarity with sub-dimensional feature breakdown (Problem Statement, Hardware/Tech Choice, Target Demographic).
- **Frontend**: Vite + React 18+ with TypeScript, Tailwind CSS, Lucide / Material Symbols Outlined icons.
- **Database**: SQLite (`app.db`) via SQLAlchemy / SQLModel for persistent, zero-friction local storage.
- **Package Managers**: `uv` for Python backend, `npm` for frontend.

## 3. Workflow & Verification Gates
1. **Self-Correction Gate**:
   - If a test, build, lint, or runtime command fails, immediately diagnose the root cause.
   - Record the failure in `docs/LESSONS.md` with: Trigger, Root Cause, Fix, and Rule Going Forward.
   - If the rule applies universally across sessions, promote it into this file under Section 5.
2. **Milestone Verification Gate**:
   - Run automated tests (`uv run pytest`, `npm run build` or `npm test`).
   - Run static type checks and linting.
   - Perform security verification (strict CORS, input validation, no hardcoded secrets).
   - Mark task `[x]` in `docs/TASK.md` with verification timestamp and notes.
3. **Commit & Push Protocol**:
   - Create focused, atomic commits following Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
   - Never run `git reset --hard` or `git push --force` without explicit user permission.

## 4. Key Project Commands
- **Backend Setup & Run**: `cd backend && uv sync && uv run uvicorn app.main:app --reload --port 8000`
- **Backend Tests**: `cd backend && uv run pytest`
- **Frontend Setup & Run**: `cd frontend && npm install && npm run dev`
- **Frontend Build & Lint**: `cd frontend && npm run build`

## 5. Learned Rules (Promoted from LESSONS.md)
- *Rule 1*: Always validate incoming request payloads with Pydantic models before passing to the similarity engine or database.
- *Rule 2*: Duplicate detection must return a structured breakdown (overall match, problem context match, hardware/tech match, target demographic match) and reference the existing conflicting proposal.
- *Rule 3*: Ensure all 13 Stitch screens and states (including Loading skeletons, Duplicate Warning modal, Profile Drawer, Energy Grid showcase, and Teammate Hub) are seamlessly integrated and accessible in the single-page application router.

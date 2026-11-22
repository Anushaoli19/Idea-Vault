# Active Context & Working State

## 1. Project Context
- **Name**: NIE Idea Vault Platform
- **Scope**: Engineering innovation registry, duplicate detection, and peer collaboration hub for NIE Mysuru.
- **Frontend Stack**: Plain HTML5, Tailwind CSS with custom Stitch theme tokens, Vanilla JavaScript (ES6+), Inter typography, Material Symbols Outlined. Zero-build vanilla architecture.

## 2. Completed Milestones
- **Screen Extraction**: All 10 screens and design tokens fetched from Stitch MCP (`projects/12672442345836563722`).
- **Core Views**:
  - `index.html`: Home / Idea Board with category filter, sorting, search, loading and empty states.
  - `post.html`: Post Idea submission form + interactive Duplicate Warning screen with similarity matching and bypass option.
  - `idea.html`: Deep-dive idea detail view with BOM hardware specs, open team slots, and interested collaborators.
  - `profile.html`: Student Profile & Academic Settings with USN, CGPA, developer links, dynamic skill chips, resume management, teaming preferences, JSON export, and public profile preview.
  - `submissions.html`: My Submissions & Project Vault dashboard with 4 KPI summary cards, filter tabs, proposal search, dynamic custom proposal injection, collaborator inquiry triage, and portfolio summary export.
- **Core Engine & Design Tokens**:
  - `styles.css`: Complete Stitch CSS variables, typography classes, custom scrollbars, toast styles, and animations.
  - `app.js`: Configured with `API_BASE = 'http://localhost:5000'`, `USE_MOCK = true`, 6 sample ideas (with 88% near-duplicate pair), token Jaccard similarity scoring, `localStorage` vote persistence, `getUserProfile()` / `saveUserProfile()`, and global `injectProfileDrawer()` / `toggleProfileDrawer()`.
- **Documentation & Governance**:
  - Fully scaffolded 10 living docs in `docs/`, `AGENTS.md`, `README.md`, `.gitignore`, `.env.example`.

## 3. Local Storage Keys
- `idea_vault_upvotes`: Set of upvoted idea IDs.
- `idea_vault_interests`: Set of collaboration interest expressed IDs.
- `idea_vault_bookmarks`: Set of bookmarked idea IDs.
- `idea_vault_custom_ideas`: Array of user-created idea proposals submitted in mock mode.
- `idea_vault_user_profile`: Stored student profile object (USN, name, department, batch, CGPA, links, skills, teaming objectives).

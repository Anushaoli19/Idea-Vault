# Architecture Decision Records (ADR) — NIE Idea Vault

## ADR-001: Architecture & Framework Selection
- **Status**: Accepted
- **Date**: 2026-11-22
- **Context**: The NIE Idea Vault project requires an agile, robust full-stack architecture that supports AI/ML text similarity calculations for duplicate detection, rich multi-page campus workflows (Board, Post, Detail, Submissions, Leaderboard, Teammate Matching), and rapid execution without heavy client-side bundler overhead.
- **Considered Alternatives**:
  1. FastAPI + React SPA with Vite: Excellent type safety, but requires concurrent Node.js runtime and separate build pipeline for local campus deployments.
  2. Django + Templates: Heavy ORM and battery overhead; excessive for a focused capstone portal.
  3. Flask + Semantic HTML5 / Tailwind CSS + Scikit-Learn: Lightweight, Python-native ML integration (`TfidfVectorizer` and `cosine_similarity` run in-process), direct static file serving, and zero frontend build step.
- **Decision Outcome**: Selected Flask (Python 3.11+) with SQLite3, Scikit-Learn for duplicate detection, and responsive HTML5/Tailwind frontend adhering to the Google Stitch Design System.
- **Consequences**:
  - *Positive*: Seamless in-process ML vectorization, instant local launch without complex node build steps, direct mapping to Stitch design tokens.
  - *Negative*: Client-side state synchronization (upvotes, bookmarks) handled via a unified JavaScript client adapter with LocalStorage persistence.

---

## ADR-002: Machine Learning Duplicate Detection Strategy
- **Status**: Accepted
- **Date**: 2026-11-22
- **Context**: Students frequently submit capstone ideas that overlap heavily with prior projects. The system must reliably detect semantic similarity in real time without calling expensive external proprietary APIs for every keystroke.
- **Decision Outcome**: Implemented in-process TF-IDF (Term Frequency-Inverse Document Frequency) vectorization with english stop-word filtering and Cosine Similarity metric from `scikit-learn`. Evaluates both description-to-description similarity and combined title+description overlap, selecting the maximum.
- **Threshold**: Established a default similarity threshold of `0.40` (40.0%).
- **Behavior**: When a user submits or previews an idea with similarity >= 40%, the backend returns HTTP 409 Conflict with the matching idea's details, triggering the Stitch Duplicate Warning modal on the client.

---

## ADR-003: Duplicate Warning Override Mechanism
- **Status**: Accepted
- **Date**: 2026-11-22
- **Context**: While duplicate warning is essential to prevent identical capstone submissions, research projects with identical domain goals (e.g. campus solar micro-grids) may explore fundamentally different hardware architectures or algorithmic models.
- **Decision Outcome**: Supported a `force: true` parameter in `POST /ideas`. When the user reviews the Duplicate Warning and clicks "Proceed with separate submission", the client resends the payload with `force: true`, bypassing the duplicate rejection gate and registering the idea.

---

## ADR-004: Stitch Design System Token Architecture and Global Drawer
- **Status**: Accepted
- **Date**: 2026-11-22
- **Context**: All 13 desktop screens generated in the Stitch MCP project shared a unified Material/Stitch token set (Inter font, Primary `#3525cd`, Primary Container `#4f46e5`, Secondary `#006c49`, Surface `#f8f9ff`). The global account menu drawer needed to appear identically across all pages without duplicating HTML templates.
- **Decision Outcome**: Embedded the Stitch Tailwind config tokens into each page `<head>` and injected the Account Menu & Profile Drawer dynamically via `app.js` with backdrop blur, metric counters, and direct workspace links.

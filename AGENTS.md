# Agent Operating Directives & Project Rules

## Section 1: Project Identity & Scope
- **Project**: NIE Idea Vault Platform
- **Purpose**: Campus innovation registry, duplicate detection, and peer collaboration hub for engineering capstones, research, and hackathon prototypes.
- **Frontend Stack**: Plain HTML5, Tailwind CSS with custom Stitch theme tokens, Vanilla JavaScript (ES6+), Inter typography, Material Symbols Outlined.
- **API Spec**: `GET /ideas`, `POST /ideas`, `POST /ideas/:id/upvote`, `POST /ideas/:id/interest`, `POST /check-duplicate`.

## Section 2: Non-Negotiable Coding Standards
1. **Fidelity to Stitch Designs**: Keep the Stitch layout, typography scale, color tokens, and visual structure exact across all screens (`index.html`, `post.html`, `idea.html`).
2. **Unified Core Logic**: All API calls, mock data fallbacks, duplicate detection algorithms, vote persistence, and UI event listeners live in `app.js` and `styles.css`.
3. **Optimistic Updates & Anti-Double Vote**: Upvotes and Collaboration expressions must render immediately in the DOM and persist across sessions via `localStorage`.
4. **Mock Mode Self-Sufficiency**: When `USE_MOCK = true`, the application must function completely standalone without external servers, containing 6 sample ideas including near-duplicates.
5. **Living Documentation**: Any architecture changes, endpoint modifications, or new features must sync to `docs/` and be verified against `docs/TASK.md`.

## Section 3: Self-Correction Log
- All errors, unexpected behaviors, or corrections must be logged in `docs/LESSONS.md`.

# Architecture Decision Records (ADR)

## ADR-001: Zero-Build Plain HTML, CSS, and Vanilla JavaScript
- **Date**: 2026-11-22
- **Status**: Accepted
- **Context**: The user requested a clean, performant frontend composed of `index.html`, `post.html`, `idea.html`, `app.js`, and `styles.css` matching the Google Stitch layout and styling exactly.
- **Alternatives Evaluated**:
  1. *React + Vite build*: Increases tooling complexity, requires node runtime and compilation for static views.
  2. *Plain HTML + CSS + Vanilla JS with Tailwind CDN & Design Tokens*: Runs instantly in any browser without npm/vite dependencies while keeping 100% exact styling parity with Stitch.
- **Decision**: Adopt Plain HTML5, Tailwind CDN with custom Stitch theme config, and a unified `app.js` and `styles.css`.
- **Consequences**: Instant startup, zero bundle overhead, portable across static hosts.

## ADR-002: Dual-Mode Execution (API_BASE + USE_MOCK Fallback)
- **Date**: 2026-11-22
- **Status**: Accepted
- **Context**: The frontend needs to work standalone without requiring an active backend server while maintaining full compatibility with backend REST endpoints (`GET /ideas`, `POST /ideas`, `POST /ideas/:id/upvote`, `POST /ideas/:id/interest`, `POST /check-duplicate`).
- **Decision**: Implement `API_BASE` and `USE_MOCK = true` at the top of `app.js`. In mock mode, 6 rich sample ideas are loaded with token-based duplicate scoring. When `USE_MOCK = false`, standard fetch calls are made to `API_BASE`.
- **Consequences**: Developers and users can test all screens immediately out of the box.

## ADR-003: LocalStorage Double-Vote Prevention
- **Date**: 2026-11-22
- **Status**: Accepted
- **Decision**: Persist upvoted idea IDs (`idea_vault_upvotes`) and interested idea IDs (`idea_vault_interests`) in browser `localStorage`.
- **Consequences**: Optimistic UI updates occur instantly; duplicate voting is prevented even on page refresh.

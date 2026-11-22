# Implementation Checklist & Task Ledger — NIE Idea Vault

Legend:
- `[ ]` Not Started
- `[/]` In Progress
- `[x]` Completed (Includes verification note: Date, Test/Command, Result)

---

## Phase 1: Environment Setup & Scaffolding
- [x] 1.1 Verify `.gitignore` and `.env.example` (ensure secrets, venv, node_modules, app.db are excluded) [Verified: 2026-11-22 via file check]
- [x] 1.2 Establish clean root `AGENTS.md` and complete Blueprint verification with user [Verified: 2026-11-22]
- [ ] 1.3 Initialize backend environment (`uv sync`, FastAPI app scaffolding, requirements)
- [ ] 1.4 Initialize frontend environment (Vite + React 18 + TypeScript + Tailwind with Google Stitch tokens)

## Phase 2: Backend Architecture & Core APIs
- [ ] 2.1 SQLite database schema definition with SQLAlchemy (Users, Ideas, OpenRoles, Applications, Upvotes, Notifications)
- [ ] 2.2 Seed rich mock dataset reflecting NIE Mysuru capstones (hostel mess food waste auditor, smart campus energy grid, etc.)
- [ ] 2.3 Scikit-learn TF-IDF Vectorizer & Cosine Similarity duplicate detection engine with multi-factor breakdown
- [ ] 2.4 REST API endpoints implementation (Ideas CRUD, upvote/interest toggles, teammate role matching, leaderboard, notifications, user profile)
- [ ] 2.5 Automated unit & integration tests (`uv run pytest`)

## Phase 3: Frontend Architecture & UI Implementation (Stitch Fidelity)
- [ ] 3.1 Design system tokens configuration (Tailwind theme matching `DESIGN.md`: surface `#F8F9FF`, primary `#4F46E5`, secondary `#006C49`, amber `#684000`, crimson `#BA1A1A`)
- [ ] 3.2 Persistent App Shell: Header with NIE badge, navigation links, Post CTA, Notification counter, and Account Profile Drawer
- [ ] 3.3 Screen 1: Home / Idea Board (Hero & live metrics pill, `Cmd+K` search, category chips, sort toggle, project card grid)
- [ ] 3.4 Screen 2: Post Idea Form (Project title with counter, category select, maturity buttons, markdown description, tech tags, teammate seeking configuration)
- [ ] 3.5 Screen 3: Duplicate Warning & Similarity Analysis (Amber banner, % match badge, side-by-side comparison, 3-meter similarity breakdown, collaborative action buttons)
- [ ] 3.6 Screen 4 & 5: Idea Detail View & Smart Campus Energy Grid showcase (Detailed specs, metric cards, problem statement, schematics, team roster, faculty advisor, timeline)
- [ ] 3.7 Screen 6: Idea Detail Loading State Skeleton (Graceful loading pulses)
- [ ] 3.8 Screen 7: Teammate Matching & Open Roles Hub (Domain filters, department dropdowns, capacity cards, one-click apply)
- [ ] 3.9 Screen 8: Campus Innovation Leaderboard (1st/2nd/3rd podium, department cup, student rankings table with points breakdown)
- [ ] 3.10 Screen 9: Notification Center & Activity Feed (Categorized tabs, Accept/Decline action cards)
- [ ] 3.11 Screen 10: My Submissions & Project Vault Dashboard (Metrics summary, status-segmented tabs, team management)
- [ ] 3.12 Screen 11, 12, 13: Profile & Settings, Account Drawer, and Settings & Security views

## Phase 4: Integration, Hardening & Verification
- [ ] 4.1 End-to-end integration between React frontend and FastAPI backend
- [ ] 4.2 Security audit: CORS lockdown, Pydantic input validation, SQL injection prevention, security headers
- [ ] 4.3 Automated test execution & build check (`uv run pytest` and `npm run build`)
- [ ] 4.4 Documentation sync (`docs/ARCHITECTURE.md`, `docs/USER_GUIDE.md`, `docs/SECURITY_AUDIT.md`)

## Phase 5: Handoff & Session Finalization
- [ ] 5.1 Final verification and live demo readiness
- [ ] 5.2 Compile session progress in `docs/HANDOFF.md` and `docs/CONTEXT.md`
- [ ] 5.3 Clean atomic git commit

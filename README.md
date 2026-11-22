# NIE Idea Vault

**NIE Idea Vault** is a modern, responsive web application for engineering students and faculty at NIE Mysuru to publish, discover, collaborate on, and prevent duplication of capstone and hackathon project ideas.

Built with high fidelity to the Google Stitch academic SaaS design system, the platform empowers students across departments (CSE, ISE, ECE, Mech, AIML, Civil) to form interdisciplinary teams, review Bill of Materials (BOM) and system architectures, and receive instant duplicate warnings via machine learning similarity analysis before committing semester-long effort.

---

## Features
- **Discovery Feed & Idea Board**: Explore submitted capstones with instant search (`Cmd+K`), department/category filters (AI/ML, Web, IoT, App, Other), and sort by "Most Upvoted" vs. "Newest".
- **AI Duplicate Detection & Similarity Engine**: Real-time TF-IDF vector similarity analysis against existing capstones with breakdown meters across Problem Context, Hardware/Tech Choice, and Target Demographic.
- **Duplicate Warning Modal**: Alerts students of overlapping research, highlighting conflicting projects and offering one-click options to "Upvote / Join Team Instead" or "Request Mentor Mediation".
- **Enriched Idea Showcase**: Detailed technical breakdown including Problem Statements, System Architecture, Bill of Materials (BOM), Open Team Slots, and Faculty Advisor verification.
- **Teammate Matching Hub**: Interdisciplinary recruitment board displaying open vacancies (ECE hardware, CSE backend, UI/UX, etc.) with team capacity indicators and one-click applications.
- **Campus Innovation Leaderboard**: Top innovators podium (1st, 2nd, 3rd), department rankings cup, and student leaderboard scoring based on peer upvotes, seed grants, and cross-branch teaming.
- **Notifications & Activity Feed**: Real-time notifications for teammate requests, upvotes, and faculty reviews, with direct accept/decline action cards.
- **My Submissions Dashboard**: Track active capstones, endorsement metrics, prototyping lab statuses, and sprint milestones.
- **Profile & Academic Settings**: Student USN credentials, CGPA, GitHub/LinkedIn links, lab clearance badges, and teammate availability toggles.

---

## Architecture & Tech Stack
- **Backend**: Python 3.13+, FastAPI, `uv`, SQLAlchemy, Scikit-learn (TF-IDF & Cosine Similarity), Pydantic v2.
- **Frontend**: React 18+, TypeScript, Vite, Tailwind CSS (Stitch Theme Tokens), Material Symbols Outlined, Inter typography.
- **Database**: SQLite (`app.db`) for lightweight, robust local development.
- **Documentation**: Living documentation harness adhering to `fullstack-doc-harness` standards in `docs/`.

---

## Quickstart

### Prerequisites
- Python 3.11+ and `uv`
- Node.js 18+ and `npm`
- Git

### 1. Clone & Environment Setup
```bash
git clone <repository-url>
cd vault
cp .env.example .env
```

### 2. Backend Setup
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```
- Backend API: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend Web App: `http://localhost:5173`

---

## Documentation Index
- [Product Requirements Document (PRD)](./docs/PRD.md): Vision, user personas, requirements, and out-of-scope boundaries.
- [System Architecture & Specs](./docs/ARCHITECTURE.md): System topology, data flow, ERD, and API endpoint matrix.
- [User Guide & Manual](./docs/USER_GUIDE.md): End-user onboarding, workflows, and troubleshooting.
- [Task Implementation Checklist](./docs/TASK.md): Live phase-by-phase implementation progress.
- [Architecture Decisions (ADR)](./docs/DECISION.md): Immutable log of technical choices and trade-offs.
- [Lessons Learned](./docs/LESSONS.md): Self-correction and error diagnosis log.
- [Project Context & State](./docs/CONTEXT.md): Current sprint state, active task, and domain assumptions.
- [Data Privacy & Secrets](./docs/DATA_PRIVACY.md): Sensitive data inventory, auth handling, and secret policies.
- [Security Audit](./docs/SECURITY_AUDIT.md): Threat modeling, OWASP checks, and vulnerability logs.
- [Session Handoff](./docs/HANDOFF.md): Work continuity notes, commit logs, and next steps.

---

## License
MIT License — The National Institute of Engineering (NIE), Mysuru.

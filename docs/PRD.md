# Product Requirements Document (PRD)

## 1. Executive Summary & Problem Statement
- **Product Name**: NIE Idea Vault Platform
- **Problem**: Engineering students at NIE Mysuru frequently duplicate capstone and hackathon ideas without knowing existing work already exists, while students looking for cross-departmental teammates struggle to find collaborators.
- **Proposed Solution**: A centralized innovation board with automated duplicate detection, tech stack tagging, peer upvoting, and collaboration recruitment.
- **Value Proposition**: Reduces redundant engineering effort, accelerates project kickoff, and fosters interdisciplinary capstone teams across CSE, ECE, ISE, AIML, Mech, and Civil departments.

## 2. Target Users & Personas
- **Primary Persona**:
  - *Role*: Engineering Undergrad (Pre-final / Final Year)
  - *Needs*: Wants to share capstone/hackathon proposals, check if similar projects exist, and find teammates with complementary skill sets.
  - *Pain Points*: Disconnected Google Forms, unindexed past project archives, duplicate submissions rejected by project coordinators.
- **Secondary Persona**:
  - *Role*: Project Coordinator / Faculty Mentor
  - *Needs*: High-visibility oversight of active student projects, plagiarism/duplicate deterrence, and research pipeline tracking.
  - *Pain Points*: Manual screening of hundreds of project proposals every semester.

## 3. User Stories & Acceptance Criteria
- **US-001 (Browse Ideas)**: As a student, I want to explore ideas filtered by category and sorted by votes or newest, so that I can see what peers are building.
  - *Acceptance Criteria 1*: User can filter by `All`, `AI/ML`, `Web`, `IoT`, `App`, and `Other`.
  - *Acceptance Criteria 2*: User can sort by `Most Upvoted` or `Newest`.
  - *Acceptance Criteria 3*: Search bar dynamically filters cards by title, description, or tech stack.
- **US-002 (Duplicate Warning Flow)**: As an ideator, I want my proposal cross-checked against existing projects before submission, so that I don't reinvent existing work.
  - *Acceptance Criteria 1*: On submitting form, `/check-duplicate` is called.
  - *Acceptance Criteria 2*: If match >= 60%, Duplicate Warning banner displays with existing idea title, description, match %, link, and "Proceed with my separate submission" (Post anyway) option.
  - *Acceptance Criteria 3*: Clicking "Proceed with my separate submission" forces `POST /ideas` submission.
- **US-003 (Upvoting & Anti-Double Vote)**: As a student, I want to upvote and express collaboration interest instantly without ballot stuffing.
  - *Acceptance Criteria 1*: Vote updates UI count immediately.
  - *Acceptance Criteria 2*: LocalStorage records idea ID to prevent duplicate voting.

## 4. Functional Requirements
- **FR-01**: `index.html` renders card grid, search bar, sort toggle, and category chips.
- **FR-02**: `post.html` captures project details and triggers similarity check before creation.
- **FR-03**: `idea.html` renders full project deep-dive, BOM/hardware specs, open team roles, and loading skeleton.
- **FR-04**: `app.js` exposes `API_BASE` (default `http://localhost:5000`) and `USE_MOCK = true` mode with 6 sample projects (including 2 near-duplicates).

## 5. Non-Functional Requirements
- **Performance**: Vanilla JS with zero build step; instantaneous client-side filtering and optimistic updates.
- **Visual Fidelity**: Exact preservation of Stitch design tokens (Inter font, indigo primary `#3525cd`, emerald secondary `#006c49`, full roundness).
- **Graceful Fallback**: Transparently operates offline via mock engine if backend API is unreachable.

## 6. API Contracts
- `GET /ideas` -> `[ { id, title, description, category, tags, department, author, upvotes, interests, ... } ]`
- `POST /ideas` -> `{ success: true, idea: { ... } }`
- `POST /ideas/:id/upvote` -> `{ success: true, upvotes: number }`
- `POST /ideas/:id/interest` -> `{ success: true, interests: number }`
- `POST /check-duplicate` -> `{ isDuplicate: boolean, similarity: number, matchedIdea: { ... } }`

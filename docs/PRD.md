# Product Requirements Document (PRD) — NIE Idea Vault

## 1. Executive Summary & Problem Statement
- **Product Name**: NIE Idea Vault
- **Problem**: Engineering students at NIE often struggle to find interdisciplinary teammates, evaluate whether their final-year capstone ideas are novel, or receive feedback from faculty and peers before investing semester-long effort. Redundant and duplicate projects are frequently submitted across batches without awareness.
- **Proposed Solution**: A unified, campus-wide Innovation & Ideation portal implementing the Google Stitch design system. The platform allows students to post capstone proposals, discover interdisciplinary collaborators, browse ideas with category/department filtering, track submissions on personal dashboards, see campus leaderboards, and actively flags duplicate ideas using Machine Learning text similarity before final submission.
- **Value Proposition**: Accelerates high-impact capstone collaboration, eliminates duplicate project submissions, and connects cross-department talent across NIE South and North campuses.

## 2. Target Users & Personas
- **Primary Persona — Final Year Engineering Student (Project Lead / Submitter)**:
  - *Role*: 7th/8th Semester student planning or executing a capstone project.
  - *Needs*: Wants to register project ideas, check for prior art / duplicates, and recruit teammates with specialized skills (e.g. firmware, UI/UX, backend).
  - *Pain Points*: Discovers too late that another team built the exact same solution last year or struggles to find members from other engineering branches.
- **Secondary Persona — Student Collaborator / Peer Reviewer**:
  - *Role*: 3rd–6th Semester student looking to join active projects or upvote promising innovations.
  - *Needs*: Browsing active ideas, viewing Bill of Materials (BOM) and system architectures, and applying for open project roles.
  - *Pain Points*: Unclear who is leading projects, what roles are vacant, or which ideas are officially approved.

## 3. User Stories & Acceptance Criteria
- **US-001 (Browse Ideas)**: As a student, I want to explore submitted project ideas with search and department filtering so that I can discover interesting campus projects.
  - *Criteria 1*: Displays card grid with title, summary, department badge, upvotes, interests, and author.
  - *Criteria 2*: Instant search by title, keyword, or tag.
- **US-002 (Submit Project with Duplicate Check)**: As an innovator, I want to submit my capstone proposal with real-time duplicate detection so that I do not duplicate existing projects.
  - *Criteria 1*: When entering description, system computes TF-IDF similarity against existing proposals.
  - *Criteria 2*: If similarity score >= 40%, the user is presented with the **Duplicate Warning** modal showing the existing similar idea, similarity percentage, and options to review the existing idea or revise.
- **US-003 (Detailed Idea Showcase)**: As a student, I want to view detailed technical breakdowns (Problem Statement, Solution Architecture, Bill of Materials, Open Roles) for an idea.
  - *Criteria 1*: Detail page renders full specifications, team availability, and interactive upvote/interest buttons.
  - *Criteria 2*: Skeleton loading state is shown during async fetch.
- **US-004 (Teammate Matching & Open Roles)**: As a student, I want to see open project positions across campus and apply to join.
  - *Criteria 1*: Dedicated section/page listing open roles by technical domain.
  - *Criteria 2*: One-click "Express Interest / Apply" button updating team state.
- **US-005 (Campus Leaderboard & Activity)**: As a user, I want to view top trending ideas, top innovators, and recent activity notifications.
  - *Criteria 1*: Ranks top projects by community upvotes and engagement.
  - *Criteria 2*: Notification drawer displays recent approvals, upvotes, and applicant alerts.

## 4. Functional Requirements
- **FR-01 (Idea Management)**: Full CRUD support for capstone ideas (title, description, category, department, problem statement, solution, BOM, team slots).
- **FR-02 (AI Duplicate Detection)**: Scikit-learn TF-IDF Vectorizer + Cosine Similarity computation. Endpoint returns duplicate status, match score, and similar project metadata.
- **FR-03 (Community Voting & Interest)**: Optimistic, persistent upvoting and "Interested in Joining" tracking per student USN.
- **FR-04 (Stitch Design System Compliance)**: Exact fidelity to Google Stitch screens:
  1. Home / Idea Board (`index.html`)
  2. Post Idea Form (`post.html`)
  3. Duplicate Warning Modal (`post.html` / `duplicate-modal`)
  4. Idea Detail View (`idea.html`)
  5. Idea Detail - Smart Campus Energy Grid showcase
  6. Idea Detail - Loading State Skeleton
  7. My Submissions Dashboard (`submissions.html`)
  8. Campus Leaderboard (`leaderboard.html`)
  9. Teammate Matching & Open Roles (`teammates.html`)
  10. Notification Center & Campus Activity (`notifications.html` & Drawer)
  11. Profile & Settings (`profile.html`)
  12. Account Menu & Profile Drawer (global header component)
  13. Settings & Security (`settings.html`)

## 5. Non-Functional Requirements (NFR)
- **Performance**: Duplicate check response < 150ms; page load < 500ms.
- **Security**: Parameterized SQLite queries preventing SQL injection; strict CORS; sanitized HTML rendering preventing XSS.
- **Accessibility & Design**: Material Symbols, high contrast (WCAG AA), responsive desktop-first layout matching Stitch 2560px baseline.

## 6. Out-of-Scope Boundaries (MVP)
- Multi-campus college federation outside NIE Mysuru.
- Patent filing and IP registration legal paperwork automation.
- Hardware lab equipment physical barcode scanner integration.

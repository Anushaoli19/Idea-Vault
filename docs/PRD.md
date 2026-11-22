# Product Requirements Document (PRD) — NIE Idea Vault

## 1. Executive Summary & Problem Statement
- **Product Name**: NIE Idea Vault
- **Problem**: Engineering students at The National Institute of Engineering (NIE), Mysuru, frequently struggle to find interdisciplinary teammates across departments (CSE, ISE, ECE, Mech, AIML, Civil), validate whether their final-year capstone or hackathon ideas are novel, or receive feedback from faculty and peers before investing semester-long effort. Redundant, duplicate projects are frequently proposed and built across academic batches without awareness, diluting academic innovation and wasting campus lab resources.
- **Proposed Solution**: A unified, campus-wide Innovation & Ideation portal implementing the Google Stitch design system. The platform allows students to publish capstone proposals, discover interdisciplinary collaborators, browse ideas with category/department filtering, track submissions on personal dashboards, see campus leaderboards, and actively flags duplicate ideas using Machine Learning text similarity analysis before final submission.
- **Value Proposition**: Accelerates high-impact capstone collaboration, eliminates redundant project duplication through intelligent pre-checks, and connects cross-department talent across NIE South and North campuses.

---

## 2. Target Users & Personas
- **Primary Persona — Final Year Engineering Student (Project Lead / Submitter)**:
  - *Role*: 7th/8th Semester student planning or executing a capstone project.
  - *Needs*: Wants to register project ideas, check for prior art / duplicates, and recruit teammates with specialized skills (e.g., ECE hardware, CSE backend, UI/UX).
  - *Pain Points*: Discovers too late that another team built the exact same solution last year or struggles to find members from other engineering branches.
- **Secondary Persona — Student Collaborator / Peer Reviewer**:
  - *Role*: 3rd–6th Semester student looking to join active projects or upvote promising innovations.
  - *Needs*: Browsing active ideas, viewing Bill of Materials (BOM) and system architectures, and applying for open project roles.
  - *Pain Points*: Unclear who is leading projects, what roles are vacant, or which ideas are officially approved.
- **Tertiary Persona — Faculty Advisor / Department Capstone Coordinator**:
  - *Role*: Professor / Mentor overseeing department project reviews.
  - *Needs*: Evaluating novelty, assigning mentor endorsements, reviewing similarity alerts, and guiding teams toward collaborative synergies.

---

## 3. User Stories & Acceptance Criteria
- **US-001 (Browse & Filter Ideas)**: As a student, I want to explore submitted project ideas with search and department filtering so that I can discover interesting campus projects.
  - *Criteria 1*: Displays responsive card grid with title, summary, department badge, tech tags, upvote button with live count, collaborator interest count, and author info.
  - *Criteria 2*: Instant search by title, keyword, or tech stack tag with `Cmd+K` keyboard shortcut.
  - *Criteria 3*: Category filter chips (All, AI/ML, Web, IoT, App, Other) and sort toggle (Most Upvoted vs. Newest).
- **US-002 (Submit Project with AI Duplicate Check)**: As an innovator, I want to submit my capstone proposal with real-time duplicate detection so that I do not duplicate existing projects.
  - *Criteria 1*: Interactive submission form with title, category, project maturity (Concept, Prototype, Validation), markdown description, and teammate seeking configurations.
  - *Criteria 2*: "Check & Post Idea" action triggers background vector similarity search against past submissions using TF-IDF and Cosine Similarity.
  - *Criteria 3*: If similarity score >= 40%, the user is presented with the **Duplicate Warning** view/modal showing the conflicting existing capstone, % match badge, and similarity breakdown meters (Problem Context, Hardware/Tech Choice, Target Demographic).
  - *Criteria 4*: User is offered collaborative alternatives: "Upvote / Join Team Instead", "Proceed with Separate Submission", or "Request Mentor Mediation".
- **US-003 (Detailed Idea Showcase)**: As a student, I want to view detailed technical breakdowns (Problem Statement, Solution Architecture, Bill of Materials, Open Roles) for an idea.
  - *Criteria 1*: Detail page renders full specifications, quantitative impact metrics (e.g., waste reduction, latency, savings), team availability, and interactive upvote/interest buttons.
  - *Criteria 2*: Dedicated sidebar displays interested students roster, assigned faculty advisor verification card, and project lifecycle timeline (Ideation -> Prototyping -> Lab Testing -> Final Defense).
  - *Criteria 3*: Skeleton loading state is shown during asynchronous fetching.
- **US-004 (Teammate Matching & Open Roles)**: As a student, I want to see open project positions across campus and apply to join.
  - *Criteria 1*: Dedicated recruitment hub listing vacancies across engineering domains (Frontend, AI/ML, Hardware/Embedded, UI/UX, Cloud) and department dropdowns.
  - *Criteria 2*: Cards display required skills, team capacity (e.g., 2 of 4 filled), expected kickoff dates, and "Request to Join" button.
- **US-005 (Campus Innovation Leaderboard)**: As a student, I want to view top innovators, top trending projects, and department rankings.
  - *Criteria 1*: Top Innovators podium showcasing 1st, 2nd, and 3rd ranked students with innovation points and achievement badges.
  - *Criteria 2*: Department rankings cup aggregating points across CSE, ISE, ECE, Mech, AIML, Civil.
  - *Criteria 3*: Filterable student ranking table with points breakdown (peer upvotes, seed grants, cross-branch teaming).
- **US-006 (Notification Center & Activity Feed)**: As a student, I want real-time notifications about team requests, upvotes, comments, and faculty reviews.
  - *Criteria 1*: Categorized tabs for Teammates, Upvotes, Comments, and Grants.
  - *Criteria 2*: Interactive action cards allowing leads to Accept or Decline team applicants directly.
- **US-007 (My Submissions & Project Vault Dashboard)**: As an author, I want to track my active capstones, endorsement metrics, and prototyping lab statuses.
  - *Criteria 1*: Summary statistics for Active Capstones, Total Endorsements, Collaborator Inquiries, and Prototyping Lab Status.
  - *Criteria 2*: Status-segmented tabs (Approved & Open, Under Faculty Review, Team Formed, Drafts & Warnings).
- **US-008 (Profile & Academic Credentials)**: As a student, I want to showcase my academic profile and availability.
  - *Criteria 1*: Credentials display: USN, department, CGPA, campus division.
  - *Criteria 2*: Linked developer profiles (GitHub, LinkedIn, ORCID), resume attachment, teammate availability toggle, and lab clearance badges.

---

## 4. Functional Requirements
- **FR-01 (Idea Management)**: Full CRUD support for capstone ideas (title, description, category, department, problem statement, solution architecture, bill of materials, team slots, maturity stage).
- **FR-02 (AI Duplicate Detection)**: Scikit-learn TF-IDF Vectorizer + Cosine Similarity computation. Analyzes submission text against stored corpus, returning match score and dimensional breakdown:
  - Problem Context match %
  - Hardware/Tech Choice match %
  - Target Demographic match %
- **FR-03 (Community Voting & Interest Tracking)**: Optimistic, persistent upvoting and "Interested in Joining" tracking per student USN / identifier.
- **FR-04 (Teammate Matching & Applications)**: Submission of role applications with real-time status updates (Pending, Accepted, Declined) and team capacity tracking.
- **FR-05 (Leaderboard Calculation Engine)**: Algorithmic calculation of innovation points:
  - Base points per approved capstone: 100 pts
  - Upvote received: 10 pts
  - Cross-branch team formed: 50 pts
  - Faculty endorsement / seed grant: 150 pts
- **FR-06 (Stitch Design System Compliance)**: Strict fidelity to Google Stitch screens:
  1. Home / Idea Board (`/`)
  2. Post Idea Form (`/post`)
  3. Duplicate Warning Modal & Comparison (`/post` duplicate flow)
  4. Idea Detail View (`/idea/:id`)
  5. Idea Detail - Smart Campus Energy Grid showcase
  6. Idea Detail - Loading State Skeleton
  7. My Submissions Dashboard (`/submissions`)
  8. Campus Leaderboard (`/leaderboard`)
  9. Teammate Matching & Open Roles (`/teammates`)
  10. Notification Center & Campus Activity (`/notifications` + Drawer)
  11. Profile & Academic Settings (`/profile`)
  12. Account Menu & Profile Drawer (Global Header)
  13. Settings & Security (`/settings`)

---

## 5. Non-Functional Requirements (NFR)
- **Performance**: Duplicate check response < 150ms; page load and route transitions < 500ms.
- **Security**: Parameterized SQLite queries preventing SQL injection; strict CORS headers; sanitized input preventing XSS.
- **Accessibility & Design**: Material Symbols Outlined, Inter font typography, WCAG AA contrast ratio compliance, responsive desktop-first layout matching Stitch baseline.
- **Reliability**: Graceful offline fallback with mock data seeding ensuring the app runs out-of-the-box.

---

## 6. API Contracts & Conventions
- Base Path: `/api/v1`
- Content-Type: `application/json`
- Standard Response Format:
  ```json
  {
    "data": ...,
    "error": null,
    "meta": { "timestamp": "...", "status": 200 }
  }
  ```
- Standard Error Format:
  ```json
  {
    "data": null,
    "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] }
  }
  ```

---

## 7. Out-of-Scope Boundaries (MVP)
- Multi-campus college federation outside NIE Mysuru.
- Legal patent filing and intellectual property paperwork submission to government bodies.
- Physical lab turnstile hardware RFID/NFC scanning.

# User Guide & Operational Manual — NIE Idea Vault

## 1. Getting Started
Welcome to **NIE Idea Vault**, the official innovation portal for National Institute of Engineering students, researchers, and faculty.

### Accessing the Platform
- **Local Development URL**: `http://127.0.0.1:5000`
- **Recommended Browsers**: Google Chrome, Microsoft Edge, Brave, Mozilla Firefox.

---

## 2. Platform Navigation & 13 Stitch Screens Overview

| # | Screen | File / Location | Primary Purpose |
|---|---|---|---|
| 1 | **Post Idea** | `post.html` | Step-by-step submission form with automatic duplicate idea checking. |
| 2 | **Profile & Settings** | `profile.html` | Student academic identity, USN, portfolio links, skills, and lab authorizations. |
| 3 | **Notification Center** | `notifications.html` | Campus activity stream, team application notices, upvote milestones, and review status. |
| 4 | **Teammate Matching** | `teammates.html` | Open interdisciplinary role listings filtered by skill (Python, ML, Firmware, React, CAD). |
| 5 | **Campus Leaderboard** | `leaderboard.html` | Top 3 podium, rankings table, departmental engagement progress, and top student innovators. |
| 6 | **Duplicate Warning** | `post.html` (Modal / Banner) | Highlights >= 40% duplicate matches with diagnostic comparisons and bypass options. |
| 7 | **Idea Detail** | `idea.html` | Technical breakdown with Problem Statement, BOM table, Architecture, and Team Roles. |
| 8 | **My Submissions** | `submissions.html` | Personal dashboard managing your submitted capstone ideas and team requests. |
| 9 | **Settings & Security** | `settings.html` | Workspace themes, brand accent tones, high contrast switch, password & TOTP 2FA, session manager. |
| 10 | **Energy Grid Showcase** | `idea.html?id=1` | Featured capstone showcase for Smart Campus Micro-Grid & Autonomous Energy Optimization. |
| 11 | **Profile Drawer** | Global Header (`app.js`) | Quick popover / slide-over drawer accessible from any page via the header profile avatar. |
| 12 | **Home / Idea Board** | `index.html` | Browse all submitted projects with search query, department chips, and upvote controls. |
| 13 | **Detail Loading State** | `idea.html` (Skeleton) | Polished shimmer skeleton loading state displayed while fetching project specs. |

---

## 3. Core Feature Walkthroughs

### Workflow 1: Posting an Idea with AI Duplicate Detection
1. Click **Post Idea** (`+`) on the top navigation bar.
2. Enter the **Project Title**, select your **Department** (e.g. CSE, ISE, ECE, MECH, EEE), and pick a **Category**.
3. Select your project's **Maturity Stage** (Concept, Prototype, Validation).
4. Enter your **Problem & Pitch Summary** and **Proposed Architecture**.
5. Click **Check & Submit Proposal**:
   - If the idea is novel (similarity < 40%), it is saved immediately and you are redirected to the live Idea Detail view (`idea.html?id=...`).
   - If the idea overlaps with an existing idea (similarity >= 40%), the **Duplicate Warning Banner / Modal** appears, highlighting:
     - The similarity match percentage (e.g. `78.5% match detected`).
     - The title, lead student, department, and description excerpt of the matching idea.
     - **"View Existing Idea"**: Opens the existing project in a new tab.
     - **"Proceed with separate submission"**: Bypasses the duplicate warning using `force: true` to record an independent study or alternative methodology.

### Workflow 2: Upvoting & Expressing Interest in Open Roles
1. From the **Idea Board** or **Idea Detail** page, click the **Upvote** button.
   - The counter updates immediately and is saved in both SQLite and your browser session.
2. To join a project team, navigate to **Find Teammates** (`teammates.html`) or view the **Team Slots** table on any project detail page.
3. Click **"Apply to Join"**:
   - Your student USN (`4NI21CS089`), name, and batch are submitted to the project lead.
   - An alert notification is delivered to the lead's Notification Center.

### Workflow 3: Notification Center & Activity Feed
1. Click the **Notifications** bell icon in the header.
2. Filter updates by category pills: **All Updates**, **Teammate Requests**, **Upvotes & Endorsements**, **Comments & Threads**, or **Faculty & Grants**.
3. Toggle **Unread only** to isolate pending actions.
4. Click **"Accept Teammate"** on an applicant card to confirm them into your project team roster.
5. Click **"Mark all as read"** to clear unread badges and update server state.

### Workflow 4: Settings, Security & Campus Integrations
1. Open the **Profile Drawer** and select **Settings & Security** (`settings.html`).
2. Switch your Workspace Theme between **Light Mode**, **Dark Mode**, and **OS Auto Sync**.
3. Select campus brand accent tones: **Electric Indigo** (`#4f46e5`), **Slate Navy**, or **Eco-Tech** (`#006c49`).
4. Enable **High Contrast Projector View** for auditorium project defenses.
5. Review connected accounts (Contineo Student Portal SSO, GitHub Academic, ORCID).
6. Manage TOTP Two-Factor Authentication and terminate unauthorized campus Wi-Fi sessions.

---

## 4. Troubleshooting & FAQ
- **Q: Why was my proposal flagged as a duplicate?**
  - *A*: The backend evaluated your proposal's title and description using TF-IDF and Cosine Similarity against all registered ideas. If overlap is >= 40.0%, it flags it to prevent redundant capstone efforts. You can click "Proceed with separate submission" if your methodology or scope is distinctly different.
- **Q: How do I run the project locally?**
  - *A*: Run `python backend/app.py` in your terminal. Open `http://127.0.0.1:5000` in your web browser.

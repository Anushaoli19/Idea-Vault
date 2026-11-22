# User Guide & Operational Manual — NIE Idea Vault

## 1. Getting Started
Welcome to **NIE Idea Vault**, the official innovation portal for National Institute of Engineering students, researchers, and faculty.

### Accessing the Platform
- **Local Development URL**: `http://127.0.0.1:5000`
- **Recommended Browsers**: Google Chrome, Microsoft Edge, Brave, Mozilla Firefox.

---

## 2. Platform Navigation & 13 Stitch Screens Complete Directory

Every screen from the Google Stitch project is available in three distinct forms:
1. **Interactive Production App View** (`*.html`): Full dynamic connectivity with Python Flask REST backend and SQLite database.
2. **Dedicated Standalone Screen View** (`screen_{num:02d}_*.html` and `screen_{num}.html`): Exact replica of the Stitch desktop design with interactive inspection banner and intra-screen navigation.
3. **Master Screen Directory** (`screens.html` / `http://127.0.0.1:5000/screens`): Central catalog displaying all 13 screens with search, category filtering, and direct links.

| # | Stitch Screen Title | Dedicated Standalone File | Short Alias | Live App View | Stitch Raw Source |
|---|---|---|---|---|---|
| **01** | **Post Idea** | `screen_01_post_idea.html` | `screen_1.html` | `post.html` | `stitch/screen_01_post_idea.html` |
| **02** | **Profile & Settings** | `screen_02_profile_settings.html` | `screen_2.html` | `profile.html` | `stitch/screen_02_profile_settings.html` |
| **03** | **Notification Center** | `screen_03_notification_center.html` | `screen_3.html` | `notifications.html` | `stitch/screen_03_notification_center.html` |
| **04** | **Teammate Matching** | `screen_04_teammates.html` | `screen_4.html` | `teammates.html` | `stitch/screen_04_teammates.html` |
| **05** | **Campus Leaderboard** | `screen_05_leaderboard.html` | `screen_5.html` | `leaderboard.html` | `stitch/screen_05_leaderboard.html` |
| **06** | **Duplicate Warning** | `screen_06_duplicate_warning.html` | `screen_6.html` | `post.html` (Modal) | `stitch/screen_06_duplicate_warning.html` |
| **07** | **Idea Detail (Food Waste Auditor)** | `screen_07_idea_detail.html` | `screen_7.html` | `idea.html?id=2` | `stitch/screen_07_idea_detail.html` |
| **08** | **My Submissions Dashboard** | `screen_08_submissions.html` | `screen_8.html` | `submissions.html` | `stitch/screen_08_submissions.html` |
| **09** | **Settings & Security** | `screen_09_settings_security.html` | `screen_9.html` | `settings.html` | `stitch/screen_09_settings_security.html` |
| **10** | **Idea Detail - Smart Campus Energy Grid** | `screen_10_energy_grid.html` | `screen_10.html` | `idea.html?id=1` | `stitch/screen_10_energy_grid.html` |
| **11** | **Account Menu & Profile Drawer** | `screen_11_profile_drawer.html` | `screen_11.html` | `index.html#drawer` | `stitch/screen_11_profile_drawer.html` |
| **12** | **Home / Idea Board** | `screen_12_home_idea_board.html` | `screen_12.html` | `index.html` | `stitch/screen_12_home_idea_board.html` |
| **13** | **Idea Detail - Loading State** | `screen_13_loading_skeleton.html` | `screen_13.html` | `idea.html` (Loading) | `stitch/screen_13_loading_skeleton.html` |

> [!TIP]
> You can visit `http://127.0.0.1:5000/screens` anytime or click **Screens (13)** in the top header to explore the interactive visual directory for all screens.

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

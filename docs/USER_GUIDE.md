# User Guide & Manual — NIE Idea Vault

## 1. Getting Started
Welcome to **NIE Idea Vault**, the official innovation and capstone collaboration platform for students and faculty of The National Institute of Engineering (NIE), Mysuru.

### System Access
- **Local Development URL**: `http://localhost:5173`
- **Backend API URL**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`
- **Supported Browsers**: Chrome, Firefox, Edge, Safari (modern desktop and responsive mobile).

---

## 2. Global Navigation & Layout
- **Institutional Header**: Shows the NIE Mysuru badge, main navigation links ("Explore Ideas", "My Submissions", "Campus Leaderboard"), action CTA ("+ Post Idea"), notification bell with unread count badge, and user profile avatar.
- **Account Drawer**: Clicking on the top-right profile avatar opens the slide-over account drawer revealing student USN, CGPA, quick settings, and lab credentials.
- **Global Footer**: NIE Research Cell links, IP & Ethics policies, Faculty Guidelines, and academic copyright notices.

---

## 3. Core Feature Walkthroughs

### Workflow 1: Exploring Ideas & Collaborative Voting
1. Navigate to **Explore Ideas** (`/` or Home).
2. Use the search input or press `Cmd+K` (or `Ctrl+K`) to filter ideas by title, tech stack keywords (e.g. `ESP32`, `PyTorch`), or author name.
3. Filter by department or category pills (`All`, `AI/ML`, `Web`, `IoT`, `App`, `Other`).
4. Toggle sort between **Most Upvoted** (trending innovation) and **Newest** (recent submissions).
5. Click the upvote button (`thumb_up`) to endorse an idea or click "Collab / Interested" to register your interest.
6. Click on any card title to open the **Idea Detail View**.

### Workflow 2: Submitting a Proposal & AI Duplicate Pre-Check
1. Click the **"+ Post Idea"** button in the header or visit `/post`.
2. Fill out the proposal details:
   - **Project Title**: Concise title (min 10 characters).
   - **Category**: Select appropriate domain (AI/ML, IoT, Web, Mobile, Interdisciplinary).
   - **Project Maturity**: Concept, Prototype, or Validation.
   - **Detailed Description & Problem Statement**: Comprehensive explanation of the project context and technical implementation.
   - **Tech Stack Tags**: Tags like `React`, `FastAPI`, `OpenCV`, `ESP32`.
   - **Teammate Seeking**: Enable the cross-branch checkbox and select desired roles (e.g. `ECE Hardware`, `CSE Backend`, `UI/UX Designer`).
3. Click **"Check & Post Idea"**:
   - The platform sends the proposal to the AI duplicate detection engine.
   - **No Duplicate Detected (< 40% match)**: The proposal is published immediately and assigned to your submissions dashboard.
   - **High/Moderate Similarity Detected (>= 40% match)**: The **Duplicate Warning** screen is presented showing:
     - % match detected banner (e.g. 88% match).
     - Conflicting existing capstone proposal with author details.
     - Dimensional breakdown meters: Problem Context %, Hardware/Tech Choice %, Target Demographic %.
     - Action options: **"Upvote / Join Team Instead"** (fosters collaboration over duplication), **"Proceed with Separate Submission"**, or **"Request Mentor Mediation"**.

### Workflow 3: Teammate Matching & Open Roles
1. Navigate to the **Teammate Matching** tab (`/teammates`).
2. Filter open roles by technical domain (Frontend, AI/ML, Hardware/Embedded, UI/UX, Cloud) or branch.
3. Review team capacity (e.g., "2 of 4 slots filled") and expected kickoff date.
4. Click **"Request to Join"** to send your credentials directly to the project lead.

### Workflow 4: Campus Innovation Leaderboard
1. Click **Campus Leaderboard** (`/leaderboard`).
2. View the Top Innovators Podium (1st, 2nd, 3rd places with badges and innovation points).
3. View the Department Rankings Cup (CSE, ISE, ECE, Mech, AIML points).
4. Review the full student roster with points criteria breakdown (peer upvotes, seed grants, cross-branch teaming).

### Workflow 5: Managing Submissions & Notification Center
1. Click **My Submissions** (`/submissions`) to review your active capstones, endorsement counts, prototyping lab clearances, and team sprint statuses.
2. Click the **Notification Bell** (`/notifications`) to review teammate requests.
3. Directly **Accept** or **Decline** candidates with one click.

---

## 4. Troubleshooting & FAQ
- **Q: Why was my proposal flagged as a duplicate?**
  - *A*: The similarity engine evaluates semantic overlap against past NIE capstone archives. If another team already tackled the same problem with similar hardware or software stacks, consider joining their team or refining your unique value proposition.
- **Q: How are leaderboard points computed?**
  - *A*: Points are awarded for approved capstone proposals (100 pts), peer upvotes (10 pts each), forming cross-department teams (50 pts), and faculty mentor endorsements (150 pts).
- **Q: Can I edit a proposal after submission?**
  - *A*: Yes, from the **My Submissions** dashboard you can update project milestones, adjust open team roles, or request faculty review.

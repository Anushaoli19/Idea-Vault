# User Guide & Deployment Manual — NIE Idea Vault

## 1. Getting Started
Welcome to **NIE Idea Vault**, the official innovation and capstone collaboration platform for students and faculty of The National Institute of Engineering (NIE), Mysuru.

### System Access
- **Local Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Supported Browsers**: Chrome, Firefox, Edge, Safari (modern desktop and responsive mobile).

---

## 2. Pushing to GitHub

To publish the code to GitHub:
```bash
# Verify git status
git status

# Add your GitHub remote repository (replace with your personal or NIE organization URL)
git remote add origin https://github.com/<your-username>/nie-idea-vault.git

# Set active branch to main
git branch -M main

# Push all files and commit history
git push -u origin main
```

---

## 3. Deploying to Vercel

The application is pre-configured for instant zero-configuration deployment to Vercel.

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository (`nie-idea-vault`).
4. Vercel automatically detects the root `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
5. Click **"Deploy"**.
6. The application is live with all 13 Google Stitch screens immediately functional!

### Option B: Deploying Subdirectory `frontend/`
If you prefer setting the Vercel Root Directory to `frontend/`:
1. In Vercel Project Settings, select `frontend` as Root Directory.
2. Vercel will use `frontend/package.json` (`npm run build`) and output to `dist`.
3. `frontend/vercel.json` provides SPA fallback rewrites to `/index.html`.

### Option C: Deploying using Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 4. Core Feature Walkthroughs

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
   - The platform evaluates semantic overlap against past archives.
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

## 5. Troubleshooting & FAQ
- **Q: How does the AI Duplicate Detection work?**
  - *A*: The similarity engine uses TF-IDF vectorization and cosine similarity, breaking down matches across Problem Context, Hardware & Tech Choice, and Target Demographic.
- **Q: Does the Vercel deployment require a live backend server?**
  - *A*: No! The frontend client features a built-in hybrid fallback engine. If a live backend is specified via `VITE_API_BASE_URL`, it uses it; otherwise, it seamlessly runs the full application and similarity engine in-browser.
- **Q: How are leaderboard points computed?**
  - *A*: Points are awarded for approved capstone proposals (100 pts), peer upvotes (10 pts each), forming cross-department teams (50 pts), and faculty mentor endorsements (150 pts).

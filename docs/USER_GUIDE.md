# NIE Idea Vault - User & Operator Guide

## 1. Quick Start
1. Open `index.html` in any modern web browser (Google Chrome, Firefox, Safari, Edge).
2. No build tools or node servers are required (`USE_MOCK = true` is pre-configured).
3. The platform preloads 6 engineering capstone and research ideas from across NIE Mysuru departments.

## 2. Navigating the Platform
- **Explore Ideas (`index.html`)**:
  - Filter by category tabs: `All`, `AI/ML`, `Web`, `IoT`, `App`, `Other`.
  - Sort by `Most Upvoted` or `Newest`.
  - Instant live search by typing in the search bar (press `/` key to focus immediately).
  - Click on any card title to navigate to the deep-dive detail page (`idea.html?id=...`).
  - Click the **Upvote** or **Collab** buttons on cards for immediate optimistic counters.
- **Post an Idea (`post.html`)**:
  - Enter project title, department, innovation category, and detailed description.
  - Character counter alerts you if your proposal needs more technical depth.
  - Optional bill of materials (hardware chips, sensors, microcontrollers).
  - Automatic duplicate checker: If you submit a topic similar to an existing idea (e.g., "Smart hostel dining waste analytics"), the **Duplicate Warning** banner will catch it!
- **Idea Deep Dive (`idea.html`)**:
  - Problem Statement, Proposed System Architecture, and BOM Hardware & Sensor Registry.
  - Open Team Slots with real-time status (Available vs. Filled).
  - Interested students sidebar with "Express Interest" action and bookmarking.
- **Profile & Academic Settings (`profile.html`)**:
  - Access by clicking your avatar in the top right header navigation.
  - Displays Verified NIE Student Identity: Rohan Sharma, USN `4NI21CS089`, Department of CSE, Class of 2025.
  - Manage Developer Links: GitHub, LinkedIn, Personal Portfolio, Google Scholar.
  - Interactive Skills Chips: Type in any technical skill (e.g., PyTorch, Rust, Docker) and press Enter to add, or click `x` to remove.
  - Toggle Capstone Collaboration availability and teaming objective.
  - Download active Resume PDF (`Rohan_Sharma_CSE_Resume_2025.pdf`) or simulate replacing the file.
  - Click **Save Changes** (top or bottom) to persist updates in browser `localStorage`.
  - Click **Preview Public Profile** to inspect your verified student card modal.
  - Click **Export Submissions & Idea Log (JSON)** to download your entire portfolio payload.
- **My Submissions Dashboard (`submissions.html`)**:
  - Access by clicking **My Submissions** in the header navigation or the profile drawer.
  - View 4 high-level KPIs: Active Submissions, Campus Endorsements, Collaborator Inquiries, Teams in Prototyping.
  - Filter submitted projects by status: `All Submissions`, `Under Review`, `Approved & Open`, `Team Formed`, `Drafts & Warnings`.
  - Search across your proposals in real time.
  - Any new ideas submitted via `post.html` automatically appear dynamically at the top of the dashboard!
  - Review peer collaborator requests with one-click **Accept** and **Decline** actions.
  - Track Faculty Guides and TEQIP-III seed grant allocations.
  - Export a portfolio summary report in JSON format.

## 3. Switching to Real Backend Mode
When your Flask / Node.js backend is ready:
1. Open `app.js`.
2. Set `const USE_MOCK = false;`.
3. Set `const API_BASE = 'http://localhost:5000';` (or your backend domain).
4. Refresh the browser. All requests will route to the live REST API endpoints.

# NIE Idea Vault Platform 💡

Empowering engineering ingenuity at NIE Mysuru. Idea Vault is an open-source campus project registry and automated collaboration engine that allows students to discover capstone projects, detect near-duplicate proposals with similarity scoring, and form cross-departmental teams.

## 🚀 Key Features
- **Explore Ideas Board (`index.html`)**: Dynamic card grid with real-time multi-category filtering (`AI/ML`, `Web`, `IoT`, `App`, `Other`), keyword search, and segmented sorting (`Most Upvoted`, `Newest`).
- **Post Idea & Duplicate Detection (`post.html`)**: Submission pipeline integrated with automated similarity analysis (`POST /check-duplicate`). Highlights duplicate warnings with match percentage, existing project links, and "Post anyway" bypass.
- **Deep-Dive Idea Detail (`idea.html`)**: Complete technical project specifications, hardware/BOM specs, open teammate collaboration roles, interested peer roster, and interactive upvoting.
- **Zero-Backend Mock Mode**: Built-in `USE_MOCK = true` flag in `app.js` with 6 realistic sample ideas and realistic near-duplicate detection.
- **Persistent Local State**: `localStorage` double-vote prevention and real-time counter updates.

## 📁 Project Structure
```text
idea-vault/
├── index.html              # Home / Idea Board
├── post.html               # Submit Idea & Duplicate Warning screen
├── idea.html               # Deep-Dive Idea Detail view & loading skeleton
├── app.js                  # Shared vanilla JS client, mock engine & state
├── styles.css              # Stitch design system tokens, animations & toast styles
├── .gitignore              # Git ignore rules
├── .env.example            # Environment variables template
├── AGENTS.md               # Rules and directives for AI agents
├── README.md               # Project documentation
└── docs/                   # Fullstack living documentation harness (10 docs)
    ├── PRD.md
    ├── ARCHITECTURE.md
    ├── USER_GUIDE.md
    ├── TASK.md
    ├── DECISION.md
    ├── LESSONS.md
    ├── CONTEXT.md
    ├── DATA_PRIVACY.md
    ├── SECURITY_AUDIT.md
    └── HANDOFF.md
```

## 🛠️ Quick Start
1. Open `index.html` directly in any web browser, or serve using any static web server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node npx
   npx serve .
   ```
2. Navigate to `http://localhost:3000` to explore the Idea Board.
3. Test posting a new idea on `post.html`. Try submitting "Hostel Food Waste" to trigger the Duplicate Warning flow!

# NIE Idea Vault — Campus Innovation Platform

NIE Idea Vault is an end-to-end campus innovation portal built for the National Institute of Engineering. It empowers engineering students to showcase capstone ideas, discover interdisciplinary collaborators, crowdsource campus feedback, view campus leaderboards, and prevent duplicate submissions via an intelligent machine-learning duplicate detection engine.

## Features
- **Stitch Design System UI**: 13 desktop screens generated with Google Stitch, including Idea Board, Post Idea, Duplicate Warning Modal, Detail Views (with loading skeletons & Smart Energy Grid showcase), Submissions Dashboard, Campus Leaderboard, Teammate Matching, and Profile Drawer.
- **AI Duplicate Detection**: Scikit-Learn TF-IDF vectorizer and cosine similarity engine flags semantically similar project ideas in real time to prevent duplicate capstone submissions.
- **Team Formation & Role Matching**: Students can advertise open roles (Frontend, Backend, Firmware, ML) and apply with one click.
- **Engagement & Voting**: Real-time upvoting, interest registration, and category-based filtering.
- **Robust Python Backend**: Flask REST API backed by SQLite with parameterized queries, comprehensive error handling, and CORS support.

## Architecture & Tech Stack
- **Backend**: Python 3.11+, Flask, SQLite3, scikit-learn (`TfidfVectorizer`), NumPy
- **Frontend**: HTML5, Tailwind CSS (Stitch Theme Tokens), Material Symbols Outlined, Vanilla ES6 JavaScript
- **Living Documentation**: 10 Living Docs governance harness in `docs/`

## Quickstart

### Prerequisites
- Python 3.11+
- Web browser (Chrome / Edge / Firefox)

### 1. Environment Setup
```bash
# Activate virtual environment
.venv\Scripts\activate   # On Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Run Application
```bash
# Run from repository root
python app.py
```
Backend API will be running on: `http://127.0.0.1:5000`  
Frontend application accessible directly at: `http://127.0.0.1:5000`  
Stitch Screen Directory (All 13 screens): `http://127.0.0.1:5000/screens`

### 3. Run Automated Tests
```bash
python -m unittest backend/test_backend.py backend/test_e2e.py
```

## Documentation Index
- [Product Requirements Document (PRD)](./docs/PRD.md)
- [System Architecture & Specifications](./docs/ARCHITECTURE.md)
- [User Guide & Workflows](./docs/USER_GUIDE.md)
- [Implementation Task Checklist](./docs/TASK.md)
- [Architecture Decision Records (ADR)](./docs/DECISION.md)
- [Lessons Learned & Self-Correction Log](./docs/LESSONS.md)
- [Active Project Context](./docs/CONTEXT.md)
- [Data Privacy & Secrets Policy](./docs/DATA_PRIVACY.md)
- [Security Audit & Hardening Matrix](./docs/SECURITY_AUDIT.md)
- [Session Continuity Handoff](./docs/HANDOFF.md)

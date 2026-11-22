# Project Context & Active State — NIE Idea Vault

## 1. Project Overview & Identity
- **Project**: NIE Idea Vault
- **Domain**: Higher Education, Student Innovation, Capstone Project Management
- **Repository State**: Complete Full-Stack Implementation & Pushed to GitHub (`https://github.com/Anushaoli19/Idea-Vault` and `https://github.com/Ramcharan77587/idea-vault`) on branch `main`

## 2. Active Focus & Immediate Sprint
- **Current Phase**: Phase 6 — Stitch Screens Standalone Expansion & Central Directory
- **Active Task**: All 13 Stitch desktop screens implemented as dedicated standalone files (`screen_01_*.html` through `screen_13_*.html` and aliases `screen_1.html` through `screen_13.html`), raw designs preserved in `frontend/stitch/`, central directory at `frontend/screens.html` (`/screens`), and 25/25 automated tests passing.
- **Current Blocker(s)**: None. Every screen (specifically screens 7, 8, 9, 10, 11, 12, 13) is accessible both as standalone, live app, and raw Stitch design.

## 3. Local Environment & Ports
- **Backend API**: `http://127.0.0.1:5000` (Flask Python REST API)
- **Frontend App**: `http://127.0.0.1:5000` (Flask static serving or local browser preview `frontend/index.html`)
- **Database**: SQLite3 (`backend/idea_vault.db`)
- **Python Environment**: `.venv` (Python 3.11+)

## 4. Design & UI System Standards
- **Design System**: Google Stitch Design System tokens
- **Primary Color**: `#3525cd`
- **Primary Container**: `#4f46e5`
- **Secondary Color**: `#006c49`
- **Surface**: `#f8f9ff`
- **Typography**: Inter (Body, Label, Title, Headline)
- **Iconography**: Material Symbols Outlined

## 5. Domain Invariants & Business Rules
- Invariant 1: Duplicate idea detection evaluates both description-to-description and combined title+description using TF-IDF + Cosine Similarity. Similarity >= 40.0% blocks submission with HTTP 409 Conflict.
- Invariant 2: Students can bypass the duplicate gate using `force: true` ("Proceed with separate submission").
- Invariant 3: Upvotes and interest expressions are uniquely recorded per student USN (`4NI21...`) to prevent vote inflation.
- Invariant 4: All 13 Stitch Desktop Screens are implemented across 9 primary HTML views + 4 interactive embedded states.

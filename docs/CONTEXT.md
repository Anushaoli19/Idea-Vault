# Project Context & Active State — NIE Idea Vault

## 1. Project Overview & Identity
- **Project**: NIE Idea Vault
- **Institution**: The National Institute of Engineering (NIE), Mysuru
- **Domain**: Higher Education Capstone & Innovation Collaboration Portal
- **Repository State**: Scaffolding / Blueprint Verification Gate

## 2. Active Focus & Immediate Sprint
- **Current Phase**: Phase 1 — Scaffolding & Setup (Blueprint Presentation Gate)
- **Active Task**: Blueprint confirmation with user prior to application code generation
- **Current Blocker(s)**: None (Awaiting user blueprint approval)

## 3. Local Environment & Ports
- **Backend API**: `http://localhost:8000` (FastAPI / `uv`)
- **Interactive OpenAPI Docs**: `http://localhost:8000/docs`
- **Frontend App**: `http://localhost:5173` (Vite / React 18 / TypeScript)
- **Database**: SQLite (`backend/app.db`)

## 4. Design & UI System Standards
- **Design Baseline**: Google Stitch Academic SaaS (`nie_idea_vault/DESIGN.md`)
- **Primary Color**: `#4F46E5` / `#3525CD` (Electric Indigo)
- **Surface**: `#F8F9FF` (Crisp off-white)
- **Containers**: `#EFF4FF` (Low), `#E5EEFF` (Standard), `#CBDBF5` (Border/Dim)
- **Status Accents**: `#006C49` (Secondary Emerald), `#885500` / `#684000` (Amber Alert), `#BA1A1A` (Error)
- **Typography**: Inter with strict type scales (`display-lg`, `headline-lg`, `title-md`, `body-md`, `label-sm`)
- **Iconography**: Google Material Symbols Outlined

## 5. Domain Assumptions & Business Rules
- Assumption 1: Students are associated with NIE departments (CSE, ISE, ECE, Mech, AIML, Civil) and graduation batch years (e.g. '25).
- Assumption 2: Duplicate check triggers on submission and reports percentage match + breakdown across Problem Context, Hardware/Tech, and Demographic.
- Assumption 3: The app includes pre-seeded campus capstones (e.g. "Automated Hostel Mess Food Waste Auditor", "Smart Campus Energy Grid & Microgrid Optimizer", "Autonomous Campus Mail Delivery Bot") to provide a rich out-of-the-box experience.

# Architecture Decision Records (ADR) — NIE Idea Vault

Format: Append-only ledger of major architectural and design decisions.

---

## ADR-001: Initial Architecture & Full-Stack Framework Selection
- **Status**: Accepted
- **Date**: 2026-11-22
- **Context**: The NIE Idea Vault requires a high-performance, responsive academic innovation portal featuring instantaneous search, interactive forms, AI-powered duplicate text detection, and a Google Stitch compliant design system.
- **Considered Alternatives**:
  1. Next.js Fullstack (Server Components + Python microservice): Adds operational complexity by running two servers or requiring heavy Python FFI in Node.js.
  2. Django + Jinja Templates: Slower page transitions, lacking modern reactive client ergonomics for live similarity warnings and interactive filters.
  3. FastAPI (Python 3.13 / uv) + React (Vite / TypeScript / Tailwind): Selected. Enables native Python machine learning library integration (Scikit-Learn TF-IDF vectorization) within the primary API gateway, paired with a blazing-fast SPA frontend.
- **Decision Outcome**: Selected FastAPI managed with `uv` for the backend API and Vite + React + TypeScript + Tailwind CSS for the frontend client.
- **Consequences & Trade-offs**:
  - *Positive*: Unmatched typing consistency via Pydantic and TypeScript, immediate Python ML similarity calculation without external microservices, sub-millisecond local SQLite queries.
  - *Negative*: Dual-port development setup (`localhost:8000` and `localhost:5173`) requiring strict CORS configuration.

---

## ADR-002: AI Duplicate Detection Engine via Scikit-Learn TF-IDF
- **Status**: Accepted
- **Date**: 2026-11-22
- **Context**: Capstone proposals must be pre-checked against past archives in real-time (< 150ms) to identify redundant projects without requiring external third-party API dependencies or expensive cloud LLM latency.
- **Considered Alternatives**:
  1. Remote Cloud LLM API (e.g., calling an external LLM for every keystroke): High latency (> 1.5s), network failure risks, external API costs.
  2. Levenshtein / Exact String Matching: Fails to detect semantic paraphrasing or equivalent technical keywords.
  3. Scikit-learn TF-IDF with N-Gram Vectorization and Cosine Similarity: Selected. Runs locally in under 15ms, provides transparent numerical breakdown across Problem Context, Hardware/Tech Choice, and Target Demographic.
- **Decision Outcome**: Implemented Scikit-Learn `TfidfVectorizer` with cosine similarity, paired with sub-vector cosine computations for granular percentage breakdown meters.

---

## ADR-003: UI Design System & Component Fidelity
- **Status**: Accepted
- **Date**: 2026-11-22
- **Context**: The platform UI must match the Google Stitch academic SaaS aesthetic defined in `nie_idea_vault/DESIGN.md` across all 13 screens.
- **Decision Outcome**: Integrated exact color palette (Electric Indigo `#4F46E5`, Surface `#F8F9FF`, Containers `#EFF4FF`/`#CBDBF5`, Emerald `#006C49`, Amber `#684000`), Google Inter typography, and Google Material Symbols Outlined.

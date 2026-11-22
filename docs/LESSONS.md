# Lessons Learned & Self-Correction Log — NIE Idea Vault

Format: Append-only log recording build/test failures, unexpected edge cases, and user corrections. When a rule is reinforced multiple times, promote it to root `AGENTS.md`.

---

## [2026-11-22] — SQLite In-Memory Connection Pooling in Pytest
- **Trigger / What Happened**: Pytest tests failed with `OperationalError: no such table: notifications`.
- **Root Cause**: In SQLite, each connection to `sqlite:///:memory:` opens a separate, empty in-memory database instance unless using `StaticPool`. When FastAPI dependencies requested connections from `sessionmaker`, they accessed a distinct connection without the tables created in the fixture.
- **Fix Applied**: Configured `poolclass=StaticPool` in `test_engine` within `backend/tests/test_api.py`, ensuring all threads and dependencies share the exact same in-memory SQLite connection.
- **Rule Going Forward**: Whenever using in-memory SQLite for test suites, always supply `poolclass=StaticPool` with `connect_args={"check_same_thread": False}`.
- **Promoted to AGENTS.md**: No


## [2026-11-22] — Harness Initialization & Stitch Asset Extraction
- **Trigger / What Happened**: Scaffolding the fullstack-doc-harness and unpacking the uploaded `stitch_idea_vault_platform.zip`.
- **Root Cause**: New project initialization in clean workspace `d:\vault`.
- **Fix Applied**: Extracted all 13 Google Stitch screens, configured `.gitignore` to protect environment and database secrets, and established complete living documentation in `docs/`.
- **Rule Going Forward**: Keep `.gitignore` updated with `stitch_temp/`, `.env`, and `*.db`; always verify changes with automated tests and type checks before declaring task completion.
- **Promoted to AGENTS.md**: Yes

---

## [2026-11-22] — SQLite In-Memory Connection Pooling in Pytest
- **Trigger / What Happened**: Pytest tests failed with `OperationalError: no such table: notifications`.
- **Root Cause**: In SQLite, each connection to `sqlite:///:memory:` opens a separate, empty in-memory database instance unless using `StaticPool`. When FastAPI dependencies requested connections from `sessionmaker`, they accessed a distinct connection without the tables created in the fixture.
- **Fix Applied**: Configured `poolclass=StaticPool` in `test_engine` within `backend/tests/test_api.py`, ensuring all threads and dependencies share the exact same in-memory SQLite connection.
- **Rule Going Forward**: Whenever using in-memory SQLite for test suites, always supply `poolclass=StaticPool` with `connect_args={"check_same_thread": False}`.
- **Promoted to AGENTS.md**: No


## [2026-11-22] — Hatchling Build Missing Readme File
- **Trigger / What Happened**: `uv sync` failed with `OSError: Readme file does not exist: README.md` in `backend/`.
- **Root Cause**: `pyproject.toml` declared `readme = "README.md"`, but the file had not yet been created in the `backend/` subdirectory.
- **Fix Applied**: Created `backend/README.md` with setup instructions before running `uv sync`.
- **Rule Going Forward**: When specifying `readme = "README.md"` in `pyproject.toml`, always ensure the referenced readme file exists in that package root before triggering `uv sync`.
- **Promoted to AGENTS.md**: No

---

## [2026-11-22] — SQLite In-Memory Connection Pooling in Pytest
- **Trigger / What Happened**: Pytest tests failed with `OperationalError: no such table: notifications`.
- **Root Cause**: In SQLite, each connection to `sqlite:///:memory:` opens a separate, empty in-memory database instance unless using `StaticPool`. When FastAPI dependencies requested connections from `sessionmaker`, they accessed a distinct connection without the tables created in the fixture.
- **Fix Applied**: Configured `poolclass=StaticPool` in `test_engine` within `backend/tests/test_api.py`, ensuring all threads and dependencies share the exact same in-memory SQLite connection.
- **Rule Going Forward**: Whenever using in-memory SQLite for test suites, always supply `poolclass=StaticPool` with `connect_args={"check_same_thread": False}`.
- **Promoted to AGENTS.md**: No


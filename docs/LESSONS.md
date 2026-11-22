# Lessons Learned

## [2026-11-22] — Stitch MCP IPv6 Socket Fallback on Windows
- **Trigger / What Happened**: Direct MCP calls through `mcp-remote` timed out (`ConnectTimeoutError`) due to Node.js attempting IPv6 addresses of `stitch.googleapis.com` before falling back to IPv4 after the default 10s timeout.
- **Root Cause**: Node.js default DNS resolution on Windows prioritizes IPv6 which experiences packet drop/timeout on certain network topologies.
- **Fix Applied**: Utilized HTTP client with Schannel / IPv4 fallback to query the Stitch MCP tools (`list_projects`, `list_screens`, `download_file`) reliably.
- **Rule Going Forward**: When making upstream Google API requests on Windows Node environments, ensure IPv4 is prioritized or timeout is sufficiently high.

## [2026-11-22] — Test Idempotency for Password Modification Endpoints
- **Trigger / What Happened**: Subsequent test runs of `test_13_change_password` failed with HTTP 403 because the password change from the prior test run persisted in SQLite.
- **Root Cause**: The password update endpoint alters database state directly without automatic rollback in the test fixture.
- **Fix Applied**: Added explicit pre-test reset and post-test cleanup to restore the default student password (`NieMysuru@2025`) in `test_backend.py`.
- **Rule Going Forward**: Every test modifying database state must ensure idempotent teardown or fixture resetting so test suites can be executed repeatedly without state pollution.

## [2026-11-22] — Flask static_folder Interception of Cascading Static Routing
- **Trigger / What Happened**: Serving standalone screen files located in subdirectories (`frontend/screens/`) returned HTTP 404 despite existing in `os.path.join(SCREENS_DIR, ...)`.
- **Root Cause**: Flask's built-in static endpoint intercepts all matching root paths when `static_folder` and `static_url_path=""` are set on the `Flask` constructor, bypassing any custom `@app.route("/<path:path>")` fallback handlers.
- **Fix Applied**: Initialized `Flask(__name__, static_folder=None)` and implemented a unified cascading route handler checking `frontend/`, `frontend/screens/`, and `frontend/stitch/` in priority order.
- **Rule Going Forward**: In Flask single-service full-stack apps serving assets from multiple directory trees, disable Flask's default static folder (`static_folder=None`) to allow explicit cascading route resolution.

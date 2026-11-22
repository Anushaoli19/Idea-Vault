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

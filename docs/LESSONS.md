# Lessons Learned & Self-Correction Log

## [2026-11-22] — Stitch MCP IPv6 Socket Fallback on Windows
- **Trigger / What Happened**: Direct MCP calls through `mcp-remote` timed out (`ConnectTimeoutError`) due to Node.js attempting IPv6 addresses of `stitch.googleapis.com` before falling back to IPv4 after the default 10s timeout.
- **Root Cause**: Node.js default DNS resolution on Windows prioritizes IPv6 which experiences packet drop/timeout on certain network topologies.
- **Fix Applied**: Utilized Python HTTP client forcing IPv4 (`socket.AF_INET`) to query the Stitch MCP tools (`list_projects`, `list_screens`, `download_file`) reliably.
- **Rule Going Forward**: When making upstream Google API requests on Windows Node environments, ensure IPv4 is prioritized or timeout is sufficiently high.
- **Promoted to AGENTS.md**: No (local environment specific).

# Active Context & Working State

## Current Focus
- Complete frontend implementation of NIE Idea Vault platform from Stitch screens (`index.html`, `post.html`, `idea.html`, `app.js`, `styles.css`).
- Zero-backend mock mode with 6 sample ideas including near-duplicates ("Automated Hostel Mess Food Waste Auditor with Computer Vision" and "Smart Hostel Dining Waste Analytics & Tracking Platform").
- Instant optimistic upvote and collaboration interest with `localStorage` anti-double vote lock.

## Environment & Ports
- **Frontend Running**: Any static web server (e.g., port 3000 / 5500 / 8080) or opened directly via browser.
- **Backend API Base**: Default `http://localhost:5000` (controlled via `API_BASE` in `app.js`).
- **Mode**: `USE_MOCK = true` by default.

## Next Steps
- Implement frontend files (`styles.css`, `app.js`, `index.html`, `post.html`, `idea.html`).
- Validate end-to-end user journeys (Card exploration, duplicate detection popup, idea deep dive).

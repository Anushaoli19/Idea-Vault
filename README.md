# Idea Vault - Integrated Fullstack Platform 💡

Empowering engineering ingenuity at NIE Mysuru. **Idea Vault** is a campus project innovation registry, duplicate detection pipeline, and student peer collaboration hub. It allows students to discover capstone proposals, detect near-duplicate ideas using TF-IDF and Cosine Similarity, upvote proposals, express collaboration interest, and manage their academic portfolios.

---

## 🏗️ System Architecture

The platform combines a lightweight, high-performance Python Flask backend with an accessible, high-fidelity vanilla frontend designed with Google's Material Stitch design tokens.

```text
idea-vault/
├── app.py                  # Flask REST API server with CORS integration
├── database.py             # SQLite connection & schema management (ideas, upvotes, interests)
├── duplicate_detection.py  # Scikit-learn TF-IDF + Cosine Similarity engine (40% threshold)
├── requirements.txt        # Python backend dependencies
├── API_DOCUMENTATION.md    # Detailed API endpoint reference
├── README.md               # Project documentation & run guide
├── docs/                   # 10 living documentation harness files
└── frontend/               # Modular frontend application
    ├── index.html          # Idea Board (Search, Category Filters, Segmented Sorting)
    ├── post.html           # Post Idea Form & Duplicate Warning Screen
    ├── idea.html           # Deep-Dive Proposal Detail View & BOM Registry
    ├── profile.html        # Verified Student Profile & Academic Settings
    ├── submissions.html    # My Submissions & Project Vault Dashboard
    ├── app.js              # Vanilla JS Engine, Backend Adapter & Local State
    └── styles.css          # Stitch theme tokens, animations & toast styles
```

---

## 📡 API Specification

| Method | Endpoint | Request Body | Response (Success / Conflict) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/ideas` | None | `200 OK` (Array of idea objects) | Retrieves all ideas with live upvote & interested student counts. |
| `POST` | `/ideas` | `{"title": str, "description": str, "category": str}` | `201 Created` (`{"idea_id": int, "duplicate": false}`) OR `409 Conflict` (`{"duplicate": true, "similarity_score": float, "similar_idea": obj}`) | Runs duplicate check; submits idea or returns duplicate warning. |
| `POST` | `/ideas/<id>/upvote` | `{"student_id": str}` | `200 OK` (`{"upvotes": int}`) OR `409 Conflict` (`{"error": "already upvoted"}`) | Upvotes an idea; enforces VTU student USN identity lock. |
| `POST` | `/ideas/<id>/interest` | `{"student_id": str}` | `200 OK` (`{"interested_students": int}`) OR `409 Conflict` (`{"error": "already expressed interest"}`) | Registers collaboration interest with project lead. |

---

## 🔍 How Duplicate Detection Works

The backend utilizes `scikit-learn` in `duplicate_detection.py`:
1. **TF-IDF Vectorization**: Transforms existing proposal descriptions and the newly submitted proposal into numerical term-frequency inverse-document-frequency vectors (`stop_words="english"`).
2. **Cosine Similarity**: Measures the angular cosine distance between the candidate proposal vector and all archived proposals.
3. **Threshold Gate (40%)**: If the highest similarity score $\ge 0.40$ (40%), the backend flags the proposal as a duplicate and returns HTTP 409 with the match percentage and existing proposal data.
4. **Duplicate Warning UI**: The frontend catches this response and reveals the **Duplicate Warning Banner**, displaying the match score, matched title, excerpt, and link to the existing idea.

---

## 🚀 How to Run

### Step 1: Clone or Navigate to the Repository
```bash
cd "d:\idea vault"
```

### Step 2: Install Backend Dependencies
Make sure Python 3.8+ is installed. Install the required Python packages:
```bash
pip install -r requirements.txt
```

### Step 3: Initialize the SQLite Database
Create the database tables (`ideas`, `upvotes`, `interests`):
```bash
python database.py
```

### Step 4: Start the Flask Backend Server
```bash
python app.py
```
The backend API server will start on:
```text
http://127.0.0.1:5000
```

### Step 5: Run / View the Frontend
You can run the frontend using either option:

* **Option A: Serve via Python HTTP Server (Recommended)**
  Open a new terminal window in the project root and run:
  ```bash
  python -m http.server 8000 --directory frontend
  ```
  Then open your web browser and navigate to:
  ```text
  http://localhost:8000
  ```

* **Option B: Open Directly in Browser**
  Simply double-click or open `frontend/index.html` in Google Chrome, Microsoft Edge, Firefox, or Safari.

---

## 🧪 Testing Duplicate Detection Live

1. Navigate to **Post Idea** (`http://localhost:8000/post.html`).
2. Fill out and submit an initial idea:
   * **Title**: `Automated Hostel Mess Food Waste Auditor with Computer Vision`
   * **Description**: `An automated food waste auditing platform using edge computer vision cameras and load cell weight sensors installed above campus mess disposal bins to track dining food waste.`
   * **Category**: `AI/ML`
   * Click **Check & Submit Proposal** -> Proposal is registered (HTTP 201).
3. Attempt to submit a near-identical proposal:
   * **Title**: `Smart Hostel Dining Waste Analytics & Tracking Platform`
   * **Description**: `An automated food waste auditing platform using edge computer vision cameras and load cell weight sensors installed above hostel mess disposal bins to track dining food waste.`
   * **Category**: `AI/ML`
   * Click **Check & Submit Proposal**.
4. The system triggers the **Duplicate Warning Screen** showing **~93% Technical Similarity**, displaying the existing idea title, excerpt, and link to inspect the original proposal!

# Idea Vault – Comprehensive Backend API Documentation

**Backend Framework:** Python Flask  
**Database:** SQLite (`idea_vault.db`)  
**Base URL:** `http://127.0.0.1:5000`  
**CORS Enabled:** Yes (`Access-Control-Allow-Origin: *`)  

---

## 1. Retrieve All Ideas
**Method:** `GET`  
**Endpoint:** `/ideas`  

**Query Parameters (Optional):**
- `category` (string, e.g., `IoT`, `AI/ML`, `Web`, `All`)
- `sort` (string: `upvoted` | `newest`, default: `newest`)
- `search` (string: case-insensitive keyword search across title, description, architecture, department, tags)
- `author_usn` (string, e.g., `4NI21CS089`)

**Response (`200 OK`):**
```json
[
  {
    "id": 1,
    "nie_id": "NIE-25-MECH-042",
    "title": "Automated Hostel Mess Food Waste Auditor with Computer Vision",
    "description": "Overhead camera tracking tray returns at Mysuru campus hostel mess...",
    "category": "IoT",
    "categoriesBadge": "IoT • AI/ML",
    "department": "Mechanical Engineering",
    "departmentShort": "Mech Dept",
    "stage": "In Prototyping",
    "tags": ["Computer Vision", "YOLOv8", "NVIDIA Jetson"],
    "bom": [{"item": "NVIDIA Jetson Orin Nano", "spec": "40 TOPS", "qty": 1, "cost": "₹42,000"}],
    "teamSlots": [{"role": "Embedded Linux Specialist", "status": "Available"}],
    "authorName": "Ananya Deshmukh",
    "authorUsn": "4NI21ME014",
    "authorBatch": "Mech '25",
    "authorAvatar": "https://...",
    "upvotes": 3,
    "interests": 1,
    "interested_students": 1,
    "created_at": "2026-11-22 10:00:00"
  }
]
```

---

## 2. Retrieve Single Idea Detail
**Method:** `GET`  
**Endpoint:** `/ideas/<int:idea_id>`  

**Response (`200 OK`):**
Returns the idea object with all technical specifications plus the list of interested peers:
```json
{
  "id": 1,
  "title": "Automated Hostel Mess Food Waste Auditor with Computer Vision",
  "problemStatement": "In the NIE South Campus dining halls...",
  "architecture": "Dual stereoscopic RGB cameras stream 1080p frames...",
  "bom": [...],
  "teamSlots": [...],
  "interestedUsers": [
    {
      "id": "4NI21EC019",
      "name": "Darshan Gowda",
      "department": "Electronics & Comm.",
      "batch": "ECE '25",
      "avatar": "https://...",
      "role": "Hardware Lead",
      "message": "Interested in building the Jetson Orin Nano fixture.",
      "status": "pending"
    }
  ],
  "upvotes": 3,
  "interests": 1
}
```

---

## 3. Pre-Submission Duplicate Check
**Method:** `POST`  
**Endpoint:** `/check-duplicate`  

**Request Body:**
```json
{
  "title": "Smart Mess Food Waste Tracker",
  "description": "Overhead camera tracking tray returns at Mysuru hostel mess to quantify food wastage.",
  "category": "IoT"
}
```

**Response (`200 OK`):**
```json
{
  "is_duplicate": true,
  "duplicate": true,
  "similarity_score": 84.19,
  "similar_idea": {
    "id": 1,
    "title": "Automated Hostel Mess Food Waste Auditor with Computer Vision",
    "description": "Overhead camera tracking tray returns...",
    "category": "IoT"
  }
}
```

---

## 4. Submit a New Idea
**Method:** `POST`  
**Endpoint:** `/ideas`  

**Request Body:**
```json
{
  "title": "Autonomous Drone Inspection for Campus Solar Rooftops",
  "description": "Autonomous waypoint navigation drone equipped with FLIR thermal imaging...",
  "category": "AI/ML & IoT",
  "department": "Electrical & Electronics Engineering",
  "stage": "Ideation",
  "tags": ["Drone", "Solar PV", "Thermal Imaging"],
  "bom": [{"item": "DJI Matrice 300 RTK", "spec": "Dual Gimbal", "qty": 1, "cost": "₹3,50,000"}],
  "roles": [{"role": "Drone Pilot / Operator", "status": "Available"}],
  "force": false
}
```

**Responses:**
- `201 Created` on successful creation:
  ```json
  {
    "message": "Idea submitted successfully!",
    "idea_id": 7,
    "idea": { ... },
    "duplicate": false
  }
  ```
- `409 Conflict` if similarity $\ge 40\%$ and `force` is `false`:
  ```json
  {
    "message": "A similar idea already exists!",
    "duplicate": true,
    "similarity_score": 84.19,
    "similar_idea": { ... }
  }
  ```
- Pass `"force": true` to bypass the duplicate check and proceed with submission ("Post anyway" option).

---

## 5. Upvote an Idea
**Method:** `POST`  
**Endpoint:** `/ideas/<int:idea_id>/upvote`  

**Request Body:**
```json
{
  "student_id": "4NI21CS089"
}
```

**Responses:**
- `200 OK`: `{"message": "Upvote recorded successfully!", "upvotes": 4}`
- `409 Conflict`: `{"error": "You have already upvoted this idea"}`

---

## 6. Express Collaboration Interest
**Method:** `POST`  
**Endpoint:** `/ideas/<int:idea_id>/interest`  

**Request Body:**
```json
{
  "student_id": "4NI21CS089",
  "student_name": "Rohan Sharma",
  "student_dept": "Computer Science & Engineering",
  "student_batch": "CSE '25",
  "role_requested": "Backend Lead",
  "message": "Excited to collaborate on the API and data pipeline!"
}
```

**Responses:**
- `200 OK`: `{"message": "Interest recorded successfully!", "interested_students": 2}`
- `409 Conflict`: `{"error": "You have already expressed interest"}`

---

## 7. Manage Collaborator Inquiries
**Method:** `POST`  
**Endpoint:** `/inquiries/<int:inquiry_id>/action`  

**Request Body:**
```json
{
  "action": "accept" 
}
```
*(Accepts `"accept"` or `"decline"`)*

---

## 8. Student Profile & Settings
**Method:** `GET` / `POST`  
**Endpoint:** `/profile`  

- `GET /profile?usn=4NI21CS089`: Returns full student identity, skills chips, developer links, and teaming preferences.
- `POST /profile`: Updates profile fields in SQLite.

---

## 9. My Submissions & Dashboard Telemetry
**Method:** `GET`  
**Endpoint:** `/my-submissions?student_id=4NI21CS089`  

**Response (`200 OK`):**
Returns aggregated summary statistics (`total_submissions`, `total_endorsements`, `collaborator_inquiries`, `in_prototyping`), all proposals authored by the student, and incoming collaborator requests.

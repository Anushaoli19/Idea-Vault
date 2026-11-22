# System Architecture & Technical Specifications — NIE Idea Vault

## 1. System Topology & Architecture Diagram
```mermaid
graph TD
    subgraph Frontend ["Client Layer (13 Stitch Screens & Tokens)"]
        UI_Home["Home / Idea Board (index.html)"]
        UI_Post["Post Idea & Duplicate Warning (post.html)"]
        UI_Detail["Idea Detail & Loading Skeletons (idea.html)"]
        UI_Submissions["My Submissions Dashboard (submissions.html)"]
        UI_Leaderboard["Campus Leaderboard (leaderboard.html)"]
        UI_Teammates["Teammate Matching & Open Roles (teammates.html)"]
        UI_Notifications["Notification Center (notifications.html)"]
        UI_Settings["Settings & Security (settings.html)"]
        UI_Profile["Profile & Academic Settings (profile.html)"]
        UI_Drawer["Global Account Menu & Profile Drawer (app.js)"]
        Core_JS["Core App Engine (app.js)"]
        Tailwind["Stitch Theme Tokens & Tailwind CSS"]
    end

    subgraph Backend ["Python Backend Layer (Flask REST API)"]
        API["Flask Application (app.py)"]
        CORS["Flask-CORS Middleware"]
        DupEngine["Duplicate Detection Engine (duplicate_detection.py)"]
        DB_Layer["Database Adapter (database.py)"]
    end

    subgraph Storage ["Persistence Layer"]
        SQLite[("SQLite3 Database (idea_vault.db)")]
        LocalStorage[("Browser LocalStorage (Session / Preferences)")]
    end

    UI_Home --> Core_JS
    UI_Post --> Core_JS
    UI_Detail --> Core_JS
    UI_Submissions --> Core_JS
    UI_Leaderboard --> Core_JS
    UI_Teammates --> Core_JS
    UI_Notifications --> Core_JS
    UI_Settings --> Core_JS
    UI_Profile --> Core_JS
    UI_Drawer --> Core_JS

    Core_JS -->|REST API / JSON| API
    Core_JS --> LocalStorage
    API --> CORS
    API --> DupEngine
    API --> DB_Layer
    DB_Layer --> SQLite
```

## 2. Request Lifecycle & Duplicate Check Data Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as Student Innovator
    participant UI as Post Idea Form (post.html)
    participant JS as Client Engine (app.js)
    participant API as Flask Backend (/ideas)
    participant ML as Duplicate Engine (TF-IDF)
    participant DB as SQLite (idea_vault.db)

    User->>UI: Fills Title, Category, Description
    User->>UI: Clicks "Check & Submit Proposal"
    UI->>JS: Validate fields
    JS->>API: POST /ideas (with payload)
    API->>DB: Fetch all existing idea titles & descriptions
    DB-->>API: Stored ideas corpus
    API->>ML: detect_duplicate(title, desc, existing_ideas)
    ML->>ML: Vectorize with TfidfVectorizer & Cosine Similarity
    alt Similarity Score >= 40% (Duplicate Detected)
        ML-->>API: { is_duplicate: true, score: 78.4, similar_idea: {...} }
        API-->>JS: HTTP 409 Conflict with duplicate diagnostics
        JS->>UI: Open "Duplicate Warning" Banner / Modal (Screen 6)
        UI-->>User: Displays match percentage, existing idea lead & "Proceed with separate submission" button
        opt User Chooses Bypass
            User->>UI: Clicks "Proceed with separate submission"
            UI->>API: POST /ideas with { force: true }
            API->>DB: INSERT INTO ideas (...)
            DB-->>API: idea_id created
            API-->>JS: HTTP 201 Created
            JS->>UI: Redirect to Idea Detail with success toast
        end
    else Similarity Score < 40% (Novel Idea)
        ML-->>API: { is_duplicate: false, score: 12.1 }
        API->>DB: INSERT INTO ideas (...)
        DB-->>API: idea_id created
        API-->>JS: HTTP 201 Created { idea_id, duplicate: false }
        JS->>UI: Redirect to Idea Detail with success toast
    end
```

## 3. Database Schema & Data Models
```mermaid
erDiagram
    IDEAS ||--o{ UPVOTES : receives
    IDEAS ||--o{ INTERESTS : gathers
    IDEAS ||--o{ ROLES : offers
    PROFILES ||--o{ NOTIFICATIONS : receives

    IDEAS {
        int id PK
        string title
        text description
        string category
        string department
        string author_name
        string author_usn
        string author_batch
        text problem_statement
        text proposed_solution
        text architecture
        text bom_json
        text tags_json
        timestamp created_at
    }

    UPVOTES {
        int id PK
        int idea_id FK
        string student_id
        timestamp created_at
    }

    INTERESTS {
        int id PK
        int idea_id FK
        string student_id
        string student_name
        string role_applied
        timestamp created_at
    }

    ROLES {
        int id PK
        int idea_id FK
        string role_title
        string skills_required
        string status
    }

    NOTIFICATIONS {
        int id PK
        string user_id
        string title
        string message
        string category
        int is_read
        timestamp created_at
    }

    PROFILES {
        int id PK
        string student_id UK
        string name
        string email
        string department
        string batch
        string campus
        string cgpa
        text bio
        string github
        string linkedin
        text skills_json
        text desired_roles_json
        text authorized_labs_json
    }
```

## 4. API Endpoint Matrix
| Method | Endpoint | Description | Request Body | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/ideas` | List all ideas with upvotes, interests, search & category filters | Query: `q`, `category`, `department`, `sort` | 200 OK |
| `GET` | `/ideas/<id>` | Retrieve complete idea technical profile, BOM & open roles | None | 200 OK / 404 Not Found |
| `POST` | `/ideas` | Submit a new capstone idea (runs duplicate guard, supports `force`) | `{title, description, category, department, force, ...}` | 201 Created / 409 Conflict / 400 Bad Request |
| `POST` | `/ideas/check-duplicate` | Real-time duplicate check without creating idea | `{title, description}` | 200 OK (`{is_duplicate, similarity_score, similar_idea}`) |
| `POST` | `/ideas/<id>/upvote` | Toggle student upvote on idea | `{student_id}` | 200 OK (`{upvotes, is_upvoted}`) |
| `POST` | `/ideas/<id>/interest` | Express interest in joining project team role | `{student_id, student_name, role_applied}` | 200 OK (`{interests, is_interested}`) |
| `GET` | `/leaderboard` | Get campus rankings by upvotes, podium, department stats | None | 200 OK |
| `GET` | `/roles` | List all open project roles across campus | Query: `skill` | 200 OK |
| `GET` | `/notifications` | Campus activity stream and alert logs | Query: `user_id` | 200 OK (`{notifications, unread_count}`) |
| `POST` | `/notifications/<id>/read` | Mark single notification read | None | 200 OK |
| `POST` | `/notifications/read-all` | Mark all notifications read for user | Query: `user_id` | 200 OK |
| `GET` | `/profile` | Get student academic profile details | Query: `student_id` | 200 OK |
| `PUT` | `/profile` | Update student profile details | Profile JSON | 200 OK |

## 5. Stitch Design System Architecture
- **Color Palette Tokens**:
  - `primary`: `#3525cd` / `primary-container`: `#4f46e5`
  - `secondary`: `#006c49` / `secondary-container`: `#6cf8bb`
  - `tertiary`: `#684000` / `tertiary-container`: `#885500`
  - `surface`: `#f8f9ff` / `surface-container`: `#e5eeff` / `surface-container-highest`: `#d3e4fe`
- **Typography**: Inter (Body, Label, Title, Headline).
- **Iconography**: Google Material Symbols Outlined.

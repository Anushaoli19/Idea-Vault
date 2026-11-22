import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from database import get_connection, create_tables, seed_data
from duplicate_detection import detect_duplicate

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

# Ensure database tables exist and are seeded with initial NIE capstone ideas
create_tables()
seed_data()


def format_idea_row(row):
    """Format an SQLite row into the full JSON dictionary contract expected by the frontend."""
    d = dict(row)

    # Parse JSON fields safely
    for field in ["tags", "bom", "team_slots"]:
        val = d.get(field)
        if isinstance(val, str):
            try:
                d[field] = json.loads(val)
            except Exception:
                d[field] = [val] if val else []
        elif val is None:
            d[field] = []

    # Map aliases for frontend compatibility
    d["interests"] = d.get("interested_students", 0)
    d["categoriesBadge"] = d.get("categories_badge") or d.get("category", "General")
    d["departmentShort"] = d.get("department_short") or (d.get("department") or "CSE")[:4].upper()
    d["authorName"] = d.get("author_name") or "NIE Student"
    d["authorBatch"] = d.get("author_batch") or "Class of 2025"
    d["authorAvatar"] = d.get("author_avatar") or ""
    d["authorUsn"] = d.get("author_usn") or ""
    d["authorEmail"] = d.get("author_email") or ""
    d["problemStatement"] = d.get("problem_statement") or d.get("description", "")
    d["proposedSolution"] = d.get("proposed_solution") or d.get("description", "")
    d["teamSlots"] = d.get("team_slots", [])

    return d


# ============================================================================
# 1. Submit a New Idea (POST /ideas)
# ============================================================================
@app.route("/ideas", methods=["POST"])
def add_idea():
    data = request.get_json()

    if not data or not data.get("title") or not data.get("description"):
        return jsonify({"error": "Title and description are required"}), 400

    title = data["title"].strip()
    description = data["description"].strip()
    category = data.get("category", "Technology")
    department = data.get("department", "Computer Science & Engineering")
    department_short = data.get("departmentShort") or (department[:4].upper())
    categories_badge = data.get("categoriesBadge") or category
    stage = data.get("stage", "Ideation")
    architecture = data.get("architecture", "")
    problem_statement = data.get("problemStatement") or description
    proposed_solution = data.get("proposedSolution") or description

    tags = json.dumps(data.get("tags") or [category, "Capstone"])
    bom = json.dumps(data.get("bom") or [])
    team_slots = json.dumps(data.get("roles") or data.get("teamSlots") or [
        {"role": "Core Collaborator", "status": "Available"}
    ])

    author_name = data.get("authorName", "Rohan Sharma")
    author_usn = data.get("authorUsn", "4NI21CS089")
    author_batch = data.get("authorBatch", "CSE '25")
    author_avatar = data.get("authorAvatar", "")
    author_email = data.get("authorEmail", "rohan.s.cse21@nie.ac.in")

    force = data.get("force", False) or data.get("skip_duplicate_check", False)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM ideas")
    existing_ideas = [dict(row) for row in cursor.fetchall()]

    # Duplicate detection check
    candidate = {"title": title, "description": description}
    result = detect_duplicate(candidate, existing_ideas)

    if result["is_duplicate"] and not force:
        conn.close()
        similar_idea = format_idea_row(result["similar_idea"]) if result.get("similar_idea") else None
        return jsonify({
            "message": "A similar idea already exists!",
            "duplicate": True,
            "similarity_score": result["similarity_score"],
            "similar_idea": similar_idea
        }), 409

    nie_id = f"NIE-25-{department[:3].upper()}-{100 + len(existing_ideas) + 1}"

    cursor.execute("""
        INSERT INTO ideas (
            nie_id, title, description, category, categories_badge,
            department, department_short, stage, problem_statement,
            proposed_solution, architecture, tags, bom, team_slots,
            author_name, author_usn, author_batch, author_avatar, author_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        nie_id, title, description, category, categories_badge,
        department, department_short, stage, problem_statement,
        proposed_solution, architecture, tags, bom, team_slots,
        author_name, author_usn, author_batch, author_avatar, author_email
    ))

    conn.commit()
    idea_id = cursor.lastrowid
    conn.close()

    new_idea = {
        "id": idea_id,
        "nie_id": nie_id,
        "title": title,
        "description": description,
        "category": category,
        "categoriesBadge": categories_badge,
        "department": department,
        "departmentShort": department_short,
        "stage": stage,
        "problemStatement": problem_statement,
        "architecture": architecture,
        "tags": json.loads(tags),
        "bom": json.loads(bom),
        "teamSlots": json.loads(team_slots),
        "authorName": author_name,
        "authorUsn": author_usn,
        "authorBatch": author_batch,
        "authorAvatar": author_avatar,
        "upvotes": 0,
        "interests": 0,
        "interested_students": 0
    }

    return jsonify({
        "message": "Idea submitted successfully!",
        "idea_id": idea_id,
        "idea": new_idea,
        "duplicate": False
    }), 201


# ============================================================================
# 2. Pre-Submission Duplicate Check (POST /check-duplicate)
# ============================================================================
@app.route("/check-duplicate", methods=["POST"])
def check_duplicate_route():
    data = request.get_json() or {}
    title = data.get("title", "")
    description = data.get("description", "")

    if not description and not title:
        return jsonify({"is_duplicate": False, "similarity_score": 0, "similar_idea": None}), 200

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ideas")
    existing_ideas = [dict(row) for row in cursor.fetchall()]
    conn.close()

    candidate = {"title": title, "description": description}
    result = detect_duplicate(candidate, existing_ideas)

    similar_idea = format_idea_row(result["similar_idea"]) if result.get("similar_idea") else None

    return jsonify({
        "is_duplicate": result["is_duplicate"],
        "duplicate": result["is_duplicate"],
        "similarity_score": result["similarity_score"],
        "similar_idea": similar_idea,
        "matchedIdea": similar_idea
    }), 200


# ============================================================================
# 3. Retrieve All Ideas (GET /ideas) with Filtering, Sorting, and Search
# ============================================================================
@app.route("/ideas", methods=["GET"])
def get_ideas():
    category = request.args.get("category")
    sort = request.args.get("sort", "newest")  # 'upvoted' or 'newest'
    search = request.args.get("search", "").strip().lower()
    author_usn = request.args.get("author_usn")

    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT ideas.*,
        (SELECT COUNT(*) FROM upvotes WHERE upvotes.idea_id = ideas.id) AS upvotes,
        (SELECT COUNT(*) FROM interests WHERE interests.idea_id = ideas.id) AS interested_students
        FROM ideas
        WHERE 1=1
    """
    params = []

    if category and category.lower() != "all":
        query += " AND (LOWER(ideas.category) LIKE ? OR LOWER(ideas.categories_badge) LIKE ?)"
        params.extend([f"%{category.lower()}%", f"%{category.lower()}%"])

    if author_usn:
        query += " AND ideas.author_usn = ?"
        params.append(author_usn)

    if sort == "upvoted":
        query += " ORDER BY upvotes DESC, ideas.id DESC"
    else:
        query += " ORDER BY ideas.id DESC"

    cursor.execute(query, params)
    raw_ideas = cursor.fetchall()
    conn.close()

    ideas = [format_idea_row(row) for row in raw_ideas]

    if search:
        ideas = [
            i for i in ideas
            if search in i["title"].lower()
            or search in i["description"].lower()
            or search in i["department"].lower()
            or search in (i.get("problemStatement") or "").lower()
            or search in (i.get("architecture") or "").lower()
            or any(search in str(t).lower() for t in i.get("tags", []))
        ]

    return jsonify(ideas), 200


# ============================================================================
# 4. Single Idea Deep Dive (GET /ideas/<id>)
# ============================================================================
@app.route("/ideas/<int:idea_id>", methods=["GET"])
def get_idea_detail(idea_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ideas.*,
        (SELECT COUNT(*) FROM upvotes WHERE upvotes.idea_id = ideas.id) AS upvotes,
        (SELECT COUNT(*) FROM interests WHERE interests.idea_id = ideas.id) AS interested_students
        FROM ideas
        WHERE ideas.id = ?
    """, (idea_id,))

    row = cursor.fetchone()

    if row is None:
        conn.close()
        return jsonify({"error": "Idea not found"}), 404

    idea = format_idea_row(row)

    # Fetch interested students list
    cursor.execute("""
        SELECT student_id, student_name, student_dept, student_batch, student_avatar, role_requested, message, status, created_at
        FROM interests
        WHERE idea_id = ?
        ORDER BY id DESC
    """, (idea_id,))
    inquiries = [dict(r) for r in cursor.fetchall()]
    conn.close()

    idea["interestedUsers"] = [
        {
            "id": inq["student_id"],
            "name": inq["student_name"] or inq["student_id"],
            "department": inq["student_dept"] or "Engineering",
            "batch": inq["student_batch"] or "Class of 2025",
            "avatar": inq["student_avatar"] or "",
            "role": inq["role_requested"] or "Collaborator",
            "message": inq["message"] or "",
            "status": inq["status"]
        } for inq in inquiries
    ]

    return jsonify(idea), 200


# ============================================================================
# 5. Upvote an Idea (POST /ideas/<id>/upvote)
# ============================================================================
@app.route("/ideas/<int:idea_id>/upvote", methods=["POST"])
def upvote_idea(idea_id):
    data = request.get_json() or {}
    student_id = data.get("student_id", "").strip()

    if not student_id:
        return jsonify({"error": "Student ID is required"}), 400

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM ideas WHERE id = ?", (idea_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({"error": "Idea not found"}), 404

    try:
        cursor.execute("""
            INSERT INTO upvotes (idea_id, student_id)
            VALUES (?, ?)
        """, (idea_id, student_id))
        conn.commit()
    except Exception:
        conn.close()
        return jsonify({"error": "You have already upvoted this idea"}), 409

    cursor.execute("SELECT COUNT(*) FROM upvotes WHERE idea_id = ?", (idea_id,))
    count = cursor.fetchone()[0]
    conn.close()

    return jsonify({
        "message": "Upvote recorded successfully!",
        "upvotes": count
    }), 200


# ============================================================================
# 6. Express Collaboration Interest (POST /ideas/<id>/interest)
# ============================================================================
@app.route("/ideas/<int:idea_id>/interest", methods=["POST"])
def express_interest(idea_id):
    data = request.get_json() or {}
    student_id = data.get("student_id", "").strip()

    if not student_id:
        return jsonify({"error": "Student ID is required"}), 400

    student_name = data.get("student_name", "Student Collaborator")
    student_dept = data.get("student_dept", "Engineering")
    student_batch = data.get("student_batch", "Class of 2025")
    student_avatar = data.get("student_avatar", "")
    role_requested = data.get("role_requested", "Co-Founder / Contributor")
    message = data.get("message", "Expressed collaboration interest.")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM ideas WHERE id = ?", (idea_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({"error": "Idea not found"}), 404

    try:
        cursor.execute("""
            INSERT INTO interests (idea_id, student_id, student_name, student_dept, student_batch, student_avatar, role_requested, message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (idea_id, student_id, student_name, student_dept, student_batch, student_avatar, role_requested, message))
        conn.commit()
    except Exception:
        conn.close()
        return jsonify({"error": "You have already expressed interest"}), 409

    cursor.execute("SELECT COUNT(*) FROM interests WHERE idea_id = ?", (idea_id,))
    count = cursor.fetchone()[0]
    conn.close()

    return jsonify({
        "message": "Interest recorded successfully!",
        "interested_students": count,
        "interests": count
    }), 200


# ============================================================================
# 7. Inquiries Action (POST /inquiries/<id>/action) - Accept / Decline
# ============================================================================
@app.route("/inquiries/<int:inquiry_id>/action", methods=["POST"])
def manage_inquiry(inquiry_id):
    data = request.get_json() or {}
    action = data.get("action", "accept").lower()

    if action not in ["accept", "decline"]:
        return jsonify({"error": "Invalid action. Use 'accept' or 'decline'"}), 400

    new_status = "accepted" if action == "accept" else "declined"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE interests SET status = ? WHERE id = ?", (new_status, inquiry_id))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Inquiry status updated to {new_status}!", "status": new_status}), 200


# ============================================================================
# 8. Student Profile Management (GET & POST /profile)
# ============================================================================
@app.route("/profile", methods=["GET"])
def get_profile():
    usn = request.args.get("usn", "4NI21CS089").strip()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_profiles WHERE usn = ?", (usn,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Profile not found"}), 404

    prof = dict(row)
    for field in ["skills", "desired_roles", "authorized_labs"]:
        val = prof.get(field)
        if isinstance(val, str):
            try:
                prof[field] = json.loads(val)
            except Exception:
                prof[field] = []

    prof["showCgpa"] = bool(prof.get("show_cgpa", 1))
    prof["openForCollab"] = bool(prof.get("open_for_collab", 1))
    prof["batchShort"] = prof.get("batch_short") or "CSE '25"
    prof["teamingObjective"] = prof.get("teaming_objective") or ""

    return jsonify(prof), 200


@app.route("/profile", methods=["POST", "PUT"])
def update_profile():
    data = request.get_json() or {}
    usn = data.get("usn", "4NI21CS089").strip()

    name = data.get("name", "Rohan Sharma")
    short_name = data.get("shortName") or name.split()[0] + (" S." if len(name.split()) > 1 else "")
    email = data.get("email", "rohan.s.cse21@nie.ac.in")
    department = data.get("department", "Computer Science & Engineering (CSE)")
    batch = data.get("batch", "Class of 2025 (8th Semester - Capstone Final)")
    batch_short = data.get("batchShort", "CSE '25")
    campus = data.get("campus", "NIE South Campus (Manandavadi Road)")
    cgpa = data.get("cgpa", "8.92 / 10.0")
    show_cgpa = 1 if data.get("showCgpa", True) else 0
    avatar = data.get("avatar", "")
    github = data.get("github", "")
    website = data.get("website", "")
    linkedin = data.get("linkedin", "")
    scholar = data.get("scholar", "")
    open_for_collab = 1 if data.get("openForCollab", True) else 0
    teaming_objective = data.get("teamingObjective", "")
    skills = json.dumps(data.get("skills") or [])
    desired_roles = json.dumps(data.get("desiredRoles") or [])
    authorized_labs = json.dumps(data.get("authorizedLabs") or [])

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user_profiles (
            usn, name, short_name, email, department, batch, batch_short, campus,
            cgpa, show_cgpa, avatar, github, website, linkedin, scholar,
            open_for_collab, teaming_objective, skills, desired_roles, authorized_labs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(usn) DO UPDATE SET
            name=excluded.name, short_name=excluded.short_name, email=excluded.email,
            department=excluded.department, batch=excluded.batch, batch_short=excluded.batch_short,
            campus=excluded.campus, cgpa=excluded.cgpa, show_cgpa=excluded.show_cgpa,
            avatar=excluded.avatar, github=excluded.github, website=excluded.website,
            linkedin=excluded.linkedin, scholar=excluded.scholar, open_for_collab=excluded.open_for_collab,
            teaming_objective=excluded.teaming_objective, skills=excluded.skills,
            desired_roles=excluded.desired_roles, authorized_labs=excluded.authorized_labs,
            updated_at=CURRENT_TIMESTAMP
    """, (
        usn, name, short_name, email, department, batch, batch_short, campus,
        cgpa, show_cgpa, avatar, github, website, linkedin, scholar,
        open_for_collab, teaming_objective, skills, desired_roles, authorized_labs
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Profile updated successfully!", "usn": usn}), 200


# ============================================================================
# 9. My Submissions & Dashboard Telemetry (GET /my-submissions)
# ============================================================================
@app.route("/my-submissions", methods=["GET"])
def get_my_submissions():
    student_id = request.args.get("student_id", "4NI21CS089")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ideas.*,
        (SELECT COUNT(*) FROM upvotes WHERE upvotes.idea_id = ideas.id) AS upvotes,
        (SELECT COUNT(*) FROM interests WHERE interests.idea_id = ideas.id) AS interested_students
        FROM ideas
        WHERE ideas.author_usn = ? OR ideas.id IN (1, 3, 4, 6)
        ORDER BY ideas.id DESC
    """, (student_id,))

    proposals = [format_idea_row(r) for r in cursor.fetchall()]

    # Total aggregate stats
    total_submissions = len(proposals)
    total_endorsements = sum(p["upvotes"] for p in proposals)
    total_inquiries = sum(p["interested_students"] for p in proposals)
    active_teams = sum(1 for p in proposals if p["stage"] in ["Approved & Open", "In Prototyping", "Team Formed"])

    # Pending inquiries for these proposals
    idea_ids = [p["id"] for p in proposals]
    inquiries = []
    if idea_ids:
        placeholders = ",".join("?" for _ in idea_ids)
        cursor.execute(f"""
            SELECT interests.*, ideas.title AS idea_title
            FROM interests
            JOIN ideas ON ideas.id = interests.idea_id
            WHERE interests.idea_id IN ({placeholders})
            ORDER BY interests.id DESC
        """, idea_ids)
        inquiries = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return jsonify({
        "stats": {
            "total_submissions": total_submissions,
            "total_endorsements": total_endorsements,
            "collaborator_inquiries": total_inquiries,
            "in_prototyping": active_teams
        },
        "proposals": proposals,
        "inquiries": inquiries
    }), 200


# ============================================================================
# 10. Frontend Static File Proxy (Serves /frontend seamlessly)
# ============================================================================
@app.route("/")
def serve_index():
    if os.path.exists(os.path.join(FRONTEND_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIR, "index.html")
    return jsonify({"message": "NIE Idea Vault API online", "docs": "/API_DOCUMENTATION.md"}), 200


@app.route("/<path:path>")
def serve_static_file(path):
    target = os.path.join(FRONTEND_DIR, path)
    if os.path.exists(target) and not os.path.isdir(target):
        return send_from_directory(FRONTEND_DIR, path)
    return jsonify({"error": "Resource not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)

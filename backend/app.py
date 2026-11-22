from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from database import get_connection, create_tables, seed_database_if_empty
from duplicate_detection import detect_duplicate

# Path configurations
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app, origins="*")

# Initialize database schema and initial seed data
create_tables()
seed_database_if_empty()


# ============================================================================
# Static Frontend Serving
# ============================================================================
@app.route("/")
def serve_index():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, "index.html")


# ============================================================================
# 1. Ideas Collection: List & Filter
# ============================================================================
@app.route("/ideas", methods=["GET"])
def get_ideas():
    search_query = request.args.get("q", "").strip()
    category = request.args.get("category", "").strip()
    department = request.args.get("department", "").strip()
    sort_by = request.args.get("sort", "recent").strip().lower()

    conn = get_connection()
    cursor = conn.cursor()

    base_query = """
        SELECT ideas.*,
        (SELECT COUNT(*) FROM upvotes WHERE upvotes.idea_id = ideas.id) AS upvotes,
        (SELECT COUNT(*) FROM interests WHERE interests.idea_id = ideas.id) AS interested_students
        FROM ideas
        WHERE 1=1
    """
    params = []

    if search_query:
        base_query += " AND (ideas.title LIKE ? OR ideas.description LIKE ? OR ideas.tags_json LIKE ?)"
        wildcard = f"%{search_query}%"
        params.extend([wildcard, wildcard, wildcard])

    if category and category.lower() != "all":
        base_query += " AND LOWER(ideas.category) = LOWER(?)"
        params.append(category)

    if department and department.lower() != "all":
        base_query += " AND LOWER(ideas.department) LIKE LOWER(?)"
        params.append(f"%{department}%")

    # Sorting logic
    if sort_by == "popular":
        base_query += " ORDER BY upvotes DESC, ideas.id DESC"
    elif sort_by == "interests":
        base_query += " ORDER BY interested_students DESC, ideas.id DESC"
    else:  # recent
        base_query += " ORDER BY ideas.id DESC"

    cursor.execute(base_query, params)
    rows = [dict(row) for row in cursor.fetchall()]

    # Parse JSON fields
    for row in rows:
        try:
            row["bom"] = json.loads(row.get("bom_json") or "[]")
        except Exception:
            row["bom"] = []
        try:
            row["tags"] = json.loads(row.get("tags_json") or "[]")
        except Exception:
            row["tags"] = []

    conn.close()
    return jsonify(rows), 200


# ============================================================================
# 2. Idea Detail Endpoint
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
    if not row:
        conn.close()
        return jsonify({"error": "Idea not found"}), 404

    idea = dict(row)

    # Parse JSON fields
    try:
        idea["bom"] = json.loads(idea.get("bom_json") or "[]")
    except Exception:
        idea["bom"] = []
    try:
        idea["tags"] = json.loads(idea.get("tags_json") or "[]")
    except Exception:
        idea["tags"] = []

    # Fetch open team roles
    cursor.execute("SELECT * FROM roles WHERE idea_id = ?", (idea_id,))
    idea["roles"] = [dict(r) for r in cursor.fetchall()]

    # Fetch interested students list
    cursor.execute("SELECT * FROM interests WHERE idea_id = ? ORDER BY created_at DESC", (idea_id,))
    idea["interested_users"] = [dict(i) for i in cursor.fetchall()]

    conn.close()
    return jsonify(idea), 200


# ============================================================================
# 3. Pre-flight Duplicate Check Endpoint
# ============================================================================
@app.route("/ideas/check-duplicate", methods=["POST"])
@app.route("/check-duplicate", methods=["POST"])
def check_duplicate_idea():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not description:
        return jsonify({
            "is_duplicate": False,
            "similarity_score": 0.0,
            "message": "Please enter a project description to evaluate similarity.",
            "similar_idea": None
        }), 200

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description, category, department, author_name, author_batch FROM ideas")
    existing_ideas = [dict(row) for row in cursor.fetchall()]
    conn.close()

    result = detect_duplicate(title, description, existing_ideas)
    return jsonify(result), 200


# ============================================================================
# 4. Submit New Idea (with Duplicate Guard & Force Override)
# ============================================================================
@app.route("/ideas", methods=["POST"])
def add_idea():
    data = request.get_json() or {}

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    category = data.get("category", "General").strip()
    department = data.get("department", "Computer Science & Engineering (CSE)").strip()
    force_submit = data.get("force", False)

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    conn = get_connection()
    cursor = conn.cursor()

    # Query existing proposals for duplicate detection
    cursor.execute("SELECT id, title, description, category, department, author_name, author_batch FROM ideas")
    existing_ideas = [dict(row) for row in cursor.fetchall()]

    # Check for duplicates unless user explicitly clicked "Submit Anyway"
    if not force_submit:
        result = detect_duplicate(title, description, existing_ideas)
        if result["is_duplicate"]:
            conn.close()
            return jsonify({
                "message": result["message"],
                "duplicate": True,
                "similarity_score": result["similarity_score"],
                "threshold": result["threshold"],
                "similar_idea": result["similar_idea"]
            }), 409

    # Additional fields
    author_name = data.get("author_name", "Rohan Sharma")
    author_usn = data.get("author_usn", "4NI21CS089")
    author_batch = data.get("author_batch", "Class of 2025")
    author_avatar = data.get("author_avatar", "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR")
    problem_statement = data.get("problem_statement", description)
    proposed_solution = data.get("proposed_solution", description)
    architecture = data.get("architecture", "Edge & Cloud Pipeline Architecture")

    bom_list = data.get("bom", [
        {"item": "Compute Node", "spec": "Edge Gateway / Cloud VM", "qty": 1, "cost": "₹4,500"},
        {"item": "Sensor Suite", "spec": "Telemetry Sensors", "qty": 2, "cost": "₹2,000"}
    ])
    tags_list = data.get("tags", [category, "Capstone"])
    roles_list = data.get("roles", [
        {"role_title": "Backend Developer", "skills_required": "Python, SQLite / PostgreSQL"},
        {"role_title": "Frontend Lead", "skills_required": "HTML5, Tailwind CSS, JavaScript"}
    ])

    cursor.execute("""
        INSERT INTO ideas (
            title, description, category, department, author_name, author_usn,
            author_batch, author_avatar, problem_statement, proposed_solution,
            architecture, bom_json, tags_json, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    """, (
        title, description, category, department, author_name, author_usn,
        author_batch, author_avatar, problem_statement, proposed_solution,
        architecture, json.dumps(bom_list), json.dumps(tags_list)
    ))

    idea_id = cursor.lastrowid

    # Insert open roles
    for role in roles_list:
        role_title = role.get("role_title") if isinstance(role, dict) else str(role)
        skills = role.get("skills_required", "General Engineering") if isinstance(role, dict) else "General"
        cursor.execute("""
            INSERT INTO roles (idea_id, role_title, skills_required, status)
            VALUES (?, ?, ?, 'Available')
        """, (idea_id, role_title, skills))

    # Create submission notification
    cursor.execute("""
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (?, ?, ?, 'submission', ?)
    """, (
        author_usn,
        "Project Idea Published!",
        f"Your project '{title}' is now live on the Idea Board.",
        f"/idea.html?id={idea_id}"
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Idea submitted successfully!",
        "idea_id": idea_id,
        "duplicate": False
    }), 201


# ============================================================================
# 5. Upvote Toggle
# ============================================================================
@app.route("/ideas/<int:idea_id>/upvote", methods=["POST"])
def upvote_idea(idea_id):
    data = request.get_json() or {}
    student_id = data.get("student_id", "4NI21CS089").strip()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, author_usn FROM ideas WHERE id = ?", (idea_id,))
    idea_row = cursor.fetchone()
    if not idea_row:
        conn.close()
        return jsonify({"error": "Idea not found"}), 404

    # Check if already upvoted
    cursor.execute("SELECT id FROM upvotes WHERE idea_id = ? AND student_id = ?", (idea_id, student_id))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("DELETE FROM upvotes WHERE idea_id = ? AND student_id = ?", (idea_id, student_id))
        is_upvoted = False
        msg = "Upvote removed."
    else:
        cursor.execute("INSERT INTO upvotes (idea_id, student_id) VALUES (?, ?)", (idea_id, student_id))
        is_upvoted = True
        msg = "Upvote recorded successfully!"

    conn.commit()

    # Get updated total count
    cursor.execute("SELECT COUNT(*) FROM upvotes WHERE idea_id = ?", (idea_id,))
    total_upvotes = cursor.fetchone()[0]
    conn.close()

    return jsonify({
        "message": msg,
        "upvotes": total_upvotes,
        "is_upvoted": is_upvoted
    }), 200


# ============================================================================
# 6. Express Interest / Team Application
# ============================================================================
@app.route("/ideas/<int:idea_id>/interest", methods=["POST"])
def express_interest(idea_id):
    data = request.get_json() or {}
    student_id = data.get("student_id", "4NI21CS089").strip()
    student_name = data.get("student_name", "NIE Student").strip()
    student_batch = data.get("student_batch", "Class of 2025").strip()
    role_applied = data.get("role_applied", "Collaborator").strip()
    message = data.get("message", "I would like to collaborate on this project!").strip()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, title, author_usn FROM ideas WHERE id = ?", (idea_id,))
    idea_row = cursor.fetchone()
    if not idea_row:
        conn.close()
        return jsonify({"error": "Idea not found"}), 404

    cursor.execute("SELECT id FROM interests WHERE idea_id = ? AND student_id = ?", (idea_id, student_id))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("DELETE FROM interests WHERE idea_id = ? AND student_id = ?", (idea_id, student_id))
        is_interested = False
        msg = "Interest withdrawn."
    else:
        cursor.execute("""
            INSERT INTO interests (idea_id, student_id, student_name, student_batch, role_applied, message)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (idea_id, student_id, student_name, student_batch, role_applied, message))
        is_interested = True
        msg = "Interest registered successfully!"

        # Notify project author
        author_usn = idea_row["author_usn"]
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (?, ?, ?, 'applicant', ?)
        """, (
            author_usn,
            f"New Application for {idea_row['title']}",
            f"{student_name} ({student_id}) expressed interest for {role_applied}.",
            f"/idea.html?id={idea_id}"
        ))

    conn.commit()

    cursor.execute("SELECT COUNT(*) FROM interests WHERE idea_id = ?", (idea_id,))
    total_interests = cursor.fetchone()[0]
    conn.close()

    return jsonify({
        "message": msg,
        "interested_students": total_interests,
        "is_interested": is_interested
    }), 200


# ============================================================================
# 7. Campus Leaderboard Endpoint
# ============================================================================
@app.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    conn = get_connection()
    cursor = conn.cursor()

    # Top Projects by Upvotes
    cursor.execute("""
        SELECT ideas.id, ideas.title, ideas.category, ideas.department, ideas.author_name, ideas.author_batch,
        (SELECT COUNT(*) FROM upvotes WHERE upvotes.idea_id = ideas.id) AS upvotes,
        (SELECT COUNT(*) FROM interests WHERE interests.idea_id = ideas.id) AS interested_students
        FROM ideas
        ORDER BY upvotes DESC, interested_students DESC
        LIMIT 10
    """)
    top_ideas = [dict(row) for row in cursor.fetchall()]

    # Department Rankings
    cursor.execute("""
        SELECT department,
        COUNT(DISTINCT ideas.id) AS total_projects,
        COUNT(upvotes.id) AS total_upvotes,
        COUNT(DISTINCT interests.id) AS total_collaborations
        FROM ideas
        LEFT JOIN upvotes ON upvotes.idea_id = ideas.id
        LEFT JOIN interests ON interests.idea_id = ideas.id
        GROUP BY department
        ORDER BY total_upvotes DESC
    """)
    department_stats = [dict(row) for row in cursor.fetchall()]

    # Top Innovators (Authors with most cumulative upvotes)
    cursor.execute("""
        SELECT author_name, author_usn, author_batch, author_avatar, department,
        COUNT(DISTINCT ideas.id) as projects_count,
        COUNT(upvotes.id) as cumulative_upvotes
        FROM ideas
        LEFT JOIN upvotes ON upvotes.idea_id = ideas.id
        GROUP BY author_usn
        ORDER BY cumulative_upvotes DESC
        LIMIT 5
    """)
    top_innovators = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return jsonify({
        "top_ideas": top_ideas,
        "department_stats": department_stats,
        "top_innovators": top_innovators
    }), 200


# ============================================================================
# 8. Teammate Matching & Open Roles Endpoint
# ============================================================================
@app.route("/roles", methods=["GET"])
def get_open_roles():
    skill_filter = request.args.get("skill", "").strip().lower()

    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT roles.*,
        ideas.title AS idea_title,
        ideas.category AS idea_category,
        ideas.department AS idea_department,
        ideas.author_name,
        ideas.author_batch
        FROM roles
        JOIN ideas ON ideas.id = roles.idea_id
        WHERE roles.status = 'Available'
    """
    params = []

    if skill_filter:
        query += " AND LOWER(roles.skills_required) LIKE ?"
        params.append(f"%{skill_filter}%")

    query += " ORDER BY roles.id DESC"
    cursor.execute(query, params)
    roles = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return jsonify(roles), 200


# ============================================================================
# 9. Notification Center & Activity Feed
# ============================================================================
@app.route("/notifications", methods=["GET"])
def get_notifications():
    user_id = request.args.get("user_id", "4NI21CS089").strip()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM notifications
        WHERE user_id = ? OR user_id = 'all'
        ORDER BY created_at DESC
        LIMIT 30
    """, (user_id,))
    notifs = [dict(row) for row in cursor.fetchall()]

    # Unread count
    cursor.execute("""
        SELECT COUNT(*) FROM notifications
        WHERE (user_id = ? OR user_id = 'all') AND is_read = 0
    """, (user_id,))
    unread_count = cursor.fetchone()[0]

    conn.close()
    return jsonify({
        "notifications": notifs,
        "unread_count": unread_count
    }), 200


@app.route("/notifications/<int:notification_id>/read", methods=["POST"])
@app.route("/notifications/read-all", methods=["POST"])
def mark_notification_read(notification_id=0):
    user_id = request.args.get("user_id", "4NI21CS089").strip()
    conn = get_connection()
    cursor = conn.cursor()
    if notification_id == 0:
        cursor.execute("UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id = 'all'", (user_id,))
    else:
        cursor.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", (notification_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True}), 200


# ============================================================================
# 10. Student Profile & Settings
# ============================================================================
@app.route("/profile", methods=["GET"])
def get_profile():
    student_id = request.args.get("student_id", "4NI21CS089").strip()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profiles WHERE student_id = ?", (student_id,))
    row = cursor.fetchone()

    if not row:
        cursor.execute("SELECT * FROM profiles LIMIT 1")
        row = cursor.fetchone()

    profile = dict(row) if row else {}
    if profile:
        profile["skills"] = json.loads(profile.get("skills_json") or "[]")
        profile["desired_roles"] = json.loads(profile.get("desired_roles_json") or "[]")
        profile["authorized_labs"] = json.loads(profile.get("authorized_labs_json") or "[]")
        profile.pop("password", None)

    conn.close()
    return jsonify(profile), 200


@app.route("/profile", methods=["PUT"])
def update_profile():
    data = request.get_json() or {}
    student_id = data.get("student_id", "4NI21CS089").strip()

    conn = get_connection()
    cursor = conn.cursor()

    skills_json = json.dumps(data.get("skills", []))
    roles_json = json.dumps(data.get("desired_roles", []))
    labs_json = json.dumps(data.get("authorized_labs", []))

    cursor.execute("""
        UPDATE profiles SET
            name = COALESCE(?, name),
            email = COALESCE(?, email),
            department = COALESCE(?, department),
            batch = COALESCE(?, batch),
            campus = COALESCE(?, campus),
            cgpa = COALESCE(?, cgpa),
            bio = COALESCE(?, bio),
            github = COALESCE(?, github),
            linkedin = COALESCE(?, linkedin),
            avatar = COALESCE(?, avatar),
            website = COALESCE(?, website),
            scholar = COALESCE(?, scholar),
            teaming_objective = COALESCE(?, teaming_objective),
            open_for_collab = COALESCE(?, open_for_collab),
            show_cgpa = COALESCE(?, show_cgpa),
            skills_json = ?,
            desired_roles_json = ?,
            authorized_labs_json = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
    """, (
        data.get("name"),
        data.get("email"),
        data.get("department"),
        data.get("batch"),
        data.get("campus"),
        data.get("cgpa"),
        data.get("bio"),
        data.get("github"),
        data.get("linkedin"),
        data.get("avatar"),
        data.get("website"),
        data.get("scholar"),
        data.get("teaming_objective"),
        1 if data.get("open_for_collab", True) else 0,
        1 if data.get("show_cgpa", True) else 0,
        skills_json,
        roles_json,
        labs_json,
        student_id
    ))

    conn.commit()
    conn.close()
    return jsonify({"message": "Profile updated successfully!"}), 200


# ============================================================================
# 11. Student Settings Endpoints
# ============================================================================
@app.route("/settings", methods=["GET"])
def get_settings():
    student_id = request.args.get("student_id", "4NI21CS089").strip()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM settings WHERE student_id = ?", (student_id,))
    row = cursor.fetchone()
    if not row:
        cursor.execute("SELECT * FROM settings LIMIT 1")
        row = cursor.fetchone()

    settings = dict(row) if row else {}
    if settings:
        try:
            settings["sessions"] = json.loads(settings.get("sessions_json") or "[]")
        except Exception:
            settings["sessions"] = []
    conn.close()
    return jsonify(settings), 200


@app.route("/settings", methods=["PUT"])
def update_settings():
    data = request.get_json() or {}
    student_id = data.get("student_id", "4NI21CS089").strip()
    conn = get_connection()
    cursor = conn.cursor()

    sessions_json = json.dumps(data.get("sessions", [])) if "sessions" in data else None

    cursor.execute("""
        UPDATE settings SET
            theme = COALESCE(?, theme),
            accent = COALESCE(?, accent),
            email_notifs = COALESCE(?, email_notifs),
            in_app_notifs = COALESCE(?, in_app_notifs),
            digest_frequency = COALESCE(?, digest_frequency),
            two_factor_enabled = COALESCE(?, two_factor_enabled),
            connected_github = COALESCE(?, connected_github),
            connected_scholar = COALESCE(?, connected_scholar),
            connected_ieee = COALESCE(?, connected_ieee),
            sessions_json = COALESCE(?, sessions_json),
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ?
    """, (
        data.get("theme"),
        data.get("accent"),
        1 if data.get("email_notifs") else 0 if "email_notifs" in data else None,
        1 if data.get("in_app_notifs") else 0 if "in_app_notifs" in data else None,
        data.get("digest_frequency"),
        1 if data.get("two_factor_enabled") else 0 if "two_factor_enabled" in data else None,
        data.get("connected_github"),
        data.get("connected_scholar"),
        1 if data.get("connected_ieee") else 0 if "connected_ieee" in data else None,
        sessions_json,
        student_id
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Settings updated successfully!"}), 200


@app.route("/settings/password", methods=["POST"])
def change_password():
    data = request.get_json() or {}
    student_id = data.get("student_id", "4NI21CS089").strip()
    current_pw = data.get("current_password", "").strip()
    new_pw = data.get("new_password", "").strip()

    if not new_pw or len(new_pw) < 6:
        return jsonify({"error": "New password must be at least 6 characters long."}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM profiles WHERE student_id = ?", (student_id,))
    row = cursor.fetchone()
    if row and row["password"] and current_pw and row["password"] != current_pw:
        conn.close()
        return jsonify({"error": "Current password does not match campus records."}), 403

    cursor.execute("UPDATE profiles SET password = ? WHERE student_id = ?", (new_pw, student_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Password updated successfully!"}), 200


@app.route("/settings/sessions/revoke", methods=["POST"])
def revoke_sessions():
    data = request.get_json() or {}
    student_id = data.get("student_id", "4NI21CS089").strip()
    session_id = data.get("session_id")
    revoke_all_others = data.get("all_others", False)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT sessions_json FROM settings WHERE student_id = ?", (student_id,))
    row = cursor.fetchone()
    sessions = json.loads(row["sessions_json"] or "[]") if row else []

    if revoke_all_others:
        sessions = [s for s in sessions if s.get("is_current")]
    elif session_id:
        sessions = [s for s in sessions if s.get("id") != session_id]

    cursor.execute("UPDATE settings SET sessions_json = ? WHERE student_id = ?", (json.dumps(sessions), student_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Session(s) revoked successfully!", "sessions": sessions}), 200


# ============================================================================
# Root App Runner
# ============================================================================
if __name__ == "__main__":
    print("NIE Idea Vault Backend running at http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)

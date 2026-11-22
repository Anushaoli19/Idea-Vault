from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_connection, create_tables
from duplicate_detection import detect_duplicate

app = Flask(__name__)
CORS(app)

# Create database tables
create_tables()


# 1. Submit a new idea
@app.route("/ideas", methods=["POST"])
def add_idea():

    data = request.get_json()

    if not data or not data.get("title") or not data.get("description"):
        return jsonify({"error": "Title and description are required"}), 400

    title = data["title"].strip()
    description = data["description"].strip()
    category = data.get("category", "")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM ideas")
    existing_ideas = [dict(row) for row in cursor.fetchall()]

    result = detect_duplicate(description, existing_ideas)

    if result["is_duplicate"]:
        conn.close()
        return jsonify({
            "message": "A similar idea already exists!",
            "duplicate": True,
            "similarity_score": result["similarity_score"],
            "similar_idea": result["similar_idea"]
        }), 409

    cursor.execute("""
        INSERT INTO ideas (title, description, category)
        VALUES (?, ?, ?)
    """, (title, description, category))

    conn.commit()
    idea_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "message": "Idea submitted successfully!",
        "idea_id": idea_id,
        "duplicate": False
    }), 201


# 2. Display all ideas
@app.route("/ideas", methods=["GET"])
def get_ideas():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT ideas.*,
        (SELECT COUNT(*) FROM upvotes
         WHERE upvotes.idea_id = ideas.id) AS upvotes,
        (SELECT COUNT(*) FROM interests
         WHERE interests.idea_id = ideas.id) AS interested_students
        FROM ideas
        ORDER BY ideas.id DESC
    """)

    ideas = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return jsonify(ideas), 200


# 3. Upvote an idea
@app.route("/ideas/<int:idea_id>/upvote", methods=["POST"])
def upvote_idea(idea_id):

    data = request.get_json()

    if not data or not data.get("student_id"):
        return jsonify({"error": "Student ID is required"}), 400

    student_id = data["student_id"].strip()

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

    cursor.execute(
        "SELECT COUNT(*) FROM upvotes WHERE idea_id = ?",
        (idea_id,)
    )

    count = cursor.fetchone()[0]
    conn.close()

    return jsonify({
        "message": "Upvote recorded successfully!",
        "upvotes": count
    }), 200


# 4. Express interest in an idea
@app.route("/ideas/<int:idea_id>/interest", methods=["POST"])
def express_interest(idea_id):

    data = request.get_json()

    if not data or not data.get("student_id"):
        return jsonify({"error": "Student ID is required"}), 400

    student_id = data["student_id"].strip()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM ideas WHERE id = ?", (idea_id,))

    if cursor.fetchone() is None:
        conn.close()
        return jsonify({"error": "Idea not found"}), 404

    try:
        cursor.execute("""
            INSERT INTO interests (idea_id, student_id)
            VALUES (?, ?)
        """, (idea_id, student_id))

        conn.commit()

    except Exception:
        conn.close()
        return jsonify({"error": "You have already expressed interest"}), 409

    cursor.execute(
        "SELECT COUNT(*) FROM interests WHERE idea_id = ?",
        (idea_id,)
    )

    count = cursor.fetchone()[0]
    conn.close()

    return jsonify({
        "message": "Interest recorded successfully!",
        "interested_students": count
    }), 200


if __name__ == "__main__":
    app.run(debug=True)
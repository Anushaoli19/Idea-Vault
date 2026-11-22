import sqlite3

DATABASE_NAME = "idea_vault.db"


def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # Store project ideas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ideas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Store upvotes
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS upvotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea_id INTEGER NOT NULL,
            student_id TEXT NOT NULL,
            UNIQUE(idea_id, student_id),
            FOREIGN KEY (idea_id) REFERENCES ideas(id)
        )
    """)

    # Store students interested in joining ideas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea_id INTEGER NOT NULL,
            student_id TEXT NOT NULL,
            UNIQUE(idea_id, student_id),
            FOREIGN KEY (idea_id) REFERENCES ideas(id)
        )
    """)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_tables()
    print("Database and tables created successfully!")
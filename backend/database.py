import sqlite3
import json
import os

DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "idea_vault.db")


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Ideas Table with Migration Support
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ideas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'General',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("PRAGMA table_info(ideas)")
    existing_cols = {row[1] for row in cursor.fetchall()}

    new_columns = [
        ("department", "TEXT NOT NULL DEFAULT 'Computer Science & Engineering (CSE)'"),
        ("author_name", "TEXT NOT NULL DEFAULT 'NIE Student'"),
        ("author_usn", "TEXT NOT NULL DEFAULT '4NI21CS089'"),
        ("author_batch", "TEXT NOT NULL DEFAULT 'Class of 2025'"),
        ("author_avatar", "TEXT DEFAULT ''"),
        ("problem_statement", "TEXT DEFAULT ''"),
        ("proposed_solution", "TEXT DEFAULT ''"),
        ("architecture", "TEXT DEFAULT ''"),
        ("bom_json", "TEXT DEFAULT '[]'"),
        ("tags_json", "TEXT DEFAULT '[]'"),
        ("status", "TEXT DEFAULT 'Active'")
    ]

    for col_name, col_def in new_columns:
        if col_name not in existing_cols:
            cursor.execute(f"ALTER TABLE ideas ADD COLUMN {col_name} {col_def}")

    # 2. Upvotes Table (One upvote per idea per student USN)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS upvotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea_id INTEGER NOT NULL,
            student_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(idea_id, student_id),
            FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        )
    """)

    # 3. Interests Table with Migration Support
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea_id INTEGER NOT NULL,
            student_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(idea_id, student_id),
            FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        )
    """)

    cursor.execute("PRAGMA table_info(interests)")
    existing_interest_cols = {row[1] for row in cursor.fetchall()}

    interest_columns = [
        ("student_name", "TEXT DEFAULT 'NIE Student'"),
        ("student_batch", "TEXT DEFAULT 'Class of 2025'"),
        ("student_avatar", "TEXT DEFAULT ''"),
        ("role_applied", "TEXT DEFAULT 'Collaborator'"),
        ("message", "TEXT DEFAULT ''"),
        ("created_at", "TIMESTAMP DEFAULT NULL")
    ]

    for col_name, col_def in interest_columns:
        if col_name not in existing_interest_cols:
            cursor.execute(f"ALTER TABLE interests ADD COLUMN {col_name} {col_def}")

    # 4. Roles Table (Open team vacancies per capstone idea)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea_id INTEGER NOT NULL,
            role_title TEXT NOT NULL,
            skills_required TEXT NOT NULL,
            status TEXT DEFAULT 'Available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        )
    """)

    # 5. Notifications Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            link TEXT DEFAULT '',
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 6. Student Profiles Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            student_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            department TEXT NOT NULL,
            batch TEXT NOT NULL,
            campus TEXT DEFAULT 'NIE South Campus',
            cgpa TEXT DEFAULT '8.92 / 10.0',
            bio TEXT DEFAULT '',
            github TEXT DEFAULT '',
            linkedin TEXT DEFAULT '',
            skills_json TEXT DEFAULT '[]',
            desired_roles_json TEXT DEFAULT '[]',
            authorized_labs_json TEXT DEFAULT '[]',
            avatar TEXT DEFAULT '',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


def seed_database_if_empty():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM ideas")
    count = cursor.fetchone()[0]

    if count > 0:
        conn.close()
        return

    # Seed Default Profile
    cursor.execute("""
        INSERT OR REPLACE INTO profiles (
            student_id, name, email, department, batch, campus, cgpa, bio, github, linkedin,
            skills_json, desired_roles_json, authorized_labs_json, avatar
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "4NI21CS089",
        "Rohan Sharma",
        "rohan.s.cse21@nie.ac.in",
        "Computer Science & Engineering (CSE)",
        "Class of 2025 (8th Semester - Capstone Final)",
        "NIE South Campus (Manandavadi Road)",
        "8.92 / 10.0",
        "Passionate full-stack & edge systems engineer. Working on decentralised smart grid telemetry and edge inference.",
        "rohansharma-nie",
        "rohansharma-cse",
        json.dumps(["React.js", "Python 3.11", "FastAPI", "PyTorch", "ESP32 Firmware", "Docker", "PostgreSQL"]),
        json.dumps(["Backend / Cloud Architect", "ML Edge Engineer"]),
        json.dumps(["C-Block IoT Research Cell", "Embedded Systems Lab 3"]),
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR"
    ))

    # Seed Sample Ideas Matching Stitch Design System Showcase
    sample_ideas = [
        {
            "title": "Smart Campus Micro-Grid & Autonomous Energy Optimization",
            "category": "CleanTech",
            "department": "Electrical & Electronics Engineering (EEE)",
            "author_name": "Rohan Sharma",
            "author_usn": "4NI21CS089",
            "author_batch": "Class of 2025",
            "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
            "description": "An automated micro-grid power distribution system for educational institutions. Dynamically redistributes solar generation and battery reserves across academic blocks using IoT telemetry and predictive consumption forecasting.",
            "problem_statement": "Campus electrical grids experience major peak-load penalties during laboratory hours while solar panels over-generate during class hours without real-time phase balance.",
            "proposed_solution": "Deploy edge ESP32 micro-inverter telemetry nodes paired with an autonomous power routing broker to balance energy dynamically across academic blocks.",
            "architecture": "ESP32 telemetry sensors -> MQTT broker -> FastAPI Edge Coordinator -> SQLite/TimescaleDB -> Tailwind / React Dashboard",
            "bom": [
                {"item": "Compute Core", "spec": "Raspberry Pi 4B Gateway 4GB", "qty": 2, "cost": "₹9,200"},
                {"item": "Sensor Suite", "spec": "PZEM-004T AC Energy Monitor + CT Clamp", "qty": 6, "cost": "₹4,800"},
                {"item": "Controller Node", "spec": "ESP32-WROOM-32D Wi-Fi/BLE MCU", "qty": 4, "cost": "₹1,400"},
                {"item": "Power Electronics", "spec": "Solid State Relays 40A 250VAC", "qty": 4, "cost": "₹2,600"}
            ],
            "tags": ["CleanTech", "IoT", "Smart Campus", "Renewable Energy"],
            "roles": [
                {"role_title": "Power Electronics Specialist (EEE)", "skills_required": "Inverter topologies, Relay control, High Voltage Safety"},
                {"role_title": "Frontend / Data Viz Lead", "skills_required": "Tailwind CSS, Chart.js, WebSocket live streams"}
            ],
            "initial_upvotes": 42,
            "initial_interests": 14
        },
        {
            "title": "Autonomous Drone Delivery for Emergency Medical Supplies",
            "category": "Robotics",
            "department": "Mechanical & Aerospace Engineering",
            "author_name": "Pooja Hegde",
            "author_usn": "4NI21IS045",
            "author_batch": "Class of 2025",
            "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuDFW21bJ0r1x2GgN0E_3x4y5z6",
            "description": "A long-range VTOL autonomous drone carrying emergency medical kits, antidotes, and blood packs to remote rural health clinics with obstacle avoidance and GPS-denied navigation.",
            "problem_statement": "Emergency transport of critical anti-venom or blood vials to rural clinics takes over 3 hours by road across rough terrain, costing critical survival minutes.",
            "proposed_solution": "A dual-tilt rotor autonomous VTOL drone with insulated payload release mechanism and real-time telemetry over 4G cellular backup.",
            "architecture": "Pixhawk Autopilot -> Raspberry Pi Companion Computer -> OpenCV Optical Flow -> ArduPilot MAVLink",
            "bom": [
                {"item": "Airframe", "spec": "Carbon Fiber VTOL 1200mm wingspan", "qty": 1, "cost": "₹18,500"},
                {"item": "Autopilot", "spec": "Pixhawk 6C + M8N GPS Module", "qty": 1, "cost": "₹14,200"},
                {"item": "Propulsion", "spec": "Brushless Motors 4108 + 40A ESCs", "qty": 4, "cost": "₹8,400"}
            ],
            "tags": ["Robotics", "Drones", "Healthcare", "Embedded"],
            "roles": [
                {"role_title": "Flight Firmware Developer", "skills_required": "C++, ArduPilot, ROS2, MAVLink"},
                {"role_title": "Aerodynamics & Cad Modeling", "skills_required": "SolidWorks, CFD Simulation, 3D Printing"}
            ],
            "initial_upvotes": 38,
            "initial_interests": 9
        },
        {
            "title": "AI Vision Proctoring and Automated Code Plagiarism Detection",
            "category": "AI / ML",
            "department": "Computer Science & Engineering (CSE)",
            "author_name": "Aditya Verma",
            "author_usn": "4NI21CS012",
            "author_batch": "Class of 2025",
            "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuC1_q2w3e4r5t6y7u8",
            "description": "A privacy-preserving automated proctoring platform that runs lightweight gaze-tracking on client edge devices and compares code syntax ASTs using semantic embeddings to prevent exam cheating.",
            "problem_statement": "Online coding examinations in engineering colleges face rampant code leaks and proxy test-taking with standard plagiarism tools only catching verbatim string matches.",
            "proposed_solution": "Client-side WebAssembly face gaze tracking combined with Tree-sitter AST hashing and TF-IDF semantic embeddings for accurate plagiarism detection.",
            "architecture": "MediaPipe WebAssembly -> AST Python parser -> Scikit-learn Cosine Similarity -> FastAPI Server",
            "bom": [
                {"item": "Compute Server", "spec": "GPU-accelerated Cloud VM / Campus Server", "qty": 1, "cost": "₹6,000"}
            ],
            "tags": ["AI / ML", "EdTech", "Computer Vision", "AST"],
            "roles": [
                {"role_title": "PyTorch / ML Engineer", "skills_required": "Transformers, AST Parsers, Embeddings"},
                {"role_title": "Fullstack Web Developer", "skills_required": "WebAssembly, Canvas API, FastAPI"}
            ],
            "initial_upvotes": 29,
            "initial_interests": 11
        },
        {
            "title": "IoT Campus Water Quality & Pipeline Leakage Telemetry",
            "category": "IoT",
            "department": "Civil Engineering & ISE",
            "author_name": "Kavya Murthy",
            "author_usn": "4NI21CV034",
            "author_batch": "Class of 2025",
            "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuB2_q4w5e6r7t8y9u0",
            "description": "Smart sensor clusters distributed along campus water distribution mains monitoring turbidity, pH, dissolved solids, and pressure differentials to pinpoint subterranean leaks.",
            "problem_statement": "Undetected subterranean pipe leaks waste up to 35% of pumped municipal water on campus while contamination events take days to identify.",
            "proposed_solution": "Battery-powered LoRaWAN sensor nodes monitoring flow and acoustic pressure waves, transmitting alarms instantly to maintenance engineers.",
            "architecture": "LoRaWAN Transceivers -> Gateway Station -> Python Flask Ingestion -> SQLite -> SMS Alert Daemon",
            "bom": [
                {"item": "Sensors", "spec": "Turbidity + pH + Pressure Transducer 1.2MPa", "qty": 8, "cost": "₹9,800"},
                {"item": "Telemetry", "spec": "SX1276 LoRa 868MHz Nodes", "qty": 8, "cost": "₹5,600"}
            ],
            "tags": ["IoT", "Sustainability", "LoRaWAN", "Water Conservation"],
            "roles": [
                {"role_title": "Embedded Hardware Engineer", "skills_required": "PCB Design, Low-power firmware, LoRa"},
                {"role_title": "Mobile Notification Developer", "skills_required": "Push notifications, PWA, SMS APIs"}
            ],
            "initial_upvotes": 24,
            "initial_interests": 6
        },
        {
            "title": "Decentralized Academic Credential Verification on Polygon",
            "category": "Web3",
            "department": "Information Science & Engineering (ISE)",
            "author_name": "Siddharth Rao",
            "author_usn": "4NI21IS092",
            "author_batch": "Class of 2025",
            "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA2_z1x2c3v4b5n6m7",
            "description": "Cryptographically verifiable digital degree certificates and marks cards minted as soulbound NFTs, enabling employers to verify credentials instantly without paper attestation.",
            "problem_statement": "Manual educational credential verification takes 3 to 6 weeks for graduating students applying for overseas universities or multi-national corporations.",
            "proposed_solution": "Institution-signed ERC-721 Soulbound tokens with IPFS hash proofs and QR code instant verification portals.",
            "architecture": "Solidity Smart Contract -> Polygon PoS -> Pinata IPFS -> Ethers.js -> Next.js / HTML UI",
            "bom": [
                {"item": "Network Gas", "spec": "Polygon PoS Testnet/Mainnet Deployments", "qty": 1, "cost": "₹1,200"}
            ],
            "tags": ["Web3", "Blockchain", "Security", "Credentials"],
            "roles": [
                {"role_title": "Solidity Smart Contract Auditor", "skills_required": "Solidity, Hardhat, OpenZeppelin"},
                {"role_title": "Cryptographic UI Engineer", "skills_required": "Ethers.js, QR Code generation, Tailwind"}
            ],
            "initial_upvotes": 31,
            "initial_interests": 8
        },
        {
            "title": "Smart Campus Parking Guidance & Slot Reservation System",
            "category": "Smart Campus",
            "department": "Computer Science & Engineering (CSE)",
            "author_name": "Nikhil Gowda",
            "author_usn": "4NI21CS067",
            "author_batch": "Class of 2025",
            "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuE3_m1n2b3v4c5x6z7",
            "description": "An automated campus parking slot detection system using overhead optical cameras and ultrasonic ground sensors to broadcast available spots to faculty and students.",
            "problem_statement": "Faculty and students waste 15 minutes during morning rush hours circling campus lots to locate vacant two-wheeler and four-wheeler slots.",
            "proposed_solution": "YOLO-based vehicle detection over campus security feeds coupled with mobile app reservations.",
            "architecture": "RTSP IP Cameras -> YOLOv8 Edge Inference -> Flask REST API -> Mobile Web App",
            "bom": [
                {"item": "Edge AI Box", "spec": "Jetson Nano 4GB Developer Kit", "qty": 1, "cost": "₹12,000"}
            ],
            "tags": ["Smart Campus", "Computer Vision", "YOLO", "Automation"],
            "roles": [
                {"role_title": "Computer Vision Engineer", "skills_required": "YOLO, OpenCV, Python"}
            ],
            "initial_upvotes": 19,
            "initial_interests": 5
        }
    ]

    for item in sample_ideas:
        cursor.execute("""
            INSERT INTO ideas (
                title, description, category, department, author_name, author_usn,
                author_batch, author_avatar, problem_statement, proposed_solution,
                architecture, bom_json, tags_json, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item["title"],
            item["description"],
            item["category"],
            item["department"],
            item["author_name"],
            item["author_usn"],
            item["author_batch"],
            item["author_avatar"],
            item["problem_statement"],
            item["proposed_solution"],
            item["architecture"],
            json.dumps(item["bom"]),
            json.dumps(item["tags"]),
            "Active"
        ))
        idea_id = cursor.lastrowid

        # Seed roles
        for r in item["roles"]:
            cursor.execute("""
                INSERT INTO roles (idea_id, role_title, skills_required, status)
                VALUES (?, ?, ?, 'Available')
            """, (idea_id, r["role_title"], r["skills_required"]))

        # Seed initial upvotes
        for i in range(item["initial_upvotes"]):
            dummy_usn = f"4NI21CS{100 + i:03d}"
            cursor.execute("""
                INSERT OR IGNORE INTO upvotes (idea_id, student_id)
                VALUES (?, ?)
            """, (idea_id, dummy_usn))

        # Seed initial interests
        for i in range(item["initial_interests"]):
            dummy_usn = f"4NI21IS{200 + i:03d}"
            cursor.execute("""
                INSERT OR IGNORE INTO interests (idea_id, student_id, student_name, student_batch, role_applied)
                VALUES (?, ?, ?, 'Class of 2025', 'Team Member')
            """, (idea_id, dummy_usn, f"Student {i+1}"))

    # Seed Sample Notifications
    notifications = [
        ("4NI21CS089", "New Applicant for Smart Grid", "Pooja Hegde applied for the Power Electronics Specialist role.", "applicant", "/idea.html?id=1"),
        ("4NI21CS089", "Upvote Milestone Reached!", "Your project 'Smart Campus Micro-Grid' crossed 40 upvotes on the Idea Board.", "milestone", "/idea.html?id=1"),
        ("4NI21CS089", "Department Review Approved", "Head of EEE Department approved your laboratory access request for Embedded Systems Lab 3.", "approval", "/profile.html"),
        ("4NI21CS089", "Leaderboard Update", "Your project moved to #1 on the Campus Innovation Leaderboard!", "leaderboard", "/leaderboard.html")
    ]
    for uid, title, msg, ntype, link in notifications:
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (?, ?, ?, ?, ?)
        """, (uid, title, msg, ntype, link))

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_tables()
    seed_database_if_empty()
    print("Database tables initialized and seeded successfully!")

import os
import json
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "idea_vault.db")


def get_connection():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Project Ideas Table (Rich metadata)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ideas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nie_id TEXT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT,
            categories_badge TEXT,
            department TEXT,
            department_short TEXT,
            stage TEXT DEFAULT 'Approved & Open',
            problem_statement TEXT,
            proposed_solution TEXT,
            architecture TEXT,
            tags TEXT,
            bom TEXT,
            team_slots TEXT,
            author_name TEXT,
            author_usn TEXT,
            author_batch TEXT,
            author_avatar TEXT,
            author_email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 2. Upvotes Table (Anti-double vote via UNIQUE)
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

    # 3. Collaboration Interests / Inquiries Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea_id INTEGER NOT NULL,
            student_id TEXT NOT NULL,
            student_name TEXT,
            student_dept TEXT,
            student_batch TEXT,
            student_avatar TEXT,
            role_requested TEXT,
            message TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(idea_id, student_id),
            FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
        )
    """)

    # 4. User Profiles Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
            usn TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            short_name TEXT,
            email TEXT NOT NULL,
            department TEXT,
            batch TEXT,
            batch_short TEXT,
            campus TEXT,
            cgpa TEXT,
            show_cgpa INTEGER DEFAULT 1,
            avatar TEXT,
            github TEXT,
            website TEXT,
            linkedin TEXT,
            scholar TEXT,
            open_for_collab INTEGER DEFAULT 1,
            teaming_objective TEXT,
            skills TEXT,
            desired_roles TEXT,
            authorized_labs TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


def seed_data():
    create_tables()
    conn = get_connection()
    cursor = conn.cursor()

    # Check if ideas already seeded
    cursor.execute("SELECT COUNT(*) FROM ideas")
    count = cursor.fetchone()[0]

    if count == 0:
        sample_ideas = [
            {
                "nie_id": "NIE-25-MECH-042",
                "title": "Automated Hostel Mess Food Waste Auditor with Computer Vision",
                "category": "IoT",
                "categories_badge": "IoT • AI/ML",
                "department": "Mechanical Engineering",
                "department_short": "Mech Dept",
                "stage": "In Prototyping",
                "author_name": "Ananya Deshmukh",
                "author_usn": "4NI21ME014",
                "author_batch": "Mech '25",
                "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA8BIDPilrvdunirzpmkrPuSDoGxhC1GXtrzgSHR3xV-BIKlAbJ8zDBLsUQP11ACjy51mHCnOMkUVijCFIFCpGAzVKMunJbW_WyiJKDt43R7yp2BJGhBmtcbPMJ-aaLY7gxsHEev3ODT7cpKnfkEbRsjhAIYe0prPHfp_9NoSGrIltcHsFr6A-qRD9eCUHgAPDElwu_ZfEup3tz-YXUkjR9vCyg6Wwt644NC7fMkrv_",
                "author_email": "ananya.22me014@nie.ac.in",
                "description": "Overhead camera tracking tray returns at Mysuru campus hostel mess to quantify daily wastage, categorizing food types through edge OpenCV modules and recommending dynamic mess contractor recipe scaling.",
                "problem_statement": "In the NIE South Campus dining halls, an estimated 120 kg of prepared food is discarded daily. Kitchen management currently relies on static spreadsheet logs recorded at the end of each week, offering zero actionable correlation between day-to-day menu options and actual plate remnants.",
                "proposed_solution": "An automated vision audit counter installed on the tray conveyor belt that classifies food remnants into categories and updates kitchen scaling algorithms in real time.",
                "architecture": "Dual stereoscopic RGB cameras positioned over tray conveyor belts stream 1080p frames to an edge NVIDIA Jetson Orin Nano running custom-trained YOLOv8-nano segmentation weights. Real-time inference estimates leftover volume against initial dish baselines.",
                "tags": json.dumps(["Computer Vision", "YOLOv8", "NVIDIA Jetson", "Food Security", "Waste Reduction"]),
                "bom": json.dumps([
                    {"item": "NVIDIA Jetson Orin Nano 8GB", "spec": "40 TOPS AI Performance", "qty": 1, "cost": "₹42,000"},
                    {"item": "Sony IMX477 HQ Camera Modules", "spec": "12.3MP with 6mm Wide Lens", "qty": 2, "cost": "₹9,800"},
                    {"item": "Industrial Load Cells (50kg)", "spec": "HX711 24-bit ADC Amplifier", "qty": 4, "cost": "₹3,200"}
                ]),
                "team_slots": json.dumps([
                    {"role": "Embedded Linux / Jetson Specialist", "status": "Available"},
                    {"role": "Full-Stack Dashboard Developer", "status": "Filled"},
                    {"role": "Mess Operations Liaison", "status": "Available"}
                ])
            },
            {
                "nie_id": "NIE-25-CSE-089",
                "title": "Smart Hostel Dining Waste Analytics & Tracking Platform",
                "category": "AI/ML",
                "categories_badge": "AI/ML • Web",
                "department": "Computer Science & Engineering",
                "department_short": "CSE Dept",
                "stage": "Ideation",
                "author_name": "Rohan Sharma",
                "author_usn": "4NI21CS089",
                "author_batch": "CSE '25",
                "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
                "author_email": "rohan.s.cse21@nie.ac.in",
                "description": "Digital hostel dining monitoring platform analyzing daily leftover trends and plate scrapings using edge cameras and load cell scales to optimize mess procurement.",
                "problem_statement": "Campus mess kitchens lack automated plate-waste monitoring tools to adjust meal quantities and minimize wasted groceries.",
                "proposed_solution": "Web-connected scale and camera pipeline logging discarded meals into a predictive consumption dashboard.",
                "architecture": "Raspberry Pi 4 with camera module logging plate images and scale data to a cloud PostgreSQL and FastAPI backend.",
                "tags": json.dumps(["Mess Analytics", "IoT Scales", "Plate Waste", "OpenCV"]),
                "bom": json.dumps([
                    {"item": "Raspberry Pi 4 Model B (4GB)", "spec": "Quad-core Cortex-A72", "qty": 1, "cost": "₹6,500"},
                    {"item": "USB Wide Angle Camera", "spec": "1080p 30fps Autofocus", "qty": 1, "cost": "₹2,100"}
                ]),
                "team_slots": json.dumps([
                    {"role": "Frontend React Lead", "status": "Filled"},
                    {"role": "Hardware / Sensor Engineer", "status": "Available"}
                ])
            },
            {
                "nie_id": "NIE-25-ECE-018",
                "title": "Smart Campus EV Shuttle Tracker with Real-Time Crowding Heatmap",
                "category": "IoT",
                "categories_badge": "IoT • Mobile",
                "department": "Electronics & Communication",
                "department_short": "ECE Dept",
                "stage": "Approved & Open",
                "author_name": "Karthik Rajan",
                "author_usn": "4NI21EC045",
                "author_batch": "ECE '25",
                "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA6C9d7eF3gH1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4",
                "author_email": "karthik.22ec045@nie.ac.in",
                "description": "Low-power ESP32 edge deployment paired with ultrasonic occupancy sensors inside NIE Mysuru campus electric buggies. Feeds student mobile dashboards with live wait times at Diamond Jubilee Building and Golden Jubilee Complex.",
                "problem_statement": "Students and faculty transit between North and South campuses with no real-time shuttle schedule, resulting in long queues and delayed lectures.",
                "proposed_solution": "ESP32 GPS telemetry and seat sensors transmitting location and occupancy via campus LoRaWAN gateways.",
                "architecture": "ESP32 microcontrollers with GPS and LoRa modules broadcasting over 868MHz to campus receivers.",
                "tags": json.dumps(["ESP32", "LoRaWAN", "GPS", "Fleet Tracking", "Smart Campus"]),
                "bom": json.dumps([
                    {"item": "ESP32 NodeMCU V3", "spec": "Dual Core with WiFi/BLE", "qty": 4, "cost": "₹1,600"},
                    {"item": "NEO-6M GPS Modules", "spec": "Ceramic Active Antenna", "qty": 4, "cost": "₹2,400"}
                ]),
                "team_slots": json.dumps([
                    {"role": "Firmware / C++ Developer", "status": "Filled"},
                    {"role": "Flutter App Developer", "status": "Available"}
                ])
            },
            {
                "nie_id": "NIE-25-ISE-073",
                "title": "Automated Kannada Handwritten Script OCR for Heritage Mysore Gazetteers",
                "category": "AI/ML",
                "categories_badge": "AI/ML • NLP",
                "department": "Information Science & Engineering",
                "department_short": "ISE Dept",
                "stage": "Under Review",
                "author_name": "Divya M. Gowda",
                "author_usn": "4NI21IS028",
                "author_batch": "ISE '25",
                "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
                "author_email": "divya.22is028@nie.ac.in",
                "description": "Vision transformer pipeline fine-tuned on historical Modi and Kannada archival scripts from Mysore Palace library archives, producing searchable digital epigraphs with morphological disambiguation.",
                "problem_statement": "Centuries of historical records in Mysore district library archives remain unindexed due to complex ligature conjuncts and fading ink.",
                "proposed_solution": "Custom CRNN and ViT model architecture fine-tuned on Kannada historical character sets with synthetic augmentation.",
                "architecture": "PyTorch Vision Transformer backbone coupled with CTC decoder and custom Kannada language model beam search.",
                "tags": json.dumps(["OCR", "Kannada NLP", "Vision Transformers", "Heritage Tech", "PyTorch"]),
                "bom": json.dumps([
                    {"item": "Book Drive Document Scanner", "spec": "Overhead Dual CCD 600DPI", "qty": 1, "cost": "₹85,000"}
                ]),
                "team_slots": json.dumps([
                    {"role": "NLP / Linguist Lead", "status": "Available"},
                    {"role": "Backend Data Engineer", "status": "Available"}
                ])
            },
            {
                "nie_id": "NIE-25-EEE-031",
                "title": "Substation Power Quality & Microgrid Fault Isolator with LoRa Telemetry",
                "category": "IoT",
                "categories_badge": "IoT • Energy",
                "department": "Electrical & Electronics",
                "department_short": "EEE Dept",
                "stage": "Approved & Open",
                "author_name": "Vikramaditya S.",
                "author_usn": "4NI21EE052",
                "author_batch": "EEE '25",
                "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA8BIDPilrvdunirzpmkrPuSDoGxhC1GXtrzgSHR3xV-BIKlAbJ8zDBLsUQP11ACjy51mHCnOMkUVijCFIFCpGAzVKMunJbW_WyiJKDt43R7yp2BJGhBmtcbPMJ-aaLY7gxsHEev3ODT7cpKnfkEbRsjhAIYe0prPHfp_9NoSGrIltcHsFr6A-qRD9eCUHgAPDElwu_ZfEup3tz-YXUkjR9vCyg6Wwt644NC7fMkrv_",
                "author_email": "vikram.22ee052@nie.ac.in",
                "description": "Edge-computed total harmonic distortion (THD) and fast transient fault isolation for campus solar-diesel hybrid feeder lines, broadcasting SCADA events over long-range LoRa packets to prevent breaker trips.",
                "problem_statement": "Power quality fluctuations and reverse power flow from rooftop PV panels in South Campus trigger false breaker trips and damage sensitive lab instrumentation.",
                "proposed_solution": "DSP-driven harmonic analysis node triggering solid-state isolation relays within 4 milliseconds of voltage swell.",
                "architecture": "TI TMS320F28379D dual-core DSP reading Rogowski coils and precision PTs, outputting to LoRaWAN gateway.",
                "tags": json.dumps(["Microgrid", "Power Electronics", "LoRa", "Fault Isolation", "SCADA"]),
                "bom": json.dumps([
                    {"item": "TI C2000 Delfino MCU LaunchPad", "spec": "Dual Core 200MHz", "qty": 2, "cost": "₹11,500"},
                    {"item": "Hall Effect Current Transducers", "spec": "LEM LA55-P 50A", "qty": 6, "cost": "₹7,200"}
                ]),
                "team_slots": json.dumps([
                    {"role": "Power Electronics Hardware Engineer", "status": "Filled"},
                    {"role": "Embedded C Developer", "status": "Available"}
                ])
            },
            {
                "nie_id": "NIE-25-CSE-094",
                "title": "Tamper-Proof Semester Grade Card Verification via Polygon Network",
                "category": "Other",
                "categories_badge": "Blockchain • Web",
                "department": "Computer Science & Engineering",
                "department_short": "CSE Dept",
                "stage": "Team Formed",
                "author_name": "Meera Nambiar",
                "author_usn": "4NI21CS062",
                "author_batch": "CSE '25",
                "author_avatar": "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
                "author_email": "meera.22cs062@nie.ac.in",
                "description": "Decentralized credential verification issuing verifiable semester marksheets as Soulbound non-fungible tokens on Ethereum Layer 2 to eliminate physical transcript forgery during overseas admissions.",
                "problem_statement": "Manual transcript validation by employers and international universities requires weeks of administrative overhead and remains susceptible to forged paper seals.",
                "proposed_solution": "Verifiable W3C credentials and ERC-5192 Soulbound Tokens minted with autonomous smart contract verification keys.",
                "architecture": "Solidity smart contracts deployed on Polygon PoS, with IPFS encrypted student credential storage and ERC-5192 Soulbound standard.",
                "tags": json.dumps(["Blockchain", "Polygon", "Solidity", "Zero-Knowledge", "Soulbound Token"]),
                "bom": json.dumps([
                    {"item": "Polygon Mainnet Gas Allocation", "spec": "100 POL Credits", "qty": 1, "cost": "₹4,000"}
                ]),
                "team_slots": json.dumps([
                    {"role": "Solidity Smart Contract Auditor", "status": "Available"},
                    {"role": "Full-Stack Web3 Developer", "status": "Filled"}
                ])
            }
        ]

        for idea in sample_ideas:
            cursor.execute("""
                INSERT INTO ideas (
                    nie_id, title, description, category, categories_badge,
                    department, department_short, stage, problem_statement,
                    proposed_solution, architecture, tags, bom, team_slots,
                    author_name, author_usn, author_batch, author_avatar, author_email
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                idea["nie_id"], idea["title"], idea["description"], idea["category"], idea["categories_badge"],
                idea["department"], idea["department_short"], idea["stage"], idea["problem_statement"],
                idea["proposed_solution"], idea["architecture"], idea["tags"], idea["bom"], idea["team_slots"],
                idea["author_name"], idea["author_usn"], idea["author_batch"], idea["author_avatar"], idea["author_email"]
            ))

        # Seed initial upvotes for ideas
        cursor.execute("INSERT OR IGNORE INTO upvotes (idea_id, student_id) VALUES (1, '4NI21CS001')")
        cursor.execute("INSERT OR IGNORE INTO upvotes (idea_id, student_id) VALUES (1, '4NI21EC002')")
        cursor.execute("INSERT OR IGNORE INTO upvotes (idea_id, student_id) VALUES (1, '4NI21ME003')")
        cursor.execute("INSERT OR IGNORE INTO upvotes (idea_id, student_id) VALUES (3, '4NI21CS089')")
        cursor.execute("INSERT OR IGNORE INTO upvotes (idea_id, student_id) VALUES (3, '4NI21IS010')")

        # Seed collaborator inquiries
        cursor.execute("""
            INSERT OR IGNORE INTO interests (
                idea_id, student_id, student_name, student_dept, student_batch, student_avatar, role_requested, message
            ) VALUES (
                1, '4NI21EC019', 'Darshan Gowda', 'Electronics & Comm.', 'ECE ''25',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA6C9d7eF3gH1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4',
                'Hardware Lead', 'Interested in building the Jetson Orin Nano camera mounting fixture.'
            )
        """)
        cursor.execute("""
            INSERT OR IGNORE INTO interests (
                idea_id, student_id, student_name, student_dept, student_batch, student_avatar, role_requested, message
            ) VALUES (
                4, '4NI21IS042', 'Ananya P. Rao', 'Information Science', 'ISE ''25',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDFW21bJ0r1x2GgN0E_3x4y5z6',
                'NLP Model Design', 'Experienced with transformer attention layers on Kannada scripts.'
            )
        """)

    # Seed Default User Profile if not present
    cursor.execute("SELECT COUNT(*) FROM user_profiles WHERE usn = '4NI21CS089'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO user_profiles (
                usn, name, short_name, email, department, batch, batch_short, campus,
                cgpa, show_cgpa, avatar, github, website, linkedin, scholar,
                open_for_collab, teaming_objective, skills, desired_roles, authorized_labs
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "4NI21CS089",
            "Rohan Sharma",
            "Rohan S.",
            "rohan.s.cse21@nie.ac.in",
            "Computer Science & Engineering (CSE)",
            "Class of 2025 (8th Semester - Capstone Final)",
            "CSE '25",
            "NIE South Campus (Manandavadi Road)",
            "8.92 / 10.0",
            1,
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
            "rohansharma-nie",
            "https://rohansharma.dev",
            "rohansharma-cse",
            "scholar.google.com/citations?user=nie_cs",
            1,
            "Actively looking for Hardware / ECE Co-Founders for Smart Grid Micro-Inverter project.",
            json.dumps(["React.js", "Python 3.11", "FastAPI", "PyTorch", "ESP32 Firmware", "Docker", "PostgreSQL"]),
            json.dumps(["Backend / Cloud Architect", "ML Edge Engineer"]),
            json.dumps(["C-Block IoT Research Cell", "Embedded Systems Lab 3"])
        ))

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_tables()
    seed_data()
    print("Database tables created and sample NIE capstone ideas seeded successfully!")

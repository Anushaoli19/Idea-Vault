from sqlalchemy.orm import Session
from app.models import Application, Idea, Notification, OpenRole, Upvote, User

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    # 1. Create Key Users
    rohan = User(
        id="usr-rohan-cse",
        usn="4NI21CS142",
        name="Rohan S.",
        email="rohan.cs21@nie.ac.in",
        department="Computer Science & Engineering",
        batch="CSE '25",
        cgpa=9.32,
        role="Student Innovator",
        avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
        github_url="https://github.com/rohan-nie",
        linkedin_url="https://linkedin.com/in/rohan-s-nie",
        points=485,
        available_for_collab=True,
        lab_clearances="IoT Lab (Block C), High Performance Computing Hub",
    )

    ananya = User(
        id="usr-ananya-mech",
        usn="4NI21ME035",
        name="Ananya Deshmukh",
        email="ananya.me21@nie.ac.in",
        department="Mechanical Engineering",
        batch="Mech '25",
        cgpa=9.15,
        role="Capstone Lead",
        avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuC9gz_UabGXkeRvqL1i7nOT6UyLfuL_SH8eZPE_wZ4SgHS-svxW-c4cSsVfrXOmsv_UMwL89LyvhQd6RjN3T6dqNbTH2QXIIVf8Ofk04WXCA6MJs41b5MoXPXXfnT9IEkZOltCI_mzcnyI0XQi_swthskYsj8QM4NhffhNiMrqWV-cGk_E4d2wpNHtX9RbdTbvbwMBTLUVHIYENln8Va3v7Ld2xjUy_Zn-aS27szyiF",
        github_url="https://github.com/ananya-deshmukh",
        linkedin_url="https://linkedin.com/in/ananya-deshmukh-nie",
        points=540,
        available_for_collab=True,
        lab_clearances="Mechatronics & Vision Lab, Rapid Prototyping Cell",
    )

    karthik = User(
        id="usr-karthik-ece",
        usn="4NI21EC088",
        name="Karthik R.",
        email="karthik.ec21@nie.ac.in",
        department="Electronics & Communication",
        batch="ECE '25",
        cgpa=8.95,
        role="Hardware Architect",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        github_url="https://github.com/karthik-ece",
        linkedin_url="https://linkedin.com/in/karthik-r-ece",
        points=420,
        available_for_collab=True,
        lab_clearances="Embedded Systems Lab, Robotics Testbed",
    )

    priya = User(
        id="usr-priya-aiml",
        usn="4NI22AI019",
        name="Priya N.",
        email="priya.ai22@nie.ac.in",
        department="AI & Machine Learning",
        batch="AIML '26",
        cgpa=9.45,
        role="ML Researcher",
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        github_url="https://github.com/priya-aiml",
        linkedin_url="https://linkedin.com/in/priya-n-aiml",
        points=390,
        available_for_collab=True,
        lab_clearances="NVIDIA GPU Cluster (North Campus)",
    )

    sahana = User(
        id="usr-sahana-civil",
        usn="4NI21CV042",
        name="Sahana K.",
        email="sahana.cv21@nie.ac.in",
        department="Civil Engineering",
        batch="Civil '25",
        cgpa=8.88,
        role="Environmental Engineer",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        github_url="https://github.com/sahana-civil",
        linkedin_url="https://linkedin.com/in/sahana-k-nie",
        points=310,
        available_for_collab=False,
        lab_clearances="Hydraulics & Geo-informatics Lab",
    )

    db.add_all([rohan, ananya, karthik, priya, sahana])
    db.commit()

    # 2. Create Core Capstone Ideas
    # Idea 1: Conflicting Capstone for Duplicate Demo (Hostel Mess Waste Auditor)
    idea1 = Idea(
        id="idea-mess-waste-auditor",
        title="Automated Hostel Mess Food Waste Auditor with Computer Vision",
        category="IoT",
        department="ECE",
        maturity="Prototype",
        summary="Overhead camera tracking tray returns at Mysuru campus hostel mess to quantify daily wastage, categorizing food types through edge OpenCV modules and recommending dynamic mess contractor recipe scaling.",
        problem_statement="Over 65 kg of edible food is discarded daily across hostel dining halls at NIE Mysuru without objective per-meal quantification. Traditional manual audits are inaccurate, unhygienic, and unable to attribute wastage to specific menu preparations or predict optimal procurement quantities.",
        architecture_description="Raspberry Pi 4 running lightweight MobileNet-V2 food classification model synchronized with load cell strain gauge matrix underneath return conveyors. InfluxDB records per-tray discarded weight, feeding a FastAPI analytics server that generates predictive replenishment schedules.",
        tech_tags="IoT, Computer Vision, Raspberry Pi, Python, OpenCV, MQTT, InfluxDB",
        bill_of_materials="Raspberry Pi 4 4GB Model B, 4x 10kg Load Cells with HX711 ADCs, Sony IMX219 8MP Camera, Custom 3D Printed IP54 Enclosure",
        metrics_json='{"daily_waste_reduction": "45 kg", "sensor_latency": "120ms", "annual_cost_savings": "₹3.8L"}',
        status="Approved & Open",
        faculty_mentor="Dr. Rohini S. (Assoc. Prof., ECE Department)",
        lab_status="Active Testing at Diamond Jubilee Hostel Mess",
        author_id=ananya.id,
        author_name=ananya.name,
        author_dept=ananya.department,
        author_batch=ananya.batch,
        author_avatar=ananya.avatar_url,
        upvotes_count=84,
        interested_count=19,
    )

    # Idea 2: Smart Campus Energy Grid (Showcase Detail Screen)
    idea2 = Idea(
        id="idea-smart-energy-grid",
        title="Smart Campus Microgrid & Solar PV Battery Optimizer",
        category="IoT",
        department="CSE",
        maturity="Validation",
        summary="Distributed IoT sensor network and real-time power routing across NIE North and South campus buildings, forecasting solar yields and shaving peak grid demand with lithium-ferro-phosphate storage.",
        problem_statement="Unbalanced three-phase loads and non-coincident peak demands across South Campus academic blocks lead to high demand tariff penalties and suboptimal self-consumption of rooftop 250 kWp solar PV installations.",
        architecture_description="ESP32 telemetry microcontrollers measuring real-time voltage, current, and THD via Modbus RS485. Data streams over campus LoRaWAN to a local server running an adaptive Model Predictive Control (MPC) dispatch algorithm managing grid peak shaving.",
        tech_tags="IoT, Embedded Systems, Solar PV, LoRaWAN, Python, TimeSeries, FastAPI",
        bill_of_materials="Custom ESP32 Modbus Gateway, 12x Schneider Electric IEM3155 Energy Meters, HopeRF RFM95W LoRa Modules, 48V 100Ah LiFePO4 Battery Bench",
        metrics_json='{"peak_demand_reduction": "28 kW", "solar_self_consumption": "94.2%", "monthly_bill_reduction": "₹42,000"}',
        status="Approved & Open",
        faculty_mentor="Dr. B. K. Sridhara (Prof. & Head, Electrical Engg.)",
        lab_status="Cleared for Bench 4, Renewable Energy Lab (Block D)",
        author_id=rohan.id,
        author_name=rohan.name,
        author_dept=rohan.department,
        author_batch=rohan.batch,
        author_avatar=rohan.avatar_url,
        upvotes_count=128,
        interested_count=34,
    )

    # Idea 3: Autonomous Campus Mail Rover
    idea3 = Idea(
        id="idea-campus-mail-rover",
        title="Autonomous Inter-Department Document & Mail Delivery Rover",
        category="AI/ML",
        department="Mech",
        maturity="Prototype",
        summary="Four-wheel differential drive robotic rover equipped with 2D LiDAR SLAM and camera vision for autonomous inter-departmental memo and examination dossier transit between Administrative Block and GJ Block.",
        problem_statement="Staff spend considerable manual hours daily physically carrying sealed exam papers and inter-departmental files across campus pathways, frequently hampered by campus traffic and inclement weather.",
        architecture_description="ROS 2 (Robot Operating System) navigation stack running on Jetson Orin Nano, fusing RPLiDAR A1 mapping with RealSense depth perception and GPS waypoint routing.",
        tech_tags="Robotics, ROS 2, Jetson Nano, LiDAR, SLAM, Python, C++",
        bill_of_materials="NVIDIA Jetson Orin Nano, Slamtec RPLiDAR A1, 4x Planetary Gear DC Motors, Aluminum Extrusion Chassis",
        metrics_json='{"transit_speed": "1.2 m/s", "payload_capacity": "15 kg", "obstacle_clearance_time": "350ms"}',
        status="Approved & Open",
        faculty_mentor="Dr. Ramesh M. (Prof., Mechanical Engg.)",
        lab_status="Prototyping Bench 2, Mechatronics Cell",
        author_id=karthik.id,
        author_name=karthik.name,
        author_dept=karthik.department,
        author_batch=karthik.batch,
        author_avatar=karthik.avatar_url,
        upvotes_count=92,
        interested_count=22,
    )

    # Idea 4: City Bus Transit Tracker
    idea4 = Idea(
        id="idea-mysore-bus-tracker",
        title="Real-Time Mysore City Bus Transit Tracker & Crowding Prediction",
        category="App",
        department="AIML",
        maturity="Concept",
        summary="Crowdsourced and GPS-driven transit mobile app predicting route arrival times and commuter congestion across KSRTC suburban lines servicing NIE South and North campuses.",
        problem_statement="Over 1,200 commuting students face severe uncertainty on suburban bus frequency between Mysuru Suburban Bus Stand, Kuvempunagar, and NIE North Campus, causing frequent tardiness for morning lecture sessions.",
        architecture_description="Flutter cross-platform mobile application communicating with a high-throughput WebSocket gateway streaming GTFS real-time transit telemetry and XGBoost passenger load predictions.",
        tech_tags="Mobile App, Flutter, FastAPI, XGBoost, Redis, Docker, Maps API",
        bill_of_materials="Cloud Compute VM, OpenStreetMap Tiles Server, Twilio SMS Dispatch Gateway",
        metrics_json='{"eta_accuracy": "91%", "user_base": "850+ Students", "prediction_window": "30 mins"}',
        status="Under Faculty Review",
        faculty_mentor="Dr. P. Devaki (Prof., AIML Dept)",
        lab_status="Software Dev Lab 2",
        author_id=priya.id,
        author_name=priya.name,
        author_dept=priya.department,
        author_batch=priya.batch,
        author_avatar=priya.avatar_url,
        upvotes_count=67,
        interested_count=14,
    )

    # Idea 5: Water Quality Sensor Network
    idea5 = Idea(
        id="idea-water-quality-iot",
        title="Campus Water Harvesting & Potability Real-Time Sensor Grid",
        category="IoT",
        department="Civil",
        maturity="Prototype",
        summary="Multiparameter optical and electrochemical probe stations monitoring TDS, pH, turbidity, and tank levels across all campus overhead cisterns with automated bleach dosing relays.",
        problem_statement="Seasonal monsoon silt ingress into campus overhead tanks can cause unmonitored microbial contamination before periodic manual quarterly chemical lab tests detect water degradation.",
        architecture_description="Solar-powered ESP32 telemetry nodes equipped with RS485 digital optical turbidity and industrial glass pH probes broadcasting telemetry every 15 minutes to campus facilities dashboard.",
        tech_tags="IoT, Civil Sensors, Water Quality, LoRa, ESP32, Grafana",
        bill_of_materials="DFRobot Industrial pH Sensor, Gravity Turbidity Sensor, 10W Monocrystalline Solar Panel, IP68 Enclosures",
        metrics_json='{"monitoring_points": "14 Cisterns", "testing_frequency": "Continuous", "contamination_alert_sla": "< 5 min"}',
        status="Team Formed",
        faculty_mentor="Dr. N. Suresh (Prof., Civil Engineering)",
        lab_status="Environmental Engg Testing Ground",
        author_id=sahana.id,
        author_name=sahana.name,
        author_dept=sahana.department,
        author_batch=sahana.batch,
        author_avatar=sahana.avatar_url,
        upvotes_count=48,
        interested_count=8,
    )

    db.add_all([idea1, idea2, idea3, idea4, idea5])
    db.commit()

    # 3. Create Open Roles for Teammate Matching
    role1 = OpenRole(
        id="role-1",
        idea_id=idea1.id,
        role_title="Computer Vision & Edge ML Engineer",
        department_required="CSE / AIML",
        skills_required="OpenCV, TensorFlow Lite, Python, Edge TPU",
        total_slots=2,
        filled_slots=0,
        kickoff_date="Immediate Sprint",
    )
    role2 = OpenRole(
        id="role-2",
        idea_id=idea1.id,
        role_title="Embedded Firmware & Sensor Developer",
        department_required="ECE",
        skills_required="C++, ESP32, Load Cells, SPI/I2C, FreeRTOS",
        total_slots=1,
        filled_slots=0,
        kickoff_date="Next Week",
    )
    role3 = OpenRole(
        id="role-3",
        idea_id=idea2.id,
        role_title="Frontend & Data Visualization Lead",
        department_required="CSE / ISE",
        skills_required="React, TypeScript, Tailwind, Chart.js / Recharts",
        total_slots=2,
        filled_slots=1,
        kickoff_date="March 1st",
    )
    role4 = OpenRole(
        id="role-4",
        idea_id=idea2.id,
        role_title="Power Electronics Hardware Specialist",
        department_required="ECE / EEE",
        skills_required="Modbus RS485, PCB Design, Inverters, Battery BMS",
        total_slots=1,
        filled_slots=0,
        kickoff_date="Immediate Sprint",
    )
    role5 = OpenRole(
        id="role-5",
        idea_id=idea3.id,
        role_title="SLAM & ROS 2 Navigation Specialist",
        department_required="ECE / CSE",
        skills_required="ROS 2 Humble, C++, 2D LiDAR SLAM, Navigation 2",
        total_slots=2,
        filled_slots=1,
        kickoff_date="Sprint 2",
    )
    role6 = OpenRole(
        id="role-6",
        idea_id=idea4.id,
        role_title="Flutter Mobile UI/UX Engineer",
        department_required="Any",
        skills_required="Flutter, Dart, Provider / Riverpod, Google Maps API",
        total_slots=2,
        filled_slots=0,
        kickoff_date="April 2026",
    )

    db.add_all([role1, role2, role3, role4, role5, role6])
    db.commit()

    # 4. Create Notifications
    notif1 = Notification(
        id="notif-1",
        user_id=rohan.id,
        type="teammates",
        title="New Teammate Application",
        message="Karthik R. (ECE '25) applied for the Power Electronics Hardware Specialist role on your Smart Campus Energy Grid project.",
        action_link="/teammates",
        applicant_id=karthik.id,
        applicant_name=karthik.name,
        applicant_dept="ECE '25",
        role_id=role4.id,
        role_title="Power Electronics Hardware Specialist",
        is_actionable=True,
        action_status="pending",
        is_read=False,
    )
    notif2 = Notification(
        id="notif-2",
        user_id=rohan.id,
        type="upvotes",
        title="Project Milestone Reached",
        message="Your project 'Smart Campus Microgrid & Solar PV Battery Optimizer' crossed 125 community upvotes!",
        action_link=f"/idea/{idea2.id}",
        is_actionable=False,
        is_read=False,
    )
    notif3 = Notification(
        id="notif-3",
        user_id=rohan.id,
        type="grants",
        title="Faculty Seed Grant Approved",
        message="Dr. B. K. Sridhara approved your Lab Bench 4 testing clearance and sanctioned ₹25,000 component prototype grant.",
        action_link="/submissions",
        is_actionable=False,
        is_read=True,
    )

    db.add_all([notif1, notif2, notif3])
    db.commit()

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.database import Base, get_db
from app.main import app
from app.seed import seed_database

# Use in-memory SQLite with StaticPool so all queries share the same in-memory database
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    seed_database(db)
    yield db
    db.close()
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "NIE Idea Vault" in data["service"]

def test_list_ideas(client):
    response = client.get("/api/v1/ideas")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    titles = [i["title"] for i in data]
    assert any("Hostel Mess Food Waste" in t for t in titles)
    assert any("Smart Campus Microgrid" in t for t in titles)

def test_search_and_filter_ideas(client):
    # Test keyword search
    response = client.get("/api/v1/ideas?q=Microgrid")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert "Microgrid" in data[0]["title"]

    # Test category filter
    response = client.get("/api/v1/ideas?category=IoT")
    assert response.status_code == 200
    data = response.json()
    assert all(i["category"] == "IoT" for i in data)

def test_get_idea_detail(client):
    ideas = client.get("/api/v1/ideas").json()
    first_id = ideas[0]["id"]
    response = client.get(f"/api/v1/ideas/{first_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == first_id
    assert "open_roles" in data
    assert "problem_statement" in data

def test_duplicate_check_high_match(client):
    # Check similar idea to hostel mess food waste
    payload = {
        "title": "Automated Mess Tray Food Waste Monitor",
        "category": "IoT",
        "department": "ECE",
        "problem_statement": "Students dump discarded food in hostel dining mess without weight tracking. Using computer vision cameras and load cells to quantify daily wastage.",
        "tech_tags": "IoT, Computer Vision, Raspberry Pi, OpenCV",
        "summary": "Camera above conveyor to count tray returns and weigh waste.",
    }
    response = client.post("/api/v1/ideas/check-duplicate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_duplicate"] is True
    assert data["percentage_match"] >= 75
    assert data["level"] in ["amber", "yellow"]
    assert data["breakdown"]["problem_context_match"] > 50
    assert data["conflicting_project"] is not None
    assert "Hostel Mess Food Waste" in data["conflicting_project"]["title"]

def test_duplicate_check_novel_idea(client):
    # Check novel concept
    payload = {
        "title": "Superconducting Quantum Qubit Cryogenic Resonator Testing Rig",
        "category": "Other",
        "department": "Physics",
        "problem_statement": "Characterizing dilution refrigerator microwave noise at 15 millikelvin for superconducting transmon qubits.",
        "tech_tags": "Quantum Computing, Cryogenics, Microwave Engineering, Python",
        "summary": "Novel quantum hardware diagnostic probe.",
    }
    response = client.post("/api/v1/ideas/check-duplicate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["percentage_match"] < 40
    assert data["level"] == "green"
    assert data["is_duplicate"] is False

def test_toggle_upvote(client):
    ideas = client.get("/api/v1/ideas").json()
    idea_id = ideas[0]["id"]
    initial_upvotes = ideas[0]["upvotes_count"]

    # Upvote
    response = client.post(f"/api/v1/ideas/{idea_id}/upvote", json={"user_id": "usr-rohan-cse"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["count"] == initial_upvotes + 1

    # Remove upvote
    response2 = client.post(f"/api/v1/ideas/{idea_id}/upvote", json={"user_id": "usr-rohan-cse"})
    assert response2.status_code == 200
    assert response2.json()["count"] == initial_upvotes

def test_leaderboard(client):
    response = client.get("/api/v1/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert len(data["top_podium"]) == 3
    assert len(data["department_rankings"]) >= 5
    assert len(data["student_table"]) >= 5

def test_teammate_roles_and_apply(client):
    roles_res = client.get("/api/v1/teammates/roles")
    assert roles_res.status_code == 200
    roles = roles_res.json()
    assert len(roles) >= 1

    role_id = roles[0]["id"]
    apply_payload = {
        "role_id": role_id,
        "applicant_id": "usr-karthik-ece",
        "note": "Experienced with ESP32 and C++ firmware.",
    }
    apply_res = client.post("/api/v1/teammates/apply", json=apply_payload)
    assert apply_res.status_code == 201
    assert apply_res.json()["success"] is True

def test_notifications_and_action(client):
    notifs_res = client.get("/api/v1/notifications?user_id=usr-rohan-cse")
    assert notifs_res.status_code == 200
    notifs = notifs_res.json()
    assert len(notifs) >= 1

    actionable_notif = next((n for n in notifs if n["is_actionable"]), None)
    if actionable_notif:
        action_res = client.post(
            f"/api/v1/notifications/{actionable_notif['id']}/action",
            json={"action": "accept"},
        )
        assert action_res.status_code == 200
        assert action_res.json()["success"] is True

import unittest
import json
import os
import sys

# Add backend to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import app
from database import get_connection, create_tables, seed_database_if_empty


class FullSystemE2ETestCase(unittest.TestCase):

    @classmethod
    def cleanup_test_data(cls):
        conn = get_connection()
        c = conn.cursor()
        c.execute("DELETE FROM ideas WHERE id > 6 OR title LIKE 'Cryogenic%' OR title LIKE '[TEST]%'")
        c.execute("DELETE FROM roles WHERE idea_id > 6")
        c.execute("DELETE FROM upvotes WHERE student_id LIKE '4NI21%' AND student_id != '4NI21CS089'")
        c.execute("DELETE FROM interests WHERE student_id LIKE '4NI21%' AND student_id != '4NI21CS089'")
        conn.commit()
        conn.close()

    @classmethod
    def setUpClass(cls):
        create_tables()
        seed_database_if_empty()
        cls.cleanup_test_data()
        cls.client = app.test_client()

    @classmethod
    def tearDownClass(cls):
        cls.cleanup_test_data()

    def test_01_static_pages_accessible(self):
        pages = [
            "/",
            "/index.html",
            "/post.html",
            "/idea.html",
            "/submissions.html",
            "/leaderboard.html",
            "/teammates.html",
            "/notifications.html",
            "/settings.html",
            "/profile.html",
            "/app.js",
            "/styles.css"
        ]
        for page in pages:
            res = self.client.get(page)
            self.assertEqual(res.status_code, 200, f"Page {page} returned status {res.status_code}")
            res.close()

    def test_02_ideas_api(self):
        res = self.client.get("/ideas")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 6)

    def test_03_idea_detail_smart_grid(self):
        res = self.client.get("/ideas/1")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("Smart Campus Micro-Grid", data["title"])
        self.assertIn("roles", data)
        self.assertIn("bom", data)

    def test_04_duplicate_preflight_detection(self):
        payload = {
            "title": "Smart Campus Micro-Grid Optimization",
            "description": "An autonomous micro-grid power distribution system dynamically redistributing solar generation and battery storage across campus departments."
        }
        res = self.client.post("/ideas/check-duplicate", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["is_duplicate"])
        self.assertGreaterEqual(data["similarity_score"], 40.0)
        self.assertEqual(data["similar_idea"]["id"], 1)

    def test_05_duplicate_post_blocks_and_force_bypass_succeeds(self):
        dup_payload = {
            "title": "Smart Campus Micro-Grid Energy Balancing",
            "description": "An autonomous micro-grid power distribution system for educational institutions using solar panels and battery storage.",
            "category": "CleanTech"
        }
        # First attempt: duplicate detected -> HTTP 409
        res_blocked = self.client.post("/ideas", json=dup_payload)
        self.assertEqual(res_blocked.status_code, 409)
        blocked_data = res_blocked.get_json()
        self.assertTrue(blocked_data["duplicate"])

        # Second attempt: user chooses "Proceed with separate submission" -> force=True -> HTTP 201
        forced_payload = dict(dup_payload)
        forced_payload["force"] = True
        forced_payload["title"] = "[TEST] Smart Campus Micro-Grid Energy Balancing (Separate Study)"
        res_forced = self.client.post("/ideas", json=forced_payload)
        self.assertEqual(res_forced.status_code, 201)
        created_data = res_forced.get_json()
        self.assertIn("idea_id", created_data)

    def test_06_upvotes_and_interests(self):
        res_up = self.client.post("/ideas/1/upvote", json={"student_id": "4NI21E2E_TEST"})
        self.assertEqual(res_up.status_code, 200)

        res_int = self.client.post("/ideas/1/interest", json={
            "student_id": "4NI21E2E_TEST",
            "student_name": "E2E Tester",
            "role_applied": "Telemetry Engineer"
        })
        self.assertEqual(res_int.status_code, 200)

    def test_07_leaderboard_data(self):
        res = self.client.get("/leaderboard")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("top_ideas", data)
        self.assertIn("department_stats", data)
        self.assertIn("top_innovators", data)

    def test_08_roles_data(self):
        res = self.client.get("/roles")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_09_notifications_and_read_all(self):
        res = self.client.get("/notifications?user_id=4NI21CS089")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("notifications", data)

        res_read_all = self.client.post("/notifications/read-all?user_id=4NI21CS089")
        self.assertEqual(res_read_all.status_code, 200)

    def test_10_profile_read_and_update(self):
        res_get = self.client.get("/profile?student_id=4NI21CS089")
        self.assertEqual(res_get.status_code, 200)
        prof = res_get.get_json()
        self.assertEqual(prof["student_id"], "4NI21CS089")

        res_put = self.client.put("/profile", json={
            "student_id": "4NI21CS089",
            "bio": "Updated bio via automated full-stack verification test."
        })
        self.assertEqual(res_put.status_code, 200)


if __name__ == "__main__":
    unittest.main()

import unittest
import json
import sys
import os
import time

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import app
from database import create_tables, seed_database_if_empty, get_connection


class IdeaVaultApiTestCase(unittest.TestCase):

    @classmethod
    def cleanup_test_data(cls):
        conn = get_connection()
        c = conn.cursor()
        c.execute("DELETE FROM ideas WHERE id > 6 OR title LIKE 'Cryogenic%' OR title LIKE '[TEST]%'")
        c.execute("DELETE FROM roles WHERE idea_id > 6")
        c.execute("DELETE FROM upvotes WHERE student_id LIKE '4NI21VOTE_%'")
        c.execute("DELETE FROM interests WHERE student_id LIKE '4NI21INT_%'")
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

    def test_01_get_ideas_list(self):
        res = self.client.get("/ideas")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        first = data[0]
        self.assertIn("title", first)
        self.assertIn("upvotes", first)
        self.assertIn("interested_students", first)
        self.assertIn("bom", first)

    def test_02_get_idea_detail(self):
        res = self.client.get("/ideas/1")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["id"], 1)
        self.assertIn("Smart Campus Micro-Grid", data["title"])
        self.assertIn("roles", data)
        self.assertIn("interested_users", data)

    def test_03_duplicate_check_endpoint(self):
        # A proposal semantically identical to Smart Campus Micro-Grid
        duplicate_payload = {
            "title": "Smart Campus Micro-Grid Power Optimization System",
            "description": "An automated micro-grid power distribution system for educational institutions. Dynamically redistributes solar generation using IoT telemetry."
        }
        res = self.client.post("/ideas/check-duplicate", json=duplicate_payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["is_duplicate"], f"Expected duplicate but got score {data.get('similarity_score')}")
        self.assertGreaterEqual(data["similarity_score"], 40.0)
        self.assertIsNotNone(data["similar_idea"])
        self.assertIn("Smart Campus Micro-Grid", data["similar_idea"]["title"])

    def test_04_submit_idea_duplicate_blocked(self):
        duplicate_payload = {
            "title": "Smart Campus Micro-Grid Power Optimization",
            "description": "An automated micro-grid power distribution system for educational institutions. Dynamically redistributes solar generation and battery reserves.",
            "category": "CleanTech"
        }
        res = self.client.post("/ideas", json=duplicate_payload)
        self.assertEqual(res.status_code, 409)
        data = res.get_json()
        self.assertTrue(data["duplicate"])
        self.assertIn("similar_idea", data)

    def test_05_submit_novel_idea_succeeds(self):
        ts = int(time.time() * 1000)
        novel_payload = {
            "title": f"Cryogenic Superconducting Coil Launcher {ts}",
            "description": f"Experimental magnetic induction accelerator utilizing liquid nitrogen bath cooled niobium coils for high-g orbital nanosatellite testing batch {ts}.",
            "category": "CleanTech",
            "department": "Mechanical Engineering",
            "author_name": "Rohan Sharma",
            "author_usn": "4NI21CS089"
        }
        res = self.client.post("/ideas", json=novel_payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertFalse(data["duplicate"])
        self.assertIn("idea_id", data)

    def test_06_upvote_toggle(self):
        student_id = f"4NI21VOTE_{int(time.time() * 1000)}"
        # First upvote: adds upvote
        res1 = self.client.post("/ideas/1/upvote", json={"student_id": student_id})
        self.assertEqual(res1.status_code, 200)
        data1 = res1.get_json()
        self.assertTrue(data1["is_upvoted"])

        # Second upvote: removes upvote
        res2 = self.client.post("/ideas/1/upvote", json={"student_id": student_id})
        self.assertEqual(res2.status_code, 200)
        data2 = res2.get_json()
        self.assertFalse(data2["is_upvoted"])

    def test_07_interest_registration(self):
        student_id = f"4NI21INT_{int(time.time() * 1000)}"
        res = self.client.post("/ideas/1/interest", json={
            "student_id": student_id,
            "student_name": "Test Collaborator",
            "role_applied": "Power Electronics Lead"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["is_interested"])

    def test_08_leaderboard_endpoint(self):
        res = self.client.get("/leaderboard")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("top_ideas", data)
        self.assertIn("department_stats", data)
        self.assertIn("top_innovators", data)

    def test_09_open_roles_endpoint(self):
        res = self.client.get("/roles")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_10_notifications_and_profile(self):
        res_notif = self.client.get("/notifications?user_id=4NI21CS089")
        self.assertEqual(res_notif.status_code, 200)
        self.assertIn("notifications", res_notif.get_json())

        res_prof = self.client.get("/profile?student_id=4NI21CS089")
        self.assertEqual(res_prof.status_code, 200)
        prof_data = res_prof.get_json()
        self.assertEqual(prof_data["student_id"], "4NI21CS089")
        self.assertIn("skills", prof_data)

    def test_11_update_profile(self):
        payload = {
            "student_id": "4NI21CS089",
            "name": "Rohan Sharma Verified",
            "bio": "Updated Capstone Lead Bio",
            "website": "https://rohansharma.nie.ac.in",
            "scholar": "0009-0004-9122-481X",
            "skills": ["React.js", "Python 3.11", "Edge AI"]
        }
        res = self.client.put("/profile", json=payload)
        self.assertEqual(res.status_code, 200)

        # Verify persistence
        res2 = self.client.get("/profile?student_id=4NI21CS089")
        self.assertEqual(res2.status_code, 200)
        data = res2.get_json()
        self.assertEqual(data["name"], "Rohan Sharma Verified")
        self.assertEqual(data["website"], "https://rohansharma.nie.ac.in")
        self.assertIn("Edge AI", data["skills"])

    def test_12_get_and_update_settings(self):
        res = self.client.get("/settings?student_id=4NI21CS089")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("theme", data)
        self.assertIn("accent", data)

        update_payload = {
            "student_id": "4NI21CS089",
            "theme": "dark",
            "accent": "slate",
            "email_notifs": 1
        }
        res_put = self.client.put("/settings", json=update_payload)
        self.assertEqual(res_put.status_code, 200)

        res2 = self.client.get("/settings?student_id=4NI21CS089")
        data2 = res2.get_json()
        self.assertEqual(data2["theme"], "dark")
        self.assertEqual(data2["accent"], "slate")

    def test_13_change_password(self):
        # Reset password to default for idempotency
        conn = get_connection()
        conn.cursor().execute("UPDATE profiles SET password = 'NieMysuru@2025' WHERE student_id = '4NI21CS089'")
        conn.commit()
        conn.close()

        # Short password fails
        res_fail = self.client.post("/settings/password", json={
            "student_id": "4NI21CS089",
            "new_password": "123"
        })
        self.assertEqual(res_fail.status_code, 400)

        # Valid password succeeds
        res_ok = self.client.post("/settings/password", json={
            "student_id": "4NI21CS089",
            "current_password": "NieMysuru@2025",
            "new_password": "SafePassword@2026"
        })
        self.assertEqual(res_ok.status_code, 200)

        # Reset back for clean state
        conn = get_connection()
        conn.cursor().execute("UPDATE profiles SET password = 'NieMysuru@2025' WHERE student_id = '4NI21CS089'")
        conn.commit()
        conn.close()

    def test_14_revoke_sessions(self):
        res = self.client.post("/settings/sessions/revoke", json={
            "student_id": "4NI21CS089",
            "all_others": True
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("sessions", data)
        for s in data["sessions"]:
            self.assertTrue(s.get("is_current"))


if __name__ == "__main__":
    unittest.main()

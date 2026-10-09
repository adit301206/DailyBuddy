from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from commitments.models import Commitment
from habits.models import Habit
from reminders.models import Reminder
from tasks.models import Category, Task


class SecurityAndAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create designated Owner (superuser / staff)
        self.owner = User.objects.create_superuser(
            username="owner_user",
            email="owner@example.com",
            password="OwnerStrongPassword123!",
        )
        self.owner_token = Token.objects.create(user=self.owner)

        # Create a Regular (non-owner / non-staff) User
        self.regular_user = User.objects.create_user(
            username="regular_user",
            email="regular@example.com",
            password="RegularPassword123!",
        )
        self.regular_token = Token.objects.create(user=self.regular_user)

        # Seed sample domain entities
        self.category = Category.objects.create(name="Personal", color="#3b82f6")
        self.task = Task.objects.create(title="Sample Task", category=self.category)
        self.habit = Habit.objects.create(name="Exercise", frequency=Habit.Frequency.DAILY)
        self.commitment = Commitment.objects.create(name="Gym Session", frequency=Commitment.Frequency.DAILY)
        self.reminder = Reminder.objects.create(
            title="Meeting",
            reminder_date="2026-10-10",
            reminder_time="10:00:00",
        )

    # 1. Anonymous GET requests rejected
    def test_anonymous_get_requests_rejected(self):
        endpoints = [
            "/api/dashboard/",
            "/api/tasks/",
            "/api/categories/",
            "/api/habits/",
            "/api/commitments/",
            "/api/reminders/",
            "/api/auth/me/",
        ]
        for url in endpoints:
            response = self.client.get(url)
            self.assertEqual(
                response.status_code,
                status.HTTP_401_UNAUTHORIZED,
                f"Expected 401 for anonymous GET {url}, got {response.status_code}",
            )

    # 2. Anonymous mutations (POST, PUT, PATCH, DELETE) rejected
    def test_anonymous_mutations_rejected(self):
        # Create Task
        res_post = self.client.post("/api/tasks/", {"title": "Hacked Task"})
        self.assertEqual(res_post.status_code, status.HTTP_401_UNAUTHORIZED)

        # Update Task
        res_patch = self.client.patch(f"/api/tasks/{self.task.id}/", {"title": "Changed"})
        self.assertEqual(res_patch.status_code, status.HTTP_401_UNAUTHORIZED)

        # Delete Task
        res_delete = self.client.delete(f"/api/tasks/{self.task.id}/")
        self.assertEqual(res_delete.status_code, status.HTTP_401_UNAUTHORIZED)

        # Habit create
        res_habit = self.client.post("/api/habits/", {"name": "Hack Habit", "frequency": "DAILY"})
        self.assertEqual(res_habit.status_code, status.HTTP_401_UNAUTHORIZED)

        # Commitment create
        res_comm = self.client.post("/api/commitments/", {"name": "Hack Comm", "frequency": "DAILY"})
        self.assertEqual(res_comm.status_code, status.HTTP_401_UNAUTHORIZED)

        # Reminder create
        res_rem = self.client.post(
            "/api/reminders/",
            {"title": "Hack Reminder", "reminder_date": "2026-10-10", "reminder_time": "14:00:00"},
        )
        self.assertEqual(res_rem.status_code, status.HTTP_401_UNAUTHORIZED)

    # 3. Missing, malformed, and invalid tokens rejected
    def test_invalid_tokens_rejected(self):
        invalid_headers = [
            "Token invalid_token_12345",
            "Token ",
            "Bearer invalid_bearer_token",
            "RandomString",
        ]
        for auth_header in invalid_headers:
            response = self.client.get("/api/tasks/", HTTP_AUTHORIZATION=auth_header)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 4. Valid owner credentials login
    def test_owner_login_success(self):
        response = self.client.post(
            "/api/auth/login/",
            {"username": "owner_user", "password": "OwnerStrongPassword123!"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["token"], self.owner_token.key)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["username"], "owner_user")
        self.assertTrue(response.data["user"]["is_owner"])

    # 5. Incorrect credentials rejected without leaking user existence
    def test_incorrect_credentials_rejected(self):
        # Wrong password
        res1 = self.client.post(
            "/api/auth/login/",
            {"username": "owner_user", "password": "WrongPassword123!"},
        )
        self.assertEqual(res1.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res1.data.get("detail"), "Invalid username or password.")

        # Nonexistent user
        res2 = self.client.post(
            "/api/auth/login/",
            {"username": "nonexistent_user", "password": "AnyPassword123!"},
        )
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res2.data.get("detail"), "Invalid username or password.")

        # Missing fields
        res3 = self.client.post("/api/auth/login/", {"username": "owner_user"})
        self.assertEqual(res3.status_code, status.HTTP_400_BAD_REQUEST)

    # 6. Valid owner token can access existing APIs
    def test_owner_authenticated_access(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")

        # Dashboard
        res_dash = self.client.get("/api/dashboard/")
        self.assertEqual(res_dash.status_code, status.HTTP_200_OK)

        # Tasks
        res_tasks = self.client.get("/api/tasks/")
        self.assertEqual(res_tasks.status_code, status.HTTP_200_OK)

        # Me endpoint
        res_me = self.client.get("/api/auth/me/")
        self.assertEqual(res_me.status_code, status.HTTP_200_OK)
        self.assertEqual(res_me.data["username"], "owner_user")

        # Create Task
        res_create = self.client.post(
            "/api/tasks/",
            {"title": "Valid Owner Task", "category": self.category.id},
        )
        self.assertEqual(res_create.status_code, status.HTTP_201_CREATED)

    # 7. Logout revokes token and invalidates subsequent requests
    def test_logout_revokes_token(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.owner_token.key}")

        # Call logout
        res_logout = self.client.post("/api/auth/logout/")
        self.assertEqual(res_logout.status_code, status.HTTP_200_OK)

        # Token should be deleted in DB
        self.assertFalse(Token.objects.filter(key=self.owner_token.key).exists())

        # Subsequent request with the same token should fail
        res_after = self.client.get("/api/tasks/")
        self.assertEqual(res_after.status_code, status.HTTP_401_UNAUTHORIZED)

    # 8. Non-owner authenticated user cannot read or mutate records
    def test_non_owner_authenticated_user_rejected(self):
        # Authenticate as non-owner regular user
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.regular_token.key}")

        endpoints = [
            "/api/dashboard/",
            "/api/tasks/",
            "/api/categories/",
            "/api/habits/",
            "/api/commitments/",
            "/api/reminders/",
            "/api/auth/me/",
        ]
        for url in endpoints:
            res = self.client.get(url)
            self.assertEqual(
                res.status_code,
                status.HTTP_403_FORBIDDEN,
                f"Expected 403 Forbidden for non-owner user accessing {url}, got {res.status_code}",
            )

        # Non-owner mutation rejected
        res_post = self.client.post("/api/tasks/", {"title": "Unauthorized User Task"})
        self.assertEqual(res_post.status_code, status.HTTP_403_FORBIDDEN)

        # Non-owner login attempt rejected
        self.client.credentials()  # clear credentials
        res_login = self.client.post(
            "/api/auth/login/",
            {"username": "regular_user", "password": "RegularPassword123!"},
        )
        self.assertEqual(res_login.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            res_login.data.get("detail"),
            "Access is restricted to the designated owner account.",
        )

    # 9. Public registration is unavailable
    def test_public_registration_unavailable(self):
        res = self.client.post(
            "/api/auth/register/",
            {"username": "new_user", "password": "Password123!"},
        )
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    # 10. Django Admin login remains functional
    def test_django_admin_access(self):
        admin_client = self.client_class()
        logged_in = admin_client.login(
            username="owner_user",
            password="OwnerStrongPassword123!",
        )
        self.assertTrue(logged_in)
        res_admin = admin_client.get("/admin/")
        self.assertEqual(res_admin.status_code, status.HTTP_200_OK)

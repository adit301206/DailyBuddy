from django.urls import path

from .views import DashboardView, LoginView, LogoutView, MeView

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
]
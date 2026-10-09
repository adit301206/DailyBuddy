from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .permissions import IsOwner
from .services.dashboard import get_dashboard_data


class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        dashboard_data = get_dashboard_data()
        return Response(dashboard_data)


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {'detail': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)

        if user is None or not user.is_active:
            return Response(
                {'detail': 'Invalid username or password.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Owner validation: must be superuser or staff
        if not (user.is_superuser or user.is_staff):
            return Response(
                {'detail': 'Access is restricted to the designated owner account.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email or '',
                    'is_owner': True,
                },
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        user = request.user
        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email or '',
                'is_owner': True,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        # Revoke the current user's token
        Token.objects.filter(user=request.user).delete()
        return Response(
            {'detail': 'Logged out successfully.'},
            status=status.HTTP_200_OK,
        )
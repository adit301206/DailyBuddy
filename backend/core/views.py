from rest_framework.response import Response
from rest_framework.views import APIView

from .services.dashboard import get_dashboard_data


class DashboardView(APIView):
    def get(self, request):
        dashboard_data = get_dashboard_data()
        return Response(dashboard_data)
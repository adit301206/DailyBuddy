from rest_framework import viewsets

from .models import Commitment, CommitmentLog
from .serializers import CommitmentLogSerializer, CommitmentSerializer


class CommitmentViewSet(viewsets.ModelViewSet):
    queryset = Commitment.objects.all()
    serializer_class = CommitmentSerializer


class CommitmentLogViewSet(viewsets.ModelViewSet):
    queryset = CommitmentLog.objects.all()
    serializer_class = CommitmentLogSerializer
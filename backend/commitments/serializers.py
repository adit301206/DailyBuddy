from rest_framework import serializers

from .models import Commitment, CommitmentLog


class CommitmentSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Commitment
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "frequency",
            "target_time",
            "active",
            "created_at",
        ]
        read_only_fields = [
            "created_at",
        ]


class CommitmentLogSerializer(serializers.ModelSerializer):
    commitment_name = serializers.CharField(
        source="commitment.name",
        read_only=True,
    )

    class Meta:
        model = CommitmentLog
        fields = [
            "id",
            "commitment",
            "commitment_name",
            "date",
            "completed",
            "completed_at",
        ]
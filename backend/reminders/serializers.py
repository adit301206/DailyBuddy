from rest_framework import serializers

from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Reminder
        fields = [
            "id",
            "title",
            "description",
            "category",
            "category_name",
            "reminder_date",
            "reminder_time",
            "repeat_type",
            "active",
            "created_at",
        ]
        read_only_fields = [
            "created_at",
        ]
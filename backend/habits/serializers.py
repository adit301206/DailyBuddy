from rest_framework import serializers

from .models import Habit, HabitLog


class HabitSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Habit
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "frequency",
            "active",
            "created_at",
        ]
        read_only_fields = [
            "created_at",
        ]


class HabitLogSerializer(serializers.ModelSerializer):
    habit_name = serializers.CharField(
        source="habit.name",
        read_only=True,
    )

    class Meta:
        model = HabitLog
        fields = [
            "id",
            "habit",
            "habit_name",
            "date",
            "completed",
            "completed_at",
        ]
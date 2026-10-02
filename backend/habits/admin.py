from django.contrib import admin

from .models import Habit, HabitLog


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "frequency",
        "active",
    )

    list_filter = (
        "frequency",
        "active",
        "category",
    )

    search_fields = ("name",)


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = (
        "habit",
        "date",
        "completed",
        "completed_at",
    )

    list_filter = (
        "completed",
        "date",
    )

    search_fields = ("habit__name",)
from django.contrib import admin

from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "reminder_date",
        "reminder_time",
        "repeat_type",
        "active",
    )

    list_filter = (
        "repeat_type",
        "active",
        "category",
    )

    search_fields = (
        "title",
        "description",
    )
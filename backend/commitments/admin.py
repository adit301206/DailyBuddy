from django.contrib import admin

from .models import Commitment, CommitmentLog


@admin.register(Commitment)
class CommitmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "frequency",
        "target_time",
        "active",
    )

    list_filter = (
        "frequency",
        "active",
        "category",
    )

    search_fields = ("name",)


@admin.register(CommitmentLog)
class CommitmentLogAdmin(admin.ModelAdmin):
    list_display = (
        "commitment",
        "date",
        "completed",
        "completed_at",
    )

    list_filter = (
        "completed",
        "date",
    )

    search_fields = ("commitment__name",)
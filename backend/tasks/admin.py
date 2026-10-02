from django.contrib import admin

from .models import Category, Task


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "icon", "color", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "priority",
        "due_date",
        "due_time",
        "completed",
    )

    list_filter = (
        "completed",
        "priority",
        "category",
    )

    search_fields = (
        "title",
        "description",
    )

    list_editable = ("completed",)
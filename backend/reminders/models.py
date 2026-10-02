from django.db import models

from tasks.models import Category


class Reminder(models.Model):

    class RepeatType(models.TextChoices):
        ONCE = "ONCE", "Once"
        DAILY = "DAILY", "Daily"
        WEEKLY = "WEEKLY", "Weekly"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reminders",
    )

    reminder_date = models.DateField(null=True, blank=True)
    reminder_time = models.TimeField()

    repeat_type = models.CharField(
        max_length=10,
        choices=RepeatType.choices,
        default=RepeatType.ONCE,
    )

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["reminder_date", "reminder_time"]

    def __str__(self):
        return self.title
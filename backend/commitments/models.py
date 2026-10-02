from django.db import models

from tasks.models import Category


class Commitment(models.Model):
    class Frequency(models.TextChoices):
        DAILY = "DAILY", "Daily"
        WEEKLY = "WEEKLY", "Weekly"

    name = models.CharField(max_length=200)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="commitments",
    )

    frequency = models.CharField(
        max_length=10,
        choices=Frequency.choices,
        default=Frequency.DAILY,
    )

    target_time = models.TimeField(null=True, blank=True)

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class CommitmentLog(models.Model):
    commitment = models.ForeignKey(
        Commitment,
        on_delete=models.CASCADE,
        related_name="logs",
    )

    date = models.DateField()
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["commitment", "date"],
                name="unique_commitment_date",
            )
        ]
        ordering = ["-date"]

    def __str__(self):
        return f"{self.commitment.name} - {self.date}"
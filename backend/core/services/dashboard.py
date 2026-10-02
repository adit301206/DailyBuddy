from datetime import date

from commitments.models import Commitment
from habits.models import Habit
from reminders.models import Reminder
from tasks.models import Task

from .streaks import get_commitment_streak, get_habit_streak


def get_dashboard_data():
    """
    Build the data needed for the DailyBuddy dashboard.
    """

    today = date.today()

    # -----------------------------
    # Today's tasks
    # -----------------------------
    today_tasks = Task.objects.filter(
        due_date=today
    ).order_by(
        "completed",
        "due_time",
        "-created_at",
    )

    # -----------------------------
    # Active commitments
    # -----------------------------
    commitments_data = []

    commitments = Commitment.objects.filter(
        active=True
    )

    for commitment in commitments:
        streak = get_commitment_streak(commitment)

        commitments_data.append({
            "id": commitment.id,
            "name": commitment.name,
            "frequency": commitment.frequency,
            "target_time": commitment.target_time,
            "completed_today": streak["completed_today"],
            "current_streak": streak["current_streak"],
            "longest_streak": streak["longest_streak"],
        })

    # -----------------------------
    # Active habits
    # -----------------------------
    habits_data = []

    habits = Habit.objects.filter(
        active=True
    )

    for habit in habits:
        streak = get_habit_streak(habit)

        habits_data.append({
            "id": habit.id,
            "name": habit.name,
            "frequency": habit.frequency,
            "completed_today": streak["completed_today"],
            "current_streak": streak["current_streak"],
            "longest_streak": streak["longest_streak"],
        })

    # -----------------------------
    # Upcoming reminders
    # -----------------------------
    reminders = Reminder.objects.filter(
        active=True
    ).order_by(
        "reminder_date",
        "reminder_time",
    )

    upcoming_reminders = []

    for reminder in reminders:

        # One-time reminder with a past date
        if (
            reminder.repeat_type == Reminder.RepeatType.ONCE
            and reminder.reminder_date is not None
            and reminder.reminder_date < today
        ):
            continue

        upcoming_reminders.append({
            "id": reminder.id,
            "title": reminder.title,
            "description": reminder.description,
            "reminder_date": reminder.reminder_date,
            "reminder_time": reminder.reminder_time,
            "repeat_type": reminder.repeat_type,
        })

    # -----------------------------
    # Progress
    # -----------------------------
    total_tasks = today_tasks.count()

    completed_tasks = today_tasks.filter(
        completed=True
    ).count()

    total_commitments = len(commitments_data)

    completed_commitments = sum(
        1
        for commitment in commitments_data
        if commitment["completed_today"]
    )

    total_habits = len(habits_data)

    completed_habits = sum(
        1
        for habit in habits_data
        if habit["completed_today"]
    )

    total_items = (
        total_tasks
        + total_commitments
        + total_habits
    )

    completed_items = (
        completed_tasks
        + completed_commitments
        + completed_habits
    )

    percentage = (
        round((completed_items / total_items) * 100)
        if total_items > 0
        else 0
    )

    return {
        "date": today,
        "progress": {
            "completed": completed_items,
            "total": total_items,
            "percentage": percentage,
        },
        "commitments": commitments_data,
        "habits": habits_data,
        "tasks": [
            {
                "id": task.id,
                "title": task.title,
                "priority": task.priority,
                "due_date": task.due_date,
                "due_time": task.due_time,
                "completed": task.completed,
            }
            for task in today_tasks
        ],
        "upcoming_reminders": upcoming_reminders,
    }
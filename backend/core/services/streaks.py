from datetime import date, timedelta

from commitments.models import Commitment, CommitmentLog
from habits.models import Habit, HabitLog


def calculate_streak(logs):
    """
    Calculate streak information from daily logs.
    """

    completed_dates = {
        log.date
        for log in logs
        if log.completed
    }

    today = date.today()

    # Current streak
    current_streak = 0
    check_date = today

    while check_date in completed_dates:
        current_streak += 1
        check_date -= timedelta(days=1)

    # Longest streak
    longest_streak = 0
    running_streak = 0
    previous_date = None

    for completed_date in sorted(completed_dates):
        if (
            previous_date is not None
            and completed_date == previous_date + timedelta(days=1)
        ):
            running_streak += 1
        else:
            running_streak = 1

        longest_streak = max(longest_streak, running_streak)
        previous_date = completed_date

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "completed_today": today in completed_dates,
    }


def get_commitment_streak(commitment):
    """
    Calculate streak information for one commitment.
    """

    logs = CommitmentLog.objects.filter(
        commitment=commitment
    )

    return calculate_streak(logs)


def get_habit_streak(habit):
    """
    Calculate streak information for one habit.
    """

    logs = HabitLog.objects.filter(
        habit=habit
    )

    return calculate_streak(logs)
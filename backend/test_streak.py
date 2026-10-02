from datetime import date, timedelta

from core.services.streaks import calculate_streak


class TestLog:
    def __init__(self, log_date, completed=True):
        self.date = log_date
        self.completed = completed


today = date.today()


# Test 1: 5 consecutive completed days
logs = [
    TestLog(today - timedelta(days=4)),
    TestLog(today - timedelta(days=3)),
    TestLog(today - timedelta(days=2)),
    TestLog(today - timedelta(days=1)),
    TestLog(today),
]

print("TEST 1")
print(calculate_streak(logs))


# Test 2: Today is missed
logs = [
    TestLog(today - timedelta(days=3)),
    TestLog(today - timedelta(days=2)),
    TestLog(today - timedelta(days=1)),
]

print("\nTEST 2")
print(calculate_streak(logs))


# Test 3: Gap in the middle
logs = [
    TestLog(today - timedelta(days=4)),
    TestLog(today - timedelta(days=3)),
    # Missing today - 2 days
    TestLog(today - timedelta(days=1)),
    TestLog(today),
]

print("\nTEST 3")
print(calculate_streak(logs))


# Test 4: Old longer streak + current streak
logs = [
    TestLog(today - timedelta(days=10)),
    TestLog(today - timedelta(days=9)),
    TestLog(today - timedelta(days=8)),
    TestLog(today - timedelta(days=7)),
    TestLog(today - timedelta(days=2)),
    TestLog(today - timedelta(days=1)),
    TestLog(today),
]

print("\nTEST 4")
print(calculate_streak(logs))
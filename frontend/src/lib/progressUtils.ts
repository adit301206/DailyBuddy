import type { Category, Task } from '../types/task';
import type { Commitment, CommitmentLog } from '../types/commitment';
import type { Habit, HabitLog } from '../types/habit';
import type { DashboardCommitment, DashboardHabit } from '../types/dashboard';
import type {
  CategoryProgressItem,
  CommitmentProgressStats,
  HabitProgressStats,
  StreakItem,
  TaskProgressStats,
  WeekDayActivity,
} from '../types/progress';
import { getCurrentWeekDays, getLocalTodayStr } from './formatters';

/**
 * Calculates comprehensive task statistics based on real Task records.
 */
export function calculateTaskStats(tasks: Task[], todayStr = getLocalTodayStr()): TaskProgressStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  // Overdue: Not completed AND due_date is strictly before today
  const overdue = tasks.filter(
    (t) => !t.completed && t.due_date && t.due_date < todayStr
  ).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriorityCount = tasks.filter((t) => t.priority === 'HIGH').length;
  const mediumPriorityCount = tasks.filter((t) => t.priority === 'MEDIUM').length;
  const lowPriorityCount = tasks.filter((t) => t.priority === 'LOW').length;

  const dueTodayTasks = tasks.filter((t) => t.due_date === todayStr);
  const dueTodayCount = dueTodayTasks.length;
  const completedTodayCount = dueTodayTasks.filter((t) => t.completed).length;

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate,
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
    dueTodayCount,
    completedTodayCount,
  };
}

/**
 * Calculates commitment statistics using backend-provided streak data and logs.
 */
export function calculateCommitmentStats(
  commitments: Commitment[],
  dashboardCommitments: DashboardCommitment[],
  logs: CommitmentLog[],
  todayStr = getLocalTodayStr()
): CommitmentProgressStats {
  const total = commitments.length;
  const activeCommitments = commitments.filter((c) => c.active);
  const activeCount = activeCommitments.length;
  const inactiveCount = total - activeCount;

  const dailyCount = activeCommitments.filter((c) => c.frequency === 'DAILY').length;
  const weeklyCount = activeCommitments.filter((c) => c.frequency === 'WEEKLY').length;

  // Today's completed count from backend dashboard streak data
  const completedTodayCount = dashboardCommitments.filter((c) => c.completed_today).length;
  const todayCompletionRate =
    activeCount > 0 ? Math.round((completedTodayCount / activeCount) * 100) : 0;

  // Longest streak across all commitments from backend
  const longestStreakEver = dashboardCommitments.reduce(
    (max, c) => Math.max(max, c.longest_streak || 0),
    0
  );

  // Active streaks count (current_streak > 0)
  const activeStreaksCount = dashboardCommitments.filter(
    (c) => (c.current_streak || 0) > 0
  ).length;

  // 30-day consistency score from logs
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`;

  const recentLogs = logs.filter(
    (l) => l.date >= thirtyDaysAgoStr && l.date <= todayStr
  );

  let consistencyRate30Days: number | null = null;
  if (recentLogs.length > 0) {
    const completedCount = recentLogs.filter((l) => l.completed).length;
    consistencyRate30Days = Math.round((completedCount / recentLogs.length) * 100);
  }

  return {
    total,
    activeCount,
    inactiveCount,
    completedTodayCount,
    todayCompletionRate,
    longestStreakEver,
    activeStreaksCount,
    consistencyRate30Days,
    dailyCount,
    weeklyCount,
  };
}

/**
 * Calculates habit statistics using backend-provided streak data and logs.
 */
export function calculateHabitStats(
  habits: Habit[],
  dashboardHabits: DashboardHabit[],
  logs: HabitLog[],
  todayStr = getLocalTodayStr()
): HabitProgressStats {
  const total = habits.length;
  const activeHabits = habits.filter((h) => h.active);
  const activeCount = activeHabits.length;
  const inactiveCount = total - activeCount;

  const dailyCount = activeHabits.filter((h) => h.frequency === 'DAILY').length;
  const weeklyCount = activeHabits.filter((h) => h.frequency === 'WEEKLY').length;

  // Today's completed count from backend dashboard streak data
  const completedTodayCount = dashboardHabits.filter((h) => h.completed_today).length;
  const todayCompletionRate =
    activeCount > 0 ? Math.round((completedTodayCount / activeCount) * 100) : 0;

  // Longest streak across all habits from backend
  const longestStreakEver = dashboardHabits.reduce(
    (max, h) => Math.max(max, h.longest_streak || 0),
    0
  );

  // Active streaks count (current_streak > 0)
  const activeStreaksCount = dashboardHabits.filter(
    (h) => (h.current_streak || 0) > 0
  ).length;

  // 30-day consistency score from logs
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  const thirtyDaysAgoStr = `${thirtyDaysAgo.getFullYear()}-${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgo.getDate()).padStart(2, '0')}`;

  const recentLogs = logs.filter(
    (l) => l.date >= thirtyDaysAgoStr && l.date <= todayStr
  );

  let consistencyRate30Days: number | null = null;
  if (recentLogs.length > 0) {
    const completedCount = recentLogs.filter((l) => l.completed).length;
    consistencyRate30Days = Math.round((completedCount / recentLogs.length) * 100);
  }

  return {
    total,
    activeCount,
    inactiveCount,
    completedTodayCount,
    todayCompletionRate,
    longestStreakEver,
    activeStreaksCount,
    consistencyRate30Days,
    dailyCount,
    weeklyCount,
  };
}

/**
 * Groups real activity by Category from actual data.
 */
export function calculateCategoryActivity(
  categories: Category[],
  tasks: Task[],
  commitments: Commitment[],
  habits: Habit[],
  dashboardCommitments: DashboardCommitment[],
  dashboardHabits: DashboardHabit[]
): CategoryProgressItem[] {
  const dashCommitmentCompletedMap = new Map<number, boolean>(
    dashboardCommitments.map((c) => [c.id, c.completed_today])
  );
  const dashHabitCompletedMap = new Map<number, boolean>(
    dashboardHabits.map((h) => [h.id, h.completed_today])
  );

  const items: CategoryProgressItem[] = [];

  // Group by defined categories
  categories.forEach((category) => {
    const catTasks = tasks.filter(
      (t) => t.category === category.id || t.category_name === category.name
    );
    const catCommitments = commitments.filter(
      (c) => c.category === category.id || c.category_name === category.name
    );
    const catHabits = habits.filter(
      (h) => h.category === category.id || h.category_name === category.name
    );

    const totalItems = catTasks.length + catCommitments.length + catHabits.length;

    if (totalItems > 0) {
      const completedTasks = catTasks.filter((t) => t.completed).length;
      const completedCommitments = catCommitments.filter(
        (c) => dashCommitmentCompletedMap.get(c.id) || false
      ).length;
      const completedHabits = catHabits.filter(
        (h) => dashHabitCompletedMap.get(h.id) || false
      ).length;

      const completedItems = completedTasks + completedCommitments + completedHabits;
      const completionRate = Math.round((completedItems / totalItems) * 100);

      items.push({
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        totalItems,
        completedItems,
        tasksCount: catTasks.length,
        commitmentsCount: catCommitments.length,
        habitsCount: catHabits.length,
        completionRate,
      });
    }
  });

  // Check for items without a category
  const uncategorizedTasks = tasks.filter((t) => !t.category && !t.category_name);
  const uncategorizedCommitments = commitments.filter(
    (c) => !c.category && !c.category_name
  );
  const uncategorizedHabits = habits.filter((h) => !h.category && !h.category_name);

  const uncategorizedTotal =
    uncategorizedTasks.length +
    uncategorizedCommitments.length +
    uncategorizedHabits.length;

  if (uncategorizedTotal > 0) {
    const completedTasks = uncategorizedTasks.filter((t) => t.completed).length;
    const completedCommitments = uncategorizedCommitments.filter(
      (c) => dashCommitmentCompletedMap.get(c.id) || false
    ).length;
    const completedHabits = uncategorizedHabits.filter(
      (h) => dashHabitCompletedMap.get(h.id) || false
    ).length;

    const completedItems = completedTasks + completedCommitments + completedHabits;
    const completionRate = Math.round((completedItems / uncategorizedTotal) * 100);

    items.push({
      id: null,
      name: 'General / Uncategorized',
      icon: '📌',
      totalItems: uncategorizedTotal,
      completedItems,
      tasksCount: uncategorizedTasks.length,
      commitmentsCount: uncategorizedCommitments.length,
      habitsCount: uncategorizedHabits.length,
      completionRate,
    });
  }

  // Sort by totalItems descending
  return items.sort((a, b) => b.totalItems - a.totalItems);
}

/**
 * Calculates real weekly activity matrix for the current week (M T W T F S S).
 * Evaluates daily habits/commitments based on day logs.
 */
export function calculateWeeklyActivityMatrix(
  tasks: Task[],
  commitments: Commitment[],
  habits: Habit[],
  commitmentLogs: CommitmentLog[],
  habitLogs: HabitLog[],
  todayStr = getLocalTodayStr(),
  weekStart: 'monday' | 'sunday' = 'monday'
): WeekDayActivity[] {
  const weekDays = getCurrentWeekDays(todayStr, weekStart);

  const activeDailyCommitments = commitments.filter(
    (c) => c.active && c.frequency === 'DAILY'
  );
  const activeDailyHabits = habits.filter(
    (h) => h.active && h.frequency === 'DAILY'
  );

  const dailyCommitmentIds = new Set(activeDailyCommitments.map((c) => c.id));
  const dailyHabitIds = new Set(activeDailyHabits.map((h) => h.id));

  return weekDays.map((day) => {
    // 1. Task activity for this date
    const dayTasks = tasks.filter((t) => t.due_date === day.dateStr);
    let taskCell: WeekDayActivity['tasks'];

    if (dayTasks.length === 0) {
      taskCell = {
        completedCount: 0,
        totalCount: 0,
        status: 'none',
        details: 'No tasks scheduled',
      };
    } else {
      const completedCount = dayTasks.filter((t) => t.completed).length;
      const totalCount = dayTasks.length;

      let status: WeekDayActivity['tasks']['status'] = 'none';
      if (day.isFuture) {
        status = 'future';
      } else if (completedCount === totalCount) {
        status = 'complete';
      } else if (completedCount > 0) {
        status = 'partial';
      } else {
        status = 'pending';
      }

      taskCell = {
        completedCount,
        totalCount,
        status,
        details: `${completedCount} of ${totalCount} tasks completed`,
      };
    }

    // 2. Daily Habits activity for this date
    let habitCell: WeekDayActivity['habits'];
    if (activeDailyHabits.length === 0) {
      habitCell = {
        completedCount: 0,
        totalCount: 0,
        status: 'none',
        details: 'No active daily habits',
      };
    } else {
      const totalCount = activeDailyHabits.length;
      const completedLogs = habitLogs.filter(
        (l) => l.date === day.dateStr && dailyHabitIds.has(l.habit) && l.completed
      );
      const completedCount = completedLogs.length;

      let status: WeekDayActivity['habits']['status'] = 'none';
      if (day.isFuture) {
        status = 'future';
      } else if (completedCount >= totalCount) {
        status = 'complete';
      } else if (completedCount > 0) {
        status = 'partial';
      } else {
        status = 'pending';
      }

      habitCell = {
        completedCount,
        totalCount,
        status,
        details: `${completedCount} of ${totalCount} habits completed`,
      };
    }

    // 3. Daily Commitments activity for this date
    let commitmentCell: WeekDayActivity['commitments'];
    if (activeDailyCommitments.length === 0) {
      commitmentCell = {
        completedCount: 0,
        totalCount: 0,
        status: 'none',
        details: 'No active daily commitments',
      };
    } else {
      const totalCount = activeDailyCommitments.length;
      const completedLogs = commitmentLogs.filter(
        (l) =>
          l.date === day.dateStr &&
          dailyCommitmentIds.has(l.commitment) &&
          l.completed
      );
      const completedCount = completedLogs.length;

      let status: WeekDayActivity['commitments']['status'] = 'none';
      if (day.isFuture) {
        status = 'future';
      } else if (completedCount >= totalCount) {
        status = 'complete';
      } else if (completedCount > 0) {
        status = 'partial';
      } else {
        status = 'pending';
      }

      commitmentCell = {
        completedCount,
        totalCount,
        status,
        details: `${completedCount} of ${totalCount} commitments completed`,
      };
    }

    return {
      dateStr: day.dateStr,
      dayShort: day.dayShort,
      dayInitial: day.dayInitial,
      dayNumber: day.dayNumber,
      isToday: day.isToday,
      isPast: day.isPast,
      isFuture: day.isFuture,
      tasks: taskCell,
      habits: habitCell,
      commitments: commitmentCell,
    };
  });
}

/**
 * Builds the compact list of streaks from backend streak data.
 */
export function buildStreakOverviewItems(
  commitments: Commitment[],
  habits: Habit[],
  dashboardCommitments: DashboardCommitment[],
  dashboardHabits: DashboardHabit[]
): StreakItem[] {
  const commitmentCategoryMap = new Map<number, string | null | undefined>(
    commitments.map((c) => [c.id, c.category_name])
  );
  const habitCategoryMap = new Map<number, string | null | undefined>(
    habits.map((h) => [h.id, h.category_name])
  );

  const commitmentStreakItems: StreakItem[] = dashboardCommitments.map((c) => ({
    id: `c-${c.id}`,
    originalId: c.id,
    name: c.name,
    type: 'commitment',
    frequency: c.frequency,
    currentStreak: c.current_streak,
    longestStreak: c.longest_streak,
    completedToday: c.completed_today,
    categoryName: commitmentCategoryMap.get(c.id),
  }));

  const habitStreakItems: StreakItem[] = dashboardHabits.map((h) => ({
    id: `h-${h.id}`,
    originalId: h.id,
    name: h.name,
    type: 'habit',
    frequency: h.frequency,
    currentStreak: h.current_streak,
    longestStreak: h.longest_streak,
    completedToday: h.completed_today,
    categoryName: habitCategoryMap.get(h.id),
  }));

  // Combine and sort: active streaks (currentStreak > 0) first, then longestStreak
  return [...commitmentStreakItems, ...habitStreakItems].sort((a, b) => {
    if (b.currentStreak !== a.currentStreak) {
      return b.currentStreak - a.currentStreak;
    }
    return b.longestStreak - a.longestStreak;
  });
}

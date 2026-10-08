import type { Category, Task } from './task';
import type { Commitment, CommitmentLog } from './commitment';
import type { Habit, HabitLog } from './habit';
import type { DashboardCommitment, DashboardHabit, DashboardProgress } from './dashboard';

export interface TaskProgressStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  dueTodayCount: number;
  completedTodayCount: number;
}

export interface CommitmentProgressStats {
  total: number;
  activeCount: number;
  inactiveCount: number;
  completedTodayCount: number;
  todayCompletionRate: number;
  longestStreakEver: number;
  activeStreaksCount: number;
  consistencyRate30Days: number | null; // percentage of completed logs in past 30 days
  dailyCount: number;
  weeklyCount: number;
}

export interface HabitProgressStats {
  total: number;
  activeCount: number;
  inactiveCount: number;
  completedTodayCount: number;
  todayCompletionRate: number;
  longestStreakEver: number;
  activeStreaksCount: number;
  consistencyRate30Days: number | null; // percentage of completed logs in past 30 days
  dailyCount: number;
  weeklyCount: number;
}

export interface CategoryProgressItem {
  id: number | null;
  name: string;
  icon?: string;
  color?: string;
  totalItems: number;
  completedItems: number;
  tasksCount: number;
  commitmentsCount: number;
  habitsCount: number;
  completionRate: number;
}

export type DayActivityStatus = 'complete' | 'partial' | 'pending' | 'none' | 'future';

export interface DayActivityCell {
  completedCount: number;
  totalCount: number;
  status: DayActivityStatus;
  details?: string;
}

export interface WeekDayActivity {
  dateStr: string;
  dayShort: string;
  dayInitial: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  tasks: DayActivityCell;
  habits: DayActivityCell;
  commitments: DayActivityCell;
}

export interface StreakItem {
  id: string;
  originalId: number;
  name: string;
  type: 'commitment' | 'habit';
  frequency: string;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  categoryName?: string | null;
}

export interface ProgressPageData {
  tasks: Task[];
  commitments: Commitment[];
  habits: Habit[];
  categories: Category[];
  commitmentLogs: CommitmentLog[];
  habitLogs: HabitLog[];
  dashboardProgress: DashboardProgress;
  dashboardCommitments: DashboardCommitment[];
  dashboardHabits: DashboardHabit[];
  apiDate: string;
}

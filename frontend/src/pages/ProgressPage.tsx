import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchDashboardData,
  getCategories,
  getCommitmentLogs,
  getCommitments,
  getHabitLogs,
  getHabits,
  getTasks,
} from '../lib/api';
import type { Task, Category } from '../types/task';
import type { Commitment, CommitmentLog } from '../types/commitment';
import type { Habit, HabitLog } from '../types/habit';
import type { DashboardCommitment, DashboardHabit, DashboardProgress } from '../types/dashboard';
import {
  calculateCategoryActivity,
  calculateCommitmentStats,
  calculateHabitStats,
  calculateTaskStats,
  calculateWeeklyActivityMatrix,
  buildStreakOverviewItems,
} from '../lib/progressUtils';
import { getLocalTodayStr } from '../lib/formatters';
import { ProgressHeader } from '../components/progress/ProgressHeader';
import { OverallProgressSection } from '../components/progress/OverallProgressSection';
import { WeeklyActivityMatrix } from '../components/progress/WeeklyActivityMatrix';
import { TaskProgressCard } from '../components/progress/TaskProgressCard';
import { CommitmentProgressCard } from '../components/progress/CommitmentProgressCard';
import { HabitProgressCard } from '../components/progress/HabitProgressCard';
import { CategoryActivitySection } from '../components/progress/CategoryActivitySection';
import { StreakOverviewSection } from '../components/progress/StreakOverviewSection';
import { ProgressSkeleton } from '../components/progress/ProgressSkeleton';
import { ProgressEmptyState } from '../components/progress/ProgressEmptyState';
import { Button } from '../components/ui/Button';
import { SecondaryText, SectionTitle } from '../components/ui/Typography';
import { AlertCircle, RotateCw } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [commitmentLogs, setCommitmentLogs] = useState<CommitmentLog[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [dashboardProgress, setDashboardProgress] = useState<DashboardProgress>({
    completed: 0,
    total: 0,
    percentage: 0,
  });
  const [dashboardCommitments, setDashboardCommitments] = useState<DashboardCommitment[]>([]);
  const [dashboardHabits, setDashboardHabits] = useState<DashboardHabit[]>([]);
  const [apiDate, setApiDate] = useState<string>(getLocalTodayStr());

  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all real workspace data
  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [
        tasksData,
        commitmentsData,
        habitsData,
        categoriesData,
        commLogsData,
        habLogsData,
        dashData,
      ] = await Promise.all([
        getTasks(),
        getCommitments(),
        getHabits(),
        getCategories(),
        getCommitmentLogs(),
        getHabitLogs(),
        fetchDashboardData(),
      ]);

      setTasks(tasksData);
      setCommitments(commitmentsData);
      setHabits(habitsData);
      setCategories(categoriesData);
      setCommitmentLogs(commLogsData);
      setHabitLogs(habLogsData);
      setDashboardProgress(dashData.progress);
      setDashboardCommitments(dashData.commitments || []);
      setDashboardHabits(dashData.habits || []);
      if (dashData.date) {
        setApiDate(dashData.date);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load progress data from the server.'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real metric computations
  const taskStats = useMemo(
    () => calculateTaskStats(tasks, apiDate),
    [tasks, apiDate]
  );

  const commitmentStats = useMemo(
    () => calculateCommitmentStats(commitments, dashboardCommitments, commitmentLogs, apiDate),
    [commitments, dashboardCommitments, commitmentLogs, apiDate]
  );

  const habitStats = useMemo(
    () => calculateHabitStats(habits, dashboardHabits, habitLogs, apiDate),
    [habits, dashboardHabits, habitLogs, apiDate]
  );

  const categoryActivity = useMemo(
    () =>
      calculateCategoryActivity(
        categories,
        tasks,
        commitments,
        habits,
        dashboardCommitments,
        dashboardHabits
      ),
    [categories, tasks, commitments, habits, dashboardCommitments, dashboardHabits]
  );

  const weeklyActivity = useMemo(
    () =>
      calculateWeeklyActivityMatrix(
        tasks,
        commitments,
        habits,
        commitmentLogs,
        habitLogs,
        apiDate
      ),
    [tasks, commitments, habits, commitmentLogs, habitLogs, apiDate]
  );

  const streakItems = useMemo(
    () =>
      buildStreakOverviewItems(
        commitments,
        habits,
        dashboardCommitments,
        dashboardHabits
      ),
    [commitments, habits, dashboardCommitments, dashboardHabits]
  );

  const hasAnyData =
    tasks.length > 0 || commitments.length > 0 || habits.length > 0;

  // 1. Loading Skeleton State
  if (loading && !hasAnyData) {
    return <ProgressSkeleton />;
  }

  // 2. Error State
  if (error && !hasAnyData) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div
          style={{
            backgroundColor: 'var(--color-danger-soft)',
            color: 'var(--color-danger)',
          }}
          className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
        >
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <SectionTitle>Unable to load progress</SectionTitle>
          <SecondaryText className="text-sm">{error}</SecondaryText>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<RotateCw className="w-4 h-4" />}
          onClick={() => loadData()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Page Header */}
      <ProgressHeader
        apiDate={apiDate}
        isRefreshing={isRefreshing}
        onRefresh={() => loadData(true)}
      />

      {/* 2. Empty State if no records exist */}
      {!hasAnyData ? (
        <ProgressEmptyState />
      ) : (
        <>
          {/* 3. Section 1: Overall Progress Summary */}
          <OverallProgressSection
            progress={dashboardProgress}
            activeHabitsCount={habitStats.activeCount}
            activeCommitmentsCount={commitmentStats.activeCount}
            completedTasksTodayCount={taskStats.completedTodayCount}
            totalTasksTodayCount={taskStats.dueTodayCount}
            activeStreaksCount={
              commitmentStats.activeStreaksCount + habitStats.activeStreaksCount
            }
          />

          {/* 4. Section 6: Weekly Activity Consistency Matrix (M T W T F S S) */}
          <WeeklyActivityMatrix
            weekDays={weeklyActivity}
            weeklyCommitmentsCount={commitmentStats.weeklyCount}
            weeklyHabitsCount={habitStats.weeklyCount}
          />

          {/* 5. Sections 2, 3, 4: Detailed Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Task Progress */}
            <TaskProgressCard stats={taskStats} />

            {/* Streaks Overview */}
            <StreakOverviewSection streaks={streakItems} />

            {/* Commitments Progress */}
            <CommitmentProgressCard stats={commitmentStats} />

            {/* Habits Progress */}
            <HabitProgressCard stats={habitStats} />
          </div>

          {/* 6. Section 5: Category Activity Breakdown */}
          <CategoryActivitySection categories={categoryActivity} />
        </>
      )}
    </div>
  );
};

export default ProgressPage;

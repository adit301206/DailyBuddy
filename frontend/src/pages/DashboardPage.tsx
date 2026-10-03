import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchDashboardData,
  logCommitmentToday,
  logHabitToday,
  toggleTaskCompletion,
} from '../lib/api';
import type {
  DashboardCommitment,
  DashboardData,
  DashboardHabit,
  DashboardTask,
} from '../types/dashboard';
import { GreetingHeader } from '../components/dashboard/GreetingHeader';
import { ProgressOverview } from '../components/dashboard/ProgressOverview';
import { CommitmentsCard } from '../components/dashboard/CommitmentsCard';
import { HabitsCard } from '../components/dashboard/HabitsCard';
import { TasksCard } from '../components/dashboard/TasksCard';
import { RemindersCard } from '../components/dashboard/RemindersCard';
import { ActiveStreaksCard } from '../components/dashboard/ActiveStreaksCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SecondaryText, SectionTitle } from '../components/ui/Typography';
import { AlertCircle, RotateCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Recalculate progress helper
  const recalculateProgress = (
    commitments: DashboardCommitment[],
    habits: DashboardHabit[],
    tasks: DashboardTask[]
  ) => {
    const total = commitments.length + habits.length + tasks.length;
    const completed =
      commitments.filter((c) => c.completed_today).length +
      habits.filter((h) => h.completed_today).length +
      tasks.filter((t) => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  // Toggle Commitment
  const handleToggleCommitment = async (commitment: DashboardCommitment) => {
    if (!data) return;

    const nextState = !commitment.completed_today;
    const updatedCommitments = data.commitments.map((c) => {
      if (c.id === commitment.id) {
        return {
          ...c,
          completed_today: nextState,
          current_streak: nextState
            ? c.current_streak + 1
            : Math.max(0, c.current_streak - 1),
        };
      }
      return c;
    });

    const newProgress = recalculateProgress(
      updatedCommitments,
      data.habits,
      data.tasks
    );

    // Optimistic update
    setData({
      ...data,
      commitments: updatedCommitments,
      progress: newProgress,
    });

    try {
      await logCommitmentToday(commitment.id, data.date, nextState);
    } catch (err) {
      console.error('Failed to log commitment:', err);
      // Silently re-sync with server state
      loadData(true);
    }
  };

  // Toggle Habit
  const handleToggleHabit = async (habit: DashboardHabit) => {
    if (!data) return;

    const nextState = !habit.completed_today;
    const updatedHabits = data.habits.map((h) => {
      if (h.id === habit.id) {
        return {
          ...h,
          completed_today: nextState,
          current_streak: nextState
            ? h.current_streak + 1
            : Math.max(0, h.current_streak - 1),
        };
      }
      return h;
    });

    const newProgress = recalculateProgress(
      data.commitments,
      updatedHabits,
      data.tasks
    );

    // Optimistic update
    setData({
      ...data,
      habits: updatedHabits,
      progress: newProgress,
    });

    try {
      await logHabitToday(habit.id, data.date, nextState);
    } catch (err) {
      console.error('Failed to log habit:', err);
      // Silently re-sync with server state
      loadData(true);
    }
  };

  // Toggle Task
  const handleToggleTask = async (task: DashboardTask) => {
    if (!data) return;

    const nextState = !task.completed;
    const updatedTasks = data.tasks.map((t) =>
      t.id === task.id ? { ...t, completed: nextState } : t
    );

    const newProgress = recalculateProgress(
      data.commitments,
      data.habits,
      updatedTasks
    );

    // Optimistic update
    setData({
      ...data,
      tasks: updatedTasks,
      progress: newProgress,
    });

    try {
      await toggleTaskCompletion(task.id, nextState);
    } catch (err) {
      console.error('Failed to update task:', err);
      // Silently re-sync with server state
      loadData(true);
    }
  };

  // 1. Loading State Skeleton
  if (loading && !data) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-[var(--color-surface-secondary)] rounded-lg" />
          <div className="h-4 w-40 bg-[var(--color-surface-secondary)] rounded" />
        </div>

        {/* Progress Skeleton */}
        <Card className="p-6 space-y-4">
          <div className="h-10 w-48 bg-[var(--color-surface-secondary)] rounded" />
          <div className="h-3 w-full bg-[var(--color-surface-secondary)] rounded-full" />
        </Card>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 h-64 bg-[var(--color-surface)]">
              <div className="h-full w-full" />
            </Card>
            <Card className="p-6 h-48 bg-[var(--color-surface)]">
              <div className="h-full w-full" />
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 h-48 bg-[var(--color-surface)]">
              <div className="h-full w-full" />
            </Card>
            <Card className="p-6 h-36 bg-[var(--color-surface)]">
              <div className="h-full w-full" />
            </Card>
            <Card className="p-6 h-44 bg-[var(--color-surface)]">
              <div className="h-full w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error && !data) {
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
          <SectionTitle>Unable to load dashboard</SectionTitle>
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

  if (!data) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header: Greeting + Date */}
      <GreetingHeader
        apiDate={data.date}
        isRefreshing={isRefreshing}
        onRefresh={() => loadData(true)}
      />

      {/* 2. Today's Progress Bar Overview */}
      <ProgressOverview progress={data.progress} />

      {/* 3. Responsive Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Primary): Commitments & Tasks */}
        <div className="lg:col-span-7 space-y-6">
          <CommitmentsCard
            commitments={data.commitments}
            onToggleCommitment={handleToggleCommitment}
          />

          <TasksCard
            tasks={data.tasks}
            onToggleTask={handleToggleTask}
          />
        </div>

        {/* Right Column (Secondary): Habits, Active Streaks & Upcoming Reminders */}
        <div className="lg:col-span-5 space-y-6">
          <HabitsCard
            habits={data.habits}
            onToggleHabit={handleToggleHabit}
          />

          <ActiveStreaksCard
            commitments={data.commitments}
            habits={data.habits}
          />

          <RemindersCard
            reminders={data.upcoming_reminders}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createHabit,
  createHabitLog,
  deleteHabit,
  fetchDashboardData,
  getCategories,
  getHabitLogs,
  getHabits,
  updateHabit,
  updateHabitLog,
} from '../lib/api';
import type { CreateHabitInput, Habit, HabitLog } from '../types/habit';
import type { Category } from '../types/task';
import type { DashboardHabit } from '../types/dashboard';
import { getLocalTodayStr } from '../lib/formatters';
import { HabitFilterTabs, type HabitFilterType } from '../components/habits/HabitFilterTabs';
import { HabitItem } from '../components/habits/HabitItem';
import { HabitFormModal } from '../components/habits/HabitFormModal';
import { HabitDeleteDialog } from '../components/habits/HabitDeleteDialog';
import { HabitDetailDrawer } from '../components/habits/HabitDetailDrawer';
import { HabitEmptyState } from '../components/habits/HabitEmptyState';
import { HabitSkeleton } from '../components/habits/HabitSkeleton';
import { Toast, type ToastInfo } from '../components/tasks/Toast';
import { Button } from '../components/ui/Button';
import { PageTitle, SecondaryText } from '../components/ui/Typography';
import { AlertCircle, Plus, RotateCw } from 'lucide-react';

export const HabitsPage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [dashboardHabits, setDashboardHabits] = useState<DashboardHabit[]>([]);
  const [activeFilter, setActiveFilter] = useState<HabitFilterType>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and Dialog States
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  // Fetch initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [habitsData, categoriesData, logsData, dashboardData] = await Promise.all([
        getHabits(),
        getCategories(),
        getHabitLogs(),
        fetchDashboardData(),
      ]);
      setHabits(habitsData);
      setCategories(categoriesData);
      setLogs(logsData);
      setDashboardHabits(dashboardData.habits || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const todayStr = getLocalTodayStr();

  // Streak & Today Completion map from server data
  const streakMap = useMemo(() => {
    const map = new Map<number, { currentStreak: number; longestStreak: number }>();
    dashboardHabits.forEach((dh) => {
      map.set(dh.id, {
        currentStreak: dh.current_streak,
        longestStreak: dh.longest_streak,
      });
    });
    return map;
  }, [dashboardHabits]);

  // Filtered lists
  const activeHabits = useMemo(() => {
    return habits.filter((h) => h.active);
  }, [habits]);

  const inactiveHabits = useMemo(() => {
    return habits.filter((h) => !h.active);
  }, [habits]);

  const counts = useMemo(() => {
    return {
      active: activeHabits.length,
      inactive: inactiveHabits.length,
    };
  }, [activeHabits.length, inactiveHabits.length]);

  // Today log lookup helper
  const getTodayLog = useCallback(
    (habitId: number) => {
      return logs.find((l) => l.habit === habitId && l.date === todayStr);
    },
    [logs, todayStr]
  );

  // Check if completed today
  const isCompletedToday = useCallback(
    (habitId: number) => {
      const log = getTodayLog(habitId);
      if (log) return log.completed;
      const dashItem = dashboardHabits.find((dh) => dh.id === habitId);
      return dashItem ? dashItem.completed_today : false;
    },
    [getTodayLog, dashboardHabits]
  );

  // Toggle Complete / Uncomplete Today
  const handleToggleComplete = async (habit: Habit) => {
    const currentCompleted = isCompletedToday(habit.id);
    const nextCompleted = !currentCompleted;
    const existingLog = getTodayLog(habit.id);

    // Optimistic UI updates
    if (existingLog) {
      setLogs((prev) =>
        prev.map((l) => (l.id === existingLog.id ? { ...l, completed: nextCompleted } : l))
      );
    } else {
      const optimisticLog: HabitLog = {
        id: -Date.now(),
        habit: habit.id,
        habit_name: habit.name,
        date: todayStr,
        completed: nextCompleted,
      };
      setLogs((prev) => [optimisticLog, ...prev]);
    }

    // Update streak state optimistically
    setDashboardHabits((prev) =>
      prev.map((dh) => {
        if (dh.id === habit.id) {
          const newCurrent = nextCompleted
            ? dh.current_streak + 1
            : Math.max(0, dh.current_streak - 1);
          return {
            ...dh,
            completed_today: nextCompleted,
            current_streak: newCurrent,
            longest_streak: Math.max(dh.longest_streak, newCurrent),
          };
        }
        return dh;
      })
    );

    showToast('success', nextCompleted ? 'Habit completed' : 'Habit reopened');

    // Send backend request
    try {
      if (existingLog && existingLog.id > 0) {
        const updated = await updateHabitLog(existingLog.id, {
          completed: nextCompleted,
          completed_at: nextCompleted ? new Date().toISOString() : null,
        });
        setLogs((prev) => prev.map((l) => (l.id === existingLog.id ? updated : l)));
      } else {
        const created = await createHabitLog({
          habit: habit.id,
          date: todayStr,
          completed: nextCompleted,
          completed_at: nextCompleted ? new Date().toISOString() : null,
        });
        setLogs((prev) =>
          prev.map((l) => (l.habit === habit.id && l.date === todayStr ? created : l))
        );
      }
    } catch (err) {
      // Revert optimistic updates
      showToast('error', "Couldn't update habit");
      loadData();
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingHabit(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormModalOpen(true);
  };

  // Save Habit (Create or Edit)
  const handleSaveHabit = async (data: CreateHabitInput) => {
    if (editingHabit) {
      // Edit existing
      const updated = await updateHabit(editingHabit.id, data);
      setHabits((prev) => prev.map((h) => (h.id === editingHabit.id ? updated : h)));
      if (selectedHabit && selectedHabit.id === editingHabit.id) {
        setSelectedHabit(updated);
      }
      showToast('success', 'Habit updated');
    } else {
      // Create new
      const created = await createHabit(data);
      setHabits((prev) => [...prev, created]);
      showToast('success', 'Habit created');
    }
    // Refresh dashboard streaks in background
    try {
      const dash = await fetchDashboardData();
      setDashboardHabits(dash.habits || []);
    } catch {
      // ignore
    }
  };

  // Deactivate / Reactivate
  const handleToggleActive = async (habit: Habit) => {
    const nextActive = !habit.active;
    try {
      const updated = await updateHabit(habit.id, { active: nextActive });
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)));
      if (selectedHabit && selectedHabit.id === habit.id) {
        setSelectedHabit(updated);
      }
      showToast('success', nextActive ? 'Habit reactivated' : 'Habit deactivated');
      // Refresh dashboard info
      const dash = await fetchDashboardData();
      setDashboardHabits(dash.habits || []);
    } catch (err) {
      showToast('error', "Couldn't update habit");
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDelete = (habit: Habit) => {
    setDeletingHabit(habit);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingHabit) return;
    setIsDeleting(true);
    try {
      await deleteHabit(deletingHabit.id);
      setHabits((prev) => prev.filter((h) => h.id !== deletingHabit.id));
      setLogs((prev) => prev.filter((l) => l.habit !== deletingHabit.id));
      if (selectedHabit && selectedHabit.id === deletingHabit.id) {
        setSelectedHabit(null);
      }
      showToast('success', 'Habit deleted');
      setDeletingHabit(null);
    } catch (err) {
      showToast('error', "Couldn't delete habit");
    } finally {
      setIsDeleting(false);
    }
  };

  const displayedHabits = activeFilter === 'active' ? activeHabits : inactiveHabits;

  // Selected habit streak values
  const selectedStreak = selectedHabit
    ? streakMap.get(selectedHabit.id) || { currentStreak: 0, longestStreak: 0 }
    : { currentStreak: 0, longestStreak: 0 };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <PageTitle>Habits</PageTitle>
          <SecondaryText className="text-sm">
            Build consistency with recurring daily and weekly habits.
          </SecondaryText>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          New Habit
        </Button>
      </div>

      {/* 2. Filter Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <HabitFilterTabs
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* 3. Main Habits Content Area */}
      <div id={`habit-panel-${activeFilter}`} role="tabpanel" aria-labelledby={`habit-tab-${activeFilter}`}>
        {loading && <HabitSkeleton />}

        {!loading && error && (
          <div className="py-12 px-6 text-center space-y-4 rounded-2xl border border-[var(--color-danger)]/20 bg-[var(--color-danger-soft)]/30">
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
              <h3 className="text-base font-semibold text-[var(--color-text)]">
                Couldn't load your habits.
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Check that the DailyBuddy backend is running.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<RotateCw className="w-4 h-4" />}
              onClick={loadData}
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {displayedHabits.length === 0 ? (
              <HabitEmptyState
                filter={activeFilter}
                onCreateHabit={handleOpenCreate}
              />
            ) : (
              <div className="space-y-2.5">
                {displayedHabits.map((habit) => {
                  const streak = streakMap.get(habit.id) || { currentStreak: 0, longestStreak: 0 };
                  const completedToday = isCompletedToday(habit.id);

                  return (
                    <HabitItem
                      key={habit.id}
                      habit={habit}
                      isCompletedToday={completedToday}
                      currentStreak={streak.currentStreak}
                      longestStreak={streak.longestStreak}
                      onSelect={(h) => setSelectedHabit(h)}
                      onToggleComplete={habit.active ? handleToggleComplete : undefined}
                      onEdit={handleOpenEdit}
                      onToggleActive={handleToggleActive}
                      onDelete={handleOpenDelete}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Habit Detail Drawer */}
      <HabitDetailDrawer
        isOpen={!!selectedHabit}
        habit={selectedHabit}
        logs={logs}
        currentStreak={selectedStreak.currentStreak}
        longestStreak={selectedStreak.longestStreak}
        isCompletedToday={selectedHabit ? isCompletedToday(selectedHabit.id) : false}
        todayStr={todayStr}
        onClose={() => setSelectedHabit(null)}
        onToggleComplete={handleToggleComplete}
        onEdit={(h) => {
          handleOpenEdit(h);
        }}
        onToggleActive={handleToggleActive}
        onDelete={(h) => {
          handleOpenDelete(h);
        }}
      />

      {/* Create / Edit Modal */}
      <HabitFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleSaveHabit}
        initialHabit={editingHabit}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <HabitDeleteDialog
        isOpen={!!deletingHabit}
        habit={deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Feedback Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default HabitsPage;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createCommitment,
  createCommitmentLog,
  deleteCommitment,
  fetchDashboardData,
  getCategories,
  getCommitmentLogs,
  getCommitments,
  updateCommitment,
  updateCommitmentLog,
} from '../lib/api';
import type { Commitment, CommitmentLog, CreateCommitmentInput } from '../types/commitment';
import type { Category } from '../types/task';
import type { DashboardCommitment } from '../types/dashboard';
import { getLocalTodayStr } from '../lib/formatters';
import { CommitmentFilterTabs, type CommitmentFilterType } from '../components/commitments/CommitmentFilterTabs';
import { CommitmentItem } from '../components/commitments/CommitmentItem';
import { CommitmentFormModal } from '../components/commitments/CommitmentFormModal';
import { CommitmentDeleteDialog } from '../components/commitments/CommitmentDeleteDialog';
import { CommitmentEmptyState } from '../components/commitments/CommitmentEmptyState';
import { CommitmentSkeleton } from '../components/commitments/CommitmentSkeleton';
import { Toast, type ToastInfo } from '../components/tasks/Toast';
import { Button } from '../components/ui/Button';
import { PageTitle, SecondaryText } from '../components/ui/Typography';
import { AlertCircle, Plus, RotateCw } from 'lucide-react';

export const CommitmentsPage: React.FC = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [logs, setLogs] = useState<CommitmentLog[]>([]);
  const [dashboardCommitments, setDashboardCommitments] = useState<DashboardCommitment[]>([]);
  const [activeFilter, setActiveFilter] = useState<CommitmentFilterType>('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and Dialog States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null);
  const [deletingCommitment, setDeletingCommitment] = useState<Commitment | null>(null);
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
      const [commitmentsData, categoriesData, logsData, dashboardData] = await Promise.all([
        getCommitments(),
        getCategories(),
        getCommitmentLogs(),
        fetchDashboardData(),
      ]);
      setCommitments(commitmentsData);
      setCategories(categoriesData);
      setLogs(logsData);
      setDashboardCommitments(dashboardData.commitments || []);
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

  // Streak & Today Completion map
  const streakMap = useMemo(() => {
    const map = new Map<number, { currentStreak: number; longestStreak: number }>();
    dashboardCommitments.forEach((dc) => {
      map.set(dc.id, {
        currentStreak: dc.current_streak,
        longestStreak: dc.longest_streak,
      });
    });
    return map;
  }, [dashboardCommitments]);

  // Filtered lists
  const activeCommitments = useMemo(() => {
    return commitments.filter((c) => c.active);
  }, [commitments]);

  const inactiveCommitments = useMemo(() => {
    return commitments.filter((c) => !c.active);
  }, [commitments]);

  const counts = useMemo(() => {
    return {
      active: activeCommitments.length,
      inactive: inactiveCommitments.length,
    };
  }, [activeCommitments.length, inactiveCommitments.length]);

  // Today log lookup helper
  const getTodayLog = useCallback(
    (commitmentId: number) => {
      return logs.find((l) => l.commitment === commitmentId && l.date === todayStr);
    },
    [logs, todayStr]
  );

  // Check if completed today
  const isCompletedToday = useCallback(
    (commitmentId: number) => {
      const log = getTodayLog(commitmentId);
      if (log) return log.completed;
      const dashItem = dashboardCommitments.find((dc) => dc.id === commitmentId);
      return dashItem ? dashItem.completed_today : false;
    },
    [getTodayLog, dashboardCommitments]
  );

  // Toggle Complete / Uncomplete Today
  const handleToggleComplete = async (commitment: Commitment) => {
    const currentCompleted = isCompletedToday(commitment.id);
    const nextCompleted = !currentCompleted;
    const existingLog = getTodayLog(commitment.id);

    // Optimistic UI updates
    if (existingLog) {
      setLogs((prev) =>
        prev.map((l) => (l.id === existingLog.id ? { ...l, completed: nextCompleted } : l))
      );
    } else {
      const optimisticLog: CommitmentLog = {
        id: -Date.now(),
        commitment: commitment.id,
        commitment_name: commitment.name,
        date: todayStr,
        completed: nextCompleted,
      };
      setLogs((prev) => [optimisticLog, ...prev]);
    }

    // Update streak state optimistically
    setDashboardCommitments((prev) =>
      prev.map((dc) => {
        if (dc.id === commitment.id) {
          const newCurrent = nextCompleted
            ? dc.current_streak + 1
            : Math.max(0, dc.current_streak - 1);
          return {
            ...dc,
            completed_today: nextCompleted,
            current_streak: newCurrent,
            longest_streak: Math.max(dc.longest_streak, newCurrent),
          };
        }
        return dc;
      })
    );

    showToast('success', nextCompleted ? 'Commitment completed' : 'Commitment reopened');

    // Send backend request
    try {
      if (existingLog && existingLog.id > 0) {
        const updated = await updateCommitmentLog(existingLog.id, {
          completed: nextCompleted,
          completed_at: nextCompleted ? new Date().toISOString() : null,
        });
        setLogs((prev) => prev.map((l) => (l.id === existingLog.id ? updated : l)));
      } else {
        const created = await createCommitmentLog({
          commitment: commitment.id,
          date: todayStr,
          completed: nextCompleted,
          completed_at: nextCompleted ? new Date().toISOString() : null,
        });
        setLogs((prev) =>
          prev.map((l) => (l.commitment === commitment.id && l.date === todayStr ? created : l))
        );
      }
    } catch (err) {
      // Revert optimistic updates
      showToast('error', "Couldn't update commitment");
      loadData();
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCommitment(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (commitment: Commitment) => {
    setEditingCommitment(commitment);
    setIsFormModalOpen(true);
  };

  // Save Commitment (Create or Edit)
  const handleSaveCommitment = async (data: CreateCommitmentInput) => {
    if (editingCommitment) {
      // Edit existing
      const updated = await updateCommitment(editingCommitment.id, data);
      setCommitments((prev) => prev.map((c) => (c.id === editingCommitment.id ? updated : c)));
      showToast('success', 'Commitment updated');
    } else {
      // Create new
      const created = await createCommitment(data);
      setCommitments((prev) => [...prev, created]);
      showToast('success', 'Commitment created');
    }
    // Refresh dashboard streaks in background
    try {
      const dash = await fetchDashboardData();
      setDashboardCommitments(dash.commitments || []);
    } catch {
      // ignore
    }
  };

  // Deactivate / Reactivate
  const handleToggleActive = async (commitment: Commitment) => {
    const nextActive = !commitment.active;
    try {
      const updated = await updateCommitment(commitment.id, { active: nextActive });
      setCommitments((prev) => prev.map((c) => (c.id === commitment.id ? updated : c)));
      showToast('success', nextActive ? 'Commitment reactivated' : 'Commitment deactivated');
      // Refresh dashboard info
      const dash = await fetchDashboardData();
      setDashboardCommitments(dash.commitments || []);
    } catch (err) {
      showToast('error', "Couldn't update commitment");
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDelete = (commitment: Commitment) => {
    setDeletingCommitment(commitment);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCommitment) return;
    setIsDeleting(true);
    try {
      await deleteCommitment(deletingCommitment.id);
      setCommitments((prev) => prev.filter((c) => c.id !== deletingCommitment.id));
      setLogs((prev) => prev.filter((l) => l.commitment !== deletingCommitment.id));
      showToast('success', 'Commitment deleted');
      setDeletingCommitment(null);
    } catch (err) {
      showToast('error', "Couldn't delete commitment");
    } finally {
      setIsDeleting(false);
    }
  };

  const displayedCommitments = activeFilter === 'active' ? activeCommitments : inactiveCommitments;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <PageTitle>Commitments</PageTitle>
          <SecondaryText className="text-sm">
            Keep the promises you make to yourself.
          </SecondaryText>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          New Commitment
        </Button>
      </div>

      {/* 2. Filter Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <CommitmentFilterTabs
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* 3. Main Commitments Content Area */}
      <div id={`commitment-panel-${activeFilter}`} role="tabpanel" aria-labelledby={`commitment-tab-${activeFilter}`}>
        {loading && <CommitmentSkeleton />}

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
                Couldn't load your commitments.
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
            {displayedCommitments.length === 0 ? (
              <CommitmentEmptyState
                filter={activeFilter}
                onCreateCommitment={handleOpenCreate}
              />
            ) : (
              <div className="space-y-2.5">
                {displayedCommitments.map((commitment) => {
                  const streak = streakMap.get(commitment.id) || { currentStreak: 0, longestStreak: 0 };
                  const completedToday = isCompletedToday(commitment.id);

                  return (
                    <CommitmentItem
                      key={commitment.id}
                      commitment={commitment}
                      isCompletedToday={completedToday}
                      currentStreak={streak.currentStreak}
                      longestStreak={streak.longestStreak}
                      onToggleComplete={commitment.active ? handleToggleComplete : undefined}
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

      {/* Create / Edit Modal */}
      <CommitmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCommitment(null);
        }}
        onSubmit={handleSaveCommitment}
        initialCommitment={editingCommitment}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <CommitmentDeleteDialog
        isOpen={!!deletingCommitment}
        commitment={deletingCommitment}
        onClose={() => setDeletingCommitment(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Feedback Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default CommitmentsPage;

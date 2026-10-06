import React, { useEffect, useMemo, useState } from 'react';
import type { Commitment, CommitmentLog } from '../../types/commitment';
import {
  formatHumanDate,
  formatLogTimestamp,
  formatTimeString,
  getCategoryEmoji,
  getCurrentWeekDays,
  getItemIcon,
  getRecentWeeklyIntervals,
} from '../../lib/formatters';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  Pencil,
  Power,
  RotateCcw,
  Sparkles,
  Tag,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface CommitmentDetailDrawerProps {
  isOpen: boolean;
  commitment: Commitment | null;
  logs: CommitmentLog[];
  currentStreak: number;
  longestStreak: number;
  isCompletedToday: boolean;
  todayStr: string;
  onClose: () => void;
  onToggleComplete: (commitment: Commitment) => Promise<void>;
  onEdit: (commitment: Commitment) => void;
  onToggleActive: (commitment: Commitment) => Promise<void>;
  onDelete: (commitment: Commitment) => void;
}

export const CommitmentDetailDrawer: React.FC<CommitmentDetailDrawerProps> = ({
  isOpen,
  commitment,
  logs,
  currentStreak,
  longestStreak,
  isCompletedToday,
  todayStr,
  onClose,
  onToggleComplete,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset toggle error on drawer open / commitment change
  useEffect(() => {
    setToggleError(null);
  }, [commitment?.id, isOpen]);

  // Filter logs for this commitment and sort newest first
  const commitmentLogs = useMemo(() => {
    if (!commitment) return [];
    return logs
      .filter((l) => l.commitment === commitment.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [logs, commitment]);

  // Map of completed dates for easy O(1) lookup
  const completedDateMap = useMemo(() => {
    const map = new Map<string, CommitmentLog>();
    commitmentLogs.forEach((log) => {
      map.set(log.date, log);
    });
    return map;
  }, [commitmentLogs]);

  // Current week days (Monday - Sunday) for daily commitments
  const weekDays = useMemo(() => {
    return getCurrentWeekDays(todayStr);
  }, [todayStr]);

  // Weekly intervals for weekly commitments
  const weeklyIntervals = useMemo(() => {
    return getRecentWeeklyIntervals(4);
  }, []);

  if (!isOpen || !commitment) return null;

  const isActive = commitment.active;
  const isDaily = commitment.frequency === 'DAILY';
  const categoryName = commitment.category_name || 'Personal';
  const categoryEmoji = getCategoryEmoji(categoryName);
  const FallbackIcon = getItemIcon(commitment.name);
  const targetTimeFormatted = formatTimeString(commitment.target_time);

  // Creation date formatting
  let createdDateFormatted = '';
  if (commitment.created_at) {
    try {
      const createdObj = new Date(commitment.created_at);
      createdDateFormatted = createdObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      createdDateFormatted = '';
    }
  }

  // Today log details if present
  const todayLog = completedDateMap.get(todayStr);

  const handleToggle = async () => {
    if (!isActive) return;
    setIsToggling(true);
    setToggleError(null);
    try {
      await onToggleComplete(commitment);
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : 'Failed to update commitment completion.');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="commitment-detail-title"
    >
      {/* Drawer Panel */}
      <div className="w-full max-w-lg h-full bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* 1. Header with Close and Action Controls */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Commitment Details
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => onEdit(commitment)}
              aria-label={`Edit ${commitment.name}`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            {/* Deactivate / Reactivate */}
            <button
              type="button"
              onClick={() => onToggleActive(commitment)}
              aria-label={isActive ? `Deactivate ${commitment.name}` : `Reactivate ${commitment.name}`}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer',
                isActive
                  ? 'text-[var(--color-warning)] hover:bg-[var(--color-warning-soft)]'
                  : 'text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]'
              )}
            >
              {isActive ? (
                <>
                  <Power className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Deactivate</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reactivate</span>
                </>
              )}
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(commitment)}
              aria-label={`Delete ${commitment.name}`}
              className="p-1.5 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

            {/* Close X */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close commitment details"
              className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Title and Identity Banner */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl select-none shadow-2xs',
                  isCompletedToday && isActive
                    ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                    : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                )}
                aria-hidden="true"
              >
                {categoryEmoji ? (
                  <span className="text-2xl leading-none">{categoryEmoji}</span>
                ) : (
                  <FallbackIcon className="w-6 h-6" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    id="commitment-detail-title"
                    className="text-lg sm:text-xl font-bold text-[var(--color-text)] tracking-tight break-words"
                  >
                    {commitment.name}
                  </h2>

                  {!isActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] uppercase">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] flex-wrap">
                  <span className="inline-flex items-center gap-1 font-medium text-[var(--color-text)]">
                    <Tag className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                    <span>{categoryName}</span>
                  </span>
                  <span>•</span>
                  <span>{isDaily ? 'Daily commitment' : 'Weekly commitment'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Error Alert */}
          {toggleError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-danger-soft)] text-[var(--color-danger)] text-xs border border-[var(--color-danger)]/20">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="flex-1">{toggleError}</span>
            </div>
          )}

          {/* 3. Primary Today Completion Control Card */}
          <div
            className={cn(
              'p-4 sm:p-5 rounded-2xl border transition-all duration-150',
              !isActive
                ? 'bg-[var(--color-surface-secondary)]/50 border-[var(--color-border)]'
                : isCompletedToday
                ? 'bg-[var(--color-success-soft)]/40 border-[var(--color-success)]/30'
                : 'bg-[var(--color-surface-secondary)]/30 border-[var(--color-border)]'
            )}
          >
            {isActive ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-semibold text-[var(--color-text)]">
                      {isCompletedToday ? 'Completed for today' : 'Today’s check-in'}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {isCompletedToday
                        ? todayLog?.completed_at
                          ? `Recorded at ${formatLogTimestamp(todayLog.completed_at)}`
                          : 'Marked as completed for today.'
                        : isDaily
                        ? 'Keep your streak alive by checking in today.'
                        : 'Log your weekly progress for this cycle.'}
                    </p>
                  </div>

                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                      isCompletedToday
                        ? 'bg-[var(--color-success)] text-white shadow-2xs'
                        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
                    )}
                  >
                    <Check className={cn('w-4 h-4 stroke-[3]', isCompletedToday ? 'block' : 'hidden')} />
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Button
                    variant={isCompletedToday ? 'secondary' : 'primary'}
                    size="md"
                    className="w-full justify-center"
                    leftIcon={
                      isCompletedToday ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )
                    }
                    isLoading={isToggling}
                    onClick={handleToggle}
                  >
                    {isCompletedToday ? 'Reopen Today' : 'Complete Today'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium text-[var(--color-text)]">
                    Commitment is inactive
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Reactivate to resume daily tracking and streaks.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => onToggleActive(commitment)}
                >
                  Reactivate
                </Button>
              </div>
            )}
          </div>

          {/* 4. Streak Summary Metrics (Backend calculated values) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Streak Summary
              </h3>
              <span className="text-[11px] text-[var(--color-text-secondary)] inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
                <span>Backend verified</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Current Streak */}
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] font-medium">
                  <Flame className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                  <span>Current</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-[var(--color-text)] tracking-tight">
                  {currentStreak} <span className="text-xs font-normal text-[var(--color-text-secondary)]">{currentStreak === 1 ? 'day' : 'days'}</span>
                </p>
              </div>

              {/* Longest Streak */}
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] font-medium">
                  <Trophy className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                  <span>Best</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-[var(--color-text)] tracking-tight">
                  {longestStreak} <span className="text-xs font-normal text-[var(--color-text-secondary)]">{longestStreak === 1 ? 'day' : 'days'}</span>
                </p>
              </div>

              {/* Today's Status */}
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-1">
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
                  <span>Today</span>
                </div>
                <p className={cn('text-xs sm:text-sm font-semibold pt-0.5 truncate', isCompletedToday ? 'text-[var(--color-success)]' : 'text-[var(--color-text-secondary)]')}>
                  {isCompletedToday ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* 5. Commitment Specifications & Attributes */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Specifications
            </h3>

            <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] divide-y divide-[var(--color-border)] text-xs">
              {/* Category */}
              <div className="flex items-center justify-between py-2 first:pt-0">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category</span>
                </span>
                <span className="font-semibold text-[var(--color-text)]">
                  {categoryEmoji ? `${categoryEmoji} ${categoryName}` : categoryName}
                </span>
              </div>

              {/* Frequency */}
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Frequency</span>
                </span>
                <span className="font-semibold text-[var(--color-text)]">
                  {isDaily ? 'Daily (Every day)' : 'Weekly (1x per week)'}
                </span>
              </div>

              {/* Target Time */}
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Target Time</span>
                </span>
                <span className="font-semibold text-[var(--color-text)]">
                  {targetTimeFormatted || 'Any time / Flexible'}
                </span>
              </div>

              {/* Created Date */}
              {createdDateFormatted && (
                <div className="flex items-center justify-between py-2 last:pb-0">
                  <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created</span>
                  </span>
                  <span className="font-normal text-[var(--color-text-secondary)]">
                    {createdDateFormatted}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 6. History & Visual Representation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                {isDaily ? 'Weekly & Recent History' : 'Weekly History Breakdown'}
              </h3>
              <span className="text-[11px] text-[var(--color-text-secondary)]">
                {commitmentLogs.length} {commitmentLogs.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {/* Daily Commitment History Visual */}
            {isDaily ? (
              <div className="space-y-3.5">
                {/* 7-Day Week Strip */}
                <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--color-text)]">This Week</span>
                    <span className="text-[var(--color-text-secondary)] text-[11px]">
                      Mon – Sun
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {weekDays.map((day) => {
                      const log = completedDateMap.get(day.dateStr);
                      const isCompleted = log ? log.completed : (day.isToday ? isCompletedToday : false);

                      return (
                        <div
                          key={day.dateStr}
                          className={cn(
                            'flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg border text-center transition-all',
                            day.isToday
                              ? 'border-[var(--color-primary)]/60 bg-[var(--color-primary-soft)]/20'
                              : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30'
                          )}
                          title={`${day.dayShort}, ${day.dateStr}: ${
                            isCompleted ? 'Completed' : day.isFuture ? 'Upcoming' : 'Missed / Incomplete'
                          }`}
                        >
                          <span className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase">
                            {day.dayShort}
                          </span>
                          <span className="text-xs font-bold text-[var(--color-text)] my-0.5">
                            {day.dayNumber}
                          </span>

                          {/* Status Icon */}
                          <div className="mt-1">
                            {isCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center shadow-2xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : day.isFuture ? (
                              <div className="w-5 h-5 rounded-full border border-dashed border-[var(--color-border)] text-transparent flex items-center justify-center" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-secondary)]/40" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity Log List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-[var(--color-text-secondary)]">
                    Recent Logs
                  </h4>

                  {commitmentLogs.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-[var(--color-border)] space-y-1.5">
                      <p className="text-xs font-semibold text-[var(--color-text)]">
                        No activity recorded yet
                      </p>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">
                        Complete today’s commitment to record your first log.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                      {commitmentLogs.slice(0, 10).map((log) => {
                        const humanDate = formatHumanDate(log.date);
                        const isDone = log.completed;
                        const timeStr = formatLogTimestamp(log.completed_at);

                        return (
                          <div
                            key={log.id || log.date}
                            className="flex items-center justify-between p-3 text-xs hover:bg-[var(--color-surface-secondary)]/20 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={cn(
                                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs',
                                  isDone
                                    ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
                                )}
                              >
                                {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-[var(--color-text)] truncate">
                                  {humanDate}
                                </p>
                                {timeStr && (
                                  <p className="text-[11px] text-[var(--color-text-secondary)]">
                                    Logged at {timeStr}
                                  </p>
                                )}
                              </div>
                            </div>

                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-md text-[11px] font-medium shrink-0',
                                isDone
                                  ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
                              )}
                            >
                              {isDone ? 'Completed' : 'Reopened'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Weekly Commitment History Visual */
              <div className="space-y-3.5">
                {/* Semantics Explainer */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--color-surface-secondary)]/50 border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
                  <Info className="w-4 h-4 shrink-0 text-[var(--color-primary)] mt-0.5" />
                  <span>
                    Weekly commitments are scheduled on a weekly cycle. Logging any completion during a week marks that week as completed.
                  </span>
                </div>

                {/* Weekly Interval Blocks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-[var(--color-text-secondary)]">
                    Weekly Completion History
                  </h4>

                  <div className="space-y-2">
                    {weeklyIntervals.map((interval) => {
                      // Check if any log in this interval is completed
                      const weekLogs = commitmentLogs.filter(
                        (l) => l.date >= interval.startStr && l.date <= interval.endStr
                      );
                      const isWeekCompleted = weekLogs.some((l) => l.completed) || (interval.isCurrentWeek && isCompletedToday);

                      return (
                        <div
                          key={interval.startStr}
                          className={cn(
                            'p-3.5 rounded-xl border flex items-center justify-between transition-colors',
                            isWeekCompleted
                              ? 'bg-[var(--color-success-soft)]/30 border-[var(--color-success)]/30'
                              : 'bg-[var(--color-surface)] border-[var(--color-border)]'
                          )}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-[var(--color-text)]">
                                {interval.label}
                              </p>
                              {interval.isCurrentWeek && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                                  Active Cycle
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--color-text-secondary)]">
                              {interval.formattedRange}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-md text-[11px] font-semibold',
                                isWeekCompleted
                                  ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
                              )}
                            >
                              {isWeekCompleted ? 'Completed' : 'Incomplete'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual Logs for Weekly Commitment */}
                {commitmentLogs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-[var(--color-text-secondary)]">
                      Log Entries
                    </h4>
                    <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                      {commitmentLogs.slice(0, 5).map((log) => (
                        <div
                          key={log.id || log.date}
                          className="flex items-center justify-between p-3 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-[var(--color-text)]">
                              {formatHumanDate(log.date)}
                            </p>
                            {log.completed_at && (
                              <p className="text-[11px] text-[var(--color-text-secondary)]">
                                Logged at {formatLogTimestamp(log.completed_at)}
                              </p>
                            )}
                          </div>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-md text-[11px] font-medium',
                              log.completed
                                ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
                            )}
                          >
                            {log.completed ? 'Completed' : 'Incomplete'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 7. Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30 flex items-center justify-between text-xs text-[var(--color-text-secondary)] shrink-0">
          <span>DailyBuddy Commitment</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};

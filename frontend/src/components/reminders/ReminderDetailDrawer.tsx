import React, { useEffect } from 'react';
import type { Reminder } from '../../types/reminder';
import {
  formatHumanDate,
  formatReminderSchedule,
  formatTimeString,
  getCategoryEmoji,
  getItemIcon,
} from '../../lib/formatters';
import {
  Bell,
  Calendar,
  Clock,
  Pencil,
  Power,
  Repeat,
  RotateCcw,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface ReminderDetailDrawerProps {
  isOpen: boolean;
  reminder: Reminder | null;
  onClose: () => void;
  onEdit: (reminder: Reminder) => void;
  onToggleActive: (reminder: Reminder) => Promise<void>;
  onDelete: (reminder: Reminder) => void;
}

export const ReminderDetailDrawer: React.FC<ReminderDetailDrawerProps> = ({
  isOpen,
  reminder,
  onClose,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
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

  if (!isOpen || !reminder) return null;

  const isActive = reminder.active;
  const categoryName = reminder.category_name || 'Personal';
  const categoryEmoji = getCategoryEmoji(categoryName);
  const FallbackIcon = getItemIcon(reminder.title);

  const scheduleText = formatReminderSchedule(
    reminder.reminder_date,
    reminder.reminder_time,
    reminder.repeat_type
  );

  const formattedTime = formatTimeString(reminder.reminder_time);
  const formattedDate = reminder.reminder_date ? formatHumanDate(reminder.reminder_date) : null;

  const repeatTypeDescription =
    reminder.repeat_type === 'DAILY'
      ? 'Repeats every day at the designated time.'
      : reminder.repeat_type === 'WEEKLY'
      ? 'Repeats once every week at the designated time.'
      : 'One-time alert for this specific scheduled time.';

  // Created Date formatting
  let createdDateFormatted = '';
  if (reminder.created_at) {
    try {
      const createdObj = new Date(reminder.created_at);
      createdDateFormatted = createdObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      createdDateFormatted = '';
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-detail-title"
    >
      {/* Drawer Panel */}
      <div className="w-full max-w-lg h-full bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* 1. Header with Close and Action Controls */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Reminder Details
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Edit Button */}
            <button
              type="button"
              onClick={() => onEdit(reminder)}
              aria-label={`Edit ${reminder.title}`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            {/* Deactivate / Reactivate */}
            <button
              type="button"
              onClick={() => onToggleActive(reminder)}
              aria-label={isActive ? `Deactivate ${reminder.title}` : `Reactivate ${reminder.title}`}
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
                  <span className="hidden sm:inline">Activate</span>
                </>
              )}
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => onDelete(reminder)}
              aria-label={`Delete ${reminder.title}`}
              className="p-1.5 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />

            {/* Close X */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close reminder details"
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
                  isActive
                    ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
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
                    id="reminder-detail-title"
                    className="text-lg sm:text-xl font-bold text-[var(--color-text)] tracking-tight break-words"
                  >
                    {reminder.title}
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
                  <span className="inline-flex items-center gap-1">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>
                      {reminder.repeat_type === 'DAILY'
                        ? 'Daily'
                        : reminder.repeat_type === 'WEEKLY'
                        ? 'Weekly'
                        : 'One-time'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Primary Timing Highlight Card */}
          <div
            className={cn(
              'p-4 sm:p-5 rounded-2xl border space-y-3 transition-all duration-150',
              isActive
                ? 'bg-[var(--color-primary-soft)]/20 border-[var(--color-primary)]/30'
                : 'bg-[var(--color-surface-secondary)]/40 border-[var(--color-border)]'
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Scheduled Time
                </span>
                <p className="text-base sm:text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>{scheduleText}</span>
                </p>
              </div>

              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
                )}
              >
                <Bell className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)]">
              {repeatTypeDescription}
            </p>
          </div>

          {/* Description Section if present */}
          {reminder.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Notes & Description
              </h3>
              <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs sm:text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
                {reminder.description}
              </div>
            </div>
          )}

          {/* 4. Specifications Card */}
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

              {/* Time */}
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time</span>
                </span>
                <span className="font-semibold text-[var(--color-text)]">
                  {formattedTime}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Date</span>
                </span>
                <span className="font-semibold text-[var(--color-text)]">
                  {formattedDate || (reminder.repeat_type === 'DAILY' ? 'Every Day' : 'None')}
                </span>
              </div>

              {/* Repeat Frequency */}
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Repeat Type</span>
                </span>
                <span className="font-semibold text-[var(--color-text)]">
                  {reminder.repeat_type === 'DAILY'
                    ? 'Daily'
                    : reminder.repeat_type === 'WEEKLY'
                    ? 'Weekly'
                    : 'Once (Single Alert)'}
                </span>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <Power className="w-3.5 h-3.5" />
                  <span>Status</span>
                </span>
                <span
                  className={cn(
                    'font-semibold',
                    isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                  )}
                >
                  {isActive ? 'Active' : 'Inactive'}
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
        </div>

        {/* 3. Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30 flex items-center justify-between text-xs text-[var(--color-text-secondary)] shrink-0">
          <span>DailyBuddy Reminder</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

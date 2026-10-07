import React, { useEffect, useRef, useState } from 'react';
import type { CreateReminderInput, Reminder, ReminderRepeatType } from '../../types/reminder';
import type { Category } from '../../types/task';
import { Button } from '../ui/Button';
import { getCategoryEmoji, getLocalTodayStr } from '../../lib/formatters';
import { AlertCircle, Bell, Calendar, Clock, Repeat, Tag, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReminderInput) => Promise<void>;
  initialReminder?: Reminder | null;
  categories: Category[];
}

export const ReminderFormModal: React.FC<ReminderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialReminder,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [repeatType, setRepeatType] = useState<ReminderRepeatType>('ONCE');
  const [reminderDate, setReminderDate] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('09:00');
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialReminder) {
        setTitle(initialReminder.title || '');
        setDescription(initialReminder.description || '');
        setCategoryId(initialReminder.category);
        setRepeatType(initialReminder.repeat_type || 'ONCE');
        setReminderDate(initialReminder.reminder_date || '');
        // Reminder time might be HH:MM:SS from API, truncate to HH:MM for input
        setReminderTime(
          initialReminder.reminder_time ? initialReminder.reminder_time.substring(0, 5) : '09:00'
        );
        setActive(initialReminder.active !== undefined ? initialReminder.active : true);
      } else {
        setTitle('');
        setDescription('');
        setCategoryId(null);
        setRepeatType('ONCE');
        setReminderDate(getLocalTodayStr());
        // Default time to next reasonable hour
        const now = new Date();
        const nextHour = (now.getHours() + 1) % 24;
        const formattedHour = String(nextHour).padStart(2, '0');
        setReminderTime(`${formattedHour}:00`);
        setActive(true);
      }
      setError(null);
      setSubmitting(false);

      const focusTimer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen, initialReminder]);

  // Handle escape key
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Reminder title is required.');
      return;
    }

    if (!reminderTime) {
      setError('Reminder time is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
        category: categoryId || null,
        repeat_type: repeatType,
        reminder_date: repeatType === 'DAILY' ? null : (reminderDate || null),
        reminder_time: reminderTime.length === 5 ? `${reminderTime}:00` : reminderTime,
        active,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save reminder.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetQuickDate = (type: 'today' | 'tomorrow' | 'clear') => {
    if (type === 'clear') {
      setReminderDate('');
      return;
    }
    const now = new Date();
    if (type === 'tomorrow') {
      now.setDate(now.getDate() + 1);
    }
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setReminderDate(`${year}-${month}-${day}`);
  };

  const handleSetPresetTime = (time: string) => {
    setReminderTime(time);
  };

  const isEditing = !!initialReminder;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-dialog-title"
    >
      <div className="w-full sm:max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h2 id="reminder-dialog-title" className="text-base sm:text-lg font-semibold text-[var(--color-text)]">
              {isEditing ? 'Edit Reminder' : 'New Reminder'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">
            {/* Inline Error Notice */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--color-danger-soft)] text-[var(--color-danger)] text-xs border border-[var(--color-danger)]/20">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="reminder-title"
                className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
              >
                Reminder Title <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                ref={titleInputRef}
                id="reminder-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g., Take medicine, Call mom, Review PR"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/60 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="reminder-description"
                className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
              >
                Notes <span className="font-normal text-[10px] text-[var(--color-text-secondary)]/70">(Optional)</span>
              </label>
              <textarea
                id="reminder-description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, instructions, or links..."
                className="w-full px-3.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/60 focus:border-[var(--color-primary)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Repeat Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reminder-category"
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category</span>
                </label>
                <select
                  id="reminder-category"
                  value={categoryId ?? ''}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => {
                    const emoji = getCategoryEmoji(cat.name, cat.icon);
                    return (
                      <option key={cat.id} value={cat.id}>
                        {emoji ? `${emoji} ${cat.name}` : cat.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Repeat Type Selector */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Repeat Type</span>
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50">
                  {(['ONCE', 'DAILY', 'WEEKLY'] as ReminderRepeatType[]).map((r) => {
                    const isSelected = repeatType === r;
                    const label = r === 'ONCE' ? 'Once' : r === 'DAILY' ? 'Daily' : 'Weekly';
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRepeatType(r)}
                        className={cn(
                          'py-1 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer text-center select-none',
                          isSelected
                            ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-2xs font-bold'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Input (Relevant for ONCE & WEEKLY) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="reminder-date"
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{repeatType === 'DAILY' ? 'Start Date (Optional)' : 'Date'}</span>
                    </label>
                  </div>

                  {repeatType === 'DAILY' ? (
                    <div className="px-3 py-2 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30 text-xs text-[var(--color-text-secondary)]">
                      Applies every day at set time
                    </div>
                  ) : (
                    <>
                      <input
                        id="reminder-date"
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                      />
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleSetQuickDate('today')}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetQuickDate('tomorrow')}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                        >
                          Tomorrow
                        </button>
                        {reminderDate && (
                          <button
                            type="button"
                            onClick={() => handleSetQuickDate('clear')}
                            className="px-2 py-0.5 rounded text-[11px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors cursor-pointer ml-auto"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Time Input (Required) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reminder-time"
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Time <span className="text-[var(--color-danger)]">*</span></span>
                  </label>
                  <input
                    id="reminder-time"
                    type="time"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {[
                      { label: '9 AM', value: '09:00' },
                      { label: '12 PM', value: '12:00' },
                      { label: '6 PM', value: '18:00' },
                      { label: '9 PM', value: '21:00' },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => handleSetPresetTime(preset.value)}
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer',
                          reminderTime === preset.value
                            ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-semibold'
                            : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Toggle Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
              <div className="space-y-0.5">
                <label htmlFor="reminder-active-toggle" className="text-xs font-semibold text-[var(--color-text)] cursor-pointer">
                  Reminder is Active
                </label>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  Active reminders will show in your upcoming command center.
                </p>
              </div>

              <input
                id="reminder-active-toggle"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/20">
            <Button variant="secondary" size="md" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={submitting}>
              {isEditing ? 'Save Changes' : 'Create Reminder'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import type { CreateHabitInput, Habit, HabitFrequency } from '../../types/habit';
import type { Category } from '../../types/task';
import { Button } from '../ui/Button';
import { getCategoryEmoji } from '../../lib/formatters';
import { AlertCircle, Repeat, Tag, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHabitInput) => Promise<void>;
  initialHabit?: Habit | null;
  categories: Category[];
}

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialHabit,
  categories,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<HabitFrequency>('DAILY');
  const [active, setActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync initial values on open / change & auto-focus name input
  useEffect(() => {
    if (isOpen) {
      if (initialHabit) {
        setName(initialHabit.name || '');
        setCategoryId(initialHabit.category);
        setFrequency(initialHabit.frequency || 'DAILY');
        setActive(initialHabit.active ?? true);
      } else {
        setName('');
        setCategoryId(null);
        setFrequency('DAILY');
        setActive(true);
      }
      setError(null);
      setSubmitting(false);

      const focusTimer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen, initialHabit]);

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
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Habit name is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: trimmedName,
        category: categoryId || null,
        frequency,
        active,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save habit.');
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!initialHabit;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-dialog-title"
    >
      <div className="w-full sm:max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 id="habit-dialog-title" className="text-base sm:text-lg font-semibold text-[var(--color-text)]">
            {isEditing ? 'Edit Habit' : 'New Habit'}
          </h2>
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

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="habit-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Habit Name <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="habit-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g., Drink 2L Water, Morning Run, Read 15 mins"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/60 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
              />
            </div>

            {/* Category and Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="habit-category" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category</span>
                </label>
                <select
                  id="habit-category"
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

              {/* Frequency */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Frequency</span>
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50">
                  {(['DAILY', 'WEEKLY'] as HabitFrequency[]).map((f) => {
                    const isSelected = frequency === f;
                    const label = f === 'DAILY' ? 'Daily' : 'Weekly';
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFrequency(f)}
                        className={cn(
                          'py-1.5 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer text-center select-none',
                          isSelected
                            ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs font-semibold'
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
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={submitting}
            >
              {isEditing ? 'Save Changes' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

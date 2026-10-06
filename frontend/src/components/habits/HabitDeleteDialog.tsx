import React, { useEffect } from 'react';
import type { Habit } from '../../types/habit';
import { Button } from '../ui/Button';
import { AlertTriangle, X } from 'lucide-react';

interface HabitDeleteDialogProps {
  isOpen: boolean;
  habit: Habit | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const HabitDeleteDialog: React.FC<HabitDeleteDialogProps> = ({
  isOpen,
  habit,
  onClose,
  onConfirm,
  isDeleting,
}) => {
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

  if (!isOpen || !habit) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="habit-delete-title"
      aria-describedby="habit-delete-desc"
    >
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div
              style={{
                backgroundColor: 'var(--color-danger-soft)',
                color: 'var(--color-danger)',
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            >
              <AlertTriangle className="w-5 h-5" />
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              aria-label="Close dialog"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <h3 id="habit-delete-title" className="text-base font-semibold text-[var(--color-text)]">
              Delete Habit
            </h3>
            <p id="habit-delete-desc" className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Are you sure you want to delete <strong className="text-[var(--color-text)] font-semibold">"{habit.name}"</strong>? All associated completion logs and streaks will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Delete Habit
          </Button>
        </div>
      </div>
    </div>
  );
};

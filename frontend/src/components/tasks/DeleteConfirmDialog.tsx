import React, { useEffect } from 'react';
import type { Task } from '../../types/task';
import { Button } from '../ui/Button';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
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

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: 'var(--color-danger-soft)',
                  color: 'var(--color-danger)',
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 id="delete-dialog-title" className="text-lg font-semibold text-[var(--color-text)]">
                Delete task?
              </h2>
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

          <p id="delete-dialog-description" className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-[var(--color-text)]">"{task.title}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
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
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

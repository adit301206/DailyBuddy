import React from 'react';
import { Button } from '../ui/Button';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { AlertTriangle, X } from 'lucide-react';

interface ResetPreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetPreferencesDialog: React.FC<ResetPreferencesDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-dialog-title"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl border border-[var(--color-border)] transition-all bg-[var(--color-surface)]"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--color-warning-soft)',
                color: 'var(--color-warning)',
              }}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <SectionTitle id="reset-dialog-title" className="text-base font-semibold">
                Reset Preferences
              </SectionTitle>
              <SecondaryText className="text-xs">
                Local UI and display settings
              </SecondaryText>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm text-[var(--color-text-secondary)] space-y-2 py-1">
          <p>
            Are you sure you want to reset your local preferences to their defaults?
          </p>
          <p className="text-xs bg-[var(--color-surface-secondary)] p-2.5 rounded-lg border border-[var(--color-border)]">
            <strong className="text-[var(--color-text)]">Note:</strong> Your tasks, habits, commitments, and streak logs in the database are <span className="text-[var(--color-success)] font-medium">completely safe and untouched</span>. Only display name, week start, and dashboard card visibility will be reset.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPreferencesDialog;

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ToastInfo {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastInfo | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
      <div
        className={cn(
          'flex items-center gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md',
          isSuccess
            ? 'bg-[var(--color-surface)] border-[var(--color-success)]/30 text-[var(--color-text)]'
            : 'bg-[var(--color-surface)] border-[var(--color-danger)]/30 text-[var(--color-text)]'
        )}
      >
        <div
          style={{
            backgroundColor: isSuccess ? 'var(--color-success-soft)' : 'var(--color-danger-soft)',
            color: isSuccess ? 'var(--color-success)' : 'var(--color-danger)',
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        >
          {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        </div>

        <p className="text-xs font-medium flex-1 break-words">{toast.message}</p>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss toast"
          className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

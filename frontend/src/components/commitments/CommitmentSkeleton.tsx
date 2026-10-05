import React from 'react';

export const CommitmentSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-secondary)] shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-[var(--color-surface-secondary)] rounded w-2/5 max-w-xs" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-20 bg-[var(--color-surface-secondary)] rounded" />
                <div className="h-3 w-24 bg-[var(--color-surface-secondary)] rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-7 w-28 bg-[var(--color-surface-secondary)] rounded-lg hidden sm:block" />
            <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)]" />
          </div>
        </div>
      ))}
    </div>
  );
};

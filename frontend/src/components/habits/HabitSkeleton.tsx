import React from 'react';

export const HabitSkeleton: React.FC = () => {
  return (
    <div className="space-y-3" role="status" aria-label="Loading habits">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 animate-pulse"
        >
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-secondary)]" />
            <div className="space-y-2 flex-1 max-w-xs">
              <div className="h-4 w-3/4 bg-[var(--color-surface-secondary)] rounded" />
              <div className="h-3 w-1/2 bg-[var(--color-surface-secondary)] rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-7 bg-[var(--color-surface-secondary)] rounded-lg" />
            <div className="w-8 h-8 bg-[var(--color-surface-secondary)] rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

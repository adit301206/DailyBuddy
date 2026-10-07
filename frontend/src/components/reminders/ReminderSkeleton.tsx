import React from 'react';

export const ReminderSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse" aria-label="Loading reminders" aria-busy="true">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 gap-3.5"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Icon skeleton */}
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-secondary)] shrink-0" />

            {/* Content lines */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-4 bg-[var(--color-surface-secondary)] rounded-md w-1/3" />
              <div className="h-3 bg-[var(--color-surface-secondary)] rounded-md w-1/2" />
            </div>
          </div>

          {/* Right actions skeleton */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-16 h-7 rounded-lg bg-[var(--color-surface-secondary)]" />
            <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)]" />
          </div>
        </div>
      ))}
    </div>
  );
};

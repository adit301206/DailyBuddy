import React from 'react';
import { cn } from '../../lib/utils';

export type TaskFilterType = 'today' | 'upcoming' | 'completed';

interface TaskFilterTabsProps {
  activeFilter: TaskFilterType;
  onSelectFilter: (filter: TaskFilterType) => void;
  counts: {
    today: number;
    upcoming: number;
    completed: number;
  };
}

export const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const tabs: { id: TaskFilterType; label: string; count: number }[] = [
    { id: 'today', label: 'Today', count: counts.today },
    { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { id: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <nav
      className="flex items-center gap-1.5 p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 w-fit"
      role="tablist"
      aria-label="Task filters"
    >
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`task-panel-${tab.id}`}
            id={`task-tab-${tab.id}`}
            onClick={() => onSelectFilter(tab.id)}
            style={
              isActive
                ? {
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-primary)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  }
                : {
                    color: 'var(--color-text-secondary)',
                  }
            }
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer select-none',
              !isActive && 'hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50'
            )}
          >
            <span>{tab.label}</span>
            <span
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-primary-soft)',
                      color: 'var(--color-primary)',
                    }
                  : {
                      backgroundColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }
              }
              className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full min-w-[18px] text-center"
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

import React from 'react';
import { cn } from '../../lib/utils';

export type ReminderFilterType = 'all' | 'today' | 'upcoming' | 'repeating' | 'inactive';

interface ReminderFilterTabsProps {
  activeFilter: ReminderFilterType;
  onSelectFilter: (filter: ReminderFilterType) => void;
  counts: {
    all: number;
    today: number;
    upcoming: number;
    repeating: number;
    inactive: number;
  };
}

export const ReminderFilterTabs: React.FC<ReminderFilterTabsProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const tabs: { id: ReminderFilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'today', label: 'Today', count: counts.today },
    { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { id: 'repeating', label: 'Repeating', count: counts.repeating },
    { id: 'inactive', label: 'Inactive', count: counts.inactive },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter reminders"
      className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)]/60 border border-[var(--color-border)] select-none overflow-x-auto max-w-full"
    >
      {tabs.map((tab) => {
        const isSelected = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`reminder-tab-${tab.id}`}
            aria-selected={isSelected}
            aria-controls={`reminder-panel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelectFilter(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              isSelected
                ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs font-bold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50'
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'px-1.5 py-0.2 rounded-full text-[10px] transition-colors',
                isSelected
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

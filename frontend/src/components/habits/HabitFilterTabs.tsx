import React from 'react';
import { cn } from '../../lib/utils';

export type HabitFilterType = 'active' | 'inactive';

interface HabitFilterTabsProps {
  activeFilter: HabitFilterType;
  onSelectFilter: (filter: HabitFilterType) => void;
  counts: {
    active: number;
    inactive: number;
  };
}

export const HabitFilterTabs: React.FC<HabitFilterTabsProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const tabs: { id: HabitFilterType; label: string; count: number }[] = [
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'inactive', label: 'Inactive', count: counts.inactive },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter habits"
      className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)]/60 border border-[var(--color-border)] select-none"
    >
      {tabs.map((tab) => {
        const isSelected = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`habit-tab-${tab.id}`}
            aria-selected={isSelected}
            aria-controls={`habit-panel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelectFilter(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
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

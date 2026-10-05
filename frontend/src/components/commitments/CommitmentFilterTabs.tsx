import React from 'react';
import { cn } from '../../lib/utils';

export type CommitmentFilterType = 'active' | 'inactive';

interface CommitmentFilterTabsProps {
  activeFilter: CommitmentFilterType;
  onSelectFilter: (filter: CommitmentFilterType) => void;
  counts: {
    active: number;
    inactive: number;
  };
}

export const CommitmentFilterTabs: React.FC<CommitmentFilterTabsProps> = ({
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const tabs: { id: CommitmentFilterType; label: string; count: number }[] = [
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'inactive', label: 'Inactive', count: counts.inactive },
  ];

  return (
    <div
      role="tablist"
      aria-label="Commitment filters"
      className="inline-flex items-center p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] gap-1"
    >
      {tabs.map((tab) => {
        const isSelected = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            id={`commitment-tab-${tab.id}`}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`commitment-panel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelectFilter(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              isSelected
                ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-2xs font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]/50'
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-semibold transition-colors',
                isSelected
                  ? 'bg-[var(--color-surface-secondary)] text-[var(--color-text)]'
                  : 'bg-[var(--color-border)]/50 text-[var(--color-text-secondary)]'
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

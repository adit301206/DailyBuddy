import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { getCategoryEmoji } from '../../lib/formatters';
import type { CategoryProgressItem } from '../../types/progress';
import { Layers } from 'lucide-react';

interface CategoryActivitySectionProps {
  categories: CategoryProgressItem[];
}

export const CategoryActivitySection: React.FC<CategoryActivitySectionProps> = ({
  categories,
}) => {
  if (categories.length === 0) {
    return (
      <Card className="p-5 sm:p-6 space-y-3">
        <SectionTitle className="text-base font-semibold flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Category Focus</span>
        </SectionTitle>
        <div className="py-6 text-center space-y-1">
          <p className="text-xs font-medium text-[var(--color-text)]">
            No category activity yet.
          </p>
          <SecondaryText className="text-[11px]">
            Assign categories to tasks, habits, and commitments to see your focus distribution.
          </SecondaryText>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <SectionTitle className="text-base font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Category Focus</span>
          </SectionTitle>
          <SecondaryText className="text-xs">
            Activity and completion rates grouped by your active areas.
          </SecondaryText>
        </div>

        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>

      {/* Horizontal Bar List */}
      <div className="space-y-3.5 pt-1">
        {categories.map((cat) => {
          const emoji = getCategoryEmoji(cat.name, cat.icon);

          return (
            <div
              key={cat.id ?? `uncat-${cat.name}`}
              className="p-3 rounded-xl bg-[var(--color-surface-secondary)]/60 border border-[var(--color-border)]/50 space-y-2 transition-all hover:bg-[var(--color-surface-secondary)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0" aria-hidden="true">
                    {emoji || '📁'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      {cat.tasksCount > 0 && `${cat.tasksCount} tasks `}
                      {cat.habitsCount > 0 && `· ${cat.habitsCount} habits `}
                      {cat.commitmentsCount > 0 && `· ${cat.commitmentsCount} commitments`}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs font-bold text-[var(--color-primary)]">
                    {cat.completionRate}%
                  </span>
                  <span className="block text-[10px] text-[var(--color-text-secondary)]">
                    {cat.completedItems}/{cat.totalItems} done
                  </span>
                </div>
              </div>

              <ProgressBar
                value={cat.completionRate}
                size="sm"
                ariaLabel={`${cat.name} completion rate: ${cat.completionRate}%`}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CategoryActivitySection;

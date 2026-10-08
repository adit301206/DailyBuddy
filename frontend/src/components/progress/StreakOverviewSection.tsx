import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { getItemIcon } from '../../lib/formatters';
import type { StreakItem } from '../../types/progress';
import { Award, Flame } from 'lucide-react';

interface StreakOverviewSectionProps {
  streaks: StreakItem[];
}

export const StreakOverviewSection: React.FC<StreakOverviewSectionProps> = ({ streaks }) => {
  const activeStreaks = streaks.filter((s) => s.currentStreak > 0);
  const otherStreaks = streaks.filter((s) => s.currentStreak === 0 && s.longestStreak > 0);

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <SectionTitle className="text-base font-semibold flex items-center gap-2">
            <Flame className="w-4 h-4 text-[var(--color-warning)] fill-current" />
            <span>Active Momentum & Streaks</span>
          </SectionTitle>
          <SecondaryText className="text-xs">
            Calculated directly from your daily streak records.
          </SecondaryText>
        </div>

        <span className="text-xs font-semibold text-[var(--color-warning)]">
          {activeStreaks.length} {activeStreaks.length === 1 ? 'active streak' : 'active streaks'}
        </span>
      </div>

      {activeStreaks.length === 0 && otherStreaks.length === 0 ? (
        <div className="py-6 text-center space-y-1">
          <p className="text-xs font-medium text-[var(--color-text)]">
            Ready to ignite your first streak.
          </p>
          <SecondaryText className="text-[11px]">
            Complete your habits or commitments today to start building consistency momentum.
          </SecondaryText>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Active Streaks */}
          {activeStreaks.map((item) => {
            const Icon = getItemIcon(item.name);
            const isCommitment = item.type === 'commitment';
            const unitLabel = item.frequency === 'WEEKLY' ? 'weeks' : item.currentStreak === 1 ? 'day' : 'days';

            return (
              <div
                key={item.id}
                className="py-2.5 px-3 rounded-xl bg-[var(--color-surface-secondary)]/70 border border-[var(--color-border)]/50 flex items-center justify-between transition-colors hover:bg-[var(--color-surface-secondary)]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: 'var(--color-primary-soft)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      {isCommitment ? 'Commitment' : 'Habit'}
                      {item.categoryName && ` · ${item.categoryName}`}
                      {item.longestStreak > item.currentStreak && (
                        <span> · Best: {item.longestStreak}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[var(--color-warning)] shrink-0 ml-3">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>
                    {item.currentStreak} {unitLabel}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Past/building streaks without shame language */}
          {otherStreaks.slice(0, 3).map((item) => {
            const Icon = getItemIcon(item.name);
            const isCommitment = item.type === 'commitment';

            return (
              <div
                key={item.id}
                className="py-2 px-3 rounded-lg border border-[var(--color-border)]/40 flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-[var(--color-text-secondary)] shrink-0" />
                  <p className="text-xs font-medium text-[var(--color-text)] truncate">
                    {item.name}
                  </p>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">
                    ({isCommitment ? 'Commitment' : 'Habit'})
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)] shrink-0">
                  <Award className="w-3 h-3 text-[var(--color-warning)]" />
                  <span>Best: {item.longestStreak} days</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default StreakOverviewSection;

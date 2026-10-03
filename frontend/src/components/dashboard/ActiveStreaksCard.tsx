import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { getItemIcon } from '../../lib/formatters';
import type { DashboardCommitment, DashboardHabit } from '../../types/dashboard';
import { Flame } from 'lucide-react';

interface ActiveStreaksCardProps {
  commitments: DashboardCommitment[];
  habits: DashboardHabit[];
}

export const ActiveStreaksCard: React.FC<ActiveStreaksCardProps> = ({
  commitments,
  habits,
}) => {
  // Collect all items with current_streak > 0
  const activeStreakItems: Array<{
    id: string;
    name: string;
    streak: number;
    type: 'commitment' | 'habit';
  }> = [
    ...commitments
      .filter((c) => c.current_streak > 0)
      .map((c) => ({
        id: `c-${c.id}`,
        name: c.name,
        streak: c.current_streak,
        type: 'commitment' as const,
      })),
    ...habits
      .filter((h) => h.current_streak > 0)
      .map((h) => ({
        id: `h-${h.id}`,
        name: h.name,
        streak: h.current_streak,
        type: 'habit' as const,
      })),
  ].sort((a, b) => b.streak - a.streak);

  return (
    <Card className="p-5 sm:p-6 space-y-3">
      <SectionTitle className="text-base font-semibold flex items-center gap-2">
        <span>🔥</span>
        <span>Active Streaks</span>
      </SectionTitle>

      {activeStreakItems.length === 0 ? (
        <div className="py-4 text-center space-y-1">
          <p className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
            Your next streak starts today.
          </p>
          <SecondaryText className="text-[11px]">
            Complete your habits and commitments to build consistency.
          </SecondaryText>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {activeStreakItems.map((item) => {
            const Icon = getItemIcon(item.name);
            const isCommitment = item.type === 'commitment';

            return (
              <div
                key={item.id}
                className="py-2.5 px-2 -mx-2 rounded-lg flex items-center justify-between transition-colors duration-150 hover:bg-[var(--color-surface-secondary)]"
              >
                {/* Left: Icon, Name and Distinct Type Label */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: 'var(--color-primary-soft)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                      {item.name}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                      <span className="font-medium">
                        {isCommitment ? 'Commitment' : 'Habit'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Streak count */}
                <div
                  style={{ color: 'var(--color-warning)' }}
                  className="flex items-center gap-1 text-xs font-semibold shrink-0 ml-2"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {item.streak} {item.streak === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default ActiveStreaksCard;

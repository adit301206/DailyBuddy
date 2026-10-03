import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText, Metadata } from '../ui/Typography';
import { getItemIcon } from '../../lib/formatters';
import type { DashboardHabit } from '../../types/dashboard';
import { Check, Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HabitsCardProps {
  habits: DashboardHabit[];
  onToggleHabit?: (habit: DashboardHabit) => void;
}

export const HabitsCard: React.FC<HabitsCardProps> = ({
  habits,
  onToggleHabit,
}) => {
  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <span>↻</span>
            <span>Habits</span>
          </SectionTitle>
        </div>
        <Metadata className="text-xs">
          {habits.filter((h) => h.completed_today).length} of {habits.length}
        </Metadata>
      </div>

      {habits.length === 0 ? (
        <div className="py-6 text-center">
          <SecondaryText className="text-sm">No active habits.</SecondaryText>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {habits.map((habit) => {
            const Icon = getItemIcon(habit.name);
            const isCompleted = habit.completed_today;

            return (
              <div
                key={habit.id}
                onClick={() => onToggleHabit?.(habit)}
                className={cn(
                  'group flex items-center justify-between py-2.5 px-2.5 -mx-2.5 rounded-lg transition-colors duration-150 cursor-pointer select-none',
                  isCompleted
                    ? 'hover:bg-[var(--color-surface-secondary)] opacity-80 hover:opacity-100'
                    : 'hover:bg-[var(--color-surface-secondary)]'
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleHabit?.(habit);
                  }
                }}
                aria-label={`Toggle habit ${habit.name} (${isCompleted ? 'Completed' : 'Not completed'})`}
              >
                {/* Left: Icon, Name and Streak */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: isCompleted
                        ? 'var(--color-success-soft)'
                        : 'var(--color-surface-secondary)',
                      color: isCompleted
                        ? 'var(--color-success)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-sm tracking-tight truncate transition-colors',
                        isCompleted
                          ? 'line-through text-[var(--color-text-secondary)] font-normal'
                          : 'text-[var(--color-text)] font-medium'
                      )}
                    >
                      {habit.name}
                    </p>

                    {habit.current_streak > 0 ? (
                      <span
                        style={{ color: 'var(--color-warning)' }}
                        className="text-[11px] font-medium flex items-center gap-0.5 mt-0.5"
                      >
                        <Flame className="w-2.5 h-2.5 fill-current" />
                        <span>{habit.current_streak} {habit.current_streak === 1 ? 'day' : 'days'}</span>
                      </span>
                    ) : (
                      <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                        No current streak
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Circular Status Toggle */}
                <div className="ml-2 shrink-0">
                  <div
                    className={cn(
                      'w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all duration-150',
                      isCompleted
                        ? 'bg-[var(--color-success)] text-white shadow-2xs'
                        : 'border border-[var(--color-border)] text-transparent group-hover:border-[var(--color-primary)]'
                    )}
                  >
                    <Check className={cn('w-3 h-3 stroke-[2.5]', isCompleted ? 'block' : 'hidden')} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default HabitsCard;

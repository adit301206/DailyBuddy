import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import type { WeekDayActivity } from '../../types/progress';
import { Calendar, Clock, HelpCircle, Minus } from 'lucide-react';

interface WeeklyActivityMatrixProps {
  weekDays: WeekDayActivity[];
  weeklyCommitmentsCount: number;
  weeklyHabitsCount: number;
}

export const WeeklyActivityMatrix: React.FC<WeeklyActivityMatrixProps> = ({
  weekDays,
  weeklyCommitmentsCount,
  weeklyHabitsCount,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const renderStatusDot = (
    cell: WeekDayActivity['tasks'],
    type: 'Tasks' | 'Habits' | 'Commitments',
    day: WeekDayActivity
  ) => {
    const tooltipKey = `${type}-${day.dateStr}`;
    const isSelected = activeTooltip === tooltipKey;

    let dotColor = 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]';
    let icon = <Minus className="w-2.5 h-2.5 opacity-40" />;
    let label = 'No items';

    if (cell.status === 'future') {
      dotColor = 'bg-[var(--color-surface-secondary)]/50 text-[var(--color-text-secondary)]/40 border border-dashed border-[var(--color-border)]';
      icon = <Clock className="w-2 h-2 opacity-30" />;
      label = 'Upcoming';
    } else if (cell.status === 'complete') {
      dotColor = 'bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]/40';
      icon = <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />;
      label = `${cell.completedCount}/${cell.totalCount} completed`;
    } else if (cell.status === 'partial') {
      dotColor = 'bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]/40';
      icon = (
        <div className="w-2 h-2 rounded-full border-2 border-[var(--color-warning)] bg-[var(--color-warning)]/30" />
      );
      label = `${cell.completedCount}/${cell.totalCount} partial`;
    } else if (cell.status === 'pending') {
      dotColor = 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]';
      icon = <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-secondary)]/60" />;
      label = `0/${cell.totalCount} completed`;
    }

    return (
      <div className="relative flex justify-center items-center py-1">
        <button
          type="button"
          onClick={() => setActiveTooltip(isSelected ? null : tooltipKey)}
          onMouseEnter={() => setActiveTooltip(tooltipKey)}
          onMouseLeave={() => setActiveTooltip(null)}
          onFocus={() => setActiveTooltip(tooltipKey)}
          onBlur={() => setActiveTooltip(null)}
          aria-label={`${type} on ${day.dayShort} ${day.dayNumber}: ${label}`}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${dotColor} ${
            day.isToday ? 'ring-1 ring-[var(--color-primary)]' : ''
          }`}
        >
          {icon}
        </button>

        {/* Tooltip */}
        {isSelected && (
          <div
            role="tooltip"
            className="absolute bottom-full mb-1.5 z-20 whitespace-nowrap px-2.5 py-1 text-[11px] font-medium rounded-md shadow-md bg-[var(--color-text)] text-[var(--color-surface)] pointer-events-none transition-opacity duration-150"
          >
            <span className="font-semibold">{day.dayShort}</span>: {cell.details || label}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <SectionTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Weekly Consistency (This Week)</span>
          </SectionTitle>
          <SecondaryText className="text-xs">
            Daily logs evaluated across Monday through Sunday.
          </SecondaryText>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)] flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-[var(--color-warning)] bg-[var(--color-warning)]/30" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)]/40" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-[var(--color-border)]" />
            <span>None</span>
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="min-w-[340px] px-2 sm:px-0">
          {/* Header Row: Days */}
          <div className="grid grid-cols-8 gap-1.5 pb-2 border-b border-[var(--color-border)] items-center">
            <div className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Activity
            </div>
            {weekDays.map((day) => (
              <div
                key={day.dateStr}
                className={`text-center py-1 rounded-md ${
                  day.isToday
                    ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold'
                    : 'text-[var(--color-text-secondary)] font-medium'
                }`}
              >
                <span className="block text-[11px] uppercase">{day.dayInitial}</span>
                <span className="block text-xs">{day.dayNumber}</span>
              </div>
            ))}
          </div>

          {/* Row 1: Tasks */}
          <div className="grid grid-cols-8 gap-1.5 py-1.5 border-b border-[var(--color-border)]/60 items-center">
            <div className="text-xs font-medium text-[var(--color-text)] truncate">
              Tasks
            </div>
            {weekDays.map((day) => (
              <div key={`task-${day.dateStr}`}>
                {renderStatusDot(day.tasks, 'Tasks', day)}
              </div>
            ))}
          </div>

          {/* Row 2: Habits */}
          <div className="grid grid-cols-8 gap-1.5 py-1.5 border-b border-[var(--color-border)]/60 items-center">
            <div className="text-xs font-medium text-[var(--color-text)] truncate">
              Habits
            </div>
            {weekDays.map((day) => (
              <div key={`habit-${day.dateStr}`}>
                {renderStatusDot(day.habits, 'Habits', day)}
              </div>
            ))}
          </div>

          {/* Row 3: Commitments */}
          <div className="grid grid-cols-8 gap-1.5 py-1.5 items-center">
            <div className="text-xs font-medium text-[var(--color-text)] truncate">
              Commitments
            </div>
            {weekDays.map((day) => (
              <div key={`commit-${day.dateStr}`}>
                {renderStatusDot(day.commitments, 'Commitments', day)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semantic note on weekly frequency items */}
      {(weeklyCommitmentsCount > 0 || weeklyHabitsCount > 0) && (
        <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)]/70 text-[11px] text-[var(--color-text-secondary)] flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0 mt-0.5" />
          <span>
            Daily items are logged per day above.{' '}
            {weeklyCommitmentsCount + weeklyHabitsCount} weekly item(s) are evaluated on their respective weekly targets.
          </span>
        </div>
      )}
    </Card>
  );
};

export default WeeklyActivityMatrix;

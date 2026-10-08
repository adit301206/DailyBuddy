import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import type { TaskProgressStats } from '../../types/progress';
import { AlertTriangle, CheckCircle, CheckSquare, Clock, ListFilter } from 'lucide-react';

interface TaskProgressCardProps {
  stats: TaskProgressStats;
}

export const TaskProgressCard: React.FC<TaskProgressCardProps> = ({ stats }) => {
  const {
    total,
    completed,
    pending,
    overdue,
    completionRate,
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
  } = stats;

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <SectionTitle className="text-base font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Task Momentum</span>
          </SectionTitle>
          <SecondaryText className="text-xs">
            Overall status across all scheduled tasks.
          </SecondaryText>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-[var(--color-primary)]">
            {completionRate}%
          </span>
          <span className="block text-[11px] text-[var(--color-text-secondary)]">
            Completion Rate
          </span>
        </div>
      </div>

      <ProgressBar
        value={completionRate}
        size="sm"
        ariaLabel={`Task completion rate: ${completionRate}%`}
      />

      {/* Grid Metrics */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-success)] font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </div>
          <p className="text-base font-bold text-[var(--color-text)]">
            {completed} <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">/ {total}</span>
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)] text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-text-secondary)] font-medium">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </div>
          <p className="text-base font-bold text-[var(--color-text)]">
            {pending}
          </p>
        </div>

        <div
          className={`p-2.5 rounded-lg text-center space-y-0.5 ${
            overdue > 0
              ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
              : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
          }`}
        >
          <div className="flex items-center justify-center gap-1 text-[11px] font-medium">
            <AlertTriangle className="w-3 h-3" />
            <span>Overdue</span>
          </div>
          <p className="text-base font-bold text-[var(--color-text)]">
            {overdue}
          </p>
        </div>
      </div>

      {/* Priority Distribution */}
      {total > 0 && (
        <div className="pt-2 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1 font-medium text-[11px]">
            <ListFilter className="w-3 h-3" /> Priority Breakdown:
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            {highPriorityCount > 0 && (
              <span className="text-[var(--color-danger)] font-medium">
                {highPriorityCount} High
              </span>
            )}
            {mediumPriorityCount > 0 && (
              <span className="text-[var(--color-warning)] font-medium">
                {mediumPriorityCount} Med
              </span>
            )}
            {lowPriorityCount > 0 && (
              <span className="text-[var(--color-text-secondary)] font-medium">
                {lowPriorityCount} Low
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskProgressCard;

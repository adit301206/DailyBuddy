import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { SecondaryText } from '../ui/Typography';
import { getProgressMessage } from '../../lib/formatters';
import type { DashboardProgress } from '../../types/dashboard';
import { Flame, Sparkles, Target } from 'lucide-react';

interface OverallProgressSectionProps {
  progress: DashboardProgress;
  activeHabitsCount: number;
  activeCommitmentsCount: number;
  completedTasksTodayCount: number;
  totalTasksTodayCount: number;
  activeStreaksCount: number;
}

export const OverallProgressSection: React.FC<OverallProgressSectionProps> = ({
  progress,
  activeHabitsCount,
  activeCommitmentsCount,
  completedTasksTodayCount,
  totalTasksTodayCount,
  activeStreaksCount,
}) => {
  const { completed, total, percentage } = progress;
  const message = getProgressMessage(percentage);

  // SVG Circular progress math
  const strokeWidth = 8;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-5 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Key Progress Visual + Text */}
        <div className="flex items-center gap-5">
          {/* Circular Progress Ring */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[var(--color-surface-secondary)]"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Foreground progress ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[var(--color-primary)] transition-all duration-700 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={isNaN(strokeDashoffset) ? circumference : strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-[var(--color-text)]">
                {percentage}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Today's Overview
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              {completed} of {total} items completed
            </h2>
            <SecondaryText className="text-sm font-normal">
              {message}
            </SecondaryText>
          </div>
        </div>

        {/* Right: Active Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <Target className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Commitments</span>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {activeCommitmentsCount} <span className="text-xs font-normal text-[var(--color-text-secondary)]">active</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Habits</span>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {activeHabitsCount} <span className="text-xs font-normal text-[var(--color-text-secondary)]">active</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]/50 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <Flame className="w-3.5 h-3.5 text-[var(--color-warning)]" />
              <span>Streaks</span>
            </div>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {activeStreaksCount} <span className="text-xs font-normal text-[var(--color-text-secondary)]">running</span>
            </p>
          </div>
        </div>
      </div>

      {/* Linear progress bar for quick visual reading */}
      <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)]/60">
        <div className="flex justify-between text-xs text-[var(--color-text-secondary)]">
          <span>Today's Daily Target</span>
          <span>
            {completedTasksTodayCount} / {totalTasksTodayCount} tasks due today done
          </span>
        </div>
        <ProgressBar
          value={percentage}
          size="sm"
          ariaLabel={`Overall progress: ${percentage}% completed today`}
        />
      </div>
    </Card>
  );
};

export default OverallProgressSection;

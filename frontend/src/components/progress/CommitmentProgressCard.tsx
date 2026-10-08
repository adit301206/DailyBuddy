import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import type { CommitmentProgressStats } from '../../types/progress';
import { Award, CheckCircle2, Flame, Shield, Target } from 'lucide-react';

interface CommitmentProgressCardProps {
  stats: CommitmentProgressStats;
}

export const CommitmentProgressCard: React.FC<CommitmentProgressCardProps> = ({ stats }) => {
  const {
    activeCount,
    inactiveCount,
    completedTodayCount,
    todayCompletionRate,
    longestStreakEver,
    activeStreaksCount,
    consistencyRate30Days,
    dailyCount,
    weeklyCount,
  } = stats;

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <SectionTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Commitment Consistency</span>
          </SectionTitle>
          <SecondaryText className="text-xs">
            Promises you keep to yourself daily and weekly.
          </SecondaryText>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-[var(--color-primary)]">
            {todayCompletionRate}%
          </span>
          <span className="block text-[11px] text-[var(--color-text-secondary)]">
            Today's Target
          </span>
        </div>
      </div>

      <ProgressBar
        value={todayCompletionRate}
        size="sm"
        ariaLabel={`Commitments today completion: ${todayCompletionRate}%`}
      />

      {/* Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)] space-y-0.5 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-text-secondary)] font-medium">
            <CheckCircle2 className="w-3 h-3 text-[var(--color-success)]" />
            <span>Today Done</span>
          </div>
          <p className="text-base font-bold text-[var(--color-text)]">
            {completedTodayCount} <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">/ {activeCount}</span>
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)] space-y-0.5 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-text-secondary)] font-medium">
            <Award className="w-3 h-3 text-[var(--color-warning)]" />
            <span>Best Streak</span>
          </div>
          <p className="text-base font-bold text-[var(--color-text)]">
            {longestStreakEver} <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">days</span>
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)] space-y-0.5 text-center col-span-2 sm:col-span-1">
          <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-text-secondary)] font-medium">
            <Shield className="w-3 h-3 text-[var(--color-primary)]" />
            <span>30-Day Consistency</span>
          </div>
          <p className="text-base font-bold text-[var(--color-text)]">
            {consistencyRate30Days !== null ? `${consistencyRate30Days}%` : 'Building'}
          </p>
        </div>
      </div>

      {/* Frequency Details */}
      <div className="pt-2 border-t border-[var(--color-border)]/60 flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
        <span>
          {dailyCount} daily · {weeklyCount} weekly {inactiveCount > 0 && `· ${inactiveCount} paused`}
        </span>
        <span className="flex items-center gap-1 font-medium text-[var(--color-warning)]">
          <Flame className="w-3 h-3 fill-current" />
          {activeStreaksCount} active {activeStreaksCount === 1 ? 'streak' : 'streaks'}
        </span>
      </div>
    </Card>
  );
};

export default CommitmentProgressCard;

import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText, Metadata } from '../ui/Typography';
import { formatTimeString, getItemIcon } from '../../lib/formatters';
import type { DashboardCommitment } from '../../types/dashboard';
import { Check, Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CommitmentsCardProps {
  commitments: DashboardCommitment[];
  onToggleCommitment?: (commitment: DashboardCommitment) => void;
}

export const CommitmentsCard: React.FC<CommitmentsCardProps> = ({
  commitments,
  onToggleCommitment,
}) => {
  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <span>🔥</span>
            <span>Commitments</span>
          </SectionTitle>
        </div>
        <Metadata className="text-xs">
          {commitments.filter((c) => c.completed_today).length} of {commitments.length} done
        </Metadata>
      </div>

      {commitments.length === 0 ? (
        <div className="py-6 text-center">
          <SecondaryText className="text-sm">No active commitments.</SecondaryText>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {commitments.map((commitment) => {
            const Icon = getItemIcon(commitment.name);
            const isCompleted = commitment.completed_today;
            const targetTimeFormatted = formatTimeString(commitment.target_time);

            return (
              <div
                key={commitment.id}
                onClick={() => onToggleCommitment?.(commitment)}
                className={cn(
                  'group flex items-center justify-between py-3 px-3 -mx-3 rounded-lg transition-colors duration-150 cursor-pointer select-none',
                  isCompleted
                    ? 'hover:bg-[var(--color-surface-secondary)] opacity-80 hover:opacity-100'
                    : 'hover:bg-[var(--color-surface-secondary)]'
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleCommitment?.(commitment);
                  }
                }}
                aria-label={`Toggle commitment ${commitment.name} (${isCompleted ? 'Completed' : 'Not completed'})`}
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: isCompleted
                        ? 'var(--color-success-soft)'
                        : 'var(--color-primary-soft)',
                      color: isCompleted
                        ? 'var(--color-success)'
                        : 'var(--color-primary)',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-sm font-semibold tracking-tight truncate transition-colors',
                        isCompleted
                          ? 'line-through text-[var(--color-text-secondary)] font-medium'
                          : 'text-[var(--color-text)]'
                      )}
                    >
                      {commitment.name}
                    </p>

                    <div className="flex items-center gap-2 text-xs flex-wrap mt-0.5">
                      {/* Streak info */}
                      {commitment.current_streak > 0 ? (
                        <span
                          style={{ color: 'var(--color-warning)' }}
                          className="font-medium flex items-center gap-0.5"
                        >
                          <Flame className="w-3 h-3 fill-current" />
                          <span>{commitment.current_streak} {commitment.current_streak === 1 ? 'day' : 'days'}</span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          No current streak
                        </span>
                      )}

                      {/* Target Time if available */}
                      {targetTimeFormatted && (
                        <>
                          <span style={{ color: 'var(--color-border)' }}>•</span>
                          <span style={{ color: 'var(--color-text-secondary)' }}>
                            {targetTimeFormatted}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Circular Completion Control */}
                <div className="ml-3 shrink-0">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150',
                      isCompleted
                        ? 'bg-[var(--color-success)] text-white shadow-2xs'
                        : 'border border-[var(--color-border)] text-transparent group-hover:border-[var(--color-primary)]'
                    )}
                  >
                    <Check className={cn('w-3.5 h-3.5 stroke-[2.5]', isCompleted ? 'block' : 'hidden')} />
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

export default CommitmentsCard;

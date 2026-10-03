import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Metadata, SecondaryText } from '../ui/Typography';
import { getProgressMessage } from '../../lib/formatters';
import type { DashboardProgress } from '../../types/dashboard';

interface ProgressOverviewProps {
  progress: DashboardProgress;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({ progress }) => {
  const { completed, total, percentage } = progress;
  const message = getProgressMessage(percentage);

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span
              style={{ color: 'var(--color-primary)' }}
              className="text-3xl sm:text-4xl font-bold tracking-tight"
            >
              {percentage}%
            </span>
            <span
              style={{ color: 'var(--color-text)' }}
              className="text-sm sm:text-base font-medium"
            >
              {completed} of {total} completed
            </span>
          </div>
          <SecondaryText className="text-xs sm:text-sm font-normal">
            {message}
          </SecondaryText>
        </div>

        <Metadata className="text-xs font-semibold uppercase tracking-wider">
          Today's Progress
        </Metadata>
      </div>

      <ProgressBar
        value={percentage}
        size="md"
        ariaLabel={`Today's progress: ${percentage}% completed`}
      />
    </Card>
  );
};

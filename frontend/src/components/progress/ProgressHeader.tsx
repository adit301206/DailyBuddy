import React from 'react';
import { PageTitle, SecondaryText } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { BarChart3, RotateCw } from 'lucide-react';
import { getFormattedTodayDate } from '../../lib/formatters';

interface ProgressHeaderProps {
  apiDate?: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  apiDate,
  isRefreshing,
  onRefresh,
}) => {
  const formattedDate = getFormattedTodayDate(apiDate);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border)]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="default" size="sm" icon={<BarChart3 className="w-3.5 h-3.5" />}>
            Insights
          </Badge>
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            {formattedDate}
          </span>
        </div>
        <PageTitle>Progress & Insights</PageTitle>
        <SecondaryText className="text-sm">
          A calm overview of your consistency, focus, and productivity momentum.
        </SecondaryText>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh progress data"
          leftIcon={
            <RotateCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          }
        >
          {isRefreshing ? 'Updating...' : 'Refresh'}
        </Button>
      </div>
    </header>
  );
};

export default ProgressHeader;

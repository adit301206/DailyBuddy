import React from 'react';
import { PageTitle, SecondaryText } from '../ui/Typography';
import { getFormattedTodayDate, getLocalGreeting } from '../../lib/formatters';
import { IconButton } from '../ui/IconButton';
import { RotateCw } from 'lucide-react';

interface GreetingHeaderProps {
  apiDate?: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  apiDate,
  isRefreshing,
  onRefresh,
}) => {
  const greeting = getLocalGreeting('Adit');
  const formattedDate = getFormattedTodayDate(apiDate);

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <PageTitle>{greeting}</PageTitle>
        <SecondaryText className="text-sm font-medium">
          {formattedDate}
        </SecondaryText>
      </div>

      {onRefresh && (
        <IconButton
          icon={<RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
          ariaLabel="Refresh dashboard"
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        />
      )}
    </div>
  );
};

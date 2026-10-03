import React from 'react';
import { cn } from '../../lib/utils';

export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: ProgressBarSize;
  showLabel?: boolean;
  ariaLabel?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  ariaLabel = 'Progress',
  className,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightStyles: Record<ProgressBarSize, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-[var(--color-text-secondary)]">
          <span>{ariaLabel}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        style={{ backgroundColor: 'var(--color-surface-secondary)' }}
        className={cn('w-full rounded-full overflow-hidden', heightStyles[size])}
      >
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: 'var(--color-primary)',
          }}
          className="h-full rounded-full transition-all duration-300 ease-out"
        />
      </div>
    </div>
  );
};

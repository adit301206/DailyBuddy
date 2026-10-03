import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  children,
  className,
  style,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-medium rounded-md border transition-colors duration-150 select-none';

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const getVariantStyles = (v: BadgeVariant): React.CSSProperties => {
    switch (v) {
      case 'success':
        return {
          backgroundColor: 'var(--color-success-soft)',
          color: 'var(--color-success)',
          borderColor: 'transparent',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning-soft)',
          color: 'var(--color-warning)',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger-soft)',
          color: 'var(--color-danger)',
          borderColor: 'transparent',
        };
      case 'default':
      default:
        return {
          backgroundColor: 'var(--color-primary-soft)',
          color: 'var(--color-primary)',
          borderColor: 'transparent',
        };
    }
  };

  return (
    <span
      style={{ ...getVariantStyles(variant), ...style }}
      className={cn(baseStyles, sizeStyles[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

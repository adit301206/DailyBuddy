import React from 'react';
import { cn } from '../../lib/utils';

export type CardVariant = 'standard' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'standard', className, children, style, ...props }, ref) => {
    const baseStyles =
      'rounded-xl border transition-all duration-200 p-5 shadow-xs';

    const variantStyles: Record<CardVariant, string> = {
      standard: '',
      interactive:
        'cursor-pointer hover:border-[var(--color-primary)] hover:shadow-sm active:scale-[0.995]',
    };

    const cardInlineStyle: React.CSSProperties = {
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      color: 'var(--color-text)',
      ...style,
    };

    return (
      <div
        ref={ref}
        style={cardInlineStyle}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

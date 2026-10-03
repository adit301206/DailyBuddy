import React from 'react';
import { cn } from '../../lib/utils';
import type { ButtonSize, ButtonVariant } from './Button';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      ariaLabel,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      className,
      disabled,
      type = 'button',
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const sizes: Record<ButtonSize, string> = {
      sm: 'w-8 h-8 rounded-md text-xs',
      md: 'w-9.5 h-9.5 rounded-lg text-sm',
      lg: 'w-11 h-11 rounded-lg text-base',
    };

    const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
      },
      secondary: {
        backgroundColor: 'var(--color-surface-secondary)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
      },
      danger: {
        backgroundColor: 'var(--color-danger)',
        color: '#ffffff',
      },
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled || isLoading}
        style={{ ...variantStyles[variant], ...style }}
        className={cn(baseStyles, sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        ) : (
          <span className="flex items-center justify-center shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

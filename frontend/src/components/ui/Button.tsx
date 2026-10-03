import React from 'react';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles: clean, uncluttered, modest rounding, micro-transitions
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'shadow-xs text-white hover:opacity-95 active:scale-[0.98]',
      secondary:
        'border hover:opacity-90 active:scale-[0.98]',
      ghost:
        'bg-transparent hover:opacity-90 active:scale-[0.98]',
      danger:
        'shadow-xs text-white hover:opacity-95 active:scale-[0.98]',
    };

    // Custom inline-style tokens for colors to maintain 100% theme variable compliance
    const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
      },
      secondary: {
        backgroundColor: 'var(--color-surface-secondary)',
        color: 'var(--color-text)',
        borderColor: 'var(--color-border)',
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

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-9.5 px-4 text-sm rounded-lg gap-2',
      lg: 'h-11 px-5 text-base rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        style={variantStyles[variant]}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5"
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
        ) : null}
        
        {children}

        {!isLoading && rightIcon ? (
          <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

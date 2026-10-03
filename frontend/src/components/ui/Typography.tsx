import React from 'react';
import { cn } from '../../lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement> {
  children: React.ReactNode;
}

export const PageTitle: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
  <h1
    style={{ color: 'var(--color-text)', ...style }}
    className={cn('text-2xl font-bold tracking-tight sm:text-3xl', className)}
    {...props}
  >
    {children}
  </h1>
);

export const SectionTitle: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
  <h2
    style={{ color: 'var(--color-text)', ...style }}
    className={cn('text-lg font-semibold tracking-tight sm:text-xl', className)}
    {...props}
  >
    {children}
  </h2>
);

export const Text: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
  <p
    style={{ color: 'var(--color-text)', ...style }}
    className={cn('text-sm sm:text-base leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
);

export const SecondaryText: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
  <p
    style={{ color: 'var(--color-text-secondary)', ...style }}
    className={cn('text-sm leading-normal', className)}
    {...props}
  >
    {children}
  </p>
);

export const Metadata: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
  <span
    style={{ color: 'var(--color-text-secondary)', ...style }}
    className={cn('text-xs font-medium tracking-normal', className)}
    {...props}
  >
    {children}
  </span>
);

export const Label: React.FC<TypographyProps> = ({ children, className, style, ...props }) => (
  <span
    style={{ color: 'var(--color-text-secondary)', ...style }}
    className={cn('text-xs font-semibold uppercase tracking-wider', className)}
    {...props}
  >
    {children}
  </span>
);

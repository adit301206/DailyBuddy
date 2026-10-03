import type { ThemeDefinition, ThemeName } from './theme-types';

const baseLightStatic = {
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceSecondary: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  successSoft: '#ecfdf5',
  warning: '#f59e0b',
  warningSoft: '#fffbeb',
  danger: '#ef4444',
  dangerSoft: '#fef2f2',
};

const baseDarkStatic = {
  background: '#0b0f19',
  surface: '#151c2c',
  surfaceSecondary: '#1e2d42',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#222f47',
  success: '#34d399',
  successSoft: 'rgba(52, 211, 153, 0.15)',
  warning: '#fbbf24',
  warningSoft: 'rgba(251, 191, 36, 0.15)',
  danger: '#f87171',
  dangerSoft: 'rgba(248, 113, 113, 0.15)',
};

export const THEMES: Record<ThemeName, ThemeDefinition> = {
  purple: {
    name: 'purple',
    label: 'Purple',
    light: {
      ...baseLightStatic,
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      primarySoft: '#f3e8ff',
      ring: 'rgba(124, 58, 237, 0.35)',
    },
    dark: {
      ...baseDarkStatic,
      primary: '#a78bfa',
      primaryHover: '#8b5cf6',
      primarySoft: 'rgba(167, 139, 250, 0.18)',
      ring: 'rgba(167, 139, 250, 0.4)',
    },
  },
  green: {
    name: 'green',
    label: 'Green',
    light: {
      ...baseLightStatic,
      primary: '#059669',
      primaryHover: '#047857',
      primarySoft: '#d1fae5',
      ring: 'rgba(5, 150, 105, 0.35)',
    },
    dark: {
      ...baseDarkStatic,
      primary: '#34d399',
      primaryHover: '#10b981',
      primarySoft: 'rgba(52, 211, 153, 0.18)',
      ring: 'rgba(52, 211, 153, 0.4)',
    },
  },
  blue: {
    name: 'blue',
    label: 'Blue',
    light: {
      ...baseLightStatic,
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      primarySoft: '#dbeafe',
      ring: 'rgba(37, 99, 235, 0.35)',
    },
    dark: {
      ...baseDarkStatic,
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      primarySoft: 'rgba(96, 165, 250, 0.18)',
      ring: 'rgba(96, 165, 250, 0.4)',
    },
  },
};

export const DEFAULT_THEME: ThemeName = 'purple';
export const DEFAULT_MODE = 'light';

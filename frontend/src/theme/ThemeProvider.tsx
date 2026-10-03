import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ModeName, ThemeContextType, ThemeName } from './theme-types';
import { DEFAULT_MODE, DEFAULT_THEME, THEMES } from './themes';

const STORAGE_KEY_THEME = 'dailybuddy_theme';
const STORAGE_KEY_MODE = 'dailybuddy_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  defaultMode?: ModeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = DEFAULT_THEME,
  defaultMode = DEFAULT_MODE,
}) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeName | null;
    return saved && THEMES[saved] ? saved : defaultTheme;
  });

  const [mode, setModeState] = useState<ModeName>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODE) as ModeName | null;
    return saved || defaultMode;
  });

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  // Handle system color scheme preference listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedMode = () => {
      if (mode === 'system') {
        setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedMode(mode as 'light' | 'dark');
      }
    };

    updateResolvedMode();

    const handleChange = () => {
      if (mode === 'system') {
        setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Apply CSS variables and data attributes to root element
  useEffect(() => {
    const root = document.documentElement;
    const themeDef = THEMES[theme] || THEMES[DEFAULT_THEME];
    const colors = resolvedMode === 'dark' ? themeDef.dark : themeDef.light;

    // Apply exact required CSS variables
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-surface-secondary', colors.surfaceSecondary);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-primary-soft', colors.primarySoft);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-success-soft', colors.successSoft);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-warning-soft', colors.warningSoft);
    root.style.setProperty('--color-danger', colors.danger);
    root.style.setProperty('--color-danger-soft', colors.dangerSoft);
    root.style.setProperty('--color-ring', colors.ring);

    // Apply attributes for CSS selector targeting
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', resolvedMode);

    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, resolvedMode]);

  const setTheme = (newTheme: ThemeName) => {
    if (THEMES[newTheme]) {
      setThemeState(newTheme);
      localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    }
  };

  const setMode = (newMode: ModeName) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY_MODE, newMode);
  };

  const availableThemes = Object.values(THEMES).map((t) => ({
    name: t.name,
    label: t.label,
    primaryColor: resolvedMode === 'dark' ? t.dark.primary : t.light.primary,
  }));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        mode,
        setMode,
        resolvedMode,
        availableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

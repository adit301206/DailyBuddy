export type ThemeName = 'purple' | 'green' | 'blue';
export type ModeName = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  primaryHover: string;
  primarySoft: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  ring: string;
}

export interface ThemeDefinition {
  name: ThemeName;
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  mode: ModeName;
  setMode: (mode: ModeName) => void;
  resolvedMode: 'light' | 'dark';
  availableThemes: { name: ThemeName; label: string; primaryColor: string }[];
}

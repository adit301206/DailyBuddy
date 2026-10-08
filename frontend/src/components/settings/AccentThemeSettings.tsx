import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { useTheme } from '../../theme/ThemeProvider';
import type { ThemeName } from '../../theme/theme-types';
import { Check, Palette } from 'lucide-react';

export const AccentThemeSettings: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="space-y-0.5">
        <SectionTitle className="text-base font-semibold flex items-center gap-2">
          <Palette className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Accent Theme</span>
        </SectionTitle>
        <SecondaryText className="text-xs">
          Select the primary color accents for active buttons, charts, and indicators.
        </SecondaryText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {availableThemes.map((t) => {
          const isSelected = theme === t.name;

          return (
            <button
              key={t.name}
              type="button"
              onClick={() => setTheme(t.name as ThemeName)}
              className={`p-3.5 rounded-xl text-left border transition-all duration-150 flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 shadow-xs'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 hover:bg-[var(--color-surface-secondary)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-full shrink-0 shadow-xs flex items-center justify-center transition-transform hover:scale-105"
                  style={{ backgroundColor: t.primaryColor }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {t.label}
                </span>
              </div>

              {isSelected && (
                <span className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default AccentThemeSettings;

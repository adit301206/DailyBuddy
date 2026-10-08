import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { useTheme } from '../../theme/ThemeProvider';
import type { ModeName } from '../../theme/theme-types';
import { Check, Laptop, Moon, Sun } from 'lucide-react';

export const AppearanceSettings: React.FC = () => {
  const { mode, setMode } = useTheme();

  const modes: Array<{
    id: ModeName;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'light',
      title: 'Light',
      description: 'Crisp, bright background for daytime focus.',
      icon: <Sun className="w-5 h-5" />,
    },
    {
      id: 'dark',
      title: 'Dark',
      description: 'Deep, calm tones to reduce eye fatigue.',
      icon: <Moon className="w-5 h-5" />,
    },
    {
      id: 'system',
      title: 'System',
      description: 'Automatically synchronizes with your OS theme.',
      icon: <Laptop className="w-5 h-5" />,
    },
  ];

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="space-y-0.5">
        <SectionTitle className="text-base font-semibold">Appearance</SectionTitle>
        <SecondaryText className="text-xs">
          Choose your preferred theme interface and ambient lighting.
        </SecondaryText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {modes.map((m) => {
          const isSelected = mode === m.id;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-150 relative flex flex-col justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/40 shadow-xs'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 hover:bg-[var(--color-surface-secondary)]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                  }`}
                >
                  {m.icon}
                </div>

                {isSelected && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white"
                    aria-label="Selected"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {m.title}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-normal">
                  {m.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default AppearanceSettings;

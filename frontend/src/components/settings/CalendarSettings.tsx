import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { usePreferences } from '../../context/PreferencesContext';
import type { WeekStartDay } from '../../types/settings';
import { Calendar, Check } from 'lucide-react';

export const CalendarSettings: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();

  const options: Array<{
    id: WeekStartDay;
    label: string;
    description: string;
  }> = [
    {
      id: 'monday',
      label: 'Monday',
      description: 'Standard work week (Mon – Sun).',
    },
    {
      id: 'sunday',
      label: 'Sunday',
      description: 'Traditional calendar week (Sun – Sat).',
    },
  ];

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="space-y-0.5">
        <SectionTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Day & Calendar</span>
        </SectionTitle>
        <SecondaryText className="text-xs">
          Configure how weekly consistency matrices and 7-day overviews are ordered.
        </SecondaryText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {options.map((opt) => {
          const isSelected = preferences.weekStart === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => updatePreferences({ weekStart: opt.id })}
              className={`p-3.5 rounded-xl text-left border transition-all duration-150 flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-soft)]/30 shadow-xs'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 hover:bg-[var(--color-surface-secondary)]'
              }`}
            >
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {opt.label}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)]">
                  {opt.description}
                </p>
              </div>

              {isSelected && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white shrink-0"
                  aria-label="Selected"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarSettings;

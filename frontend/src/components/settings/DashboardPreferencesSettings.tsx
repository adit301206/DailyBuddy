import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { usePreferences } from '../../context/PreferencesContext';
import type { DashboardSectionVisibility } from '../../types/settings';
import { Bell, CheckSquare, Flame, LayoutDashboard, Sparkles, Target } from 'lucide-react';

export const DashboardPreferencesSettings: React.FC = () => {
  const { preferences, updateDashboardSection } = usePreferences();

  const sections: Array<{
    key: keyof DashboardSectionVisibility;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'commitments',
      title: 'Commitments Section',
      description: 'Daily promises and weekly commitments checklist.',
      icon: <Target className="w-4 h-4 text-[var(--color-primary)]" />,
    },
    {
      key: 'tasks',
      title: 'Tasks Section',
      description: "Today's scheduled tasks and priority items.",
      icon: <CheckSquare className="w-4 h-4 text-[var(--color-primary)]" />,
    },
    {
      key: 'habits',
      title: 'Habits Section',
      description: 'Routine habit tracker with quick daily check-ins.',
      icon: <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />,
    },
    {
      key: 'activeStreaks',
      title: 'Active Streaks Overview',
      description: 'Running streaks card highlighting daily momentum.',
      icon: <Flame className="w-4 h-4 text-[var(--color-warning)]" />,
    },
    {
      key: 'reminders',
      title: 'Upcoming Reminders',
      description: 'Time-sensitive alerts and upcoming scheduled reminders.',
      icon: <Bell className="w-4 h-4 text-[var(--color-primary)]" />,
    },
  ];

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="space-y-0.5">
        <SectionTitle className="text-base font-semibold flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Dashboard Sections</span>
        </SectionTitle>
        <SecondaryText className="text-xs">
          Choose which cards appear on your My Day dashboard overview.
        </SecondaryText>
      </div>

      <div className="divide-y divide-[var(--color-border)]/60 pt-1">
        {sections.map((sec) => {
          const isEnabled = preferences.dashboardSections[sec.key];

          return (
            <div
              key={sec.key}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-secondary)] flex items-center justify-center shrink-0 border border-[var(--color-border)]/40">
                  {sec.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                    {sec.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                    {sec.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                onClick={() => updateDashboardSection(sec.key, !isEnabled)}
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative inline-flex items-center p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer shrink-0 ${
                  isEnabled
                    ? 'bg-[var(--color-primary)]'
                    : 'bg-[var(--color-border)]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 inline-block ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DashboardPreferencesSettings;

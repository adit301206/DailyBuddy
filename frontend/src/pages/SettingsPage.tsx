import React, { useState } from 'react';
import { PageTitle, SecondaryText } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { AppearanceSettings } from '../components/settings/AppearanceSettings';
import { AccentThemeSettings } from '../components/settings/AccentThemeSettings';
import { PersonalSettings } from '../components/settings/PersonalSettings';
import { CalendarSettings } from '../components/settings/CalendarSettings';
import { DashboardPreferencesSettings } from '../components/settings/DashboardPreferencesSettings';
import { DangerZoneSettings } from '../components/settings/DangerZoneSettings';
import { AboutSection } from '../components/settings/AboutSection';
import { Toast, type ToastInfo } from '../components/tasks/Toast';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. Page Header */}
      <header className="space-y-1 pb-2 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Badge variant="default" size="sm" icon={<Settings className="w-3.5 h-3.5" />}>
            Preferences
          </Badge>
        </div>
        <PageTitle>Settings & Personalization</PageTitle>
        <SecondaryText className="text-sm">
          Customize themes, focus layout, calendar week, and personal preferences.
        </SecondaryText>
      </header>

      {/* 2. Section 1: Appearance Mode */}
      <AppearanceSettings />

      {/* 3. Section 2: Accent Theme */}
      <AccentThemeSettings />

      {/* 4. Section 3: Personal Profile */}
      <PersonalSettings />

      {/* 5. Section 4: Day & Calendar Week */}
      <CalendarSettings />

      {/* 6. Section 5: Dashboard Workspace Layout */}
      <DashboardPreferencesSettings />

      {/* 7. Section 6: Data & Local Settings */}
      <DangerZoneSettings onNotify={(msg) => showToast('success', msg)} />

      {/* 8. Section 7: About DailyBuddy */}
      <AboutSection />

      {/* Feedback Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default SettingsPage;

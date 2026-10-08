export type WeekStartDay = 'monday' | 'sunday';

export interface DashboardSectionVisibility {
  commitments: boolean;
  tasks: boolean;
  habits: boolean;
  activeStreaks: boolean;
  reminders: boolean;
}

export interface UserPreferences {
  displayName: string;
  showGreetingEmoji: boolean;
  weekStart: WeekStartDay;
  dashboardSections: DashboardSectionVisibility;
}

export interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  updateDashboardSection: (section: keyof DashboardSectionVisibility, visible: boolean) => void;
  resetPreferences: () => void;
}

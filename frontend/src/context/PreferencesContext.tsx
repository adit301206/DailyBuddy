import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  DashboardSectionVisibility,
  PreferencesContextType,
  UserPreferences,
} from '../types/settings';

const STORAGE_KEY_PREFERENCES = 'dailybuddy_user_preferences';

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  displayName: 'Adit',
  showGreetingEmoji: true,
  weekStart: 'monday',
  dashboardSections: {
    commitments: true,
    tasks: true,
    habits: true,
    activeStreaks: true,
    reminders: true,
  },
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export interface PreferencesProviderProps {
  children: React.ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFERENCES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER_PREFERENCES,
          ...parsed,
          dashboardSections: {
            ...DEFAULT_USER_PREFERENCES.dashboardSections,
            ...(parsed.dashboardSections || {}),
          },
        };
      }
    } catch {
      // fallback to defaults on parse error
    }
    return DEFAULT_USER_PREFERENCES;
  });

  // Save to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(preferences));
    } catch {
      // ignore storage write errors
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
      dashboardSections: updates.dashboardSections
        ? { ...prev.dashboardSections, ...updates.dashboardSections }
        : prev.dashboardSections,
    }));
  };

  const updateDashboardSection = (
    section: keyof DashboardSectionVisibility,
    visible: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      dashboardSections: {
        ...prev.dashboardSections,
        [section]: visible,
      },
    }));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_USER_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY_PREFERENCES);
    } catch {
      // ignore
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        updateDashboardSection,
        resetPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

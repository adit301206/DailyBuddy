import React from 'react';
import {
  BarChart3,
  Bell,
  CheckSquare,
  Flame,
  Home,
  Repeat,
  Settings,
} from 'lucide-react';

export interface NavItemConfig {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  { name: 'My Day', path: '/', icon: Home, end: true },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Commitments', path: '/commitments', icon: Flame },
  { name: 'Habits', path: '/habits', icon: Repeat },
  { name: 'Reminders', path: '/reminders', icon: Bell },
  { name: 'Progress', path: '/progress', icon: BarChart3 },
];

export const SETTINGS_NAV_ITEM: NavItemConfig = {
  name: 'Settings',
  path: '/settings',
  icon: Settings,
};

export const ALL_NAV_ITEMS: NavItemConfig[] = [
  ...MAIN_NAV_ITEMS,
  SETTINGS_NAV_ITEM,
];

export function getPageTitle(pathname: string): string {
  const item = ALL_NAV_ITEMS.find((nav) =>
    nav.end ? pathname === nav.path : pathname.startsWith(nav.path) && nav.path !== '/'
  );
  if (item) return item.name;
  if (pathname === '/') return 'My Day';
  return 'DailyBuddy';
}

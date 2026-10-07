import React from 'react';
import {
  BookOpen,
  Brain,
  Code,
  Cpu,
  Droplets,
  Heart,
  Laptop,
  Pill,
  Puzzle,
  Sparkles,
  Target,
} from 'lucide-react';

/**
 * Returns today's local date as YYYY-MM-DD string.
 */
export function getLocalTodayStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a time-appropriate greeting based on local browser time.
 */
export function getLocalGreeting(name = 'Adit'): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return `Good morning, ${name} 👋`;
  }
  if (hour >= 12 && hour < 17) {
    return `Good afternoon, ${name} 👋`;
  }
  return `Good evening, ${name} 👋`;
}

/**
 * Returns current formatted date string (e.g., "Saturday, October 3").
 */
export function getFormattedTodayDate(dateStr?: string): string {
  const dateObj = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats "YYYY-MM-DD" into human-friendly date string (e.g., "Today", "Tomorrow", "Monday, Oct 5").
 */
export function formatHumanDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const [yearStr, monthStr, dayStr] = parts;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;

  const dateObj = new Date(year, month - 1, day);
  const todayStr = getLocalTodayStr();

  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr) {
    return 'Today';
  }
  if (dateStr === tomorrowStr) {
    return 'Tomorrow';
  }
  if (dateStr === yesterdayStr) {
    return 'Yesterday';
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  if (year !== now.getFullYear()) {
    options.year = 'numeric';
  }

  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Formats "HH:MM:SS" or "HH:MM" into "h:MM A" (e.g., "18:00:00" -> "6:00 PM").
 */
export function formatTimeString(timeStr?: string | null): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Formats a reminder's schedule into a human-friendly string (e.g. "Today at 9:00 PM", "Daily at 8:00 AM").
 */
export function formatReminderSchedule(
  dateStr?: string | null,
  timeStr?: string | null,
  repeatType: 'ONCE' | 'DAILY' | 'WEEKLY' | string = 'ONCE'
): string {
  const formattedTime = formatTimeString(timeStr);

  if (repeatType === 'DAILY') {
    return formattedTime ? `Daily at ${formattedTime}` : 'Daily';
  }

  if (repeatType === 'WEEKLY') {
    if (dateStr) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month - 1, day);
        const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
        return formattedTime ? `Weekly on ${weekday}s at ${formattedTime}` : `Weekly on ${weekday}s`;
      }
    }
    return formattedTime ? `Weekly at ${formattedTime}` : 'Weekly';
  }

  // ONCE or other
  if (dateStr) {
    const humanDate = formatHumanDate(dateStr);
    return formattedTime ? `${humanDate} at ${formattedTime}` : humanDate;
  }

  return formattedTime ? `At ${formattedTime}` : 'No date set';
}


/**
 * Returns calm, encouraging contextual message based on progress percentage.
 */
export function getProgressMessage(percentage: number): string {
  if (percentage <= 0) return "Let's get started.";
  if (percentage < 25) return "You're getting started.";
  if (percentage < 50) return 'Nice start. Keep going.';
  if (percentage < 75) return "You're making solid progress.";
  if (percentage < 100) return 'Almost there.';
  return 'Everything done. Great work.';
}

/**
 * Centralized Category emoji / icon map.
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  GitHub: '💻',
  AIML: '🤖',
  GRE: '📚',
  LinkedIn: '💼',
  College: '🎓',
  Puzzles: '🧩',
  Health: '❤️',
  Calls: '📞',
  Personal: '🏠',
  Projects: '🚀',
  Gaming: '🎮',
};

/**
 * Resolves emoji for a given category name or custom category icon.
 */
export function getCategoryEmoji(categoryName?: string | null, customIcon?: string | null): string | null {
  if (customIcon && customIcon.trim()) return customIcon;
  if (!categoryName) return null;
  
  const trimmed = categoryName.trim();
  const directMatch = CATEGORY_ICON_MAP[trimmed];
  if (directMatch) return directMatch;

  const caseMatch = Object.entries(CATEGORY_ICON_MAP).find(
    ([key]) => key.toLowerCase() === trimmed.toLowerCase()
  );
  return caseMatch ? caseMatch[1] : null;
}

/**
 * Resolves an appropriate icon component for a commitment or habit by name keyword.
 */
export function getItemIcon(name: string): React.ComponentType<{ className?: string }> {
  const lower = name.toLowerCase();

  if (lower.includes('github') || lower.includes('code') || lower.includes('dev') || lower.includes('commit')) {
    return Code;
  }
  if (lower.includes('aiml') || lower.includes('ai') || lower.includes('ml') || lower.includes('model')) {
    return Cpu;
  }
  if (lower.includes('gre') || lower.includes('study') || lower.includes('read') || lower.includes('book')) {
    return BookOpen;
  }
  if (lower.includes('puzzle') || lower.includes('chess') || lower.includes('logic')) {
    return Puzzle;
  }
  if (lower.includes('water') || lower.includes('hydrate') || lower.includes('drink')) {
    return Droplets;
  }
  if (lower.includes('skin') || lower.includes('care') || lower.includes('health') || lower.includes('meditation')) {
    return Heart;
  }
  if (lower.includes('medicine') || lower.includes('pill') || lower.includes('vitamin')) {
    return Pill;
  }
  if (lower.includes('brain') || lower.includes('focus')) {
    return Brain;
  }
  if (lower.includes('work') || lower.includes('laptop')) {
    return Laptop;
  }
  if (lower.includes('target') || lower.includes('goal')) {
    return Target;
  }

  return Sparkles;
}

/**
 * Returns the Monday Date object for the current week.
 */
export function getMondayOfCurrentWeek(d = new Date()): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

export interface WeekDayInfo {
  dateStr: string;
  dayShort: string;
  dayInitial: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

/**
 * Generates array of 7 days (Monday to Sunday) for the current week.
 */
export function getCurrentWeekDays(todayStr = getLocalTodayStr()): WeekDayInfo[] {
  const now = new Date();
  const monday = getMondayOfCurrentWeek(now);
  const days: WeekDayInfo[] = [];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayInitials = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;
    const isFuture = dateStr > todayStr;

    days.push({
      dateStr,
      dayShort: dayNames[i],
      dayInitial: dayInitials[i],
      dayNumber: current.getDate(),
      isToday,
      isPast,
      isFuture,
    });
  }

  return days;
}

export interface WeekIntervalInfo {
  startStr: string;
  endStr: string;
  label: string;
  formattedRange: string;
  isCurrentWeek: boolean;
}

/**
 * Generates past weekly intervals for weekly commitments.
 */
export function getRecentWeeklyIntervals(count = 4): WeekIntervalInfo[] {
  const now = new Date();
  const currentMonday = getMondayOfCurrentWeek(now);
  const intervals: WeekIntervalInfo[] = [];

  for (let i = 0; i < count; i++) {
    const mon = new Date(currentMonday);
    mon.setDate(currentMonday.getDate() - i * 7);

    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);

    const startStr = `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, '0')}-${String(mon.getDate()).padStart(2, '0')}`;
    const endStr = `${sun.getFullYear()}-${String(sun.getMonth() + 1).padStart(2, '0')}-${String(sun.getDate()).padStart(2, '0')}`;

    let label = '';
    if (i === 0) {
      label = 'This Week';
    } else if (i === 1) {
      label = 'Last Week';
    } else {
      label = `${i} Weeks Ago`;
    }

    const startFormatted = mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endFormatted = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    intervals.push({
      startStr,
      endStr,
      label,
      formattedRange: `${startFormatted} – ${endFormatted}`,
      isCurrentWeek: i === 0,
    });
  }

  return intervals;
}

/**
 * Formats ISO timestamp or time string for log display.
 */
export function formatLogTimestamp(isoStr?: string | null): string {
  if (!isoStr) return '';
  try {
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}


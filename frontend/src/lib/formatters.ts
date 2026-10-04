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


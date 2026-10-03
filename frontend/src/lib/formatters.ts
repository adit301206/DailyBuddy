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

import type { DashboardData } from '../types/dashboard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Fetch the latest dashboard overview from Django backend.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/dashboard/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load dashboard data (${response.status} ${response.statusText})`);
  }

  return response.json();
}

/**
 * Toggle task completion status.
 */
export async function toggleTaskCompletion(taskId: number, completed: boolean): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task (${response.status})`);
  }
}

/**
 * Toggle commitment completion for today.
 */
export async function logCommitmentToday(commitmentId: number, dateStr: string, completed: boolean = true): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/commitment-logs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      commitment: commitmentId,
      date: dateStr,
      completed,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to log commitment (${response.status})`);
  }
}

/**
 * Toggle habit completion for today.
 */
export async function logHabitToday(habitId: number, dateStr: string, completed: boolean = true): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/habit-logs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      habit: habitId,
      date: dateStr,
      completed,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to log habit (${response.status})`);
  }
}

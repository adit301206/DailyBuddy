import type { DashboardData } from '../types/dashboard';
import type { Category, CreateTaskInput, Task, UpdateTaskInput } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Fetch all categories from Django backend.
 */
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load categories (${response.status})`);
  }

  return response.json();
}

/**
 * Fetch all tasks from Django backend.
 */
export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load tasks (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new task.
 */
export async function createTask(data: CreateTaskInput): Promise<Task> {
  const payload = {
    ...data,
    category: data.category || null,
    due_date: data.due_date || null,
    due_time: data.due_time || null,
    description: data.description || '',
  };

  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = Object.values(errJson).flat().join(', ');
    } catch {
      // ignore
    }
    throw new Error(errorDetail || `Failed to create task (${response.status})`);
  }

  return response.json();
}

/**
 * Update an existing task (partial update via PATCH).
 */
export async function updateTask(taskId: number, data: UpdateTaskInput): Promise<Task> {
  const payload: Record<string, unknown> = { ...data };
  if ('category' in data) {
    payload.category = data.category || null;
  }
  if ('due_date' in data) {
    payload.due_date = data.due_date || null;
  }
  if ('due_time' in data) {
    payload.due_time = data.due_time || null;
  }

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = Object.values(errJson).flat().join(', ');
    } catch {
      // ignore
    }
    throw new Error(errorDetail || `Failed to update task (${response.status})`);
  }

  return response.json();
}

/**
 * Delete an existing task.
 */
export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task (${response.status})`);
  }
}

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


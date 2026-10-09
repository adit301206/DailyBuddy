import type { AuthResponse, AuthUser, LoginCredentials } from '../types/auth';
import type { Commitment, CommitmentLog, CreateCommitmentInput, UpdateCommitmentInput } from '../types/commitment';
import type { DashboardData } from '../types/dashboard';
import type { CreateHabitInput, Habit, HabitLog, UpdateHabitInput } from '../types/habit';
import type { CreateReminderInput, Reminder, UpdateReminderInput } from '../types/reminder';
import type { Category, CreateTaskInput, Task, UpdateTaskInput } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export const STORAGE_KEY_AUTH_TOKEN = 'dailybuddy_auth_token';

let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorizedCallback(cb: (() => void) | null) {
  onUnauthorizedCallback = cb;
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
    }
  } catch {
    // ignore storage write errors
  }
}

/**
 * Centrally injected auth fetch wrapper.
 * Attaches DRF Token header and intercepts 401 Unauthorized responses.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If not calling login itself, clear invalid token and notify AuthContext
    if (!url.includes('/auth/login/')) {
      setStoredToken(null);
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
  }

  return response;
}

/* =========================================================================
   Authentication API
   ========================================================================= */

/**
 * Authenticate owner with credentials and obtain DRF token.
 */
export async function loginOwner(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorDetail = 'Invalid username or password.';
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  const data: AuthResponse = await response.json();
  setStoredToken(data.token);
  return data;
}

/**
 * Fetch current authenticated user info.
 */
export async function getMe(): Promise<AuthUser> {
  const response = await authFetch(`${API_BASE_URL}/auth/me/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to verify session (${response.status})`);
  }

  return response.json();
}

/**
 * Revoke owner token on the backend and clear local token.
 */
export async function logoutOwner(): Promise<void> {
  try {
    await authFetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
    });
  } catch {
    // ignore network errors on logout
  } finally {
    setStoredToken(null);
  }
}

/* =========================================================================
   Categories & Tasks API
   ========================================================================= */

/**
 * Fetch all categories from Django backend.
 */
export async function getCategories(): Promise<Category[]> {
  const response = await authFetch(`${API_BASE_URL}/categories/`, {
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
  const response = await authFetch(`${API_BASE_URL}/tasks/`, {
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

  const response = await authFetch(`${API_BASE_URL}/tasks/`, {
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

  const response = await authFetch(`${API_BASE_URL}/tasks/${taskId}/`, {
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
  const response = await authFetch(`${API_BASE_URL}/tasks/${taskId}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task (${response.status})`);
  }
}

/* =========================================================================
   Commitments API
   ========================================================================= */

/**
 * Fetch all commitments from Django backend.
 */
export async function getCommitments(): Promise<Commitment[]> {
  const response = await authFetch(`${API_BASE_URL}/commitments/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load commitments (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new commitment.
 */
export async function createCommitment(data: CreateCommitmentInput): Promise<Commitment> {
  const payload = {
    ...data,
    category: data.category || null,
    target_time: data.target_time || null,
    active: data.active !== undefined ? data.active : true,
  };

  const response = await authFetch(`${API_BASE_URL}/commitments/`, {
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
    throw new Error(errorDetail || `Failed to create commitment (${response.status})`);
  }

  return response.json();
}

/**
 * Update an existing commitment (partial update via PATCH).
 */
export async function updateCommitment(id: number, data: UpdateCommitmentInput): Promise<Commitment> {
  const payload: Record<string, unknown> = { ...data };
  if ('category' in data) {
    payload.category = data.category || null;
  }
  if ('target_time' in data) {
    payload.target_time = data.target_time || null;
  }

  const response = await authFetch(`${API_BASE_URL}/commitments/${id}/`, {
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
    throw new Error(errorDetail || `Failed to update commitment (${response.status})`);
  }

  return response.json();
}

/**
 * Delete an existing commitment.
 */
export async function deleteCommitment(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/commitments/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete commitment (${response.status})`);
  }
}

/**
 * Fetch all commitment logs.
 */
export async function getCommitmentLogs(): Promise<CommitmentLog[]> {
  const response = await authFetch(`${API_BASE_URL}/commitment-logs/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load commitment logs (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new commitment log.
 */
export async function createCommitmentLog(data: {
  commitment: number;
  date: string;
  completed?: boolean;
  completed_at?: string | null;
}): Promise<CommitmentLog> {
  const response = await authFetch(`${API_BASE_URL}/commitment-logs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = Object.values(errJson).flat().join(', ');
    } catch {
      // ignore
    }
    throw new Error(errorDetail || `Failed to create commitment log (${response.status})`);
  }

  return response.json();
}

/**
 * Update an existing commitment log (partial update via PATCH).
 */
export async function updateCommitmentLog(
  id: number,
  data: {
    completed?: boolean;
    completed_at?: string | null;
  }
): Promise<CommitmentLog> {
  const response = await authFetch(`${API_BASE_URL}/commitment-logs/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = Object.values(errJson).flat().join(', ');
    } catch {
      // ignore
    }
    throw new Error(errorDetail || `Failed to update commitment log (${response.status})`);
  }

  return response.json();
}

/**
 * Delete a commitment log.
 */
export async function deleteCommitmentLog(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/commitment-logs/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete commitment log (${response.status})`);
  }
}

/**
 * Toggle commitment completion for today.
 */
export async function logCommitmentToday(commitmentId: number, dateStr: string, completed: boolean = true): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/commitment-logs/`, {
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

/* =========================================================================
   Habits API
   ========================================================================= */

/**
 * Fetch all habits from Django backend.
 */
export async function getHabits(): Promise<Habit[]> {
  const response = await authFetch(`${API_BASE_URL}/habits/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load habits (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new habit.
 */
export async function createHabit(data: CreateHabitInput): Promise<Habit> {
  const payload = {
    ...data,
    category: data.category || null,
    active: data.active !== undefined ? data.active : true,
  };

  const response = await authFetch(`${API_BASE_URL}/habits/`, {
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
    throw new Error(errorDetail || `Failed to create habit (${response.status})`);
  }

  return response.json();
}

/**
 * Update an existing habit (partial update via PATCH).
 */
export async function updateHabit(id: number, data: UpdateHabitInput): Promise<Habit> {
  const payload: Record<string, unknown> = { ...data };
  if ('category' in data) {
    payload.category = data.category || null;
  }

  const response = await authFetch(`${API_BASE_URL}/habits/${id}/`, {
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
    throw new Error(errorDetail || `Failed to update habit (${response.status})`);
  }

  return response.json();
}

/**
 * Delete an existing habit.
 */
export async function deleteHabit(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/habits/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete habit (${response.status})`);
  }
}

/**
 * Fetch all habit logs.
 */
export async function getHabitLogs(): Promise<HabitLog[]> {
  const response = await authFetch(`${API_BASE_URL}/habit-logs/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load habit logs (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new habit log.
 */
export async function createHabitLog(data: {
  habit: number;
  date: string;
  completed?: boolean;
  completed_at?: string | null;
}): Promise<HabitLog> {
  const response = await authFetch(`${API_BASE_URL}/habit-logs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = Object.values(errJson).flat().join(', ');
    } catch {
      // ignore
    }
    throw new Error(errorDetail || `Failed to create habit log (${response.status})`);
  }

  return response.json();
}

/**
 * Update an existing habit log (partial update via PATCH).
 */
export async function updateHabitLog(
  id: number,
  data: {
    completed?: boolean;
    completed_at?: string | null;
  }
): Promise<HabitLog> {
  const response = await authFetch(`${API_BASE_URL}/habit-logs/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = Object.values(errJson).flat().join(', ');
    } catch {
      // ignore
    }
    throw new Error(errorDetail || `Failed to update habit log (${response.status})`);
  }

  return response.json();
}

/**
 * Delete a habit log.
 */
export async function deleteHabitLog(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/habit-logs/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete habit log (${response.status})`);
  }
}

/**
 * Toggle habit completion for today.
 */
export async function logHabitToday(habitId: number, dateStr: string, completed: boolean = true): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/habit-logs/`, {
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

/* =========================================================================
   Reminders API
   ========================================================================= */

/**
 * Fetch all reminders from Django backend.
 */
export async function getReminders(): Promise<Reminder[]> {
  const response = await authFetch(`${API_BASE_URL}/reminders/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load reminders (${response.status})`);
  }

  return response.json();
}

/**
 * Fetch a single reminder by ID.
 */
export async function getReminder(id: number): Promise<Reminder> {
  const response = await authFetch(`${API_BASE_URL}/reminders/${id}/`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load reminder (${response.status})`);
  }

  return response.json();
}

/**
 * Create a new reminder.
 */
export async function createReminder(data: CreateReminderInput): Promise<Reminder> {
  const payload = {
    ...data,
    category: data.category || null,
    reminder_date: data.reminder_date || null,
    description: data.description || '',
    repeat_type: data.repeat_type || 'ONCE',
    active: data.active !== undefined ? data.active : true,
  };

  const response = await authFetch(`${API_BASE_URL}/reminders/`, {
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
    throw new Error(errorDetail || `Failed to create reminder (${response.status})`);
  }

  return response.json();
}

/**
 * Update an existing reminder (partial update via PATCH).
 */
export async function updateReminder(id: number, data: UpdateReminderInput): Promise<Reminder> {
  const payload: Record<string, unknown> = { ...data };
  if ('category' in data) {
    payload.category = data.category || null;
  }
  if ('reminder_date' in data) {
    payload.reminder_date = data.reminder_date || null;
  }
  if ('description' in data) {
    payload.description = data.description || '';
  }

  const response = await authFetch(`${API_BASE_URL}/reminders/${id}/`, {
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
    throw new Error(errorDetail || `Failed to update reminder (${response.status})`);
  }

  return response.json();
}

/**
 * Delete an existing reminder.
 */
export async function deleteReminder(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/reminders/${id}/`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete reminder (${response.status})`);
  }
}

/* =========================================================================
   Dashboard & Helpers
   ========================================================================= */

/**
 * Fetch the latest dashboard overview from Django backend.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await authFetch(`${API_BASE_URL}/dashboard/`, {
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
  const response = await authFetch(`${API_BASE_URL}/tasks/${taskId}/`, {
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

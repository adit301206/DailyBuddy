export interface DashboardProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface DashboardCommitment {
  id: number;
  name: string;
  frequency: string;
  target_time: string | null;
  completed_today: boolean;
  current_streak: number;
  longest_streak: number;
}

export interface DashboardHabit {
  id: number;
  name: string;
  frequency: string;
  completed_today: boolean;
  current_streak: number;
  longest_streak: number;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DashboardTask {
  id: number;
  title: string;
  priority: TaskPriority | string;
  due_date: string | null;
  due_time: string | null;
  completed: boolean;
}

export interface DashboardReminder {
  id: number;
  title: string;
  description?: string;
  reminder_date: string | null;
  reminder_time: string | null;
  repeat_type: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM' | string;
}

export interface DashboardData {
  date: string;
  progress: DashboardProgress;
  commitments: DashboardCommitment[];
  habits: DashboardHabit[];
  tasks: DashboardTask[];
  upcoming_reminders: DashboardReminder[];
}

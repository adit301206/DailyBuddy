export type HabitFrequency = 'DAILY' | 'WEEKLY';

export interface Habit {
  id: number;
  name: string;
  category: number | null;
  category_name?: string | null;
  frequency: HabitFrequency;
  active: boolean;
  created_at: string;
}

export interface HabitLog {
  id: number;
  habit: number;
  habit_name?: string;
  date: string;
  completed: boolean;
  completed_at?: string | null;
}

export interface CreateHabitInput {
  name: string;
  category?: number | null;
  frequency: HabitFrequency;
  active?: boolean;
}

export interface UpdateHabitInput {
  name?: string;
  category?: number | null;
  frequency?: HabitFrequency;
  active?: boolean;
}

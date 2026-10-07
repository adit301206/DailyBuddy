export type ReminderRepeatType = 'ONCE' | 'DAILY' | 'WEEKLY';

export interface Reminder {
  id: number;
  title: string;
  description: string;
  category: number | null;
  category_name?: string;
  reminder_date: string | null;
  reminder_time: string;
  repeat_type: ReminderRepeatType;
  active: boolean;
  created_at: string;
}

export interface CreateReminderInput {
  title: string;
  description?: string;
  category?: number | null;
  reminder_date?: string | null;
  reminder_time: string;
  repeat_type?: ReminderRepeatType;
  active?: boolean;
}

export interface UpdateReminderInput {
  title?: string;
  description?: string;
  category?: number | null;
  reminder_date?: string | null;
  reminder_time?: string;
  repeat_type?: ReminderRepeatType;
  active?: boolean;
}

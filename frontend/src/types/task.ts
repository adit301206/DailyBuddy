export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  is_active: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: number | null;
  category_name?: string | null;
  priority: TaskPriority;
  due_date: string | null;
  due_time: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category?: number | null;
  priority?: TaskPriority;
  due_date?: string | null;
  due_time?: string | null;
  completed?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: number | null;
  priority?: TaskPriority;
  due_date?: string | null;
  due_time?: string | null;
  completed?: boolean;
}

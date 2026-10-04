import React from 'react';
import type { TaskFilterType } from './TaskFilterTabs';
import { CalendarCheck, CheckCircle2, Clock } from 'lucide-react';

interface TaskEmptyStateProps {
  filter: TaskFilterType;
  onCreateTask?: () => void;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
  filter,
  onCreateTask,
}) => {
  const config = {
    today: {
      icon: CalendarCheck,
      title: 'No tasks for today.',
      description: "You're clear for now.",
      actionText: '+ New Task',
    },
    upcoming: {
      icon: Clock,
      title: 'No upcoming tasks.',
      description: 'Nothing scheduled ahead yet.',
      actionText: '+ New Task',
    },
    completed: {
      icon: CheckCircle2,
      title: 'No completed tasks yet.',
      description: "Finish a task and it'll appear here.",
      actionText: undefined,
    },
  }[filter];

  const Icon = config.icon;

  return (
    <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40 space-y-3">
      <div
        style={{
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-text-secondary)',
        }}
        className="w-11 h-11 rounded-xl mx-auto flex items-center justify-center"
      >
        <Icon className="w-5 h-5 opacity-80" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {config.title}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
          {config.description}
        </p>
      </div>

      {config.actionText && onCreateTask && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onCreateTask}
            style={{ color: 'var(--color-primary)' }}
            className="text-xs font-semibold hover:underline cursor-pointer transition-colors"
          >
            {config.actionText}
          </button>
        </div>
      )}
    </div>
  );
};

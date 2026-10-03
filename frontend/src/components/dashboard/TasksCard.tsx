import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText, Metadata } from '../ui/Typography';
import { formatTimeString } from '../../lib/formatters';
import type { DashboardTask } from '../../types/dashboard';
import { Check, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TasksCardProps {
  tasks: DashboardTask[];
  onToggleTask?: (task: DashboardTask) => void;
}

export const TasksCard: React.FC<TasksCardProps> = ({ tasks, onToggleTask }) => {
  const getPriorityBadge = (priority: string) => {
    const p = priority.toUpperCase();
    if (p === 'HIGH') {
      return (
        <span
          style={{
            backgroundColor: 'var(--color-danger-soft)',
            color: 'var(--color-danger)',
            borderColor: 'var(--color-danger)',
          }}
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider border border-current/20 uppercase"
        >
          High
        </span>
      );
    }
    if (p === 'MEDIUM') {
      return (
        <span
          style={{
            backgroundColor: 'var(--color-warning-soft)',
            color: 'var(--color-warning)',
            borderColor: 'var(--color-warning)',
          }}
          className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider border border-current/20 uppercase"
        >
          Medium
        </span>
      );
    }
    return (
      <span
        style={{
          backgroundColor: 'var(--color-surface-secondary)',
          color: 'var(--color-text-secondary)',
          borderColor: 'var(--color-border)',
        }}
        className="px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider border uppercase"
      >
        Low
      </span>
    );
  };

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>Today's Tasks</span>
        </SectionTitle>

        {tasks.length > 0 && (
          <Metadata className="text-xs">
            {tasks.filter((t) => t.completed).length} of {tasks.length} done
          </Metadata>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="py-8 text-center space-y-1">
          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            No tasks for today.
          </p>
          <SecondaryText className="text-xs max-w-sm mx-auto">
            Enjoy the breathing room or add something when you need to.
          </SecondaryText>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {tasks.map((task) => {
            const isCompleted = task.completed;
            const dueTimeFormatted = formatTimeString(task.due_time);

            return (
              <div
                key={task.id}
                onClick={() => onToggleTask?.(task)}
                className={cn(
                  'group flex items-center justify-between py-3 px-3 -mx-3 rounded-lg transition-colors duration-150 cursor-pointer select-none',
                  isCompleted
                    ? 'hover:bg-[var(--color-surface-secondary)] opacity-70 hover:opacity-100'
                    : 'hover:bg-[var(--color-surface-secondary)]'
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleTask?.(task);
                  }
                }}
                aria-label={`Task: ${task.title}, ${isCompleted ? 'Completed' : 'Pending'}`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-5.5 h-5.5 rounded-md flex items-center justify-center transition-all duration-150 shrink-0',
                      isCompleted
                        ? 'bg-[var(--color-success)] text-white shadow-2xs'
                        : 'border border-[var(--color-border)] text-transparent group-hover:border-[var(--color-primary)]'
                    )}
                  >
                    <Check className={cn('w-3.5 h-3.5 stroke-[2.5]', isCompleted ? 'block' : 'hidden')} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-sm font-medium tracking-tight truncate transition-colors',
                        isCompleted
                          ? 'line-through text-[var(--color-text-secondary)] font-normal'
                          : 'text-[var(--color-text)]'
                      )}
                    >
                      {task.title}
                    </p>

                    {dueTimeFormatted && (
                      <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                        <Clock className="w-3 h-3" />
                        <span>{dueTimeFormatted}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Subtle Priority Tag */}
                <div className="ml-2 shrink-0">
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default TasksCard;

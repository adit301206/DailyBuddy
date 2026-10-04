import React, { useEffect, useRef, useState } from 'react';
import type { Task } from '../../types/task';
import { formatHumanDate, formatTimeString, getCategoryEmoji, getLocalTodayStr } from '../../lib/formatters';
import { Calendar, Check, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const isCompleted = task.completed;
  const todayStr = getLocalTodayStr();
  const isOverdue = !isCompleted && !!task.due_date && task.due_date < todayStr;
  const dueFormatted = formatHumanDate(task.due_date);
  const timeFormatted = formatTimeString(task.due_time);

  // Category with neutral fallback
  const categoryDisplay = task.category_name || 'Personal';
  const categoryEmoji = getCategoryEmoji(categoryDisplay);

  const getPriorityBadge = (priority: string) => {
    const p = (priority || 'MEDIUM').toUpperCase();
    if (p === 'HIGH') {
      return (
        <span
          style={{
            backgroundColor: 'var(--color-danger-soft)',
            color: 'var(--color-danger)',
            borderColor: 'var(--color-danger)',
          }}
          className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border border-current/20 uppercase shrink-0 select-none"
        >
          HIGH
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
          className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider border border-current/20 uppercase shrink-0 select-none"
        >
          MED
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
        className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider border uppercase shrink-0 select-none"
      >
        LOW
      </span>
    );
  };

  return (
    <div
      className={cn(
        'group relative flex items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150',
        isCompleted
          ? 'bg-[var(--color-surface)]/70 border-[var(--color-border)]/60 opacity-80 hover:opacity-100'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-secondary)]/20'
      )}
    >
      {/* Left: Completion Button & Content */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        {/* Completion Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={isCompleted ? `Mark '${task.title}' as incomplete` : `Mark '${task.title}' as complete`}
          onClick={() => onToggleComplete(task)}
          className={cn(
            'mt-0.5 sm:mt-0 w-5.5 h-5.5 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
            isCompleted
              ? 'bg-[var(--color-success)] text-white shadow-2xs hover:opacity-90'
              : 'border-2 border-[var(--color-border)] text-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]/40'
          )}
        >
          <Check className={cn('w-3.5 h-3.5 stroke-[2.5] transition-transform', isCompleted ? 'scale-100' : 'scale-0')} />
        </button>

        {/* Task Details */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={cn(
                'text-sm sm:text-base font-medium leading-snug transition-colors break-words',
                isCompleted
                  ? 'line-through text-[var(--color-text-secondary)] font-normal'
                  : 'text-[var(--color-text)]'
              )}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p
              className={cn(
                'text-xs line-clamp-1 break-words',
                isCompleted ? 'text-[var(--color-text-secondary)]/70' : 'text-[var(--color-text-secondary)]'
              )}
            >
              {task.description}
            </p>
          )}

          {/* Metadata Row: Category, Due Date/Time */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs text-[var(--color-text-secondary)] pt-0.5">
            {/* Category Tag */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[11px] font-medium text-[var(--color-text)]">
              {categoryEmoji && <span className="text-xs">{categoryEmoji}</span>}
              <span>{categoryDisplay}</span>
            </span>

            {/* Due Date & Time / Overdue Badge */}
            {isOverdue ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-[var(--color-danger)] bg-[var(--color-danger-soft)]">
                <span>⚠ Overdue</span>
                <span>·</span>
                <span>{dueFormatted}</span>
                {timeFormatted && (
                  <>
                    <span>·</span>
                    <span>{timeFormatted}</span>
                  </>
                )}
              </span>
            ) : task.due_date ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)]">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>{dueFormatted}</span>
                {timeFormatted && (
                  <>
                    <span>·</span>
                    <Clock className="w-3 h-3 shrink-0 ml-0.5" />
                    <span>{timeFormatted}</span>
                  </>
                )}
              </span>
            ) : timeFormatted ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)]">
                <Clock className="w-3 h-3 shrink-0" />
                <span>{timeFormatted}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)]/70">
                <span>No date</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Priority Badge & Action Menu */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5 sm:pt-0">
        {getPriorityBadge(task.priority)}

        {/* Action Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label={`Actions for ${task.title}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-36 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer text-left"
              >
                <Pencil className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors cursor-pointer text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import type { Category, CreateTaskInput, Task, TaskPriority } from '../../types/task';
import { Button } from '../ui/Button';
import { getCategoryEmoji, getLocalTodayStr } from '../../lib/formatters';
import { AlertCircle, Calendar, Clock, Tag, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => Promise<void>;
  initialTask?: Task | null;
  categories: Category[];
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState<string>('');
  const [dueTime, setDueTime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync initial task values on open / change
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title || '');
        setDescription(initialTask.description || '');
        setCategoryId(initialTask.category);
        setPriority(initialTask.priority || 'MEDIUM');
        setDueDate(initialTask.due_date || '');
        // Due time might be HH:MM:SS from API, truncate to HH:MM for time input
        setDueTime(initialTask.due_time ? initialTask.due_time.substring(0, 5) : '');
      } else {
        setTitle('');
        setDescription('');
        setCategoryId(null);
        setPriority('MEDIUM');
        setDueDate(getLocalTodayStr());
        setDueTime('');
      }
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen, initialTask]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
        category: categoryId || null,
        priority,
        due_date: dueDate || null,
        due_time: dueTime ? (dueTime.length === 5 ? `${dueTime}:00` : dueTime) : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetQuickDate = (type: 'today' | 'tomorrow' | 'clear') => {
    if (type === 'clear') {
      setDueDate('');
      return;
    }
    const now = new Date();
    if (type === 'tomorrow') {
      now.setDate(now.getDate() + 1);
    }
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setDueDate(`${year}-${month}-${day}`);
  };

  const isEditing = !!initialTask;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-dialog-title"
    >
      <div className="w-full sm:max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 id="task-dialog-title" className="text-base sm:text-lg font-semibold text-[var(--color-text)]">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">
            {/* Inline Error Notice */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--color-danger-soft)] text-[var(--color-danger)] text-xs border border-[var(--color-danger)]/20">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Title Input */}
            <div className="space-y-1.5">
              <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Title <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g., Finish DailyBuddy frontend"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/60 focus:border-[var(--color-primary)] focus:outline-none transition-colors"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-1.5">
              <label htmlFor="task-description" className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Description <span className="font-normal text-[10px] text-[var(--color-text-secondary)]/70">(Optional)</span>
              </label>
              <textarea
                id="task-description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, links, or notes..."
                className="w-full px-3.5 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/60 focus:border-[var(--color-primary)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Category and Priority row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="task-category" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Category</span>
                </label>
                <select
                  id="task-category"
                  value={categoryId ?? ''}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => {
                    const emoji = getCategoryEmoji(cat.name, cat.icon);
                    return (
                      <option key={cat.id} value={cat.id}>
                        {emoji ? `${emoji} ${cat.name}` : cat.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50">
                  {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => {
                    const isSelected = priority === p;
                    const label = p === 'LOW' ? 'Low' : p === 'MEDIUM' ? 'Medium' : 'High';
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          'py-1 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer text-center select-none',
                          isSelected
                            ? 'bg-[var(--color-surface)] shadow-2xs font-semibold'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                        )}
                        style={
                          isSelected
                            ? p === 'HIGH'
                              ? { color: 'var(--color-danger)' }
                              : p === 'MEDIUM'
                              ? { color: 'var(--color-warning)' }
                              : { color: 'var(--color-primary)' }
                            : undefined
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Due Date & Time */}
            <div className="space-y-2 pt-1 border-t border-[var(--color-border)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due Date */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="task-due-date" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due Date</span>
                    </label>
                  </div>
                  <input
                    id="task-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                  />
                  {/* Quick helpers */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSetQuickDate('today')}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetQuickDate('tomorrow')}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                    >
                      Tomorrow
                    </button>
                    {dueDate && (
                      <button
                        type="button"
                        onClick={() => handleSetQuickDate('clear')}
                        className="px-2 py-0.5 rounded text-[11px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors cursor-pointer ml-auto"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Due Time */}
                <div className="space-y-1.5">
                  <label htmlFor="task-due-time" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due Time</span>
                  </label>
                  <input
                    id="task-due-time"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                  />
                  {dueTime && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setDueTime('')}
                        className="px-2 py-0.5 rounded text-[11px] font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors cursor-pointer"
                      >
                        Clear Time
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={submitting}
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

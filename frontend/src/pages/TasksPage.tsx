import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, getCategories, getTasks, updateTask } from '../lib/api';
import type { Category, CreateTaskInput, Task } from '../types/task';
import { getLocalTodayStr } from '../lib/formatters';
import { TaskFilterTabs, type TaskFilterType } from '../components/tasks/TaskFilterTabs';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { DeleteConfirmDialog } from '../components/tasks/DeleteConfirmDialog';
import { TaskEmptyState } from '../components/tasks/TaskEmptyState';
import { TaskSkeleton } from '../components/tasks/TaskSkeleton';
import { Toast, type ToastInfo } from '../components/tasks/Toast';
import { Button } from '../components/ui/Button';
import { PageTitle, SecondaryText } from '../components/ui/Typography';
import { AlertCircle, Plus, RotateCw } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeFilter, setActiveFilter] = useState<TaskFilterType>('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and Dialog States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      message,
    });
  };

  // Fetch initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        getTasks(),
        getCategories(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sorting & Filtering logic
  const todayStr = getLocalTodayStr();

  const counts = useMemo(() => {
    let todayCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;

    tasks.forEach((task) => {
      if (task.completed) {
        completedCount++;
      } else if (!task.due_date || task.due_date === todayStr) {
        // Today: active tasks whose due_date === today or have no due_date
        todayCount++;
      } else if (task.due_date > todayStr) {
        // Upcoming: active tasks whose due_date is later than today
        upcomingCount++;
      }
      // Overdue active tasks (due_date < todayStr) are not counted in Today or Upcoming tab
    });

    return {
      today: todayCount,
      upcoming: upcomingCount,
      completed: completedCount,
    };
  }, [tasks, todayStr]);

  // Group 1: Overdue active tasks (due_date < today)
  const overdueTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.due_date && t.due_date < todayStr)
      .sort((a, b) => {
        // 1. Due date ascending (oldest overdue first)
        const dateDiff = (a.due_date || '').localeCompare(b.due_date || '');
        if (dateDiff !== 0) return dateDiff;

        // 2. Due time
        const timeA = a.due_time || '23:59:59';
        const timeB = b.due_time || '23:59:59';
        const timeDiff = timeA.localeCompare(timeB);
        if (timeDiff !== 0) return timeDiff;

        // 3. Created time
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  }, [tasks, todayStr]);

  // Group 2: Due today active tasks (due_date === today)
  const dueTodayTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.due_date === todayStr)
      .sort((a, b) => {
        // 1. Due time ascending
        const timeA = a.due_time || '23:59:59';
        const timeB = b.due_time || '23:59:59';
        const timeDiff = timeA.localeCompare(timeB);
        if (timeDiff !== 0) return timeDiff;

        // 2. Created time
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  }, [tasks, todayStr]);

  // Group 3: No date active tasks (!due_date)
  const noDateTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && !t.due_date)
      .sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  }, [tasks]);

  // Upcoming active tasks (due_date > today)
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.due_date && t.due_date > todayStr)
      .sort((a, b) => {
        // 1. Due date ascending
        const dateDiff = (a.due_date || '').localeCompare(b.due_date || '');
        if (dateDiff !== 0) return dateDiff;

        // 2. Due time ascending
        const timeA = a.due_time || '23:59:59';
        const timeB = b.due_time || '23:59:59';
        const timeDiff = timeA.localeCompare(timeB);
        if (timeDiff !== 0) return timeDiff;

        // 3. Created time
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
  }, [tasks, todayStr]);

  // Completed tasks (all completed tasks, sorted most recent update/create first)
  const completedTasks = useMemo(() => {
    return tasks
      .filter((t) => t.completed)
      .sort((a, b) => {
        return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
      });
  }, [tasks]);

  // Complete / Uncomplete toggle with optimistic UI
  const handleToggleComplete = async (task: Task) => {
    const nextCompleted = !task.completed;

    // 1. Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
    );
    showToast('success', nextCompleted ? 'Task completed' : 'Task reopened');

    // 2. Send PATCH request to backend
    try {
      const updated = await updateTask(task.id, { completed: nextCompleted });
      // Sync authoritative backend result
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      // Revert optimistic update on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !nextCompleted } : t))
      );
      showToast('error', "Couldn't update task");
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  // Save Task (Create or Edit)
  const handleSaveTask = async (data: CreateTaskInput) => {
    if (editingTask) {
      // Edit existing
      const updated = await updateTask(editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      showToast('success', 'Task updated');
    } else {
      // Create new
      const created = await createTask(data);
      setTasks((prev) => [created, ...prev]);
      showToast('success', 'Task created');
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDelete = (task: Task) => {
    setDeletingTask(task);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      showToast('success', 'Task deleted');
      setDeletingTask(null);
    } catch (err) {
      showToast('error', "Couldn't delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <PageTitle>Tasks</PageTitle>
          <SecondaryText className="text-sm">
            Manage what needs to get done.
          </SecondaryText>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          New Task
        </Button>
      </div>

      {/* 2. Filter Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <TaskFilterTabs
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* 3. Main Task Content Area */}
      <div id={`task-panel-${activeFilter}`} role="tabpanel" aria-labelledby={`task-tab-${activeFilter}`}>
        {loading && <TaskSkeleton />}

        {!loading && error && (
          <div className="py-12 px-6 text-center space-y-4 rounded-2xl border border-[var(--color-danger)]/20 bg-[var(--color-danger-soft)]/30">
            <div
              style={{
                backgroundColor: 'var(--color-danger-soft)',
                color: 'var(--color-danger)',
              }}
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
            >
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[var(--color-text)]">
                Couldn't load your tasks.
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Check that the DailyBuddy backend is running.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<RotateCw className="w-4 h-4" />}
              onClick={loadData}
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && activeFilter === 'today' && (
          <>
            {overdueTasks.length === 0 && dueTodayTasks.length === 0 && noDateTasks.length === 0 ? (
              <TaskEmptyState
                filter="today"
                onCreateTask={handleOpenCreate}
              />
            ) : (
              <div className="space-y-6">
                {/* OVERDUE Section */}
                {overdueTasks.length > 0 && (
                  <section aria-label="Overdue Tasks" className="space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[var(--color-border)]/60">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-danger)] flex items-center gap-1.5">
                        <span>OVERDUE</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[var(--color-danger-soft)] text-[var(--color-danger)]">
                          {overdueTasks.length}
                        </span>
                      </h3>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">
                        Past due
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {overdueTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onEdit={handleOpenEdit}
                          onDelete={handleOpenDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* TODAY Section */}
                {dueTodayTasks.length > 0 && (
                  <section aria-label="Today's Tasks" className="space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[var(--color-border)]/60">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-secondary)] flex items-center gap-1.5">
                        <span>TODAY</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]">
                          {dueTodayTasks.length}
                        </span>
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {dueTodayTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onEdit={handleOpenEdit}
                          onDelete={handleOpenDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* NO DATE Section */}
                {noDateTasks.length > 0 && (
                  <section aria-label="Tasks with No Due Date" className="space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[var(--color-border)]/60">
                      <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-secondary)] flex items-center gap-1.5">
                        <span>NO DATE</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]">
                          {noDateTasks.length}
                        </span>
                      </h3>
                    </div>

                    <div className="space-y-2.5">
                      {noDateTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onEdit={handleOpenEdit}
                          onDelete={handleOpenDelete}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}

        {!loading && !error && activeFilter === 'upcoming' && (
          <>
            {upcomingTasks.length === 0 ? (
              <TaskEmptyState
                filter="upcoming"
                onCreateTask={handleOpenCreate}
              />
            ) : (
              <div className="space-y-2.5">
                {upcomingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !error && activeFilter === 'completed' && (
          <>
            {completedTasks.length === 0 ? (
              <TaskEmptyState filter="completed" />
            ) : (
              <div className="space-y-2.5">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Feedback Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default TasksPage;

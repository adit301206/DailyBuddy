import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createReminder,
  deleteReminder,
  getCategories,
  getReminders,
  updateReminder,
} from '../lib/api';
import type { CreateReminderInput, Reminder } from '../types/reminder';
import type { Category } from '../types/task';
import { getLocalTodayStr } from '../lib/formatters';
import { ReminderFilterTabs, type ReminderFilterType } from '../components/reminders/ReminderFilterTabs';
import { ReminderItem } from '../components/reminders/ReminderItem';
import { ReminderFormModal } from '../components/reminders/ReminderFormModal';
import { ReminderDeleteDialog } from '../components/reminders/ReminderDeleteDialog';
import { ReminderDetailDrawer } from '../components/reminders/ReminderDetailDrawer';
import { ReminderEmptyState } from '../components/reminders/ReminderEmptyState';
import { ReminderSkeleton } from '../components/reminders/ReminderSkeleton';
import { Toast, type ToastInfo } from '../components/tasks/Toast';
import { Button } from '../components/ui/Button';
import { PageTitle, SecondaryText } from '../components/ui/Typography';
import { AlertCircle, Bell, Calendar, Clock, Plus, Repeat, RotateCw } from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeFilter, setActiveFilter] = useState<ReminderFilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and Dialog States
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(null);
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

  // Fetch reminders and categories
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [remindersData, categoriesData] = await Promise.all([
        getReminders(),
        getCategories(),
      ]);
      setReminders(remindersData);
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

  const todayStr = getLocalTodayStr();

  // Tomorrow date string
  const tomorrowStr = useMemo(() => {
    const now = new Date();
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const year = t.getFullYear();
    const month = String(t.getMonth() + 1).padStart(2, '0');
    const day = String(t.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Filter categorization
  const activeReminders = useMemo(() => {
    return reminders.filter((r) => r.active);
  }, [reminders]);

  const inactiveReminders = useMemo(() => {
    return reminders.filter((r) => !r.active);
  }, [reminders]);

  const todayReminders = useMemo(() => {
    return activeReminders.filter((r) => {
      if (r.repeat_type === 'DAILY') return true;
      if (r.repeat_type === 'ONCE' && r.reminder_date === todayStr) return true;
      if (r.repeat_type === 'WEEKLY' && r.reminder_date) {
        // Check if weekly reminder corresponds to today's day-of-week
        const targetDate = new Date(r.reminder_date);
        const todayDate = new Date();
        return targetDate.getDay() === todayDate.getDay();
      }
      return false;
    });
  }, [activeReminders, todayStr]);

  const upcomingReminders = useMemo(() => {
    return activeReminders.filter((r) => {
      if (r.repeat_type === 'ONCE' && r.reminder_date && r.reminder_date >= tomorrowStr) {
        return true;
      }
      if (r.repeat_type === 'WEEKLY') {
        return true;
      }
      return false;
    });
  }, [activeReminders, tomorrowStr]);

  const repeatingReminders = useMemo(() => {
    return activeReminders.filter((r) => r.repeat_type === 'DAILY' || r.repeat_type === 'WEEKLY');
  }, [activeReminders]);

  const counts = useMemo(() => {
    return {
      all: reminders.length,
      today: todayReminders.length,
      upcoming: upcomingReminders.length,
      repeating: repeatingReminders.length,
      inactive: inactiveReminders.length,
    };
  }, [
    reminders.length,
    todayReminders.length,
    upcomingReminders.length,
    repeatingReminders.length,
    inactiveReminders.length,
  ]);

  // Grouped reminders for "All" view
  const groupedAll = useMemo(() => {
    const todayList: Reminder[] = [];
    const tomorrowList: Reminder[] = [];
    const upcomingList: Reminder[] = [];
    const repeatingList: Reminder[] = [];
    const pastOrOtherList: Reminder[] = [];

    activeReminders.forEach((r) => {
      if (r.repeat_type === 'DAILY') {
        todayList.push(r);
        return;
      }

      if (r.repeat_type === 'WEEKLY') {
        repeatingList.push(r);
        return;
      }

      // ONCE
      if (r.reminder_date === todayStr) {
        todayList.push(r);
      } else if (r.reminder_date === tomorrowStr) {
        tomorrowList.push(r);
      } else if (r.reminder_date && r.reminder_date > tomorrowStr) {
        upcomingList.push(r);
      } else {
        pastOrOtherList.push(r);
      }
    });

    // Sort function by time
    const sortByTime = (a: Reminder, b: Reminder) => {
      const dateCompare = (a.reminder_date || '').localeCompare(b.reminder_date || '');
      if (dateCompare !== 0) return dateCompare;
      return (a.reminder_time || '').localeCompare(b.reminder_time || '');
    };

    return {
      today: todayList.sort(sortByTime),
      tomorrow: tomorrowList.sort(sortByTime),
      upcoming: upcomingList.sort(sortByTime),
      repeating: repeatingList.sort(sortByTime),
      pastOrOther: pastOrOtherList.sort(sortByTime),
      inactive: inactiveReminders.sort(sortByTime),
    };
  }, [activeReminders, inactiveReminders, todayStr, tomorrowStr]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingReminder(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsFormModalOpen(true);
  };

  // Save Reminder (Create or Edit)
  const handleSaveReminder = async (data: CreateReminderInput) => {
    if (editingReminder) {
      // Edit existing
      const updated = await updateReminder(editingReminder.id, data);
      setReminders((prev) => prev.map((r) => (r.id === editingReminder.id ? updated : r)));
      if (selectedReminder && selectedReminder.id === editingReminder.id) {
        setSelectedReminder(updated);
      }
      showToast('success', 'Reminder updated');
    } else {
      // Create new
      const created = await createReminder(data);
      setReminders((prev) => [...prev, created]);
      showToast('success', 'Reminder created');
    }
  };

  // Activate / Deactivate Toggle
  const handleToggleActive = async (reminder: Reminder) => {
    const nextActive = !reminder.active;
    try {
      const updated = await updateReminder(reminder.id, { active: nextActive });
      setReminders((prev) => prev.map((r) => (r.id === reminder.id ? updated : r)));
      if (selectedReminder && selectedReminder.id === reminder.id) {
        setSelectedReminder(updated);
      }
      showToast('success', nextActive ? 'Reminder activated' : 'Reminder deactivated');
    } catch (err) {
      showToast('error', "Couldn't update reminder");
    }
  };

  // Open Delete Confirmation Dialog
  const handleOpenDelete = (reminder: Reminder) => {
    setDeletingReminder(reminder);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingReminder) return;
    setIsDeleting(true);
    try {
      await deleteReminder(deletingReminder.id);
      setReminders((prev) => prev.filter((r) => r.id !== deletingReminder.id));
      if (selectedReminder && selectedReminder.id === deletingReminder.id) {
        setSelectedReminder(null);
      }
      showToast('success', 'Reminder deleted');
      setDeletingReminder(null);
    } catch (err) {
      showToast('error', "Couldn't delete reminder");
    } finally {
      setIsDeleting(false);
    }
  };

  // Render list depending on active filter
  const renderFilterList = () => {
    if (activeFilter === 'today') {
      if (todayReminders.length === 0) {
        return <ReminderEmptyState filter="today" onCreateReminder={handleOpenCreate} />;
      }
      return (
        <div className="space-y-2.5">
          {todayReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onSelect={(r) => setSelectedReminder(r)}
              onEdit={handleOpenEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      );
    }

    if (activeFilter === 'upcoming') {
      if (upcomingReminders.length === 0) {
        return <ReminderEmptyState filter="upcoming" onCreateReminder={handleOpenCreate} />;
      }
      return (
        <div className="space-y-2.5">
          {upcomingReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onSelect={(r) => setSelectedReminder(r)}
              onEdit={handleOpenEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      );
    }

    if (activeFilter === 'repeating') {
      if (repeatingReminders.length === 0) {
        return <ReminderEmptyState filter="repeating" onCreateReminder={handleOpenCreate} />;
      }
      return (
        <div className="space-y-2.5">
          {repeatingReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onSelect={(r) => setSelectedReminder(r)}
              onEdit={handleOpenEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      );
    }

    if (activeFilter === 'inactive') {
      if (inactiveReminders.length === 0) {
        return <ReminderEmptyState filter="inactive" onCreateReminder={handleOpenCreate} />;
      }
      return (
        <div className="space-y-2.5">
          {inactiveReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onSelect={(r) => setSelectedReminder(r)}
              onEdit={handleOpenEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      );
    }

    // Default: 'all' with structured date-based grouping
    if (reminders.length === 0) {
      return <ReminderEmptyState filter="all" onCreateReminder={handleOpenCreate} />;
    }

    const { today, tomorrow, upcoming, repeating, pastOrOther, inactive } = groupedAll;
    const hasAnyActive =
      today.length > 0 ||
      tomorrow.length > 0 ||
      upcoming.length > 0 ||
      repeating.length > 0 ||
      pastOrOther.length > 0;

    return (
      <div className="space-y-6">
        {/* 1. Today Group */}
        {today.length > 0 && (
          <section aria-labelledby="heading-today" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2
                id="heading-today"
                className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Today</span>
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                {today.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {today.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onSelect={(r) => setSelectedReminder(r)}
                  onEdit={handleOpenEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* 2. Tomorrow Group */}
        {tomorrow.length > 0 && (
          <section aria-labelledby="heading-tomorrow" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2
                id="heading-tomorrow"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Tomorrow</span>
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]">
                {tomorrow.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {tomorrow.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onSelect={(r) => setSelectedReminder(r)}
                  onEdit={handleOpenEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* 3. Upcoming Later Dates */}
        {upcoming.length > 0 && (
          <section aria-labelledby="heading-upcoming" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2
                id="heading-upcoming"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Upcoming</span>
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]">
                {upcoming.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {upcoming.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onSelect={(r) => setSelectedReminder(r)}
                  onEdit={handleOpenEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. Repeating Routines */}
        {repeating.length > 0 && (
          <section aria-labelledby="heading-repeating" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2
                id="heading-repeating"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Weekly & Routines</span>
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]">
                {repeating.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {repeating.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onSelect={(r) => setSelectedReminder(r)}
                  onEdit={handleOpenEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. Past / Other Active */}
        {pastOrOther.length > 0 && (
          <section aria-labelledby="heading-past" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2
                id="heading-past"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Past / No Date</span>
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]">
                {pastOrOther.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {pastOrOther.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onSelect={(r) => setSelectedReminder(r)}
                  onEdit={handleOpenEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* Inactive Section if no active items or in all list */}
        {!hasAnyActive && inactive.length > 0 && (
          <section aria-labelledby="heading-inactive" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2
                id="heading-inactive"
                className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Inactive Reminders</span>
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]">
                {inactive.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {inactive.map((reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onSelect={(r) => setSelectedReminder(r)}
                  onEdit={handleOpenEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* 1. Page Header */}
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <PageTitle>Reminders</PageTitle>
          <SecondaryText className="text-sm">
            Timely alerts, nudge schedules, and daily routines.
          </SecondaryText>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          New Reminder
        </Button>
      </div>

      {/* 2. Filter Navigation Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <ReminderFilterTabs
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
        />
      </div>

      {/* 3. Main Reminders Content Area */}
      <div
        id={`reminder-panel-${activeFilter}`}
        role="tabpanel"
        aria-labelledby={`reminder-tab-${activeFilter}`}
      >
        {loading && <ReminderSkeleton />}

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
                Couldn't load your reminders.
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

        {!loading && !error && renderFilterList()}
      </div>

      {/* Reminder Detail Drawer */}
      <ReminderDetailDrawer
        isOpen={!!selectedReminder}
        reminder={selectedReminder}
        onClose={() => setSelectedReminder(null)}
        onEdit={handleOpenEdit}
        onToggleActive={handleToggleActive}
        onDelete={handleOpenDelete}
      />

      {/* Create / Edit Modal */}
      <ReminderFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingReminder(null);
        }}
        onSubmit={handleSaveReminder}
        initialReminder={editingReminder}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <ReminderDeleteDialog
        isOpen={!!deletingReminder}
        reminder={deletingReminder}
        onClose={() => setDeletingReminder(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Feedback Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default RemindersPage;

import React from 'react';
import { Bell, BellOff, Calendar, Plus, Repeat } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ReminderFilterType } from './ReminderFilterTabs';

interface ReminderEmptyStateProps {
  filter: ReminderFilterType;
  onCreateReminder?: () => void;
}

export const ReminderEmptyState: React.FC<ReminderEmptyStateProps> = ({
  filter,
  onCreateReminder,
}) => {
  const getContent = () => {
    switch (filter) {
      case 'today':
        return {
          icon: Calendar,
          title: 'No reminders for today',
          description: 'You’re all caught up for today. Add a new reminder or relax.',
          showButton: true,
        };
      case 'upcoming':
        return {
          icon: Calendar,
          title: 'No upcoming reminders',
          description: 'You have no scheduled reminders coming up in the future.',
          showButton: true,
        };
      case 'repeating':
        return {
          icon: Repeat,
          title: 'No recurring reminders',
          description: 'Set up daily or weekly recurring reminders for medicine, standups, or routines.',
          showButton: true,
        };
      case 'inactive':
        return {
          icon: BellOff,
          title: 'No inactive reminders',
          description: 'Deactivated reminders will be kept here when turned off.',
          showButton: false,
        };
      case 'all':
      default:
        return {
          icon: Bell,
          title: 'No reminders yet',
          description: 'Stay on schedule with time-based alerts and timely nudges.',
          showButton: true,
        };
    }
  };

  const { icon: Icon, title, description, showButton } = getContent();

  return (
    <div className="py-14 px-6 text-center space-y-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40">
      <div
        style={{
          backgroundColor: 'var(--color-primary-soft)',
          color: 'var(--color-primary)',
        }}
        className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          {title}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {showButton && onCreateReminder && (
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onCreateReminder}
        >
          New Reminder
        </Button>
      )}
    </div>
  );
};

import React from 'react';
import { Plus, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface HabitEmptyStateProps {
  filter: 'active' | 'inactive';
  onCreateHabit?: () => void;
}

export const HabitEmptyState: React.FC<HabitEmptyStateProps> = ({
  filter,
  onCreateHabit,
}) => {
  const isActive = filter === 'active';

  return (
    <div className="py-14 px-6 text-center space-y-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40">
      <div
        style={{
          backgroundColor: 'var(--color-primary-soft)',
          color: 'var(--color-primary)',
        }}
        className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
      >
        <RotateCw className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          {isActive ? 'No active habits.' : 'No inactive habits.'}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
          {isActive
            ? 'Build routines by adding your first daily or weekly habit.'
            : 'Deactivated habits will appear here.'}
        </p>
      </div>

      {isActive && onCreateHabit && (
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onCreateHabit}
        >
          New Habit
        </Button>
      )}
    </div>
  );
};

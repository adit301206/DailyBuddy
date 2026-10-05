import React from 'react';
import { Flame, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface CommitmentEmptyStateProps {
  filter: 'active' | 'inactive';
  onCreateCommitment?: () => void;
}

export const CommitmentEmptyState: React.FC<CommitmentEmptyStateProps> = ({
  filter,
  onCreateCommitment,
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
        <Flame className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          {isActive ? 'No active commitments.' : 'No inactive commitments.'}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
          {isActive
            ? 'Add something you want to consistently keep.'
            : 'Deactivated commitments will appear here.'}
        </p>
      </div>

      {isActive && onCreateCommitment && (
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onCreateCommitment}
        >
          New Commitment
        </Button>
      )}
    </div>
  );
};

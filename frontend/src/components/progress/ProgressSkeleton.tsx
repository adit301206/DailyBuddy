import React from 'react';
import { Card } from '../ui/Card';

export const ProgressSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-pulse" aria-busy="true" aria-label="Loading progress data">
      {/* Header Skeleton */}
      <div className="space-y-2 pb-2 border-b border-[var(--color-border)]">
        <div className="h-5 w-24 bg-[var(--color-surface-secondary)] rounded-full" />
        <div className="h-8 w-64 bg-[var(--color-surface-secondary)] rounded-lg" />
        <div className="h-4 w-96 max-w-full bg-[var(--color-surface-secondary)] rounded" />
      </div>

      {/* Overall Progress Banner Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-20 h-20 rounded-full bg-[var(--color-surface-secondary)] shrink-0" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-[var(--color-surface-secondary)] rounded" />
              <div className="h-4 w-32 bg-[var(--color-surface-secondary)] rounded" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <div className="h-16 w-24 bg-[var(--color-surface-secondary)] rounded-xl" />
            <div className="h-16 w-24 bg-[var(--color-surface-secondary)] rounded-xl" />
            <div className="h-16 w-24 bg-[var(--color-surface-secondary)] rounded-xl" />
          </div>
        </div>
      </Card>

      {/* Weekly Matrix Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="h-6 w-52 bg-[var(--color-surface-secondary)] rounded" />
        <div className="h-28 w-full bg-[var(--color-surface-secondary)] rounded-xl" />
      </Card>

      {/* 2-Column Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 h-56 bg-[var(--color-surface)]">
          <div className="h-full w-full bg-[var(--color-surface-secondary)]/50 rounded-lg" />
        </Card>
        <Card className="p-6 h-56 bg-[var(--color-surface)]">
          <div className="h-full w-full bg-[var(--color-surface-secondary)]/50 rounded-lg" />
        </Card>
        <Card className="p-6 h-56 bg-[var(--color-surface)]">
          <div className="h-full w-full bg-[var(--color-surface-secondary)]/50 rounded-lg" />
        </Card>
        <Card className="p-6 h-56 bg-[var(--color-surface)]">
          <div className="h-full w-full bg-[var(--color-surface-secondary)]/50 rounded-lg" />
        </Card>
      </div>
    </div>
  );
};

export default ProgressSkeleton;

import React, { useEffect, useRef, useState } from 'react';
import type { Commitment } from '../../types/commitment';
import { formatTimeString, getCategoryEmoji, getItemIcon } from '../../lib/formatters';
import { Check, Flame, MoreVertical, Pencil, Power, RotateCcw, Trash2, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CommitmentItemProps {
  commitment: Commitment;
  isCompletedToday: boolean;
  currentStreak: number;
  longestStreak: number;
  onSelect?: (commitment: Commitment) => void;
  onToggleComplete?: (commitment: Commitment) => void;
  onEdit: (commitment: Commitment) => void;
  onToggleActive: (commitment: Commitment) => void;
  onDelete: (commitment: Commitment) => void;
}

export const CommitmentItem: React.FC<CommitmentItemProps> = ({
  commitment,
  isCompletedToday,
  currentStreak,
  longestStreak,
  onSelect,
  onToggleComplete,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside or escape
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

  const isActive = commitment.active;
  const targetTimeFormatted = formatTimeString(commitment.target_time);
  const frequencyLabel = commitment.frequency === 'WEEKLY' ? 'Weekly' : 'Daily';

  // Category emoji and icon
  const categoryName = commitment.category_name || 'Personal';
  const categoryEmoji = getCategoryEmoji(categoryName);
  const FallbackIcon = getItemIcon(commitment.name);

  return (
    <div
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={`View details for ${commitment.name}`}
      onClick={() => onSelect?.(commitment)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          // If the active element is a nested button, don't trigger row click
          if ((e.target as HTMLElement).tagName === 'BUTTON') return;
          e.preventDefault();
          onSelect(commitment);
        }
      }}
      className={cn(
        'group relative flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150',
        onSelect && 'cursor-pointer hover:shadow-xs',
        !isActive
          ? 'bg-[var(--color-surface)]/60 border-[var(--color-border)]/60 opacity-75 hover:opacity-90'
          : isCompletedToday
          ? 'bg-[var(--color-surface)]/80 border-[var(--color-border)] hover:border-[var(--color-primary)]/40'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-secondary)]/20'
      )}
    >
      {/* Left: Icon & Commitment Details */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Category Icon Badge */}
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base transition-colors select-none',
            isCompletedToday && isActive
              ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
              : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]'
          )}
          aria-hidden="true"
        >
          {categoryEmoji ? (
            <span className="text-lg leading-none">{categoryEmoji}</span>
          ) : (
            <FallbackIcon className="w-5 h-5" />
          )}
        </div>

        {/* Info Column */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={cn(
                'text-sm sm:text-base font-semibold tracking-tight transition-colors break-words',
                !isActive
                  ? 'text-[var(--color-text-secondary)] font-medium'
                  : isCompletedToday
                  ? 'text-[var(--color-text)]'
                  : 'text-[var(--color-text)]'
              )}
            >
              {commitment.name}
            </h3>

            {!isActive && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] uppercase select-none">
                Inactive
              </span>
            )}
          </div>

          {/* Subtitle: Frequency · Target Time · Streaks */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs text-[var(--color-text-secondary)]">
            {/* Frequency and Target Time */}
            <span className="inline-flex items-center gap-1 font-medium text-[var(--color-text)]">
              <span>{frequencyLabel}</span>
              {targetTimeFormatted && (
                <>
                  <span className="text-[var(--color-border)]">·</span>
                  <span className="text-[var(--color-text-secondary)] font-normal">{targetTimeFormatted}</span>
                </>
              )}
            </span>

            {/* Streak metrics */}
            <span className="text-[var(--color-border)]">·</span>
            <div className="inline-flex items-center gap-2">
              {currentStreak > 0 ? (
                <span
                  style={{ color: 'var(--color-warning)' }}
                  className="font-medium inline-flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
                </span>
              ) : (
                <span className="text-[var(--color-text-secondary)]">
                  No current streak
                </span>
              )}

              {longestStreak > 0 && (
                <span
                  className="text-[var(--color-text-secondary)] inline-flex items-center gap-1 hidden sm:inline-flex"
                  title={`Best streak: ${longestStreak} days`}
                >
                  <Trophy className="w-3 h-3 text-[var(--color-warning)]" />
                  <span>Best {longestStreak} {longestStreak === 1 ? 'day' : 'days'}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Completion Control & Action Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Active Completion Control */}
        {isActive && onToggleComplete && (
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompletedToday}
            aria-label={isCompletedToday ? `Mark '${commitment.name}' as incomplete today` : `Mark '${commitment.name}' as completed today`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(commitment);
            }}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              isCompletedToday
                ? 'bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]/30 hover:opacity-90'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)]/50'
            )}
          >
            <div
              className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0',
                isCompletedToday
                  ? 'bg-[var(--color-success)] text-white'
                  : 'border border-[var(--color-border)] group-hover:border-[var(--color-primary)]'
              )}
            >
              <Check className={cn('w-2.5 h-2.5 stroke-[3]', isCompletedToday ? 'block' : 'hidden')} />
            </div>
            <span className="hidden sm:inline">
              {isCompletedToday ? 'Completed today' : 'Complete today'}
            </span>
          </button>
        )}

        {/* Action Menu Dropdown */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label={`Actions for ${commitment.name}`}
            aria-expanded={menuOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1 w-40 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(commitment);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer text-left"
              >
                <Pencil className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onToggleActive(commitment);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer text-left"
              >
                {isActive ? (
                  <>
                    <Power className="w-3.5 h-3.5 text-[var(--color-warning)]" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>Reactivate</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-[var(--color-border)]" />

              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(commitment);
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


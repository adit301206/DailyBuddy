import React, { useEffect, useRef, useState } from 'react';
import type { Reminder } from '../../types/reminder';
import { formatReminderSchedule, getCategoryEmoji, getItemIcon } from '../../lib/formatters';
import { Bell, Clock, MoreVertical, Pencil, Power, Repeat, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReminderItemProps {
  reminder: Reminder;
  onSelect?: (reminder: Reminder) => void;
  onEdit: (reminder: Reminder) => void;
  onToggleActive: (reminder: Reminder) => void;
  onDelete: (reminder: Reminder) => void;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  onSelect,
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

  const isActive = reminder.active;
  const categoryName = reminder.category_name || 'Personal';
  const categoryEmoji = getCategoryEmoji(categoryName);
  const FallbackIcon = getItemIcon(reminder.title);

  const scheduleText = formatReminderSchedule(
    reminder.reminder_date,
    reminder.reminder_time,
    reminder.repeat_type
  );

  const repeatLabel =
    reminder.repeat_type === 'DAILY'
      ? 'Daily'
      : reminder.repeat_type === 'WEEKLY'
      ? 'Weekly'
      : 'One-time';

  const isToday =
    reminder.repeat_type === 'DAILY' ||
    (reminder.repeat_type === 'ONCE' && scheduleText.startsWith('Today'));

  return (
    <div
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={`View details for ${reminder.title}`}
      onClick={() => onSelect?.(reminder)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          if ((e.target as HTMLElement).tagName === 'BUTTON') return;
          e.preventDefault();
          onSelect(reminder);
        }
      }}
      className={cn(
        'group relative flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-150',
        onSelect && 'cursor-pointer hover:shadow-xs',
        !isActive
          ? 'bg-[var(--color-surface)]/60 border-[var(--color-border)]/60 opacity-75 hover:opacity-90'
          : isToday
          ? 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-secondary)]/20'
      )}
    >
      {/* Left: Icon & Reminder Details */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Category Icon Badge */}
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base transition-colors select-none',
            isActive
              ? isToday
                ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20'
                : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
              : 'bg-[var(--color-surface-secondary)]/60 text-[var(--color-text-secondary)]/50'
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
                  ? 'text-[var(--color-text-secondary)] font-medium line-through'
                  : 'text-[var(--color-text)]'
              )}
            >
              {reminder.title}
            </h3>

            {!isActive && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] uppercase select-none">
                Inactive
              </span>
            )}
          </div>

          {/* Description preview if present */}
          {reminder.description && (
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1 max-w-md">
              {reminder.description}
            </p>
          )}

          {/* Timing & Metadata line */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs text-[var(--color-text-secondary)]">
            {/* Time / Schedule badge */}
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium',
                isActive && isToday
                  ? 'text-[var(--color-primary)] font-semibold'
                  : 'text-[var(--color-text)]'
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{scheduleText}</span>
            </span>

            {/* Repeat Type Indicator */}
            <span className="text-[var(--color-border)]">·</span>
            <span className="inline-flex items-center gap-1 text-[var(--color-text-secondary)]">
              <Repeat className="w-3 h-3" />
              <span>{repeatLabel}</span>
            </span>

            {/* Category tag */}
            {categoryName && (
              <>
                <span className="text-[var(--color-border)] hidden sm:inline">·</span>
                <span className="text-[var(--color-text-secondary)] hidden sm:inline-flex items-center gap-1">
                  <span>{categoryName}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Active Toggle Switch & Action Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Active/Inactive Toggle Button */}
        <button
          type="button"
          aria-label={isActive ? `Deactivate reminder ${reminder.title}` : `Activate reminder ${reminder.title}`}
          title={isActive ? 'Deactivate reminder' : 'Activate reminder'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(reminder);
          }}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
            isActive
              ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)]/80'
              : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]'
          )}
        >
          <Bell className={cn('w-3.5 h-3.5', isActive ? 'stroke-[2.5]' : 'opacity-60')} />
          <span className="hidden sm:inline">
            {isActive ? 'Active' : 'Off'}
          </span>
        </button>

        {/* Action Menu Dropdown */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label={`Actions for ${reminder.title}`}
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
                  onEdit(reminder);
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
                  onToggleActive(reminder);
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
                    <span>Activate</span>
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
                  onDelete(reminder);
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

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  CheckSquare,
  ChevronRight,
  Flame,
  Home,
  MoreHorizontal,
  Plus,
  Repeat,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { NavItemConfig } from './nav-config';

const PRIMARY_BOTTOM_NAV: NavItemConfig[] = [
  { name: 'Home', path: '/', icon: Home, end: true },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Reminders', path: '/reminders', icon: Bell },
];

const MORE_NAV_ITEMS: NavItemConfig[] = [
  { name: 'Commitments', path: '/commitments', icon: Flame },
  { name: 'Habits', path: '/habits', icon: Repeat },
  { name: 'Progress', path: '/progress', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const MobileBottomNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const moreMenuRef = useRef<HTMLDivElement>(null);



  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMoreOpen) {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreOpen]);

  const isMoreItemActive = MORE_NAV_ITEMS.some((item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );

  return (
    <>
      {/* "More" Sheet Overlay */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden transition-opacity"
          onClick={() => setIsMoreOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* "More" Sheet Drawer */}
      <div
        ref={moreMenuRef}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className={cn(
          'fixed inset-x-0 bottom-16 z-50 md:hidden border-t rounded-t-2xl shadow-xl transition-all duration-200 ease-out transform px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto',
          isMoreOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Additional Navigation"
      >
        <div className="flex items-center justify-between pb-3 border-b mb-2" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
            More Views & Tools
          </span>
          <button
            type="button"
            onClick={() => setIsMoreOpen(false)}
            className="p-1 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
            aria-label="Close more navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="space-y-1" aria-label="Additional navigation items">
          {MORE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMoreOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors select-none',
                  isActive
                    ? 'text-[var(--color-primary)] font-semibold'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]'
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--color-primary-soft)',
                        color: 'var(--color-primary)',
                      }
                    : undefined
                }
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                <ChevronRight
                  className={cn(
                    'w-4 h-4',
                    isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] opacity-50'
                  )}
                />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Bottom Nav Bar */}
      <nav
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="fixed bottom-0 inset-x-0 z-30 md:hidden border-t h-16 px-2 flex items-center justify-around transition-colors duration-200"
        aria-label="Mobile Bottom Navigation"
      >
        {/* Home */}
        <NavLink
          to={PRIMARY_BOTTOM_NAV[0].path}
          end={PRIMARY_BOTTOM_NAV[0].end}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors select-none',
              isActive
                ? 'text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            )
          }
          aria-label="Home"
        >
          {({ isActive }) => {
            const Icon = PRIMARY_BOTTOM_NAV[0].icon;
            return (
              <>
                <Icon
                  className={cn(
                    'w-5 h-5 mb-0.5 transition-transform duration-150',
                    isActive ? 'scale-105' : ''
                  )}
                />
                <span>{PRIMARY_BOTTOM_NAV[0].name}</span>
              </>
            );
          }}
        </NavLink>

        {/* Tasks */}
        <NavLink
          to={PRIMARY_BOTTOM_NAV[1].path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors select-none',
              isActive
                ? 'text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            )
          }
          aria-label="Tasks"
        >
          {({ isActive }) => {
            const Icon = PRIMARY_BOTTOM_NAV[1].icon;
            return (
              <>
                <Icon
                  className={cn(
                    'w-5 h-5 mb-0.5 transition-transform duration-150',
                    isActive ? 'scale-105' : ''
                  )}
                />
                <span>{PRIMARY_BOTTOM_NAV[1].name}</span>
              </>
            );
          }}
        </NavLink>

        {/* Center Standout Add Button (Placeholder) */}
        <div className="flex items-center justify-center flex-1 h-full">
          <button
            type="button"
            aria-label="Create new item (Placeholder)"
            title="Create new item (Placeholder)"
            style={{
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 4px 14px var(--color-ring)',
            }}
            className="w-11 h-11 rounded-full text-white flex items-center justify-center transition-transform duration-150 active:scale-95 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Reminders */}
        <NavLink
          to={PRIMARY_BOTTOM_NAV[2].path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors select-none',
              isActive
                ? 'text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            )
          }
          aria-label="Reminders"
        >
          {({ isActive }) => {
            const Icon = PRIMARY_BOTTOM_NAV[2].icon;
            return (
              <>
                <Icon
                  className={cn(
                    'w-5 h-5 mb-0.5 transition-transform duration-150',
                    isActive ? 'scale-105' : ''
                  )}
                />
                <span>{PRIMARY_BOTTOM_NAV[2].name}</span>
              </>
            );
          }}
        </NavLink>

        {/* More Button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors cursor-pointer select-none',
            isMoreItemActive || isMoreOpen
              ? 'text-[var(--color-primary)] font-semibold'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
          )}
          aria-expanded={isMoreOpen}
          aria-label="Open more navigation options"
        >
          <MoreHorizontal
            className={cn(
              'w-5 h-5 mb-0.5 transition-transform duration-150',
              isMoreItemActive || isMoreOpen ? 'scale-105' : ''
            )}
          />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};

export default MobileBottomNav;

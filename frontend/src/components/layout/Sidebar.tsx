import React from 'react';
import { NavLink } from 'react-router-dom';
import { MAIN_NAV_ITEMS, SETTINGS_NAV_ITEM } from './nav-config';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const renderNavLink = (item: typeof SETTINGS_NAV_ITEM) => {
    const IconComponent = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative select-none',
            isActive
              ? 'text-[var(--color-primary)] font-semibold shadow-2xs'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]'
          )
        }
        style={({ isActive }) =>
          isActive
            ? {
                backgroundColor: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
              }
            : undefined
        }
      >
        {({ isActive }) => (
          <>
            <IconComponent
              className={cn(
                'w-4.5 h-4.5 shrink-0 transition-colors duration-150',
                isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)]'
              )}
            />
            <span className="truncate">{item.name}</span>
            {isActive && (
              <span
                className="absolute right-2 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="hidden md:flex flex-col w-60 lg:w-64 shrink-0 border-r min-h-screen transition-colors duration-200"
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div
          style={{
            backgroundColor: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
          }}
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm select-none"
        >
          D
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--color-text)' }}>
            DailyBuddy
          </span>
          <span className="text-[11px] font-normal leading-none" style={{ color: 'var(--color-text-secondary)' }}>
            Focus & Flow
          </span>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 px-3 py-4 flex flex-col justify-between overflow-y-auto">
        <nav className="space-y-1" aria-label="Main Navigation">
          {MAIN_NAV_ITEMS.map(renderNavLink)}
        </nav>

        {/* Bottom Section with Divider */}
        <div className="pt-4 space-y-1">
          <div
            className="border-t mb-3"
            style={{ borderColor: 'var(--color-border)' }}
            role="separator"
          />
          <nav aria-label="Secondary Navigation">
            {renderNavLink(SETTINGS_NAV_ITEM)}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

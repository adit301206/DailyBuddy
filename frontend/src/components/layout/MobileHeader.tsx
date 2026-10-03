import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Moon, Sun } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { getPageTitle } from './nav-config';
import { useTheme } from '../../theme/ThemeProvider';

export const MobileHeader: React.FC = () => {
  const location = useLocation();
  const { mode, setMode } = useTheme();
  const title = getPageTitle(location.pathname);

  return (
    <header
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="md:hidden h-14 px-4 border-b flex items-center justify-between sticky top-0 z-20 transition-colors duration-200"
    >
      {/* Brand & Current Page */}
      <div className="flex items-center gap-2.5">
        <div
          style={{
            backgroundColor: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs select-none"
        >
          D
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--color-text)' }}>
            DailyBuddy
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            • {title}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1">
        <IconButton
          icon={mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          ariaLabel={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          variant="ghost"
          size="sm"
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        />
        <IconButton
          icon={<Bell className="w-4 h-4" />}
          ariaLabel="Notifications"
          variant="ghost"
          size="sm"
        />
      </div>
    </header>
  );
};

export default MobileHeader;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Settings } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { getPageTitle } from './nav-config';
import { useTheme } from '../../theme/ThemeProvider';

export const TopHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const title = getPageTitle(location.pathname);

  return (
    <header
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="hidden md:flex h-16 px-6 lg:px-8 border-b items-center justify-between sticky top-0 z-10 transition-colors duration-200"
    >
      {/* Left: Page Title */}
      <div>
        <h1
          style={{ color: 'var(--color-text)' }}
          className="text-lg font-semibold tracking-tight"
        >
          {title}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
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

        <IconButton
          icon={<Settings className="w-4 h-4" />}
          ariaLabel="Go to Settings"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/settings')}
        />
      </div>
    </header>
  );
};

export default TopHeader;

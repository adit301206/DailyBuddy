import React, { useState } from 'react';
import { LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { Badge } from '../ui/Badge';

export const AccountSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SectionTitle>Owner Account &amp; Access</SectionTitle>
            <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
              Protected Owner
            </Badge>
          </div>
          <SecondaryText className="text-sm">
            Current session authenticated as the designated owner of DailyBuddy.
          </SecondaryText>
        </div>
      </div>

      <div
        className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--color-surface-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base select-none shrink-0"
            style={{
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
            }}
          >
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {user?.username || 'Owner'}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {user?.email || 'Single-user private account'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: 'var(--color-danger-soft)',
            color: 'var(--color-danger)',
            border: '1px solid var(--color-danger)',
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
        </button>
      </div>
    </Card>
  );
};

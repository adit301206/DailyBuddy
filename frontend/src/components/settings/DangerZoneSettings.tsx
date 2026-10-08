import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { usePreferences } from '../../context/PreferencesContext';
import { ResetPreferencesDialog } from './ResetPreferencesDialog';
import { RotateCcw, ShieldAlert } from 'lucide-react';

interface DangerZoneSettingsProps {
  onNotify: (message: string) => void;
}

export const DangerZoneSettings: React.FC<DangerZoneSettingsProps> = ({ onNotify }) => {
  const { resetPreferences } = usePreferences();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmReset = () => {
    resetPreferences();
    onNotify('Local preferences reset to defaults');
  };

  return (
    <>
      <Card
        className="p-5 sm:p-6 space-y-4 border border-[var(--color-danger)]/20 bg-[var(--color-danger-soft)]/20"
      >
        <div className="space-y-0.5">
          <SectionTitle className="text-base font-semibold text-[var(--color-text)] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[var(--color-danger)]" />
            <span>Data & Local Settings</span>
          </SectionTitle>
          <SecondaryText className="text-xs">
            Manage your device-level cache and preferences.
          </SecondaryText>
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[var(--color-text)]">
              Reset Local Preferences
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Restores display name, week start, and dashboard layout to defaults without affecting your database records.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[var(--color-danger)]" />}
            onClick={() => setIsDialogOpen(true)}
            className="shrink-0 text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]"
          >
            Reset Settings
          </Button>
        </div>
      </Card>

      <ResetPreferencesDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
};

export default DangerZoneSettings;

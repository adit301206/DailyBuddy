import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { usePreferences } from '../../context/PreferencesContext';
import { Smile, User } from 'lucide-react';

export const PersonalSettings: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();
  const [nameInput, setNameInput] = useState(preferences.displayName || 'Adit');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleNameBlur = () => {
    const trimmed = nameInput.trim() || 'Adit';
    setNameInput(trimmed);
    updatePreferences({ displayName: trimmed });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const toggleEmoji = () => {
    updatePreferences({ showGreetingEmoji: !preferences.showGreetingEmoji });
  };

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="space-y-0.5">
        <SectionTitle className="text-base font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Personal Profile</span>
        </SectionTitle>
        <SecondaryText className="text-xs">
          Personalize your greeting and how DailyBuddy addresses you.
        </SecondaryText>
      </div>

      <div className="space-y-4 pt-1">
        {/* Name input */}
        <div className="space-y-1.5">
          <label
            htmlFor="display-name-input"
            className="block text-xs font-semibold text-[var(--color-text)]"
          >
            Display Name
          </label>
          <div className="flex items-center gap-2 max-w-sm">
            <input
              id="display-name-input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleKeyDown}
              maxLength={30}
              placeholder="e.g. Adit"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
            />
            {savedFeedback && (
              <span className="text-xs font-medium text-[var(--color-success)] shrink-0 animate-in fade-in">
                Saved
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Used on the greeting header and personal insights.
          </p>
        </div>

        {/* Greeting Emoji Toggle */}
        <div className="pt-2 border-t border-[var(--color-border)]/60 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[var(--color-text)] flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Greeting Wave Emoji</span>
            </p>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Include the "👋" wave emoji next to your name in greetings.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={preferences.showGreetingEmoji}
            onClick={toggleEmoji}
            className={`w-11 h-6 rounded-full transition-colors duration-200 relative inline-flex items-center p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer shrink-0 ${
              preferences.showGreetingEmoji
                ? 'bg-[var(--color-primary)]'
                : 'bg-[var(--color-border)]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 inline-block ${
                preferences.showGreetingEmoji ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PersonalSettings;

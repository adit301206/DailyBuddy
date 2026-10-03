import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText, Metadata } from '../ui/Typography';
import { formatTimeString, getItemIcon } from '../../lib/formatters';
import type { DashboardReminder } from '../../types/dashboard';
import { Clock, Repeat } from 'lucide-react';

interface RemindersCardProps {
  reminders: DashboardReminder[];
}

export const RemindersCard: React.FC<RemindersCardProps> = ({ reminders }) => {
  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <span>🔔</span>
          <span>Upcoming</span>
        </SectionTitle>
        <Metadata className="text-xs">
          {reminders.length} scheduled
        </Metadata>
      </div>

      {reminders.length === 0 ? (
        <div className="py-6 text-center">
          <SecondaryText className="text-sm">No upcoming reminders.</SecondaryText>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {reminders.map((reminder) => {
            const Icon = getItemIcon(reminder.title);
            const timeFormatted = formatTimeString(reminder.reminder_time);
            const repeatLabel =
              reminder.repeat_type && reminder.repeat_type !== 'ONCE'
                ? reminder.repeat_type.toLowerCase()
                : null;

            return (
              <div
                key={reminder.id}
                className="py-2.5 px-2 -mx-2 rounded-lg flex items-start justify-between transition-colors duration-150 hover:bg-[var(--color-surface-secondary)]"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      backgroundColor: 'var(--color-primary-soft)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium tracking-tight truncate" style={{ color: 'var(--color-text)' }}>
                      {reminder.title}
                    </p>

                    <div className="flex items-center gap-2 text-xs mt-0.5 flex-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                      {timeFormatted && (
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{timeFormatted}</span>
                        </span>
                      )}

                      {repeatLabel && (
                        <>
                          <span style={{ color: 'var(--color-border)' }}>•</span>
                          <span className="capitalize flex items-center gap-0.5">
                            <Repeat className="w-2.5 h-2.5" />
                            <span>{repeatLabel}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RemindersCard;

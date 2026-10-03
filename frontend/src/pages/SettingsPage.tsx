import React from 'react';
import { Card } from '../components/ui/Card';
import { PageTitle, SecondaryText, SectionTitle, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" size="sm" icon={<Settings className="w-3 h-3" />}>
            Preferences
          </Badge>
        </div>
        <PageTitle>Settings</PageTitle>
        <SecondaryText className="text-base">
          Customize themes, preferences, and notifications.
        </SecondaryText>
      </div>

      <Card className="py-12 px-6 text-center space-y-3">
        <SectionTitle className="text-lg font-medium">Settings coming next</SectionTitle>
        <Text style={{ color: 'var(--color-text-secondary)' }} className="max-w-md mx-auto">
          Your settings will appear here.
        </Text>
      </Card>
    </div>
  );
};

export default SettingsPage;

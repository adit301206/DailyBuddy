import React from 'react';
import { Card } from '../components/ui/Card';
import { PageTitle, SecondaryText, SectionTitle, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" size="sm" icon={<Sparkles className="w-3 h-3" />}>
            Overview
          </Badge>
        </div>
        <PageTitle>My Day</PageTitle>
        <SecondaryText className="text-base">
          Good day 👋
        </SecondaryText>
      </div>

      <Card className="py-12 px-6 text-center space-y-3">
        <SectionTitle className="text-lg font-medium">Dashboard coming next</SectionTitle>
        <Text style={{ color: 'var(--color-text-secondary)' }} className="max-w-md mx-auto">
          Your personalized dashboard, daily focus, and priorities will appear here.
        </Text>
      </Card>
    </div>
  );
};

export default DashboardPage;

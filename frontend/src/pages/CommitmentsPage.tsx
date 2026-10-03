import React from 'react';
import { Card } from '../components/ui/Card';
import { PageTitle, SecondaryText, SectionTitle, Text } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Flame } from 'lucide-react';

export const CommitmentsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" size="sm" icon={<Flame className="w-3 h-3" />}>
            Goals
          </Badge>
        </div>
        <PageTitle>Commitments</PageTitle>
        <SecondaryText className="text-base">
          Track high-priority commitments and accountability.
        </SecondaryText>
      </div>

      <Card className="py-12 px-6 text-center space-y-3">
        <SectionTitle className="text-lg font-medium">Commitments coming next</SectionTitle>
        <Text style={{ color: 'var(--color-text-secondary)' }} className="max-w-md mx-auto">
          Your commitments and streaks will appear here.
        </Text>
      </Card>
    </div>
  );
};

export default CommitmentsPage;

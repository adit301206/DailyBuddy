import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { CheckSquare, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProgressEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="py-12 px-6 text-center space-y-6 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <Sparkles className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <SectionTitle className="text-xl font-bold">Start Building Your Progress</SectionTitle>
        <SecondaryText className="text-sm max-w-sm mx-auto">
          Add tasks, habits, or commitments to see your personal momentum, consistency scores, and active streaks here.
        </SecondaryText>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<CheckSquare className="w-4 h-4 text-[var(--color-primary)]" />}
          onClick={() => navigate('/tasks')}
        >
          Add Task
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Target className="w-4 h-4 text-[var(--color-primary)]" />}
          onClick={() => navigate('/commitments')}
        >
          Add Commitment
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Sparkles className="w-4 h-4 text-[var(--color-primary)]" />}
          onClick={() => navigate('/habits')}
        >
          Add Habit
        </Button>
      </div>
    </Card>
  );
};

export default ProgressEmptyState;

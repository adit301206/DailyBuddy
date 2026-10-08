import React from 'react';
import { Card } from '../ui/Card';
import { SectionTitle, SecondaryText } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Heart, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const techStack = [
    'React 19',
    'TypeScript',
    'Tailwind CSS',
    'Django REST Framework',
    'SQLite',
    'Vite',
  ];

  return (
    <Card className="p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base select-none shadow-xs shrink-0"
            style={{
              backgroundColor: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
            }}
          >
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <SectionTitle className="text-base font-bold">DailyBuddy</SectionTitle>
              <Badge variant="default" size="sm">
                v1.0.0
              </Badge>
            </div>
            <SecondaryText className="text-xs">
              Your personal focus, consistency, and momentum companion.
            </SecondaryText>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--color-success)] bg-[var(--color-success-soft)] px-2.5 py-1 rounded-full border border-[var(--color-success)]/30 font-medium shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active & Synced</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--color-border)]/60 space-y-2.5">
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Crafted as a personal command center designed to balance productive action with calm focus. No shame, no noise, no algorithmic addiction.
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] border-t border-[var(--color-border)]/40">
        <span className="flex items-center gap-1">
          Built for daily personal flow <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
        </span>
        <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
          Adit's DailyBuddy <Heart className="w-3 h-3 text-[var(--color-danger)] fill-current" />
        </span>
      </div>
    </Card>
  );
};

export default AboutSection;

import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Info,
  Moon,
  Palette,
  Plus,
  Sparkles,
  Sun,
  Trash2,
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { IconButton } from './components/ui/IconButton';
import { ProgressBar } from './components/ui/ProgressBar';
import {
  Label,
  Metadata,
  PageTitle,
  SecondaryText,
  SectionTitle,
  Text,
} from './components/ui/Typography';
import { useTheme } from './theme/ThemeProvider';
import type { ThemeName } from './theme/theme-types';

export const App: React.FC = () => {
  const { theme, setTheme, mode, setMode, availableThemes } = useTheme();
  const [progressValue, setProgressValue] = useState(80);
  const [btnLoading, setBtnLoading] = useState(false);

  const toggleLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
      className="min-h-screen transition-colors duration-200"
    >
      {/* Top Header */}
      <header
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
        className="border-b sticky top-0 z-10 transition-colors duration-200"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
            >
              D
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight">DailyBuddy</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-normal opacity-60">
                Design System Foundation
              </span>
            </div>
          </div>

          {/* Development Theme Selector */}
          <div className="flex items-center gap-2">
            <div
              style={{ backgroundColor: 'var(--color-surface-secondary)' }}
              className="p-1 rounded-lg flex items-center gap-1"
            >
              {availableThemes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name as ThemeName)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    theme === t.name
                      ? 'bg-[var(--color-surface)] shadow-xs font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    color: theme === t.name ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  }}
                  aria-label={`Switch theme to ${t.label}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <IconButton
              icon={mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              ariaLabel="Toggle Dark / Light Mode"
              variant="ghost"
              size="sm"
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Intro Hero banner */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm" icon={<Sparkles className="w-3 h-3" />}>
              Foundation Phase
            </Badge>
            <Metadata>Theme: {theme.toUpperCase()}</Metadata>
          </div>
          <PageTitle>DailyBuddy Design System</PageTitle>
          <SecondaryText className="max-w-2xl text-base">
            "Everything I need to remember, in one place." Minimal, calm, modern, and personal UI design system foundation built for clarity and speed.
          </SecondaryText>
        </section>

        {/* 1. Typography */}
        <section className="space-y-4">
          <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            <SectionTitle>1. Typography</SectionTitle>
          </div>
          <Card className="space-y-4">
            <div className="space-y-1">
              <Label>Page Title (H1)</Label>
              <PageTitle>Everything I need to remember</PageTitle>
            </div>
            <div className="space-y-1">
              <Label>Section Title (H2)</Label>
              <SectionTitle>Today's Focus & Priorities</SectionTitle>
            </div>
            <div className="space-y-1">
              <Label>Body Text</Label>
              <Text>
                DailyBuddy helps you manage tasks, commitments, habits, and reminders without visual noise or unnecessary complexity.
              </Text>
            </div>
            <div className="space-y-1">
              <Label>Secondary Text</Label>
              <SecondaryText>
                Completed 4 of 5 habits today • Last synced 2 minutes ago
              </SecondaryText>
            </div>
            <div className="space-y-1">
              <Label>Small Metadata & Labels</Label>
              <div className="flex items-center gap-4">
                <Metadata>Updated Oct 2, 2026</Metadata>
                <Label>Priority High</Label>
              </div>
            </div>
          </Card>
        </section>

        {/* 2. Buttons */}
        <section className="space-y-4">
          <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            <SectionTitle>2. Buttons</SectionTitle>
          </div>
          <Card className="space-y-6">
            <div className="space-y-2">
              <Label>Variants</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="danger">Danger Action</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sizes & Icons</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  New Item
                </Button>
                <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={btnLoading}
                  onClick={toggleLoading}
                >
                  {btnLoading ? 'Processing' : 'Click to Test Loading'}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Icon Buttons */}
        <section className="space-y-4">
          <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            <SectionTitle>3. Icon Buttons (Accessible)</SectionTitle>
          </div>
          <Card className="space-y-4">
            <SecondaryText>
              All icon-only buttons include mandatory accessible labels (<code className="text-xs">ariaLabel</code>) and keyboard focus rings.
            </SecondaryText>
            <div className="flex flex-wrap items-center gap-4">
              <IconButton icon={<Plus className="w-4 h-4" />} ariaLabel="Add new task" variant="primary" />
              <IconButton icon={<Bell className="w-4 h-4" />} ariaLabel="View notifications" variant="secondary" />
              <IconButton icon={<Palette className="w-4 h-4" />} ariaLabel="Change theme" variant="ghost" />
              <IconButton icon={<Trash2 className="w-4 h-4" />} ariaLabel="Delete item" variant="danger" />
            </div>
          </Card>
        </section>

        {/* 4. Cards */}
        <section className="space-y-4">
          <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            <SectionTitle>4. Cards & Containers</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="standard" className="space-y-2">
              <Label>Standard Card</Label>
              <SectionTitle className="text-base">Calm & Minimal</SectionTitle>
              <SecondaryText>
                Clean surface background with subtle borders and balanced padding.
              </SecondaryText>
            </Card>

            <Card variant="interactive" className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Interactive Card</Label>
                <Badge variant="success" size="sm">Hover me</Badge>
              </div>
              <SectionTitle className="text-base">Interactive State</SectionTitle>
              <SecondaryText>
                Responds smoothly to hover with primary border subtle highlight.
              </SecondaryText>
            </Card>
          </div>
        </section>

        {/* 5. Badges */}
        <section className="space-y-4">
          <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            <SectionTitle>5. Badges & Indicators</SectionTitle>
          </div>
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default" icon={<Info className="w-3.5 h-3.5" />}>
                Default / Active
              </Badge>
              <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Completed
              </Badge>
              <Badge variant="warning" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                Pending Review
              </Badge>
              <Badge variant="danger" icon={<AlertCircle className="w-3.5 h-3.5" />}>
                Overdue
              </Badge>
            </div>
          </Card>
        </section>

        {/* 6. Progress Bar */}
        <section className="space-y-4">
          <div className="border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            <SectionTitle>6. Progress Bar</SectionTitle>
          </div>
          <Card className="space-y-6">
            <div className="space-y-2">
              <ProgressBar
                value={progressValue}
                showLabel
                ariaLabel="Daily Habit Progress"
                size="md"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setProgressValue((p) => Math.max(0, p - 10))}
              >
                - 10%
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setProgressValue((p) => Math.min(100, p + 10))}
              >
                + 10%
              </Button>
              <Metadata className="ml-auto">
                Uses theme primary color (<code className="text-xs">var(--color-primary)</code>)
              </Metadata>
            </div>
          </Card>
        </section>

        {/* Footer Note */}
        <footer
          style={{ borderColor: 'var(--color-border)' }}
          className="pt-8 border-t text-center space-y-1"
        >
          <SecondaryText>
            DailyBuddy Foundation Phase • Reusable components & theme engine complete
          </SecondaryText>
          <Metadata>
            Next steps will implement core application modules incrementally.
          </Metadata>
        </footer>
      </main>
    </div>
  );
};

export default App;

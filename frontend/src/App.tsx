import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CommitmentsPage } from './pages/CommitmentsPage';
import { HabitsPage } from './pages/HabitsPage';
import { RemindersPage } from './pages/RemindersPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text)',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor: 'var(--color-primary)',
              borderTopColor: 'transparent',
            }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Loading DailyBuddy...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
};

const PublicLoginRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicLoginRoute />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="commitments" element={<CommitmentsPage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

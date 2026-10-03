import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';

export const AppShell: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
      className="min-h-screen flex flex-row transition-colors duration-200"
    >
      {/* Persistent Desktop / Tablet Sidebar */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Desktop Header */}
        <TopHeader />

        {/* Mobile Header */}
        <MobileHeader />

        {/* Scrollable Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 w-full max-w-5xl mx-auto overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default AppShell;

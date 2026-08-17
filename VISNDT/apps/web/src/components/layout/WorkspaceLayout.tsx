'use client';

import { useState, useCallback } from 'react';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared Workspace Layout — M21.5.1 Responsive Foundation.
 *
 * Wraps all workspace pages with a consistent sidebar + header pattern.
 * Desktop: sidebar is sticky, always visible.
 * Mobile: sidebar is hidden behind hamburger toggle, slides in with overlay.
 *
 * Replaces duplicated sidebar+header code across all workspace/* pages.
 */
export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <main className="flex-1 bg-slate-50 p-3 sm:p-4 md:p-6">
          <div className="mx-auto w-full max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
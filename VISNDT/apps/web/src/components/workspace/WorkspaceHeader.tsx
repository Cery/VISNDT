'use client';

import { useAuth } from '@/auth/AuthProvider';

interface WorkspaceHeaderProps {
  onMenuToggle?: () => void;
}

export default function WorkspaceHeader({ onMenuToggle }: WorkspaceHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-slate-700">
          {user?.organizationId ? 'Organization Workspace' : 'Personal Workspace'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500 hidden sm:inline">
          {user?.name || user?.email || 'User'}
        </span>
        <button
          onClick={logout}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
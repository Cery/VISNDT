'use client';

import { useAuth } from '@/auth/AuthProvider';

export default function WorkspaceHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-slate-700">
        {user?.organizationId ? 'Organization Workspace' : 'Personal Workspace'}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">
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
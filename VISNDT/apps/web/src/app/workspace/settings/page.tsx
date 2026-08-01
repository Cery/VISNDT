'use client';

import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';

function SettingsContent() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col">
        <WorkspaceHeader />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Account Settings
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Manage your account information.
              </p>
            </div>

            {/* Profile Card */}
            <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
              {/* Email */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm font-medium text-slate-900">
                  {user?.email || '—'}
                </span>
              </div>

              {/* Name */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-500">Name</span>
                <span className="text-sm font-medium text-slate-900">
                  {user?.name || '—'}
                </span>
              </div>

              {/* Organization */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-500">Organization</span>
                <span className="text-sm font-medium text-slate-900">
                  {user?.organizationId
                    ? `Active (${user.organizationId.slice(0, 8)}…)`
                    : 'Not joined'}
                </span>
              </div>

              {/* User ID */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-500">User ID</span>
                <span className="text-xs font-mono text-slate-400">
                  {user?.id ? user.id.slice(0, 8) + '…' : '—'}
                </span>
              </div>
            </div>

            {/* Logout */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
'use client';

import { useState, useCallback } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import { updateUserProfile } from '@/services/user.service';

function SettingsContent() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const [editName, setEditName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState('');

  const [editPassword, setEditPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveName = useCallback(async () => {
    if (!user?.id) return;
    if (!nameValue.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }
    setSavingName(true);
    setNameError('');
    setSuccessMsg('');
    try {
      await updateUserProfile(user.id, { name: nameValue.trim() });
      setEditName(false);
      setSuccessMsg('Name updated successfully.');
    } catch {
      setNameError('Failed to update name. Please try again.');
    } finally {
      setSavingName(false);
    }
  }, [user, nameValue]);

  const handleSavePassword = useCallback(async () => {
    if (!user?.id) return;
    if (passwordValue.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    setSavingPassword(true);
    setPasswordError('');
    setSuccessMsg('');
    try {
      await updateUserProfile(user.id, { passwordHash: passwordValue });
      setEditPassword(false);
      setPasswordValue('');
      setSuccessMsg('Password changed successfully.');
    } catch {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  }, [user, passwordValue]);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
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

            {/* Success message */}
            {successMsg && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {successMsg}
              </div>
            )}

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
                {editName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      className="px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="px-3 py-1 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                      {savingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditName(false); setNameValue(user?.name || ''); setNameError(''); }}
                      className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {user?.name || '—'}
                    </span>
                    <button
                      onClick={() => { setEditName(true); setNameValue(user?.name || ''); }}
                      className="text-xs text-slate-500 hover:text-slate-700 underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
                {nameError && (
                  <span className="text-xs text-red-500 ml-2">{nameError}</span>
                )}
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

            {/* Change Password Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Password</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Change your account password.
                  </p>
                </div>
                {!editPassword && (
                  <button
                    onClick={() => setEditPassword(true)}
                    className="text-xs text-slate-500 hover:text-slate-700 underline"
                  >
                    Change
                  </button>
                )}
              </div>
              {editPassword && (
                <div className="mt-4 space-y-3">
                  <input
                    type="password"
                    placeholder="New password (min. 6 characters)"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-xs text-red-500">{passwordError}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSavePassword}
                      disabled={savingPassword}
                      className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                      {savingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      onClick={() => { setEditPassword(false); setPasswordValue(''); setPasswordError(''); }}
                      className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
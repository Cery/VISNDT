'use client';

import { useState, useCallback } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { updateUserProfile } from '@/services/user.service';

function SettingsContent() {
  const { user, logout } = useAuth();
  const hasOrganizationWorkspace = Boolean(
    user
    && user.organization
    && user.organizationMember
    && user.workspaceRole,
  );

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
      setNameError('姓名不能为空。');
      return;
    }
    setSavingName(true);
    setNameError('');
    setSuccessMsg('');
    try {
      await updateUserProfile(user.id, { name: nameValue.trim() });
      setEditName(false);
      setSuccessMsg('姓名已更新成功。');
    } catch {
      setNameError('更新姓名失败，请重试。');
    } finally {
      setSavingName(false);
    }
  }, [user, nameValue]);

  const handleSavePassword = useCallback(async () => {
    if (!user?.id) return;
    if (passwordValue.length < 6) {
      setPasswordError('密码长度至少为 6 个字符。');
      return;
    }
    setSavingPassword(true);
    setPasswordError('');
    setSuccessMsg('');
    try {
      await updateUserProfile(user.id, { passwordHash: passwordValue });
      setEditPassword(false);
      setPasswordValue('');
      setSuccessMsg('密码已更改成功。');
    } catch {
      setPasswordError('更改密码失败，请重试。');
    } finally {
      setSavingPassword(false);
    }
  }, [user, passwordValue]);

  return (
    <WorkspaceLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            账户设置
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            管理您的账户信息。
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
                <span className="text-sm text-slate-500">邮箱</span>
                <span className="text-sm font-medium text-slate-900">
                  {user?.email || '—'}
                </span>
              </div>

              {/* Name */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-500">姓名</span>
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
                      {savingName ? '保存中...' : '保存'}
                    </button>
                    <button
                      onClick={() => { setEditName(false); setNameValue(user?.name || ''); setNameError(''); }}
                      className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      取消
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
                      编辑
                    </button>
                  </div>
                )}
                {nameError && (
                  <span className="text-xs text-red-500 ml-2">{nameError}</span>
                )}
              </div>

              {/* Organization */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-500">组织</span>
                <span className="text-sm font-medium text-slate-900">
                  {hasOrganizationWorkspace && user?.organization
                    ? `已激活 (${user.organization.id.slice(0, 8)}…)`
                    : '未加入'}
                </span>
              </div>

              {/* User ID */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-500">用户 ID</span>
                <span className="text-xs font-mono text-slate-400">
                  {user?.id ? user.id.slice(0, 8) + '…' : '—'}
                </span>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">密码</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    修改您的账户密码。
                  </p>
                </div>
                {!editPassword && (
                  <button
                    onClick={() => setEditPassword(true)}
                    className="text-xs text-slate-500 hover:text-slate-700 underline"
                  >
                    修改
                  </button>
                )}
              </div>
              {editPassword && (
                <div className="mt-4 space-y-3">
                  <input
                    type="password"
                    placeholder="新密码（至少 6 个字符）"
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
                      {savingPassword ? '更改中...' : '更改密码'}
                    </button>
                    <button
                      onClick={() => { setEditPassword(false); setPasswordValue(''); setPasswordError(''); }}
                      className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      取消
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
                退出登录
              </button>
            </div>
      </div>
    </WorkspaceLayout>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER', 'SUPPLIER']}>
        <SettingsContent />
      </RoleGuard>
    </AuthGuard>
  );
}

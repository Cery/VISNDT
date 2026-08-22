'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import Loading from '@/components/common/Loading';

// Admin Console 地址：D2 fix，Admin 角色 Web 端引导入口
const ADMIN_CONSOLE_URL =
  process.env.NEXT_PUBLIC_ADMIN_CONSOLE_URL ?? 'http://localhost:3001';

function DashboardEntryContent() {
  const { user, isLoading, authError, retryAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || authError) {
      return;
    }

    if (user?.workspaceRole === 'BUYER') {
      router.replace('/dashboard/buyer');
      return;
    }

    if (user?.workspaceRole === 'SUPPLIER') {
      router.replace('/dashboard/supplier');
      return;
    }

    // 无角色时不再重定向到 /workspace，直接展示角色配置引导
  }, [isLoading, authError, router, user?.workspaceRole]);

  if (isLoading) {
    return <Loading />;
  }

  // Case 2（D1）：认证服务不可用（网络异常 / 服务中断 / 5xx），区别于“未登录 / 未配置角色”
  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 shadow-industrial-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9m0 4h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">认证服务暂不可用</h2>
          <p className="text-sm text-slate-500 mb-6">
            无法连接认证服务，当前可能处于离线状态或服务暂不可用。请检查网络后重试。
          </p>
          <button
            onClick={() => void retryAuth()}
            className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            重新连接
          </button>
        </div>
      </div>
    );
  }

  const isAdminUser = user?.organization?.type === 'ADMIN';

  // 无角色配置状态（Case 3：Admin 角色提供管理控制台引导）
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-amber-200 bg-white p-8 shadow-industrial-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <svg className="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {isAdminUser ? (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-2">请使用管理控制台</h2>
            <p className="text-sm text-slate-500 mb-6">
              当前账号为平台管理员（Admin），请通过管理控制台进行平台运营与管理操作。
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-2">工作区角色未配置</h2>
            <p className="text-sm text-slate-500 mb-6">
              当前账号已登录，但尚未分配工作区角色（Buyer 或 Supplier）。请联系管理员完成角色配置后再使用工作台功能。
            </p>
          </>
        )}
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">当前账号信息</p>
            <p className="text-sm text-slate-700">
              <span className="text-slate-400">邮箱：</span>
              {user?.email ?? '未知'}
            </p>
            <p className="text-sm text-slate-700">
              <span className="text-slate-400">名称：</span>
              {user?.name ?? '未设置'}
            </p>
            <p className="text-sm text-slate-700">
              <span className="text-slate-400">角色：</span>
              <span className="text-amber-600 font-medium">{isAdminUser ? 'Admin' : '未配置'}</span>
            </p>
          </div>
          {isAdminUser ? (
            <a
              href={ADMIN_CONSOLE_URL}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              前往 Admin Console
            </a>
          ) : (
            <a
              href="/workspace/settings"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              前往设置
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardEntryContent />
    </AuthGuard>
  );
}

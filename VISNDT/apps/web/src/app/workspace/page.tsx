'use client';

import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import CapabilityBadge from '@/components/capability/CapabilityBadge';
import BuyerWorkspaceEntry from '@/components/workspace/BuyerWorkspaceEntry';
import SupplierWorkspaceEntry from '@/components/workspace/SupplierWorkspaceEntry';
import Loading from '@/components/common/Loading';

// Admin Console 地址：D2 fix，Admin 角色 Web 端引导入口
const ADMIN_CONSOLE_URL =
  process.env.NEXT_PUBLIC_ADMIN_CONSOLE_URL ?? 'http://localhost:3001';

function WorkspaceContent() {
  const { user, isLoading, authError, retryAuth } = useAuth();
  const workspaceRole = user?.workspaceRole ?? null;

  if (isLoading) {
    return (
      <WorkspaceLayout>
        <Loading />
      </WorkspaceLayout>
    );
  }

  // Case 2（D1）：认证服务不可用（网络异常 / 服务中断 / 5xx），区别于“未登录 / 未配置角色”
  if (authError) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[760px]">
          <section className="rounded-2xl border border-red-200 bg-white p-6 sm:p-8 shadow-industrial-sm">
            <h1 className="text-2xl font-extrabold text-foreground">认证服务暂不可用</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              无法连接认证服务，当前可能处于离线状态或服务暂不可用。请检查网络后重试。
            </p>
            <div className="mt-5">
              <button
                onClick={() => void retryAuth()}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                重新连接
              </button>
            </div>
          </section>
        </div>
      </WorkspaceLayout>
    );
  }

  if (workspaceRole === 'BUYER') {
    return (
      <WorkspaceLayout>
        <BuyerWorkspaceEntry />
      </WorkspaceLayout>
    );
  }

  if (workspaceRole === 'SUPPLIER') {
    return (
      <WorkspaceLayout>
        <SupplierWorkspaceEntry />
      </WorkspaceLayout>
    );
  }

  // Case 3（D2）：Admin 角色提供管理控制台引导
  const isAdminUser = user?.organization?.type === 'ADMIN';

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[760px]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-industrial-sm">
          <h1 className="text-2xl font-extrabold text-foreground">
            {isAdminUser ? '请使用管理控制台' : '工作空间角色未配置'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isAdminUser
              ? '当前账号为平台管理员（Admin），请通过管理控制台进行平台运营与管理操作。'
              : '当前账号已登录，但尚未映射到 Buyer 或 Supplier 工作区。请联系管理员完成角色配置后再进入业务工作空间。'}
          </p>
          {isAdminUser ? (
            <div className="mt-5">
              <a
                href={ADMIN_CONSOLE_URL}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                前往 Admin Console
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              <CapabilityBadge label="Buyer · 采购方" tone="cyan" hint="需求发起侧（Demand Side）" />
              <CapabilityBadge label="Supplier · 供应商" tone="amber" hint="能力提供侧（Capability Provider）" />
            </div>
          )}
        </section>
      </div>
    </WorkspaceLayout>
  );
}

export default function WorkspacePage() {
  return (
    <AuthGuard>
      <WorkspaceContent />
    </AuthGuard>
  );
}

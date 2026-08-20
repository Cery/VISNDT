'use client';

import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import CapabilityBadge from '@/components/capability/CapabilityBadge';
import BuyerWorkspaceEntry from '@/components/workspace/BuyerWorkspaceEntry';
import SupplierWorkspaceEntry from '@/components/workspace/SupplierWorkspaceEntry';
import Loading from '@/components/common/Loading';

function WorkspaceContent() {
  const { user, isLoading } = useAuth();
  const workspaceRole = user?.workspaceRole ?? null;

  if (isLoading) {
    return (
      <WorkspaceLayout>
        <Loading />
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

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[760px]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-industrial-sm">
          <h1 className="text-2xl font-extrabold text-foreground">工作空间角色未配置</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            当前账号已登录，但尚未映射到 Buyer 或 Supplier 工作区。请联系管理员完成角色配置后再进入业务工作空间。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <CapabilityBadge label="Buyer · 采购方" tone="cyan" hint="需求发起侧（Demand Side）" />
            <CapabilityBadge label="Supplier · 供应商" tone="amber" hint="能力提供侧（Capability Provider）" />
          </div>
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
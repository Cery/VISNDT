'use client';

import Link from 'next/link';
import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import type { WorkspaceRole } from '@/services/auth.service';

interface WorkspaceEntryLink {
  title: string;
  description: string;
  href: string;
}

const WORKSPACE_ENTRY_LINKS: Record<Exclude<WorkspaceRole, null>, WorkspaceEntryLink[]> = {
  BUYER: [
    {
      title: 'Buyer 工作台',
      description: '进入 Buyer 工作台，查看需求、询价与匹配结果总览。',
      href: '/dashboard/buyer',
    },
    {
      title: '我的需求',
      description: '查看和管理 Buyer 需求列表。',
      href: '/workspace/demands',
    },
    {
      title: '询价单',
      description: '进入 RFQ 列表和详情流转。',
      href: '/workspace/rfqs',
    },
    {
      title: '匹配结果',
      description: '查看需求与产品的匹配结果。',
      href: '/workspace/matches',
    },
  ],
  SUPPLIER: [
    {
      title: 'Supplier 工作台',
      description: '进入 Supplier 正式业务工作台，查看业务状态与导航入口。',
      href: '/dashboard/supplier',
    },
    {
      title: 'Supplier 兼容入口',
      description: '历史路由兼容壳页，仅用于兼容访问，不承担正式业务工作台职责。',
      href: '/workspace/supplier',
    },
    {
      title: 'RFQ 响应',
      description: '查看供应商侧 RFQ 列表。',
      href: '/workspace/supplier/rfqs',
    },
    {
      title: '我的响应',
      description: '跟踪已提交的响应记录。',
      href: '/workspace/supplier/responses',
    },
  ],
};

function WorkspaceContent() {
  const { user } = useAuth();
  const workspaceRole = user?.workspaceRole ?? null;
  const entryLinks = workspaceRole ? WORKSPACE_ENTRY_LINKS[workspaceRole] : [];

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[960px] space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">工作区入口</h1>
          <p className="mt-2 text-sm text-slate-500">
            这里是 VISNDT 平台的统一业务入口，按 Buyer / Supplier 角色提供导航，不承担数据汇总职责。
          </p>
          <p className="mt-2 text-sm text-slate-500">
            当前角色：{workspaceRole ?? '未配置'}
          </p>
        </div>

        {workspaceRole ? (
          <section className="grid gap-4 sm:grid-cols-2">
            {entryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-colors hover:border-slate-300"
              >
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
              </Link>
            ))}
          </section>
        ) : (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-amber-900">未分配可用工作区角色</h2>
            <p className="mt-2 text-sm text-amber-800">
              当前账号已登录，但尚未映射到 Buyer 或 Supplier 工作区。请联系管理员完成角色配置后再进入 Dashboard。
            </p>
          </section>
        )}
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

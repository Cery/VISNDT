'use client';

import { useCallback, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';

function SupplierWorkspaceContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto">
            <RoleGuard roles={['SUPPLIER']}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">供应商工作台</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    欢迎进入供应商工作区，后续将在这里承接询价处理与报价响应能力。
                  </p>
                </div>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
                      🏭
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Supplier Workspace Ready</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          当前版本仅建立入口骨架，不接入 API、不展示业务数据。
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-700">下一步入口</p>
                          <p className="text-sm text-slate-500 mt-1">可从侧边栏进入供应商询价管理。</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-700">当前状态</p>
                          <p className="text-sm text-slate-500 mt-1">页面骨架已接入 Supplier 角色守卫。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </RoleGuard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierWorkspacePage() {
  return (
    <AuthGuard>
      <SupplierWorkspaceContent />
    </AuthGuard>
  );
}

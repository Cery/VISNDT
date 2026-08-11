'use client';

import Link from 'next/link';
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
                  <h2 className="text-xl font-bold text-slate-900">供应商兼容入口（Compatibility Shell）</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    该页面仅保留为历史路由兼容入口，用于维持 Supplier 工作区壳层访问，不承担业务工作台扩展职责。
                  </p>
                </div>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
                      🏭
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">Dashboard 负责 Supplier Workbench</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          正式的 Supplier Business Status、RFQ Snapshot、Response Tracking 和 Domain Navigation 已统一归属到 `/dashboard/supplier`。
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-700">推荐入口</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Supplier 正式工作台入口为 `/dashboard/supplier`。
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-sm font-medium text-slate-700">当前职责</p>
                          <p className="text-sm text-slate-500 mt-1">
                            仅保留角色守卫与壳层兼容，不接入 domain API，不承接未来业务能力。
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-700">兼容范围说明</p>
                        <p className="mt-1 text-sm text-slate-500">
                          本页不新增 RFQ 列表、Response 操作、产品管理或其他 Supplier 业务能力；相关业务导航请进入正式 Dashboard。
                        </p>
                        <div className="mt-4">
                          <Link
                            href="/dashboard/supplier"
                            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                          >
                            进入 Supplier Dashboard
                          </Link>
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

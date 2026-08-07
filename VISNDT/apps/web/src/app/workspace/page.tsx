'use client';

import { useEffect, useState, useCallback } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import { useAuth } from '@/auth/AuthProvider';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import StatCard from '@/components/workspace/StatCard';
import DemandCard from '@/components/workspace/DemandCard';
import RFQCard from '@/components/workspace/RFQCard';
import WorkspaceEmpty from '@/components/workspace/WorkspaceEmpty';
import { getDemands } from '@/services/demand.service';
import { getRfqs } from '@/services/rfq.service';
import type { DemandItem } from '@/lib/api/demands';
import type { RfqItem } from '@/lib/api/rfqs';

function WorkspaceContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [demands, setDemands] = useState<DemandItem[]>([]);
  const [rfqs, setRfqs] = useState<RfqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [demandsRes, rfqsRes] = await Promise.allSettled([
          getDemands(1, 5),
          getRfqs(),
        ]);

        if (demandsRes.status === 'fulfilled') {
          setDemands(demandsRes.value.data || []);
        }
        if (rfqsRes.status === 'fulfilled') {
          setRfqs(rfqsRes.value.data || []);
        }
      } catch {
        // graceful fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Welcome */}
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user?.organizationId
                  ? '组织工作区'
                  : '个人工作区'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                一站式管理您的需求、询价和匹配。
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="我的需求"
                value={isLoading ? '...' : demands.length}
                description="活跃需求列表"
                icon="📋"
              />
              <StatCard
                label="收到的询价"
                value={isLoading ? '...' : rfqs.length}
                description="收到的询价单"
                icon="📄"
              />
              <StatCard
                label="组织"
                value={user?.organizationId ? '已激活' : '待处理'}
                icon="🏢"
              />
            </div>

            {/* 最近需求 */}
            <section>
              <h3 className="font-semibold text-slate-900 mb-3">
                最近需求
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-slate-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : demands.length > 0 ? (
                <div className="space-y-3">
                  {demands.slice(0, 5).map((d) => (
                    <DemandCard
                      key={d.id}
                      id={d.id}
                      title={d.title}
                      status={d.status}
                      category={d.category?.name}
                      createdAt={d.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <WorkspaceEmpty
                  title="暂无需求"
                  message="您还没有创建任何需求。"
                  actionLabel="浏览产品"
                  actionHref="/products"
                />
              )}
            </section>

            {/* 最近询价 */}
            <section>
              <h3 className="font-semibold text-slate-900 mb-3">
                最近询价
              </h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-slate-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : rfqs.length > 0 ? (
                <div className="space-y-3">
                  {rfqs.slice(0, 5).map((r) => (
                    <RFQCard
                      key={r.id}
                      id={r.id}
                      title={r.title}
                      status={r.status}
                      createdAt={r.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <WorkspaceEmpty
                  title="暂无询价"
                  message="您的组织尚未收到任何询价。"
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <AuthGuard>
      <WorkspaceContent />
    </AuthGuard>
  );
}
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
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Welcome */}
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user?.organizationId
                  ? 'Organization Workspace'
                  : 'Personal Workspace'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Manage your demands, RFQs, and matches in one place.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="My Demands"
                value={isLoading ? '...' : demands.length}
                description="Active demand listings"
                icon="📋"
              />
              <StatCard
                label="RFQs Received"
                value={isLoading ? '...' : rfqs.length}
                description="Incoming RFQs"
                icon="📄"
              />
              <StatCard
                label="Organization"
                value={user?.organizationId ? 'Active' : 'Pending'}
                icon="🏢"
              />
            </div>

            {/* Recent Demands */}
            <section>
              <h3 className="font-semibold text-slate-900 mb-3">
                Recent Demands
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
                  title="No demands yet"
                  message="You have not created any demand listings yet."
                  actionLabel="Browse Products"
                  actionHref="/products"
                />
              )}
            </section>

            {/* Recent RFQs */}
            <section>
              <h3 className="font-semibold text-slate-900 mb-3">
                Recent RFQs
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
                  title="No RFQs yet"
                  message="No RFQs have been received for your organization."
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
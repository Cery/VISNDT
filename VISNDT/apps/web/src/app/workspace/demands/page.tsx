'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import DemandList from '@/components/demand/DemandList';
import { getDemands } from '@/services/demand.service';
import type { DemandItem } from '@/lib/api/demands';

function DemandsContent() {
  const [demands, setDemands] = useState<DemandItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getDemands(1, 50);
        setDemands(res.data || []);
      } catch {
        // graceful fallback
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col">
        <WorkspaceHeader />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Demands</h2>
              <p className="text-slate-500 text-sm mt-1">
                View and manage your demand listings.
              </p>
            </div>
            <DemandList demands={demands} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemandsPage() {
  return (
    <AuthGuard>
      <DemandsContent />
    </AuthGuard>
  );
}
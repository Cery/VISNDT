'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import RFQList from '@/components/rfq/RFQList';
import { getRfqs } from '@/services/rfq.service';
import type { RfqItem } from '@/lib/api/rfqs';

function RfqsContent() {
  const [rfqs, setRfqs] = useState<RfqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getRfqs();
        setRfqs(res.data || []);
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
              <h2 className="text-xl font-bold text-slate-900">RFQs</h2>
              <p className="text-slate-500 text-sm mt-1">
                View and respond to Requests for Quotation.
              </p>
            </div>
            <RFQList rfqs={rfqs} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RfqsPage() {
  return (
    <AuthGuard>
      <RfqsContent />
    </AuthGuard>
  );
}
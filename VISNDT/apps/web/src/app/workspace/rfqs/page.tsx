'use client';

import { useEffect, useState, useCallback } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import RFQList from '@/components/rfq/RFQList';
import { getRfqs } from '@/services/rfq.service';
import type { RfqItem } from '@/lib/api/rfqs';

function RfqsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [rfqs, setRfqs] = useState<RfqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await getRfqs();
        setRfqs(res.data || []);
      } catch {
        setError('Unable to load RFQs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">RFQs</h2>
              <p className="text-slate-500 text-sm mt-1">
                View and respond to Requests for Quotation.
              </p>
            </div>
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => {
                    setError('');
                    setIsLoading(true);
                    getRfqs()
                      .then((res) => setRfqs(res.data || []))
                      .catch(() =>
                        setError('Unable to load RFQs. Please try again.'),
                      )
                      .finally(() => setIsLoading(false));
                  }}
                  className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            ) : (
              <RFQList rfqs={rfqs} isLoading={isLoading} />
            )}
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
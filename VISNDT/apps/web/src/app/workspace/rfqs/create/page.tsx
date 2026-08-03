'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import { getMyDemands } from '@/lib/api/demands';
import { createRfq } from '@/lib/api/rfqs';

export default function RfqCreatePage() {
  return (
    <AuthGuard>
      <RfqCreateContent />
    </AuthGuard>
  );
}

function RfqCreateContent() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const [selectedDemandId, setSelectedDemandId] = useState('');
  const [error, setError] = useState('');

  const {
    data: demandsData,
    isLoading: demandsLoading,
    isError: demandsError,
  } = useQuery({
    queryKey: ['my-demands'],
    queryFn: () => getMyDemands(1, 100),
  });

  const demands = demandsData?.data ?? [];

  const mutation = useMutation({
    mutationFn: () => createRfq({ demandId: selectedDemandId }),
    onSuccess: () => {
      router.push('/workspace/rfqs');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemandId) {
      setError('Please select a demand');
      return;
    }
    setError('');
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Create RFQ
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Create a Request for Quotation from one of your demands.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg border border-slate-200 p-6 space-y-5"
            >
              {/* Demand Selection */}
              <div>
                <label
                  htmlFor="demandId"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Select Demand <span className="text-red-500">*</span>
                </label>

                {demandsLoading ? (
                  <div className="flex items-center gap-2 py-3">
                    <svg
                      className="animate-spin h-4 w-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span className="text-sm text-slate-400">
                      Loading demands...
                    </span>
                  </div>
                ) : demandsError ? (
                  <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Unable to load demands. Please try again later.
                  </div>
                ) : demands.length === 0 ? (
                  <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                    <p className="mb-2">
                      No demands found. You need to create a demand first.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/workspace/demands/create')}
                      className="text-amber-800 underline hover:text-amber-900"
                    >
                      Create a demand →
                    </button>
                  </div>
                ) : (
                  <select
                    id="demandId"
                    value={selectedDemandId}
                    onChange={(e) => {
                      setSelectedDemandId(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 ${
                      error ? 'border-red-400' : 'border-slate-300'
                    }`}
                  >
                    <option value="">-- Select a demand --</option>
                    {demands.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                )}
                {error && (
                  <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
              </div>

              {/* Selected Demand Preview */}
              {selectedDemandId && demands.length > 0 && (
                <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1">
                    Selected Demand
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {demands.find((d) => d.id === selectedDemandId)?.title}
                  </p>
                </div>
              )}

              {/* API Error */}
              {mutation.isError && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {(mutation.error as Error)?.message ||
                    'Failed to create RFQ. Please try again.'}
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending || demands.length === 0}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create RFQ'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/workspace/rfqs')}
                  className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
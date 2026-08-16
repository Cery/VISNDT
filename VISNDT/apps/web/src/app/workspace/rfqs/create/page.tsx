'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getDemands } from '@/services/demand.service';
import { createRfq } from '@/services/rfq.service';

export default function RfqCreatePage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <RfqCreateContent />
      </RoleGuard>
    </AuthGuard>
  );
}

function RfqCreateContent() {
  const router = useRouter();

  const [selectedDemandId, setSelectedDemandId] = useState('');
  const [error, setError] = useState('');

  const {
    data: demandsData,
    isLoading: demandsLoading,
    isError: demandsError,
  } = useQuery({
    queryKey: ['my-demands'],
    queryFn: () => getDemands(1, 100),
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
      setError('请选择一个需求');
      return;
    }
    setError('');
    mutation.mutate();
  };

  return (
    <WorkspaceLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            创建询价
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            从您的需求中创建询价单。
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 space-y-5"
        >
              {/* Demand Selection */}
              <div>
                <label
                  htmlFor="demandId"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  选择需求 <span className="text-red-500">*</span>
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
                      加载需求中...
                    </span>
                  </div>
                ) : demandsError ? (
                  <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    加载需求失败，请稍后重试。
                  </div>
                ) : demands.length === 0 ? (
                  <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                    <p className="mb-2">
                      没有找到需求。请先创建一个需求。
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/workspace/demands/create')}
                      className="text-amber-800 underline hover:text-amber-900"
                    >
                      创建需求 →
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
                    <option value="">-- 请选择需求 --</option>
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
                    已选需求
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
                    '创建询价失败，请重试。'}
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={mutation.isPending || demands.length === 0}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      创建中...
                    </>
                  ) : (
                    '创建询价'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/workspace/rfqs')}
                  className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
      </div>
    </WorkspaceLayout>
  );
}

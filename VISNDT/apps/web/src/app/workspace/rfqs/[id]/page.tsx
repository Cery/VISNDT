'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import RFQDetail from '@/components/rfq/RFQDetail';
import RFQResponseList from '@/components/rfq/RFQResponseList';
import {
  getRfq,
  getRfqResponses,
  publishRfq,
  closeRfq,
  viewRfqResponse,
  acceptRfqResponse,
  rejectRfqResponse,
} from '@/services/rfq.service';
import type { RfqDetailItem, RfqResponseItem } from '@/lib/api/rfqs';

const DECISION_READY_STATUSES = new Set(['SUBMITTED', 'VIEWED']);

function getResponseStatusLabel(status: string) {
  switch (status) {
    case 'SUBMITTED':
      return 'SUBMITTED';
    case 'VIEWED':
      return 'VIEWED';
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'REJECTED':
      return 'REJECTED';
    default:
      return status || 'UNKNOWN';
  }
}

function getResponseStatusClassName(status: string) {
  switch (status) {
    case 'SUBMITTED':
      return 'border-sky-200 bg-sky-50 text-sky-700';
    case 'VIEWED':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'ACCEPTED':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'REJECTED':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700';
  }
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mapDecisionError(action: 'accept' | 'reject') {
  return action === 'accept' ? '接受响应失败，请稍后重试。' : '拒绝响应失败，请稍后重试。';
}

function RfqDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [rfq, setRfq] = useState<RfqDetailItem | null>(null);
  const [responses, setResponses] = useState<RfqResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [decisionLoadingId, setDecisionLoadingId] = useState('');
  const [reviewError, setReviewError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setReviewError('');
    try {
      const [rfqRes, responsesRes] = await Promise.allSettled([
        getRfq(id),
        getRfqResponses(id, 1, 50),
      ]);

      if (rfqRes.status === 'fulfilled') {
        setRfq(rfqRes.value);
      } else {
        setError('加载询价失败，可能不存在或无权访问。');
        return;
      }

      if (responsesRes.status === 'fulfilled') {
        setResponses(responsesRes.value.data || []);
      }
    } catch {
      setError('发生意外错误。');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = useCallback(async () => {
    setActionLoading('publish');
    try {
      const updated = await publishRfq(id);
      setRfq(updated);
    } catch {
      setError('发布询价失败。');
    } finally {
      setActionLoading('');
    }
  }, [id]);

  const handleClose = useCallback(async () => {
    setActionLoading('close');
    try {
      const updated = await closeRfq(id);
      setRfq(updated);
    } catch {
      setError('关闭询价失败。');
    } finally {
      setActionLoading('');
    }
  }, [id]);

  const canPublish = rfq?.status === 'DRAFT';
  const canClose = rfq?.status === 'OPEN' || rfq?.status === 'RESPONDING';

  const updateResponseInState = useCallback((updated: RfqResponseItem) => {
    setResponses((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    );
  }, []);

  const handleDecision = useCallback(async (
    response: RfqResponseItem,
    action: 'accept' | 'reject',
  ) => {
    setDecisionLoadingId(response.id);
    setReviewError('');

    try {
      let currentResponse = response;

      if (currentResponse.status === 'SUBMITTED') {
        currentResponse = await viewRfqResponse(currentResponse.id);
        updateResponseInState(currentResponse);
      }

      const updated = action === 'accept'
        ? await acceptRfqResponse(currentResponse.id)
        : await rejectRfqResponse(currentResponse.id);

      updateResponseInState(updated);
    } catch {
      setReviewError(mapDecisionError(action));
    } finally {
      setDecisionLoadingId('');
    }
  }, [updateResponseInState]);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto">
            {/* Back button */}
            <button
              onClick={() => router.push('/workspace/rfqs')}
              className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1 transition-colors"
            >
              ← 返回询价列表
            </button>

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                <div className="h-32 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
              </div>
            ) : rfq ? (
              <>
                {/* Action buttons */}
                {!isLoading && rfq && (
                  <div className="flex items-center gap-2 mb-6">
                    {canPublish && (
                      <button
                        onClick={handlePublish}
                        disabled={actionLoading === 'publish'}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === 'publish' ? '发布中...' : '发布'}
                      </button>
                    )}
                    {canClose && (
                      <button
                        onClick={handleClose}
                        disabled={actionLoading === 'close'}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === 'close' ? '关闭中...' : '关闭'}
                      </button>
                    )}
                  </div>
                )}
                <RFQDetail rfq={rfq} responseCount={responses.length} />
                <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        Response Review
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Buyer 在此完成 RFQ Response 的审核与 Accept / Reject 决策。
                      </p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      共 {responses.length} 条响应
                    </div>
                  </div>

                  {reviewError ? (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {reviewError}
                    </div>
                  ) : null}

                  {responses.length === 0 ? (
                    <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                      当前还没有供应商响应，暂时无需进行决策。
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {responses.map((response) => {
                        const organizationName = response.organization?.name || '未命名供应商';
                        const canDecide = DECISION_READY_STATUSES.has(response.status);
                        const isPending = decisionLoadingId === response.id;

                        return (
                          <div
                            key={response.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900">
                                    {organizationName}
                                  </p>
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getResponseStatusClassName(response.status)}`}
                                  >
                                    {getResponseStatusLabel(response.status)}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                  提交时间：{formatDateTime(response.createdAt)}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => void handleDecision(response, 'accept')}
                                  disabled={!canDecide || isPending}
                                  className="rounded-md border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500"
                                >
                                  {isPending ? '处理中...' : 'Accept'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDecision(response, 'reject')}
                                  disabled={!canDecide || isPending}
                                  className="rounded-md border border-rose-600 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                  {isPending ? '处理中...' : 'Reject'}
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                  Offer
                                </p>
                                <p className="mt-2 text-sm text-slate-700">
                                  {response.offer?.title || response.offerId || '未关联 Offer'}
                                </p>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-white p-3">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                  Message
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                  {response.message?.trim() || '供应商未填写说明。'}
                                </p>
                              </div>
                            </div>

                            {!canDecide ? (
                              <p className="mt-3 text-xs text-slate-500">
                                当前状态为 {getResponseStatusLabel(response.status)}，该响应已完成决策，不再提供操作。
                              </p>
                            ) : response.status === 'SUBMITTED' ? (
                              <p className="mt-3 text-xs text-slate-500">
                                首次决策会先调用现有 `view` decision API，再继续执行 Accept / Reject。
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <h2 className="text-sm font-semibold text-slate-700 mb-3">
                    响应详情
                  </h2>
                  <RFQResponseList responses={responses} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RfqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <RfqDetailContent id={id} />
      </RoleGuard>
    </AuthGuard>
  );
}

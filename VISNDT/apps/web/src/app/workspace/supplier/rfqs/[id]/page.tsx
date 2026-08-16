'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import RFQStatusBadge from '@/components/rfq/RFQStatusBadge';
import RFQResponseStatusBadge from '@/components/rfq/RFQResponseStatusBadge';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import { getRfq, createRfqResponse, getMyRfqResponses } from '@/services/rfq.service';
import { ApiError } from '@/lib/api-client';

type BaseRfqDetail = Awaited<ReturnType<typeof getRfq>>;

interface SupplierDemandParameter {
  id: string;
  name: string;
  value: string;
  unit?: string | null;
}

interface SupplierDemandOrganization {
  id: string;
  name?: string | null;
  type?: string | null;
  status?: string | null;
}

type SupplierDemandSummary = NonNullable<BaseRfqDetail['demand']> & {
  organization?: SupplierDemandOrganization | null;
  parameters?: SupplierDemandParameter[] | null;
  parameterValues?: SupplierDemandParameter[] | null;
};

type SupplierRfqDetail = Omit<BaseRfqDetail, 'demand'> & {
  demand?: SupplierDemandSummary | null;
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return '暂无';
  }

  return new Date(value).toLocaleString('zh-CN');
}

function getDemandParameters(rfq: SupplierRfqDetail) {
  return rfq.demand?.parameters || rfq.demand?.parameterValues || [];
}

function mapRfqResponseError(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.status) {
      case 404:
        return 'RFQ 不存在，可能已被删除。';
      case 400:
        if (err.message.includes('not published') || err.message.includes('未发布') || err.message.includes('OPEN') || err.message.includes('publishedAt')) {
          return '当前 RFQ 未开放响应，请等待发布后再试。';
        }
        if (err.message.includes('offer') || err.message.includes('Offer')) {
          return '所选 Offer 非法或不属于您的组织，请检查后重试。';
        }
        if (err.message.includes('organization') || err.message.includes('member') || err.message.includes('组织') || err.message.includes('成员')) {
          return '您不是有效组织成员，无法提交 RFQ 响应。';
        }
        return err.message || '提交失败，请求参数有误。';
      case 403:
        if (err.message.includes('organization') || err.message.includes('member') || err.message.includes('组织') || err.message.includes('成员')) {
          return '您不是有效组织成员，无法提交 RFQ 响应。';
        }
        return err.message || '无权限执行此操作。';
      case 409:
        return '您已对此 RFQ 提交过响应，请勿重复提交。';
      case 401:
        return '登录状态已过期，请重新登录。';
      default:
        return err.message || `提交失败（${err.status}），请稍后重试。`;
    }
  }
  return '提交失败，网络异常或服务暂时不可用。';
}

function SupplierRfqDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((value) => !value), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [rfq, setRfq] = useState<SupplierRfqDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [responseMessage, setResponseMessage] = useState('');
  const [responseOfferId, setResponseOfferId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [existingResponse, setExistingResponse] = useState<{
    id: string;
    status: string;
    createdAt: string;
    message?: string | null;
  } | null>(null);
  const [isCheckingResponse, setIsCheckingResponse] = useState(true);

  const loadRfq = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getRfq(id);
      setRfq(result);
    } catch {
      setError('加载询价详情失败，可能不存在或暂时无法访问。');
      setRfq(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const checkExistingResponse = useCallback(async () => {
    setIsCheckingResponse(true);
    try {
      const result = await getMyRfqResponses(1, 50);
      const matched = (result.data ?? []).find((r) => r.rfqId === id);
      if (matched) {
        setExistingResponse({
          id: matched.id,
          status: matched.status,
          createdAt: matched.createdAt,
          message: matched.message,
        });
      }
    } catch {
      // Non-critical; silently skip
    } finally {
      setIsCheckingResponse(false);
    }
  }, [id]);

  useEffect(() => {
    void loadRfq();
    void checkExistingResponse();
  }, [loadRfq, checkExistingResponse]);

  const handleSubmitResponse = useCallback(async () => {
    setSubmitError('');
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      const payload: { message?: string; offerId?: string } = {};
      const trimmedMessage = responseMessage.trim();
      const trimmedOfferId = responseOfferId.trim();
      if (trimmedMessage) {
        payload.message = trimmedMessage;
      }
      if (trimmedOfferId) {
        payload.offerId = trimmedOfferId;
      }

      await createRfqResponse(id, payload);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(mapRfqResponseError(err));
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [id, responseMessage, responseOfferId]);

  const demandTitle = rfq?.demand?.title || rfq?.title || '未命名需求';
  const demandDescription =
    rfq?.demand?.description?.trim() || rfq?.description?.trim() || '';
  const demandParameters = rfq ? getDemandParameters(rfq) : [];
  const demandOrganization = rfq?.demand?.organization;

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="mx-auto max-w-[1200px]">
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => router.push('/workspace/supplier/rfqs')}
                className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-700"
              >
                ← 返回供应商询价列表
              </button>

              {isLoading ? (
                <div className="rounded-xl border border-slate-200 bg-white">
                  <Loading />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <ErrorState message={error} onRetry={() => void loadRfq()} />
                </div>
              ) : !rfq ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <EmptyState message="未找到可展示的 RFQ 详情。" />
                </div>
              ) : (
                <>
                  <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <RFQStatusBadge status={rfq.status} />
                          <span className="text-xs text-slate-400">RFQ ID: {rfq.id}</span>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-slate-900">{demandTitle}</h1>
                          <p className="mt-1 text-sm text-slate-500">查看 RFQ 详情并提交您的响应</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('rfq-response-form');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="rounded-md border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        响应此RFQ
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Status
                        </p>
                        <div className="mt-2">
                          <RFQStatusBadge status={rfq.status} />
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Published At
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          {formatDateTime(rfq.publishedAt)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Created At
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          {formatDateTime(rfq.createdAt)}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Demand 信息</h2>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          标题
                        </p>
                        <p className="mt-2 text-base font-medium text-slate-900">{demandTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          描述
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {demandDescription || '暂无需求描述'}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Demand 参数</h2>
                    <div className="mt-4">
                      {demandParameters.length > 0 ? (
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="w-1/3 px-4 py-2.5 text-left font-medium text-slate-600">
                                  参数
                                </th>
                                <th className="px-4 py-2.5 text-left font-medium text-slate-600">
                                  值
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {demandParameters.map((parameter) => (
                                <tr
                                  key={parameter.id}
                                  className="transition-colors hover:bg-slate-50"
                                >
                                  <td className="px-4 py-2.5 font-medium text-slate-700">
                                    {parameter.name}
                                  </td>
                                  <td className="px-4 py-2.5 text-slate-600">
                                    {parameter.value}
                                    {parameter.unit ? (
                                      <span className="ml-1 text-slate-400">
                                        {parameter.unit}
                                      </span>
                                    ) : null}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          当前详情接口未返回需求参数，页面不额外扩展 API。
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">需求所属组织</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      {demandOrganization ? (
                        <>
                          <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
                            <span className="text-slate-500">组织名称</span>
                            <span className="font-medium text-slate-900">
                              {demandOrganization.name || '暂无'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
                            <span className="text-slate-500">组织类型</span>
                            <span className="font-medium text-slate-900">
                              {demandOrganization.type || '暂无'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
                            <span className="text-slate-500">组织状态</span>
                            <span className="font-medium text-slate-900">
                              {demandOrganization.status || '暂无'}
                            </span>
                          </div>
                        </>
                      ) : rfq.demand?.organizationId ? (
                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-slate-500">当前接口仅返回组织标识</p>
                          <p className="mt-2 break-all font-medium text-slate-900">
                            {rfq.demand.organizationId}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          当前详情接口未返回组织详细信息，页面不额外扩展 API。
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">产品匹配信息</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      以下展示该 RFQ 关联需求的匹配上下文，帮助您了解采购方的产品要求。
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Demand ID
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-900">
                          {rfq.demandId || rfq.demand?.id || '暂无'}
                        </p>
                      </div>
                      {demandParameters.length > 0 ? (
                        <div className="rounded-lg bg-slate-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            匹配参数
                          </p>
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {demandParameters.map((p) => (
                              <div key={p.id} className="flex items-center gap-2 rounded bg-white px-3 py-2">
                                <span className="text-sm font-medium text-slate-700">{p.name}:</span>
                                <span className="text-sm text-slate-600">{p.value}{p.unit ? ` ${p.unit}` : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">暂无产品匹配参数信息。</p>
                      )}
                    </div>
                  </section>

                  {!isCheckingResponse && existingResponse ? (
                    <section className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-blue-900">您的响应状态</h3>
                          <p className="mt-1 text-sm text-blue-700">
                            您已对此 RFQ 提交了响应，当前状态如下：
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <RFQResponseStatusBadge status={existingResponse.status} />
                            <span className="text-xs text-blue-500">
                              提交时间：{formatDateTime(existingResponse.createdAt)}
                            </span>
                          </div>
                          {existingResponse.message ? (
                            <div className="mt-3 rounded bg-white/60 p-3">
                              <p className="text-xs text-slate-500">您的响应说明：</p>
                              <p className="mt-1 text-sm text-slate-700">{existingResponse.message}</p>
                            </div>
                          ) : null}
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => router.push('/workspace/supplier/responses')}
                              className="text-sm font-medium text-blue-700 underline hover:text-blue-900"
                            >
                              查看所有响应记录 →
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  ) : null}

                  <section
                    id="rfq-response-form"
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <h2 className="text-lg font-semibold text-slate-900">响应此 RFQ</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      填写以下信息并提交。Offer ID 为可选，message 为必填或选填按实际需要。
                    </p>

                    {submitSuccess ? (
                      <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.42 0l-4-4a1 1 0 011.42-1.42L8 12.58l7.29-7.29a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-emerald-800">响应提交成功</p>
                            <p className="mt-1 text-sm text-emerald-700">
                              您的 RFQ 响应已成功提交。无需刷新页面，如需再次提交请先联系管理员（同一组织对同一 RFQ 仅允许一次响应）。
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        <div>
                          <label
                            htmlFor="response-offer-id"
                            className="block text-sm font-medium text-slate-700"
                          >
                            Offer ID（可选）
                          </label>
                          <p className="mt-1 text-xs text-slate-500">
                            如果您希望关联已发布的 Offer，请填写 Offer ID；留空则不绑定 Offer。
                          </p>
                          <input
                            id="response-offer-id"
                            type="text"
                            value={responseOfferId}
                            onChange={(e) => setResponseOfferId(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="例如：off_xxxxxx"
                            className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="response-message"
                            className="block text-sm font-medium text-slate-700"
                          >
                            响应消息（可选）
                          </label>
                          <p className="mt-1 text-xs text-slate-500">
                            向需求方补充说明，例如交货周期、报价细节或其他备注。
                          </p>
                          <textarea
                            id="response-message"
                            rows={5}
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="请输入您对此 RFQ 的响应说明……"
                            className="mt-2 block w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                          />
                        </div>

                        {submitError ? (
                          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                                <svg
                                  className="h-3 w-3"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-rose-800">提交失败</p>
                                <p className="mt-1 text-sm text-rose-700">{submitError}</p>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setResponseMessage('');
                              setResponseOfferId('');
                              setSubmitError('');
                              setSubmitSuccess(false);
                            }}
                            disabled={isSubmitting}
                            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            清空
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleSubmitResponse()}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 rounded-md border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSubmitting ? (
                              <>
                                <svg
                                  className="h-4 w-4 animate-spin"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  aria-hidden="true"
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
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  />
                                </svg>
                                提交中...
                              </>
                            ) : (
                              <>提交响应</>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierRfqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierRfqDetailContent id={id} />
      </RoleGuard>
    </AuthGuard>
  );
}

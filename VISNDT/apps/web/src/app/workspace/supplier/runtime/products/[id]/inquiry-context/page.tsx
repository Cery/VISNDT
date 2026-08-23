'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import StatCard from '@/components/workspace/StatCard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getSupplierRuntimeInquiryContext } from '@/services/workspace.service';

/**
 * Supplier Runtime — Buyer Inquiry Context View (read-only).
 * 661.3 M28.0. Surface the Buyer Interest (Inquiry) linked to a SupplierProduct's
 * Platform Capability. Pure read-side; no response / order / payment action here —
 * the commercial response entry is OUT of this runtime boundary.
 */

function formatDateTime(value?: string | null): string {
  if (!value) {
    return '暂无';
  }
  return new Date(value).toLocaleString('zh-CN');
}

function formatMessagePreview(message: string): string {
  return message.length > 220 ? `${message.slice(0, 220)}…` : message;
}

function SupplierInquiryContextContent() {
  const params = useParams<{ id: string }>();
  const supplierProductId = params.id;

  const contextQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'runtime', 'inquiry-context', supplierProductId],
    queryFn: () => getSupplierRuntimeInquiryContext(supplierProductId),
    enabled: !!supplierProductId,
  });

  const context = contextQuery.data;

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1100px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/workspace/supplier/runtime"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← 返回 Supplier Runtime
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">买方兴趣上下文</h1>
            <p className="mt-1 text-sm text-slate-500">
              只读呈现 Buyer Interest。该边界不执行商业响应，不涉及订单 / 支付 / 合同。
            </p>
          </div>
        </div>

        {contextQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white">
            <Loading />
          </div>
        ) : contextQuery.isError || !context ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState
              message="加载买方兴趣上下文失败，请稍后重试。"
              onRetry={() => void contextQuery.refetch()}
            />
          </div>
        ) : (
          <>
            {/* Model context */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Supplier Model</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {context.supplierModelLabel}
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                  {context.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                能力锚点：{context.platformProductName}
              </p>
            </section>

            {/* Inquiry list */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-industrial-cyan rounded-full" />
                <h2 className="text-lg font-semibold text-slate-900">买方兴趣</h2>
                <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {context.total} 条
                </span>
              </div>

              {context.inquiries.length === 0 ? (
                <EmptyState message="该能力型号暂无买方兴趣。" />
              ) : (
                <div className="space-y-3">
                  {context.inquiries.map((inquiry) => (
                    <article
                      key={inquiry.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-900">
                            {inquiry.contactName || '匿名买方'}
                          </p>
                          <p className="text-xs text-slate-400">{formatDateTime(inquiry.createdAt)}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                          {inquiry.status ?? '—'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-700">{formatMessagePreview(inquiry.message)}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierInquiryContextPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierInquiryContextContent />
      </RoleGuard>
    </AuthGuard>
  );
}
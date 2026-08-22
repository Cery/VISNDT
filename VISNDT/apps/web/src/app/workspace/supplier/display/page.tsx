'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import StatCard from '@/components/workspace/StatCard';
import SupplierPublicProfile from '@/components/supplier/SupplierPublicProfile';
import SupplierOfferList from '@/components/supplier/SupplierOfferList';
import { getOrganization } from '@/services/organization.service';
import { getOffers } from '@/services/offer.service';
import { getSupplierWorkspaceOverview } from '@/services/workspace.service';
import type { Organization } from '@/types/organization';
import type { Offer } from '@/types/product';

/** 供应商类型中文映射 */
const typeLabels: Record<string, string> = {
  manufacturer: '制造商',
  distributor: '经销商',
  agent: '代理商',
  'service-provider': '服务商',
  integrator: '集成商',
  'testing-organization': '检测机构',
  other: '其他',
};

/** 供应商状态中文映射 */
const statusLabels: Record<string, string> = {
  ACTIVE: '活跃',
  INACTIVE: '未激活',
  SUSPENDED: '已暂停',
};

/** Offer 状态中文映射 */
const offerStatusLabels: Record<string, string> = {
  DRAFT: '草稿',
  ACTIVE: '已发布',
  INACTIVE: '已下架',
  SUBMITTED: '已提交',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
  WITHDRAWN: '已撤回',
};

function formatDate(value?: string | null) {
  if (!value) return '暂无';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function computeDisplayCompleteness(
  org: Organization | null,
  offers: Offer[],
): { score: number; completed: string[]; missing: string[] } {
  const items: { label: string; ok: boolean }[] = [
    { label: '企业名称', ok: Boolean(org?.name) },
    { label: '企业类型', ok: Boolean(org?.type) },
    { label: '企业状态', ok: org?.status === 'ACTIVE' },
    {
      label: '活跃供应',
      ok: offers.some((o) => o.status === 'ACTIVE' || o.status === 'SUBMITTED'),
    },
    { label: '产品关联', ok: offers.some((o) => Boolean(o.productId)) },
  ];

  const completed = items.filter((i) => i.ok).map((i) => i.label);
  const missing = items.filter((i) => !i.ok).map((i) => i.label);
  const score = Math.round((completed.length / items.length) * 100);

  return { score, completed, missing };
}

function DisplayPageContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const orgId = user?.organizationId ?? '';

  const orgQuery = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => getOrganization(orgId),
    enabled: Boolean(orgId),
  });

  const offersQuery = useQuery({
    queryKey: ['offers', 'organization', orgId],
    queryFn: () => getOffers({ organizationId: orgId, pageSize: 50 }),
    enabled: Boolean(orgId),
  });

  const overviewQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'overview'],
    queryFn: getSupplierWorkspaceOverview,
  });

  const org = orgQuery.data ?? null;
  const offers = offersQuery.data?.data ?? [];
  const activeOffers = offers.filter(
    (o) => o.status === 'ACTIVE' || o.status === 'SUBMITTED',
  );
  const categories = new Set(
    offers
      .map((o) => (o as Offer & { product?: { category?: { name?: string } } }).product)
      .filter(Boolean)
      .map((p) => (p as { category?: { name?: string } }).category?.name)
      .filter(Boolean),
  );
  const completeness = computeDisplayCompleteness(org, offers);

  const isLoading = orgQuery.isLoading || offersQuery.isLoading;
  const isError = orgQuery.isError || offersQuery.isError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
        <div className="flex min-w-0 flex-1 flex-col">
          <WorkspaceHeader onMenuToggle={toggleSidebar} />
          <div className="flex-1 bg-slate-50 p-6">
            <div className="mx-auto max-w-[1200px]"><Loading /></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen">
        <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
        <div className="flex min-w-0 flex-1 flex-col">
          <WorkspaceHeader onMenuToggle={toggleSidebar} />
          <div className="flex-1 bg-slate-50 p-6">
            <div className="mx-auto max-w-[1200px]">
              <ErrorState
                message="加载展示管理数据失败，请稍后重试。"
                onRetry={() => {
                  void orgQuery.refetch();
                  void offersQuery.refetch();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="mx-auto max-w-[1200px] space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">展示管理</h1>
                <p className="mt-1 text-sm text-slate-500">
                  查看和管理供应商公开展示能力。所有数据基于现有报价和组织，无需新增 Schema。
                </p>
              </div>
              <div className="text-sm text-slate-500">
                当前角色：{user?.workspaceRole ?? '未配置'}
              </div>
            </div>

            {/* Module 1: Display Overview */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">展示概览</h2>
                <p className="mt-1 text-sm text-slate-500">
                  供应商公开展示能力概览，包括活跃报价数量、产品覆盖和展示完整度。
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="活跃报价"
                  value={activeOffers.length}
                  description={`总计 ${offers.length} 个报价`}
                  icon="package"
                />
                <StatCard
                  label="产品覆盖"
                  value={new Set(offers.map((o) => o.productId)).size}
                  description={`覆盖 ${categories.size} 个分类`}
                  icon="tag"
                />
                <StatCard
                  label="RFQ 机会"
                  value={overviewQuery.data?.rfqSummary?.total ?? 0}
                  description="当前定向 RFQ 总数"
                  icon="file"
                />
                <StatCard
                  label="展示完整度"
                  value={`${completeness.score}%`}
                  description={`${completeness.completed.length}/${completeness.completed.length + completeness.missing.length} 项完成`}
                  icon="check"
                />
              </div>
              {/* Completeness Detail */}
              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs font-medium text-slate-500 mb-2">已完成</p>
                    <div className="space-y-1">
                      {completeness.completed.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="text-emerald-500">✓</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs font-medium text-slate-500 mb-2">待完善</p>
                    <div className="space-y-1">
                      {completeness.missing.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="text-amber-500">○</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Module 2: Company Identity */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">企业身份</h2>
                <p className="mt-1 text-sm text-slate-500">
                  供应商企业身份信息（只读），基于 Organization 已有字段。
                </p>
              </div>
              {org ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">企业名称</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{org.name}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">企业类型</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {typeLabels[org.type] ?? org.type}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">企业状态</p>
                    <p className="mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                          org.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-600'
                            : org.status === 'INACTIVE'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {statusLabels[org.status] ?? org.status}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">注册时间</p>
                    <p className="mt-1 text-sm text-slate-700">{formatDate(org.createdAt)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">最近更新</p>
                    <p className="mt-1 text-sm text-slate-700">{formatDate(org.updatedAt)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">公开页面</p>
                    <Link
                      href={`/suppliers/${org.id}`}
                      className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      查看公开页面
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <EmptyState message="未关联企业组织" />
              )}
            </section>

            {/* Module 3: Product Capability */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">可供货产品</h2>
                <p className="mt-1 text-sm text-slate-500">
                  基于报价关联的产品能力展示。供应商通过报价挂载到平台标准产品目录。
                </p>
              </div>
              {offers.length === 0 ? (
                <EmptyState
                  icon="package"
                  message="暂无供应产品"
                  description="当前尚未创建任何报价。报价是供应商与平台标准产品之间的供应能力表达。"
                />
              ) : (
                <div className="space-y-3">
                  {offers.map((offer) => {
                    const product = (offer as Offer & { product?: { id?: string; name?: string; model?: string | null; category?: { name?: string } } }).product;
                    return (
                      <div
                        key={offer.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                                  offer.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : offer.status === 'SUBMITTED'
                                      ? 'bg-blue-50 text-blue-600'
                                      : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {offerStatusLabels[offer.status] ?? offer.status}
                              </span>
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 truncate">
                              {offer.title}
                            </h3>
                            {offer.description && (
                              <p className="text-sm text-slate-500 line-clamp-2">
                                {offer.description}
                              </p>
                            )}
                            {product && (
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400">
                                  关联产品：{product.name}
                                </span>
                                {product.model && (
                                  <span className="text-xs text-slate-400">| {product.model}</span>
                                )}
                                {product.category?.name && (
                                  <span className="text-xs text-slate-400">
                                    | {product.category.name}
                                  </span>
                                )}
                                <Link
                                  href={`/products/${offer.productId}`}
                                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                                >
                                  查看产品详情 →
                                </Link>
                              </div>
                            )}
                          </div>
                          <div className="text-right text-xs text-slate-400 flex-shrink-0">
                            <p>创建：{formatDate(offer.createdAt)}</p>
                            <p>更新：{formatDate(offer.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Module 4: Offer Management */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">供应管理</h2>
                <p className="mt-1 text-sm text-slate-500">
                  查看报价状态与描述信息。报价 = 供应商能力表达。
                </p>
              </div>
              {offers.length === 0 ? (
                <EmptyState
                  icon="document"
                  message="暂无报价"
                  description="报价是供应商对平台标准产品的供应能力表达。当前尚未创建任何报价。"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left">
                        <th className="pb-3 font-medium text-slate-500">报价标题</th>
                        <th className="pb-3 font-medium text-slate-500 hidden sm:table-cell">描述</th>
                        <th className="pb-3 font-medium text-slate-500">状态</th>
                        <th className="pb-3 font-medium text-slate-500 hidden md:table-cell">关联产品</th>
                        <th className="pb-3 font-medium text-slate-500 hidden lg:table-cell">更新时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers.map((offer) => {
                        const product = (offer as Offer & { product?: { name?: string } }).product;
                        return (
                          <tr key={offer.id} className="border-b border-slate-100">
                            <td className="py-3 pr-4 font-medium text-slate-900 max-w-[200px] truncate">
                              {offer.title}
                            </td>
                            <td className="py-3 pr-4 text-slate-500 max-w-[250px] truncate hidden sm:table-cell">
                              {offer.description ?? '—'}
                            </td>
                            <td className="py-3 pr-4">
                              <span
                                className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                                  offer.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : offer.status === 'SUBMITTED'
                                      ? 'bg-blue-50 text-blue-600'
                                      : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {offerStatusLabels[offer.status] ?? offer.status}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-slate-600 hidden md:table-cell">
                              {product?.name ?? '—'}
                            </td>
                            <td className="py-3 text-slate-400 hidden lg:table-cell">
                              {formatDate(offer.updatedAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Module 5: Public Preview */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">公开预览</h2>
                <p className="mt-1 text-sm text-slate-500">
                  预览供应商公开页面的展示效果。以下内容与采购用户看到的公开页面一致。
                </p>
              </div>
              {org ? (
                <div className="space-y-6">
                  <SupplierPublicProfile organization={org} />
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-3">供应能力预览</h3>
                    <SupplierOfferList offers={activeOffers} />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={`/suppliers/${org.id}`}
                      className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    >
                      查看完整公开页面
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <EmptyState message="未关联企业组织，无法预览公开页面。" />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierDisplayPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <DisplayPageContent />
      </RoleGuard>
    </AuthGuard>
  );
}
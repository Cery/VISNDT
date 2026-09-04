'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import {
  deleteEvaluation,
  getMyEvaluations,
  updateEvaluation,
  getEvaluationConnectionContext,
} from '@/lib/api/evaluations';
import type { BuyerEvaluation, EvaluationState } from '@/lib/api/evaluations';
import type { PaginatedResponse } from '@/types/api';
import { getProduct } from '@/lib/api/products';
import { getOrganization } from '@/lib/api/organizations';
import EvaluationListItem from '@/components/evaluations/EvaluationListItem';
import type { EvaluationTargetContext } from '@/components/evaluations/EvaluationListItem';
import EvaluationStateFilter from '@/components/evaluations/EvaluationStateFilter';
import Pagination from '@/components/common/Pagination';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';

const PAGE_SIZE = 20;

/** Contextual fallback while a row's target context is still loading. */
function loadingContext(ev: BuyerEvaluation): EvaluationTargetContext {
  return {
    status: 'loading',
    kind: ev.targetType === 'PRODUCT' ? 'product' : 'supplier',
    productId: ev.targetId,
    productName: '',
    label: '',
  };
}

/**
 * Resolve an evaluation's target context (Product vs SupplierProduct).
 *  - Product: name from Catalog/Product authority.
 *  - SupplierProduct: connectionContext → platformProductId + supplier model label
 *    + owning Organization (type=SUPPLIER). No second supplier/connection domain.
 */
async function resolveEvaluationContext(
  ev: BuyerEvaluation,
): Promise<EvaluationTargetContext> {
  if (ev.targetType === 'PRODUCT') {
    try {
      const p = await getProduct(ev.targetId);
      return {
        status: 'ready',
        kind: 'product',
        productId: p.id,
        productName: p.name,
        label: p.name,
      };
    } catch {
      return {
        status: 'missing',
        kind: 'product',
        productId: ev.targetId,
        productName: '',
        label: '已移除的目标',
      };
    }
  }

  // SUPPLIER_PRODUCT
  let conn;
  try {
    conn = await getEvaluationConnectionContext(ev.id);
  } catch {
    return {
      status: 'missing',
      kind: 'supplier',
      productId: ev.targetId,
      productName: '',
      label: '已移除的目标',
    };
  }

  const productId = conn.productId ?? ev.targetId;
  let productName = conn.productName ?? '';
  try {
    const p = await getProduct(productId);
    productName = p.name;
  } catch {
    /* keep connection-provided name */
  }

  let orgName: string | undefined;
  if (conn.organizationId) {
    try {
      orgName = (await getOrganization(conn.organizationId)).name;
    } catch {
      /* org name optional for display */
    }
  }

  return {
    status: 'ready',
    kind: 'supplier',
    productId,
    productName,
    label: conn.supplierModelLabel || productName || '供应商型号',
    supplierLabel: conn.supplierModelLabel,
    orgId: conn.organizationId,
    orgName,
  };
}

function EvaluationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const stateFilter = searchParams.get('state') ?? 'ALL';
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [compareMessage, setCompareMessage] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-evaluations', page, PAGE_SIZE],
    queryFn: () => getMyEvaluations(page, PAGE_SIZE),
  });
  const evaluations = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = data?.totalPages ?? 0;

  // Counts per persisted state (client-side).
  const counts = useMemo(() => {
    const c: Record<string, number> = {
      INTERESTED: 0,
      SHORTLISTED: 0,
      COMPARING: 0,
      CONTACTED: 0,
    };
    for (const e of evaluations) {
      if (c[e.state] !== undefined) c[e.state] += 1;
    }
    return c;
  }, [evaluations]);

  const filtered =
    stateFilter === 'ALL'
      ? evaluations
      : evaluations.filter((e) => e.state === stateFilter);

  // Resolve target context for all loaded evaluations (batch query keyed by ids).
  const { data: contextsMap } = useQuery({
    queryKey: ['ev-contexts', evaluations.map((e) => e.id).join(',')],
    queryFn: async () => {
      const entries = await Promise.all(
        evaluations.map(async (e) => [e.id, await resolveEvaluationContext(e)] as const),
      );
      return Object.fromEntries(entries) as Record<string, EvaluationTargetContext>;
    },
    enabled: evaluations.length > 0,
  });
  const ctxFor = (e: BuyerEvaluation): EvaluationTargetContext =>
    contextsMap?.[e.id] ?? loadingContext(e);

  // ---- Mutations (existing APIs only) ----
  const updateMut = useMutation({
    mutationFn: ({ id, state }: { id: string; state: EvaluationState }) =>
      updateEvaluation(id, { state }),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ['my-evaluations', page, PAGE_SIZE],
        (old?: PaginatedResponse<BuyerEvaluation>) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((e) =>
              e.id === updated.id ? { ...e, state: updated.state } : e,
            ),
          };
        },
      );
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteEvaluation(id),
    onSuccess: (_res, id) => {
      queryClient.setQueryData(
        ['my-evaluations', page, PAGE_SIZE],
        (old?: PaginatedResponse<BuyerEvaluation>) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((e: BuyerEvaluation) => e.id !== id),
            total: Math.max(0, old.total - 1),
          };
        },
      );
      setSelectedIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  };

  // ---- Compare derivation (source = BuyerEvaluation filtered set → existing /products/compare) ----
  const buildCompare =
    (): { url: string; reason?: string } => {
      const selectedEvaluations = evaluations.filter((e) => selectedIds.has(e.id));
      const valid = selectedEvaluations.filter((e) => ctxFor(e).status === 'ready');
      if (valid.length < 2)
        return { url: '', reason: '请至少选择 2 项评估进行对比' };
      const kinds = new Set(valid.map((e) => ctxFor(e).kind));
      if (kinds.size > 1)
        return { url: '', reason: '对比对象须为同类型（能力评估或供应商供应评估）' };
      if (ctxFor(valid[0]).kind === 'product') {
        const prodIds = valid.map((e) => ctxFor(e).productId);
        return { url: `/products/compare?ids=${prodIds.join(',')}` };
      }
      // Supplier: anchor by shared platform Product, ids = SupplierProduct ids.
      const plat = new Set(valid.map((e) => ctxFor(e).productId));
      if (plat.size > 1)
        return { url: '', reason: '供应商型号分属不同能力，暂不支持跨能力对比' };
      const spIds = valid.map((e) => e.targetId);
      return {
        url: `/products/compare?type=supplier-product&capability=${[...plat][0]}&ids=${spIds.join(',')}`,
      };
    };
  const handleCompare = () => {
    const r = buildCompare();
    if (r.url) {
      setCompareMessage('');
      router.push(r.url);
    } else {
      setCompareMessage(r.reason ?? '');
    }
  };

  const handleFilterSelect = (state: string) => {
    const next = state === 'ALL' ? '' : `?state=${state}`;
    router.push(`/workspace/evaluations${next}`, { scroll: false });
  };

  const handleConnect = (ctx: EvaluationTargetContext) => {
    // Connection CTA: resolve context (already resolved) → existing product detail
    // inquiry surface (single Inquiry authority). No second connection domain.
    if (ctx.status === 'ready') {
      router.push(`/products/${ctx.productId}`);
    }
  };

  const handleDelete = (evaluation: BuyerEvaluation) => {
    const label = ctxFor(evaluation).label || '该目标';
    if (window.confirm(`确定删除对「${label}」的评估吗？`)) {
      deleteMut.mutate(evaluation.id);
    }
  };

  const hasAny = evaluations.length > 0;
  const isEmptyAll = !isLoading && !isError && hasAny === false;
  const isEmptyFiltered = !isLoading && !isError && hasAny && filtered.length === 0;

  return (
    <WorkspaceLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">我的评估</h2>
          <p className="mt-1 text-sm text-slate-500">
            管理您对检测能力与供应商供应的评估状态，并可发起询价。
          </p>
        </div>

        <EvaluationStateFilter
          current={stateFilter}
          counts={counts}
          onSelect={handleFilterSelect}
        />

        {/* Transient compare selection bar */}
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-sm text-slate-600">
              已选择 <span className="font-semibold text-slate-900">{selectedIds.size}</span>{' '}
              项评估用于对比
              {compareMessage && (
                <span className="ml-2 text-xs text-amber-600">{compareMessage}</span>
              )}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                取消选择
              </button>
              <button
                type="button"
                onClick={handleCompare}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M7 4v8M17 12v8M5 4h.01M19 20h.01" />
                </svg>
                开始对比
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && <Loading />}

        {/* Error */}
        {isError && !isLoading && (
          <ErrorState
            message={
              error instanceof Error ? error.message : '加载评估失败'
            }
            onRetry={() => refetch()}
          />
        )}

        {/* Empty (no evaluations at all) */}
        {isEmptyAll && (
          <EmptyState
            icon="package"
            title="尚无评估"
            message="去发现并评估检测能力，建立您的短名单。"
            action={{ label: '发现检测能力', href: '/search' }}
          />
        )}

        {/* Empty (nothing matches the current state filter) */}
        {isEmptyFiltered && (
          <EmptyState
            icon="default"
            title="该状态下暂无评估"
            message="切换其他状态筛选，或重新评估目标。"
          />
        )}

        {/* List */}
        {!isLoading && !isError && hasAny && (
          <div className="space-y-3">
            {filtered.map((e) => (
              <EvaluationListItem
                key={e.id}
                evaluation={e}
                context={ctxFor(e)}
                selected={selectedIds.has(e.id)}
                onToggleSelect={() => toggleSelect(e.id)}
                onStateChange={(state) => updateMut.mutate({ id: e.id, state })}
                onDelete={() => handleDelete(e)}
                onConnect={() => handleConnect(ctxFor(e))}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {hasAny && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </WorkspaceLayout>
  );
}

export default function EvaluationsPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <Suspense fallback={<Loading />}>
          <EvaluationsContent />
        </Suspense>
      </RoleGuard>
    </AuthGuard>
  );
}
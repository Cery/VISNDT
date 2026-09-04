'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/services/product.service';
import { getCapabilityDetail } from '@/services/capability.service';
import { getParameterGroups } from '@/services/parameter-group.service';
import CompareTable from '@/components/products/CompareTable';
import SupplierCompareTable from '@/components/products/SupplierCompareTable';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import IndustrialBadge from '@/components/brand/IndustrialBadge';
import PageContainer from '@/components/common/PageContainer';
import EngineeringDiscoveryNav from '@/components/engineering/EngineeringDiscoveryNav';

/**
 * Compare page — M28.0 Platform Product compare + M28.1 M667 SupplierProduct
 * compare (type=supplier-product, anchored by capability=<platformProductId>).
 *
 * Both modes share the same URL state (/products/compare?ids=...) so deep links,
 * refresh, back/forward and remove/add stay stable. No comparison domain entity.
 *
 * 801_M39 page-level reconstruction — reframed from a bare list page into an
 * Engineering Evaluation Workspace: platform context header (brand identity +
 * evaluation context), capability/parameter suitability intent, and a
 * cross-surface next-action discovery strip. Comparison is engineering
 * evaluation, not price/shopping comparison.
 */

const MAX_COMPARE_PRODUCT = 4;
const MAX_COMPARE_SUPPLIER = 7;

/** 801: shared platform context header — engineering evaluation workspace framing. */
function CompareContextHeader({
  mode,
  count,
}: {
  mode: 'product' | 'supplier';
  count: number;
}) {
  return (
    <div className="bg-industrial-dark relative overflow-hidden border-b border-slate-200/80">
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-industrial-cyan/50 to-primary/0" aria-hidden="true" />
      <PageContainer variant="content" paddingY={32}>
        <div className="max-w-4xl relative">
          <IndustrialBadge
            label={mode === 'product' ? '产品评估 · 参数级横向对比' : '能力评估 · 供应商型号对比'}
            tone="cyan"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-5 tracking-tight">
            {mode === 'product' ? '产品对比' : '供应商型号对比'}
          </h1>
          <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
            以技术参数、能力异同与工程适用性维度开展评估对比——面向工程师的确定性评估工作台，
            {mode === 'product'
              ? `当前选择 ${count} 个检测能力产品进行横向评估。`
              : `在同一检测能力锚点下对 ${count} 个供应商型号逐一核验。`}
          </p>
          <div className="mt-5">
            <EngineeringDiscoveryNav activeLabel="检测产品" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

/** 801: cross-surface next-action strip — where comparison leads engineers onward. */
function CompareNextAction() {
  return (
    <section className="mt-8 rounded-xl border border-slate-200/80 bg-surface-1 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">下一步工程发现</p>
          <p className="text-sm text-muted-foreground mt-1">
            对比收敛后，前往能力分类规整需求，或进入统一检索核对相关参数、方案与供应商。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            能力分类
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            统一检索
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            产品注册表
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ComparePageContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') ?? '';
  const type = searchParams.get('type') ?? 'product';
  const capabilityParam = searchParams.get('capability') ?? '';

  const isSupplierMode = type === 'supplier-product';
  const MAX_COMPARE = isSupplierMode ? MAX_COMPARE_SUPPLIER : MAX_COMPARE_PRODUCT;

  const ids = useMemo(() => {
    return idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, MAX_COMPARE);
  }, [idsParam, MAX_COMPARE]);

  const { data: parameterGroups } = useQuery({
    queryKey: ['parameter-groups'],
    queryFn: () => getParameterGroups(),
  });

  // SupplierProduct compare mode — fetch the capability graph once and filter.
  const {
    data: capability,
    isLoading: capabilityLoading,
    isError: capabilityError,
    error: capabilityErrorObj,
  } = useQuery({
    queryKey: ['compare-capability', capabilityParam],
    queryFn: () => getCapabilityDetail(capabilityParam),
    enabled: isSupplierMode && capabilityParam.length > 0 && ids.length > 0,
  });

  // Selected SupplierProducts within the fetched capability graph (supplier mode).
  const validItems = useMemo(() => {
    if (!capability) return [];
    return capability.supplierProducts.filter((sp) => ids.includes(sp.id));
  }, [capability, ids]);

  // Platform Product compare mode — fetch each product.
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorObj,
  } = useQuery({
    queryKey: ['compare-products', ids],
    queryFn: async () => {
      const results = await Promise.all(ids.map((id) => getProduct(id)));
      return results;
    },
    enabled: !isSupplierMode && ids.length > 0,
  });

  // ---- SupplierProduct mode ----
  if (isSupplierMode) {
    const missingCapability =
      capabilityParam.length === 0 || (ids.length > 0 && !capabilityLoading && !capabilityError && !capability);

    const missingIds = ids.filter((id) => !validItems.some((it) => it.id === id));

    return (
      <div className="pb-24">
        {/* 801: Engineering Evaluation Workspace platform context header */}
        <CompareContextHeader mode="supplier" count={validItems.length} />

        <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            首页
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">
            产品列表
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-foreground">供应商型号对比</span>
        </nav>

        {ids.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                <path d="M4 12h24M4 22h24M8 4v24M24 4v24" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              未选择供应商型号
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              在产品详情页的「供应商型号」中勾选 2–7 个型号进行对比。
            </p>
            <Link
              href="/search?type=supplier-product"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              前往供应商型号搜索
            </Link>
          </div>
        )}

        {ids.length > 0 && missingCapability && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                <path d="M4 12h24M4 22h24M8 4v24M24 4v24" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">
              比较链接不完整
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              缺少能力锚点（capability 参数），无法完成同能力下比较。请重新选择型号。
            </p>
            <Link
              href="/search?type=supplier-product"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              前往供应商型号搜索
            </Link>
          </div>
        )}

        {ids.length > 0 && !missingCapability && capabilityLoading && (
          <div className="py-20">
            <Loading />
          </div>
        )}

        {ids.length > 0 &&
          !missingCapability &&
          capabilityError &&
          !capabilityLoading && (
            <ErrorState
              message={
                capabilityErrorObj instanceof Error
                  ? capabilityErrorObj.message
                  : '加载能力详情失败'
              }
            />
          )}

        {ids.length > 0 &&
          !missingCapability &&
          !capabilityLoading &&
          !capabilityError &&
          validItems.length < 2 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                  <path d="M4 12h24M4 22h24M8 4v24M24 4v24" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                {validItems.length === 0
                  ? '没有可比较的供应商型号'
                  : '至少需要选择 2 个供应商型号'}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                {missingIds.length > 0
                  ? '部分型号已下架或未公开，已自动排除。'
                  : '在产品详情页的「供应商型号」中勾选 2–7 个型号进行对比。'}
              </p>
              <Link
                href="/search?type=supplier-product"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                返回供应商型号搜索
              </Link>
            </div>
          )}

        {ids.length > 0 &&
          !missingCapability &&
          !capabilityLoading &&
          !capabilityError &&
          validItems.length >= 2 && (
            <>
              {missingIds.length > 0 && (
                <p className="mb-4 text-xs text-amber-600">
                  已自动排除 {missingIds.length} 个不可比较的型号（未公开或已下架）。
                </p>
              )}
              <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-6">
                <SupplierCompareTable
                  capabilityId={capabilityParam}
                  capabilityName={capability?.platformProduct.name ?? '检测能力'}
                  items={validItems}
                  parameterGroups={parameterGroups ?? []}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---- Platform Product mode (existing, unchanged) ----
  const validProducts = products ?? [];

  return (
    <div className="pb-24">
      {/* 801: Engineering Evaluation Workspace platform context header */}
      <CompareContextHeader mode="product" count={validProducts.length} />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          产品列表
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-foreground">产品对比</span>
      </nav>

      {/* Loading */}
      {productsLoading && (
        <div className="py-20">
          <Loading />
        </div>
      )}

      {/* Error */}
      {productsError && (
        <ErrorState
          message={
            productsErrorObj instanceof Error
              ? productsErrorObj.message
              : '加载产品对比失败'
          }
        />
      )}

      {/* Empty / Insufficient */}
      {!productsLoading && !productsError && validProducts.length < 2 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
              <path d="M4 12h24M4 22h24M8 4v24M24 4v24" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            {validProducts.length === 0
              ? '未选择产品'
              : '至少需要选择 2 个产品'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            在产品列表页点击产品卡片右上角的复选框，选择 2-4 个产品进行对比。
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 3l-4 4 4 4" />
            </svg>
            返回产品列表
          </Link>
        </div>
      )}

      {/* Compare Table */}
      {!productsLoading && !productsError && validProducts.length >= 2 && (
        <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-6">
          <CompareTable
            products={validProducts}
            parameterGroups={parameterGroups ?? []}
          />
        </div>
      )}

      {/* 801: cross-surface next-action strip — evaluation converges into discovery */}
      <CompareNextAction />
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <Loading />
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}

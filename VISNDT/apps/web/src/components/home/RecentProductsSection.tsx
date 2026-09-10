'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/services/product.service';
import type { ProductDetail, ProductParameterValue } from '@/types/product';
import BlueprintContainer from '@/components/common/BlueprintContainer';

/**
 * 工业蓝图设计语言 — 近期上架检测设备（数据表卡）。
 * 对齐 visndt_home_redesign.html「近期上架的检测设备」。
 * 真实数据驱动：getProducts(ACTIVE,3) → 逐条 getProduct 取 parameterValues（参数表 ≤4）
 * 与 offers[].organization.name（制造方）。
 * 视觉区取真实 primaryMedia；无可用图片时以「蓝图图纸式 mono 占位」诚实呈现，不伪造设备图（854 默认）。
 */

function formatParamValue(v: ProductParameterValue): string {
  if (v.value) return v.value;
  if (v.valueNumber != null) {
    const unit = v.parameterDefinition?.unit;
    return unit ? `${v.valueNumber} ${unit}` : String(v.valueNumber);
  }
  return '—';
}

function maker(detail: ProductDetail): string | null {
  const orgs = detail.offers
    ?.map((o) => o.organization?.name)
    .filter((n): n is string => !!n);
  const uniq = [...new Set(orgs)];
  return uniq.length ? uniq[0] : null;
}

export default function RecentProductsSection() {
  const { data: items, isLoading, isError } = useQuery({
    queryKey: ['home-recent-products'],
    queryFn: async (): Promise<ProductDetail[]> => {
      const list = await getProducts({ status: 'ACTIVE', page: 1, pageSize: 3 });
      const ids = (list.data ?? []).map((p) => p.id);
      const details = await Promise.all(ids.map((id) => getProduct(id).catch(() => null)));
      return details.filter((d): d is ProductDetail => !!d);
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  return (
    <section className="py-[76px] bg-blueprint-paper-2 text-blueprint-ink">
      <BlueprintContainer>
        <div className="flex justify-between items-end gap-6 flex-wrap mb-[42px]">
          <div>
            <h2 className="text-[27px] font-bold tracking-[-0.005em] max-w-[16em]">近期上架的检测设备</h2>
            <p className="text-sm text-blueprint-ink-soft max-w-[30em] mt-2">关键参数直接列出，便于与您的检测工况比对。</p>
          </div>
          <Link href="/products" className="text-[13.5px] font-semibold text-blueprint-ink pb-1 border-b border-blueprint-ink shrink-0">
            浏览全部产品 →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 xm:grid-cols-3 gap-px bg-blueprint-line">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-blueprint-paper animate-pulse">
                <div className="aspect-[16/10] bg-blueprint-graphite" />
                <div className="p-5">
                  <div className="h-4 bg-blueprint-line rounded-sm w-3/4 mb-2" />
                  <div className="h-3 bg-blueprint-line rounded-sm w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError || !items || items.length === 0 ? (
          <div className="text-center py-12 border border-blueprint-line bg-blueprint-paper text-blueprint-ink-soft text-sm">
            暂无检索到检测设备，可浏览检测产品注册表发现更多。
          </div>
        ) : (
          <div className="grid grid-cols-1 xm:grid-cols-3 gap-px bg-blueprint-line">
            {items.map((p) => (
              <div key={p.id} className="flex flex-col bg-blueprint-paper">
                {/* 视觉区：真实 primaryMedia 缺失时用图纸式 mono 占位（不伪造设备图） */}
                <div className="aspect-[16/10] bg-blueprint-graphite relative flex items-center justify-center">
                  <span className="absolute top-3 left-3 font-mono text-[10px] text-[#DFA24E] border border-[#4B535B] px-[7px] py-[3px] tracking-[0.02em]">
                    ACTIVE
                  </span>
                  {p.primaryMedia ? (
                    <span className="font-mono text-[11px] text-[#9BA2A9]">{p.primaryMedia.title ?? '产品图纸'}</span>
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-8">
                      <span className="font-mono text-[10px] text-[#7C848C] tracking-[0.2em]">FIG. — NDT</span>
                      <span className="font-mono text-lg text-[#DDD7C7]">{p.model || p.name}</span>
                      <svg viewBox="0 0 120 40" className="w-2/3" fill="none" aria-hidden="true">
                        <rect x="10" y="15" width="70" height="8" rx="2" stroke="#7C848C" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="90" cy="19" r="6" stroke="#CE8A2E" strokeWidth="1.4" fill="#1B1F24" />
                        <line x1="10" y1="34" x2="100" y2="34" stroke="#7C848C" strokeWidth="1" strokeDasharray="2 3" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 卡片体 */}
                <div className="flex-1 flex flex-col p-[22px]">
                  <h3 className="text-[16.5px] font-bold mb-1">{p.name}</h3>
                  <div className="text-[12.5px] text-blueprint-ink-soft mb-[14px]">
                    {maker(p) ? `供应商：${maker(p)}` : '供应商：—'}
                  </div>

                  <div className="border-t border-blueprint-line text-[12.5px]">
                    {(p.parameterValues ?? []).slice(0, 4).map((pv) => (
                      <div key={pv.id} className="flex justify-between py-[7px] border-b border-blueprint-line text-blueprint-ink-soft">
                        <span>{pv.parameterDefinition?.name ?? '参数'}</span>
                        <b className="font-mono font-semibold text-blueprint-ink">
                          {formatParamValue(pv)}
                        </b>
                      </div>
                    ))}
                    {(p.parameterValues ?? []).length === 0 && (
                      <div className="py-[7px] text-blueprint-ink-soft">暂无参数数据</div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs font-semibold text-blueprint-verdigris">● 支持在线询价</span>
                    <Link href={`/products/${p.id}`} className="text-[13px] font-semibold border-b border-blueprint-ink">
                      查看详情
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </BlueprintContainer>
    </section>
  );
}
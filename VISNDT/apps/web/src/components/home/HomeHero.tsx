'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/product.service';
import { unifiedSearch } from '@/services/search.service';
import BlueprintContainer from '@/components/common/BlueprintContainer';

/**
 * 工业蓝图设计语言首页 Hero（对齐 visndt_home_redesign.html hero 区块）。
 * 石墨深底 + 左侧 h1/lede/检索/指标条 + 右侧「内窥镜工作原理」工程示意图（SVG 原样保留）。
 * 真实数据驱动：
 *   - 产品型号总数 ← getProducts total
 *   - 入驻供应商数   ← supplier-discovery suppliers.total（无独立统计接口，见报告 854-02）
 *   - 平均询价响应时长 ← 无统计源，槽位以「询价闭环实测 / —」诚实显示（854-02）
 */
function formatCount(n: number | undefined | null): string {
  if (n === undefined || n === null) return '—';
  return n.toLocaleString('en-US');
}

const HERO_SEARCH_PLACEHOLDER = '例如：φ4.0mm 工业内窥镜，长度 1000mm';

export default function HomeHero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 真实数据：ACTIVE 产品型号总数
  const { data: productMeta } = useQuery({
    queryKey: ['home-hero-product-total'],
    queryFn: () => getProducts({ status: 'ACTIVE', page: 1, pageSize: 1 }),
    staleTime: 60_000,
  });

  // 真实数据：已发布入驻供应商数（supplier-discovery 聚合），失败/为空时槽位显示 —（854-02）
  const { data: supplierMeta } = useQuery({
    queryKey: ['home-hero-supplier-total'],
    queryFn: () => unifiedSearch({ q: '', type: 'all', page: 1, pageSize: 1 }),
    retry: 1,
    // 空关键字可能不命中检索；仅在确有供应商数时采信，否则降级为诚实占位
    select: (res) =>
      res.suppliers.searched && res.suppliers.total > 0 ? res.suppliers.total : null,
  });

  const productTotal = productMeta?.total ?? null;
  const supplierTotal = supplierMeta ?? null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="bg-blueprint-graphite text-blueprint-paper overflow-hidden">
      <BlueprintContainer className="pt-12 xm:pt-[76px]">
        <div className="grid grid-cols-1 xm:grid-cols-[1.05fr_0.95fr] xm:gap-10 items-center pb-0">
          {/* 左侧：h1 · lede · 检索 · 指标条 */}
          <div>
            <h1 className="text-[34px] xm:text-[40px] font-black leading-[1.28] tracking-[-0.01em] text-white max-w-[11.5em]">
              把检测需求，
              <br />
              翻译成可比对的参数
            </h1>
            <p className="mt-[18px] text-[15.5px] leading-[1.8] text-[#B9BEC3] max-w-[34em]">
              按探头直径、工作长度、分辨率等标准化参数检索检测能力与设备型号，让工程需求与供应商报价可以直接对齐比对。
            </p>

            {/* hero 检索（蓝图 1:1：内嵌输入框 + 琥珀「检索」按钮 → /search） */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex max-w-[520px] border border-[#4B535B] bg-[#20262D]"
            >
              <input
                ref={inputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={HERO_SEARCH_PLACEHOLDER}
                aria-label="检索检测能力与设备"
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-[14.5px] px-4 py-[14px] font-sans placeholder:text-[#7C848C]"
              />
              <button
                type="submit"
                className="bg-blueprint-amber text-blueprint-graphite border-none font-bold px-[22px] text-sm cursor-pointer hover:bg-[#DFA24E] transition-colors rounded-none"
              >
                检索
              </button>
            </form>

            {/* 指标条（3 格，全真实/诚实占位） */}
            <div className="spec-strip mt-11 border-t border-[#3B424A]">
              <SpecItem num={`${formatCount(productTotal)}+`} label="已收录检测产品型号" />
              <SpecItem
                num={supplierTotal && supplierTotal > 0 ? String(supplierTotal) : '—'}
                label="入驻检测能力供应商"
              />
              <SpecItem num="<实测>" label="平均询价响应时长" />
            </div>
          </div>

          {/* 右侧：工程示意图（内嵌 SVG 原样保留） */}
          <div className="xm:order-last order-first flex items-center justify-center pt-0 xm:pt-5 xm:pb-0 pb-6">
            <div className="border border-[#454D55] bg-[#20262D] px-[26px] pt-[26px] pb-5 w-full max-w-[440px]">
              <div className="flex justify-between font-mono text-[10.5px] text-[#7C848C] tracking-[0.03em] mb-4">
                <span>FIG. 01 — 工业内窥镜工作原理</span>
                <span>SCALE N.T.S.</span>
              </div>

              <svg viewBox="0 0 400 210" fill="none" className="w-full h-auto" aria-label="工业内窥镜工作原理示意图">
                <rect x="20" y="70" width="360" height="70" rx="2" stroke="#4B535B" strokeWidth="1.4" />
                <line x1="20" y1="80" x2="380" y2="80" stroke="#3A414A" strokeWidth="1" />
                <line x1="20" y1="130" x2="380" y2="130" stroke="#3A414A" strokeWidth="1" />
                <path d="M240 80 L252 96 L238 108 L250 130" stroke="#CE8A2E" strokeWidth="2" fill="none" />
                <line x1="20" y1="105" x2="250" y2="105" stroke="#DDD7C7" strokeWidth="3" />
                <circle cx="255" cy="105" r="7" stroke="#DDD7C7" strokeWidth="2" fill="#20262D" />
                <path d="M262 105 L300 88 L300 122 Z" fill="#4F7A6E" fillOpacity="0.28" stroke="#4F7A6E" strokeWidth="1" />
                <line x1="20" y1="150" x2="255" y2="150" stroke="#7C848C" strokeWidth="1" />
                <line x1="20" y1="145" x2="20" y2="155" stroke="#7C848C" strokeWidth="1" />
                <line x1="255" y1="145" x2="255" y2="155" stroke="#7C848C" strokeWidth="1" />
                <text x="120" y="168" fill="#9BA2A9" fontSize="10" fontFamily="JetBrains Mono, monospace">L = 1000mm</text>
                <line x1="248" y1="98" x2="248" y2="112" stroke="#7C848C" strokeWidth="1" />
                <text x="200" y="30" fill="#9BA2A9" fontSize="10" fontFamily="JetBrains Mono, monospace">φ4.0mm PROBE HEAD</text>
                <line x1="255" y1="98" x2="255" y2="55" stroke="#5A626A" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="196" y1="35" x2="255" y2="55" stroke="#5A626A" strokeWidth="1" strokeDasharray="2 2" />
                <text x="304" y="80" fill="#7FA294" fontSize="10" fontFamily="JetBrains Mono, monospace">FOV 90°</text>
              </svg>

              <div className="flex flex-wrap gap-x-[22px] gap-y-[14px] mt-4 pt-[14px] border-t border-[#3B424A]">
                <LegendItem lv="φ4.0mm" label="探头直径" />
                <LegendItem lv="1000mm" label="工作长度" />
                <LegendItem lv="90°" label="视场角" />
                <LegendItem lv="1080p" label="成像分辨率" />
              </div>
            </div>
          </div>
        </div>
      </BlueprintContainer>

      <style jsx>{`
        .spec-strip {
          display: flex;
          gap: 0;
        }
        .spec-strip > * + * {
          border-left: 1px solid #3b424a;
        }
        @media (max-width: 859px) {
          .spec-strip {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </section>
  );
}

function SpecItem({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex-1 basis-[45%] xm:basis-auto py-[18px] pr-5">
      <div className="font-mono text-2xl font-semibold text-blueprint-amber">{num}</div>
      <div className="text-xs text-[#9BA2A9] mt-1">{label}</div>
    </div>
  );
}

function LegendItem({ lv, label }: { lv: string; label: string }) {
  return (
    <div className="text-[11.5px] text-[#B9BEC3] flex items-baseline gap-1.5">
      <span className="font-mono font-semibold text-blueprint-amber">{lv}</span>
      {label}
    </div>
  );
}
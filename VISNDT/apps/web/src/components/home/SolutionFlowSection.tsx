'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getContentList } from '@/services/content.service';
import BlueprintContainer from '@/components/common/BlueprintContainer';

/**
 * 工业蓝图设计语言 — 从检测问题到落地方案（流程 4 步 + 场景卡）。
 * 对齐 visndt_home_redesign.html。
 * 场景卡真实数据驱动：getContentList({type:'SOLUTION',pageSize:3})；
 * tags → 参数 chips，链接 → `/solutions/<slug>`。
 */
const FLOW_STEPS = [
  { idx: 'STEP 01', title: '描述检测场景', desc: '说明检测对象、工况环境与限制条件' },
  { idx: 'STEP 02', title: '转化为标准参数', desc: '系统归纳出探头直径、工作长度等关键参数' },
  { idx: 'STEP 03', title: '匹配检测能力', desc: '按参数比对入驻供应商的设备与服务能力' },
  { idx: 'STEP 04', title: '提交询价', desc: '直接向匹配到的供应商发起报价请求' },
];

export default function SolutionFlowSection() {
  const { data: scenarios, isLoading } = useQuery({
    queryKey: ['home-solution-scenarios'],
    queryFn: () => getContentList({ type: 'SOLUTION', pageSize: 3, sort: 'publishedAt', order: 'desc' }),
    staleTime: 60_000,
  });

  const items = scenarios?.data ?? [];

  return (
    <section className="py-[76px] bg-blueprint-paper text-blueprint-ink">
      <BlueprintContainer>
        <div className="section-head mb-[52px]">
          <h2 className="text-[27px] font-bold tracking-[-0.005em] max-w-[16em]">从检测问题到落地方案</h2>
          <p className="text-sm text-blueprint-ink-soft max-w-[30em] mt-2">四步流程把您的现场问题转化为可执行的采购动作。</p>
        </div>

        {/* 流程 4 步（静态品牌流程，1:1） */}
        <div className="flex items-stretch mb-[52px] overflow-x-auto">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.idx} className="flex items-stretch flex-1 min-w-[190px]">
              <div className="flex-1 border border-blueprint-line-dark bg-blueprint-paper relative px-[18px] py-5">
                <div className="font-mono text-[11px] font-bold text-blueprint-amber-deep">{s.idx}</div>
                <h4 className="text-[15px] font-bold mt-2">{s.title}</h4>
                <p className="text-[12.5px] text-blueprint-ink-soft mt-1.5">{s.desc}</p>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex items-center justify-center w-[26px] shrink-0 text-blueprint-ink-soft text-base z-[1]">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 场景卡（真实方案） */}
        {isLoading ? (
          <div className="grid grid-cols-1 xm:grid-cols-3 gap-[22px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-blueprint-line bg-blueprint-paper p-6 animate-pulse h-40" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 border border-blueprint-line text-blueprint-ink-soft text-sm">
            当前暂无检索到的应用方案，可进入解决方案中心继续发现。
          </div>
        ) : (
          <div className="grid grid-cols-1 xm:grid-cols-3 gap-[22px]">
            {items.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="group border border-blueprint-line bg-blueprint-paper p-6 hover:bg-[#E4DFD1] transition-colors"
              >
                <div className="font-mono text-[11px] text-blueprint-verdigris mb-2.5">
                  场景 / {s.tags?.[0]?.tag.name ?? '应用方案'}
                </div>
                <h4 className="text-base font-bold mb-2.5">{s.title}</h4>
                <p className="text-[13px] text-blueprint-ink-soft mb-4 leading-relaxed line-clamp-2">
                  {s.summary ?? '从检测问题出发，定位所需能力与落地产品。'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(s.tags ?? []).slice(0, 3).map((t) => (
                    <span
                      key={t.tag.id}
                      className="font-mono text-[11px] bg-blueprint-verdigris-soft text-[#345048] px-2 py-0.5 rounded-[1px]"
                    >
                      {t.tag.name}
                    </span>
                  ))}
                  {(s.tags ?? []).length === 0 && (
                    <span className="font-mono text-[11px] bg-blueprint-verdigris-soft text-[#345048] px-2 py-0.5 rounded-[1px]">
                      VIEW
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </BlueprintContainer>
    </section>
  );
}
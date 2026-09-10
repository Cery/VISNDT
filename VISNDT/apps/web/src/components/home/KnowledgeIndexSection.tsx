'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getContentList } from '@/services/content.service';
import BlueprintContainer from '@/components/common/BlueprintContainer';

/**
 * 工业蓝图设计语言 — 工程信息与选型参考（知识索引行）。
 * 对齐 visndt_home_redesign.html。真实数据驱动：getContentList({type:'KNOWLEDGE',pageSize:5})。
 * 行 → `/knowledge-base/<slug>`。
 */
export default function KnowledgeIndexSection() {
  const { data: list, isLoading } = useQuery({
    queryKey: ['home-knowledge-index'],
    queryFn: () => getContentList({ type: 'KNOWLEDGE', pageSize: 5, sort: 'publishedAt', order: 'desc' }),
    staleTime: 60_000,
  });

  const items = list?.data ?? [];

  return (
    <section className="py-[76px] bg-blueprint-paper-2 text-blueprint-ink">
      <BlueprintContainer>
        <div className="flex justify-between items-end gap-6 flex-wrap mb-[42px]">
          <div>
            <h2 className="text-[27px] font-bold tracking-[-0.005em] max-w-[16em]">工程信息与选型参考</h2>
            <p className="text-sm text-blueprint-ink-soft max-w-[30em] mt-2">
              面向工程人员的参数解读与应用说明，帮助判断设备是否适配工况。
            </p>
          </div>
          <Link href="/knowledge-base" className="text-[13.5px] font-semibold text-blueprint-ink pb-1 border-b border-blueprint-ink shrink-0">
            进入知识中心 →
          </Link>
        </div>

        <div className="border-t border-blueprint-line">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[150px_1fr_26px] gap-6 py-5 border-b border-blueprint-line animate-pulse">
                <div className="h-3 bg-blueprint-line rounded-sm" />
                <div className="h-4 bg-blueprint-line rounded-sm w-2/3" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="text-center py-10 border-b border-blueprint-line text-blueprint-ink-soft text-sm">
              暂无检索到的知识条目，可进入知识中心继续发现。
            </div>
          ) : (
            items.map((it) => (
              <Link
                key={it.slug}
                href={`/knowledge-base/${it.slug}`}
                className="group grid grid-cols-[150px_1fr_26px] gap-6 items-baseline py-5 border-b border-blueprint-line hover:bg-[#E4DFD1] transition-colors"
              >
                <span className="font-mono text-[11.5px] text-blueprint-ink-soft self-start pt-0.5">
                  {it.tags?.[0]?.tag.name ?? '技术知识'}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-bold mb-1">{it.title}</span>
                  {it.summary && (
                    <span className="block text-[13px] text-blueprint-ink-soft leading-relaxed line-clamp-1">{it.summary}</span>
                  )}
                </span>
                <span className="text-right text-blueprint-ink-soft self-start transition-transform group-hover:translate-x-[3px] group-hover:text-blueprint-ink">
                  →
                </span>
              </Link>
            ))
          )}
        </div>
      </BlueprintContainer>
    </section>
  );
}
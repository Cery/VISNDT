'use client';

import Link from 'next/link';
import MediaImage from '@/components/common/MediaImage';

/**
 * 802_M39 — Whole-site Recommendation reframe.
 *
 * Recommendation is not "shopping suggestion". It is a page-level
 * "Relevant Engineering Discovery" surface: related capability, products,
 * technical knowledge, solutions and suppliers are grouped under an
 * engineering-relevance frame, with explicit cross-surface Next Discovery.
 *
 * Composes only existing public data (already fetched by the parent server
 * route) into a coherent discovery layer. No recommendation entity / domain
 * is introduced.
 *
 * 853/临时修复 — 卡片增强：
 *  - 支持可选 `fileAssetId` 缩略图（有图渲染缩略图 + 标题，无图降级纯文字）。
 *  - `narrow`：用于 280px 侧边栏等窄容器时强制单列，避免宽域网格把分组压成窄条。
 */

export interface RelevantDiscoveryItem {
  href: string;
  title: string;
  sub?: string;
  /** FileAsset 缩略图（相关产品/知识/方案封面）；缺省时降级为纯文字行 */
  fileAssetId?: string | null;
}

export interface RelevantDiscoveryGroup {
  /** 分组语义标签，如「相关产品」「相关技术知识」「相关方案」 */
  label: string;
  /** mono 技术字段标签，如 PRODUCT / KNOWLEDGE / SOLUTION */
  mono: string;
  items: RelevantDiscoveryItem[];
  /** 该组“查看全部”入口 */
  seeAllHref?: string;
}

interface RelevantEngineeringDiscoveryProps {
  /** 工程上下文锚点，如当前方案名 / 能力名 */
  capabilityAnchor: string;
  groups: RelevantDiscoveryGroup[];
  nextActions?: { href: string; label: string }[];
  /** 窄容器（如 280px 侧边栏）：单列布局，避免分组被压成窄条；组内最多展示 4 项 */
  narrow?: boolean;
}

export default function RelevantEngineeringDiscovery({
  capabilityAnchor,
  groups,
  nextActions = [],
  narrow = false,
}: RelevantEngineeringDiscoveryProps) {
  const hasGroups = groups.some((g) => g.items.length > 0);

  return (
    <section className="mt-12 rounded-xl border border-slate-200/80 bg-surface-1 overflow-hidden">
      {/* Discovery frame header */}
      <div className="bg-industrial-dark/95 px-5 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-industrial-cyan">
            Relevant Engineering Discovery
          </p>
          <span className="sm:hidden" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
          相关工程发现
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          围绕 “
          <span className="text-white font-medium">{capabilityAnchor}</span>
          ” 折叠相关的检测能力、技术知识、方案与能力提供方，继续向工程评估与连接推进。
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {!hasGroups ? (
          <p className="text-sm text-muted-foreground">
            暂无收录的相关工程信息。可通过统一检索继续定位检测能力、参数解读与方案语境。
          </p>
        ) : (
          <div className={`grid grid-cols-1 gap-4 items-start ${narrow ? '' : 'md:grid-cols-2'}`}>
            {groups.map(
              (g) =>
                g.items.length > 0 && (
                  <div key={g.label} className="rounded-lg border border-slate-200/70 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-3 w-1 rounded-sm bg-industrial-cyan" aria-hidden="true" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        {g.mono}
                      </span>
                      <span className="text-sm font-semibold text-foreground">{g.label}</span>
                      {g.seeAllHref && (
                        <Link
                          href={g.seeAllHref}
                          className="ml-auto text-xs text-primary hover:text-primary/70"
                        >
                          全部
                        </Link>
                      )}
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {(narrow ? g.items.slice(0, 4) : g.items).map((it) => (
                        <li key={it.href}>
                          <Link
                            href={it.href}
                            className="group flex items-center gap-2.5 py-2"
                          >
                            {it.fileAssetId ? (
                              <MediaImage
                                fileAssetId={it.fileAssetId}
                                alt={it.title}
                                seed={it.href}
                                className="w-12 h-9 md:w-14 md:h-10 shrink-0 rounded object-cover bg-surface-2"
                              />
                            ) : null}
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm leading-snug text-foreground group-hover:text-primary transition-colors">
                                {it.title}
                              </span>
                              {it.sub && (
                                <span className="block text-xs text-slate-400 mt-0.5">
                                  {it.sub}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </div>
        )}

        {/* Cross-surface Next Discovery */}
        {nextActions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200/80">
            <p className="text-sm font-medium text-foreground">对当前工程的下一步发现</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {nextActions.map((na) => (
                <Link
                  key={na.href}
                  href={na.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {na.label}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
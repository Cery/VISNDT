import type { Content } from '@/types/content';
import ContentCard from './ContentCard';
import EmptyState from '@/components/common/EmptyState';
import EngineeringDiscoveryNav from '@/components/engineering/EngineeringDiscoveryNav';

interface ContentListLayoutProps {
  /** 顶部小标（如 Solutions），可选 */
  eyebrow?: string;
  /** 主标题前半段 */
  title: string;
  /** 主标题高亮段（工业青色），可选 */
  titleHighlight?: string;
  /** Hero 描述 */
  description: string;
  /** 已发布内容列表 */
  contents: Content[];
  /** 空态配置 */
  empty: {
    icon?: 'search' | 'package' | 'document' | 'default';
    title: string;
    message: string;
    description?: string;
  };
  /** 计数文案生成，可选（如「共 N 个解决方案」） */
  countLabel?: (count: number) => string;
  /** 可选技术索引台账（仅传入时渲染，不影响 Solutions/Insights 等其余内容页） */
  techIndex?: { code: string; label: string };
  /** M38 跨面发现收束：可选「工程信息发现」导航（分类/产品/知识/方案/检索跨面互连），传入时在内容区顶部渲染 */
  crossSurfaceNav?: { activeLabel?: string };
}

/**
 * 内容类型列表页统一布局：工业 Hero + 计数 + 卡片网格 + 空态。
 * 聚合 ARTICLE / SOLUTION / INSIGHT 等公开内容列表的展示一致性。
 */
export default function ContentListLayout({
  eyebrow,
  title,
  titleHighlight,
  description,
  contents,
  empty,
  countLabel,
  techIndex,
  crossSurfaceNav,
}: ContentListLayoutProps) {
  return (
    <div>
      {/* Industrial Masthead — dark technical surface with measurement/coordinate framing */}
      <section className="bg-industrial-dark text-white px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-5xl mx-auto pt-16 sm:pt-20 md:pt-24 pb-14 sm:pb-16 text-center">
          {/* Technical framing row */}
          <p className="flex items-center justify-center gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-slate-400 mb-5">
            <span className="h-px w-8 sm:w-12 bg-slate-700" aria-hidden="true" />
            <span className="text-industrial-cyan">Content</span>
            <span className="text-slate-600">/</span>
            <span>{eyebrow ? eyebrow.replace(/\s+/g, '- ').toUpperCase() : 'Published Library'}</span>
            <span className="h-px w-8 sm:w-12 bg-slate-700" aria-hidden="true" />
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            {title}
            {titleHighlight && <span className="text-industrial-cyan">{titleHighlight}</span>}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Masthead stat band — mono technical telemetry */}
        {contents.length > 0 && (
          <div className="relative z-10 max-w-5xl mx-auto pb-6">
            <div className="grid grid-cols-3 divide-x divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-industrial-dark/60">
              <div className="px-3 py-3 sm:px-6 sm:py-4 text-center">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {String(contents.length).padStart(2, '0')}
                </div>
                <div className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500">
                  总数
                </div>
              </div>
              <div className="px-3 py-3 sm:px-6 sm:py-4 text-center">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-industrial-cyan tabular-nums">
                  {eyebrow ? eyebrow.replace(/\s+/g, '') : 'PUB' }
                </div>
                <div className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500">
                  Type
                </div>
              </div>
              <div className="px-3 py-3 sm:px-6 sm:py-4 text-center">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  M33
                </div>
                <div className="mt-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500">
                  Platform
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content section — technical index header + structured grid */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="h-5 w-1 rounded-sm bg-industrial-cyan shrink-0" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
            <span className="text-industrial-cyan">内容库</span>
            <span className="mx-2 text-slate-300">/</span>
            已发布内容
          </span>
          {countLabel && (
            <span className="ml-auto font-mono text-xs text-slate-500 tabular-nums">
              {countLabel(contents.length)}
            </span>
          )}
        </div>
        <div className="flex-1 border-t border-slate-200 mb-6 sm:mb-8 -mt-3" aria-hidden="true" />

        {/* M38 跨面发现收束：方案/内容表面顶部提供分类/产品/知识/检索跨面互连入口（可选） */}
        {crossSurfaceNav && (
          <div className="mb-6">
            <EngineeringDiscoveryNav activeLabel={crossSurfaceNav.activeLabel} />
          </div>
        )}

        {/* Technical index ledger — industrial content library frame (optional, articles only) */}
        {techIndex && (
          <div className="mb-6 rounded-lg border border-slate-200/80 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-industrial-dark/95">
              <span className="h-3 w-1 rounded-sm bg-industrial-cyan" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-300">
                {techIndex.code}
              </span>
              <span className="text-slate-600">/</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-industrial-cyan">
                {techIndex.label}
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-slate-500 hidden md:inline">
                DOC · TYPE · REV
              </span>
            </div>
          </div>
        )}

        {contents.length === 0 ? (
          <EmptyState
            icon={empty.icon}
            title={empty.title}
            message={empty.message}
            description={empty.description}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            {contents.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
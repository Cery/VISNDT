import type { Content } from '@/types/content';
import ContentCard from './ContentCard';
import EmptyState from '@/components/common/EmptyState';

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
}: ContentListLayoutProps) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-16 sm:py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {eyebrow && (
            <p className="text-sm font-medium text-industrial-cyan tracking-widest uppercase mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            {title}
            {titleHighlight && <span className="text-industrial-cyan">{titleHighlight}</span>}
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Content List */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {contents.length === 0 ? (
          <EmptyState
            icon={empty.icon}
            title={empty.title}
            message={empty.message}
            description={empty.description}
          />
        ) : (
          <>
            {countLabel && (
              <p className="mb-6 sm:mb-8 text-sm text-slate-500">
                {countLabel(contents.length)}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contents.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';

export const metadata: Metadata = {
  title: '工业检测解决方案',
  description:
    '探索面向航空航天、汽车、管道、电子和制造领域的工业检测解决方案。',
};

function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function SolutionsPage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'SOLUTION', pageSize: 50 });
    contents = result.data;
  } catch {
    // API unavailable — render empty state, keep hero visible
    contents = [];
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            工业检测<span className="text-industrial-cyan">解决方案</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            为关键工业应用提供全面的无损检测和视觉检测解决方案。
          </p>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        {contents.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">暂无已发布的解决方案，敬请期待。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((solution) => (
              <Link
                key={solution.id}
                href={`/solutions/${solution.slug}`}
                className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-6 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {solution.title}
                </h3>
                {solution.summary && (
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-4">
                    {solution.summary}
                  </p>
                )}
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-400">
                  {solution.publishedAt
                    ? `发布于 ${formatDate(solution.publishedAt)}`
                    : `更新于 ${formatDate(solution.updatedAt)}`}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
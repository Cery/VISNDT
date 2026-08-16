import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '工业检测解决方案',
  description:
    '探索面向航空航天、汽车、管道、电子和制造领域的工业检测解决方案。',
  openGraph: {
    title: '工业检测解决方案',
    description:
      '探索面向航空航天、汽车、管道、电子和制造领域的工业检测解决方案。',
    type: 'website',
    url: `${SITE_URL}/solutions`,
  },
};

function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Industry category icons */
function getCategoryIcon(index: number) {
  const icons = [
    <svg key="aero" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>,
    <svg key="auto" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17V7m0 0l4 4m-4-4l-4 4" />
    </svg>,
    <svg key="pipe" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    <svg key="shield" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    <svg key="chip" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>,
  ];
  return icons[index % icons.length];
}

export default async function SolutionsPage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'SOLUTION', pageSize: 50 });
    contents = result.data;
  } catch {
    contents = [];
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-sm font-medium text-industrial-cyan tracking-widest uppercase mb-4">
            Solutions
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            工业检测<span className="text-industrial-cyan">解决方案</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            为航空航天、汽车、能源、管道、电子与半导体等关键工业领域，
            提供全面的无损检测和视觉检测技术方案。
          </p>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        {contents.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">暂无已发布的解决方案</h2>
            <p className="text-sm text-slate-400">解决方案内容正在筹备中，敬请期待。</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-sm text-slate-500">
                共 <span className="font-semibold text-slate-700">{contents.length}</span> 个解决方案
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((solution, idx) => (
                <Link
                  key={solution.id}
                  href={`/solutions/${solution.slug}`}
                  className="group rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-6 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(idx)}
                  </div>

                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {solution.title}
                  </h3>
                  {solution.summary && (
                    <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                      {solution.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      {solution.publishedAt
                        ? `发布于 ${formatDate(solution.publishedAt)}`
                        : `更新于 ${formatDate(solution.updatedAt)}`}
                    </span>
                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                      查看详情
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import { SITE_URL } from '@/lib/seo';
import ContentCard from '@/components/content/ContentCard';
import EmptyState from '@/components/common/EmptyState';

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
          <EmptyState
            icon="package"
            title="暂无已发布的解决方案"
            message="解决方案内容正在筹备中"
            description="面向航空航天、汽车、能源等关键工业领域的检测方案将陆续上线。"
          />
        ) : (
          <>
            <div className="mb-6 sm:mb-8">
              <p className="text-sm text-slate-500">
                共 <span className="font-semibold text-slate-700">{contents.length}</span> 个解决方案
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contents.map((solution) => (
                <ContentCard key={solution.id} item={solution} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
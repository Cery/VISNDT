import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import { SITE_URL } from '@/lib/seo';
import ContentCard from '@/components/content/ContentCard';
import EmptyState from '@/components/common/EmptyState';

export const metadata: Metadata = {
  title: '知识中心',
  description:
    '为工业检测专业人士提供的技术文章、检测指南、应用案例和设备选型指南。',
  openGraph: {
    title: '知识中心 – 工业检测技术知识',
    description:
      '为工业检测专业人士提供的技术文章、检测指南、应用案例和设备选型指南。',
    type: 'website',
    url: `${SITE_URL}/knowledge`,
  },
};

export default async function KnowledgePage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'KNOWLEDGE', pageSize: 50 });
    contents = result.data;
  } catch {
    // API unavailable — render empty state, keep hero visible
    contents = [];
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-12 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            知识<span className="text-industrial-cyan">中心</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            为工业检测专业人士提供的专家资源。指南、文章、案例研究和设备选型建议。
          </p>
        </div>
      </section>

      {/* Content List */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {contents.length === 0 ? (
          <EmptyState
            icon="document"
            title="知识中心"
            message="暂无已发布的知识内容"
            description="技术文章、检测指南与应用案例正在筹备中，敬请期待。"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {contents.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
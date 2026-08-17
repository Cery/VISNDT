import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import { SITE_URL } from '@/lib/seo';
import ContentCard from '@/components/content/ContentCard';

export const metadata: Metadata = {
  title: '文章中心',
  description:
    'VISNDT企业动态、行业新闻、技术趋势与公司资讯。',
  openGraph: {
    title: '文章中心',
    description:
      'VISNDT企业动态、行业新闻、技术趋势与公司资讯。',
    type: 'website',
    url: `${SITE_URL}/articles`,
  },
};

export default async function ArticlesPage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'ARTICLE', pageSize: 50 });
    contents = result.data;
  } catch {
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
            文章<span className="text-industrial-cyan">中心</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            企业动态、行业新闻与技术趋势，了解VISNDT的最新发展。
          </p>
        </div>
      </section>

      {/* Content List */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {contents.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">暂无已发布的文章内容，敬请期待。</p>
          </div>
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
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTagBySlug } from '@/lib/api/content-tag';
import { getPublicContents } from '@/lib/api/content';
import type { Content, ContentTagType } from '@/types/content';
import ContentCard from '@/components/content/ContentCard';

const TAG_TYPE_LABEL: Record<ContentTagType, string> = {
  TOPIC: '主题',
  INDUSTRY: '行业',
  APPLICATION: '应用',
  TECHNOLOGY: '技术',
};

const TAG_TYPE_COLOR: Record<ContentTagType, string> = {
  TOPIC: 'bg-blue-100 text-blue-700',
  INDUSTRY: 'bg-green-100 text-green-700',
  APPLICATION: 'bg-orange-100 text-orange-700',
  TECHNOLOGY: 'bg-purple-100 text-purple-700',
};

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tag = await getTagBySlug(slug);
    return {
      title: `${tag.name} — ${TAG_TYPE_LABEL[tag.type]}标签 | VISNDT`,
      description: tag.description ?? `浏览与"${tag.name}"相关的工业检测内容`,
    };
  } catch {
    return { title: '标签未找到 | VISNDT' };
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  let tag;
  try {
    tag = await getTagBySlug(slug);
  } catch {
    notFound();
  }

  let contents: Content[] = [];
  try {
    const result = await getPublicContents({ tag: slug, pageSize: 50 });
    contents = result.data ?? [];
  } catch {
    contents = [];
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 ${TAG_TYPE_COLOR[tag.type]}`}>
            {TAG_TYPE_LABEL[tag.type]}标签
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{tag.name}</h1>
          {tag.description && (
            <p className="text-base text-slate-400 max-w-xl mx-auto">{tag.description}</p>
          )}
        </div>
      </section>

      {/* Content List */}
      <section className="max-w-[1100px] mx-auto px-6 py-16">
        {contents.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">暂无与此标签关联的内容。</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-6">共 {contents.length} 篇相关内容</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
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
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTagBySlug } from '@/lib/api/content-tag';
import { getPublicContents } from '@/lib/api/content';
import type { Content, ContentTagType } from '@/types/content';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contents.map((item) => {
                const href =
                  item.type === 'KNOWLEDGE'
                    ? `/knowledge/${item.slug}`
                    : item.type === 'SOLUTION'
                      ? `/solutions/${item.slug}`
                      : `/knowledge/${item.slug}`;

                return (
                  <Link
                    key={item.id}
                    href={href}
                    className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-6 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.type === 'KNOWLEDGE'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type === 'KNOWLEDGE' ? '知识' : '解决方案'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    {item.summary && (
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {item.summary}
                      </p>
                    )}
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                      {item.publishedAt
                        ? `发布于 ${new Date(item.publishedAt).toLocaleDateString('zh-CN')}`
                        : `更新于 ${new Date(item.updatedAt).toLocaleDateString('zh-CN')}`}
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
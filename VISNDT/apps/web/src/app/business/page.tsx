import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentBySlug } from '@/services/content.service';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import MediaGallery from '@/components/content/MediaGallery';
import ContentCommercialCTA from '@/components/content/ContentCommercialCTA';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '商务合作',
  description:
    '与VISNDT合作开展工业检测设备制造、技术协作和行业合作。',
  // M38 统一 Discoverability：/business（平台能力合作 + Supplier 参与 + 技术协作）为公开索引面，
  // 补全 canonical + robots，闭合机器可读规范地址（sitemap priority 0.5）。
  alternates: { canonical: `${SITE_URL}/business` },
  robots: { index: true, follow: true },
  openGraph: {
    title: '商务合作 – VISNDT',
    description:
      '与VISNDT合作开展工业检测设备制造、技术协作和行业合作。',
    type: 'website',
    url: `${SITE_URL}/business`,
  },
};

// Legacy static content — fallback when no ARTICLE slug='business' exists
const STATIC_FALLBACK = {
  title: '商务合作',
  subtitle: '与领先的工业检测设备信息平台合作。共同服务全球无损检测行业。',
  sections: [
    {
      title: '供应商（能力提供方）',
      description:
        '加入我们的平台，展示您的工业检测设备能力。触达优质买家，接收询价，拓展市场影响力。',
      highlights: [
        '产品列表和技术规格管理',
        '接收来自工业买家的精准询价',
        '获取需求匹配和询价机会',
        '在工业无损检测市场建立品牌',
      ],
    },
    {
      title: '技术合作伙伴',
      description:
        '与VISNDT在技术开发、行业标准和创新项目方面开展合作。我们与科研机构和技术公司合作。',
      highlights: [
        '联合研发计划',
        '参与行业标准制定',
        '技术验证和测试项目',
        '知识分享和技术研讨会',
      ],
    },
    {
      title: '行业合作',
      description:
        '通过行业协会、贸易活动和专业网络与VISNDT建立联系。共同推动工业检测行业的发展。',
      highlights: [
        '行业活动和展会参与',
        '专业培训和认证项目',
        '跨行业应用开发',
        '全球市场准入和本地化支持',
      ],
    },
  ],
};

export default async function BusinessPage() {
  // Try to fetch Content-managed ARTICLE with slug='business'
  let content;
  try {
    content = await getContentBySlug('business');
  } catch {
    content = null;
  }

  // Content managed render
  if (content) {
    return (
      <div className="max-w-[820px] mx-auto px-6 py-10">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            首页
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-foreground">商务合作</span>
        </nav>
        <article>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8">
            {content.title}
          </h1>
          {content.summary && (
            <p className="text-base text-slate-600 leading-relaxed mb-8 border-l-4 border-primary/30 pl-4">
              {content.summary}
            </p>
          )}
          <div className="mb-8">
            <MarkdownRenderer content={content.content} />
          </div>
          <MediaGallery media={content.media} />
        </article>

        {/* Commercial CTA */}
        <div className="mt-8">
          <ContentCommercialCTA type="submit-inquiry" />
        </div>
      </div>
    );
  }

  // Static fallback
  return (
    <div>
      <section className="bg-industrial-dark text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            商务<span className="text-industrial-cyan">合作</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {STATIC_FALLBACK.subtitle}
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="space-y-12">
          {STATIC_FALLBACK.sections.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-6 hover:shadow-industrial-md transition-all"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {section.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                {section.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold mt-0.5">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commercial CTA */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <ContentCommercialCTA type="submit-inquiry" />
      </section>
    </div>
  );
}
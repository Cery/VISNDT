import Link from 'next/link';
import type { Metadata } from 'next';
import { getContentBySlug } from '@/services/content.service';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import MediaGallery from '@/components/content/MediaGallery';
import ContentCommercialCTA from '@/components/content/ContentCommercialCTA';

export const metadata: Metadata = {
  title: '关于VISNDT',
  description: '关于VISNDT — 工业检测设备信息平台',
};

// Legacy static content — fallback when no ARTICLE slug='about' exists
const STATIC_FALLBACK = {
  title: '关于 VISNDT',
  subtitle: '专业的工业检测设备信息平台 — 连接买家与优质检测设备制造商。',
  sections: [
    {
      title: '我们的使命',
      content:
        'VISNDT是一个专业的工业检测设备信息平台，致力于连接买家与优质检测设备制造商。我们提供全面的产品信息、详细的技术规格和高效的询价渠道，帮助您找到合适的设备。',
    },
    {
      title: '我们提供什么',
      cards: [
        {
          title: '产品发现',
          description: '浏览全面的工业检测设备目录，包含详细的技术参数和规格说明。',
        },
        {
          title: '分类导航',
          description: '按行业标准分类浏览产品，快速找到与您领域相关的设备。',
        },
        {
          title: '直接询价',
          description: '通过我们的平台直接向制造商提交询价，获取价格、库存和技术咨询。',
        },
        {
          title: '制造商信息',
          description: '查看制造商信息，包括企业资质和产品来源详情，帮助您做出明智决策。',
        },
      ],
    },
    {
      title: '服务行业',
      content:
        '我们的平台服务于广泛的行业领域，包括航空航天、汽车、能源、制造、建筑和研究机构。无论您需要超声检测设备、射线检测系统还是视觉检测工具，VISNDT都能帮助您找到合适的解决方案。',
    },
    {
      title: '联系我们',
      content: '',
      contact: true,
    },
  ],
};

export default async function AboutPage() {
  // Try to fetch Content-managed ARTICLE with slug='about'
  let content;
  try {
    content = await getContentBySlug('about');
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
          <span className="text-foreground">关于VISNDT</span>
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
          <ContentCommercialCTA type="explore-products" />
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
            关于 <span className="text-industrial-cyan">VISNDT</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {STATIC_FALLBACK.subtitle}
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="prose prose-sm max-w-none space-y-8">
          {STATIC_FALLBACK.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              {section.content && (
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              )}
              {section.cards && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.cards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-6 hover:shadow-industrial-md transition-all"
                    >
                      <h3 className="font-semibold text-sm mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {section.contact && (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">邮箱：</strong>{' '}
                    contact@visndt.com
                  </p>
                  <p>
                    <strong className="text-foreground">地址：</strong>{' '}
                    VISNDT平台团队
                  </p>
                  <p className="mt-3">
                    如需产品咨询，请使用相应产品详情页的询价表单。如有一般性问题，欢迎通过邮件联系我们。
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>
      </section>

      {/* Commercial CTA */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <ContentCommercialCTA type="explore-products" />
      </section>
    </div>
  );
}
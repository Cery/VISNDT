'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics/tracker';
import { buildEvent } from '@/lib/analytics/events';

type ContextType = 'knowledge' | 'solution' | 'article' | 'insight';

interface ContentProductCTAProps {
  contextType: ContextType;
  categorySlug?: string;
}

const CONTEXT_CONFIG: Record<
  ContextType,
  {
    title: string;
    description: string;
    primaryLabel: string;
  }
> = {
  knowledge: {
    title: '探索相关检测设备',
    description:
      '了解检测技术原理后，浏览工业内窥镜、测量系统等专业设备，查找符合您检测需求的产品。',
    primaryLabel: '查看相关检测设备',
  },
  solution: {
    title: '探索对应解决方案设备',
    description:
      '了解行业解决方案后，查看对应的工业检测设备，获取详细技术参数和供应能力。',
    primaryLabel: '探索对应解决方案设备',
  },
  article: {
    title: '查看相关工业检测产品',
    description:
      '阅读技术文章后，浏览完整的工业检测产品目录，发现符合需求的设备与参数。',
    primaryLabel: '查看相关工业检测产品',
  },
  insight: {
    title: '发现应用场景设备',
    description:
      '了解行业趋势与应用场景后，查找适用的工业检测设备，获取定制化方案。',
    primaryLabel: '发现应用场景设备',
  },
};

export default function ContentProductCTA({
  contextType,
  categorySlug,
}: ContentProductCTAProps) {
  const config = CONTEXT_CONFIG[contextType];
  const productHref = categorySlug
    ? `/products?categoryId=${categorySlug}`
    : '/products';

  const handleClick = () => {
    trackEvent(
      buildEvent('cta_click', {
        source: `content_${contextType}`,
        targetId: productHref,
        metadata: { label: config.primaryLabel },
      }),
    );
  };

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/[0.02] p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {config.title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {config.description}
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
          <Link
            href={productHref}
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            {config.primaryLabel}
            <span className="text-xs">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
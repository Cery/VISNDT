import Link from 'next/link';

type CTAType = 'explore-products' | 'submit-inquiry';

interface ContentCommercialCTAProps {
  type: CTAType;
}

const CTA_CONFIG: Record<
  CTAType,
  {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  }
> = {
  'explore-products': {
    title: '探索工业检测设备',
    description:
      '浏览完整的工业检测设备目录，查找符合您需求的产品和技术参数。',
    primaryLabel: '浏览产品目录',
    primaryHref: '/products',
  },
  'submit-inquiry': {
    title: '获取专业检测方案',
    description:
      '对工业检测设备感兴趣？浏览产品目录并提交询价，获取定制化方案和报价。',
    primaryLabel: '浏览产品并询价',
    primaryHref: '/products',
  },
};

export default function ContentCommercialCTA({
  type,
}: ContentCommercialCTAProps) {
  const config = CTA_CONFIG[type];

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
        <div className="flex-shrink-0">
          <Link
            href={config.primaryHref}
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
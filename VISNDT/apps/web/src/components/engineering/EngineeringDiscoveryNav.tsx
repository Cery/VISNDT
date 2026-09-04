import Link from 'next/link';

interface DiscoveryLink {
  label: string;
  href: string;
  description?: string;
}

const LINKS: DiscoveryLink[] = [
  { label: '知识中心', href: '/knowledge-base', description: '结构化工业检测知识体系' },
  { label: '解决方案', href: '/solutions', description: '检测应用解决方案' },
  { label: '检测产品', href: '/products', description: '检测设备与能力参数' },
  { label: '搜索', href: '/search', description: '工程信息统一检索' },
];

interface EngineeringDiscoveryNavProps {
  /** 当前激活表面的可见标签（用于高亮，可为空） */
  activeLabel?: string;
  className?: string;
}

/**
 * EngineeringDiscoveryNav — 跨表面工程信息发现导航（M37 平台化 / M37 之上 M38 复用）。
 *
 * 将 Knowledge / Insight / Solution / Product / Search 表面互连，
 * 复用既有 canonical routes（/knowledge-base /insights /solutions /products /search）。
 * 不新增全局路由架构，仅作为各信息表面顶部或栏目中的本地发现入口。
 */
export default function EngineeringDiscoveryNav({
  activeLabel,
  className,
}: EngineeringDiscoveryNavProps) {
  return (
    <nav className={className} aria-label="工程信息发现">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 -mb-1">
        <span className="text-xs text-slate-400 whitespace-nowrap shrink-0 mr-1 sm:mr-2">
          工程信息发现
        </span>
        {LINKS.map((link) => {
          const active =
            activeLabel != null && link.label === activeLabel;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'whitespace-nowrap inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm',
                active
                  ? 'bg-primary text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors',
              ].join(' ')}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
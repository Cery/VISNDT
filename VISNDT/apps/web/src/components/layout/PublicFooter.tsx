import Link from 'next/link';

// 846 §15 Footer 导航化：Footer 是导航，不是第二个 Hero。
// 移除公司宣传文案与「联系我们」贴片，仅保留任务导向的平台导航。
const FOOTER_SECTIONS = [
  {
    title: '发现',
    links: [
      { href: '/search', label: '统一检索' },
      { href: '/categories', label: '能力分类' },
      { href: '/products', label: '检测产品' },
    ],
  },
  {
    title: '产品',
    links: [
      { href: '/products', label: '检测产品' },
      { href: '/products/compare', label: '产品对比' },
      { href: '/supplier-models', label: '供应型号' },
    ],
  },
  {
    title: '方案',
    links: [
      { href: '/solutions', label: '解决方案' },
      // M38 GA: 知识中心主入口统一到 canonical /knowledge-base
      { href: '/knowledge-base', label: '知识中心' },
    ],
  },
  {
    title: '连接',
    links: [
      { href: '/register?role=BUYER', label: '发布检测需求' },
      { href: '/register?role=SUPPLIER', label: '供应能力' },
    ],
  },
  {
    title: '平台',
    links: [
      { href: '/about', label: '关于VISNDT' },
      { href: '/business', label: '商务合作' },
      { href: '/dashboard', label: '工作台' },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="bg-industrial-dark mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Area — 仅品牌标识，减少公司宣传文案 */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold font-mono tracking-tight">
                <span className="text-white">VIS</span>
                <span className="bg-gradient-to-r from-primary to-industrial-cyan bg-clip-text text-transparent">NDT</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mt-3">工业无损检测</p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-3 text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} VISNDT. 版权所有</p>
          <p>工业无损检测产品与技术方案平台</p>
        </div>
      </div>
    </footer>
  );
}
import Link from 'next/link';

const FOOTER_SECTIONS = [
  {
    title: '能力发现',
    links: [
      { href: '/search', label: '统一检索' },
      { href: '/categories', label: '能力分类' },
      { href: '/search?type=supplier-product', label: '能力型号 / 供应商' },
    ],
  },
  {
    title: '产品评估',
    links: [
      { href: '/products', label: '检测产品' },
      { href: '/products/compare', label: '产品对比' },
    ],
  },
  {
    title: '技术内容',
    links: [
      { href: '/solutions', label: '解决方案' },
      // M38 GA: 知识中心主入口统一到 canonical /knowledge-base
      { href: '/knowledge-base', label: '知识中心' },
    ],
  },
  {
    title: '平台',
    links: [
      { href: '/about', label: '关于VISNDT' },
      { href: '/business', label: '商务合作' },
    ],
  },
  {
    title: '支持',
    links: [
      { href: '/login', label: '登录' },
      { href: '/register', label: '注册' },
      { href: '/dashboard', label: '工作台' },
    ],
  },
  {
    title: '联系我们',
    links: [],
    custom: (
      <div className="space-y-2 text-sm text-slate-400">
        <p>邮箱：contact@visndt.com</p>
        <p>VISNDT平台团队</p>
      </div>
    ),
  },
];

export default function PublicFooter() {
  return (
    <footer className="bg-industrial-dark mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Area */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold font-mono tracking-tight">
                <span className="text-white">VIS</span>
                <span className="bg-gradient-to-r from-primary to-industrial-cyan bg-clip-text text-transparent">NDT</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mt-3">
              工业无损检测
              <br />
              产品与技术方案平台
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-3 text-white">
                {section.title}
              </h3>
              {section.custom ? (
                section.custom
              ) : (
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} VISNDT. 版权所有</p>
          <p>工业无损检测产品与技术方案平台</p>
        </div>
      </div>
    </footer>
  );
}
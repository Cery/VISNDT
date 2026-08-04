import Link from 'next/link';

const FOOTER_SECTIONS = [
  {
    title: '公司信息',
    links: [
      { href: '/about', label: '关于VISNDT' },
      { href: '/business', label: '商务合作' },
    ],
  },
  {
    title: '产品',
    links: [
      { href: '/products', label: '全部产品' },
      { href: '/categories', label: '分类' },
    ],
  },
  {
    title: '解决方案',
    links: [
      { href: '/solutions', label: '行业解决方案' },
      { href: '/knowledge', label: '知识中心' },
    ],
  },
  {
    title: '资源',
    links: [
      { href: '/knowledge', label: '技术文章' },
      { href: '/solutions', label: '应用案例' },
    ],
  },
  {
    title: '联系我们',
    links: [],
    custom: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>邮箱：contact@visndt.com</p>
        <p>VISNDT平台团队</p>
      </div>
    ),
  },
];

export default function PublicFooter() {
  return (
    <footer className="bg-industrial-dark mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Area */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-block text-xl font-extrabold text-white mb-2">
              VISNDT
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              工业检测设备信息平台
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
          <p>工业检测设备信息平台</p>
        </div>
      </div>
    </footer>
  );
}
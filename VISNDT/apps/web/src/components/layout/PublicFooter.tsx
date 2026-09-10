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
    <footer className="bg-[#161A1E] mt-auto">
      <div className="max-w-[1180px] mx-auto px-7 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 xm:grid-cols-[1.4fr_repeat(4,1fr)] gap-8">
          {/* Brand Area — 仅品牌标识，减少公司宣传文案 */}
          <div className="col-span-2 sm:col-span-3 xm:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-[19px] font-bold tracking-tight">
                <span className="text-[#D8D3C6]">VIS</span>
                <span className="text-blueprint-amber">NDT</span>
              </span>
            </Link>
            <p className="text-[13px] text-[#8B9198] leading-relaxed mt-3 max-w-[26em]">工业无损检测</p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-[13px] mb-3 text-[#D8D3C6]">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#8B9198] hover:text-[#D8D3C6] transition-colors"
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
      <div className="border-t border-[#2A3037]">
        <div className="max-w-[1180px] mx-auto px-7 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12.5px] text-[#8B9198]">
          <p>&copy; {new Date().getFullYear()} VISNDT. 版权所有</p>
          <p>工业无损检测产品与技术方案平台</p>
        </div>
      </div>
    </footer>
  );
}
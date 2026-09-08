import Link from 'next/link';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import PageContainer from '@/components/common/PageContainer';

/**
 * 835 Platform UIUX — Homepage Discovery Ledge（首页发现首屏）。
 *
 * 替换旧首页「品牌 Hero（HeroSection）」：不再用大段品牌价值 / 装饰遥测 / 多组 CTA 制造首屏。
 * 按 834 Target State（§17-A）首屏即「Search-first + Browse-first」：
 *   - 顶部一个高突出统一检索入口（纯入口，无类型选择器，落地 /search）
 *   - 其下一行动态能力发现锚点（分类 / 产品 / 方案 / 知识 / 对比）——对象明确、任务明确
 * 本项目不是品牌陈述区，而是「我能在这里找到什么 / 怎么开始找」的任务入口。
 * 无新增 Domain / API / 路由；GlobalSearchBar、/categories /products /solutions /knowledge-base /products/compare 全为既有权威路由。
 */
const QUICK_ANCHORS = [
  { href: '/categories', label: '能力分类', mono: 'CAP', desc: '按检测对象与应用场景浏览' },
  { href: '/products', label: '检测产品', mono: 'PRD', desc: '能力注册表 · 参数 · 检测对象' },
  { href: '/solutions', label: '解决方案', mono: 'SOL', desc: '检测问题 → 所需能力 → 落地产品' },
  { href: '/knowledge-base', label: '知识中心', mono: 'KNW', desc: '工程信息 · 参数解读 · 应用语境' },
  { href: '/products/compare', label: '产品对比', mono: 'CMP', desc: '参数级工程评估与横向对比' },
];

export default function HomeDiscoveryLedge() {
  return (
    <section className="bg-industrial-dark relative overflow-hidden">
      {/* 受控工业网格（低噪，非装饰遥测） */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.07]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-industrial-cyan/40 to-transparent" aria-hidden="true" />

      <PageContainer
        variant="content"
        paddingY={0}
        className="relative z-10 py-12 md:py-16"
      >
        {/* Search-first 主入口 */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-industrial-cyan mb-3">
            能力发现 &nbsp;/&nbsp; 统一检索
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            工业检测能力发现平台
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            一个入口检索检测能力、产品、技术知识与解决方案——从工程信息出发，直达能力评估与采购连接。
          </p>
          <div className="mt-6 max-w-xl">
            <GlobalSearchBar showTypeSelector={false} />
          </div>
        </div>

        {/* Object / Task 锚点（md:grid-cols-4 取 640–1024 中断点，避免 3→5 跳挤） */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 items-start">
          {QUICK_ANCHORS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:border-industrial-cyan/40 hover:bg-white/[0.06] transition-colors"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-industrial-cyan">{a.mono}</span>
              <p className="mt-1.5 text-sm font-semibold text-white group-hover:text-industrial-cyan transition-colors">
                {a.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-400 leading-snug">{a.desc}</p>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
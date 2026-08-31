import Link from 'next/link';
import SectionHeader from '@/components/brand/SectionHeader';
import PageContainer from '@/components/common/PageContainer';

/** Industrial application solutions — NOT supplier solutions */
const SOLUTIONS = [
  {
    id: 'sol-1',
    slug: 'aerospace',
    title: '航空航天检测',
    description: '用于飞机发动机、涡轮叶片和结构部件的高精度内窥镜检测。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    category: '航空航天',
  },
  {
    id: 'sol-2',
    slug: 'automotive',
    title: '汽车检测',
    description: '使用柔性视频内窥镜进行发动机气缸、喷油器和排气系统的检测。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17V7m0 0l4 4m-4-4l-4 4" />
      </svg>
    ),
    category: '汽车',
  },
  {
    id: 'sol-3',
    slug: 'pipeline',
    title: '管道检测',
    description: '用于排水、污水和工业管道内部检测的机器人爬行器系统。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    category: '基础设施',
  },
  {
    id: 'sol-4',
    slug: 'manufacturing',
    title: '制造质量控制',
    description: '用于焊缝检测、铸件缺陷检测和表面质量评估的无损检测。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    category: '制造',
  },
  {
    id: 'sol-5',
    slug: 'energy',
    title: '能源设备检测',
    description: '针对风力发电、核电站和热力管道等能源设施的无损检测方案。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    category: '能源',
  },
  {
    id: 'sol-6',
    slug: 'electronics',
    title: '电子与半导体',
    description: '用于PCB板、芯片封装和微电子组件的显微检测与缺陷分析。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    category: '电子',
  },
];

/**
 * M33.3 — 行业应用拆分构图（726 Contract，Industrial Tech Visual Language）
 * Before（M32/M33.2）：6 个完全相同的 Card（图标+标题+描述+分类芯片）均匀三列 → 均匀卡片墙。
 * After：结构性重组为「特色方案 Single Profile + 方案 rail」的 Split 构图：
 *   - 主区：SOLUTIONS[0]「特色方案档案」——大卡片、mono 编号、能力刻度、分类 metric
 *   - 从区：其余方案「技术 rail」——2 列紧凑技术行（mono 编号 + 标题 + 分类 + 箭向），非等高卡片
 * 数据来源（SOLUTIONS 常量）与 href（/solutions）完全不变；仅展示层构图重排。
 */
export default function SolutionsSection() {
  const [featured, ...rail] = SOLUTIONS;

  return (
    <section className="py-20 md:py-24 bg-surface-1">
      <PageContainer variant="content">
        <SectionHeader
          eyebrow="行业应用"
          title="工业检测解决方案"
          subtitle="为航空航天、汽车、能源、制造等关键行业量身定制的专业检测方案"
          className="mb-12 animate-slide-up"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* 特色方案档案（视觉锚点） */}
          <Link
            href="/solutions"
            className="group lg:col-span-5 relative overflow-hidden rounded-2xl border border-slate-200/80 bg-industrial-dark p-7 md:p-8 flex flex-col justify-between shadow-industrial-md hover:border-industrial-cyan/40 transition-all duration-300"
          >
            {/* 技术网格背景（受控低噪） */}
            <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden="true" />
            <div className="absolute inset-x-6 top-6 flex items-start justify-between relative z-10">
              <span className="font-mono text-xs text-industrial-cyan tracking-[0.22em] uppercase">featured / 01</span>
              <span className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                {featured.icon}
              </span>
            </div>
            <div className="relative z-10 mt-16">
              <h3 className="text-2xl font-bold text-white">{featured.title}</h3>
              <p className="text-slate-400 mt-3 leading-relaxed max-w-md">{featured.description}</p>
              <div className="mt-5 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-industrial-cyan/15 text-industrial-cyan border border-industrial-cyan/20">
                  {featured.category}
                </span>
                <span className="font-mono text-xs text-slate-500">{featured.slug}</span>
              </div>
            </div>
            <span className="relative z-10 mt-6 inline-flex items-center gap-1 text-sm font-medium text-industrial-cyan">
              进入方案
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          {/* 方案技术 rail */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {rail.map((sol, idx) => (
              <Link
                key={sol.id}
                href="/solutions"
                className="group relative flex items-start gap-4 rounded-xl border border-slate-200/80 bg-surface-1 p-5 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-lg flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform duration-300">
                  {sol.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {sol.title}
                    </h3>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">{String(idx + 2).padStart(2, '0')}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1 line-clamp-2">{sol.description}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-slate-400">
                    <span className="text-primary">{sol.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />
                    <span className="font-mono">{sol.slug}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            查看全部解决方案
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
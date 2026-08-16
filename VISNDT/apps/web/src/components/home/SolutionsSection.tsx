import Link from 'next/link';

/** Industrial application solutions — NOT supplier solutions */
const SOLUTIONS = [
  {
    id: 'sol-1',
    slug: 'aerospace',
    title: '航空航天检测',
    description: '用于飞机发动机、涡轮叶片和结构部件的高精度内窥镜检测。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    category: '电子',
  },
];

export default function SolutionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            行业应用
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            工业检测解决方案
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            为航空航天、汽车、能源、制造等关键行业量身定制的专业检测方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {SOLUTIONS.map((sol) => (
            <Link
              key={sol.id}
              href={`/solutions`}
              className="group flex gap-4 rounded-xl border border-slate-200/80 p-5 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform duration-300">
                {sol.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    {sol.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex-shrink-0">
                    {sol.category}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {sol.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  了解更多
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            查看全部解决方案
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
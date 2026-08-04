/** Industrial application solutions — NOT supplier solutions */
const SOLUTIONS = [
  {
    id: 'sol-1',
    title: '航空航天检测',
    description: '用于飞机发动机、涡轮叶片和结构部件的高精度内窥镜检测。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    id: 'sol-2',
    title: '汽车检测',
    description: '使用柔性视频内窥镜进行发动机气缸、喷油器和排气系统的检测。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17V7m0 0l4 4m-4-4l-4 4" />
      </svg>
    ),
  },
  {
    id: 'sol-3',
    title: '管道检测',
    description: '用于排水、污水和工业管道内部检测的机器人爬行器系统。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'sol-4',
    title: '制造质量控制',
    description: '用于焊缝检测、铸件缺陷检测和表面质量评估的无损检测。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function SolutionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            工业应用解决方案
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            为不同工业场景量身定制的专业检测解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              className="flex gap-4 rounded-xl border border-slate-200/80 border-l-2 border-l-primary p-6 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-xl flex items-center justify-center text-slate-600">
                {sol.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{sol.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{sol.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
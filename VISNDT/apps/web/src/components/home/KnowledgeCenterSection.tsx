import Link from 'next/link';

/**
 * Knowledge Center entry — surfaces the industrial inspection knowledge
 * base as the platform's capability-education layer (Context Provider, not
 * matching engine).
 */
const KNOWLEDGE_DOMAINS = [
  {
    title: '检测技术',
    description: '内窥镜、超声、涡流等无损检测技术原理与选型指导。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 13.5a3 3 0 113-3 3 3 0 01-3 3zm0 0v3m3-3h3m-6 3.75a7.5 7.5 0 113 0" />
      </svg>
    ),
  },
  {
    title: '检测场景',
    description: '面向航空航天、汽车、管道等典型场景的检测方案拆解。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h4m-4-5v9m8-9v9m3-4h2M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    title: '设备应用',
    description: '检测相机、测量系统等设备在实际工况中的应用要点。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    title: '行业应用',
    description: '不同工业领域的无损检测标准与合规要求解读。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: '检测方法',
    description: '具体缺陷类型对应的检测方法与操作规范说明。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: '参数指导',
    description: '关键检测参数（分辨率、直径、焦距等）的选型指导。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function KnowledgeCenterSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            知识中心
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            工业检测知识体系
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            结构化的检测知识，帮助需求方理解检测能力边界，辅助能力提供商规范展示。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {KNOWLEDGE_DOMAINS.map((d) => (
            <Link
              key={d.title}
              href="/knowledge-base"
              className="group flex gap-4 rounded-xl border border-slate-200/80 p-5 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform duration-300">
                {d.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                  {d.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1">{d.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/knowledge-base"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            进入知识中心
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
import Link from 'next/link';
import SectionHeader from '@/components/brand/SectionHeader';

const FLOW_STEPS = [
  {
    step: '01',
    title: '发现产品',
    description: '浏览工业内窥镜、检测相机、测量系统等标准化产品目录。',
    href: '/products',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: '匹配方案',
    description: '获取面向航空航天、汽车、管道等行业场景的专业检测方案。',
    href: '/solutions',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: '提交需求',
    description: '发布检测需求，平台智能匹配具备相应能力的供应商。',
    href: '/register',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    step: '04',
    title: '获取报价',
    description: '发起询价（RFQ），获取供应商响应并完成采购决策。',
    href: '/register',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function PlatformFlowSection() {
  return (
    <section className="py-20 bg-industrial-slate">
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeader
          eyebrow="平台流程"
          title="从产品到报价，一站式完成"
          subtitle="VISNDT 平台遵循 Product → Solution → Demand → RFQ 的业务闭环，帮助您高效完成工业检测设备采购。"
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLOW_STEPS.map((step, idx) => (
            <Link
              key={step.step}
              href={step.href}
              className="group relative rounded-xl border border-slate-200/80 bg-white p-6 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Step number */}
              <span className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-primary to-industrial-cyan text-white rounded-full flex items-center justify-center text-xs font-bold shadow-industrial-sm">
                {step.step}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>

              <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Arrow connector (desktop only) */}
              {idx < FLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
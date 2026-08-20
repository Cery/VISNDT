import Link from 'next/link';

/**
 * Capability Provider section — presents suppliers strictly as industrial
 * inspection capability providers (NOT storefronts, sellers, or transaction
 * parties). No marketplace / store / sales-statistics language allowed.
 */
const CAPABILITY_POINTS = [
  {
    title: '设备能力',
    description: '展示可提供的工业检测设备与关键性能参数。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    title: '技术方案',
    description: '针对特定检测场景提供可落地的技术解决方案。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: '行业资质',
    description: '提供检测相关的资质、认证与合规能力信息。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: '响应交付',
    description: '基于 RFQ 响应机制，对检测需求作出确定性响应。',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3M7 11h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function CapabilityProviderSection() {
  return (
    <section className="py-20 bg-industrial-slate">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            能力提供商
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            面向检测需求的能力提供
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            VISNDT 以「能力提供商」连接检测需求方，围绕设备、方案与响应能力开展确定性撮合。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CAPABILITY_POINTS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-industrial-sm transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                {p.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search?type=supplier"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg font-semibold shadow-industrial-sm hover:opacity-95 hover:-translate-y-0.5 transition-all"
          >
            发现能力提供商
          </Link>
          <Link
            href="/register?role=SUPPLIER"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-lg font-semibold hover:border-slate-300 hover:-translate-y-0.5 transition-all"
          >
            成为能力提供商
          </Link>
        </div>
      </div>
    </section>
  );
}
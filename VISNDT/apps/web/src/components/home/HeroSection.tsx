import Link from 'next/link';
import IndustrialBadge from '@/components/brand/IndustrialBadge';

const CORE_CAPABILITIES = [
  { key: 'discovery', label: '能力发现', hint: '标准化产品目录' },
  { key: 'connection', label: '技术连接', hint: '需求与方案匹配' },
  { key: 'matching', label: '需求匹配', hint: '确定性 RFQ 撮合' },
];

export default function HeroSection() {
  return (
    <section className="relative bg-industrial-dark py-24 md:py-32 lg:py-36 overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-40" />
      {/* Top-left glow */}
      <div className="absolute -left-20 top-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      {/* Right-center glow */}
      <div className="absolute -right-20 top-1/3 w-96 h-96 bg-industrial-cyan/10 rounded-full blur-[120px]" />
      {/* Bottom glow */}
      <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

      {/* Capability network visual — nodes & connections (Industrial Technology Sense) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.16] pointer-events-none"
        viewBox="0 0 1200 600"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" className="text-industrial-cyan/70">
          <line x1="180" y1="120" x2="360" y2="240" strokeWidth="1" />
          <line x1="360" y1="240" x2="620" y2="180" strokeWidth="1" />
          <line x1="620" y1="180" x2="880" y2="300" strokeWidth="1" />
          <line x1="360" y1="240" x2="540" y2="420" strokeWidth="1" />
          <line x1="620" y1="180" x2="760" y2="430" strokeWidth="1" />
          <line x1="880" y1="300" x2="1040" y2="200" strokeWidth="1" />
          <line x1="540" y1="420" x2="760" y2="430" strokeWidth="1" />
          <line x1="880" y1="300" x2="540" y2="420" strokeWidth="1" />
        </g>
        <g fill="currentColor" className="text-industrial-cyan">
          <circle cx="180" cy="120" r="4" />
          <circle cx="360" cy="240" r="6" />
          <circle cx="620" cy="180" r="5" />
          <circle cx="880" cy="300" r="6" />
          <circle cx="540" cy="420" r="4" />
          <circle cx="760" cy="430" r="5" />
          <circle cx="1040" cy="200" r="4" />
        </g>
        <g fill="currentColor" className="text-primary/80">
          <circle cx="820" cy="140" r="3" />
          <circle cx="240" cy="380" r="3" />
          <circle cx="980" cy="420" r="3" />
        </g>
      </svg>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        {/* Platform Badge (VISNDT Visual Language v1) */}
        <IndustrialBadge label="工业检测能力发现平台" className="mb-6 animate-fade-in" />

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-5 leading-tight animate-slide-up">
          工业无损检测
          <br />
          <span className="bg-gradient-to-r from-industrial-cyan to-primary bg-clip-text text-transparent">
            产品与技术方案
          </span>
          {' '}一站式平台
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up">
          连接工业检测需求方与能力提供商——发现高精度内窥镜、检测相机、测量系统，
          获取面向航空航天、汽车、管道、制造等行业的专业检测解决方案。
        </p>

        {/* Core capability value strip */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slide-up">
          {CORE_CAPABILITIES.map((c) => (
            <div
              key={c.key}
              className="group inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-industrial-cyan/30 hover:bg-white/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-industrial-cyan group-hover:bg-primary transition-colors" />
              <span className="text-sm font-medium text-slate-200">{c.label}</span>
              <span className="text-xs text-slate-500">{c.hint}</span>
            </div>
          ))}
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-slide-up">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-industrial-cyan to-primary text-white rounded-lg font-semibold shadow-industrial-lg hover:opacity-95 transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            浏览产品
          </Link>
          <Link
            href="/solutions"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 backdrop-blur-sm bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 hover:border-industrial-cyan/30 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            探索解决方案
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 backdrop-blur-sm bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 hover:border-primary/30 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            提交需求
          </Link>
        </div>

        {/* Role Entry Points */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <span className="text-sm text-slate-500">快速入口：</span>
          <Link
            href="/register?role=BUYER"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            我是检测需求方
          </Link>
          <Link
            href="/register?role=SUPPLIER"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            我是能力提供商
          </Link>
        </div>
      </div>
    </section>
  );
}
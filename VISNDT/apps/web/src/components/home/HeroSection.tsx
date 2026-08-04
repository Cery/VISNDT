import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-industrial-dark py-28 md:py-36 overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-40" />
      {/* Left glow */}
      <div className="absolute -left-20 top-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      {/* Right glow */}
      <div className="absolute -right-20 bottom-0 w-96 h-96 bg-industrial-cyan/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="inline-block w-8 h-px bg-industrial-cyan/60" />
          <span className="text-sm font-medium text-industrial-cyan tracking-widest uppercase">
            工业检测解决方案平台
          </span>
          <span className="inline-block w-8 h-px bg-industrial-cyan/60" />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          探索工业内窥镜产品
          <br />
          <span className="text-industrial-cyan">与技术解决方案</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          专业的工业无损检测设备平台——发现来自领先制造商的高精度内窥镜、检测相机和测量系统。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-industrial-cyan to-primary text-white rounded-lg font-semibold shadow-industrial-lg hover:opacity-95 transition-all hover:-translate-y-0.5"
          >
            浏览产品
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 backdrop-blur-sm bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5"
          >
            查看分类
          </Link>
        </div>
      </div>
    </section>
  );
}
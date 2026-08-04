import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 md:py-32">
      {/* Subtle grid overlay for industrial feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <p className="text-sm md:text-base text-slate-400 uppercase tracking-widest mb-4">
          工业检测解决方案平台
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
          探索工业内窥镜产品
          <br />
          <span className="text-slate-300">与技术解决方案</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10">
          专业的工业无损检测设备平台——发现来自领先制造商的高精度内窥镜、检测相机和测量系统。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 rounded-md font-medium hover:bg-slate-200 transition-colors"
          >
            浏览产品
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-8 py-3 border border-slate-500 text-white rounded-md font-medium hover:bg-slate-800 transition-colors"
          >
            查看分类
          </Link>
        </div>
      </div>
    </section>
  );
}
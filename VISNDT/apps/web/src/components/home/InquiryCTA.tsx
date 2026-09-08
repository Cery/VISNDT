import Link from 'next/link';

/**
 * 846 §14 Demand Entry — 首页采购需求入口。
 * 任务化语言（非营销文案）：找不到合适能力 → 告知检测需求 → 提交采购需求。
 * 需求创建路径 /workspace/demands/create 未登录时会引导登录后继续。
 */
export default function InquiryCTA() {
  return (
    <section className="py-20 bg-industrial-dark relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-20 pointer-events-none" />
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
        <p className="text-sm font-semibold text-industrial-cyan tracking-widest uppercase mb-4">
          采购需求
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          找不到合适的检测能力？
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          告诉我们您的检测需求，匹配到的供应商会针对您的询价提交报价，并在云端对照真实关键参数自动校核。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/workspace/demands/create"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-industrial-cyan to-primary text-white rounded-lg font-semibold shadow-industrial-lg hover:opacity-95 hover:-translate-y-0.5 hover:shadow-glow transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            提交采购需求
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-900 rounded-lg font-semibold shadow-industrial-lg hover:-translate-y-0.5 hover:shadow-glow transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            浏览检测产品
          </Link>
        </div>
      </div>
    </section>
  );
}
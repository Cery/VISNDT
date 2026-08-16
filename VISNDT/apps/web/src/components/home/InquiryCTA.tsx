import Link from 'next/link';

/**
 * Inquiry CTA — bottom-of-page conversion section.
 * Links to /login for authenticated users (redirects to workspace) or /register for new users.
 */
export default function InquiryCTA() {
  return (
    <section className="py-20 bg-industrial-dark relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-20 pointer-events-none" />
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <p className="text-sm font-semibold text-industrial-cyan tracking-widest uppercase mb-4">
          Get Started
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          开始您的工业检测之旅
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          无论您是寻找检测设备的需求方，还是提供检测方案的能力提供商，
          VISNDT 为您提供从产品发现到报价匹配的一站式体验。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-900 rounded-lg font-semibold shadow-industrial-lg hover:-translate-y-0.5 hover:shadow-glow transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            登录平台
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-industrial-cyan to-primary text-white rounded-lg font-semibold shadow-industrial-lg hover:opacity-95 hover:-translate-y-0.5 hover:shadow-glow transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            免费注册
          </Link>
        </div>

        <p className="text-slate-500 text-xs">
          注册即表示同意 VISNDT 平台服务条款和隐私政策
        </p>
      </div>
    </section>
  );
}
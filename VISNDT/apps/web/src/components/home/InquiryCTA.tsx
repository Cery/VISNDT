import Link from 'next/link';

/**
 * Inquiry CTA — placeholder only.
 * Currently links to /login.
 * POST /inquiries will be implemented in Batch 3.
 */
export default function InquiryCTA() {
  return (
    <section className="py-20 bg-industrial-dark relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-30 pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          需要定制检测方案？
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          提交询价，我们的团队将为您匹配合适的检测设备和专业技术支持。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold shadow-industrial-lg hover:-translate-y-0.5 transition-all"
          >
            请求报价
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-white/20 backdrop-blur-sm bg-white/5 text-white rounded-lg font-medium hover:bg-white/10 transition-all"
          >
            快速询价
          </Link>
        </div>
        <p className="text-slate-400 text-xs mt-6">
          注册后即可提交询价。完整询价表单将在后续更新中推出。
        </p>
      </div>
    </section>
  );
}
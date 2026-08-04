import Link from 'next/link';

/**
 * Inquiry CTA — placeholder only.
 * Currently links to /login.
 * POST /inquiries will be implemented in Batch 3.
 */
export default function InquiryCTA() {
  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          需要定制检测方案？
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          提交询价，我们的团队将为您匹配合适的检测设备和专业技术支持。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 rounded-md font-medium hover:bg-slate-200 transition-colors"
          >
            请求报价
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-slate-500 text-white rounded-md font-medium hover:bg-slate-800 transition-colors"
          >
            快速询价
          </Link>
        </div>
        <p className="text-slate-500 text-xs mt-6">
          注册后即可提交询价。完整询价表单将在后续更新中推出。
        </p>
      </div>
    </section>
  );
}
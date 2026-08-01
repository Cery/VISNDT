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
          Need a Custom Inspection Solution?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          Submit an inquiry and our team will connect you with the right
          equipment and technical expertise for your inspection needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-900 rounded-md font-medium hover:bg-slate-200 transition-colors"
          >
            Request Quotation
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-slate-500 text-white rounded-md font-medium hover:bg-slate-800 transition-colors"
          >
            Quick Inquiry
          </Link>
        </div>
        <p className="text-slate-500 text-xs mt-6">
          Inquiry submission will be available after registration. Full inquiry form coming in a future update.
        </p>
      </div>
    </section>
  );
}
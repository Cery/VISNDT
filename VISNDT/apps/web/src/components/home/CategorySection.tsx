import Link from 'next/link';

/** Frozen product categories — NOT Supplier categories */
const CATEGORIES = [
  { id: 'cat-1', name: 'Electronic Video Endoscope', slug: 'electronic-video-endoscope', description: 'High-resolution digital video inspection systems with flexible probe design' },
  { id: 'cat-2', name: 'Optical Endoscope', slug: 'optical-endoscope', description: 'Rigid optical borescopes for precision industrial inspection' },
  { id: 'cat-3', name: 'Fiber Optic Endoscope', slug: 'fiber-optic-endoscope', description: 'Flexible fiber optic imaging for narrow and curved access points' },
  { id: 'cat-4', name: 'Pipeline Inspection Camera', slug: 'pipeline-inspection-camera', description: 'Robotic and crawler-based pipeline inspection systems' },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Product Categories
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Browse industrial inspection equipment by standardized product categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group rounded-lg border border-slate-200 p-6 hover:border-slate-400 hover:shadow-md transition-all"
            >
              {/* Icon placeholder */}
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
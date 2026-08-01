/** Industrial application solutions — NOT supplier solutions */
const SOLUTIONS = [
  {
    id: 'sol-1',
    title: 'Aerospace Inspection',
    description: 'High-precision borescope inspection for aircraft engines, turbine blades, and structural components.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    id: 'sol-2',
    title: 'Automotive Inspection',
    description: 'Engine cylinder, fuel injector, and exhaust system inspection using flexible video endoscopes.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17V7m0 0l4 4m-4-4l-4 4" />
      </svg>
    ),
  },
  {
    id: 'sol-3',
    title: 'Pipeline Inspection',
    description: 'Robotic crawler systems for drainage, sewer, and industrial pipeline internal inspection.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'sol-4',
    title: 'Manufacturing Quality Control',
    description: 'Non-destructive testing for weld inspection, casting defect detection, and surface quality evaluation.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function SolutionsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Industrial Application Solutions
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Professional inspection solutions tailored for diverse industrial scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {SOLUTIONS.map((sol) => (
            <div
              key={sol.id}
              className="flex gap-4 rounded-lg border border-slate-200 p-6 hover:border-slate-400 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                {sol.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{sol.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{sol.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
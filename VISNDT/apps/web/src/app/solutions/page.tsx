import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industrial Inspection Solutions – VISNDT',
  description:
    'Explore industrial inspection solutions for aerospace, automotive, pipeline, electronics, and manufacturing applications.',
};

const SOLUTIONS = [
  {
    title: 'Aerospace Inspection',
    description:
      'High-precision non-destructive testing solutions for aircraft components, turbine blades, and composite structures. Ensure flight safety with advanced visual and ultrasonic inspection systems.',
    scenario: 'Aircraft engine borescope inspection, composite material flaw detection, weld quality assessment.',
  },
  {
    title: 'Automotive Inspection',
    description:
      'Comprehensive inspection solutions for engine components, transmission systems, and body structures. Detect defects early in the manufacturing process.',
    scenario: 'Engine cylinder bore inspection, casting defect detection, assembly line quality control.',
  },
  {
    title: 'Pipeline Inspection',
    description:
      'Advanced pipeline inspection cameras and crawler systems for internal pipe examination. Identify corrosion, blockages, and structural issues in industrial pipelines.',
    scenario: 'Municipal drainage inspection, petrochemical pipeline assessment, HVAC duct inspection.',
  },
  {
    title: 'Electronics Inspection',
    description:
      'Microscopic inspection solutions for PCB assembly, semiconductor manufacturing, and electronic component quality assurance.',
    scenario: 'PCB solder joint inspection, IC lead frame examination, connector pin verification.',
  },
  {
    title: 'Manufacturing Inspection',
    description:
      'Inline and offline inspection systems for quality control across manufacturing processes. From raw material inspection to final product verification.',
    scenario: 'Machined part surface inspection, weld bead examination, coating quality assessment.',
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Industrial Inspection Solutions
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Comprehensive non-destructive testing and visual inspection solutions
            for critical industrial applications.
          </p>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((solution) => (
            <div
              key={solution.title}
              className="rounded-lg border border-slate-200 bg-white p-6 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-slate-900 mb-2">
                {solution.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {solution.description}
              </p>
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Application
                </span>
                <p className="text-xs text-slate-500 mt-1">{solution.scenario}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
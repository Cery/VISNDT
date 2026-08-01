import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knowledge Center – VISNDT',
  description:
    'Technical articles, inspection guides, application cases, and equipment selection guides for industrial inspection professionals.',
};

const SECTIONS = [
  {
    title: 'Inspection Guide',
    description:
      'Fundamental principles and methodologies for industrial non-destructive testing. Learn about visual inspection, ultrasonic testing, radiographic testing, and other NDT techniques.',
    items: [
      'Introduction to Visual Inspection',
      'Understanding Endoscope Specifications',
      'NDT Method Selection Guide',
      'Inspection Standards Overview',
    ],
  },
  {
    title: 'Technology Articles',
    description:
      'In-depth technical articles covering the latest developments in industrial inspection equipment, imaging technologies, and measurement techniques.',
    items: [
      'HD vs Standard Definition Endoscopes',
      'Stereo Measurement Technology',
      'UV and IR Inspection Applications',
      'Digital Image Processing in NDT',
    ],
  },
  {
    title: 'Application Cases',
    description:
      'Real-world case studies demonstrating how industrial inspection equipment is deployed across various industries to solve critical quality and safety challenges.',
    items: [
      'Aerospace: Turbine Blade Inspection',
      'Automotive: Engine Block Quality Control',
      'Energy: Boiler Tube Examination',
      'Civil: Bridge Structure Assessment',
    ],
  },
  {
    title: 'Selection Guide',
    description:
      'Practical guidance for selecting the right inspection equipment based on your specific application requirements, environment, and budget considerations.',
    items: [
      'Choosing the Right Probe Diameter',
      'Articulation vs Fixed Borescopes',
      'Portable vs Benchtop Systems',
      'Factors Affecting Image Quality',
    ],
  },
];

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Knowledge Center
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Expert resources for industrial inspection professionals. Guides,
            articles, case studies, and equipment selection advice.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-2">
                {section.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {section.description}
              </p>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-slate-600 flex items-start gap-2"
                  >
                    <span className="text-slate-300 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
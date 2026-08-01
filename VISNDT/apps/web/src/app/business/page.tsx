import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Cooperation – VISNDT',
  description:
    'Partner with VISNDT for industrial inspection equipment manufacturing, technology collaboration, and industry cooperation.',
};

const SECTIONS = [
  {
    title: 'Manufacturers',
    description:
      'Join our platform as a manufacturer to showcase your industrial inspection equipment. Reach qualified buyers, receive inquiries, and expand your market presence.',
    highlights: [
      'Product listing and technical specification management',
      'Receive targeted inquiries from industrial buyers',
      'Access demand matching and RFQ opportunities',
      'Build your brand in the industrial NDT market',
    ],
  },
  {
    title: 'Technology Partners',
    description:
      'Collaborate with VISNDT on technology development, industry standards, and innovation projects. We partner with research institutions and technology companies.',
    highlights: [
      'Joint research and development initiatives',
      'Industry standard development participation',
      'Technology validation and testing programs',
      'Knowledge sharing and technical workshops',
    ],
  },
  {
    title: 'Industry Cooperation',
    description:
      'Engage with VISNDT through industry associations, trade events, and professional networks. Together we advance the industrial inspection industry.',
    highlights: [
      'Industry event and exhibition participation',
      'Professional training and certification programs',
      'Cross-industry application development',
      'Global market access and localization support',
    ],
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Business Cooperation
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Partner with the leading industrial inspection equipment information
            platform. Together we serve the global NDT community.
          </p>
        </div>
      </section>

      {/* Cooperation Sections */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border border-slate-200 bg-white p-8"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {section.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                {section.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
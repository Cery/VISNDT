import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About VISNDT',
  description: 'About VISNDT - Industrial Inspection Equipment Information Platform',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">About VISNDT</h1>

      <div className="prose prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            VISNDT is a professional industrial inspection equipment information
            platform dedicated to connecting buyers with high-quality inspection
            equipment manufacturers. We provide comprehensive product information,
            detailed technical specifications, and efficient inquiry channels to help
            you find the right equipment for your needs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-2">Product Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Browse a comprehensive catalog of industrial inspection equipment
                with detailed technical parameters and specifications.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-2">Category Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Navigate products by industry-standard categories to quickly find
                equipment relevant to your field.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-2">Direct Inquiry</h3>
              <p className="text-sm text-muted-foreground">
                Submit inquiries directly to manufacturers through our platform for
                pricing, availability, and technical consultation.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-2">Manufacturer Info</h3>
              <p className="text-sm text-muted-foreground">
                Access manufacturer information including enterprise qualifications
                and product source details for informed decision-making.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Industries Served</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our platform serves a wide range of industries including aerospace,
            automotive, energy, manufacturing, construction, and research
            institutions. Whether you need ultrasonic testing equipment, radiographic
            inspection systems, or visual inspection tools, VISNDT helps you find
            the right solution.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Email:</strong>{' '}
              contact@visndt.com
            </p>
            <p>
              <strong className="text-foreground">Address:</strong>{' '}
              VISNDT Platform Team
            </p>
            <p className="mt-3">
              For product inquiries, please use the inquiry form on the respective
              product detail page. For general questions, feel free to reach out via
              email.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
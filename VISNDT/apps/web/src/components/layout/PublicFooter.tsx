import Link from 'next/link';

const FOOTER_SECTIONS = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About VISNDT' },
      { href: '/business', label: 'Business Cooperation' },
    ],
  },
  {
    title: 'Products',
    links: [
      { href: '/products', label: 'All Products' },
      { href: '/categories', label: 'Categories' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/solutions', label: 'Industry Solutions' },
      { href: '/knowledge', label: 'Knowledge Center' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/knowledge', label: 'Technical Articles' },
      { href: '/solutions', label: 'Application Cases' },
    ],
  },
  {
    title: 'Contact',
    links: [],
    custom: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Email: contact@visndt.com</p>
        <p>VISNDT Platform Team</p>
      </div>
    ),
  },
];

export default function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-3 text-foreground">
                {section.title}
              </h3>
              {section.custom ? (
                section.custom
              ) : (
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VISNDT. All rights reserved.</p>
          <p>Industrial Inspection Equipment Information Platform</p>
        </div>
      </div>
    </footer>
  );
}
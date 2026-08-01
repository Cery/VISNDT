import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/about', label: 'About VISNDT' },
  { href: '/business', label: 'Business Cooperation' },
];

export default function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">VISNDT</h3>
            <p className="text-sm text-muted-foreground">
              Industrial inspection equipment information platform
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Links</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
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
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: contact@visndt.com
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VISNDT. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
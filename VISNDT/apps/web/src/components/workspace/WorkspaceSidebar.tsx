'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'My Demands', href: '/workspace/demands', icon: '📋' },
  { label: 'RFQs', href: '/workspace/rfqs', icon: '📄' },
  { label: 'Matches', href: '/workspace/matches', icon: '🔗' },
  { label: 'Settings', href: '/workspace/settings', icon: '⚙️' },
];

interface WorkspaceSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function WorkspaceSidebar({ mobileOpen, onClose }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-56 bg-slate-900 text-white min-h-screen flex-shrink-0
          fixed md:sticky top-0 left-0 z-50 transition-transform
          md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-4 py-6">
          <Link
            href="/workspace"
            className="block text-lg font-bold mb-6"
            onClick={onClose}
          >
            Workspace
          </Link>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
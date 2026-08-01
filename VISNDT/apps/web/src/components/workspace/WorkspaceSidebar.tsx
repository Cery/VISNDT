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

export default function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-slate-900 text-white min-h-screen flex-shrink-0">
      <div className="px-4 py-6">
        <Link href="/workspace" className="block text-lg font-bold mb-6">
          Workspace
        </Link>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
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
  );
}
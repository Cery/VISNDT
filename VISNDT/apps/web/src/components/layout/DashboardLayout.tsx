import Link from 'next/link';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4 hidden md:block">
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/workspace"
            className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
          >
            Workspace
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
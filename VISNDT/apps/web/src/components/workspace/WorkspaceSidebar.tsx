'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/auth/AuthProvider';
import type { WorkspaceRole } from '@/services/auth.service';

type NavigableWorkspaceRole = Exclude<WorkspaceRole, null>;

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const NAV_CONFIG: Record<NavigableWorkspaceRole, NavItem[]> = {
  BUYER: [
    { label: '仪表盘', href: '/dashboard/buyer', icon: '📊' },
    { label: '我的需求', href: '/workspace/demands', icon: '📋' },
    { label: '询价单', href: '/workspace/rfqs', icon: '📄' },
    { label: '匹配结果', href: '/workspace/matches', icon: '🔗' },
    { label: '通知中心', href: '/workspace/notifications', icon: '🔔' },
    { label: '设置', href: '/workspace/settings', icon: '⚙️' },
  ],
  SUPPLIER: [
    { label: '仪表盘', href: '/dashboard/supplier', icon: '📊' },
    { label: 'RFQs', href: '/workspace/supplier/rfqs', icon: '📄' },
    { label: 'Responses', href: '/workspace/supplier/responses', icon: '📨' },
    { label: 'Offers', href: '/workspace/supplier/offers', icon: '📦' },
    { label: 'Opportunities', href: '/workspace/supplier/opportunities', icon: '🎯' },
    { label: 'Profile', href: '/workspace/supplier/profile', icon: '🏢' },
    { label: 'Notifications', href: '/workspace/notifications', icon: '🔔' },
    { label: 'Display', href: '/workspace/supplier/display', icon: '📋' },
  ],
};

interface WorkspaceSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function WorkspaceSidebar({ mobileOpen, onClose }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const workspaceRole = user ? user.workspaceRole : null;
  const navItems = workspaceRole ? NAV_CONFIG[workspaceRole] : [];

  const activeHref = navItems.reduce<string>((matchedHref, item) => {
    const matches = pathname === item.href || pathname.startsWith(`${item.href}/`);

    if (!matches) {
      return matchedHref;
    }

    return item.href.length > matchedHref.length ? item.href : matchedHref;
  }, '');

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
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/workspace"
              className="block text-lg font-bold"
              onClick={onClose}
            >
              工作区
            </Link>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="space-y-1">
            {isLoading && <p className="px-3 py-2 text-sm text-slate-400">加载中...</p>}
            {!isLoading && !workspaceRole && (
              <p className="px-3 py-2 text-sm text-slate-400">当前账号未映射到可用工作区</p>
            )}
            {!isLoading && workspaceRole && navItems.map((item) => {
              const active = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
                    active
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full border border-slate-600 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

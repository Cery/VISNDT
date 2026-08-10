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
    { label: '供应商工作台', href: '/workspace/supplier', icon: '🏭' },
    { label: 'RFQ响应', href: '/workspace/supplier/rfqs', icon: '📄' },
    { label: '我的响应', href: '/workspace/supplier/responses', icon: '📨' },
    { label: '通知中心', href: '/workspace/notifications', icon: '🔔' },
    { label: '设置', href: '/workspace/settings', icon: '⚙️' },
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
          <Link
            href="/workspace"
            className="block text-lg font-bold mb-6"
            onClick={onClose}
          >
            工作区
          </Link>
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/auth/AuthProvider';
import UiIcon from '@/lib/ui-icon';
import type { UiIconName } from '@/lib/ui-icon';
import type { WorkspaceRole } from '@/services/auth.service';

type NavigableWorkspaceRole = Exclude<WorkspaceRole, null>;

interface NavItem {
  label: string;
  href: string;
  icon: UiIconName;
  badge?: string;
}

const NAV_CONFIG: Record<NavigableWorkspaceRole, NavItem[]> = {
  BUYER: [
    { label: '仪表盘', href: '/dashboard/buyer', icon: 'dashboard' },
    { label: '我的需求', href: '/workspace/demands', icon: 'list' },
    { label: '我的询价请求', href: '/workspace/rfqs', icon: 'file' },
    { label: '匹配结果', href: '/workspace/matches', icon: 'link' },
    { label: '通知中心', href: '/workspace/notifications', icon: 'bell' },
    { label: '设置', href: '/workspace/settings', icon: 'settings' },
  ],
  SUPPLIER: [
    { label: '仪表盘', href: '/dashboard/supplier', icon: 'dashboard' },
    { label: 'RFQ 机会', href: '/workspace/supplier/rfqs', icon: 'file' },
    { label: '我的响应', href: '/workspace/supplier/responses', icon: 'send' },
    { label: '我的报价', href: '/workspace/supplier/offers', icon: 'package' },
    { label: '商机', href: '/workspace/supplier/opportunities', icon: 'target' },
    { label: '运行时能力', href: '/workspace/supplier/runtime', icon: 'link' },
    { label: '企业资料', href: '/workspace/supplier/profile', icon: 'building' },
    { label: '通知中心', href: '/workspace/notifications', icon: 'bell' },
    { label: '能力展示', href: '/workspace/supplier/display', icon: 'list' },
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
                  <UiIcon name={item.icon} size={18} color="#94a3b8" />
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

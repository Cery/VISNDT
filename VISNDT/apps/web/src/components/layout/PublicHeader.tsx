'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/auth/AuthProvider';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import { Drawer } from '@/components/ui/Drawer';

// 800_M39 / 835 Platform UIUX — Global Navigation in user language.
// 设计决策（专业复核）：原为「发现/产品/方案/连接」四层巨型下拉，但每层仅 2 个子项，
// 对仅两个目的地下拉属过度设计（点击两步 + hover 面板复杂度）。扁平化为单级平铺导航：
// 直接可达、减少步数、更可扫读，符合 B2B 工业选型站主导航惯例。
// 同时移除冗余「统一检索」项——顶部栏已有常驻搜索框，导航内再放搜索入口属重复。
// 角色化「采购需求 / 供应能力」保持按登录态诚实路由（guestHref/authHref）。

interface NavEntry {
  label: string;
  /** 静态公开页路由 */
  href: string;
  /** 任务类入口描述（移动端展示）；需要登录的入口经 guestHref/authHref 按角色路由。 */
  desc?: string;
  authHref?: string;
  guestHref?: string;
}

const NAV_ENTRIES: NavEntry[] = [
  { label: '能力分类', href: '/categories' },
  { label: '检测产品', href: '/products' },
  { label: '产品对比', href: '/products/compare' },
  { label: '解决方案', href: '/solutions' },
  { label: '知识中心', href: '/knowledge-base' },
  {
    label: '采购需求',
    href: '/register?role=BUYER',
    guestHref: '/register?role=BUYER',
    authHref: '/workspace/demands',
    desc: '提出结构化需求，获得确定性匹配',
  },
  {
    label: '供应能力',
    href: '/register?role=SUPPLIER',
    guestHref: '/register?role=SUPPLIER',
    authHref: '/workspace/supplier/offers',
    desc: '发布您的检测能力与服务',
  },
];

/** 解析导航项 href：任务类入口按登录态路由，其余走静态公开页。 */
function resolveEntryHref(it: NavEntry, isAuthenticated: boolean): string {
  if (it.guestHref || it.authHref) {
    return (isAuthenticated && it.authHref ? it.authHref : it.guestHref) ?? it.href;
  }
  return it.href;
}

/** 任务类入口的描述随登录态自述，保持「注册 xxx」与跳转工作区文案一致。 */
function resolveEntryDesc(it: NavEntry, isAuthenticated: boolean): string {
  if (it.guestHref || it.authHref) {
    return isAuthenticated ? (it.desc ?? '') : `${it.desc ?? ''}（新用户将引导注册对应角色账号）`;
  }
  return '';
}

/** 单级导航高亮：按条目实际可达路径前缀匹配当前路由。 */
function isEntryActive(it: NavEntry, pathname: string): boolean {
  const path = it.guestHref || it.authHref ? (it.authHref || it.guestHref || it.href) : it.href;
  const p = path.split('?')[0];
  if (p === '/') return pathname === '/';
  return !!p && pathname.startsWith(p);
}

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isStrictMobile, setIsStrictMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // WP-3A.1 — 移动菜单复用 Foundation Drawer：<640px 底部抽屉，≥sm 右侧抽屉（§9.2）。
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => setIsStrictMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Drawer 打开时锁定 body 滚动（移动导航覆盖内容的可访问体验）。
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  };

  // 顶部登录/注册（或已登录用户态）块，供桌面与移动端内联复用
  const authBlock = isLoading ? (
    <div className="flex items-center gap-3 flex-shrink-0">
      <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
    </div>
  ) : isAuthenticated && user ? (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-blueprint bg-blueprint-graphite px-4 py-2 text-sm font-semibold text-blueprint-paper border border-blueprint-line-dark hover:bg-blueprint-ink transition-colors"
      >
        工作台
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-blueprint-ink hover:text-foreground hover:bg-blueprint-line/40 rounded-blueprint transition-colors"
          aria-label="用户菜单"
        >
          <span className="w-7 h-7 bg-blueprint-amber text-blueprint-graphite rounded-full flex items-center justify-center text-xs font-bold">
            {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
          </span>
          <span className="max-w-[110px] truncate hidden lg:inline">{user.name || user.email}</span>
          <svg
            className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-industrial-lg py-1 z-20">
              <div className="px-4 py-2 text-xs text-slate-400 truncate border-b border-slate-100">
                {user.email}
              </div>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                退出登录
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Link
        href="/login"
        className="text-sm font-medium text-blueprint-ink-soft hover:text-blueprint-ink transition-colors px-3 py-2"
      >
        登录
      </Link>
      <Link
        href="/register"
        className="text-sm font-semibold rounded-blueprint bg-blueprint-graphite text-blueprint-paper px-5 py-2.5 border border-blueprint-line-dark hover:bg-blueprint-ink transition-colors"
      >
        注册
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-blueprint-paper/95 backdrop-blur-sm border-b border-blueprint-line">
      <div className="w-full">
        {/* ===== TOP BAR（上层，粘性）：Logo · 搜索 · 登录/注册 · 汉堡 ===== */}
        <div className="border-b border-blueprint-line">
          <div className="max-w-[1200px] mx-auto flex h-16 items-center justify-between gap-2 px-4 sm:px-6">
            {/* Logo — platform identity（工业蓝图 mark，照搬设计稿） */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <svg className="w-[30px] h-[30px] shrink-0" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="28" height="28" stroke="#20242A" strokeWidth="1.4" />
                <circle cx="15" cy="15" r="6" stroke="#CE8A2E" strokeWidth="1.4" />
                <line x1="15" y1="1" x2="15" y2="7" stroke="#20242A" strokeWidth="1.2" />
                <line x1="15" y1="23" x2="15" y2="29" stroke="#20242A" strokeWidth="1.2" />
                <line x1="1" y1="15" x2="7" y2="15" stroke="#20242A" strokeWidth="1.2" />
                <line x1="23" y1="15" x2="29" y2="15" stroke="#20242A" strokeWidth="1.2" />
              </svg>
              <span className="text-[19px] font-bold tracking-tight text-blueprint-ink">
                VIS<span className="text-blueprint-amber-deep">NDT</span>
              </span>
              <span className="hidden lg:inline-flex flex-col leading-none">
                <span className="text-xs text-blueprint-ink font-semibold tracking-wide">工业检测能力发现平台</span>
                <span className="text-[10px] text-blueprint-ink-soft tracking-widest mt-0.5">能力发现平台</span>
              </span>
            </Link>

            {/* 桌面/平板内联搜索（lg+） — 812 Batch B: 纯关键字入口 */}
            <div className="hidden lg:flex flex-1 min-w-0 max-w-xl mx-2 justify-center">
              <div className="w-full max-w-lg">
                <GlobalSearchBar showTypeSelector={false} />
              </div>
            </div>

            {/* 移动端搜索切换（<lg）：两种可访问语义（打开时为关闭） */}
            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={mobileSearchOpen ? '关闭搜索' : '打开搜索'}
              aria-expanded={mobileSearchOpen}
            >
              {mobileSearchOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              )}
            </button>

            {/* 登录/注册（sm+ 内联置顶；<sm 收进抽屉，保持同步结构） */}
            <div className="hidden sm:flex items-center">
              {authBlock}
            </div>

            {/* 导航汉堡（xl:hidden，导航行仅在 xl+ 内联展示） */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="xl:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="切换菜单"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ===== 移动端展开的搜索行（<lg 且打开时，仍随 sticky 头部显示） ===== */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-b border-blueprint-line px-4 sm:px-6 py-2.5">
            <GlobalSearchBar showTypeSelector={false} />
          </div>
        )}

        {/* ===== NAV BAR（专门导航栏，粘性；蓝图深色独立条带，单级平铺，xl+ 内联，其余进抽屉） ===== */}
        <nav className="hidden xl:block bg-blueprint-graphite text-blueprint-paper" aria-label="平台导航">
          <div className="max-w-[1200px] mx-auto flex items-center gap-1 px-6 py-1.5">
            {NAV_ENTRIES.map((it) => {
              const href = resolveEntryHref(it, isAuthenticated);
              const active = isEntryActive(it, pathname);
              return (
                <Link
                  key={it.label}
                  href={href}
                  className={`relative flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium rounded-blueprint transition-colors ${
                    active ? 'text-white' : 'text-blueprint-paper/80 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {it.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blueprint-amber rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile / Tablet Nav — WP-3A.1 复用 Foundation Drawer（§9.2 §17）：
          <640px 底部抽屉，≥sm 右侧抽屉；Dialog 语义 + Escape + 焦点返回 + body 滚动锁定。 */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="菜单"
        placement={isStrictMobile ? 'bottom' : 'right'}
        headerFooter
      >
        {/* Mobile Search — 812 Batch B: header pure entry point, no type selector */}
        <div className="pb-3 mb-3 border-b border-border">
          <GlobalSearchBar showTypeSelector={false} />
        </div>
        <nav aria-label="平台导航（移动）">
          <div className="space-y-0.5">
            {NAV_ENTRIES.map((it) => {
              const href = resolveEntryHref(it, isAuthenticated);
              const active = isEntryActive(it, pathname);
              return (
                <Link
                  key={it.label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-blueprint px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blueprint-amber/10 text-blueprint-amber-deep'
                      : 'text-blueprint-ink hover:bg-blueprint-line/40'
                  }`}
                >
                  {it.label}
                  {it.guestHref || it.authHref ? (
                    <span className="block text-xs font-normal text-blueprint-ink-soft mt-0.5">
                      {resolveEntryDesc(it, isAuthenticated)}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-border pt-4 mt-3 flex gap-3">
          {isLoading ? (
            <div className="flex-1 h-10 bg-slate-100 rounded-blueprint animate-pulse" />
          ) : isAuthenticated && user ? (
            <>
              <div className="flex-1 text-center text-sm font-medium text-blueprint-ink py-2.5 rounded-blueprint border border-blueprint-line bg-blueprint-paper truncate px-2">
                {user.name || user.email}
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium rounded-blueprint bg-blueprint-graphite text-blueprint-paper py-2.5 border border-blueprint-line-dark hover:bg-blueprint-ink transition-colors"
              >
                工作台
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="flex-1 text-center text-sm font-medium text-red-600 py-2.5 rounded-blueprint border border-red-200 hover:bg-red-50 transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium text-blueprint-ink-soft hover:text-blueprint-ink py-2.5 rounded-blueprint border border-blueprint-line transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium rounded-blueprint bg-blueprint-graphite text-blueprint-paper py-2.5 border border-blueprint-line-dark hover:bg-blueprint-ink transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </Drawer>
    </header>
  );
}
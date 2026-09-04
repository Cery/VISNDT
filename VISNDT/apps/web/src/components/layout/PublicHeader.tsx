'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/auth/AuthProvider';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';

// 800_M39 Whole-site frontend platformization — Global Navigation reconstruction.
// 目标：VISNDT = Industrial Inspection Capability Discovery Platform（工业检测能力发现平台），
// 而非 Manufacturer Corporate Website（厂商企业官网）。
// 导航从扁平企业菜单重构为「平台层（Platform Layer）」分组 mega-navigation：
//   发现(Discover) / 评估(Evaluate) / 技术内容(Technical Content) / 连接(Connect)
// 路由语义、API、RBAC、断点（797:xinline nav / lg search / md auth / 底部抽屉）全保持。
interface LayerItem {
  href: string;
  label: string;
  desc: string;
}

interface PlatformLayer {
  key: string;
  label: string;
  items: LayerItem[];
}

const PLATFORM_LAYERS: PlatformLayer[] = [
  {
    key: 'discover',
    label: '发现',
    items: [
      { href: '/search', label: '统一检索', desc: '一条路径检索能力、产品、知识、方案' },
      { href: '/categories', label: '能力分类', desc: '按检测对象与应用场景浏览能力' },
      { href: '/search?type=supplier-product', label: '能力型号 / 供应商', desc: '浏览能力提供商与供应型号' },
    ],
  },
  {
    key: 'evaluate',
    label: '评估',
    items: [
      { href: '/products', label: '检测产品', desc: '产品注册表：能力、技术参数、检测对象' },
      { href: '/products/compare', label: '产品对比', desc: '参数级工程评估与横向对比' },
    ],
  },
  {
    key: 'content',
    label: '技术内容',
    items: [
      { href: '/solutions', label: '解决方案', desc: '检测问题 → 所需能力 → 落地产品' },
      { href: '/knowledge-base', label: '知识中心', desc: '工程信息资产、参数解读、应用语境' },
    ],
  },
  {
    key: 'connect',
    label: '连接',
    items: [
      { href: '/register?role=BUYER', label: '发布检测需求', desc: '提出结构化需求，获得确定性匹配' },
      { href: '/business', label: '商务合作', desc: '连接采购方、能力提供商与平台' },
    ],
  },
];

function isLayerActive(layer: PlatformLayer, pathname: string, searchParams: string): boolean {
  return layer.items.some((it) => {
    const [p] = it.href.split('?');
    const q = it.href.split('?')[1] || '';
    if (q && !searchParams.includes(q.split('=')[1])) return false;
    if (p === '/') return pathname === '/';
    return p && pathname.startsWith(p);
  });
}

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openLayer, setOpenLayer] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = typeof window !== 'undefined' ? window.location.search : '';
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-industrial-sm border-b border-slate-100">
      <div className="w-full">
        <div className="max-w-[1200px] mx-auto flex h-[4.5rem] items-center justify-between px-6 gap-4">
          {/* Logo — platform identity */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-xl font-bold font-mono tracking-tight">
              <span className="text-foreground">VIS</span>
              <span className="bg-gradient-to-r from-primary to-industrial-cyan bg-clip-text text-transparent">NDT</span>
            </span>
            <span className="hidden lg:inline-flex flex-col leading-none">
              <span className="text-xs text-slate-800 font-semibold tracking-wide">工业检测能力发现平台</span>
              <span className="text-[10px] text-slate-400 tracking-widest mt-0.5">CAPABILITY DISCOVERY</span>
            </span>
          </Link>

          {/* Desktop Platform-Layer Nav (xl+, per 797 breakpoint) */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="平台导航">
            {PLATFORM_LAYERS.map((layer) => {
              const active = isLayerActive(layer, pathname, searchParams);
              return (
                <div
                  key={layer.key}
                  className="relative"
                  onMouseEnter={() => setOpenLayer(layer.key)}
                  onMouseLeave={() => setOpenLayer(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenLayer(openLayer === layer.key ? null : layer.key)}
                    className={`relative flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
                    }`}
                    aria-expanded={openLayer === layer.key}
                  >
                    {layer.label}
                    <svg className={`w-3.5 h-3.5 transition-transform ${openLayer === layer.key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />}
                  </button>

                  {/* Mega panel */}
                  {openLayer === layer.key && (
                    <>
                      <div className="fixed inset-0 -z-10" onClick={() => setOpenLayer(null)} />
                      <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-slate-200 rounded-xl shadow-industrial-lg p-2 z-20">
                        <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          {layer.label}
                        </div>
                        {layer.items.map((it) => {
                          const [p] = it.href.split('?');
                          const itemActive = p === '/' ? pathname === '/' : p && pathname.startsWith(p);
                          return (
                            <Link
                              key={it.href}
                              href={it.href}
                              onClick={() => setOpenLayer(null)}
                              className={`flex flex-col gap-0.5 rounded-lg px-3 py-2 transition-colors ${
                                itemActive ? 'bg-primary/5' : 'hover:bg-slate-50'
                              }`}
                            >
                              <span className={`text-sm font-medium ${itemActive ? 'text-primary' : 'text-foreground'}`}>
                                {it.label}
                              </span>
                              <span className="text-xs text-slate-500 leading-snug">{it.desc}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Search Bar — 812 Batch B: header is a pure entry point; remove redundant
              type selector so it always emits /search?q=... and /search stays the sole authority. */}
          <div className="hidden lg:flex flex-1 min-w-[220px] max-w-xl mx-2">
            <GlobalSearchBar showTypeSelector={false} />
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isLoading ? (
              <div className="w-20 h-8 bg-slate-100 rounded-lg animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-industrial-cyan px-4 py-2 text-sm font-semibold text-white shadow-industrial-sm hover:opacity-90 transition-opacity"
                >
                  工作台
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-700 hover:text-foreground hover:bg-slate-50 rounded-lg transition-colors"
                    aria-label="用户菜单"
                  >
                    <span className="w-7 h-7 bg-gradient-to-r from-primary to-industrial-cyan rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </span>
                    <span className="max-w-[120px] truncate hidden lg:inline">{user.name || user.email}</span>
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
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-gradient-to-r from-primary to-industrial-cyan text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-industrial-sm"
                >
                  注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger (xl lint, complements 797 breakpoint) */}
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

      {/* Mobile / Tablet Drawer — grouped platform layers */}
      {mobileOpen && (
        <div className="xl:hidden border-t bg-white/95 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-6 py-3 space-y-3">
            {/* Mobile Search — 812 Batch B: header entry point, no type selector */}
            <div className="pb-3 border-b border-slate-100">
              <GlobalSearchBar showTypeSelector={false} />
            </div>
            <nav className="space-y-4" aria-label="平台导航（移动）">
              {PLATFORM_LAYERS.map((layer) => (
                <div key={layer.key}>
                  <div className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                    {layer.label}
                  </div>
                  <div className="space-y-0.5">
                    {layer.items.map((it) => {
                      const [p] = it.href.split('?');
                      const active = p === '/' ? pathname === '/' : p && pathname.startsWith(p);
                      return (
                        <Link
                          key={it.href}
                          href={it.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            active
                              ? 'bg-primary/5 text-primary'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {it.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-3 flex gap-3">
                {isLoading ? (
                  <div className="flex-1 h-10 bg-slate-100 rounded-lg animate-pulse" />
                ) : isAuthenticated && user ? (
                  <>
                    <div className="flex-1 text-center text-sm font-medium text-slate-700 py-2.5 rounded-lg border bg-slate-50 truncate px-2">
                      {user.name || user.email}
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center text-sm font-medium bg-gradient-to-r from-primary to-industrial-cyan text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      工作台
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="flex-1 text-center text-sm font-medium text-red-600 py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      退出
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center text-sm font-medium text-muted-foreground hover:text-foreground py-2.5 rounded-lg border transition-colors"
                    >
                      登录
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center text-sm font-medium bg-gradient-to-r from-primary to-industrial-cyan text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      注册
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}